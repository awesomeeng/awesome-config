// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const ConfigSource = require("./ConfigSource");

const $ORIGIN = Symbol("origin");
const $DEFAULT_CONDITIONS = Symbol("defaultConditions");

/**
 * @private
 * 
 * Parser a configuration string using AwesomeConfig's custom config format.
 *
 * Please see (AwesomeConfig's documentation)[https://github.com/awesomeeng/AwesomeConfig]
 * for more details.
 * @extends AwesomeUtils.Parser.AbstractParser
 */
class ConfigParser extends AwesomeUtils.Parser.AbstractParser {
	constructor() {
		super();
		this[$ORIGIN] = null;
		this[$DEFAULT_CONDITIONS] = "";
	}

	get origin() {
		return this[$ORIGIN];
	}

	get defaultConditions() {
		return this[$DEFAULT_CONDITIONS];
	}

	isPathCharacter(c) {
		return this.isLetter(c) || this.isDigit(c) || c==="." || c==="_" || c==="$" || c==="-";
	}

	isQuoteCharacter(c) {
		return c==="\"" || c==="'";
	}

	isAssignmentCharacter(c) {
		return c===":" || c==="=";
	}

	popJSONText() {
		let braces = 0;
		let quoting = null;
		let keystart = false;
		let keyend = false;

		let text = "";
		while (this.pos<this.content.length) {
			let next2 = this.peek(2);
			let next = this.pop();
			if (next===undefined) break;

			if (!quoting && next==="{") {
				braces += 1;
				keystart = true;
			}
			else if (!quoting && next==="}") {
				braces -= 1;
			}
			else if (!quoting && next===",") {
				keystart = true;
			}
			else if (keystart && !this.isSpace(next) && !this.isNewLine(next)) {
				if (!this.isQuoteCharacter(next)) text += "\"";
				keystart = false;
				keyend = true;
			}
			else if (keyend && (this.isSpace(next) || next===":" || next==="\"" || next==="'")) {
				if (!this.isQuoteCharacter(next)) text += "\"";
				keyend = false;
			}
			else if (!quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
			}
			else if (quoting && next===quoting) {
				quoting = null;
			}
			else if (!quoting && next==="{") {
				this.back();
				next = this.popJSONText();
			}
			else if (!quoting && next==="[") {
				this.back();
				next = this.popArrayText();
			}
			else if (!quoting && (next==="#" || next2==="//" || next2==="/*")) {
				this.back();
				this.parseComment();
				next = null;
			}

			if (next) text += next;

			if (braces===0) break;
		}

		return text;
	}

	popArrayText() {
		let brackets = 0;
		let quoting = null;

		let text = "";
		while (this.pos<this.content.length) {
			let next2 = this.peek(2);
			let next = this.pop();
			if (next===undefined) break;

			if (!quoting && next==="[") {
				brackets += 1;
			}
			else if (!quoting && next==="]") {
				brackets -= 1;
			}
			else if (!quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
			}
			else if (quoting && next===quoting) {
				quoting = null;
			}
			else if (!quoting && next==="{") {
				this.back();
				next = this.popJSONText();
			}
			else if (!quoting && next==="[") {
				this.back();
				next = this.popArrayText();
			}
			else if (!quoting && (next==="#" || next2==="//" || next2==="/*")) {
				this.back();
				this.parseComment();
				next = null;
			}

			if (next) text += next;

			if (brackets===0) break;
		}

		return text;
	}

	parseComment() {
		let next2 = this.peek(2);
		let next = this.peek();
		let starting = next==="#" && "#" || next2==="//" && "//" || next2==="/*" && "/*" || null;
		if (!starting) this.error("Expected comment");

		this.pop(starting.length);

		let text = "";
		while (this.pos<this.content.length) {
			next2 = this.peek(2);
			next = this.peek();
			if (next===undefined) break;

			if (starting==="#" && this.isNewLine(next)) {
				this.pop();
				break;
			}
			else if (starting==="//" && this.isNewLine(next)) {
				this.pop();
				break;
			}
			else if (starting==="/*" && next2==="*/") {
				this.pop(2);
				break;
			}
			else {
				text == this.pop();
			}
		}
	}

	parseKeyValue(root) {
		let key = this.parseKey();
		if (!key) this.error("Empty key in key/value.");

		this.popSpace();

		let next = this.peek();
		if (next==="{") {
			let pos = this.pos;
			let json = this.popJSONText();
			try {
				let obj = JSON.parse(json);
				if (obj===undefined || obj===null) obj = null;
				AwesomeUtils.Object.set(root,key,obj);
				if (this.peek()===",") this.pop();
			}
			catch (ex) {
				this.error("JSON parsing error",pos);
			}
		}
		else if (next==="[") {
			let pos = this.pos;
			let json = this.popArrayText();
			try {
				let obj = JSON.parse(json);
				if (obj===undefined || obj===null) obj = null;
				AwesomeUtils.Object.set(root,key,obj);
				if (this.peek()===",") this.pop();
			}
			catch (ex) {
				this.error("JSON parsing error",pos);
			}
		}
		else {
			let value = this.parseValue();
			if (value===undefined) this.error("Empty value in key/value.");

			AwesomeUtils.Object.set(root,key,value);
		}
	}

