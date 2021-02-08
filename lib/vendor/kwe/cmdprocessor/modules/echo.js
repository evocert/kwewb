define([
	"module"
],function(
	module
){
	"use strict";
	module.exports=function(){
		return Object.values(arguments).join(" ");
	}
});
