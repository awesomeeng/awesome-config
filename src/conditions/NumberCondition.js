// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AbstractCondition = require("./AbstractCondition");

const $SOURCE = Symbol("source");
const $FIELD = Symbol("field");

class NumberCondition extends AbstractCondition {
	constructor(source,field) {
		super();
		this[$SOURCE] = source;
		this[$FIELD] = field;
	}

	get source() {
		return this[$SOURCE];
	}

	get field() {
		return this[$FIELD];
	}

	isOperatorValid(op) {
		return op==="=" || op==="==" || op==="===" || op==="!=" || op==="!==" || op===">" || op===">=" || op==="<" || op==="<=";
	}

	resolve() {
		if (!this.isOperatorValid(this.operator)) throw new Error("Invalid operator.");

		let operator = this.operator;

		let invert = operator==="!=" || operator==="!==";
		if (invert) operator = operator.slice(1);

		let answer = false;
		let value = parseInt(this.value);

		if (value==="*") answer = true;
		else if (operator==="=" || operator==="==" || operator==="===") answer = value===this.source;
		else if (operator===">") answer = this.source>value;
		else if (operator===">=") answer = this.source>=value;
		else if (operator==="<") answer = this.source<value;
		else if (operator==="<=") answer = this.source<=value;
		else throw new Error("Invalid operator.");

		return invert ? !answer : answer;
	}

	toString() {
		return this.source+this.operator+this.value;
	}
}

module.exports = NumberCondition;
