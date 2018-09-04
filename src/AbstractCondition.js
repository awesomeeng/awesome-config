// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const NOT_REQUIRED = "Not Required.";

const $OPERATOR = Symbol("operator");
const $VALUE = Symbol("value");

/**
 * Defines the shape of each condition.  A condition must implement the `name` getter,
 * and the `isValidOperator(op)` and `toSTring()` and `resolve()` methods.
 */
class AbstractCondition {
	/**
	 * Constructs a new instance of this condition.
	 */
	constructor() {
	}

	/**
	 * Returnable object for when an operator or value is not required.
	 */
	static NOT_REQUIRED() {
		return NOT_REQUIRED;
	}

	/**
	 * Returns the current operator for this condition, or NOT_REQUIRED.
	 * Overload this getter to always return NOT_REQUIRED if an
	 * operator is never required.
	 *
	 * @return {string}
	 */
	get operator() {
		return this[$OPERATOR];
	}

	/**
	 * Set the current operator.
	 *
	 * @param  {string} x
	 * @return {void}
	 */
	set operator(x) {
		this[$OPERATOR] = x;
	}

	/**
	 * Returns the current value for this condition, or NOT_REQUIRED.
	 * Overload this getter to always return NOT_REQUIRED if an
	 * value is never required.
	 *
	 * @return {any}
	 */
	get value() {
		return this[$VALUE];
	}

	/**
	 * Set the current value.
	 *
	 * @param  {any} x
	 * @return {void}
	 */
	set value(x) {
		this[$VALUE] = x;
	}

	/**
	 * Returns a nice string name for this condition.
	 *
	 * @return {string}
	 */
	get name() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	/**
	 * Returns true of `op` is a valid string name for an operator allowed by this condition.
	 * This method is intended to be overloaded.
	 *
	 * @return {boolean}
	 */
	isOperatorValid(/*op*/) {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	/**
	 * Returns true if this condition evaluates to true, false otherwise.
	 *
	 * @return {boolean}
	 */
	resolve() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}

	/**
	 * Returns a string representation of this condtion.
	 *
	 * @return {string}
	 */
	toString() {
		throw new Error("Not implemented. AbstractCondition requires this method be implemented.");
	}
}

module.exports = AbstractCondition;
