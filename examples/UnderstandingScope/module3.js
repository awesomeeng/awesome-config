// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("@awesomeeng/awesome-config");

// Initialize it to create our module scope
config().init();

// Add some config
config().add({
	one: "module3.js 1",
	two: "module3.js 2",
	three: "module3.js 3"
});

// start config
config().start();

// test
const assert = require("assert");
assert.equal(config.one,"module3.js 1");
assert.equal(config.two,"module3.js 2");
assert.equal(config.three,"module3.js 3");

// print out config for deeper understanding...
console.log("module3.js config...");
console.log(config().toString());
console.log();
