// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");

class ConditionParser extends AwesomeUtils.Parser.AbstractParser {
	parse(content) {
		super.parse(content);

		return this.parseExpression();
	}

	isPathCharacter(c) {
		return this.isLetter(c) || this.isDigit(c) || c==="." || c==="_" || c==="$" || c==="-";
	}

	isQuoteCharacter(c) {
		return c==="\"" || c==="'";
	}

	popWord() {
		let word = "";
		while (true) {
			let next = this.peek();
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
	}

	parseField() {
		let field = "";
		while (true) {
			let next = this.peek();

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

		console.log("field",field,this.pos);
		return {
			field: field,
			operator: null,
			value: null
		};
	}

	parseOperator() {
		console.log("operator");
		return {
			operator: null,
			value: null
		};
	}

	parseValue() {
		console.log("value");
		return null;
	}

	parseNot() {
		console.log("not");
		return null;
	}

	parseAnd() {
		console.log("and");
		return null;
	}

	parseOr() {
		console.log("or");
		return null;
	}

	parseExpression() {
		console.log(1,this.content);

		let expression = null;
		let field = null;
		let operator = null;
		let value = null;

		while (this.pos<this.content.length) {
			let nextword = this.peekWord();
			let next = this.peek();
			let next2 = this.peek(2);

			if (this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (nextword && nextword.match(/^not$/i)) {
				expression = this.parseNot(expression);
			}
			else if (nextword && nextword.match(/^and$/i)) {
				expression = this.parseAnd(expression);
			}
			else if (nextword && nextword.match(/^or$/i)) {
				expression = this.parseOr();
			}
			else if (next==="#" || next2==="//" || next2==="/*") {
				this.parseComment();
			}
			else if (!field) {
				({field,operator,value} = this.parseField());
			}
			else if (field && !operator) {
				({operator,value} = this.parseOperator());
			}
			else if (field && operator && !value) {
				field = this.parseValue();
			}

			if (field && operator && value) {
				// create epxression
			}
		}

		return expression;
	}
}

module.exports = ConditionParser;
