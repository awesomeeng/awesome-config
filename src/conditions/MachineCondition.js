// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const AbstractCondition = require("../AbstractCondition");

const machine = OS.hostname().split(".")[0] || OS.hostname();

class MachineCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field.toLowerCase()!=="machine" && field.toLowerCase()!=="server") throw new Error("Does not match condition.");
	}

	get name() {
		return "Machine";
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
		else if (operator==="=" || operator==="==" || operator==="===") answer = value===machine;
		else if (operator==="^") answer = machine.startsWith(value);
		else if (operator==="$") answer = machine.endsWith(value);
		else if (operator==="~") answer = machine.indexOf(value)>-1;
		else throw new Error("Invalid operator.");

		return invert ? !answer : answer;
	}

	toString() {
		return "machine"+this.operator+this.value;
	}
}

module.exports = MachineCondition;
