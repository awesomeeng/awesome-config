// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

const $LEFT = Symbol("left");
const $RIGHT = Symbol("right");

class AndCondition extends AbstractCondition {
	constructor(left,right) {
		super();
		if (!left || !(left instanceof AbstractCondition)) throw new Error("Invalid left expression.");
		if (!right || !(right instanceof AbstractCondition)) throw new Error("Invalid right expression.");

		this[$LEFT] = left;
		this[$RIGHT] = right;
	}

	get left() {
		return this[$LEFT];
	}

	get right() {
		return this[$RIGHT];
	}

	get operator() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get value() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get name() {
		return "And";
	}

	isOperatorValid() {
		throw new Error("No operator required.");
	}

	resolve() {
		return this.left.resolve() && this.right.resolve();
	}

	toString() {
		return this.left.toString() + " and "+this.right.toString();
	}
}

module.exports = AndCondition;
