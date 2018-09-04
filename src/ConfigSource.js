// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const ConfigConditionParser = require("./ConfigConditionParser");

const $ORIGIN = Symbol("origin");
const $CONTENT = Symbol("content");
const $CONDITIONS = Symbol("conditions");

const ConditionParser = new ConfigConditionParser();

/**
 * A ConfigSource is an object of configuration, limited by one or
 * more conditions, and identified by an origin.
 * If `config().add()` is called with
 * a JavaScript object or JSON string, the origin is the souce file
 * and line number. If a file or directory is used, the origin is
 * the filename.
 *
 */
class ConfigSource {
	/**
	 * Creates a new ConfigSource for the given origin, content and
	 * conditions.
	 *
	 * @param {string} origin
	 * @param {Object} content
	 * @param {string} [conditions=""] 
	 */
	constructor(origin,content,conditions="") {
		if (!origin) throw new Error("Missing origin.");
		if (typeof origin!=="string") throw new Error("Invalid origin.");
		if (!content) throw new Error("Missing content.");
		if (typeof content!=="object" || content instanceof Date || content instanceof RegExp || content instanceof Function) throw new Error("Invalid content.");
		if (conditions===undefined || conditions===null) throw new Error("Missing conditions.");
		if (typeof conditions!=="string") throw new Error("Invalid conditions.");

		conditions = ConfigSource.parseConditions(conditions);

		this[$ORIGIN] = origin;
		this[$CONTENT] = content;
		this[$CONDITIONS] = conditions;
	}

	/**
	 * Returns the origin for this ConfigSource.
	 *
	 * @return {string}
	 */
	get origin() {
		return this[$ORIGIN];
	}

	/**
	 * Returns the content for this ConfigSource. Content is already
	 * parsed, but not resolved.
	 *
	 * @return {Object}
	 */
	get content() {
		return this[$CONTENT];
	}

	/**
	 * Returns the current condtions for this ConfigSource. At
	 * this point the conditions have been parsed to a single
	 * AbstractCondition.
	 *
	 * @return {AbstractCondition}
	 */
	get conditions() {
		return this[$CONDITIONS];
	}

	/**
	 * Returns true of the conditions resolve. See AbstractCondition for
	 * more details.
	 *
	 * @return {boolean}
	 */
	matches() {
		if (!this.conditions || this.conditions.length<1) return true;
		return this.conditions.resolve();
	}

	/**
	 * Utility method for parsing a condition string.
	 *
	 * @param  {string} s
	 * @return {AbstractCondition}
	 */
	static parseConditions(s) {
		if (!s) return null;
		if (typeof s!=="string") throw new Error("Invalid conditions.");

		s = s.trim();
		if (s==="") return null;

		return ConditionParser.parse(s);
	}
}

module.exports = ConfigSource;
