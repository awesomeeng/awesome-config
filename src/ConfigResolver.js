// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const SpecialStrings = require("./SpecialStrings");

const $STACK = Symbol("stack");

/**
 * @private
 * 
 * Resolves a configuration for all its variables and placeholders.
 */
class DefaultResolver {
	constructor() {
		this[$STACK] = {};
	}

	resolve(config) {
		this[$STACK] = {};
		let paths = AwesomeUtils.Object.paths(config,null,true);
		paths.forEach(this.resolvePath.bind(this,config));
		this[$STACK] = {};
	}

	resolvePath(config,path) {
		if (this[$STACK][path]) throw new Error("Invalid variable circular reference at '"+path+"'.");
		this[$STACK][path] = true;

		let value = AwesomeUtils.Object.get(config,path);
		if (value!==undefined && value!==null) {
			while (true) {
				if (typeof value!=="string") break;

				let match = value.match(/\$\{([\w\d-_.:$]+)\}/);
				if (!match) break;

				let start = match.index;
				let end = match.index+match[0].length;
				let variable = match[1];

				let replacement = undefined;
				if (variable.includes(':')) replacement = SpecialStrings.resolve(variable);
				else replacement = this.resolvePath(config,variable);
				if (replacement===undefined) throw new Error("Invalid variable assignment '"+variable+"' at '"+path+"'.");

				let resolved;
				if (start===0 && end===value.length) resolved = replacement;
				else resolved = value.slice(0,start)+replacement+value.slice(end);

				if (resolved!==value) {
					AwesomeUtils.Object.set(config,path,resolved);
					value = resolved;
				}
			}
		}

		delete this[$STACK][path];

		let placeholder = typeof value==="string" && value.match(/^<<([^>]+)>>$/) || false;
		if (placeholder) throw new Error("Unfulfilled Placeholder '"+placeholder[1]+"' at '"+path+"'.");

		return value;
	}
}

module.exports = DefaultResolver;
