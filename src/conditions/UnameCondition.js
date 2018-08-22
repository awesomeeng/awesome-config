// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const AbstractCondition = require("../AbstractCondition");

const uname = OS.type();

class UnameCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field.toLowerCase()!=="uname" && field.toLowerCase()!=="type") throw new Error("Does not match condition.");
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

		if (value==="*") answer = true;
		else if (operator==="=" || operator==="==" || operator==="===") answer = value===uname;
		else if (operator==="^") answer = uname.startsWith(value);
		else if (operator==="$") answer = uname.endsWith(value);
		else if (operator==="~") answer = uname.indexOf(value)>-1;
		else throw new Error("Invalid operator.");

		return invert ? !answer : answer;
	}

	toString() {
		return "uname"+this.operator+this.value;
	}
}

module.exports = UnameCondition;
