// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
// require("AwesomeLog").start();

const SpecialStrings = require("../src/SpecialStrings");

describe("SpecialStrings",function(){
	it("env:*",function(){
		assert(SpecialStrings.resolve("env:xyz")==="");
	});

	it("hostname:*",function(){
		assert(SpecialStrings.resolve("hostname:domain"));
		assert(SpecialStrings.resolve("hostname:fqdn"));
		assert(SpecialStrings.resolve("hostname:full"));
		assert(SpecialStrings.resolve("hostname:name"));
	});

	it("process:*",function(){
		assert(SpecialStrings.resolve("process:args"));
		assert(SpecialStrings.resolve("process:cwd"));
		assert(SpecialStrings.resolve("process:exec"));
		assert(SpecialStrings.resolve("process:execpath"));
		assert(SpecialStrings.resolve("process:main"));
		assert(SpecialStrings.resolve("process:pid"));
		assert(SpecialStrings.resolve("process:ppid"));
		assert(SpecialStrings.resolve("process:script"));
		assert(SpecialStrings.resolve("process:version"));
	});

	it("os:*",function(){
		assert(SpecialStrings.resolve("os:arch"));
		assert(SpecialStrings.resolve("os:bits"));
		assert(SpecialStrings.resolve("os:cpus"));
		assert(SpecialStrings.resolve("os:home"));
		assert(SpecialStrings.resolve("os:homedir"));
		assert(SpecialStrings.resolve("os:platform"));
		assert(SpecialStrings.resolve("os:user"));
		assert(SpecialStrings.resolve("os:username"));
	});

	it("string:*",function(){
		assert(SpecialStrings.resolve("string:encoding"));
		assert(SpecialStrings.resolve("string:EOL"));
	});

	it("unresolved",function(){
		assert.throws(()=>{
			SpecialStrings.resolve("blah");
		});
		assert.throws(()=>{
			SpecialStrings.resolve("blah:blah");
		});
	});

});
