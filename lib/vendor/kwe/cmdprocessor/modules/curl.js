define([
	"module"
],function(
	module
){
	/*"use strict";*/
	module.exports=function(url){
		if(typeof(url)=="string"){
			try{
				return httputils.Get(url);
			}catch(e){
				return e.toString();
			}
		}else{
			return "invalid argument";
		}
	};
});
