// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

const $EXPRESSION = Symbol("expression");

/**
 * A conitino that groups other conditions into a cohesive set.
 *
 * @extends AbstractCondition
 */
class GroupCondition extends AbstractCondition {
	/**
	 * Create a group condition from a set of other conditions.
	 *
	 * @param {string} expression
	 */
	constructor(expression) {
		super();
		if (!expression || !(expression instanceof AbstractCondition)) throw new Error("Invalid expression expression.");

		this[$EXPRESSION] = expression;
	}

	/**
	 * Returns the inner condition of this group condition.
	 *
	 * @return {string}
	 */
	get expression() {
		return this[$EXPRESSION];
	}

	get operator() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get value() {
		return AbstractCondition.NOT_REQUIRED;
	}

	get name() {
		return "Group";
	}

	isOperatorValid() {
		throw new Error("No operator required.");
	}

	resolve() {
		return this.expression.resolve();
	}

	toString() {
		return "("+this.expression.toString()+")";
	}
}

module.exports = GroupCondition;
