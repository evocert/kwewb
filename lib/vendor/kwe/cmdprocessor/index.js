define([
	"module"
],function(
	module
){
	"use strict"
	function CMDProcessor(){
		this.exec=function(args){
			args=this.str2argv(args);
			if(typeof(this[args[0]])=="function")return this[args[0]].apply(this,args.slice(1));
			return{"error":"invalid cmd"};
		};
		this.reload=function(){
			require.undef(module.id);
			var t0=new Date();
			require([module.id],function(CmdProcessor){
				var self=this;
				cmdProcessor=new CmdProcessor();
			}.bind(this));
			var t1=new Date();
			return {"message":module.id+"reloaded ("+(t1-t0)+" ms)"};
		};
		this.str2argv=function(args){
			if(typeof(args)!="string")throw("invalid argument type");
			return args.split(" ");
		};
		//--------------------------------------------------------------------------------
		this.lsmod=function(a){
			return {"functions":Object.keys(this)};
		};
		this.tst0=function(a){
			return {"MSG":a};
		};
		this.tst1=function(a,b){
			return {"MSG":[a,b]};
		};
		this.tst2=function(a,b,c){
			return {"MSG":[a,b,c]};
		};
	}
	module.exports=CMDProcessor;
});
