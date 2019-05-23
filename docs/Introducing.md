# [AwesomeConfig](../README.md) > Introducing AwesomeConfig

AwesomeConfig is a powerful configuration system for building enterprise ready node.js applications. It provides a unified, transparent configuration object to your application based on configuration files or objects that you define.  It includes support for conditional configuration based on external values like environment variables, hostname, or OS; variables to reference one part of your configuration from another; and lots more.

Simply add configuration objects or files to AwesomeConfig and start using your configuration anywhere in your code. No configuration object to pass around, no mutations to worry about. Everything in a nice single JavaScript object structure.

Of course, there is a lot more to it then that.  Internally, AwesomeConfig takes all your configuration blocks (from objects, files, directories, etc.) and merges them together to provide a single, unified, immutable configuration object.  This object is essentially a plain javascript object that is exposed directly as AwesomeConfig and thus globally available simply by requiring AwesomeConfig.

Additionally, AwesomeConfig offers some really interesting features that can make your configuration really shine: Variables allow you reference one part of your configuration from another part of you configuration; Conditions allow you to include or exclude sections of configuration depending on external items like environment variables, hostnames, OS type, etc.; Placeholders let you flag some variables to be required before the system can properly start forcing downstream users to provide the details. Altogether variables, conditions, and placeholders allow you to write highly flexible, detailed configuration for just about any project need.

## Key Features

 - **No Object to Pass**. Once AwesomeConfig is started you have complete access to your configuration. Simply require AwesomeConfig and you can read any and all configuration data. No creating a configuration object and passing it from function to function, module to module, class to class.

 - **A Single Unified View**. AwesomeConfig provides a single view of all your configuration data, no matter how many configuration objects, files, or directories you use.  This means you can keep your configuration separate, readable, and maintainable.

 - **Immutable**. Once started the entire configuration becomes locked and immutable preventing code from accidentally changing it on the fly.

 - **Zero Reserved Words**. Most configuration systems have a set of reserved words that cannot be used in top level configuration. Words like "init" or "config".  AwesomeConfig doesn't do that. Because of how it is written and designed, any valid javascript property name can be used.

 - **Multiple Sources**. Provide configuration as a plain JavaScript object, or as a filename for AwesomeConfig to load, or as a directory which AwesomeConfig will iterate. You can add as many configurations as you like before you start and AwesomeConfig will merge them all together for an unified view.

 - **Custom Notation**. You can configure using JavaScript objects, JSON, or using AwesomeConfig's custom notation.  AwesomeConfig's Custom Notation is JSON based (and supports JSON within it) but also allows for key/value pairs, comments, conditions, and a lot of other little niceties that JSON just cannot do.

 - **Variables**. Use a variable in one part of your configuration to copy the value from another part of the configuration. This is especially useful with multiple configuration sources, conditions, and placeholders.

 - **Conditions**. A Condition can mark a block of configuration as only applicable if the given condition is true.  This allows you to isolate parts of your configuration to apply only under certain circumstances.  Conditions can be based on environment variables, hostnames, OS type, number of CPUs, etc.

 - **Placeholders**. A placeholder marks a configuration value as being provided later via variables or conditions.  If you start AwesomeConfig after adding all your configuration and there remains any unresolved placeholders, AwesomeConfig will let you know.

 - **Namespaces**. In some circumstances separate configurations need to be used in a single application.  Namespaces provide the ability to create isolated instances of AwesomeConfig, but still have access to those configurations without having to pass a configuration object around.

 - **No External Dependencies**. AwesomeConfig is written and maintained by The Awesome Engineering Company and has no dependency that was not written by us. This means consistency of code throughout the product and zero dependencies that were not written by us.  This means safer code and better support for you and your product.

 - **Free and Open**. AwesomeConfig is released under the MIT License and complete free to use and modify.

## Getting Started

AwesomeConfig is super easy to use.

#### 1). Install it.

