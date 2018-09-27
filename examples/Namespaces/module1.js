// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig and specify a namespace
const config = require("@awesomeeng/awesome-config")("MODULE1");

config().init();

// Add some config
config().add({
	one: "MODULE1 1",
	two: "MODULE1 2",
	three: "MODULE1 3"
});

// start config
config().start();

// test
const assert = require("assert");
assert.equal(config.one,"MODULE1 1");
assert.equal(config.two,"MODULE1 2");
assert.equal(config.three,"MODULE1 3");

// print out config for deeper understanding...
console.log("MODULE1 config...");
console.log(config().toString());
console.log();
