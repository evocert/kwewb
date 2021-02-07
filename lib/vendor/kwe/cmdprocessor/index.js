//ws command processor for jquery terminal
//todo: dynamic loading in of amd modules and execution
//      e.g. $> stat
//           stat is in some/path/stat/index.js
//           execute and return output
//           when reloading, reload all modules in requirejs context scope
//           or
//           reload all modules loaded in by this (keep registry)
//todo: client feedback mechanism, integrating server feedback with client
//	e.g.
//		fn()->{feedback:SOMESPECIFICATION}
//		where fn() does not return this form, simply print
//		sample feedbacks
//			println
//			show popup
//			reload widget (for changes in client side code so page does not have to be reloaded)
//			reload entire page
//			open editor
//			alter polling
//			push client feedback function handler
//
define([
	"module",
	"console",
	"sprintf",
	"kwe.stringutils.pad",
	"kwe.filemanager",
	"www/kwewb/lib/vendor/kwe/srvcommand/index.js"
],function(
	module,
	console,
	Sprintf,
	pad,
	FileManager,
	SrvCommand
){
	"use strict"
	function CMDProcessor(){
		var cache={};
		var modules={};
        	var fileManager=new FileManager();
		/*
		var cmd=new SrvCommand({
				"path":osutils.GOOS()=="linux"?"/bin/bash":"cmd.exe",
				"args":[],
				"timeout":10,
				"defaultcb":function(output,command){print(output);}
		});
		*/
		var version="0.0.1";
		function str2argv(args){
			if(typeof(args)!="string")throw("invalid argument type");
			return args.split(" ");
		};
		this.exec=function(args){
			args=str2argv(args);
			if(typeof(this[args[0]])=="function")return this[args[0]].apply(this,args.slice(1));
			if(typeof(modules[args[0]])=="function")return modules[args[0]].apply(this,args.slice(1));
			if(cache[["$",args[0]].join("")]!=null){
				return cache[["$",args[0]].join("")];
			}
			/*
			try{//basic usage
				//if(cmd!=null)cmd.close();
				cmd.exec(["cd",fileManager.cwd].join(" "));
				cmd.exec([args.join(" "),"2>&1"].join(" "));
			}catch(e){
				println(e.toString());
			}
			*/
			return "invalid cmd";
		};this.exec.private=true;
		this.reload=function(){
			var modbak=require.s.contexts._.defined[module.id];//backup untested
			try{
				var t0=new Date();
				//if(cmd!=null)cmd.close();
				require.undef(module.id);
				require([module.id],function(CmdProcessor){
    				var self=this;
    				cmdProcessor=new CmdProcessor();
    			}.bind(this));
    			var t1=new Date();
    				return {"message":module.id+"reloaded ("+(t1-t0)+" ms)"};
			}catch(e){
		                require.s.contexts._.defined[module.id]=modbak;
    			return {"error":e.toString()};
			}
		};
		this.flush=function(){
			//if(cmd!=null)print(cmd.flush());
		};this.exec.private=true;
		this.poll=function(){
			console.log("poll");
			this.flush();
		};this.poll.private=true;
		//--------------------------------------------------------------------------------
		this.version=function(){
			return version;
		}
		this.cjs=function(args){
			return {
				feedback:{
					type:"exec",
					value:Object.values(arguments).join(" ")
				}
			};
		}
		this.sjs=function(args){
			return eval(Object.values(arguments).join(" "));
		}

		//for client side development
		//reloads client module, closes panel, reopens terminal pandel
		this.reloadwidget=function(args){
			return {
				feedback:{
					type:"exec",
					value:[
						'require.undef(module.id);',
						'require([module.id],function(Terminal){',
						'	panel.close();',
    						'	cmdProcessor=new Terminal(args);',
						'})'
					].join("\n")
				}
			};
		}
		this.lsmod=function(a){
			var sprintf=Sprintf.sprintf
			var vsprintf=Sprintf.vsprintf
			/*
			{//basic usage
				console.log(sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants'));
				console.log(vsprintf('The first 4 letters of the english alphabet are: %s, %s, %s and %s', ['a', 'b', 'c', 'd']));
			}
			{
				var users = [
					    {name: 'Dolly'},
					    {name: 'Molly'},
					    {name: 'Polly'},
				]
				console.log(sprintf('Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s', {users: users})); // Hello Dolly, Molly and Polly
			}
			{
				console.log(sprintf('Current date and time: %s', function() { return new Date().toString() }));
			}
			*/
			var retobj={
				"builtins":(function(){
					var ret=[];
					Object.keys(this).forEach(function(k){
						if(typeof(this[k].private)=='undefined')ret.push(k)
					}.bind(this));
					return ret;
				}.bind(this))(),
				"loaded":(function(){
					var ret=[];
					Object.keys(modules).forEach(function(k){
						if(typeof(modules[k].private)=='undefined')ret.push(k)
					}.bind(this));
					return ret;
				}.bind(this))(),
				"unloaded":(function(){
					try{
						var path=["/mnt/c/tmp",module.uri.substring(0,module.uri.lastIndexOf("/")),"modules"].join("/");
						var ret=[];
						fileManager.ls(path).entries.forEach(function(item){
							var modnam=item.Name.lastIndexOf(".js")>0?item.Name.substring(0,item.Name.lastIndexOf(".js")):item.Name;
							if(typeof(modules[modnam])=="undefined")
							ret.push(modnam);
						}.bind(this));
						return ret;
					}catch(e){
						return e.toString();
					}
				}.bind(this))()
			};
			var lines=[];
			var maxlen=0;
			maxlen=16;retobj.builtins.forEach(function(item){maxlen=maxlen<item.length?item.length:maxlen;})
			lines.push(pad("------------------","Builtins",false));//"-Builtins"));
			retobj.builtins.forEach(function(item){
				lines.push(Sprintf.sprintf("%"+maxlen+"s",item));
			})
			maxlen=16;retobj.loaded.forEach(function(item){maxlen=maxlen<item.length?item.length:maxlen;})
			lines.push(pad("------------------","Loaded",false));//"-Builtins"));
			if(retobj.loaded.length==0)lines.push("None");
			retobj.loaded.forEach(function(item){
				lines.push(Sprintf.sprintf("%"+maxlen+"s",item));
			})
			maxlen=16;retobj.unloaded.forEach(function(item){maxlen=maxlen<item.length?item.length:maxlen;})
			lines.push(pad("------------------","Not Loaded",false));//"-Builtins"));
			if(retobj.unloaded.length==0)lines.push("None");
			retobj.unloaded.forEach(function(item){
				lines.push(Sprintf.sprintf("%"+maxlen+"s",item));
			})
			lines.push("------------------");

			return lines.join("\n");
		};
		this.lod=function(modnam){
			if(typeof(modnam)=="string"&&modnam!=""){
				try{
					var modpath=[module.uri.substring(0,module.uri.lastIndexOf("/")),"modules",modnam.endsWith(".js")?modnam:[modnam,"js"].join(".")].join("/");
					var result;
					var modobtained=false;//workaround
					//clear
					var modbak=require.s.contexts._.defined[module.id];//backup untested
					try{
						require.undef(modpath);
						delete modules[modnam];
					}catch(e){
						console.error("Failed to unload "+modpath);
					}
					//load
					require([modpath],function(mod){
						modobtained=true;
						console.log("1");
						if(typeof(mod)=="function"){
							//result=mod.apply(this,arguments);
							modules[modnam]=mod;
							result={"message":"module loaded"};
						}else{
							console.error("Invalid module");
							result={"error":"invalid module"};
						}
					}.bind(this));
					result=modobtained?result:"failed to obtain module";
					return result;
				}catch(e){
					return {"error":e.toString()};
				}
			}else{
				return {"error":"invalid argument"}
			}
		};
		this.ulod=function(modnam){
			if(typeof(modnam)=="string"&&modnam!=""){
				try{
					var modpath=[module.uri.substring(0,module.uri.lastIndexOf("/")),"modules",modnam.endsWith(".js")?modnam:[modnam,"js"].join(".")].join("/");
					var result;
					var modobtained=false;//workaround
					//clear
					if(typeof(require.s.contexts._.defined[modpath])!="undefined"){
						try{
							require.undef(modpath);
							delete modules[modnam];
							result="Module "+modnam+" unloaded"
						}catch(e){
							console.error("Failed to unload"+modpath);
							result="Failed to unload module "+modnam;
						}
					}else{
						result="Module does not exist";
					}
					return result;
				}catch(e){
					return {"error":e.toString()};
				}
			}else{
				return {"error":"invalid argument"}
			}
		};
		this.pwd=function(){
		    return fileManager.pwd();
		}
		this.cd=function(path){
		    return fileManager.cd(path);
		}
		this.cat=function(path){
			try{
				return fileManager.cat(path).contents;
			}catch(e){
				return e.toString();
			}
		}
		this.ls=function(path){
		    return (function(){
		        var ret="";
		        fileManager.ls(path).entries.forEach(function(item){
		            ret+=[
		                (item.Type=="Dir"?"d":"-")+"rwxrwxrwx",
		                "1",
		                "skullquake",
		                "skullquake",
		                item.Size,
		                "Feb  4",
		                "05:43",
		                item.Name
                    ].join("\t")+"\n"
		        });
		        return ret;
		    }.bind(this))()
		}
		this.mkdir=function(path){
			if(path!=null)
				try{
					fileManager.mkdir(path);
					return [path,"created"].join(" ");
				}catch(e){
					return e.toString();
				}
			else
				return "invalid usage";
		}
		this.touch=function(path){
			if(path!=null)
				try{
					fileManager.touch(path);
					return [path,"touched"].join(" ");
				}catch(e){
					return e.toString();
				}
			else
				return "invalid usage";
		}
		this.rm=function(path){
			if(path!=null)
				try{
					fileManager.rm(path);//.removed attribute alwasy true...
					return [path,"removed"].join(" ");
				}catch(e){
					return e.toString();
				}
			else
				return "invalid usage";
		}



		this["$RANDOM"]=function(){
		    return Math.floor(Math.random()*4096);
		}
		this.date=function(){
		    return new Date().toString();
		}
		this.time=function(){
		    return new Date().toString();
		}
		this.set=function(arg){
			if(arg==null){
				return (function(){
					var ret=[];
					Object.keys(cache).forEach(function(k){
						ret.push([k,cache[k]].join(":"));
					});
					if(ret.length>0)return ret.join("\n");
					if(ret.length==0)return "No items in cache";

				}.bind(this))()
			}else{
				if(arg.indexOf("=")>0)
				cache[arg.split("=")[0]]=arg.split("=")[1];
				else
					return "Invalid usage"
			}
		}
		this.unset=function(arg){
			if(arg==null){
				return "Invalid argument"
			}else{
				if(typeof(cache[arg])=="undefined")return "Item not found in cache";
				delete(cache[arg]);
			}
		}
		this.get=function(arg){
			return cache[arg];
		}
	}
	module.exports=CMDProcessor;
});
