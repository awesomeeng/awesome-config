// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

const $CONDITION = Symbol("condition");

/**
 * represents a NOT condition that has a left side, which is a
 * conditions in its own right. In order for a NOT condition to be true
 * the left condition must be false.
 *
 * @extends AbstractCondition
 */
class NotCondition extends AbstractCondition {
	/**
	 * Creates a new NOT condition.
	 *
	 * @param {AbstractCondition} condition
	 */
	constructor(condition) {
		super();
		if (!condition || !(condition instanceof AbstractCondition)) throw new Error("Invalid condition.");

		this[$CONDITION] = condition;
	}

	/**
	 * Returns the inner condition of this NOT condition.
	 *
	 * @return {AbstractCondition} 
	 */
	get condition() {
		return this[$CONDITION];
	}

	get operator() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get value() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get name() {
		return "Not";
	}

	isOperatorValid() {
		throw new Error("No operator required.");
	}

	resolve() {
		return !this.condition.resolve();
	}

	toString() {
		return "not("+this.condition.toString()+")";
	}
}

module.exports = NotCondition;
