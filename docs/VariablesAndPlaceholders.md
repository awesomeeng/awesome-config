# [AwesomeConfig](../README.md) > Variables and Placeholders

Two features specific to AwesomeConfig are Variables and Placeholders.

## Variables

A variable lets you reference one part of your configuration from another. This can be useful to reuse configuration from one part in a different part. It can cut down on typing, reduce redundant configuration, and ensure consistency across your configurtion.

```
scheme: https
hostname: localhost
port:
url: ${scheme}://${hostname}:${port}
```

Variables are really useful when used in conjunction with conditions. Conditions let you set configuration based on some external value (an environment variable, the OS type, etc.)  Here's an example:

```
os: Unknown
os_string: "Your Operating System is ${os}."

[os:type=="Windows"]
os: Windows

[os:type=="Darwin"]
os: OSX

[os:type==="Linux"]
os: Linux
```

In the example, if the `os:type` value matches one of our three types, the `os` value get set. The os_string variable is resolved later and because the correct string like "Your Operating SYstem is Linux."

A variable has the form open curly brace "{" character, followed by a reference path, followed by a close curly brace "}" character. The reference path is standard JavaScript dot notation for a javascript object. You can reference specific array cells using the cell position in the dot notation: `someArray.0`.

Variable resolution occurs after all all the different configurations have been merged together. The resulting configuration object is iterated and any occurance of a variable (of the forms `${xyz.abc.def}`) is replaced with the actual value for the given key (so the actual value of `xyz.abc.def`). Variables allow you to refer to one part of configuration in another part of configuration.

If a variable is referenced but does not exist during resolution, an exception is thrown.

You can use a variable anywhere you would have a value.  In key/value pairs you can simple have the variable in place of the string; in JSON blocks you should wrap the variable in quotes like `"${blah}"` so the JSON will validate.

Variables get replaced by the exact content they are referencing.  If the variable is the entire content of the string, it will replace the string with the type of the resolved variable.  However, if the variable is only a portion of the content, it will **string concatenate** the contents together.

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

Placeholders are ways of marking a certain value in your configuration as required to be replaced by a later configuration. Once everything is merged and all variables are resolve, AwesomeConfig iterates the configuration object for any placeholder objects and throws an exception if any are found.

In this example

```
let config = require("@awesomeeng/awesome-config");
config().init();

// configuration one
config().add({
	one: 1
	three: "<<REPLACE ME>>"
})

// configuration two
config().add({
	two: 2
	three: "three"
})

config().start();
```

Configuration one has a placeholder for its `three` property.  Configuration two replaces it and thus during merge the placeholder is removed.

Placeholders are really useful when used with conditions and when allowing outside parties to your application to provide thier own configuration. For example, if you provide a base default configuration, but let your customers provide a configuration that could override the defaults.
