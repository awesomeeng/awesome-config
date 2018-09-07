// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("AwesomeConfig");

// Initialize it to create our scope
config().init();

// Add a file
config().add("./config.cfg");

// start config
config().start();

// print out config for deeper understanding...
console.log(config().toString());
