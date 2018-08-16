// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const Lodash = require("lodash");

const AbstractParser = require("./AbstractParser");

class DefaultParser extends AbstractParser {
	constructor(options) {
		super(options);
	}

	parse(content) {
		let parser = new Parser(content);
		return parser.parse();
	}
}

class Parser {
	constructor(content) {
		this.pos = 0;
		this.content = content;
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

	popWhiteSpace() {
		while (this.isWhiteSpace(this.peek())) {
			this.pop();
		}
	}

	parseComment() {
		let next = this.peek();
		let next2 = this.peek(2);
		let starting = next==="#" && "#" || next2==="//" && "//" || next2==="/*" && "/*" || null;
		if (!starting) this.error("Expected comment");

		this.pop(starting.length);

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
				this.pop();
			}
		}
	}

	parseJSON(root) {
	}

	parseKeyValue(root) {
		let key = this.parseKey();
		if (!key) this.error("Empty key in key/value.");

		let value = this.parseValue();
		if (value===undefined) this.error("Empty value in key/value.");

		Lodash.set(root,key,value);
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

	parseRoot() {
		let root = {};
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
				this.parseJSON(root);
			}
			else if (this.isPathCharacter(next)) {
				this.parseKeyValue(root);
			}
		}
		return root;
	}

	parse() {
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

	error(message) {
		let lines = this.content.slice(0,this.pos).split(/\n|\r|\v|\f/g);
		let line = lines.length;
		let offset = this.pos-lines.slice(0,-1).join(" ").length;
		throw new Error("Error at line "+line+" position "+offset+": "+message);
	}
}

module.exports = DefaultParser;
