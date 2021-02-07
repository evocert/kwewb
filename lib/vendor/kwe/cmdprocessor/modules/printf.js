define([
	"module",
	"sprintf",
],function(
	module,
	Sprintf,
){
	"use strict"
	module.exports=function(args){
		var sprintf=Sprintf.sprintf
		var vsprintf=Sprintf.vsprintf
		return sprintf.apply(this,arguments);//arguments.values[0],arguments.values.splice(1));
	}.bind(this);
});