	parseKey() {
		let key = "";

		let mustBeAssignment = false;
		while (this.pos<this.content.length) {
			let next = this.pop();
			if (next===undefined) break;

			if (!mustBeAssignment && this.isPathCharacter(next)) {
				key += next;
			}
			else if (!mustBeAssignment && this.isSpace()) {
				this.popSpace();
				mustBeAssignment = true;
			}
			else if (this.isAssignmentCharacter(next)) {
				break;
			}
			else {
				this.error("Invalid character '"+next+"' in key/value key."+key);
			}
		}

		return key;
	}

	parseValue() {
		let value = "";
		let quoting = null;
		let quoted = false;

		while (this.pos<this.content.length) {
			let next2 = this.peek(2);
			let next = this.pop();
			if (next===undefined) break;

			if (this.isNewLine(next)) {
				break;
			}
			else if (quoted && !quoting && next!==",") {
				this.error("Invalid characters after quote.");
			}
			else if (!quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
				quoted = true;
			}
			else if (quoting && next===quoting) {
				quoting = null;
			}
			else if (!quoting && (next==="#" || next2==="//" || next2==="/*")) {
				this.back();
				this.parseComment();
				if (next==="#" || next2==="//") break; // comments run to eol, which is end of value for us.
				next = null;
			}

			if (next) value += next;
		}

		if (value.endsWith(",")) value = value.slice(0,-1);
		value = this.transformValue(value);

		return value;
	}

	parseRootJSON(root) {
		let pos = this.pos;
		let json = this.popJSONText();
		try {
			let obj = JSON.parse(json);
			if (obj===undefined || obj===null) return;
			AwesomeUtils.Object.extend(root,obj);
		}
		catch (ex) {
			this.error("JSON parsing error",pos);
		}
	}

	parseRootConditions() {
		let quoting = null;

		this.pop();

		let text = "";
		while (this.pos<this.content.length) {
			let next2 = this.peek(2);
			let next = this.pop();
			if (next===undefined) break;

			if (!quoting && next==="]") {
				break;
			}
			else if (!quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
			}
			else if (quoting && next===quoting) {
				quoting = null;
			}
			else if (!quoting && (next==="#" || next2==="//" || next2==="/*")) {
				this.back();
				this.parseComment();
				next = null;
			}

			if (next) text += next;
		}

		return text || null;
	}

	parseRoot() {
		let root = {};
		let conditions = this.defaultConditions;
		let sources = [];

		while (this.pos<this.content.length) {
			let next2 = this.peek(2);
			let next = this.peek();
			if (next===undefined) break;

			if (this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (next==="#" || next2==="//" || next2==="/*") {
				this.parseComment();
			}
			else if (next==="{") {
				this.parseRootJSON(root);
			}
			else if (next==="[") {
				if (Object.keys(root).length>0) {
					sources.push(new ConfigSource(this.origin,root,conditions||""));
				}
				conditions = this.parseRootConditions() || this.defaultConditions;
				root = {};
			}
			else if (this.isPathCharacter(next)) {
				this.parseKeyValue(root);
			}
		}

		if (Object.keys(root).length>0) {
			sources.push(new ConfigSource(this.origin,root,conditions||""));
		}

		return sources;
	}

	parse(origin,content,defaultConditions=null) {
		super.parse(content);

		this[$ORIGIN] = origin;
		this[$DEFAULT_CONDITIONS] = defaultConditions;

		return this.parseRoot();
	}

	transformValue(value) {
		value = value.trim();

		if (value===null) return null;
		if (value==="null") return null;

		if (value===true) return true;
		if (value===false) return false;
		if (value==="true") return true;
		if (value==="false") return false;

		if (value==="0") return 0;
		if (value.match(/^[+-]?[\d]+$/)) return parseInt(value);
		if (value.match(/^[+-]?[\d]+(\.\d+)$/)) return parseFloat(value);

		if (value.startsWith("\"") && value.endsWith("\"")) return value.slice(1,-1);
		if (value.startsWith("'") && value.endsWith("'")) return value.slice(1,-1);
		return value;
	}

	error(msg,pos=null) {
		try {
			super.error(msg,pos);
		}
		catch (ex) {
			ex.message = ex.message.replace(/Error\sat/,"Error in "+this.origin+" at");
			throw ex;
		}

	}
}

module.exports = ConfigParser;
