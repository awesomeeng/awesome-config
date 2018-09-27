// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

/**
 * @private
 * @extends AbstractCondition
 */
class TrueCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field && typeof field==="string" && field.toLowerCase()!=="false") throw new Error("Does not match condition.");
	}

	get operator() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get value() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get name() {
		return "False";
	}

	isOperatorValid() {
		throw new Error("No operator required.");
	}

	resolve() {
		return false;
	}

	toString() {
		return "false";
	}
}

module.exports = TrueCondition;
