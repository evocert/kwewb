define([
	"module",
	"console",
	"cyclejs"
],function(
	module,
	console,
	cyclejs
){
	"use strict";
	function proc(){
		this.stdio=null;
		this.env=null;
		this.main=function(argc,argv){
			var code=JSON.stringify(cyclejs.decycle(this));
			this.stdio.stdout={
				feedback:[
					{
						type:"console.log",
						value:code
					},
					{
						type:"exec",
						value:[
							'term.wsmodstate=',
							code,
							';'
						].join("")
					},
				]
			}

			return 1;
		}
	};
	module.exports=new proc();
});
