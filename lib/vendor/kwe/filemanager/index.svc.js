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
		"kwe.filemanager"
	],function(
		req,
		FileManager,
	){
		try{
			function validate(args){
				return 	typeof(args)=="object"&&
					typeof(args.cwd)=="string"
				;
			}
			var actions={
				pwd:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.pwd();
				},
				ls:function(args){
					function cmp(a,b){
						if(a.Name>b.Name)return 1;
						return -1;
					};
					var ret={};
					var fm=new FileManager({cwd:args.cwd});
					var entries=fm.ls().entries;
					var arrdir=entries.filter(function(a){return a.Type=="Dir"}).sort(cmp);
					var arrreg=entries.filter(function(a){return a.Type!="Dir"}).sort(cmp);
					arrdir.sort(cmp);
					arrreg.sort(cmp);
					ret.entries=Array.prototype.concat(arrdir,arrreg);
					return ret;
				},
				find:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.ls(args.path);
				},
				cd:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.cd(args.path);
				},

				find:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.find(args.path);
				},
				mkdir:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.mkdir(args.path);
				},
				cat:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.cat(args.path);
				},
				rm:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.rm(args.path);
				},
				touch:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.touch(args.path);
				},
				setcontents:function(args){
					var fm=new FileManager({cwd:args.cwd});
					return fm.setcontents(args.path,args.contents);
				}
			};
			var ret={};
			var t0=new Date();
			if(req.data().action==null){
				ret={"error":"no action specfied"};
			}else if(req.data().args==null){
				ret={"error":"arguments"};
			}else if(actions[req.data().action]!=null){
				if(validate(req.data().args)){
					ret=actions[req.data().action](req.data().args);
				}else{
					ret={"error":"invalid arguments"};
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
