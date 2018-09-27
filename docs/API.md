<a name="AwesomeConfig"></a>

## AwesomeConfig : <code>object</code>
**Kind**: global namespace  
**Summary**: The AwesomeConfig Object.

The AwesomeConfig Object returned whenever you
`require("@awesomeeng/awesome-config")` or
`require("@awesomeeng/awesome-config")("namespace")`.

Once required, config can be referenced in one of two ways:

 1. To reference config management functions, you first call config
 as a function: `config().xyz`

 2. To reference config values, which we will see below, you reference
 config as an object: `config.xyz`

To use AwesomeConfig begin by calling `config().init()`.

```
let config = require("@awesomeeng/awesome-config");
config().init();
```

Once initialized you can add configuration details to the config object.

```
let config = require("@awesomeeng/awesome-config");
config().init();
config().add(...);
```

You can add config in a variety of ways:

- **config().add(object)** - You may add a plain JavaScript object as
  configuration and it will be merged with the configuration.

- **config().add(string)** - You may add a string as configuration data
  and it will be run through the configuration parser and the
  resulting data will be merged with the configuration.

- **config().add(filename)** - You may add a fully resolved filename and
  the content of the file will be read in, run through the
  configuration parser, and the resulting data will be merged
  with the configuration.

- **config().add(directory)** - You may add a fully resolved directory and
  the directory will be examined for .config files. If any are
  found, each file will be read ine, run through the configuration
  parser, and the resulting data will be merged with the
  configuration.

After all your configuration has been added, you can start config with
`config().start()`. Once config has been started, you cannot add any more
confguration properties to it, so make sure everything is added before
starting.

Please see (AwesomeConfig's documentation)[https://github.com/awesomeeng/AwesomeConfig]
for more details.  

* [AwesomeConfig](#AwesomeConfig) : <code>object</code>
    * [.initialized](#AwesomeConfig.initialized) ⇒ <code>boolean</code>
    * [.started](#AwesomeConfig.started) ⇒ <code>boolean</code>
    * [.sources](#AwesomeConfig.sources) ⇒ <code>Array.&lt;string&gt;</code>
    * [.init()](#AwesomeConfig.init) ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
    * [.start()](#AwesomeConfig.start) ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
    * [.stop()](#AwesomeConfig.stop) ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
    * [.add(content, defaultConditions)](#AwesomeConfig.add) ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
    * [.reset()](#AwesomeConfig.reset) ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)


* * *

<a name="AwesomeConfig.initialized"></a>

### AwesomeConfig.initialized ⇒ <code>boolean</code>
Returns true if `config().init()` has been called.

**Kind**: static property of [<code>AwesomeConfig</code>](#AwesomeConfig)  

* * *

<a name="AwesomeConfig.started"></a>

### AwesomeConfig.started ⇒ <code>boolean</code>
Returns true if `config().start()` has been called.

**Kind**: static property of [<code>AwesomeConfig</code>](#AwesomeConfig)  

* * *

<a name="AwesomeConfig.sources"></a>

### AwesomeConfig.sources ⇒ <code>Array.&lt;string&gt;</code>
Returns an Array of String with each string representing the origin of
each configuration that was added via `config().add(...)`.

**Kind**: static property of [<code>AwesomeConfig</code>](#AwesomeConfig)  

* * *

<a name="AwesomeConfig.init"></a>

### AwesomeConfig.init() ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
Initialize AwesomeConfig for usage. To call this method must be
done by callign your config object as a method and then chaining
the `init` function from that, as shown here:

```
config().init();
```

Calling this method indicates to AwesomeConfig that you are ready
to start adding configuration via `config().add(...)`, but not
yet ready to use it.  In order to start using config, call
`config().start()` to signal that you are ready to start
accessing configuration.

Subsequent calls to `init` will not have any effect, only the
first `config().init()`

**Kind**: static method of [<code>AwesomeConfig</code>](#AwesomeConfig)  

* * *

<a name="AwesomeConfig.start"></a>

### AwesomeConfig.start() ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
Signal to AwesomeConfig that all configuration has been added via
`config().add(...)` and you are ready to start accessing configuration.

Start actually performs several function important to understanding config:

First, it takes all added configurations and merges them into a single
unified view.  This takes into account the order in which configuration
was added with later adds overwriting earlier adds.

Also, only configurations whose conditions resolve truthy are merged.

Second, after merging, all variables are resolved and any variable that
does not resolve throws an exception.

Third, after variable resolution, all values are checked for placeholders.
If any placeholders are found, an exception is thrown.

Once all three of these actions are done and so long as no exceptions
were thrown, your configuration is now available for usage.

**Kind**: static method of [<code>AwesomeConfig</code>](#AwesomeConfig)  

* * *

<a name="AwesomeConfig.stop"></a>

### AwesomeConfig.stop() ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
Takes AwesomeConfig out of started mode an allows for more configurations
to be added via `config().add(...)`. `config().start()` can then be called
again to begin using config.

**Kind**: static method of [<code>AwesomeConfig</code>](#AwesomeConfig)  

* * *

<a name="AwesomeConfig.add"></a>

### AwesomeConfig.add(content, defaultConditions) ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
The `config()add()` method has four different usage forms, each unique in thier
own right:

- **config().add(object)** - You may add a plain JavaScript object as
  configuration and it will be merged with the configuration.

- **config().add(string)** - You may add a string as configuration data
  and it will be run through the configuration parser and the
  resulting data will be merged with the configuration.

- **config().add(filename)** - You may add a fully resolved filename and
  the content of the file will be read in, run through the
  configuration parser, and the resulting data will be merged
  with the configuration.

- **config().add(directory)** - You may add a fully resolved directory and
  the directory will be examined for .config files. If any are
  found, each file will be read ine, run through the configuration
  parser, and the resulting data will be merged with the
  configuration.

You may pass an optional string of *conditions* to add that will be
applied to determining if the content is merged or not.  See the
conditions section for a lot more details about how they work.

**Kind**: static method of [<code>AwesomeConfig</code>](#AwesomeConfig)  

| Param | Type |
| --- | --- |
| content | <code>object</code> \| <code>string</code> | 
| defaultConditions | <code>string</code> | 


* * *

<a name="AwesomeConfig.reset"></a>

### AwesomeConfig.reset() ⇒ [<code>AwesomeConfig</code>](#AwesomeConfig)
`config().reset()` can be called when AwesomeConfig is initialized but stopped
to remove all prior configuration. It creates a completely clean slate.

**Kind**: static method of [<code>AwesomeConfig</code>](#AwesomeConfig)  

* * *