```shell
npm install @awesomeeng/awesome-config
```

#### 2). Require it.

```javascript
let config = require("@awesomeeng/awesome-config");
```

#### 3). Initialize it.

```javascript
config().init();
```

Those of you paying attention will notice that the `init()` function is called not on the config object, but on the execution of the config function as specified thus: `config()`.  This is the trick to how AwesomeConfig gets around having reserved words.  It takes a minute to get used to, but it becomes pretty obvious if you forget and use `config.init()` by mistake.

#### 4). Add Configuration.

With `config().add()` you add one or more configuration blocks to AwesomeConfig.

A configuration block can be...

 - **A JavaScript object**
 ```javascript
 config().add({
 	a: {
 		javascript: "Object"
 	}
 });
 ```

 - or **A JSON String**
 ```javascript
 config().add(`
 	"or": {
 		"a": {
 			"string": "of JSON"
 		}
 	}
 `);
 ```

 - or **An AwesomeConfig Notation String**
 ```javascript
 config().add(`
	or.use.our.custom.notation: "which allows"
 	json.or: {
 		key: {
 			value: "pairs"
 		}
 	}
 `);
 ```

 - or **A Filename**
 ```javascript
 config().add("./or-config-files.json");
 ```

 - or **A Directory**
 ```javascript
 config().add("./or-config-directories");
 ```

You can call `config().add()` as many times as you want adding as many configuration blocks as you want.  When AwesomeConfig is started (coming up in the next section), AwesomeConfig takes all of the configuration objects and merges them together into a single unified configuration.

Again, you will notice that we are using `config()` instead of `config` when adding our configuration.  A good rule of thumb to remember is if you are calling a function on configuration like `init()` or `add()` or `start()`, you do it on the `config()` execution.

#### 5). Start it.
```javascript
config().start();
```

After all your configuration blocks have been added, you start AwesomeConfig.  Once `start()` is called your configuration merges together into a single unified view, all variables and conditions are resolved, and the entire unified configuration is made immutable.

#### 6). Use it!
```javascript
console.log(config.a.javascript); // "Object"
console.log(config.or.use.our.custom.notation); // "which allows"
```

The `config` object we required earlier now has access to the unified config and functions just like any JavaScript object would.

Additionally you can use it in any other module working in the same process:
```javascript
let config = require("@awesoemeng/awesome-config");
console.log(config.json.or.key.value); // "pairs"
```

## AwesomeConfig Notation

AwesomeConfig supports configuration written as JSON or AwesomeConfig Notation.  And while you are perfectly free to use JSON as your configuration language, you will quickly notice JSON's many shortcomings.  For example, JSON does not allow at all for comments within the JSON at all.

```json
{
	"a": {
		"b": {
			"c": "This is C"
		},
		"d": "This is D",
	},
	"e": {
		"f": "This is F"
	}
}
```

Instead, consider using AwesomeConfig notation. You can use JSON just fine, but AwesomeConfig Notation also does so much more.

```text
/*
	Add Comments to your config!
 */

// Use JSON
{
	"a": {
		"b": {
			"c": "This is C"
		}
	}
}

// or key/value pairs
a.d: "This is D"

e = This is E
```

AwesomeConfig Notation allows you to use JSON blocks or Key/Value pairs interchangeably.  You can even have a key/value pair that equals JSON. Also, AwesomeConfig is much more forgiving than JSON, so if you forget a comma or quotes around a String, AwesomeConfig Notation still allows that.

Want Comments? AwesomeConfig Notation support line comments with `//` or `#` or block comments with `/* ... comment ... */`.

AwesomeConfig also allows for Conditions which allow you to specify certain conditions under which a section of configuration would apply.  More on that in a second.

## Variables

One particularly unique point to AwesomeConfig (both JSON and AwesomeConfig Notation) is it allows the use of Variables to reference one part of configuration from another part of the configuration. Variables can be used in JSON or AwesomeConfig Notation.

