// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("@awesomeeng/awesome-config");

config().init();

// Add some config
config().add({
	one: "GLOBAL 1",
	two: "GLOBAL 2",
	three: "GLOBAL 3"
});

// start config
config().start();

// test
const assert = require("assert");
assert.equal(config.one,"GLOBAL 1");
assert.equal(config.two,"GLOBAL 2");
assert.equal(config.three,"GLOBAL 3");

// print out config for deeper understanding...
console.log("GLOBAL config...");
console.log(config().toString());
console.log();

// require module 1
require("./module1");

// require module 2
require("./module2");

// require module 2
require("./module3");
