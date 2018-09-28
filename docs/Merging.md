# [AwesomeConfig](../README.md) > Understanding Merging

This articles describes how AwesomeConfig merges different configurations together to produce the final configuration view. This process occurs whenever you call `config().start()` and takes into account the added configurations and their conditions.

## An Example

Consider the following example:

```
let config = require("@awesomeeng/awesome-config");
config().init();

// configuration one
config().add({
	one: 1
	three: 3
})

// configuration two
config().add({
	two: 2
	three: "three"
})

config().start();
```

In our example, our final configuration object looks like this:

```
{
	one: 1,
	two: 2,
	three: "three"
}
```

How it gets there, is important to understand and the subject of this document.

## Merge Process

When you add a configuration via `config().add(...)` it reads the configuration, parses it (if necessary), and creates one or more ConfigSource objects. (A single add produces at least one ConfigSoruce object and in some cases can produce multiple ConfigSource objects.) A ConfigSource contains the origin of the add operation (filename or line number), any conditions being applied to the ConfigSource, and a plain JavaScript Object representing the configuration data.

When `config().start()` is called it does four very important things:

 1. Creates a root configuration object.

 2. It iterates all ConfigSource object in the order they were added. If a ConfigSource conditions resolve truthfully (or it has no conditions), the ConfigSource configuration data is merged with the root configuration object. (More on this below.)

 3. The configuration object is then iterated and any occurance of a variable is resolved.

 4. After resolution the configuration object is iterated a second time and if any placeholders are found, and exception is thrown.

 5. Finally, the configuation object is frozen to prevent any mutations from occuring as these are not allowed once config is started.

The resulting configuration object is the final configuration view that is available for quering against when you do something like `config.one.two.three`.

## The Rules of Merging

Our second step in the merge process considers each ConfigSrouce object one after the other. If the conditions of the ConfigSource evalutes to true, the ConfigSource configuratino data is merged with the configuration object.

How the configuration object and th configuration data is merged is important to understand and we break this down here.

First, lets set our common language

 - **configuration object** the current configuration, which is a product of merging all previous ConfigSource objects.
 - **source object** the current ConfigSource data we are trying to merge.

With that out of the way, the process for merging the source object with the configuration object goes as following...

 - For each key in the source object and its value...
   - If there is no corresponding key in the configuration object, add it to the configuration object.
   - If there is a corresponding key in the configuration object, consider the current value in the configuration object, which we will call the current configuration object value.
     - If the current configuration object value is an Array and the source object value IS an Array, concatenate the two arrays.
	 - If the current configuration object value is an Array and the source object value IS NOT an Array, overwrite the current configuration object value with the source object value.
	 - If the current confgiruation object value is an Object and the source object value IS an object, merge them together, as per these rules.
	 - If the current configuration object value is any other type, overwrite the current configuration object value with the source object value.

The above can provide a few gotchas, so please keep in mind...

 - Arrays merged with Arrays are always concatenated, meaning it is impossible to overwrite an array entirely.
 - Objects merged with Objects are always merged together.
 - Anything else is overwritten.

It is also important to note that the order of your configuration is VERY IMPORTANT. LAter configuration will always overwrite earlier configuration.

## Variable Resoluton

Variable resolution occurs after all all the different configurations have been merged together. The resulting configuration object is iterated and any occurance of a variable (of the forms `${xyz.abc.def}`) is replaced with the actual value for the given key (so the actual value of `xyz.abc.def`). Variables allow you to refer to one part of configuration in another part of configuration.

Variables are really useful when used in conjunction with conditions. (They are also helpful in reducing typing in configuration and re-use).

If a variable is referenced but does not exist during resolution, an exception is thrown.

## Placeholder Checking

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

## Freezing

The last step in our Merge Process is to freeze the resulting configuration object. This is done via JavaScripts Object.freeze() method being applied to item in the configuration object.  This prevents the root object or any descendant from being mutated.
