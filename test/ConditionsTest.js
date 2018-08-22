// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const OS = require("os");
const assert = require("assert");
// require("AwesomeLog").start();

const AbstractCondition = require("../src/AbstractCondition");
const ConfigConditionParser = require("../src/ConfigConditionParser");

const TrueCondition = require("../src/conditions/TrueCondition");
const FalseCondition = require("../src/conditions/FalseCondition");

const NotCondition = require("../src/NotCondition");
const AndCondition = require("../src/AndCondition");
const OrCondition = require("../src/OrCondition");
const GroupCondition = require("../src/GroupCondition");

const OSCondition = require("../src/conditions/OSCondition");
const HostnameCondition = require("../src/conditions/HostnameCondition");
const UnameCondition = require("../src/conditions/UnameCondition");
const ArchCondition = require("../src/conditions/ArchCondition");
const MachineCondition = require("../src/conditions/MachineCondition");
const CPUSCondition = require("../src/conditions/CPUSCondition");
const CWDCondition = require("../src/conditions/CWDCondition");

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

	it("os",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("os==="+OS.platform());

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof OSCondition);

		assert(condition.resolve());
	});

	it("arch",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("arch==="+OS.arch());

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof ArchCondition);

		assert(condition.resolve());
	});

	it("uname",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("uname==="+OS.type());

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof UnameCondition);

		assert(condition.resolve());
	});

	it("hostname",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("hostname==="+OS.hostname());

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof HostnameCondition);

		assert(condition.resolve());
	});

	it("machine",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("machine==="+OS.hostname().split(".")[0] || OS.hostname());

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof MachineCondition);

		assert(condition.resolve());
	});

	it("cpus",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("cpus==="+OS.cpus().length);

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof CPUSCondition);

		assert(condition.resolve());
	});

	it("cwd",function(){
		let parser = new ConfigConditionParser();
		let condition = parser.parse("cwd==="+process.cwd());

		assert(condition);
		assert(condition instanceof AbstractCondition);
		assert(condition instanceof CWDCondition);

		assert(condition.resolve());
	});
});
