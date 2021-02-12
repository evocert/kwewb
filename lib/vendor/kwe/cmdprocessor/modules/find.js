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
			var lines=this.stdio.stdin.split("\n");
			var linesout=[];
			var ndl=arguments[1];
			lines.forEach(function(line){
				if(line.indexOf(ndl)>0)
					linesout.push(line);
			}.bind(this));
			if(linesout.length==0)linesout.push("No results");
			this.stdio.stdout=linesout.join("\n");
			return 1;
		}
	};
	module.exports=new proc();
});
