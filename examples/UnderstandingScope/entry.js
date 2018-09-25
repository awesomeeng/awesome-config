// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("@awesomeeng/awesome-config");

// require module 1
require("./module1");

// Initialize it to create our scope
config().init();

// Add some config
config().add({
	one: "entry.js 1",
	two: "entry.js 2",
	three: "entry.js 3"
});

// start config
config().start();

// require module 2
require("./module2");

// require module 2
require("./module3");

// test
const assert = require("assert");
assert.equal(config.one,"entry.js 1");
assert.equal(config.two,"entry.js 2");
assert.equal(config.three,"entry.js 3");

// print out config for deeper understanding...
console.log("entry.js config...");
console.log(config().toString());
console.log();
