// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Lodash = require("lodash");

const ConfigSource = require("./ConfigSource");

const $ORIGIN = Symbol("origin");
const $CONTENT = Symbol("content");
const $DEFAULT_CONDITIONS = Symbol("defaultConditions");
const $POS = Symbol("pos");

class ConfigParser {
	constructor() {
		this[$ORIGIN] = null;
		this[$CONTENT] = null;
		this[$POS] = 0;
	}

	get origin() {
		return this[$ORIGIN];
	}

	get content() {
		return this[$CONTENT];
	}

	get defaultConditions() {
		return this[$DEFAULT_CONDITIONS];
	}

	get pos() {
		return this[$POS];
	}

	set pos(n) {
		this[$POS] = n;
	}

	isWhiteSpace(c) {
		return c===" " || c==="\t";
	}

	isNewLine(c) {
		return c==="\n" || c==="\r" || c==="\v" ||  c==="\f";
	}

	isDigit(c) {
		return c>="0" && c<="9";
	}

	isLetter(c) {
		return (c>="A" && c<="Z") || (c>="a" && c<="z");
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

	peek(length=1) {
		// if (this.pos+length>this.content.length) this.error("Unexpectedly reached end of content.");
		return this.content.slice(this.pos,this.pos+length);
	}

	pop(length=1) {
		if (this.pos+length>this.content.length) this.error("Unexpectedly reached end of content.");
		this.pos += length;
		return this.content.slice(this.pos-length,this.pos);
	}

	previous(length=1) {
		let start = Math.max(0,this.pos-length);
		return this.content.slice(start,this.pos);
	}

	back(length=1) {
		if (this.pos+length>=0) this.pos -= length;
	}

	popWhiteSpace() {
		while (this.isWhiteSpace(this.peek())) {
			this.pop();
		}
	}

	popJSONText() {
		let braces = 0;
		let quoting = null;
		let commenting = null;
		let keystart = false;
		let keyend = false;

		let text = "";
		while (true) {
			let next = this.pop();

			if (!commenting && !quoting && next==="{") {
				braces += 1;
				keystart = true;
			}
			else if (!commenting && !quoting && next==="}") {
				braces -= 1;
			}
			else if (!commenting && !quoting && next===",") {
				keystart = true;
			}
			else if (!commenting && keystart && !this.isWhiteSpace(next) && !this.isNewLine(next)) {
				if (!this.isQuoteCharacter(next)) text += "\"";
				keystart = false;
				keyend = true;
			}
			else if (!commenting && keyend && (this.isWhiteSpace(next) || next===":" || next==="\"" || next==="'")) {
				if (!this.isQuoteCharacter(next)) text += "\"";
				keyend = false;
			}
			else if (!commenting && !quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
			}
			else if (!commenting && quoting && next===quoting) {
				quoting = null;
			}
			else if (!commenting && !quoting && next==="{") {
				this.back();
				next = this.popJSONText();
			}
			else if (!commenting && !quoting && next==="[") {
				this.back();
				next = this.popArrayText();
			}

			if (!commenting) text += next;

			if (braces===0) break;
		}

		return text;
	}

	popArrayText() {
		let brackets = 0;
		let quoting = null;
		let commenting = null;

		let text = "";
		while (true) {
			let next = this.pop();

			if (!commenting && !quoting && next==="[") {
				brackets += 1;
			}
			else if (!commenting && !quoting && next==="]") {
				brackets -= 1;
			}
			else if (!commenting && !quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
			}
			else if (!commenting && quoting && next===quoting) {
				quoting = null;
			}
			else if (!commenting && !quoting && next==="{") {
				this.back();
				next = this.popJSONText();
			}
			else if (!commenting && !quoting && next==="[") {
				this.back();
				next = this.popArrayText();
			}

			if (!commenting) text += next;

			if (brackets===0) break;
		}

		return text;
	}

	parseComment() {
		let next = this.peek();
		let next2 = this.peek(2);
		let starting = next==="#" && "#" || next2==="//" && "//" || next2==="/*" && "/*" || null;
		if (!starting) this.error("Expected comment");

		this.pop(starting.length);

		let text = "";
		while (true) {
			next = this.peek();
			next2 = this.peek(2);

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

		console.log("comment",text);
	}

	parseKeyValue(root) {
		let key = this.parseKey();
		if (!key) this.error("Empty key in key/value.");

		this.popWhiteSpace();

		let next = this.peek();
		if (next==="{") {
			let pos = this.pos;
			let json = this.popJSONText();
			try {
				let obj = JSON.parse(json);
				if (obj===undefined || obj===null) return;
				Lodash.set(root,key,obj);
				console.log("json value",json);
			}
			catch (ex) {
				this.error("JSON parsing error",pos);
			}
		}
		if (next==="[") {
			let pos = this.pos;
			let json = this.popArrayText();
			try {
				let obj = JSON.parse(json);
				if (obj===undefined || obj===null) return;
				Lodash.set(root,key,obj);
				console.log("json value",json);
			}
			catch (ex) {
				this.error("JSON parsing error",pos);
			}
		}
		else {
			let value = this.parseValue();
			if (value===undefined) this.error("Empty value in key/value.");

			Lodash.set(root,key,value);
			console.log("keyvalue",key,value);
		}
	}

	parseKey() {
		let key = "";

		let mustBeAssignment = false;
		while(true) {
			let next = this.pop();
			if (!mustBeAssignment && this.isPathCharacter(next)) {
				key += next;
			}
			else if (!mustBeAssignment && this.isWhiteSpace()) {
				this.popWhiteSpace();
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

		let commenting = false;
		while (true) {
			let next2 = this.peek(2);
			let next = this.pop();
			if (this.isNewLine(next)) {
				break;
			}
			else if (next==="#") {
				commenting = true;
			}
			else if (next2==="//") {
				commenting = true;
			}
			else if (!commenting){
				value += next;
			}
		}
		value = this.transformValue(value);

		return value;
	}

	parseRootJSON(root) {
		let pos = this.pos;
		let json = this.popJSONText();
		try {
			let obj = JSON.parse(json);
			if (obj===undefined || obj===null) return;
			Lodash.merge(root,obj);
			console.log("json",json);
		}
		catch (ex) {
			this.error("JSON parsing error",pos);
		}
	}

	parseRootConditions() {
		let quoting = null;

		this.pop();

		let text = "";
		while (true) {
			let next = this.pop();
			if (!quoting && next==="]") {
				break;
			}
			else if (!quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
			}
			else if (quoting && next===quoting) {
				quoting = null;
			}
			else if (quoting && next===quoting) {
				quoting = false;
			}

			text += next;
		}

		console.log("condition",text);
		return text || null;
	}

	parseRoot() {
		let root = {};
		let conditions = this.defaultConditions;
		let sources = [];

		while (this.pos<this.content.length) {
			let next = this.peek();
			let next2 = this.peek(2);

			if (this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (this.isNewLine(next)) {
				this.pop();
			}
			else if (next2==="//" || next2==="/*" || next==="#") {
				this.parseComment();
			}
			else if (next==="{") {
				this.parseRootJSON(root);
			}
			else if (next==="[") {
				conditions = this.parseRootConditions() || this.defaultConditions;
			}
			else if (this.isPathCharacter(next)) {
				this.parseKeyValue(root);
			}
		}

		if (Object.keys(root).length>0) {
			sources.push(new ConfigSource(this.origin,root,conditions));
		}

		return sources;
	}

	parse(origin,content,defaultConditions=null) {
		this[$ORIGIN] = origin;
		this[$CONTENT] = content;
		this[$POS] = 0;
		this[$DEFAULT_CONDITIONS] = defaultConditions;

		return this.parseRoot();
	}

	transformValue(value) {
		value = value.trim();

		if (value===undefined) return undefined;
		if (value==="undefined") return undefined;

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

	error(message,pos=null) {
		if (pos===null) pos = this.pos;
		let lines = this.content.slice(0,pos).split(/\r\n|\n|\r|\v|\f/g);
		let line = lines.length;
		let offset = pos-lines.slice(0,-1).join(" ").length;
		throw new Error("Error at line "+line+" position "+offset+": "+message);
	}
}

module.exports = ConfigParser;
