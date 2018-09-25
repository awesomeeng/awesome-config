// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("@awesomeeng/awesome-config");

// test
const assert = require("assert");
assert.equal(config.one,"entry.js 1");
assert.equal(config.two,"entry.js 2");
assert.equal(config.three,"entry.js 3");

// print out config for deeper understanding...
console.log("module2.js config (which should be the same as entry.js config)...");
console.log(config().toString());
console.log();
