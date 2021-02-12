define([
	"module",
	"console"
],function(
	module,
	console
){
	"use strict";
	function proc(){
		this.stdio=null;
		this.main=function(argc,argv){
			console.log(module.id);
			var ret=null;
			if(arguments[1]!=null&&arguments[1]!=""){
				var path="text!"+arguments[1];
				try{
					//ret=require.s.contexts._.defined[path].toString();
					require([path],function(val){ret=val;})
					require.undef(path);
				}catch(e){
					ret=e.toString();
				}
				if(ret==null)ret="Not found";
			}else{
				ret="Invalid argument"
			}
			this.stdio.stdout=ret;
			return 1;
		}
	};
	module.exports=new proc();
});
/*
define([
	'module',
	'console',
	'text!./text.js',
],function(module,console,val){
	console.log([module.id,'start'].join(':'));
	console.log(val);
});
*/
