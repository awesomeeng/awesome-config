// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const ConfigConditionParser = require("./ConfigConditionParser");

const parser = new ConfigConditionParser();

class AbstractCondition {
	constructor() {

	}

	matches() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	toString() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	static parse(s) {
		if (!s) return [];
		if (typeof s!=="string") throw new Error("Invalid conditions.");

		s = s.trim();
		if (s==="") return [];

		return parser.parse(s);
	}
}


module.exports = AbstractCondition;
