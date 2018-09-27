// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("@awesomeeng/awesome-config");

// test
const assert = require("assert");
assert.equal(config.one,"GLOBAL 1");
assert.equal(config.two,"GLOBAL 2");
assert.equal(config.three,"GLOBAL 3");

// print out config for deeper understanding...
console.log("MODULE2 config (which should be the same as GLOBAL config)...");
console.log(config().toString());
console.log();
