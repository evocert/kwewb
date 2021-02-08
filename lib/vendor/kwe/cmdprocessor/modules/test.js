define([
	"module",
	"console",
	"sprintf",
	"kwe.stringutils.getopt",
	"node-getopt"
],function(
	module,
	console,
	sprintf,
	getopt,
	mod_getopt
){
	"use strict";
	function test(arg){
		var lines=[];
		Object.values(arguments).forEach(function(value){
			lines.push(value);
		});
		var opts;
		var parsedopts={};
		try{
			opts=getopt.getopt(
				Object.values(arguments),
				"a:b:c:d:",//shortops ?? not working
				[//longopts
					"foo=",
					"bar=",
					"baz",
					"qux"
				]
			);
			opts[0].forEach(function(opt){
				parsedopts[opt[0].substring(2)]=opt.length>1?opt[1]:true;
			});
			opts[1].forEach(function(opt){
				parsedopts[opt]=true;
			});
		}catch(e){
			opts=e.toString();
		}
		return {
			args:lines,
			opts:opts,
			parsedopts:parsedopts
		}
		/*
		//https://github.com/joyent/node-getopt
		var output=[];
		var argv=[module.id].concat(Object.values(arguments));
		var parser = new mod_getopt.BasicParser('abo:(output)',argv);
		var option;
		while ((option = parser.getopt()) !== undefined) {
			switch (option.option) {
			case 'a':
				output.push('option "a" is set');
				break;

			case 'b':
				output.push('option "b" is set');
				break;

			case 'o':
				output.push(sprintf.sprintf('option "o" has value "%s"',option.optarg));
				break;
			default:
				// error message already emitted by getopt 
				mod_assert.equal('?', option.option);
				break;
			}
		}
		if (parser.optind() >=argv.length){
			output.push('missing required argument: "input"');
		}else{
			output.push(sprintf.sprintf('input = %s', argv[parser.optind()]));
		}
		return output.join("\n");
		*/
	};
	module.exports=test;
});
