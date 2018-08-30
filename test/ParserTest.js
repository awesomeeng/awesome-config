// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/*
	Tests for .......
 */

"use strict";

const assert = require("assert");

// require("AwesomeLog").start();

const ConfigParser = require("../src/ConfigParser");

describe("ConfigParser",function(){
	it("origin",function(){
		let parser = new ConfigParser();
		assert(parser);

		parser.parse("test","");
		assert.strictEqual(parser.origin,"test");
	});

	it("whitespace",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`    \t \n \r \r\n \f
		`);
		assert.deepStrictEqual(sources,[]);
	});

	it("comment //",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`// this is a test`);
		assert.deepStrictEqual(sources,[]);
	});

	it("comment #",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`# this is a test`);
		assert.deepStrictEqual(sources,[]);
	});

	it("comment /* */",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`/* this is a test */`);
		assert.deepStrictEqual(sources,[]);
	});

	it("root json",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`{
			one: 1,
			two: 2
		}`);
		assert.equal(sources.length,1);
		assert.strictEqual(sources[0].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[0].content,{
			one: 1,
			two: 2
		});
	});

	it("root key/values",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`
			one: 1
			two: 2
		`);
		assert.equal(sources.length,1);
		assert.strictEqual(sources[0].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[0].content,{
			one: 1,
			two: 2
		});
	});

	it("deep key/values",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`
			one.one.one: 111
			two.two= 22
			one.two.three: 123
		`);
		assert.equal(sources.length,1);
		assert.strictEqual(sources[0].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[0].content,{
			one: {
				one: {
					one: 111
				},
				two: {
					three: 123
				}
			},
			two: {
				two: 22
			}
		});
	});

	it("nested json",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`
			one.one.one: {
				a: "a",
				"b": "b"
			}
		`);
		assert.equal(sources.length,1);
		assert.strictEqual(sources[0].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[0].content,{
			one: {
				one: {
					one: {
						a: "a",
						b: "b"
					}
				}
			}
		});
	});

	it("nested array",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`
			one.one.one: [
				"two",
				3
			]
		`);
		assert.equal(sources.length,1);
		assert.strictEqual(sources[0].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[0].content,{
			one: {
				one: {
					one: ["two",3]
				}
			}
		});
	});

	it("value types",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`
			null: null
			boolean.true: true,
			boolean.false: false
			number.one: 0
			number.two: 1
			number.three: -1
			number.four: 1.234
			number.five: -1.234
			string.one: one
			string.two: "two"
			string.three: three
			string.four: four,
			array: [1,"2",true,false],
			object: {
				one: 1,
				two: 2
			}
		`);
		assert.equal(sources.length,1);
		assert.strictEqual(sources[0].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[0].content,{
			null: null,
			boolean: {
				true: true,
				false: false
			},
			number: {
				one: 0,
				two: 1,
				three: -1,
				four: 1.234,
				five: -1.234
			},
			string: {
				one: "one",
				two: "two",
				three: "three",
				four: "four"
			},
			array: [1,"2",true,false],
			object: {
				one: 1,
				two: 2
			}
		});
	});

	it("multiple sources",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`
			one: 1
			[]
			one: 2
		`);
		assert.equal(sources.length,2);
		assert.strictEqual(sources[0].origin,"test");
		assert.strictEqual(sources[1].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[1].conditions,null);
		assert.deepStrictEqual(sources[0].content,{
			one: 1
		});
		assert.deepStrictEqual(sources[1].content,{
			one: 2
		});
	});

	it("conditions",function(){
		let parser = new ConfigParser();
		assert(parser);

		let sources = parser.parse("test",`
			one: 0
			[true]
			one: 1
			[false]
			one: 2
		`);
		assert.equal(sources.length,3);
		assert.strictEqual(sources[0].origin,"test");
		assert.strictEqual(sources[1].origin,"test");
		assert.strictEqual(sources[2].origin,"test");
		assert.deepStrictEqual(sources[0].conditions,null);
		assert.deepStrictEqual(sources[1].conditions.toString(),"true");
		assert.deepStrictEqual(sources[2].conditions.toString(),"false");
		assert.deepStrictEqual(sources[0].content,{
			one: 0
		});
		assert.deepStrictEqual(sources[1].content,{
			one: 1
		});
		assert.deepStrictEqual(sources[2].content,{
			one: 2
		});
	});

});
