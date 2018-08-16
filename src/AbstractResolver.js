// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $OPTIONS = Symbol("options");

class AbstractResolver {
	constructor(options) {
		this[$OPTIONS] = Object.assign({},options);
	}

	get options() {
		return this[$OPTIONS];
	}

	resolve(/*config*/) {
		throw new Error("Not implemented. AbstractResolver sub-classes must implement.");
	}
}

module.exports = AbstractResolver;
