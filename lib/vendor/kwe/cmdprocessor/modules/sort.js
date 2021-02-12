define([
	"module",
	"console",
	"kwe.stringutils.pad",
],function(
	module,
	console,
	pad
){
	"use strict";
	function proc(){
		this.stdio=null;
		this.main=function(argc,argv){
			console.log(module.id);
			var lines=this.stdio.stdin.split("\n");
			var linesout=lines.sort();
			this.stdio.stdout=linesout.join("\n");
			this.stdio.stdin=this.stdio.stdout;
			return 1;
		}
	};
	module.exports=new proc();
});
