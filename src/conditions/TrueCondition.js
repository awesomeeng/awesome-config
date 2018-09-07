// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

class TrueCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field && typeof field==="string" && field.toLowerCase()!=="true") throw new Error("Does not match condition.");
	}

	get operator() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get value() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get name() {
		return "True";
	}

	isOperatorValid() {
		throw new Error("No operator required.");
	}

	resolve() {
		return true;
	}

	toString() {
		return "true";
	}
}

module.exports = TrueCondition;
