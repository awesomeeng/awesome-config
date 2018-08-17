// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
// require("AwesomeLog").start();

const AwesomeUtils = require("AwesomeUtils");

describe("Config",function(){
	let config = require("../src/AwesomeConfig");

	afterEach(()=>{
		config.$$stop();
		config.reset();
	});

	it("required",function(){
		assert(config);
		assert.strictEqual(Object.keys(config).length,0);
	});

	it("start/stop",function(){
		config.start();
		assert(config);
		assert(!config.start);
		assert(!config.add);
		assert(!config.sources);
		assert(!config.reset);
		assert(config.$$stop);
		assert.strictEqual(Object.keys(config).length,0);

		config.$$stop();
		assert(config.start);
		assert(config.add);
		assert(config.sources);
		assert(config.reset);
		assert(config.$$stop);
		assert.strictEqual(Object.keys(config).length,0);
	});

	it("reset",function(){
		config.add({
			one: 1,
			two: 2,
			three: {
				four: 34
			}
		});

		assert.strictEqual(config.sources.length,1);

		config.reset();

		assert.strictEqual(config.sources.length,0);
	});

	it("add object",function(){
		config.add({
			one: 1,
			two: 2,
			three: {
				four: 34
			}
		});

		assert.strictEqual(config.sources.length,1);

		config.start();

		assert(config);
		assert.strictEqual(Object.keys(config).length,3);
		assert.strictEqual(config.one,1);
		assert.strictEqual(config.two,2);
		assert.strictEqual(config.three.four,34);
	});

	it("add string",function(){
		config.add(`

			// this is some config

			one: 1 # asdf
			two: 2 // asdfas
			three.four: 34

			# asdf sd
		`);
		config.start();
		assert.strictEqual(Object.keys(config).length,3);
		assert.strictEqual(config.one,1);
		assert.strictEqual(config.two,2);
		assert.strictEqual(config.three.four,34);
	});

	it("add filename",function(){
		config.add(AwesomeUtils.Module.resolve(module,"./test.cfg"));
	});

	// it("add directory",function(){
	// 	config.add(AwesomeUtils.Module.resolve(module,"./test.cfg"));
	// });


});
