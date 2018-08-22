// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const AbstractCondition = require("../AbstractCondition");

const cpus = OS.cpus().length;

class MachineCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field.toLowerCase()!=="cpus" && field.toLowerCase()!=="cpu" && field.toLowerCase()!=="cpucount") throw new Error("Does not match condition.");
	}

	get name() {
		return "Machine";
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
		else if (operator==="=" || operator==="==" || operator==="===") answer = value===cpus;
		else if (operator===">") answer = cpus>value;
		else if (operator===">=") answer = cpus>=value;
		else if (operator==="<") answer = cpus<value;
		else if (operator==="<=") answer = cpus<=value;
		else throw new Error("Invalid operator.");

		return invert ? !answer : answer;
	}

	toString() {
		return "cpus"+this.operator+this.value;
	}
}

module.exports = MachineCondition;
