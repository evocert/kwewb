define([
	"module"
],function(
	module
){
	"use strict";
	function proc(){
		this.stdin=null;
		this.stdout=null;
		this.main=function(argc,argv){
			//mod.stdout=Object.values(arguments).join(":");
			this.stdout=[this.stdin,this.stdout].concat(Object.values(arguments)).join(":");
			return 1;
		}
	};
	module.exports=new proc();
});
