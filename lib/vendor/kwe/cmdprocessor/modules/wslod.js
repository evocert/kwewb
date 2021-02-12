define(
[
	"module"
],function(
	module
){
	"use strict";
	function bytesToSize(bytes) {
		   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		   if (bytes == 0) return '0 Byte';
		   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	}
	module.exports=function(path){
		if(typeof(path)=="string"){
			if(path=="*"){
				var ret={feedback:[]};
				var t0=new Date();
				var tidx=0;
				var sztot=0;
				this.fileManager.ls().entries.forEach(function(entry){
					if(entry.Name.endsWith('.js')){
						var t0=new Date();
						var path=[this.fileManager.pwd().cwd,entry.Name].join("/");
						console.Log("Loading "+path);
						var code=this.fileManager.cat(path).contents;
						sztot+=code.length;
						var t1=new Date();
						var tlod=(t1-t0);
						ret.feedback.push({
								type:"exec",
								value:[
									'var path='+JSON.stringify(path)+';',
									'var code='+JSON.stringify(code)+';',
									'var szcode='+JSON.stringify(szcode)+';',
									'var tlod='+tlod+';',
									'try{',
									//'	term.echo(`Loading ${szcode} bytes from ${path}...`);',
									'	var t0=new Date();',
									'	eval.call(window,code);',
									'	var t1=new Date();',
									//'	term.echo(`Done [${tlod+(t1-t0)} ms]...`);',
									'}catch(e){',
									'	term.error(`Failed to load ${path}...`);',
									'	term.error(e.toString());',
									'	console.error(`Failed to load ${path}...`);',
									'	console.error(e);',
									'}',
								].join("\n")
						});
						console.Log("Done Loading "+path);
						tidx++;
					}//if
				}.bind(this));
				var t1=new Date();
				ret.feedback.push({
					type:"exec",
					value:[
						'term.echo("'+JSON.stringify(tidx)+' modules loaded in '+JSON.stringify(t1-t0)+' ms, '+bytesToSize(sztot)+'");'
					].join("\n")
				});
				return ret;
			}else{
				var ret=null;
				var t0=new Date();
				var path=[this.fileManager.pwd().cwd,path].join("/");
				console.Log("Loading "+path);
				var code=this.fileManager.cat(path).contents;
				var szcode=bytesToSize(code.length)
				var t1=new Date();
				var tlod=(t1-t0);
				ret={
					feedback:{
						type:"exec",
						value:[
							'var path='+JSON.stringify(path)+';',
							'var code='+JSON.stringify(code)+';',
							'var szcode='+JSON.stringify(szcode)+';',
							'var tlod='+tlod+';',
							'try{',
							'	term.echo(`Loading ${szcode} bytes from ${path}...`);',
							'	var t0=new Date();',
							'	eval.call(window,code);',
							'	var t1=new Date();',
							'	term.echo(`Done [${tlod+(t1-t0)} ms]...`);',
							'}catch(e){',
							'	term.error(`Failed to load ${path}...`);',
							'	term.error(e.toString());',
							'}',
						].join("\n")
						
					}
				}
				console.Log("Done Loading "+path);
			}
		}
		else
			return "No path specified"
	};
});
