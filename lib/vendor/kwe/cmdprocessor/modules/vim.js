define([
	"module",
	"console",
	"text!vendor/kwe/cmdprocessor/modules/client/vim.js",
],function(
	module,
	console,
	txt
){
	"use strict";
	console.log('module');
	function proc(){
		this.stdio=null;
		this.main=function(argc,argv){
			console.log(module.id);
			console.log(this.stdio);
			if(typeof(arguments[1])=="undefined"){
				this.stdio.stdout={
					feedback:{
						type:"echo",
						value:"no file name provided/no stdin"
					}
				};
				return 1;
			}
			var options={};

			if(arguments[1]=="-"){//stdin
				options={
					filename:"stdin",
					contents:this.stdio.stdin,
					path:null
				}
			}else{
				try{
					var item=this.fileManager.cat(arguments[1]);
					if(item.error!=null){
						this.stdio.stdout={
							feedback:{
								type:"echo",
								value:"Failed to load file: "+item.error
							}
						};
						return 1;
					}
					var filepath=this.fileManager.normalize([this.fileManager.pwd().cwd,arguments[1]].join("/"));
					options={
						filename:[arguments[1],filepath].join(" - "),
						contents:item.contents,
						path:filepath
					};
					this.stdio.stdout={
						feedback:{
							type:"exec",
							value:[
								txt,
								'require(["vim"],function(vim){',
								'	var options=',
								JSON.stringify(options),
								';',
								'	vim(',
								JSON.stringify(options),
								');',
								'});'
							].join("\n")
						}
						//this.stdio.stdin+Object.values(arguments).join(" ")
					}
					return 0;
				}catch(e){
					this.stdio.stdout={
						feedback:{
							type:"echo",
							value:"Error opening file: "+e.toString(),
						}
					};
					return 1;
				}
			}
		}
	};
	module.exports=new proc();
});

