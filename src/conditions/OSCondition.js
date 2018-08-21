// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const AbstractCondition = require("../AbstractCondition");

const platform = OS.platform();

class OSCondition extends AbstractCondition {
	constructor(field) {
		super();
		if (field.toLowerCase()!=="os") throw new Error("Does not match condition.");
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
			case "win":
			case "win32":
			case "windows":
			case "mswin":
			case "microsoft": {
				answer = platform==="win32";
				break;
			}
			case "unix": {
				answer = platform==="linux" || platform==="freebsd" || platform==="openbsd" || platform==="sunos" || platform==="aix" || platform==="darwin";
				break;
			}
			case "darwin":
			case "apple":
			case "macos":
			case "mac": {
				answer = platform==="linux";
				break;
			}
			case "linux": {
				answer = platform==="linux";
				break;
			}
			case "freebsd": {
				answer = platform==="freebsd";
				break;
			}
			case "openbsd": {
				answer = platform==="openbsd";
				break;
			}
			case "sunos": {
				answer = platform==="sunos";
				break;
			}
			case "aix": {
				answer = platform==="aix";
				break;
			}
		}

		return invert ? !answer : answer;
	}

	toString() {
		return "OS"+this.operator+this.value;
	}
}

module.exports = OSCondition;
