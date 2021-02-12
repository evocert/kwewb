define([
	"module",
],function(
	module,
){
	"use strict";
	function proc(){
		this.stdio=null;
		this.main=function(argc,argv){
			this.stdio.stdout={
				feedback:{
					type:"exec",
					value:"term.ws.disconnect()"
				}
			}
			return 1;
		}
	};
	module.exports=new proc();
});

