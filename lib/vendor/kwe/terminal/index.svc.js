<@
	var GOJA={};
	var document=null;
	var window=null;
	//configpath="/kweutils/lib/config.goja.js";
	//configpath="../../../config.goja.js";
	var configpath=action().Path().split('/');
	configpath.pop();
	configpath.pop();
	configpath.pop();
	configpath.pop();
	configpath.push("config.goja.js");
	var configpath=configpath.join("/");
	require([configpath],function(){require([
		"request",
		"kwe.str2arg"
		"kwe.filemanager"
	],function(
		req,
		str2arg,
		FileManager,
	){
		try{
			function validate(args){
				return 	typeof(args)=="object"&&
					typeof(args.cwd)=="string"
				;
			}
			var cmd={
				test:function(args){
					return {test:'value'};
				},
			};
			var ret={};
			var t0=new Date();
			if(req.data().cmd==null){
				ret={"error":"no cmd specfied"};
			if(req.data().cwd==null){
				ret={"error":"no cwd specfied"};
			}else if(req.data().args==null){
				ret={"error":"arguments"};
			}else{
				if(cmd[req.data().cmd]==null){
					ret={"error":"cmd not found"};
				}else{
					//var fm=new FileManager({cwd:args.cwd});
					//return fm.pwd();
					ret=cmd[req.data().cmd](req.data().args);
				}
			}else{
				ret={"error":"action not found"};
			}
			var t1=new Date();
			ret.dur=(t1-t0);
			request.ResponseHeader().Set("Content-Type","application/json");
			print(JSON.stringify(ret,0,2));
		}catch(e){
			request.ResponseHeader().Set("Content-Type","application/json");
			print({"error":e.toString()});
		}
	});});
@>
