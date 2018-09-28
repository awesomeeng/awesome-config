// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("@awesomeeng/awesome-config");

// Initialize it to create our scope
config().init();

// Add a directory.  This will in turn add config.cfg, evens.cfg, and odds.cfg
config().add("./");

// start config
config().start();

// test
const assert = require("assert");
assert.strictEqual(config.zero,0);
assert.strictEqual(config.one,"odd");
assert.strictEqual(config.two,"even");
assert.strictEqual(config.three,"odd");
assert.strictEqual(config.four,"even");
assert.strictEqual(config.five,"odd");
assert.strictEqual(config.six,"even");
assert.strictEqual(config.seven,"odd");
assert.strictEqual(config.eight,"even");
assert.strictEqual(config.nine,"odd");
assert.strictEqual(config().sources.length,3);

// print out config for deeper understanding...
console.log(config().sources);
// console.log(config().toString());
