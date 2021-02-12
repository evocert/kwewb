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
			console.log(this.stdio);
			//this.stdio.stdout=ConvertStringToHex(this.stdio.stdin,typeof(arguments[1])!="undefined"?parseInt(arguments[1]):8);
			this.stdio.stdout={
				feedback:{
					type:"exec",
					value:[
						'term.echo($('+JSON.stringify(this.stdio.stdin+Object.values(arguments).splice(1).join(" "))+'))'
					].join("\n")
				}
				//this.stdio.stdin+Object.values(arguments).join(" ")
			}

			return 1;
		}
	};
	module.exports=new proc();
});
