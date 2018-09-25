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
	 * @constructor
	 */
	constructor() {
		let instances = {};

		Log.info("Installed.");

		/**
		 * @private
		 */
		const getInstance = function getInstance() {
			let stack = AwesomeUtils.Module.stack(2);

			let instance = null;

			while (true) {
				let entry = stack.shift();
				if (!entry) break;

				let id = entry.source;
				instance = instances[id];
				if (instance) break;

				instance = null;
			}

			if (instance) return instance;

			return null;
		};

		const init = function init() {
			let id = AwesomeUtils.Module.source(3);

			if (!instances[id]) instances[id] = new ConfigInstance(id);
			return apply();
		};

		const start = function start() {
			let instance = getInstance();
			if (!instance) throw new Error("init() must be called before start().");
			if (!instance.started) instance.start();
			return apply();
		};

		const stop = function stop() {
			let instance = getInstance();
			if (!instance) throw new Error("init() must be called before stop().");
			if (instance.started) instance.stop();
			return apply();
		};

		const add = function add(content,defaultConditions="",encoding="utf-8") {
			let instance = getInstance();
			if (!instance) throw new Error("init() must be called before add().");
			if (instance.started) throw new Error("add() must be called before start().");
			instance.add(content,defaultConditions,encoding);
			return apply();
		};

		const reset = function reset() {
			let instance = getInstance();
			if (!instance) throw new Error("init() must be called before reset().");
			instance.reset();
			return apply();
		};

		const has = function has(target,prop) {
			let instance = getInstance();
			if (!instance) return false;
			if (!instance.started) return false;

			return instance.config[prop]!==undefined;
		};

		const get = function get(target,prop) {
			let instance = getInstance();
			if (!instance) return undefined;
			if (!instance.started) return undefined;
			if (!instance.config) return undefined;
			if (!instance.config[prop]) throw new Error("Missing configuration property '"+prop+"'.");
			
			return instance.config[prop];
		};

		const set = function set() {
			return false;
		};

		const getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target,prop) {
			// this resolve an error with ownKeys requiring a 'prototype' member.
			if (prop==="prototype") return {value: null, writable: false, enumerable: false, configurable: false};

			let instance = getInstance();
			if (!instance) return undefined;
			if (!instance.started) return undefined;

			return Object.getOwnPropertyDescriptor(instance.config,prop);
		};

		const ownKeys = function ownKeys() {
			// we need to include ["prototype"] or we get wierd proxy errors.
			//
			let instance = getInstance();
			if (!instance) return ["prototype"];
			if (!instance.started) return ["prototype"];

			return [].concat(Object.getOwnPropertyNames(instance.config),["prototype"]);
		};

		const toString = function toString() {
			let instance = getInstance();
			if (!instance) return undefined;
			if (!instance.started) return undefined;

			let s = "";
			Object.keys(instance.config).forEach((key)=>{
				s += (s?",\n":"")+"  \""+key+"\": "+JSON.stringify(instance.config[key],null,2).replace(/\n/g,"\n  ");
			});
			return "{\n"+s+"\n}";
		};

		const apply = function config() {
			let instance = getInstance();
			let initialized = !!instance;
			let started = instance && instance.started || false;
			let sources = instance && instance.sources || [];
			sources = sources.map((source)=>{
				return source.origin;
			});

			return {
				init,
				initialized,
				start,
				stop,
				started,
				add,
				sources,
				reset,
				toString
			};
		};

		return new Proxy(apply,{
			has,
			get,
			set,
			getOwnPropertyDescriptor,
			ownKeys,
			apply: apply
		});
	}
}

module.exports = new AwesomeConfig();
