// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const ConfigResolver = require("../src/ConfigResolver");


describe("ConfigResolver",function(){
	let resolver = new ConfigResolver();

	it("Simple Variables",function(){
		let test = {
			one: 1,
			two: "two",
			three: {
				four: "${one}"
			},
			five: "This is a one: ${one}",
			six: "${one} and ${two}",
			seven: "${three.four}",
			eight: "${one}",
			nine: "${two}"
		};
		assert(test);

		resolver.resolve(test);

		assert(test);
		assert.deepStrictEqual(test.one,1);
		assert.deepStrictEqual(test.two,"two");
		assert.deepStrictEqual(test.three,{
			four: 1
		});
		assert.deepStrictEqual(test.five,"This is a one: 1");
		assert.deepStrictEqual(test.six,"1 and two");
		assert.deepStrictEqual(test.seven,1);
		assert.deepStrictEqual(test.eight,1);
		assert.deepStrictEqual(test.nine,"two");
	});

	it("Missing Variables",function(){
		let test = {
			one: 1,
			two: "two",
			three: "${four}"
		};

		assert.throws(()=>{
			resolver.resolve(test);
		});
	});

	it("Placeholders",function(){
		let test = {
			one: 1,
			two: "two",
			three: "<<THIS IS A PLACEHOLDER>>"
		};
		assert(test);

		assert.throws(()=>{
			resolver.resolve(test);
		});
	});

	it("Circular References",function(){
		let test = {
			one: "${two}",
			two: "${one}"
		};
		assert(test);

		assert.throws(()=>{
			resolver.resolve(test);
		});
	});



});
