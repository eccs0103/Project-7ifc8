"use strict";

import { Chat, listRecentFiles } from "../Scripts/Structure.js";

try {
	//#region Definition
	const inputReader = document.getElement(HTMLInputElement, `input#reader`);
	const divContainer = document.getElement(HTMLDivElement, `div#container`);
	//#endregion
	//#region Build
	/**
	 * @param {Chat} chat 
	 */
	async function build(chat) {
		const owner = chat.participants[chat.participants.length - 1];

		const fragment = document.createDocumentFragment();
		//#region Title
		const h1Title = fragment.appendChild(document.createElement(`h1`));
		h1Title.classList.add(`-title`);
		h1Title.textContent = chat.title;
		//#endregion
		const hr = fragment.appendChild(document.createElement(`hr`));
		hr.classList.add(`layer`);
		//#region Messages
		for (const message of chat.messages.sort((current, next) => +current.timestamp - +next.timestamp)) {
			const divMessage = fragment.appendChild(document.createElement(`div`));
			divMessage.classList.add(`-message`, `layer`, `rounded`, `with-padding`, `flex`, `column`);
			divMessage.classList.toggle(`-owner`, owner.name === message.sender);
			const spanContext = divMessage.appendChild(document.createElement(`span`));
			spanContext.textContent = message.content;
			const hr = divMessage.appendChild(document.createElement(`hr`));
			hr.classList.add(`depth`);
			//#region Details
			const divDetails = divMessage.appendChild(document.createElement(`div`));
			divDetails.classList.add(`-details`, `flex`, `with-gap`);
			const time = divDetails.appendChild(document.createElement(`time`));
			time.dateTime = message.timestamp.toISOString();
			time.textContent = message.timestamp.toLocaleString();
			//#region Reactions
			const spanReactions = divDetails.appendChild(document.createElement(`span`));
			spanReactions.classList.add(`-reactions`, `depth`, `rounded`, `flex`);
			for (const reaction of message.reactions) {
				const spanReaction = spanReactions.appendChild(document.createElement(`span`));
				spanReaction.classList.add(`-reaction`, `flex`);
				spanReaction.textContent = reaction.reaction;
				/* if (reaction.actor === message.sender) {
					spanReaction.textContent += reaction.actor;
				} */
			}
			//#endregion
			//#endregion
		}
		//#endregion

		divContainer.replaceChildren(fragment);
	}

	async function load() {
		window.load(new Promise(async (resolve) => {
			const last = listRecentFiles[0];
			if (last !== undefined) {
				const chat = Chat.import(JSON.parse((await last.text()).replace(/\\u/g, `\\\\u`)));
				await build(chat);
				resolve(null);
			}
		}), 200, 500);
	}

	load();
	inputReader.addEventListener(`click`, (event) => {
		inputReader.value = ``;
	});
	inputReader.addEventListener(`change`, async (event) => {
		const files = inputReader.files;
		if (files === null) throw new ReferenceError(`File list doesn't exist`);
		const file = files[0];
		if (file) {
			listRecentFiles.unshift(file);
			load();
		}
	});
	//#endregion
} catch (error) {
	await window.prevent(document.analysis(error));
}