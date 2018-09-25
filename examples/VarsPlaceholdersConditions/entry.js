// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

// require AwesomeConfig
const config = require("@awesomeeng/awesome-config");

// Initialize it to create our scope
config().init();

// Add a file
config().add("./config.cfg");

// start config
config().start();

// finally print our configuration.
console.log(config().toString());

// When you run this example the first time you should get
// an exception like this:
//
// 		Error: Unfulfilled Placeholder 'This gets filled in later' at 'one.three'.
//
// This is because our configuration has a placeholder that is contingent on
// a environment variable being set.  If you set the environment variable
//
// 		AWESOMECONFG_TEST
//
// to the value of "one" you will notice that you no longer get the placeholder
// error, but instead see a config object printed.  Notice the value of "one.three"
// is set to "12".  Set the environment variable to "two", run again, and
// look at "one.three" now. Take a lok at config.cfg when you are done to
// understand what is happening and why this is really useful.
