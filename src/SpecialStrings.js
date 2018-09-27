// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

"use strict";

const OS = require("os");

const UNRESOLVED = new Error("Unresolved Special String.");

const hostname = OS.hostname();
const domain = hostname.split(".").slice(-2).join(".");
const servername = hostname.split(".").slice(0,1)[0];

/**
 * @private
 */
class SpecialStrings {
	get UNRESOLVED() {
		return UNRESOLVED;
	}

	resolve(s) {
		let parts = s.split(":");
		let first = parts[0];
		let name = "resolve"+first[0].toUpperCase()+first.slice(1).toLowerCase();
		if (!this[name]) throw UNRESOLVED;
		return this[name].call(this,parts.slice(1).join(":"));
	}

	resolveEnv(param) {
		return process.env[param] || "";
	}

	resolveHostname(flavor) {
		let lc = flavor.toLowerCase();
		if (lc==="name") return servername;
		if (lc==="domain") return domain;
		if (lc==="full") return hostname;
		if (lc==="fqdn") return hostname;

		throw UNRESOLVED;
	}

	resolveProcess(flavor) {
		let lc = flavor.toLowerCase();
		if (lc==="pid") return process.pid;
		if (lc==="ppid") return process.ppid;
		if (lc==="args") return process.argv.slice(2).join(" ");
		if (lc==="exec") return process.execPath;
		if (lc==="execpath") return process.execPath;
		if (lc==="cwd") return process.cwd();
		if (lc==="version") return process.version;
		if (lc==="main") return process.mainModule.filename;
		if (lc==="script") return process.mainModule.filename;

		throw UNRESOLVED;
	}

	resolveOs(flavor) {
		let lc = flavor.toLowerCase();
		if (lc==="arch") return OS.arch();
		if (lc==="type") return OS.type();
		if (lc==="platform") return OS.platform();
		if (lc==="cpus") return OS.cpus().length;
		if (lc==="homedir") return OS.homedir();
		if (lc==="home") return OS.homedir();
		if (lc==="user") return OS.userInfo().username;
		if (lc==="username") return OS.userInfo().username;
		if (lc==="bits") {
			let arch = OS.arch();
			if (arch==="arm64" || arch==="mipsel" || arch==="ppc64" || arch==="s390x" || arch==="x64") return 64;
			return 32;
		}
		throw UNRESOLVED;
	}

	resolveString(flavor) {
		let lc = flavor.toLowerCase();
		if (lc==="eol") return OS.EOL;
		if (lc==="encoding") return "utf-8";
		throw UNRESOLVED;
	}
}

module.exports = new SpecialStrings();