A Variable has the form `${path}` where `path` is the dot notation path to the other part of config you want to reference.  For example, if you had a configuration like:

```text
a:  {
	b: {
		c: "This is C"
	}
}
d: ${a.b.c}
```

When your configuration is started `d` would be equal to `"This is C"`.

Variables work by copying the value at the path specified to the location where they are used.  If a variable is the entire string value where they are used, the type (boolean, number, string) is carried along with it.  If a variable is not an entire replacement, it is string concatenated with what is before.  A great example of variables in use is with URLs and hostnames:

```text
http: {
	hostname: "localhost",
	port: 4000
	path: "/test",
	url: "http://${http.hostname}:${http.port}${http.path}"
}
```

In the case of `http.url` the resulting value is a concatenation of `http.hostname`, `http.port`, and `http.path`, resulting in a single URL string.

## Conditions

Conditions, particularly when used with AwesomeConfig Notation and Variables provide a means to selectively apply a configuration based on some external state, like an environment variable, hostname, date, etc.

Here's an example:

```text
http: {
	hostname: ${hostname},
	port: ${port}
	path: "/test",
	url: "http://${http.hostname}:${http.port}${http.path}"
}

[env.executionEnviron=="development" or env.executionEnviron==""]
hostname: localhost
port: 4000

[env.executionEnviron=="test"]
hostname: test.awesomeneg.com
port: 8080

[env.executionEnviron=="development"]
hostname: awesomeeng.com
port: 80
```

In the above example, the value of the environment variable `executionEnviron` drives how the configuration is applied.  The `hostname` and `port` of the application changes based on this environment value, thus allowing the `http.url` to in turn change.

From this brief example, one can really see how powerful conditions can be, especially when coupled with variables. They give you a flexibility that no other configuration system has ever even tried, the ability to change your configuration without relying on complex code.

## Documentation

That's the basics of AwesomeConfig, but there is of course a lot more to it.

At this point, we suggest you check the [project readme](https://github.com/awesomeeng/awesome-config) out. Additionally there is specific documentation for Variables and Placeholders, Conditions, and the like.

 - [Read Me First!](https://github.com/awesomeeng/awesome-config)
 - [Understanding Merging](https://github.com/awesomeeng/awesome-config/blob/master/docs/Merging.md)
 - [Variables and Placeholders](https://github.com/awesomeeng/awesome-config/blob/master/docs/VariablesAndPlaceholders.md)
 - [Condition Expressions](https://github.com/awesomeeng/awesome-config/blob/master/docs/Conditions.md)

## AwesomeStack

AwesomeConfig is one part of the free and open source set of libraries called AwesomeStack for rapidly building enterprise ready nodejs applications.  Each library is written to provide a stable, performant, part of your application stack that can be used on its own or as part of the greater AwesomeStack setup.

AwesomeStack includes...

 - **[AwesomeServer](https://github.com/awesomeeng/awesome-server)** - A HTTP/HTTPS/HTTP2 API Server focused on implementing API endpoints.

 - **[AwesomeLog](https://github.com/awesomeeng/awesome-log)** - Performant Logging for your application needs.

 - **[AwesomeConfig](https://github.com/awesomeeng/awesome-config)** - Powerful configuration for your application.

 - **[AwesomeCLI](https://github.com/awesomeeng/awesome-cli)** - Rapidly implement Command Line Interfaces (CLI) for your application.

All AwesomeStack libraries and AwesomeStack itself is completely free and open source (MIT license) and has zero external dependencies. This means you can have confidence in your stack and not spend time worrying about licensing and code changing out from under you. Additionally, AwesomeStack and all of is components are maintained by The Awesome Engineering Company ensuring you a single point of contact and responsibility and unified support for your entire application.

You can learn more about AwesomeStack here: https://github.com/awesomeeng/awesome-stack
