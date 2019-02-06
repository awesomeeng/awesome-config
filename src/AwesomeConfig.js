// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const Log = require("@awesomeeng/awesome-log");

const ConfigInstance = require("./ConfigInstance");

const instances = {};

/**
 * @namespace
 * @summary The AwesomeConfig Object.
 *
 * The AwesomeConfig Object returned whenever you
 * `require("@awesomeeng/awesome-config")` or
 * `require("@awesomeeng/awesome-config")("namespace")`.
 *
 * Once required, config can be referenced in one of two ways:
 *
 *  1. To reference config management functions, you first call config
 *  as a function: `config().xyz`
 *
 *  2. To reference config values, which we will see below, you reference
 *  config as an object: `config.xyz`
 *
 * To use AwesomeConfig begin by calling `config().init()`.
 *
 * ```
 * let config = require("@awesomeeng/awesome-config");
 * config().init();
 * ```
 *
 * Once initialized you can add configuration details to the config object.
 *
 * ```
 * let config = require("@awesomeeng/awesome-config");
 * config().init();
 * config().add(...);
 * ```
 *
 * You can add config in a variety of ways:
 *
 * - **config().add(object)** - You may add a plain JavaScript object as
 *   configuration and it will be merged with the configuration.
 *
 * - **config().add(string)** - You may add a string as configuration data
 *   and it will be run through the configuration parser and the
 *   resulting data will be merged with the configuration.
 *
 * - **config().add(filename)** - You may add a fully resolved filename and
 *   the content of the file will be read in, run through the
 *   configuration parser, and the resulting data will be merged
 *   with the configuration.
 *
 * - **config().add(directory)** - You may add a fully resolved directory and
 *   the directory will be examined for .config files. If any are
 *   found, each file will be read ine, run through the configuration
 *   parser, and the resulting data will be merged with the
 *   configuration.
 *
 * After all your configuration has been added, you can start config with
 * `config().start()`. Once config has been started, you cannot add any more
 * confguration properties to it, so make sure everything is added before
 * starting.
 *
 * Please see (AwesomeConfig's documentation)[https://github.com/awesomeeng/AwesomeConfig]
 * for more details.
 *
 * @borrows AwesomeConfigProxy#initialized as initialized
 * @borrows AwesomeConfigProxy#started as started
 * @borrows AwesomeConfigProxy#sources as sources
 *
 * @borrows AwesomeConfigProxy#init as init
 * @borrows AwesomeConfigProxy#start as start
 * @borrows AwesomeConfigProxy#stop as stop
 * @borrows AwesomeConfigProxy#add as add
 * @borrows AwesomeConfigProxy#reset as reset
 *
 */
class AwesomeConfig {
	/**
	 * @private
	 * @constructor
	 */
	constructor() {
		Log.info("Installed.");
		return getInstanceProxy();
	}
}

/**
 * @private
 */
// Internally used to hold the instance information for config.
class AwesomeConfigProxy {
	constructor(instanceName) {
		let me = this;

		me.instanceName = instanceName;

		const has = function has(target,prop) {
			if (!me.instance) return false;
			if (!me.instance.started) return false;

			return me.instance.config[prop]!==undefined;
		};

		const get = function get(target,prop) {
			if (!me.instance) return undefined;
			if (!me.instance.started) return undefined;
			if (!me.instance.config) return undefined;

			if (prop==="toString" || prop==="toJSON") return toJSON;

			if (me.instance.config[prop]===undefined) throw new Error("Missing configuration property '"+prop+"'.");
			return me.instance.config[prop];
		};

		const set = function set() {
			return false;
		};

		const getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target,prop) {
			// me resolve an error with ownKeys requiring a 'prototype' member.
			if (prop==="prototype") return {value: null, writable: false, enumerable: false, configurable: false};

			if (!me.instance) return undefined;
			if (!me.instance.started) return undefined;

			return Object.getOwnPropertyDescriptor(me.instance.config,prop);
		};

		const ownKeys = function ownKeys() {
			// we need to include ["prototype"] or we get wierd proxy errors.
			//
			if (!me.instance) return ["prototype"];
			if (!me.instance.started) return ["prototype"];

			return [].concat(Object.getOwnPropertyNames(me.instance.config),["prototype"]);
		};

		const toJSON = function toJSON() {
			return AwesomeUtils.Object.extend({},me.instance.config);
		};

		let config = function config(target,thisArg,args) {
			let instanceName = args[0] || undefined;

			if (instanceName===undefined) {
				return me;
			}
			else {
				return getInstanceProxy(instanceName);
			}
		};

