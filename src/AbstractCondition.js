// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const NOT_REQUIRED = "Not Required.";

const $OPERATOR = Symbol("operator");
const $VALUE = Symbol("value");

class AbstractCondition {
	constructor(/*field*/) {
		// throw new Error("Does not match condition.");
	}

	static NOT_REQUIRED() {
		return NOT_REQUIRED;
	}

	get operator() {
		return this[$OPERATOR];
	}

	set operator(x) {
		this[$OPERATOR] = x;
	}

	get value() {
		return this[$VALUE];
	}

	set value(x) {
		this[$VALUE] = x;
	}

	get name() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	isOperatorValid(/*op*/) {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	resolve() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	toString() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}
}

module.exports = AbstractCondition;
