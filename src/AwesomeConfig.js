// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");
const Log = require("AwesomeLog");

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
 * let config = require("AwesomeConfig");
 * config().init();
 * ```
 *
 * Once initialized you can add configuration details to the config object.
 *
 * ```
 * let config = require("AwesomeConfig");
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

		Log.info && Log.info("AwesomeConfig","Installed.");

		const getId = function getId() {
			let current = global.module || process.mainModule || null;
			while (current) {
				let id = current.id || "";
				if (id===".") break;
				if (instances[id]) return id;
				current = current.parent;
			}
			return AwesomeUtils.Module.source(2,true);
		};

		const getInstance = function getInstance(id) {
			if (!id) throw new Error("Missing id.");
			if (!instances[id]) return null;
			return instances[id];
		};

		const init = function init() {
			let id = getId();
			if (!instances[id]) instances[id] = new ConfigInstance(id);
			return apply();
		};

		const start = function start() {
			let id = getId();
			let instance = getInstance(id);
			if (!instance) throw new Error("init() must be called before start().");
			if (!instance.started) instance.start();
			return apply();
		};

		const stop = function stop() {
			let id = getId();
			let instance = getInstance(id);
			if (!instance) throw new Error("init() must be called before stop().");
			if (instance.started) instance.stop();
			return apply();
		};

		const add = function add(content,defaultConditions="",encoding="utf-8") {
			let id = getId();
			let instance = getInstance(id);
			if (!instance) throw new Error("init() must be called before add().");
			if (instance.started) throw new Error("add() must be called before start().");
			instance.add(content,defaultConditions,encoding);
			return apply();
		};

		const reset = function reset() {
			let id = getId();
			let instance = getInstance(id);
			if (!instance) throw new Error("init() must be called before reset().");
			instance.reset();
			return apply();
		};

		const get = function get(target,prop) {
			let id = getId();
			let instance = getInstance(id);
			if (!instance) return undefined;
			if (!instance.started) return undefined;

			return instance.config[prop];
		};

		const has = function has(target,prop) {
			let id = getId();
			let instance = getInstance(id);
			if (!instance) return false;
			if (!instance.started) return false;

			return instance.config[prop]!==undefined;
		};

		const getOwnPropertyDescriptor = function getOwnPropertyDescriptor(target,prop) {
			// this resolve an error with ownKeys requiring a 'prototype' member.
			if (prop==="prototype") return {value: null, writable: false, enumerable: false, configurable: false};

			let id = getId();
			let instance = getInstance(id);
			if (!instance) return undefined;
			if (!instance.started) return undefined;

			return Object.getOwnPropertyDescriptor(instance.config,prop);
		};

		const ownKeys = function ownKeys() {
			// we need to include ["prototype"] or we get wierd proxy errors.
			//
			let id = getId();
			let instance = getInstance(id);
			if (!instance) return ["prototype"];
			if (!instance.started) return ["prototype"];

			return [].concat(Object.getOwnPropertyNames(instance.config),["prototype"]);
		};

		const toString = function toString() {
			let id = getId();
			let instance = getInstance(id);
			if (!instance) return undefined;
			if (!instance.started) return undefined;

			let s = "";
			Object.keys(instance.config).forEach((key)=>{
				s += (s?",\n":"")+"  \""+key+"\": "+JSON.stringify(instance.config[key],null,2).replace(/\n/g,"\n  ");
			});
			return "{\n"+s+"\n}";
		};

		const apply = function config() {
			let id = getId();
			let instance = getInstance(id);
			let initialized = !!instance;
			let started = instance && instance.started || false;
			let sources = instance && instance.sources || [];

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
			get,
			has,
			getOwnPropertyDescriptor,
			ownKeys,
			apply: apply
		});
	}
}

module.exports = new AwesomeConfig();
