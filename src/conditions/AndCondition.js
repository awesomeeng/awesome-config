// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

const $LEFT = Symbol("left");
const $RIGHT = Symbol("right");

/**
 * @private
 * 
 * represents an AND condition that has a left and right side, each of which are
 * conditions in their own right. In order for an AND condition to be true
 * both the left and right conditions must also be true.
 *
 * @extends AbstractCondition
 */
class AndCondition extends AbstractCondition {
	/**
	 * Creates a AND condition.
	 *
	 * @param {AbstractCondition} left
	 * @param {AbstractCondition} right
	 */
	constructor(left,right) {
		super();
		if (!left || !(left instanceof AbstractCondition)) throw new Error("Invalid left expression.");
		if (!right || !(right instanceof AbstractCondition)) throw new Error("Invalid right expression.");

		this[$LEFT] = left;
		this[$RIGHT] = right;
	}

	/**
	 * Returns the left condition.
	 *
	 * @return {AbstractCondition}
	 */
	get left() {
		return this[$LEFT];
	}

	/**
	 * Returns the right condition.
	 *
	 * @return {AbstractCondition}
	 */
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
