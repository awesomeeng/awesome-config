// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const ConfigConditionParser = require("./ConfigConditionParser");

const $ORIGIN = Symbol("origin");
const $CONTENT = Symbol("content");
const $CONDITIONS = Symbol("conditions");

const parser = new ConfigConditionParser();

class ConfigSource {
	constructor(origin,content,conditions) {
		if (!origin) throw new Error("Missing origin.");
		if (typeof origin!=="string") throw new Error("Invalid origin.");
		if (!content) throw new Error("Missing content.");
		if (typeof content!=="object" || content instanceof Date || content instanceof RegExp || content instanceof Function) throw new Error("Invalid content.");
		if (conditions===undefined || conditions===null) throw new Error("Missing conditions.");
		if (typeof conditions!=="string") throw new Error("Invalid conditions.");

		conditions = ConfigSource.parseConditions(conditions);

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
		if (!this.conditions || this.conditions.length<1) return true;
		return this.conditions.every((condition)=>{
			return condition.resolve();
		});
	}

	static parseConditions(s) {
		if (!s) return [];
		if (typeof s!=="string") throw new Error("Invalid conditions.");

		s = s.trim();
		if (s==="") return [];

		return parser.parse(s);
	}
}

module.exports = ConfigSource;
