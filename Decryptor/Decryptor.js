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
		const hr = fragment.appendChild(document.createElement(`hr`));
		hr.classList.add(`layer`);
		//#endregion
		//#region Messages
		for (const message of chat.messages.sort((current, next) => +current.timestamp - +next.timestamp)) {
			const divMessage = fragment.appendChild(document.createElement(`div`));
			divMessage.classList.add(`-message`, `layer`, `rounded`, `with-padding`, `flex`, `column`);
			divMessage.classList.toggle(`-owner`, owner.name === message.sender);

			//#region External
			const divExternal = divMessage.appendChild(document.createElement(`div`));
			divExternal.classList.add(`-external`, `flex`);
			//#region Link
			if (message.share !== null) {
				const aLink = divExternal.appendChild(document.createElement(`a`));
				aLink.classList.add(`depth`, `highlight-background`, `rounded`, `with-padding`, `flex`, `secondary-centered`);
				const link = message.share.link;
				aLink.href = link;
				aLink.addEventListener(`click`, async (event) => {
					event.preventDefault();
					if (await window.confirmAsync(`Follow the link?\n${link}`)) {
						window.open(link, '_blank')?.focus();
					}
				});
				const imgIcon = aLink.appendChild(document.createElement(`img`));
				imgIcon.classList.add(`icon`);
				imgIcon.alt = `Link`;
				imgIcon.src = `../Resources/Link.png`;
			}
			//#endregion
			//#region Photos
			for (const photo of message.photos) {
				const aLink = divExternal.appendChild(document.createElement(`a`));
				aLink.classList.add(`depth`, `highlight-background`, `rounded`, `with-padding`, `flex`, `secondary-centered`);
				const link = photo.uri;
				aLink.href = link;
				aLink.addEventListener(`click`, async (event) => {
					event.preventDefault();
					if (await window.confirmAsync(`Follow the link?\n${link}`)) {
						window.open(link, '_blank')?.focus();
					}
				});
				const imgIcon = aLink.appendChild(document.createElement(`img`));
				imgIcon.classList.add(`icon`);
				imgIcon.alt = `Photo`;
				imgIcon.src = `../Resources/Image.png`;
			}
			//#endregion
			//#region Photos
			for (const audio of message.audioFiles) {
				const aLink = divExternal.appendChild(document.createElement(`a`));
				aLink.classList.add(`depth`, `highlight-background`, `rounded`, `with-padding`, `flex`, `secondary-centered`);
				const link = audio.uri;
				aLink.href = link;
				aLink.addEventListener(`click`, async (event) => {
					event.preventDefault();
					if (await window.confirmAsync(`Follow the link?\n${link}`)) {
						window.open(link, '_blank')?.focus();
					}
				});
				const imgIcon = aLink.appendChild(document.createElement(`img`));
				imgIcon.classList.add(`icon`);
				imgIcon.alt = `Voice`;
				imgIcon.src = `../Resources/Image.png`;
			}
			//#endregion
			//#endregion
			//#region Content
			if (message.content !== null) {
				const spanContent = divMessage.appendChild(document.createElement(`span`));
				spanContent.textContent = message.content;
				/* if (message.callDuration !== null) {
					spanContent.textContent += `\n${message.callDuration} секунд`;
				} */
			}
			//#endregion
			//#region Line
			const hr = divMessage.appendChild(document.createElement(`hr`));
			hr.classList.add(`depth`);
			//#endregion
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
		const last = listRecentFiles[0];
		if (last !== undefined) {
			const chat = Chat.import(JSON.parse((await last.text()).replace(/\\u/g, `\\\\u`)));
			await window.load(build(chat), 200, 600);
		}
	}

	await load();
	inputReader.addEventListener(`click`, (event) => {
		inputReader.value = ``;
	});
	inputReader.addEventListener(`change`, async (event) => {
		const files = inputReader.files;
		if (files === null) throw new ReferenceError(`File list doesn't exist`);
		const file = files[0];
		if (file) {
			listRecentFiles.unshift(file);
			await load();
		}
	});
	//#endregion
} catch (error) {
	await window.prevent(document.analysis(error));
}