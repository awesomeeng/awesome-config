// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const AbstractCondition = require("../AbstractCondition");

const hostname = OS.hostname();

class OSCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field.toLowerCase()!=="hostname") throw new Error("Does not match condition.");
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

		if (operator==="=" || operator==="==" || operator==="===") answer = value===hostname;
		else if (operator==="^") answer = hostname.startsWith(value);
		else if (operator==="$") answer = hostname.endsWith(value);
		else if (operator==="~") answer = hostname.indexOf(value)>-1;
		else throw new Error("Invalid operator.");

		return invert ? !answer : answer;
	}

	toString() {
		return "hostname"+this.operator+this.value;
	}
}

module.exports = OSCondition;
