// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("awesome-config");

// Initialize it to create our scope
config().init();

// Add a directory.  This will in turn add config.cfg, evens.cfg, and odds.cfg
config().add("./");

// start config
config().start();

// test
const assert = require("assert");
assert.strictEqual(config.zero,0);
assert.equal(config.one,"odd");
assert.equal(config.two,"even");
assert.equal(config.three,"odd");
assert.equal(config.four,"even");
assert.equal(config.five,"odd");
assert.equal(config.six,"even");
assert.equal(config.seven,"odd");
assert.equal(config.eight,"even");
assert.equal(config.nine,"odd");
assert.equal(config().sources.length,3);

// print out config for deeper understanding...
console.log(config().sources);
// console.log(config().toString());
