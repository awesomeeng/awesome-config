// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $OPTIONS = Symbol("options");

class AbstractParser {
	constructor(options) {
		this[$OPTIONS] = Object.assign({},options);
	}

	get options() {
		return this[$OPTIONS];
	}

	parse(/*content*/) {
		throw new Error("Not implemented. AbstractParser sub-classes must implement.");
	}
}

module.exports = AbstractParser;
