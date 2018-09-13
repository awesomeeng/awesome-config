// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");
// require("AwesomeLog").start();

const AwesomeUtils = require("@awesomeeng/awesome-utils");

describe("Config",function(){
	let config = require("../src/AwesomeConfig");

	beforeEach(()=>{
		if (config().initialized) config().stop().reset();
	});

	afterEach(()=>{
		if (config().initialized) config().stop().reset();
	});

	it("init",function(){
		assert(config);
		assert(config());
		assert(!config().initialized);
		config().init();
		assert(config().initialized);
	});

	it("start/stop",function(){
		assert(!config().started);
		config().start();
		assert(config().started);
		config().stop();
		assert(!config().started);
	});

	it("reset",function(){
		assert.strictEqual(config().sources.length,0);
		config().add({});
		config().start();
		assert.strictEqual(config().sources.length,1);
		config().stop();
		config().reset();
		assert.strictEqual(config().sources.length,0);
	});


	it("add object",function(){
		config().add({
			one: 1,
			two: 2,
			three: {
				four: 34
			}
		});

		assert.strictEqual(config().sources.length,1);

		config().start();

		assert(config);
		assert.strictEqual(Object.keys(config).length,3);
		assert.strictEqual(config.one,1);
		assert.strictEqual(config.two,2);
		assert.strictEqual(config.three.four,34);
		assert(!config.seven);
	});

	it("add string",function(){
		config().add(`

			// this is some config

			one: 1 # asdf
			two: 2 // asdfas
			three.four: 34

			# asdf sd
		`);
		config().start();
		assert.strictEqual(Object.keys(config).length,3);
		assert.strictEqual(config.one,1);
		assert.strictEqual(config.two,2);
		assert.strictEqual(config.three.four,34);
	});

	it("add filename",function(){
		config().add(AwesomeUtils.Module.resolve(module,"./test.cfg"));
		config().start();
		assert.strictEqual(config.types.object.one,1);
		assert.strictEqual(config.types.object.two,2);
		assert.deepStrictEqual(config.types.object.three,[3,33,{three: {four:34}}]);
	});

	it("add directory",function(){
		config().add(AwesomeUtils.Module.resolve(module,"./"));
		config().start();
		assert.strictEqual(config.types.object.one,1);
		assert.strictEqual(config.types.object.two,2);
		assert.deepStrictEqual(config.types.object.three,[3,33,{three: {four:34}}]);
	});

	it("instance support",function(){
		let ConfigTestModule = require("./ConfigTestModule.js");
		new ConfigTestModule();

		config().add({
			one: 1,
			two: 2,
			three: {
				four: 34
			}
		});

		assert.strictEqual(config().sources.length,1);

		config().start();

		assert(config);
		assert.strictEqual(Object.keys(config).length,3);
		assert.strictEqual(config.one,1);
		assert.strictEqual(config.two,2);
		assert.strictEqual(config.three.four,34);
	});


});
