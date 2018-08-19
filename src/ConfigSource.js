// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Lodash = require("lodash");

const AbstractCondition = require("./AbstractCondition");

const $ORIGIN = Symbol("origin");
const $CONTENT = Symbol("content");
const $CONDITIONS = Symbol("conditions");

class ConfigSource {
	constructor(origin,content,conditions) {
		if (!origin) throw new Error("Missing origin.");
		if (typeof origin!=="string") throw new Error("Invalid origin.");
		if (!content) throw new Error("Missing content.");
		if (typeof content!=="object" || content instanceof Date || content instanceof RegExp || content instanceof Function) throw new Error("Invalid content.");
		if (conditions===undefined || conditions===null) throw new Error("Missing conditions.");
		if (typeof conditions!=="string") throw new Error("Invalid conditions.");

		conditions = AbstractCondition.parse(conditions);

		this[$ORIGIN] = origin;
		this[$CONTENT] = content;
		this[$CONDITIONS] = conditions;
	}

	get origin() {
		return this[$ORIGIN];
	}

	get content() {
		return this[$CONTENT];
	}

	get conditions() {
		return this[$CONDITIONS];
	}

	matches() {
		return true;
	}
}

module.exports = ConfigSource;
