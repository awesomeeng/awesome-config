// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const AbstractCondition = require("./conditions/AbstractCondition");

const NotCondition = require("./conditions/NotCondition");
const AndCondition = require("./conditions/AndCondition");
const OrCondition = require("./conditions/OrCondition");
const GroupCondition = require("./conditions/GroupCondition");

const TrueCondition = require("./conditions/TrueCondition");
const FalseCondition = require("./conditions/FalseCondition");

const BooleanCondition = require("./conditions/BooleanCondition");
const NumberCondition = require("./conditions/NumberCondition");
const StringCondition = require("./conditions/StringCondition");

const SpecialStrings = require("./SpecialStrings");

/**
 * @private
 * 
 * Parses a condition string and returns a single condition back. The returned
 * condition can contain a set of nested conditions are needed.
 *
 * @extends AwesomeUtils
 */
class ConditionParser extends AwesomeUtils.Parser.AbstractParser {
	/**
	 * Parse a condition string.
	 *
	 * @param  {string} content
	 * @return {AbstractCondition}
	 */
	parse(content) {
		super.parse(content);

		return this.parseExpression();
	}

	isPathCharacter(c) {
		return this.isLetter(c) || this.isDigit(c) || c==="." || c==="_" || c==="$" || c==="-";
	}

	isFieldCharacter(c) {
		return this.isPathCharacter(c) || c===":";
	}

	isQuoteCharacter(c) {
		return c==="\"" || c==="'";
	}

	isOperatorCharacter(c) {
		return c==="=" || c==="<" || c===">" || c==="!" || c==="~" || c==="^" || c==="$";
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
		this.popWhiteSpace();

		let text = "";
		while (true) {
			let next = this.peek();
			if (next===undefined) break;

			if (this.isFieldCharacter(next)) {
				text += this.pop();
			}
			else {
				break;
			}
		}

		if (!text) this.error("Expected field.");

		let field = this.getConditionObject(text);
		if (!field) this.error("Unknown field '"+text+"'.");

		if (field.operator!==AbstractCondition.NOT_REQUIRED) this.parseFieldOperator(field);

		return field;
	}

	parseFieldOperator(field) {
		if (!field) this.error("Invalid field passed to parseFieldOperator.");

		let text = "";
		while (true) {
			let next = this.peek();

			if (this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (this.isOperatorCharacter(next)) {
				text += this.pop();
			}
			else {
				break;
			}
		}

		if (!field.isOperatorValid(text)) this.error("Invalid operator '"+text+"' for field '"+field.name+"'.");

		field.operator = text;

		if (field.value!==AbstractCondition.NOT_REQUIRED) this.parseFieldValue(field);

		return field;
	}

	parseFieldValue(field) {
		if (!field) this.error("Invalid field passed to parseFieldOperator.");

		let text = "";
		let quoting = null;
		while (true) {
			let next = this.peek();
			if (next===undefined) break;

			if (this.pos>=this.content.length) {
				break;
			}
			else if (!quoting && text && this.isWhiteSpace(next)) {
				break;
			}
			else if (!quoting && !text && this.isWhiteSpace(next)) {
				this.popWhiteSpace();
			}
			else if (!quoting && this.isQuoteCharacter(next) && this.previous()!=="\\") {
				quoting = next;
				text += this.pop();
			}
			else if (quoting && next===quoting) {
				quoting = null;
				text += this.pop();
			}
			else if (!quoting && next===")") {
				break;
			}
			else {
				text += this.pop();
			}
		}

		if (text==="") this.error("Missing value for field '"+field.name+"'.");
		field.value = text;

		return field;
	}

	parseNot() {
		let start = this.pos;
		let word = this.popWord().toLowerCase();
		if (!word==="not") this.error("Expected not.",start);

		let expression = this.parseExpression();
		if (!expression) this.error("Missing expression for not.");

		return new NotCondition(expression);
	}

	parseAnd(left) {
		let start = this.pos;
		let word = this.popWord().toLowerCase();
		if (!word==="and") this.error("Expected and.",start);

		let right = this.parseExpression();
		if (!right) this.error("Missing right side of and.");

		return new AndCondition(left,right);
	}

	parseOr(left) {
		let start = this.pos;
		let word = this.popWord().toLowerCase();
		if (!word==="or") this.error("Expected or.",start);

		let right = this.parseExpression();
		if (!right) this.error("Missing right side of or.");

		return new OrCondition(left,right);
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

		return new GroupCondition(expression);
	}

	parseExpression(inGroup=false) {
		let expression = null;

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
			else if (!expression && nextword && nextword.match(/^not$/i)) {
				expression = this.parseNot();
			}
			else if (expression && nextword && nextword.match(/^or$/i)) {
				expression = this.parseOr(expression);
			}
			else if (!expression && next==="(") {
				expression = this.parseGroup();
			}
			else if (expression && inGroup && next===")") {
				break;
			}
			else if (expression && next===")") {
				break;
			}
			else if (!expression) {
				expression = this.parseField();
			}
			else {
				this.error("Expected expression.");
			}
		}

		return expression;
	}

	getConditionObject(field) {
		let lc = field.toLowerCase();
		if (lc==="true") return new TrueCondition();
		if (lc==="false") return new FalseCondition();

		try {
			let value = SpecialStrings.resolve(field);
			if (typeof value==="boolean") return new BooleanCondition(value,field);
			if (typeof value==="number") return new NumberCondition(value,field);
			if (typeof value==="string") return new StringCondition(value,field);
		}
		catch (ex) {
			if (ex===SpecialStrings.UNRESOLVED) return this.error("Condition contained a field that could not resolve: "+field);
			else throw ex;
		}
	}
}

module.exports = ConditionParser;
