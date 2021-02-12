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
	"kwe.stringutils.arggen",
	"kwe.filemanager",
	"www/kwewb/lib/vendor/kwe/srvcommand/index.js"
],function(
	module,
	console,
	Sprintf,
	pad,
	arggen,
	FileManager,
	SrvCommand
){
	"use strict"
	function CMDProcessor(){
		var cache={};
		this.modules={};
        	this.fileManager=new FileManager();
		this.stdio=new (function(){
			this.stdout="";
			this.stderr="";
			this.stdin="";
			this.flush=function(){
				this.stdout="";
				this.stdin="";
				this.stderr="";
			};
		})();
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
		this.exec=function(argv){
			//gen argv from str
			argv=arggen(argv);
			this.stdio.flush();
			//return this.execcmd(argv);
			//piping
			var cmdbuf=[];
			if(argv.findIndex(function(val){return val=="|"})>0){
				var idx=-1;
				do{
					idx=argv.findIndex(function(val){return val=="|"});
					var cmdline=argv.splice(0,idx+1);
					cmdline.pop();
					if(cmdline.length>0)cmdbuf.push(cmdline);
					//argv.pop()
				}while(idx>0);
				cmdbuf.push(argv);
				//cmdbuf.reverse()
			}else{
				cmdbuf.push(argv);
			}
			cmdbuf.forEach(function(cmdln){
				this.execcmd(cmdln);
			}.bind(this));
			return this.stdio.stdout;
		};this.exec.private=true;
		this.execcmd=function(argv){
			var mod=typeof(this[argv[0]])=="undefined"?this.modules[argv[0]]:this[argv[0]];
			//if(typeof(mod)=="undefined")return "module not found";
			//if(typeof(mod)=="function")this.stdio.stdout+=mod.bind(this).apply(this,argv.slice(1));
			if(typeof(mod)=="function"){
				var fnret=mod.bind(this).apply(this,argv.slice(1));
				if(typeof(fnret)=="object"){
					this.stdio.stdout=fnret;
					this.stdio.stdin=fnret;
				}else{
					this.stdio.stdout+=fnret;
					this.stdio.stdin=fnret;
				}
				//this.stdio.stdout=fnret;
				return fnret;
			}
			if(
				typeof(mod)=="object"&&
				//typeof(mod.stdin)!="undefined"&&
				//typeof(mod.stdout)!="undefined"&&
				typeof(mod.main)=="function"
			){
				mod.stdio=this.stdio;
				mod.env=this;
				var result=mod.main.apply(this,argv);
				this.stdio.stdin=this.stdio.stdout;
			}
			if(cache[["$",argv[0]].join("")]!=null){
				return cache[["$",argv[0]].join("")];
			}
			return "invalid command";
		};this.execcmd.private=true;

		this.reload=function(arg){
			if(arg=="--help"){
				return [
					"Usage: reload [OPTION]",
					"Reloads module[s] and reinitializes command processor",
					"  -a, --all                  reload all amd modules",
					"      --help                 prints help",
					"",
				].join("\n");
			}else if(arg=="--all"||arg=="-a"){
				//undefine all
				var acc=0;
				Object.keys(require.s.contexts._.defined).forEach(function(mid){
					try{
						require.undef(mid);
						acc++;
					}catch(e){
						console.error(mid);
					}
				}.bind(this));
				try{
					var t0=new Date();
					//if(cmd!=null)cmd.close();
					require.undef(module.id);
					require([module.id],function(CmdProcessor){
					var self=this;
						cmdProcessor=new CmdProcessor();
					}.bind(this));
					var t1=new Date();
					return acc+" modules purged and reloaded in "+(t1-t0)+" milliseconds";
				}catch(e){
					require.s.contexts._.defined[module.id]=modbak;
					return e.toString();
				}
			}else if(typeof(arg)=="undefined"||arg==""||arg==null){
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
					return module.id+" purged and reloaded in "+(t1-t0)+" milliseconds";
				}catch(e){
					require.s.contexts._.defined[module.id]=modbak;
					return e.toString();
				}
			}else{
				return "Invalid argument";
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
		this.lsmod=function(arg){
			if(arg=="--help"){
				return [
					"Usage: lsmod [MODULE]",
					"Show the status of modules in the command processor environment",
					"      --help                 prints help",
					"      MODULE                 prints module info",
					"",
				].join("\n");

				return
			}
			if(typeof(arg)=="string"){
				if(typeof(this[arg])!="undefined"){
					return this[arg].toString();
				}else if(typeof(this.modules[arg])!="undefined"){
					return 	"----------------------------------------\n"+
						"Name: "+arg+"\n"+
						"----------------------------------------\n"+
						"Type: "+typeof(this.modules[arg])+"\n"+
						"----------------------------------------\n"+
						"Src:  "+"\n\n"+
						this.modules[arg].toString()+"\n"+
						"----------------------------------------\n"
					;
					return this.modules[arg].toString();
				}else{
					return "Module not found"
				}
			}
			var sprintf=Sprintf.sprintf
			var vsprintf=Sprintf.vsprintf
			var retobj={
				"amd":(function(){
					var ret=[];
					Object.keys(require.s.contexts._.defined).forEach(function(k){
						ret.push(k)
					}.bind(this));
					return ret;
				}.bind(this))(),
				"builtins":(function(){
					var ret=[];
					Object.keys(this).forEach(function(k){
						if(typeof(this[k].private)=='undefined')ret.push(k)
					}.bind(this));
					return ret;
				}.bind(this))(),

				"loaded":(function(){
					var ret=[];
					Object.keys(this.modules).forEach(function(k){
						if(typeof(this.modules[k].private)=='undefined')ret.push(k)
					}.bind(this));
					return ret;
				}.bind(this))(),
				"unloaded":(function(){
					try{
						var path=typeof(cache["MODROOT"])=="undefined"?
							["/mnt/c/tmp",module.uri.substring(0,module.uri.lastIndexOf("/")),"modules"].join("/"):
							cache["MODROOT"]
						;
						var ret=[];
						this.fileManager.ls(path).entries.forEach(function(item){
							if(item.Name.lastIndexOf(".js")==-1)return;
							var modnam=item.Name.lastIndexOf(".js")>0?item.Name.substring(0,item.Name.lastIndexOf(".js")):item.Name;
							if(typeof(this.modules[modnam])=="undefined")
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
			maxlen=16;retobj.amd.forEach(function(item){maxlen=maxlen<item.length?item.length:maxlen;})
			lines.push(pad("------------------","Amd",false));//"-Builtins"));
			retobj.amd.forEach(function(item){
				lines.push(item);
			})
			maxlen=16;retobj.builtins.forEach(function(item){maxlen=maxlen<item.length?item.length:maxlen;})
			lines.push("");
			lines.push(pad("------------------","Builtins",false));//"-Builtins"));
			retobj.builtins.forEach(function(item){
				lines.push(item);
			})
			maxlen=16;retobj.loaded.forEach(function(item){maxlen=maxlen<item.length?item.length:maxlen;})
			lines.push("");
			lines.push(pad("------------------","Loaded",false));//"-Builtins"));
			if(retobj.loaded.length==0)lines.push("None");
			retobj.loaded.forEach(function(item){
				lines.push(item);
			})
			maxlen=16;retobj.unloaded.forEach(function(item){maxlen=maxlen<item.length?item.length:maxlen;})
			lines.push("");
			lines.push(pad("------------------","Not Loaded",false));//"-Builtins"));
			if(retobj.unloaded.length==0)lines.push("None");
			retobj.unloaded.forEach(function(item){
				lines.push(item);
			})
			lines.push("------------------");

			return lines.join("\n");
		};
		this.lod=function(modnam){
			if(typeof(modnam)=="undefined"||modnam=="--help"){
				return [
					"Usage: lod MODULE",
					"Loads module",
					"      --help                 prints help",
					"",
				].join("\n");
			}
			if(modnam=="*"){
				//var path=[module.uri.substring(0,module.uri.lastIndexOf("/")),"modules"].join("/");
				var path=typeof(cache["MODROOT"])=="undefined"?
					["/mnt/c/tmp",module.uri.substring(0,module.uri.lastIndexOf("/")),"modules"].join("/"):
					cache["MODROOT"]
				;
				var ret=[];
				this.fileManager.ls(path).entries.forEach(function(item){
					if(item.Name.lastIndexOf(".js")==-1)return;
					var modnam=item.Name.lastIndexOf(".js")>0?item.Name.substring(0,item.Name.lastIndexOf(".js")):item.Name;
					ret.push(this.lod(modnam));
				}.bind(this));
				return ret.join("\n");

			}
			/*
			*/
			if(typeof(modnam)=="string"&&modnam!=""){
				try{
					var t0=new Date();
					var modpath=[module.uri.substring(0,module.uri.lastIndexOf("/")),"modules",modnam.endsWith(".js")?modnam:[modnam,"js"].join(".")].join("/");
					var result;
					var modobtained=false;//workaround
					//clear
					var modbak=require.s.contexts._.defined[module.id];//backup untested
					try{
						require.undef(modpath);
						delete this.modules[modnam];
					}catch(e){
						console.error("Failed to unload "+modpath);
					}
					//load
					require([modpath],function(mod){
						modobtained=true;
						if(typeof(mod)=="function"){
							//result=mod.apply(this,arguments);
							var t1=new Date();
							this.modules[modnam]=mod;
							modobtained=true;
							result=modnam+" loaded in "+(t1-t0)+" milliseconds";
						}else if(typeof(mod)=="object"){
							var t1=new Date();
							this.modules[modnam]=mod;
							modobtained=true;
							result=modnam+" loaded in "+(t1-t0)+" milliseconds";
						}else{
							console.error("Invalid module");
							modobtained=false;
							result="invalid module";
						}
					}.bind(this));
					result=modobtained?result:"failed to obtain module";
					return result;
				}catch(e){
					return {"error":e.toString()};
				}
			}else{
				return "invalid argument";
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
							delete this.modules[modnam];
							result="Module "+modnam+" unloaded and purged"
						}catch(e){
							console.error("Failed to unload"+modpath);
							result="Failed to unload module "+modnam;
						}
					}else{
						if(this.modules[modnam]!="undefined"){
							delete this.modules[modnam];
							result="Module "+modnam+" unloaded"
						}else{
							result="Module does not exist";
						}
					}
					return result;
				}catch(e){
					return {"error":e.toString()};
				}
			}else{
				return {"error":"invalid argument"}
			}
		};
		this.setmod=function(arg){
			if(typeof(arg)=="undefined"||arg=="--help"){
				return [
					"Usage: setmod MOD=CODE",
					"Manually sets module code",
					"      --help                 prints help",
					"",
				].join("\n");

			}else if(arg.indexOf("=")>0){
				try{
					var k=arg.split("=")[0]
					var v=[arg.split("=")[1]].concat(Object.values(arguments).slice(1)).join(" ");
					this.modules[k]=eval(v)
				}catch(e){
					return e.toString();
				}
			}else{
			}

		}
		this.pwd=function(){
		    return this.fileManager.pwd().cwd;
		}
		this.cd=function(path){
		    try{var result=this.fileManager.cd(path);if(result.error)return result.error}catch(e){return e.toString()};
		}
		this.cat=function(path){
			try{
				return this.fileManager.cat(path).contents;
			}catch(e){
				return e.toString();
			}
		}
		this.ls=function(path){
		    return (function(){
		        var ret="";
		        this.fileManager.ls(path).entries.forEach(function(item){
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
					this.fileManager.mkdir(path);
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
					this.fileManager.touch(path);
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
					this.fileManager.rm(path);//.removed attribute alwasy true...
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
				cache[arg.substring(0,arg.indexOf("="))]=
					arg.substring(arg.indexOf("=")+1)
					+(Object.values(arguments).slice(1))
					;
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
