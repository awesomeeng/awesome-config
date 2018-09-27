// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig and specify a namespace
const config = require("@awesomeeng/awesome-config")("MODULE3");

config().init();

// Add some config
config().add({
	one: "MODULE3 1",
	two: "MODULE3 2",
	three: "MODULE3 3"
});

// start config
config().start();

// test
const assert = require("assert");
assert.equal(config.one,"MODULE3 1");
assert.equal(config.two,"MODULE3 2");
assert.equal(config.three,"MODULE3 3");

// print out config for deeper understanding...
console.log("MODULE3 config...");
console.log(config().toString());
console.log();
