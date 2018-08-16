// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

class AbstractCondition {
	constructor() {

	}

	matches() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	toString() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}
}

module.exports = AbstractCondition;
