// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const AbstractCondition = require("../AbstractCondition");

const arch = OS.arch();

class ArchCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field.toLowerCase()!=="arch") throw new Error("Does not match condition.");
	}

	get name() {
		return "OS";
	}

	isOperatorValid(op) {
		return op==="=" || op==="==" || op==="===" || op==="!=" || op==="!==";
	}

	resolve() {
		if (!this.isOperatorValid(this.operator)) throw new Error("Invalid operator.");
		let invert = (this.operator==="!=" || this.operator==="!==");
		let answer = false;
		let value = this.value.toLowerCase();
		switch (value) {
			case "*":
			case "any": {
				answer = true;
				break;
			}

			case "arm": {
				answer = arch==="arm";
				break;
			}
			case "arm64": {
				answer = arch==="arm64";
				break;
			}
			case "ia32": {
				answer = arch==="ia32";
				break;
			}
			case "mips": {
				answer = arch==="mips";
				break;
			}
			case "mipsel": {
				answer = arch==="mipsel";
				break;
			}
			case "ppc": {
				answer = arch==="ppc";
				break;
			}
			case "ppc64": {
				answer = arch==="ppc64";
				break;
			}
			case "s390": {
				answer = arch==="s390";
				break;
			}
			case "s390x": {
				answer = arch==="s390x";
				break;
			}
			case "x32": {
				answer = arch==="x32";
				break;
			}
			case "x64": {
				answer = arch==="x64";
				break;
			}
			case "32": {
				answer = arch==="arm" || arch==="ia32" || arch==="mips" || arch==="ppc" || arch==="s390" || arch==="x32";
				break;
			}
			case "64": {
				answer = arch==="arm64" || arch==="mipsel" || arch==="ppc64" || arch==="s390x" || arch==="x64";
				break;
			}
		}

		return invert ? !answer : answer;
	}

	toString() {
		return "Arch"+this.operator+this.value;
	}
}

module.exports = ArchCondition;
