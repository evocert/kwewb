define([
	"module"
],function(
	module
){
	"use strict";
	module.exports={
		stdin:null,
		stdout:null,
		main:function(argc,argv){
			this.stdout=argv.values().join(":");
			return 1;
		}
	}
});
