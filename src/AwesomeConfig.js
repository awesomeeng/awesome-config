// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const AwesomeUtils = require("AwesomeUtils");
const Log = require("AwesomeLog");

const ConfigInstance = require("./ConfigInstance");

/**
 * The AwesomeConfig class, which is instantiated and returned whenever you
 * require("AwesomeConfig").
 *
 * Using AwesomeConfig has two different phases: The setup phase, and the
 * usage phase.
 *
 * During the setup phase, you require AwesomeConfig, add zero or more
 * configurations (object, json, files, or directories) to it, and then
 * start() it.  This is generally done at the top of your application in
 * its main class.
 *
 * ```
 * const config = require("AwesomeConfig");
 * config.add( ... );
 * config.start();
 * ```
 *
 * Once AwesomeConfig has been started, the second phase begins: usage.
 * You use AwesomeConfig from there on out by requiring it, and then
 * simply by pulling the values out you want, just like any JavaScript
 * object.
 *
 * ```
 * let abcxyz = config.abc.xyz;
 * ```
 *
 * Once config.start() has been called it is impossible to mutate
 * AwesomeConfig or to add additional configuration to AwesomeConfig.
 * However, in some testing cases this is necessary, so it is possible
 * to stop AwesomeConfig once started; the `config.$$stop()` method
 * will pust AwesomeConfig back into setup mode and you may `add()`
 * at that point. Generally speaking though, that is bad practice
 * and should be avoided.
 *
 */
class AwesomeConfig {
	constructor(options) {
		options = Object.assign({
			paths: [],
			fileEncoding: "utf-8"
		},options);

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

		const add = function add(content,defaultConditions="",encoding=options.encoding) {
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
				reset
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
