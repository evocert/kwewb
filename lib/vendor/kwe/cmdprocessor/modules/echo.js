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
			this.stdio.stdout+=(Object.values(arguments).splice(1)).join(" ");
			this.stdio.stdin=this.stdio.stdout;
			return 1;
		}
	};
	module.exports=new proc();
});
