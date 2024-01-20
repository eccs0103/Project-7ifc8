"use strict";

import { NotationProgenitor } from "./Modules/Storage.js";
import { } from "./Modules/Extensions.js";
import { Locker } from "./Modules/Database.js";

//#region Metadata
const developer = document.getElement(HTMLMetaElement, `meta[name="author"]`).content;
const title = document.getElement(HTMLMetaElement, `meta[name="application-name"]`).content;
//#endregion

/** @type {Locker<File[]>} */ const lockerRecentFiles = new Locker(developer, title, `Recent Files`);
window.addEventListener(`beforeunload`, async (event) => {
	await lockerRecentFiles.set(listRecentFiles);
});

const listRecentFiles = await lockerRecentFiles.get() ?? [];

/**
 * @param {string} input 
 */
const decrypt = (input) => {
	const code = input.replace(/\\u00([0-9a-f]{2})/g, `%$1`);
	try {
		return decodeURIComponent(code);
	} catch (error) {
		window.prevent(document.analysis(error), false);
		return code;
	}
};

//#region Participant
class Participant extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Participant}
	 */
	static import(source) {
		const result = new Participant();
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const name = Reflect.get(source, `name`);
		if (!(typeof (name) === `string`)) {
			throw new TypeError(`Property name has invalid ${typeof (name)} type`);
		}
		result.#name = decrypt(name);
		return result;
	}
	/** @type {string} */ #name = ``;
	/** @readonly */ get name() {
		return this.#name;
	}
}
//#endregion
//#region Reaction
class Reaction extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Reaction}
	 */
	static import(source) {
		const result = new Reaction();
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const reaction = Reflect.get(source, `reaction`);
		if (!(typeof (reaction) === `string`)) {
			throw new TypeError(`Property reaction has invalid ${typeof (reaction)} type`);
		}
		result.#reaction = decrypt(reaction);
		const actor = Reflect.get(source, `actor`);
		if (!(typeof (actor) === `string`)) {
			throw new TypeError(`Property actor has invalid ${typeof (actor)} type`);
		}
		result.#actor = decrypt(actor);
		return result;
	}
	/** @type {string} */ #reaction = ``;
	/** @readonly */ get reaction() {
		return this.#reaction;
	}
	/** @type {string} */ #actor = ``;
	/** @readonly */ get actor() {
		return this.#actor;
	}
}
//#endregion
//#region Share
class Share extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Share}
	 */
	static import(source) {
		const result = new Share();
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const link = Reflect.get(source, `link`);
		if (!(typeof (link) === `string`)) {
			throw new TypeError(`Property link has invalid ${typeof (link)} type`);
		}
		result.#link = link;
		return result;
	}
	/** @type {string} */ #link = ``;
	/** @readonly */ get link() {
		return this.#link;
	}
}
//#endregion
//#region Content
class Content extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Content}
	 */
	static import(source) {
		const result = new Content();
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const uri = Reflect.get(source, `uri`);
		if (!(typeof (uri) === `string`)) {
			throw new TypeError(`Property uri has invalid ${typeof (uri)} type`);
		}
		result.#uri = uri;
		const timestamp = Reflect.get(source, `creation_timestamp`);
		if (!(typeof (timestamp) === `number`)) {
			throw new TypeError(`Property timestamp has invalid ${typeof (timestamp)} type`);
		}
		result.#timestamp = new Date(timestamp * 1000);
		return result;
	}
	/** @type {string} */ #uri = ``;
	/** @readonly */ get uri() {
		return this.#uri;
	}
	/** @type {Date} */ #timestamp = new Date();
	/** @readonly */ get timestamp() {
		return this.#timestamp;
	}
}
//#endregion
//#region Message
class Message extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Message}
	 */
	static import(source) {
		const result = new Message();
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const sender = Reflect.get(source, `sender_name`);
		if (!(typeof (sender) === `string`)) {
			throw new TypeError(`Property sender has invalid ${typeof (sender)} type`);
		}
		result.#sender = decrypt(sender);
		const timestamp = Reflect.get(source, `timestamp_ms`);
		if (!(typeof (timestamp) === `number`)) {
			throw new TypeError(`Property timestamp has invalid ${typeof (timestamp)} type`);
		}
		result.#timestamp = new Date(timestamp);
		const content = Reflect.get(source, `content`);
		if (content !== undefined) {
			if (!(typeof (content) === `string`)) {
				throw new TypeError(`Property content has invalid ${typeof (content)} type`);
			}
			result.#content = decrypt(content);
		}
		const callDuration = Reflect.get(source, `call_duration`);
		if (callDuration !== undefined) {
			if (!(typeof (callDuration) === `number`)) {
				throw new TypeError(`Property callDuration has invalid ${typeof (callDuration)} type`);
			}
			result.#callDuration = callDuration;
		}
		const photos = Reflect.get(source, `photos`);
		if (photos !== undefined) {
			if (!(photos instanceof Array)) {
				throw new TypeError(`Property photos has invalid ${(photos)} type`);
			}
			result.#photos = photos.map((photo) => Content.import(photo));
		}
		const audioFiles = Reflect.get(source, `audio_files`);
		if (audioFiles !== undefined) {
			if (!(audioFiles instanceof Array)) {
				throw new TypeError(`Property audioFiles has invalid ${(audioFiles)} type`);
			}
			result.#audioFiles = audioFiles.map((audio) => Content.import(audio));
		}
		const reactions = Reflect.get(source, `reactions`);
		if (reactions !== undefined) {
			if (!(reactions instanceof Array)) {
				throw new TypeError(`Property reactions has invalid ${(reactions)} type`);
			}
			result.#reactions = reactions.map((reaction) => Reaction.import(reaction));
		}
		const isGeoblockedForViewer = Reflect.get(source, `is_geoblocked_for_viewer`);
		if (!(typeof (isGeoblockedForViewer) === `boolean`)) {
			throw new TypeError(`Property isGeoblockedForViewer has invalid ${typeof (isGeoblockedForViewer)} type`);
		}
		result.#isGeoblockedForViewer = isGeoblockedForViewer;
		const share = Reflect.get(source, `share`);
		if (share !== undefined) {
			if (!(typeof (share) === `object`)) {
				throw new TypeError(`Property share has invalid ${typeof (share)} type`);
			}
			result.#share = Share.import(share);
		}
		return result;
	}
	/** @type {string} */ #sender = ``;
	/** @readonly */ get sender() {
		return this.#sender;
	}
	/** @type {Date} */ #timestamp = new Date();
	/** @readonly */ get timestamp() {
		return this.#timestamp;
	}
	/** @type {string?} */ #content = null;
	/** @readonly */ get content() {
		return this.#content;
	}
	/** @type {number?} */ #callDuration = null;
	/** @readonly */ get callDuration() {
		return this.#callDuration;
	}
	/** @type {Content[]} */ #photos = [];
	/** @readonly */ get photos() {
		return this.#photos;
	}
	/** @type {Content[]} */ #audioFiles = [];
	/** @readonly */ get audioFiles() {
		return this.#audioFiles;
	}
	/** @type {Reaction[]} */ #reactions = [];
	/** @readonly */ get reactions() {
		return this.#reactions;
	}
	/** @type {boolean} */ #isGeoblockedForViewer = false;
	/** @readonly */ get isGeoblockedForViewer() {
		return this.#isGeoblockedForViewer;
	}
	/** @type {Share?} */ #share = null;
	/** @readonly */ get share() {
		return this.#share;
	}
}
//#endregion
//#region Chat
class Chat extends NotationProgenitor {
	/**
	 * @param {any} source 
	 * @returns {Chat}
	 */
	static import(source) {
		const result = new Chat();
		if (!(typeof (source) === `object`)) {
			throw new TypeError(`Source has invalid ${typeof (source)} type`);
		}
		const title = Reflect.get(source, `title`);
		if (!(typeof (title) === `string`)) {
			throw new TypeError(`Property title has invalid ${typeof (title)} type`);
		}
		result.#title = decrypt(title);
		const participants = Reflect.get(source, `participants`);
		if (!(participants instanceof Array)) {
			throw new TypeError(`Property participants has invalid ${(participants)} type`);
		}
		result.#participants = participants.map((participant) => Participant.import(participant));
		const messages = Reflect.get(source, `messages`);
		if (!(messages instanceof Array)) {
			throw new TypeError(`Property messages has invalid ${(messages)} type`);
		}
		result.#messages = messages.map((message) => Message.import(message));
		const isStillParticipant = Reflect.get(source, `is_still_participant`);
		if (!(typeof (isStillParticipant) === `boolean`)) {
			throw new TypeError(`Property isStillParticipant has invalid ${typeof (isStillParticipant)} type`);
		}
		result.#isStillParticipant = isStillParticipant;
		const threadPath = Reflect.get(source, `thread_path`);
		if (!(typeof (threadPath) === `string`)) {
			throw new TypeError(`Property threadPath has invalid ${typeof (threadPath)} type`);
		}
		result.#threadPath = threadPath;
		const magicWords = Reflect.get(source, `magic_words`);
		if (!(magicWords instanceof Array)) {
			throw new TypeError(`Property magicWords has invalid ${(magicWords)} type`);
		}
		result.#magicWords = magicWords.map((magicWord) => {
			if (!(typeof (magicWord) === `string`)) {
				throw new TypeError(`Property magicWord has invalid ${typeof (magicWord)} type`);
			}
			return magicWord;
		});
		return result;
	}
	/** @type {string} */ #title = ``;
	/** @readonly */ get title() {
		return this.#title;
	}
	/** @type {Participant[]} */ #participants = [];
	/** @readonly */ get participants() {
		return this.#participants;
	}
	/** @type {Message[]} */ #messages = [];
	/** @readonly */ get messages() {
		return this.#messages;
	}
	/** @type {boolean} */ #isStillParticipant = true;
	/** @readonly */ get isStillParticipant() {
		return this.#isStillParticipant;
	}
	/** @type {string} */ #threadPath = ``;
	/** @readonly */ get threadPath() {
		return this.#threadPath;
	}
	/** @type {string[]} */ #magicWords = [];
	/** @readonly */ get magicWords() {
		return this.#magicWords;
	}
}
//#endregion

export { listRecentFiles, Participant, Reaction, Share, Message, Chat };