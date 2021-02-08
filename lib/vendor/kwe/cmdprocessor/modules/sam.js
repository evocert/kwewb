define([
	"module"
],function(
	module
){
	"use strict";
	module.exports=function(){return{
		feedback:{
			type:"exec",
			value:[
				'require([',
				'	"sam"',
				'],function(',
				'	sam',
				'){',
				'	term.sam=sam;',
				'	term.saycho=function(val){this.echo(val);this.sam(val)};',
				'	term.saycho("'+Object.values(arguments).join(" ")+'");',
				'});'
			].join("\n")
		}
	}};
});
