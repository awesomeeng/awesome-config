// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const $CONFIG = Symbol("config");
const $OPTIONS = Symbol("options");

class AwesomeConfig {
	constructor(options) {
		let me = this;

		this[$OPTIONS] = Object.assign({
			paths: []
		},options);

		this[$CONFIG] = null;

		return new Proxy(this,{
			get: function(obj,prop) {
				if (me[prop] instanceof Function) return me[prop];
				if (obj[$CONFIG]===undefined || obj[$CONFIG]===null) return undefined;
				return me[$CONFIG][prop];
			}
		});
	}

	start() {
		this[$CONFIG] = {};
	}

	stop() {
		this[$CONFIG] = null;
	}

	// add(object)
	// add(jsonString)
	// add(filename)
	// add(directory)
	add(source,content) {

	}
}

const addObject(obj) {

}

const addString(s) {
	addStringText.call(this,s);
}

const addStringText(json) {

}

const addStringFilename(filename) {

}

const addStringDirectory(directory) {

}

const proxify = function proxify(parent,obj) {
	return new Proxy(obj,{
		get: function(me,prop) {
		}
	});
};


module.exports = AwesomeConfig;