		return new Proxy(config,{
			has: has,
			get: get,
			set: set,
			getOwnPropertyDescriptor: getOwnPropertyDescriptor,
			ownKeys: ownKeys,
			apply: config
		});
	}

	/**
	 * Returns true if `config().init()` has been called.
	 *
	 * @return {boolean}
	 */
	get initialized() {
		return !!this.instance;
	}

	/**
	 * Returns true if `config().start()` has been called.
	 *
	 * @return {boolean}
	 */
	get started() {
		return this.instance && this.instance.started || false;
	}

	/**
	 * Returns an Array of String with each string representing the origin of
	 * each configuration that was added via `config().add(...)`.
	 *
	 * @return {Array<string>}
	 */
	get sources() {
		let sources = this.instance && this.instance.sources || [];
		return sources.map((source)=>{
			return source.origin;
		});
	}

	/**
	 * Initialize AwesomeConfig for usage. To call this method must be
	 * done by callign your config object as a method and then chaining
	 * the `init` function from that, as shown here:
	 *
	 * ```
	 * config().init();
	 * ```
	 *
	 * Calling this method indicates to AwesomeConfig that you are ready
	 * to start adding configuration via `config().add(...)`, but not
	 * yet ready to use it.  In order to start using config, call
	 * `config().start()` to signal that you are ready to start
	 * accessing configuration.
	 *
	 * Subsequent calls to `init` will not have any effect, only the
	 * first `config().init()`
	 *
	 * @return {AwesomeConfig}
	 */
	init() {
		if (!this.instance) this.instance = new ConfigInstance(this.instanceName);
		return this;
	}

	/**
	 * Signal to AwesomeConfig that all configuration has been added via
	 * `config().add(...)` and you are ready to start accessing configuration.
	 *
	 * Start actually performs several function important to understanding config:
	 *
	 * First, it takes all added configurations and merges them into a single
	 * unified view.  This takes into account the order in which configuration
	 * was added with later adds overwriting earlier adds.
	 *
	 * Also, only configurations whose conditions resolve truthy are merged.
	 *
	 * Second, after merging, all variables are resolved and any variable that
	 * does not resolve throws an exception.
	 *
	 * Third, after variable resolution, all values are checked for placeholders.
	 * If any placeholders are found, an exception is thrown.
	 *
	 * Once all three of these actions are done and so long as no exceptions
	 * were thrown, your configuration is now available for usage.
	 *
	 * @return {AwesomeConfig}
	 */
	start() {
		if (!this.instance) throw new Error("init() must be called before start().");
		if (!this.instance.started) this.instance.start();
		return this;
	}

	/**
	 * Takes AwesomeConfig out of started mode an allows for more configurations
	 * to be added via `config().add(...)`. `config().start()` can then be called
	 * again to begin using config.
	 *
	 * @return {AwesomeConfig}
	 */
	stop() {
		if (!this.instance) throw new Error("init() must be called before stop().");
		if (this.instance.started) this.instance.stop();
		return this;
	}

	/**
	 * The `config()add()` method has four different usage forms, each unique in thier
	 * own right:
	 *
	 * - **config().add(object)** - You may add a plain JavaScript object as
	 *   configuration and it will be merged with the configuration.
	 *
	 * - **config().add(string)** - You may add a string as configuration data
	 *   and it will be run through the configuration parser and the
	 *   resulting data will be merged with the configuration.
	 *
	 * - **config().add(filename)** - You may add a fully resolved filename and
	 *   the content of the file will be read in, run through the
	 *   configuration parser, and the resulting data will be merged
	 *   with the configuration.
	 *
	 * - **config().add(directory)** - You may add a fully resolved directory and
	 *   the directory will be examined for .config files. If any are
	 *   found, each file will be read ine, run through the configuration
	 *   parser, and the resulting data will be merged with the
	 *   configuration.
	 *
	 * You may pass an optional string of *conditions* to add that will be
	 * applied to determining if the content is merged or not.  See the
	 * conditions section for a lot more details about how they work.
	 *
	 * @param {(object|string)} content
	 * @param {string}
	 *
	 * @returns {AwesomeConfig}
	 */
	add(content,defaultConditions="",encoding="utf-8") {
		if (!this.instance) throw new Error("init() must be called before add().");
		if (this.instance.started) throw new Error("add() must be called before start().");
		this.instance.add(content,defaultConditions,encoding);
		return this;
	}

	/**
	 * `config().reset()` can be called when AwesomeConfig is initialized but stopped
	 * to remove all prior configuration. It creates a completely clean slate.
	 *
	 * @return {AwesomeConfig}
	 */
	reset() {
		if (!this.instance) throw new Error("init() must be called before reset().");
		if (this.started) throw new Error("stop() must be called before reset().");
		this.instance.reset();
		return this;
	}

	/**
	 * @private
	 */
	toString() {
		if (!this.instance) return undefined;
		if (!this.instance.started) return undefined;

		let s = "";
		Object.keys(this.instance.config).forEach((key)=>{
			s += (s?",\n":"")+"  \""+key+"\": "+JSON.stringify(this.instance.config[key],null,2).replace(/\n/g,"\n  ");
		});
		return "{\n"+s+"\n}";
	}
}

const getInstanceProxy = function(instanceName="") {
	if (!instances[instanceName]) instances[instanceName] = new AwesomeConfigProxy(instanceName);
	return instances[instanceName];
};

module.exports = new AwesomeConfig();
