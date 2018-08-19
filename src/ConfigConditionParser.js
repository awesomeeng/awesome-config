// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");

class ConditionParser extends AwesomeUtils.Parser.AbstractParser {
	parse(content) {
		super.parse(content);

		let expression = this.parseExpression();
		console.log(JSON.stringify(expression,null,2));
	}

	isPathCharacter(c) {
		return this.isLetter(c) || this.isDigit(c) || c==="." || c==="_" || c==="$" || c==="-";
	}

	isQuoteCharacter(c) {
		return c==="\"" || c==="'";
	}

	isOperatorCharacter(c) {
		return c==="=" || c==="<" || c===">" || c==="!" || c==="~";
	}

	popWord() {
		let word = "";
		while (true) {
			let next = this.peek();
			if (next===undefined) break;

			if (this.isPathCharacter(next)) {
				word += this.pop();
			}
			else {
				break;
			}
		}

		return word;
	}

	peekWord() {
		let pos = this.pos;
		let word = this.popWord();
		this.pos = pos;
		return word;
	}

	parseComment() {
		let next2 = this.peek(2);
		let next = this.peek();
		let starting = next==="#" && "#" || next2==="//" && "//" || next2==="/*" && "/*" || null;
		if (!starting) this.error("Expected comment");

		this.pop(starting.length);

		let text = "";
		while (true) {
			next2 = this.peek(2);
			if (next===undefined) break;
			next = this.peek();

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

	parseField() {
		let field = "";
		while (true) {
			let next = this.peek();
			if (next===undefined) break;

			if (this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (this.isPathCharacter(next)) {
				field += this.pop();
			}
			else {
				break;
			}
		}

		return field;
	}

	parseOperator() {
		let operator = "";
		while (true) {
			let next = this.peek();

			if (this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (this.isOperatorCharacter(next)) {
				operator += this.pop();
			}
			else {
				break;
			}
		}

		return operator;
	}

	parseValue() {
		let value = "";

		let quoting = null;
		while (true) {
			let next = this.peek();
			if (next===undefined) break;

			if (this.pos>=this.content.length) {
				break;
			}
			else if (!quoting && value && this.isWhiteSpace(next)) {
				break;
			}
			else if (!quoting && !value && this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (!quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
				value += this.pop();
			}
			else if (quoting && next===quoting) {
				quoting = null;
				value += this.pop();
			}
			else if (!quoting && next===")") {
				break;
			}
			else {
				value += this.pop();
			}
		}
		return value;
	}

	parseAnd(left) {
		let start = this.pos;
		let word = this.popWord().toLowerCase();
		if (!word==="and") this.error("Expected and.",start);

		let right = this.parseExpression();
		if (!right) this.error("Missing right side of and.");

		return {
			type: "and",
			left,
			right
		};
	}

	parseOr(left) {
		let start = this.pos;
		let word = this.popWord().toLowerCase();
		if (!word==="or") this.error("Expected or.",start);

		let right = this.parseExpression();
		if (!right) this.error("Missing right side of or.");

		return {
			type: "or",
			left,
			right
		};
	}

	parseGroup() {
		let start = this.pos;

		let next = this.pop();
		if (next!=="(") this.error("Expected grouping open parenthesis.",start);

		let expression = this.parseExpression(true);
		if (!expression) this.error("Expected expression.");

		this.popWhiteSpace();
		next = this.pop();
		if (next!==")") this.error("Expected grouping end paraenthesis.");

		return {
			type: "group",
			expression: expression
		};
	}

	parseExpression(inGroup=false) {
		let expression = null;
		let field = null;
		let operator = null;
		let value = null;

		while (this.pos<this.content.length) {
			let next2 = this.peek(2);
			let next = this.peek();
			if (next===undefined) break;
			let nextword = this.peekWord();

			if (this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (next==="#" || next2==="//" || next2==="/*") {
				this.parseComment();
			}
			else if (expression && nextword && nextword.match(/^and$/i)) {
				expression = this.parseAnd(expression);
			}
			else if (expression && nextword && nextword.match(/^or$/i)) {
				expression = this.parseOr(expression);
			}
			else if (!expression && next==="(") {
				expression = this.parseGroup();
			}
			else if (expression && next===")") {
				break;
			}
			else if (!expression && !field) {
				field = this.parseField();
				if (!field) this.error("Expected field.");
			}
			else if (!expression && field && !operator) {
				operator = this.parseOperator();
				if (!operator) this.error("Expected operator.");
			}
			else if (!expression && field && operator && !value) {
				value = this.parseValue();
				if (!value) this.error("Expected value.");
			}
			else if (expression && inGroup && next===")") {
				break;
			}
			else {
				this.error("Expected expression.");
			}

			if (!expression && field && operator && value) {
				expression = {field,operator,value};
				field = null;
				operator = null;
				value = null;
			}
		}

		return expression;
	}
}

module.exports = ConditionParser;
