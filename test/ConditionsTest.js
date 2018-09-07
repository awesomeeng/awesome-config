

// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
// require("AwesomeLog").start();

const ConfigConditionParser = require("../src/ConfigConditionParser");

const AbstractCondition = require("../src/conditions/AbstractCondition");

const TrueCondition = require("../src/conditions/TrueCondition");
const FalseCondition = require("../src/conditions/FalseCondition");

const NotCondition = require("../src/conditions/NotCondition");
const AndCondition = require("../src/conditions/AndCondition");
const OrCondition = require("../src/conditions/OrCondition");
const GroupCondition = require("../src/conditions/GroupCondition");

const BooleanCondition = require("../src/conditions/BooleanCondition");
const NumberCondition = require("../src/conditions/NumberCondition");
const StringCondition = require("../src/conditions/StringCondition");

describe("Conditions",function(){
	it("true",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("true");

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof TrueCondition);

		assert(condition.resolve());
	});

	it("false",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("false");

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof FalseCondition);

		assert(!condition.resolve());
	});

	it("not",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("not true");

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof NotCondition);

		assert(!condition.resolve());
	});

	it("and",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("false and false");

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof AndCondition);

		assert(!condition.resolve());

		condition = parser.parse("false and true");
		assert(!condition.resolve());
		condition = parser.parse("true and false");
		assert(!condition.resolve());
		condition = parser.parse("true and true");
		assert(condition.resolve());
	});

	it("or",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("false or false");

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof OrCondition);

		assert(!condition.resolve());

		condition = parser.parse("false or true");
		assert(condition.resolve());
		condition = parser.parse("true or false");
		assert(condition.resolve());
		condition = parser.parse("true or true");
		assert(condition.resolve());
	});

	it("group",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("(true and (false or true))");

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof GroupCondition);

		assert(condition.resolve());
	});

	it("boolean",function(){
		assert(BooleanCondition);

		const test = (source,operator,value) => {
			let c = new BooleanCondition(source,"test");
			c.operator = operator;
			c.value = value;
			return c.resolve();
		};

		assert(test(true,"=",true));
		assert(test(true,"==",true));
		assert(test(true,"===",true));
		assert(!test(true,"!=",true));
		assert(!test(true,"!==",true));

		assert(!test(true,"=",false));
		assert(!test(true,"==",false));
		assert(!test(true,"===",false));
		assert(test(true,"!=",false));
		assert(test(true,"!==",false));

		assert(test(false,"=",false));
		assert(test(false,"==",false));
		assert(test(false,"===",false));
		assert(!test(false,"!=",false));
		assert(!test(false,"!==",false));

		assert(!test(false,"=",true));
		assert(!test(false,"==",true));
		assert(!test(false,"===",true));
		assert(test(false,"!=",true));
		assert(test(false,"!==",true));
	});

	it("number",function(){
		assert(NumberCondition);

		const test = (source,operator,value) => {
			let c = new NumberCondition(source,"test");
			c.operator = operator;
			c.value = value;
			return c.resolve();
		};

		assert(test(8675309,"=",8675309));
		assert(test(8675309,"==",8675309));
		assert(test(8675309,"===",8675309));
		assert(!test(8675309,"!=",8675309));
		assert(!test(8675309,"!==",8675309));

		assert(!test(8675309,"=",1234567));
		assert(!test(8675309,"==",1234567));
		assert(!test(8675309,"===",1234567));
		assert(test(8675309,"!=",1234567));
		assert(test(8675309,"!==",1234567));

		assert(!test(1,">",1));
		assert(!test(1,">",2));
		assert(test(2,">",1));
		assert(test(1,">=",1));
		assert(!test(1,">=",2));
		assert(test(2,">=",1));
		assert(!test(1,"<",1));
		assert(test(1,"<",2));
		assert(!test(2,"<",1));
		assert(test(1,"<=",1));
		assert(test(1,"<=",2));
		assert(!test(2,"<=",1));
	});

	it("string",function(){
		const test = (source,operator,value) => {
			let c = new StringCondition(source,"test");
			c.operator = operator;
			c.value = value;
			return c.resolve();
		};

		assert(test("red,green,blue","=","red,green,blue"));
		assert(test("red,green,blue","==","red,green,blue"));
		assert(test("red,green,blue","===","red,green,blue"));
		assert(!test("red,green,blue","!=","red,green,blue"));
		assert(!test("red,green,blue","!==","red,green,blue"));

		assert(!test("red,green,blue","=","one,two,three"));
		assert(!test("red,green,blue","==","one,two,three"));
		assert(!test("red,green,blue","===","one,two,three"));
		assert(test("red,green,blue","!=","one,two,three"));
		assert(test("red,green,blue","!==","one,two,three"));

		assert(test("red,green,blue","^","red"));
		assert(test("red,green,blue","~","red"));
		assert(!test("red,green,blue","$","red"));
		assert(!test("red,green,blue","!^","red"));
		assert(!test("red,green,blue","!~","red"));
		assert(test("red,green,blue","!$","red"));

		assert(!test("red,green,blue","^","green"));
		assert(test("red,green,blue","~","green"));
		assert(!test("red,green,blue","$","green"));
		assert(test("red,green,blue","!^","green"));
		assert(!test("red,green,blue","!~","green"));
		assert(test("red,green,blue","!$","green"));

		assert(!test("red,green,blue","^","blue"));
		assert(test("red,green,blue","~","blue"));
		assert(test("red,green,blue","$","blue"));
		assert(test("red,green,blue","!^","blue"));
		assert(!test("red,green,blue","!~","blue"));
		assert(!test("red,green,blue","!$","blue"));

		assert(!test("red,green,blue","^","orange"));
		assert(!test("red,green,blue","~","orange"));
		assert(!test("red,green,blue","$","orange"));
		assert(test("red,green,blue","!^","orange"));
		assert(test("red,green,blue","!~","orange"));
		assert(test("red,green,blue","!$","orange"));
	});
});
