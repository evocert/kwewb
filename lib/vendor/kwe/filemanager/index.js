define([
	"module",
	"console",
	"pathutils"
],function(
	module,
	console,
	pathutils
){
	"use strict";
	function FileManager(options){
		options=typeof(options)=="object"?options:{};
		options.cwd=typeof(options.cwd)=="string"?options.cwd:"/";
		options.cwd=pathutils.normalizepath(options.cwd)
		this.normalize=pathutils.normalizepath;
		this.options=options;
		this.cwd=this.options.cwd;
		this.cd=function(path){
			console.log(path);
			path=typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			path=path.indexOf("./")==0||path.indexOf("../")==0?
				pathutils.normalizepath([this.cwd,path].join("/")):
				path.indexOf("/")==0?path:
				pathutils.normalizepath([this.cwd,path].join("/"));
			var ret={
				cwd:this.cwd
			};
			var cwd_=path;
			var listing;
			try{
				listing=fsutils.List(cwd_);
				this.cwd=cwd_;
				ret={cwd:this.cwd};
			}catch(e){
				ret.error=e.toString();
			}
			return ret;
		};
		this.pwd=function(){
			var ret={};
			ret.cwd=this.cwd;
			return ret;
		}
		this.ls=function(path){
			path=typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			path=path.indexOf("./")==0||path.indexOf("../")==0?
				pathutils.normalizepath([this.cwd,path].join("/")):
				path.indexOf("/")==0?path:
				pathutils.normalizepath([this.cwd,path].join("/"));
			console.log(path);
			var entries;
			var ret={};
			try{entries=fsutils.List(path)}catch(e){ret.error=e.toString();};
			ret.entries=entries;
			return ret;
		}
		this.find=function(path){
			path=path==null||typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			//path=path.indexOf("./")==0||path.indexOf("../")==0?pathutils.normalizepath([this.cwd,path].join("/")):path;
			path=path.indexOf("./")==0||path.indexOf("../")==0?
				pathutils.normalizepath([this.cwd,path].join("/")):
				path.indexOf("/")==0?path:
				pathutils.normalizepath([this.cwd,path].join("/"));
			var ret={};
			var entries;
			try{entries=fsutils.Walk(path);ret.entries=entries;}catch(e){ret.error=e.toString();};
			return ret;
		}
		this.cat=function(path){
			path=typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			path=path.indexOf("./")==0||path.indexOf("../")==0?
				pathutils.normalizepath([this.cwd,path].join("/")):
				path.indexOf("/")==0?path:
				pathutils.normalizepath([this.cwd,path].join("/"));
			var ret={};
			var contents;
			try{contents=fsutils.File2String(path);ret.contents=contents}catch(e){ret.error=e.toString();}
			return ret;
		}
		this.touch=function(path){
			path=typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			path=path.indexOf("./")==0||path.indexOf("../")==0?
				pathutils.normalizepath([this.cwd,path].join("/")):
				path.indexOf("/")==0?path:
				pathutils.normalizepath([this.cwd,path].join("/"));
			var ret={created:false};
			try{fsutils.String2File(path);ret.created=true;}catch(e){ret.error=e.toString();}
			return ret;
		}
		this.mkdir=function(path){
			path=typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			path=path.indexOf("./")==0||path.indexOf("../")==0?
				pathutils.normalizepath([this.cwd,path].join("/")):
				path.indexOf("/")==0?path:
				pathutils.normalizepath([this.cwd,path].join("/"));
			var ret={};
			try{ret.created=fsutils.MkDir(path,"");}catch(e){ret.error=e.toString();}
			return ret;
		}
		this.rm=function(path){
			path=typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			path=path.indexOf("./")==0||path.indexOf("../")==0?
				pathutils.normalizepath([this.cwd,path].join("/")):
				path.indexOf("/")==0?path:
				pathutils.normalizepath([this.cwd,path].join("/"));
			var ret={};
			try{ret.removed=fsutils.Rm(path,"");}catch(e){ret.error=e.toString();}
			return ret;
		}
		this.setcontents=function(path,contents){
			path=typeof(path)=='undefined'?this.cwd:path;
			if(typeof(path)!='string')return{"error":"invalid path"};
			path=path.indexOf("./")==0||path.indexOf("../")==0?pathutils.normalizepath([this.cwd,path].join("/")):path;
			if(typeof(contents)!='string')return{"error":"invalid contents"};
			var ret={created:false};
			try{fsutils.String2File(path,contents);ret.updated=true;}catch(e){ret.error=e.toString();}
			return ret;
		}
	};
	module.exports=FileManager;
});
