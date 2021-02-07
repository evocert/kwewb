define([
	"module",
	"kwe.filemanager"
],function(
	module,
	FileManager
){
	"use strict"
	function CMDProcessor(){
		var cache={};
        	var fileManager=new FileManager();
		function str2argv(args){
			if(typeof(args)!="string")throw("invalid argument type");
			return args.split(" ");
		};
		this.exec=function(args){
			args=str2argv(args);
			if(typeof(this[args[0]])=="function")return this[args[0]].apply(this,args.slice(1));
			if(cache[["$",args[0]].join("")]!=null){
				return cache[["$",args[0]].join("")];
			}
			return "invalid cmd";
		};this.exec.private=true;
		this.reload=function(){
			var modbak=require.s.contexts._.defined[module.id];//backup untested
			try{
			    var t0=new Date();
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
		//--------------------------------------------------------------------------------
		this.lsmod=function(a){
			return {"functions":(function(){
				var ret=[];
				Object.keys(this).forEach(function(k){
					if(typeof(this[k].private)=='undefined')ret.push(k)
				}.bind(this));
				return ret;
			}.bind(this))()};
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





