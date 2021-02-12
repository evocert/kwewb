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
			this.stdio.stdout={
				feedback:{
					type:"exec",
					value:[
						'term.exec("set CLIENTMODULES="+JSON.stringify(Object.keys(',
						'		require.s.contexts._.defined))',
						')'
					].join("\n")
				}
			}

			return 1;
		}
	};
	module.exports=new proc();
});
