# [AwesomeConfig](../README.md) > Introducing AwesomeConfig

AwesomeConfig is a powerful configuration system for building enterprise ready node.js applications. It provides a unified, transparent configuration object to your application based on configuration files or objects that you define.  It includes support for conditional configuration based on external values like environment variables, hostname, or OS; variables to reference one part of your configuration from another; and lots more.

You simply add configuration to AwesomeConfig and start AwesomeConfig and then you are good to start using your configuration anywhere in your code. No configuration object to pass around, no mutations to worry about.

Internally, AwesomeConfig takes all your configuration parts (objects, files, directories, etc.) and merges them together to provide a single, unified, immutable configuration object.  This object is essentially a plain javascript object that is exposed directly as AwesomeConfig and thus globally available simply by requiring AwesomeConfig.

Additionally, AwesomeConfig offers some really interesting features that can make your configuration really shine: Variables allow you reference one part of your configuration from another path of you configuration; Conditions allow you to include or exclude sections of configuration depending on external items like environment varaibles, hostnames, OS type, etc.; Placeholders let you flag some variables to be required before the system can properly start forcing downstream users to provide the details. Altogether variables, conditions, and placeholders allow you to write highly flexible, detailed configuration for just about any project need.

## Key Features

 - **No Object to Pass**. Simply require AwesomeConfig once started and you have access to all the configuration data. No creating a configuration object and passing it from function to function.

 - **A Single Unified View**. AwesomeConfig provides a single view of all yuour configuration data, no matter how many configuration objects, files, or directories you use.  This means you can keep your configuration separate and readable.

 - **Immutable**. Once started the entire configuration becomes locked and immutable preventing code from accidentally changing it on the fly.

 - **Zero Reserved Words**. Most configuration systems have a set of reserved words that cannot be used in top level configuration. Words like "init" or "config".  AwesomeConfig doesn't do that. Because of how it is written and designed, any valid javascript value name can be used.

 - **Multiple Sources**. Provide configuration as plain JavaScript objects, or as a filename for AwesomeConfig to load, or as a directory which AwesomeConfig will iterate and load any file that ends in `.cfg`. You can add as many configurations as you like before you start and AwesomeConfig will merge them all together for it's unified view.

 - **Custom Notation**. You can configure using JavaScript objects, JSON, or using AwesomeConfig's custom notation.  AwesomeConfig's Custom Notation is JSON based (and supports JSON within it) but also allows for key/value pairs, comments, conditions, and a lot of other little niceties that JSON just cannot do.

 - **Variables**. Use a variable in one part of your configuration to copy the value from another part of the configuration. This is especially useful with multiple configuration sources, conditions, and placeholders.

 - **Conditions**. A Condition can mark a section of configuration as only applicable if the given condition is true.  This allows your to isolate parts of your configuration to apply only under certain circumstances.  Conditions can be based on environment variables, hostnames, OS type, number of CPUs, etc.

 - **Placeholders**. A placeholder marks a configuration value as to be provided later via variables or condition.  If you start AwesomeConfig after adding all your configuration and there remains any unresolved placeholders, AwesomeConfig will let you know.

 - **Namespace**. In some circumstances multiple configurations need to be used in a single application.  Namespaces provide the ability to create isolated instances of AwesomeConfig, but still have access to the configuration without having to pass a configuration object around.

 - **No External Dependencies**. AwesomeConfig is written and maintained by The Awesome Engineering Company and has no dependency that was not written by us. This means consistency of code throughout the product and that we have zero dependencies that were not written inhouse.  This means safer code for you and your product.

 - **Free and Open**. AwesomeConfig is released under the MIT licene and complete free to use and modify.

## Getting Started

AwesomeConfig is super easy to use.

#### 1). Install It.

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

Those of you paying attention will notice that the `init()` function is called not on the config object, but on the execution of the config function as specified thus: `config()`.  This is the tricky to how AwesomeConfig gets around having reserved words.  It takes a minute to get used to, but it becomes pretty obvious if you forget and use `config.init()` by mistake.

#### 4). Add Configuration.
```javascript
config().add({
	a: {
		javascript: "Object"
	}
});
config().add(`
	"or": {
		"a": {
			"string": "of JSON"
		}
	}
`);
config().add(`
	or.use.our.custom.notation: "which allows"
	json.or: {
		key: {
			value: "pairs"
		}
	}
`);
config().add("./or-config-files.json");
config().add("./or-config-directories");
```

With `config().add()` you add one or more configuration blocks to AwesomeConfig.  A configuration block can be...

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

#### 5). Start It.
```javascript
config().start();
```

After all your configuration blocks have been added, you start AwesomeConfig.  Once `start()` is called your configuration merge together into a single unified view, all variables and conditions are resolved, and the entire unified configuration is made immutable.

#### 6). Use It!
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

## Documentation

That's the basics of AwesomeConfig, but there is of course a lot more to it.

At this point, we suggest you check the [project readme](https://github.com/awesomeeng/awesome-config) out. Additionally there is specific documentation for Variables and Placeholders, Conditions, and the like.

- [Understanding Merging](https://github.com/awesomeeng/awesome-config)
- [Understanding Merging](https://github.com/awesomeeng/awesome-config/blob/master/docs/Merging.md)
- [Variables and Placeholders](https://github.com/awesomeeng/awesome-config/blob/master/docs/VariablesAndPlaceholders.md)
- [Condition Expressions](https://github.com/awesomeeng/awesome-config/blob/master/docs/Conditions.md)

## AwesomeStack

AwesomeStack is a free and open source set of libraries for rapidly building enterprise ready nodejs applications, of which, AwesomeConfig is one part.  Each library is written to provide a stable, performant, part of your application stack that can be used on its own, or part of the greater AwesomeStack setup.

AwesomeStack includes...

 - **[AwesomeServer](https://github.com/awesomeeng/awesome-server)** - A http/https/http2 API Server focused on implementing API end points.

 - **[AwesomeLog](https://github.com/awesomeeng/awesome-log)** - Performant Logging for your application needs.

 - **[AwesomeConfig](https://github.com/awesomeeng/awesome-config)** - Powerful configuration for your application.

 - **[AwesomeCLI](https://github.com/awesomeeng/awesome-cli)** - Rapidly implement Command Line Interfaces (CLI) for your application.

All AwesomeStack libraries and AwesomeStack itself is completely free and open source (MIT license), maintained by The Awesome Engineering Company, and has zero external dependencies. This means you can have confidence in your stack and not spend time worrying about licensing and code changing out from under your.

You can learn more about AwesomeStack here: https://github.com/awesomeeng/awesome-stack
