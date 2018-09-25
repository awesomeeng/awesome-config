# AwesomeConfig

AwesomeConfig is a powerful configuration system for building enterpreise ready node.js application. It provides scoped, transparent configuration objects to your application based on configuration files or objects that you define.  It includes support for conditional configuration sections based on external things like environment variables, hostname, or OS; variables to reference one part of your configuration from another; and lots more.

## Features

AwesomeConfig provides...
 - Add configuration from files, directories, as JSON, or as a plain javascript objects;
 - Uses JSON notation or our custom notation that supports mixing JSON style config and key/value style config;
 - Configuration is immutable once started;
 - Configuration is exposed as a plain JavaScript object for easy usage;
 - Configuration is a singleton so no passing your config object around manually;
 - Configuration is scoped to allow for multiple libraries to have separate configurations;
 - Configuration Variables allow cross referencing other parts of your configuration;
 - Configuration Conditions allow you to toggle on/off different parts of your configuration based on external items like hostname, OS, or environment variables.
 - Configuration Plcaeholders to force users to provide key configuration values.
 - No reserved words at all!

## Contents
 - [Installation](#installation)
 - [Setup](#setup)
 - [Adding Configurations](#adding-configuration)
 - [Configuration Notation](#configuration-notation)
 - [Scope](#scope)
 - [Variables](#variables)
 - [Placeholders](#placeholders)
 - [Conditions](#conditions)
 - [Documentation](#documentation)
 - [Examples](#examples)
 - [Awesome Engineering](#the-awesome-engineering-company)
 - [Support and Help](#support-and-help)
 - [License](#license)

## Installation

Couldn't be easier.
```
npm install --save @awesomeeng/awesome-config
```

## Setup

To use AwesomeConifg you need to go through four steps to set it up and add configuration into it. These four steps should be done at the top module of your project, or as close to the top as possible.  Once AwesomeConfig is started, all subsquent requires of config (aka `const config = require("@awesomeeng/awesome-config")`) will return the fully started configuration. This allows you to setup your config at the top of your application and then just use it in subsequent parts of your application without needing to pass it around manually.

### Initial Setup

You initially Setup configuration with 4 easy steps...

1). Require AwesomeConfig:

```
const config = require("@awesomeeng/awesome-config");
```

2). Initialize AwesomeConfig. This setups the configuration scope (see [Scope](#scope) later) and prepares configuration for additions.

```
const config = require("@awesomeeng/awesome-config");
config().init();
```

**Note that we call `config()` when we are referencing our configuration meta systems like `init()` or 'start()'. We use just `config` when we are referencing actual configuration properties.  This separation allows AwesomeConfig to have zero reserved words and lets you express your configuration however you want.**

3). Add zero or more configurations:

```
const config = require("@awesomeeng/awesome-config");
config().init();
config().add(someconfig);
```

There are a variety of ways to add configurations, so make sure to read the [Adding Configurations](#adding-configuration) section below.

4). Start AwesomeConfig:

```
const config = require("@awesomeeng/awesome-config");
config().init();
config().add(someconfig);
config().start();
```

Once `config().start()` is called your configuration gets merged into a single configuration view based on any conditions you specified, variables are resolved, placeholders are checked, and the entire resulting structure is made immutable.

### Usage

You access your configuration as you would any JavaScript object. Say you have a configuration property called "one.two.three".  Simply access it thus:

```
config.one.two.three
```

If the property doesnt exist or any of its ancestors ("one" for example) does not exist, the property will return `undefined`.

Regardless of where you require AwesomeConfig, it exposes the same configuration details. This lets you initialize and start config once in your application, but access it from anywhere without the need to pass the config object around.

```
const config = require("@awesomeeng/awesome-config");
console.log(config.this.is.cool);
```

There is a little more nuance to it, but that is basically all there is to using AwesomeConfig.

## Adding Configurations

You can add configuration in four basic ways: A JavaScript Object, a JSON String, a resolved filename, or a resolved directory. Each approach has
slight differences to what happens. You may also add as many configurations you want before calling `config().start()`.

When `config().start()` is called, all of the added configurations are merged together into a single configuration view.  The order they are merged is the order in which they are added, thus things added later will overwrite things added earlier if they have the same property names. This intentionally lets you provide some values, but then override them later as needed.

### Adding A JavaScrpt Object Configuration

You may add a JavaScript object as a configuration.  The object must be a plain JavaScript object and cannot be an Array or other primative.

```
config().add({
	one: {
		two: {
			three: 123
		}
	},
	four: {
		five: 45
	}
});
```

This would result in the following properties:

```
config.one.two.three === 123
config.four.five === 45
```

### Adding A JSON String Configuration

You can add a JSON String. AwesomeConfig will parse the JSON using `JSON.parse()` and the resulting object will be added as if `config().add(object)` was called.  The parsed JSON must return a JavaScript object and cannot return an Array or other Primative.

```
config().add("{\"one\":1}");
```

This would result in the following properties:

```
config.one === 1
```

### Adding A Filename Configuration

You may pass a filename into `config().add()` and the file contents will be loaded, parsed using the AwesomeConfig Notation parser (see [Configuration Notation](#configuration-notation) below), and the resulting objects and conditions are added.

The passed filename is resolved relative to the current working directory, or the calling module if not found in the current working directory. If the file is not found or otherwise unreadable, an exception will be thrown.

```
config().add("./MyConfig.cfg");
```

### Adding A Directory Configuration

Passing a directory into `config().add()` will result in all files within the directory that match `*.cfg` being loaded (via `config().add(filename)` from above). The order the files are loaded is based on their alphabetical order in the directory.

### Adding with Conditions

The second argument in `config().add()` may specify a condition string that is applied as the default conditions to the configuration being added. This allows you to control configurations more programatically.

```
config().add("./MyConfig.cfg","hostname==localhost and os=windows");
```

See [Conditions](#conditions) below for more information on condition strings.

## Configuration Notation

AwesomeConfig configuration files use a custom configuration notation that is a hybrid of both JSON and key/value pairs.  If you want to just use pure JSON that is fine as well. However, AwesomeConfig notation gives you a little bit more such as comments, conditions, key/values, variables, placeholders, and mixing key/values with json.

### Example

Here's an example configuration file:

```
//
// this is an example configuration.
//

one.two.three: 123
four.five: {
	six: {
		seven: some string value # and a comment
	}
}
eight: [{
	nine: 89
}]
```

This configuration would result in the following properties:

```
one.two.three = 123
four.five.six.seven = "some string value"
eight.0.nine = 89
```

In the example you will notice a few things going on:

First we have a standard key/value pair in "one.two.three". The dot notation is used to separate the path into levels.  The key/value pair notation form shave a lot of space and creates cleaner configurations. If we wanted to write the same using JSON it would look like this:

```
{
	"one": {
		"two": {
			"three": 123
		}
	}
}
```

Second, we have a key/value pair again, but the value side is a JSON object. This mixing of key/value and JSON can result in very clear, easy to read configurations.  Also, you might notice that the quotes around the key names are optional.

Finally, we have a key in "eight" which takes an array as its argument, which in turn has some JSON inside of it.

### Structure

An AwesomeConfig file has the following structure:

```
config = [comment|json_block|key_value_pair|condition]*
```

That is it may at the top level have a comment, a json block, a key/value pair, or a condition.  We look at each of these below...

### Comments

```
comment = [double_slash_comment|hash_comment|multi_line_comment]
```

AwesomeConfig files support three different types of comments:

 - Double Slash Comments: starts with two forward slash characters ("//") and terminate at a newline character.
 	```
	// this is a double slash comment
	blah=123 // and so is this
	```
 - Hash Comments start with the hash character "#" (sometimes called the pound sign) and terminate at a newline character.
 	```
	# this is a hash comment
	blah=123 # and so is this
	```
 - Multi-Line Comments start with a "/*" and run until a corresponding "*/" string is detected.  Multi-Line comments can span multiple lines and are great for large blocks of comment text.
 	```
 	/*
 		This is a
		multiline
		comment.
 	 */
 	```

### JSON Block

```
json_block = "{" [json] "}"
```

A JSON block is a valid JSON string that begins with the open brace character ("{") and ends with the close brace character ("}"). Array JSON blocks are not supported at the top level.

### Key/Value Pairs

```
key_value_pair = <key> <assignment_operator> <value>
```

A key/value pair matches some key or key path with a value.  The following are all examples of key/value pairs...

```
one: 1
two = two
three.four = {
	five: 345
}
```

#### Keys

A key consist of one or more letter ("Abc"), digit ("123"), underscore ("_"), dash ("-"), or dollar sign ("$") characters. No other character is a valid key and it would be best to avoid them.

You can use the dot character to separate keys into multiple level keys, or a key path. `one.two.three` is a key path with three levels of nesting where "three" is a child of "two" which in turn is a child of "one".

#### Assignment Operators

In key/value pairs you may use either the color (":") or equal ("=") characters as assignment characters. So both are valid:

```
one.two: 12
one.two=12
```

#### Values

```
value = ["null"|boolean|number|string|quoted_string|array|object]
```

A value may be a null, a boolean, a number, a string, a quoted string, an array, or an object.

 - **null**: the value `null`. This is case sensative, so make sure it is all lower case.
 	```
	one.two: null
	```

 - **boolean**: the values `true` or `false`. These are case sensative, so make sure they are all lower case.
 	```
	one.two: true
	one.two: false
	```
 - **number**: Any valid number such as 123 or 123.45 or -123.45.
	```
	one.two: 12
	one.two: 0.12
	one.two: -12
	```
 - **string**: A string is any amount of text that is not a boolean or a number.  Strings may be quoted with single ('blah') quotes or double quotes ("blah"). If you are doing a url like (https://google.com) or have a comment chaaracter ("#" or "//" or "/*") in your string, quote it!
	```
	one.two: "onetwo",
	one.two: onetwo,
	one.two: 'onetwo'
	```
 - **Array**: An Array starts with a open bracket ("[") and ends with a close bracket ("]") and contains zero or more values. The values themselves do not need to be of the same type. They roughly adhere to the same types for the values in this section with one exception: strings MUST be quoted. Each value is separated by a comma. Arrays may span multiple lines.
	```
	one.two: []
	one.two: ["asdf"]
	one.two: ["asdf",123,false,{
		four: 124
	}]
	```
 - **Object**: Objects here are the same as JSON blocks described above.  They begin with a open brace ("{") and end with a close brace ("}") character.  Keys do not need to be quoted, but they can be.
	```
	one.two: {
		three: 123
		four: {
			five: "12345"
		}
	}
	```

### Conditions

```
condition = "[" [condition] "]"
```

Conditions describe certain criteria that must be met in order for the configuration that follows to be included when merged (during `config().start()`).  Conditions within the Configuration Notation start with an open brakcet ("[") character and terminate in a close bracket ("]") character. Condition may never be nested in another object like a key/value pair or a JSON block; they may only be used at the top level.

Here's an example:

```
// Example of conditions
one.two: "unknown"

[os:type=windows]
one.two: "windows"

[os:type=linux]
one.two: "unix"

[os:type=darwin] // mac
one.two: "mac"

[]
one.three: 13
```

In AwesomeConfig's Configuration Notation, a condition impacts all of the coniguration that follows it, until a different condition is applied. In the above example, if the OS is "windows" the value of `one.two` after merging will be "windows".

An empty condition `[]` signals that **no condition* applies, thus returning the configuration to the default conditions state.

For more information on condition check out the [Conditions](#conditions) section below.

Note that conditions are only valid in AwesomeConfig Configuration Notation or if you pass them into the `config().add()` method as the second argument.

### Variables and Placeholders

THe configuration format supports both Variables and Placeholders. See the documentation for [Variables](#variables) and [Placeholders](#placeholders) below for more details.

## Scope

In AwesomeConfig, scope defines the space to which a configuation applies.  Because AwesomeConfig is exposed as a singleton and availabe to anything that requires AwesomeConfig (`require("@awesomeeng/awesome-config")`) scope helps to control that.

Any time you call `config().init()` you create a new scope.  Then any module you rely on that requires AwesomeConfig will use that scope unless it has a scope of its own.  Consider the following:

```
// MyMain.js
const config = require("@awesomeeng/awesome-config");
config().init();
config.add({
	one: "main"
});
config.start();

const somemodule = require("./SomeModule.js");
const another = require("./AnotherFile.js");

console.log("MyMain.js",config.one); // outputs "main"

//AnotherFile.js
const config = require("@awesomeeng/awesome-config");

console.log("AnotherFile.js",config.one); // outputs "main"

//SomeModule.js
const config = require("@awesomeeng/awesome-config");
config().init();
config.add({
	one: "module"
});
config.start();

console.log("SomeModule.js",config.one); // outputs "module"
```

SomeModule has a different scope then AnotherFile and MyMain because it called `config().init()` on its own.

This allows modules to implement their own AwesomeConfig setup inside of their modules without worrying about their configuration leaking into other modules or users.

Scope works by comparing the execution stack against the list of modules that called `config().init()`. If the module or one of its ancestors is in that list, that is its scope.

## Variables

Variables allow you to reference one point in configuration from a different part of configuration.  Coupled with [Conditions](#conditions) Variables can be really powerful.

A variable has the form `${path}` where path is some configuration property dot notation path, you might use if you were getting the value itself.

```
one.two: 12
one.three: ${one.two}
one.four: ${one.three}
one.five: "${one.four} and FIVE!"
```

When you call `config().start()` AwesomeConfig merges all the added configurations together to form a single configuration view.  Then it iterates the entire configuration looking for any Variables and replaces those variables with their appropriate values.  You can even have variables that reference variables and so on, as shown in the example above.

If for some reason a variable cannot resolve, you will get an exception immediately.

You can use a variable anywhere you would have a value.  In key/value pairs you can simple have the variable in place of the string; in JSON blocks you should wrap the variable in quotes like `"${blah}"` so the JSON will validate.

Variables get replaced by the exact content they are referencing.  If the variable is the entire content of the string, it will replace the string with the type of the resolved variable as for `one.three` and `one.four` from the example above.  However, if the variable is only a portion of the content, it will **string concatenate** the contents together, as shown in the example above for `one.five` which would return `12 and FIVE!` as a string.

### Special Variables

In addition to referencing specific portions of config using variables, you can also use variables to get a number of special values as described below:

 - **${env:xyz}**: Returns the envionment variables specified, xyz in this case.

 - **${hostname:domain}**: returns the last two parts of the hostname, the "google.com" portion.
 - **${hostname:fqdn}**: same as `${hostname:full}`.
 - **${hostname:full}**: returns the entire hostname string.
 - **${hostname:name}**: Returns the first part of the hostname strig, everything up tot he first dot.

 - **${process:args}**: returns the arguments passed to the process, as a string.
 - **${process:cwd}**: Returns the current working directory.
 - **${process:exec}**: returns the executable (usually "node" or "node.exe") that ran node.
 - **${process:execPath}**: returns the executable (usually "node" or "node.exe") that ran node.
 - **${process:main}**: Returns the script executed by node at startup.
 - **${process:pid}**: returns the process pid.
 - **${process:ppid}**: returns te process parent pid.
 - **${process:script}**: Returns the script executed by node at startup.
 - **${process:version}**: Returns node.js version, as a string.

 - **${os:arch}**: Returns the OS arch string, currently one of the following: arm | arm64 | ia32 | mips | mipsel | ppc | ppc64 | s390 | s390x | x32 | x64
 - **${os:type}**: Returns the OS uname type string; for example "Linux", or "Windows_NT", or "Darwin"
 - **${os:bits}**: Returns the number of bits in the system (32 or 64)
 - **${os:cpus}**: Returns the number of CPUs reported to node.js
 - **${os:home}**: Returns the home directory path.
 - **${os:homedir}**: Returns the home directory path.
 - **${os:platform}**: Returns the OS platform string, currently one of the following:  aix | darwin | freebsd | linux | openbsd | sunos | win32
 - **${os:user}**: Returns the OS family name.
 - **${os:username}**: Returns the OS family name.

 - **${string:encoding}**: Returns the default encoding type for strings, usually "utf-8".
 - **${string:eol}**: Returns the system EOL character like "\n".

## Placeholders

Placeholders are a lot like variables but they are used to mark portions of your configuration that must be completed before the configuration is valid.  Placeholders are a great way of saying that some value in your configuration must be overwritten by a later configuration in order to be valid.  Here's an example:

```
one.two: <<one.two is missing>>
one.three: <<one.three is required for this product.>>
...
one.two: blah
````

A placeholder has the form `<<description>>`. The `description` is used in the event the placeholder is not overwritten in the error message.

In the above example the first instance of `one.two` and the instance of `one.three` both contain placeholders.  Later, `one.two` is overwritten and thus the placeholder is removed.  But `one.three` never gets overwritten (at least in this example) and thus when `config().start()` is called, an exception will occur to indicate that the placeholder has not been replaced.

Placeholders work in conjunction with varaibles really nicely, but they are entirely optional. Use em if you want em.

## Conditions

Conditions describe certain criteria that must be met in order for the configuration it applies to to be included when merged (during `config().start()`). Conditions can be applied as the second argument of `config().add()` or they can be used inline in the AwesomeConfig Configuration Notation (see [Configuration Notation](#configuration-notation) above).

A condition is a string that express one or more conditions that must be met.  Here are some examples:

```
os:name=linux
true
hostname:full=localhost and os:cpus>1
hostname:name=test or hostname:name=dev
(hostname:domain=acme.com and env:target=development) or hostname:full=localhost
```

A conditions support boolean operators like `not` and `and` and `or` as well as grouping with `(condition)`.  Each condition is slightly different in how it works, so we suggest you read the [Condition Expressions](./docs/Conditions.md) documentation to learn more.

## Documentation

 - [Understanding Merging](./docs/Merging.md)
 - [Variables and Placeholder](./docs/VariablesAndPlaceholders.md)
 - [Condition Expressions](./docs/Conditions.md)

 - [API Documentation](./docs/API.md)

## Examples

AwesomeConfig ships with a set of examples for your reference.

 - [Adding Files](./examples/AddFiles): An example of using AwesomeConfig with Confiuration Files.

 - [Adding Directories](./examples/AddDirectories): An example of using AwesomeConfig with a directory of configuration.

 - [Variables, Placeholders, and Conditions](./examples/VarsPlaceholdersConditions): An example of using AwesomeConfig variables, placeholders and conditions.

 - [Understanding Scope](./exmaples/UnderstandingScope): An example of how scope works.

## The Awesome Engineering Company

AwesomeConfig is written and maintained by The Awesome Engineering Company. We belive in building clean, configurable, creative software for engineers and architects and customers.

To learn more about The Awesome Engineering Company and our suite of products, visit us on the web at https://awesomeeng.com.

## Support and Help

## License

AwesomeConfig is released under the MIT License. Please read the  [LICENSE](./LICENSE) file for details.
