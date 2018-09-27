// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("@awesomeeng/awesome-utils");

const Log = require("@awesomeeng/awesome-log");
Log.init({
	writers: [{
		type: "null",
		name: "null"
	}],
	disableLoggingNotices: true
});
Log.start();

const ConfigInstance = require("./ConfigInstance");

const instances = {};

/**
 * The AwesomeConfig class is instantiated and returned whenever you
 * require("AwesomeConfig").
 *
 * Once required, config can be referenced in one of two ways:
 *
 * 1). To reference config management functions, you first call config
 * as a function: `config().xyz`
 *
 * 2). To reference config values, which we will see below, you reference
 * config as an object: `config.xyz`
 *
 * It begins by calling `config().init()`. Each time you call `init()` it creates
 * a new scope, based on the module from which you call it. (If, you
 * call `config().init()` from the same module, the scope remains the same.)
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
 * 	**Object** - A plain javascript object can be passed to config.
 *
 *  **JSON String** - A JSON string can be passed to config and it will parse
 *  it into a JSON Object and use that as per above. THe string must parse and
 *  it must parse into an object not an array.
 *
 *  **Filename** - You can pass a resolved filename in and AwesomeConfig will
 *  read its contents and parse it and use that.
 *
 *  **Directory** - Passing a directory will cause AwesomeConfig to load all
 *  *.cfg files in that directory, in alphabetical order, into config.
 *
 * After all your configuration has been added, you can start config with
 * `config().start()`. Once config has been started, you cannot add any more
 * confguration properties to it, so make sure everything is added before
 * starting.
 *
 * Please see (AwesomeConfig's documentation)[https://github.com/awesomeeng/AwesomeConfig]
 * for more details.
 */
class AwesomeConfig {
	/**
	 * @private
	 *
	 * @constructor
	 */
	constructor() {
		Log.info("Installed.");
		return getInstanceProxy();
	}
}

/**
 * @private
 *
 * Internally used to hold the instance information for config.
 */
class AwesomeConfigProxy {
	constructor(instanceName) {
		this.instanceName = instanceName;

		const has = function has(target,prop) {
			if (!this.instance) return false;
			if (!this.instance.started) return false;

			return this.instance.config[prop]!==undefined;
		};

		const get = function get(target,prop) {
			if (!this.instance) return undefined;
			if (!this.instance.started) return undefined;
			if (!this.instance.config) return undefined;
			if (!this.instance.config[prop]) throw new Error("Missing configuration property '"+prop+"'.");

			return this.instance.config[prop];
		};

		const set = function set() {
			return false;
		};

		const getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target,prop) {
			// this resolve an error with ownKeys requiring a 'prototype' member.
			if (prop==="prototype") return {value: null, writable: false, enumerable: false, configurable: false};

			if (!this.instance) return undefined;
			if (!this.instance.started) return undefined;

			return Object.getOwnPropertyDescriptor(this.instance.config,prop);
		};

		const ownKeys = function ownKeys() {
			// we need to include ["prototype"] or we get wierd proxy errors.
			//
			if (!this.instance) return ["prototype"];
			if (!this.instance.started) return ["prototype"];

			return [].concat(Object.getOwnPropertyNames(this.instance.config),["prototype"]);
		};

		let proxy = function() {
			return this;
		};

		return new Proxy(proxy,{
			has: has.bind(this),
			get: get.bind(this),
			set: set.bind(this),
			getOwnPropertyDescriptor: getOwnPropertyDescriptor.bind(this),
			ownKeys: ownKeys.bind(this),
			apply: proxy.bind(this)
		});
	}

	get initialized() {
		return !!this.instance;
	}

	get started() {
		return this.instance && this.instance.started || false;
	}

	get sources() {
		let sources = this.instance && this.instance.sources || [];
		return sources.map((source)=>{
			return source.origin;
		});
	}

	init() {
		this.instance = new ConfigInstance(this.instanceName);
		return this;
	}

	start() {
		if (!this.instance) throw new Error("init() must be called before start().");
		if (!this.instance.started) this.instance.start();
		return this;
	}

	stop() {
		if (!this.instance) throw new Error("init() must be called before stop().");
		if (this.instance.started) this.instance.stop();
		return this;
	}

	add(content,defaultConditions="",encoding="utf-8") {
		if (!this.instance) throw new Error("init() must be called before add().");
		if (this.instance.started) throw new Error("add() must be called before start().");
		this.instance.add(content,defaultConditions,encoding);
		return this;
	}

	reset() {
		if (!this.instance) throw new Error("init() must be called before reset().");
		this.instance.reset();
		return this;
	}

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
