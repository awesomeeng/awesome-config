// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("AwesomeConfig");

// Initialize it to create our scope
config().init();

// Add a file
config().add("./config.cfg");

// Add another file
config().add("./evens.cfg");

// start config
config().start();

// test
const assert = require("assert");
assert.equal(config.one,1);
assert.equal(config.two,"even");
assert.equal(config.three,3);
assert.equal(config.four,"even");
assert.equal(config.five,5);
assert.equal(config.six,"even");
assert.equal(config.seven,7);
assert.equal(config.eight,"even");

// print out config for deeper understanding...
console.log(config().toString());
