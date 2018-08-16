// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const FS = require("fs");
const Path = require("path");
const Lodash = require("lodash");

const AwesomeUtils = require("AwesomeUtils");
const Log = require("AwesomeLog");

const ConfigSource = require("./ConfigSource");
const AbstractParser = require("./AbstractParser");
const DefaultParser = require("./DefaultParser");
const AbstractResolver = require("./AbstractResolver");
const DefaultResolver = require("./DefaultResolver");

const $CONFIG = Symbol("config");
const $OPTIONS = Symbol("options");
const $SOURCES = Symbol("sources");

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
		this[$OPTIONS] = Object.assign({
			paths: [],
			parser: null,
			parserOptions: null,
			resolver: null,
			resolverOptions: null,
			fileEncoding: "utf-8"
		},options);

		if (this.parser===null) this[$OPTIONS].parser = new DefaultParser(this.options.parserOptions||{});
		if (!(this.options.parser instanceof AbstractParser)) throw new Error("Invalid parser option.");

		if (this.resolver===null) this[$OPTIONS].resolver = new DefaultResolver(this.options.resolverOptions||{});
		if (!(this.options.resolver instanceof AbstractResolver)) throw new Error("Invalid resolver option.");

		this[$CONFIG] = null;
		this[$SOURCES] = [];

		Log.info && Log.info("AwesomeConfig","Initialized.");

		return new Proxy(this,{
			get: (me,prop)=>{
				if (me[$CONFIG] && (typeof prop==="symbol" || !prop.startsWith("$$"))) return me[$CONFIG][prop];
				else return me[prop];
			},
			has: (me,prop)=>{
				if (me[$CONFIG]) return prop in me[$CONFIG];
				else return prop in me;
			},
			getOwnPropertyDescriptor: (me,prop)=>{
				if (me[$CONFIG]) return Object.getOwnPropertyDescriptor(me[$CONFIG],prop);
				else return Object.getOwnPropertyDescriptor(me,prop);
			},
			ownKeys: (me)=>{
				if (me[$CONFIG]) return [].concat(Object.getOwnPropertyNames(me[$CONFIG]),Object.getOwnPropertySymbols(me[$CONFIG]));
				else return [].concat(Object.getOwnPropertyNames(me),Object.getOwnPropertySymbols(me));
			}
		});
	}

	static get AbstractParser() {
		return AbstractParser;
	}

	static get DefaultParser() {
		return DefaultParser;
	}

	static get AbstractResolver() {
		return AbstractResolver;
	}

	static get DefaultResolver() {
		return DefaultResolver;
	}

	get options() {
		return this[$OPTIONS];
	}

	get parser() {
		return this[$OPTIONS].parser;
	}

	get resolver() {
		return this[$OPTIONS].resolver;
	}

	/**
	 * Returns an array of all of the origin strings for each added
	 * configuration.  The origin of each added configuration depends
	 * on what was passed into `add()`. If you passed in an object or
	 * string, the origin will be the filename and line number of
	 * the javascript where the `add()` call was made. If you passed
	 * in a file or a directory, the origin will be the filename
	 * which was loaded and parsed.
	 *
	 * This member is not available once AwesomeConfig has been started.
	 *
	 * @return {Array<String>} [description]
	 */
	get sources() {
		return Lodash.uniq(this[$SOURCES].map((source)=>{
			return source.origin;
		}));
	}

	/**
	 * Signals that all the config content has been added, and that AwesomeConfig
	 * should switch to usage phase.  Once `start()` has been called, additional
	 * configuration cannot be added or changed.
	 *
	 * To take configuration out of usage phase, you may issues a `$$stop()` call,
	 * but that is only recommended for testing purposes.
	 */
	start() {
		let root = {};
		this[$SOURCES].forEach((source)=>{
			if (!source.matches()) return;
			root = Lodash.extend(root,source.content);
		});
		this[$CONFIG] = root;

		Log.info && Log.info("AwesomeConfig","Started.");
	}

	/**
	 * The `$$stop()` method is used to stop AwesomeConfig from being in usage
	 * phase and allow the configuration to once again be changed.
	 *
	 * In almost all cases, this should never be needed.
	 *
	 * If this method is called before `start()`, nothing will happen.
	 */
	$$stop() {
		this[$CONFIG] = null;
		Log.info && Log.info("AwesomeConfig","Stopped.");
	}

	/**
	 * Removes all previously added configuration, returning AwesomeConfig to
	 * its default empty state. Generally only really needed in testing.
	 *
	 * This method is not available once AwesomeConfig has been started.
	 */
	reset() {
		this[$SOURCES] = [];
		Log.info && Log.info("AwesomeConfig","Reset.");
	}

	// add(object)
	// add(jsonString)
	// add(filename)
	// add(directory)
	/**
	 * The `add()` method has four different usage forms, each unique in thier
	 * own right:
	 *
	 * 		**add(object)** - You may add a plain JavaScript object as
	 * 		configuration and it will be merged with the configuration.
	 *
	 * 		**add(string)** - You may add a string as configuration data
	 * 		and it will be run through the configuration parser and the
	 * 		resulting data will be merged with the configuration.
	 *
	 * 		**add(filename)** - You may add a fully resolved filename and
	 * 		the content of the file will be read in, run through the
	 * 		configuration parser, and the resulting data will be merged
	 * 		with the configuration.
	 *
	 * 		**add(directory)** - You may add a fully resolved directory and
	 * 		the directory will be examined for .config files. If any are
	 * 		found, each file will be read ine, run through the configuration
	 * 		parser, and the resulting data will be merged with the
	 * 		configuration.
	 *
	 * Each call to `add()` will merge the given configuration with the
	 * overall configuration, producing a new overall configuration.
	 *
	 * You may pass an optional string of *conditions* to add that will be
	 * applied to determining if the content is merged or not.  See the
	 * conditions section for a lot more details about how they work.
	 *
	 * @param {(object|string)} content         [description]
	 * @param {string}
	 */
	add(content,conditions="") {
		if (!content) throw new Error("Missing configuration content.");
		if (conditions===null || conditions===undefined) throw new Error("Missing conditions.");
		if (typeof conditions!=="string") throw new Error("Invalid conditions.");

		conditions = parseConditions.call(this,conditions);

		let origin = null;

		let valid = false;
		if (Lodash.isPlainObject(content)) {
			valid = true;
			origin = AwesomeUtils.Module.sourceAndLine(1);
		}
		else if (typeof content==="string") {
			let stat = null;
			try {
				stat = FS.statSync(content);
			}
			catch (ex) {
				stat = null;
			}
			if (!stat) {
				origin = AwesomeUtils.Module.sourceAndLine(1);
				content = this.parser.parse(content);
				if (content) valid = true;
			}
			else if (stat && stat.isDirectory()) {
				let dir = content;
				FS.readdir(content).forEach((filename)=>{
					filename = Path.resolve(dir,filename);
					if (filename.endsWith(".cfg")) this.add(filename);
				});
			}
			else if (stat && stat.isFile()) {
				origin = content;
				content = FS.readFileSync(content,this.options.fileEncoding);
				content = this.parser.parse(content);
				if (content) valid = true;
			}
		}
		if (!valid) throw new Error("Invalid configuration content.");

		this[$SOURCES].push(new ConfigSource(origin,content,conditions));

		Log.info && Log.info("AwesomeConfig","Added configuration from "+origin);
	}
}

/**
 * Internal utility for parsing a conditions string.
 *
 * @param  {[type]} conditions [description]
 * @return {[type]}            [description]
 */
const parseConditions = function parseConditions(conditions) {
	if (!conditions) return [];
	return [];
};

module.exports = new AwesomeConfig();
