// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const AbstractCondition = require("../AbstractCondition");


class CWDCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field.toLowerCase()!=="cwd" && field.toLowerCase()!=="currentdir") throw new Error("Does not match condition.");
	}

	get name() {
		return "Hostname";
	}

	isOperatorValid(op) {
		return op==="=" || op==="==" || op==="===" || op==="!=" || op==="!==" || op==="^" || op==="$" || op==="~" || op==="!^" || op==="!$" || op==="!~";
	}

	resolve() {
		if (!this.isOperatorValid(this.operator)) throw new Error("Invalid operator.");

		let operator = this.operator;

		let invert = operator.startsWith("!");
		if (invert) operator = operator.slice(1);

		let answer = false;
		let value = this.value;

		let cwd = process.cwd();

		if (value==="*") answer = true;
		else if (operator==="=" || operator==="==" || operator==="===") answer = value===cwd;
		else if (operator==="^") answer = cwd.startsWith(value);
		else if (operator==="$") answer = cwd.endsWith(value);
		else if (operator==="~") answer = cwd.indexOf(value)>-1;
		else throw new Error("Invalid operator.");

		return invert ? !answer : answer;
	}

	toString() {
		return "cwd"+this.operator+this.value;
	}
}

module.exports = CWDCondition;
