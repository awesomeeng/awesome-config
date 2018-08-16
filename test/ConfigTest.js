// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

const AwesomeConfig = require("../src/AwesomeConfig");

describe("Config",function(){
	it("basic",function(){
		let config = new AwesomeConfig();
// 		config.init();
// 		config.add(`
// // sample config
// abc.def.ghi: hello
// `);
		config.start();
//
		assert(config);
		console.log(config.abc);
		console.log(config.abc.def);
		console.log(config.abc.def.ghi);
// 		assert.equal(config.abc.def.ghi,"hello");
	});
});
