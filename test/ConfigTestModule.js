// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const assert = require("assert");

let config = require("../src/AwesomeConfig")("ConfigTestModule");

class ConfigTestModule {
	constructor() {
		config().init();

		config().add({
			one: 111,
			two: 222,
			three: {
				four: 343434
			}
		});

		assert.strictEqual(config().sources.length,1);
		config().start();

		assert(config);
		assert.strictEqual(Object.keys(config).length,3);
		assert.strictEqual(config.one,111);
		assert.strictEqual(config.two,222);
		assert.strictEqual(config.three.four,343434);
	}
}

module.exports = ConfigTestModule;
