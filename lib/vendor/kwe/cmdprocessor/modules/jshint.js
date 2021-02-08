define([
	"module",
	"jshint",
],function(
	module,
	JSHINT
){
	"use strict";
	module.exports=function(src){
		var source=typeof(this[src])!="undefined"?
			this[src].toString():
				typeof(this.modules[src])!="undefined"?this.modules[src].toString():
				null
		;
		if(source==null)return 'module not found'
		var options = {
			  undef: true
		};
		var predef = {
			  foo: false
		};
		JSHINT(source, options, predef);
		return JSHINT.data();
	};
});
