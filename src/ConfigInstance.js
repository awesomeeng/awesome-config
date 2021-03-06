// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const FS = require("fs");
const Path = require("path");

const AwesomeUtils = require("@awesomeeng/awesome-utils");
const Log = require("@awesomeeng/awesome-log");

const ConfigSource = require("./ConfigSource");
const ConfigParser = require("./ConfigParser");
const ConfigResolver = require("./ConfigResolver");

const $ID = Symbol("id");
const $SOURCES = Symbol("sources");
const $CONFIG = Symbol("config");
const $PARSER = Symbol("parser");
const $RESOLVER = Symbol("resolver");

/**
 * @private
 *
 * Creates a scope for config. Config scopes are bound to the module which
 * loads it and all descendant calls. So if you create module XYZ and do
 * `config().init()` inside of it, all calls that derive from XYZ will use
 * that config, until something else calls init.
 */
class ConfigInstance {
	constructor(id) {
		this[$ID] = id;
		this[$SOURCES] = [];
		this[$CONFIG] = null;

		this[$PARSER] = new ConfigParser();
		this[$RESOLVER] = new ConfigResolver();

		Log.debug("Instance " + (this.id ? this.id : "[default]")+" initialized.");
	}

	/**
	 * Id of this instance/scope.
	 *
	 * @return {string}
	 */
	get id() {
		return this[$ID];
	}

	/**
	 * Returns true of this instance/scope has been started and nothing
	 * else can be added to it.
	 *
	 * @return {boolean}
	 */
	get started() {
		return this[$CONFIG]!==null;
	}

	/**
	 * Return the origin of all added config data.
	 *
	 * @return {Array<String>}
	 */
	get sources() {
		return this[$SOURCES];
	}

	/**
	 * Return the underlying config object.
	 *
	 * @return {Object}
	 */
	get config() {
		return this.started && this[$CONFIG] || null;
	}

	/**
	 * Returns the parse being used by this config instance.
	 *
	 * @return {ConfigParser}
	 */
	get parser() {
		return this[$PARSER];
	}

	/**
	 * Returns the resolver being used by this config instance.
	 *
	 * @return {ConfigResolver}
	 */
	get resolver() {
		return this[$RESOLVER];
	}

	/**
	 * Starts this config instance as running which means no more
	 * config details can be added to it.
	 *
	 * @return {void}
	 */
	start() {
		if (this.started) return;

		let root = {};

		// merge our sources in the order they were added.
		this[$SOURCES].forEach((source)=>{
			if (!source.matches()) return;
			root = AwesomeUtils.Object.extend(root,source.content);
		});

		// run the resulting object through our resolver.
		if (this.resolver) this.resolver.resolve(root);

		// prevent our nested children from being mutated.
		// We handle this for the nested child itself in the AwesomeConfig proxy.
		Object.keys(root).forEach((key)=>{
			AwesomeUtils.Object.deepFreeze(root[key]);
		});

		// make our configuration.
		this[$CONFIG] = root;

		Log.debug("Instance "+(this.id?this.id:"[default]")+" initialized.");
	}

	/**
	 * Stops this config instance running. Note that one stopped new
	 * items can be added.
	 *
	 * @return {void}
	 */
	stop() {
		if (!this.started) return;

		this[$CONFIG] = null;
		Log.debug("Instance "+(this.id?this.id:"[default]")+" stopped.");
	}

	/**
	 * Called when config is not started, this removes all previous
	 * config items, resetting configs state to nothing.
	 */
	reset() {
		if (this.started) throw new Error("Cannot reset() while started. stop() first.");
		this[$SOURCES] = [];
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
	 * @param {(object|string)} content
	 * @param {string}
	 */
	add(content,defaultConditions="",encoding="utf-8") {
		if (!content) throw new Error("Missing configuration content.");
		if (defaultConditions===null || defaultConditions===undefined) throw new Error("Missing defaultConditions.");
		if (typeof defaultConditions!=="string") throw new Error("Invalid defaultConditions.");
		if (encoding===null || encoding===undefined) throw new Error("Missing encoding.");
		if (typeof encoding!=="string") throw new Error("Invalid encoding.");

		let origin = null;
		let sources = [];

		let valid = false;
		if (AwesomeUtils.Object.isPlainObject(content)) {
			valid = true;
			origin = AwesomeUtils.VM.executionSourceAndLine(4);
			sources = sources.concat([new ConfigSource(origin,content,defaultConditions)]);

			Log.debug("Instance "+(this.id?this.id:"[default]")+" added configuration from origin "+origin+".");
		}
		else if (typeof content==="string") {
			let resolved = resolve(content);
			let filename,stat;
			if (resolved) ({stat,filename} = resolved);
			if (!stat) {
				origin = AwesomeUtils.VM.executionSourceAndLine(4);
				sources = sources.concat(this.parser.parse(origin,content,defaultConditions));
				if (content) valid = true;

				Log.debug("Instance "+(this.id?this.id:"[default]")+" added configuration from origin "+origin+".");
			}
			else if (stat && stat.isDirectory()) {
				Log.debug("Instance "+(this.id?this.id:"[default]")+" looking for config in directory "+filename+".");

				let dir = filename;
				origin = filename;

				let files = FS.readdirSync(dir);

				files = files.sort();
				files.forEach((filename)=>{
					valid = true;
					filename = Path.resolve(dir,filename);
					if (filename.endsWith(".cfg")) this.add(filename,defaultConditions,encoding);
				});
				sources = [];
			}
			else if (stat && stat.isFile()) {
				origin = filename;
				content = FS.readFileSync(filename,encoding);
				sources = sources.concat(this.parser.parse(origin,content,defaultConditions));
				if (content) valid = true;

				Log.debug("Instance "+(this.id?this.id:"[default]")+" added configuration from origin "+origin+".");
			}
		}
		if (!valid) throw new Error("Invalid configuration content.");

		this[$SOURCES] = this[$SOURCES].concat(sources);
	}
}

/**
 * @private
 *
 * Given some filename, resolve that filename relative to your current working directory, or
 * if that fails, against the directory of the calling module.
 *
 * @param  {string} filename
 * @return {string}
 */
const resolve = function resolve(filename) {
	const getStat = (f)=>{
		try {
			return FS.statSync(f);
		}
		catch (ex) {
			return null;
		}
	};

	let path,stat;

	// try the filename relative to the module parent
	if (module && module.parent) {
		if (filename==="." || filename==="./" || filename==="/\\") path = Path.dirname(module && module.parent && module.parent.parent && module.parent.parent.filename || module && module.parent && module.parent.filename || filename);
		else if (filename===".." || filename==="../") path = Path.dirname(Path.dirname(module && module.parent && module.parent.parent && module.parent.parent.filename || module && module.parent && module.parent.filename || filename));
		else path = AwesomeUtils.Module.resolve(module && module.parent && module.parent.parent || module && module.parent,filename);
		stat = getStat(path);
		if (stat) return {
			filename: path,
			stat
		};
	}

	// try the filename relative to process.cwd()
	path = Path.resolve(process.cwd(),filename);
	stat = getStat(path);
	if (stat) return {
		filename: path,
		stat
	};

	// fail
	return null;
};

module.exports = ConfigInstance;
