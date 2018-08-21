// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

const $EXPRESSION = Symbol("expression");

class NotCondition extends AbstractCondition {
	constructor(expression) {
		super();
		if (!expression || !(expression instanceof AbstractCondition)) throw new Error("Invalid expression.");

		this[$EXPRESSION] = expression;
	}

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
		return "Not";
	}

	isOperatorValid() {
		throw new Error("No operator required.");
	}

	resolve() {
		return this.expression.resolve() && this.right.resolve();
	}

	toString() {
		return "not("+this.expression.toString()+")";
	}
}

module.exports = NotCondition;
