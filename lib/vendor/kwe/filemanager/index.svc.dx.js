<@
    var t0=new Date();
	var GOJA={};
	//configpath="../../../config.goja.js";
	//relative path above does not work in zipped resource, resort to the following...
	var configpath=action().Path().split('/');
	configpath.pop();
	configpath.pop();
	configpath.pop();
	configpath.pop();
	configpath.push("config.goja.js");
	var configpath=configpath.join("/");
	require([configpath],function(){require([
		"request",
		"idutils",
		"kwe.filemanager"
	],function(
		req,
		idutils,
		FileManager,
	){
		try{
			function validate(args){
				return true;
			}
			var ROOT="/";
			var actions={
				GetDirContents:function(args){
					var path=[ROOT];
					args.pathInfo.forEach(function(pathcomponent){
						path.push(pathcomponent.name);
					});
					path=path.join('/');
					if(path.indexOf("//")==0)path=path.substring(1);
					return{
						"success": true,
						"errorId": null,
						"errorText": "",
						"result": (function(){
							var ret=[];
							function cmp(a,b){
								if(a.Name>b.Name)return 1;
								return -1;
							};
							function populate(item){
								var obj={};
								//issue: need unique key
								//issue: need key consistent between requests
								//need something seperate for root folder and folder created inside with same name
								//console.Log("ITEM");
								////console.Log(JSON.stringify(item));
								obj.key=item.Path;//JSON.stringify(item);//item.Name;//idutils.uuidv4();//item.Name;
								obj.name=item.Name;
								obj.size=item.Size;
								obj.isDirectory=item.Type=="Dir";
								obj.hasSubDirectories=item.Type=="Dir";
								ret.push(obj);
							}
							var fm=new FileManager({cwd:path});
							var entries=fm.ls().entries;
							var arrdir=entries.filter(function(a){return a.Type=="Dir"}).sort(cmp);
							var arrreg=entries.filter(function(a){return a.Type!="Dir"}).sort(cmp);
							arrdir.sort(cmp);
							arrreg.sort(cmp);
							arrdir.forEach(populate);
							arrreg.forEach(populate);
							return ret.length>0?ret:null;
						})()
					}
				},
				GetFileContents:function(args){
					console.Log("GetFileContents:function(args){");
					var path=[ROOT];
					args.pathInfo.forEach(function(pathcomponent){
						path.push(pathcomponent.name);
					});
					path=path.join('/');
					if(path.indexOf("//")==0)path=path.substring(1);
					try{
						var contents=fsutils.File2String(path);
						ret={
							"success":true,
							"errorId":null,
							"errorText":"",
							"result":contents
						}
					}catch(e){
						ret={
							"success":false,
							"errorId":null,
							"errorText":"Failed to create folder"
						}
					}
					return ret;
				},
				SetFileContents:function(args){
					console.Log("SetFileContents:function(args){");
					var path=[ROOT];
					args.pathInfo.forEach(function(pathcomponent){
						path.push(pathcomponent.name);
					});
					path=path.join('/');
					var value=args.value;
					if(path.indexOf("//")==0)path=path.substring(1);
					try{
						fsutils.String2File(path,value);
						ret={
							"success":true,
							"errorId":null,
							"errorText":"",
							"result":[value.length,"bytes saved to",path].join(" ")
						}
					}catch(e){
						ret={
							"success":false,
							"errorId":null,
							"errorText":"Failed to create folder"
						}
					}
					return ret;
				},

				CreateDir:function(args){
					var ret={}
					try{
						var path=[ROOT];
						args.pathInfo.forEach(function(pathcomponent){
							path.push(pathcomponent.name);
						});
						path.push(args.name);
						path=path.join('/');
						if(path.indexOf("//")==0)path=path.substring(1);
						console.Log(path);
						var fm=new FileManager({cwd:path});
						var fmcrtres=fm.mkdir(path);
						if(fmcrtres.created==true){
							ret={
								"success": true,
								"errorId": null,
								"errorText": ""
							}
						}else{
							ret={
								"success": false,
								"errorId": null,
								"errorText": "Failed to create folder"
							}
						}
					}catch(e){
						ret={
							"success": false,
							"errorId": null,
							"errorText": e.toString()
						}
					}
					return ret;
				},
				CreateFile:function(args){
					console.Log("CreateFile");
					var ret={}
					try{
						var path=[ROOT];
						args.pathInfo.forEach(function(pathcomponent){
							path.push(pathcomponent.name);
						});
						directory=path.join('/');
						if(directory.indexOf("//")==0)directory=directory.substring(1);
						path.push(args.name);
						path=path.join('/');
						if(path.indexOf("//")==0)path=path.substring(1);
						var fm=new FileManager({cwd:directory});
						var exists=fm.ls(directory).entries.find(function(entry){
							return entry.Name==args.name;}
						)!=null;
						if(!exists){
							var fmcrtres=fm.touch(path,'');
							if(fmcrtres.created==true){
								ret={
									"success": true,
									"errorId": null,
									"errorText": ""
								}
							}else{
								ret={
									"success": false,
									"errorId": null,
									"errorText": "Failed to create file"
								}
							}
						}else{
							ret={
								"success": false,
								"errorId": null,
								"errorText": "File already exists"
							}
						}
					}catch(e){
						ret={
							"success": false,
							"errorId": null,
							"errorText": e.toString()
						}
					}
					return ret;
				},
				Remove:function(args){
					var ret={}
					try{
						var path=[ROOT];
						args.pathInfo.forEach(function(pathcomponent){
							path.push(pathcomponent.name);
						});
						path=path.join('/');
						if(path.indexOf("//")==0)path=path.substring(1);
						console.Log("REMOVE");
						console.Log(path);
						var fm=new FileManager({cwd:path});
						var fmcrtres=fm.rm(path);
						if(fmcrtres.removed==true){
							ret={
								"success": true,
								"errorId": null,
								"errorText": ""
							}
						}else{
							ret={
								"success": false,
								"errorId": null,
								"errorText": "Failed to create folder"
							}
						}
					}catch(e){
						ret={
							"success": false,
							"errorId": null,
							"errorText": e.toString()
						}
					}
					return ret;
				}

			};
			var ret={};
			var t0=new Date();
			if(req.data().command==null){
				ret={"error":"no action specfied"};
			}else if(req.data().arguments==null){
				ret={"error":"arguments"};
			}else if(actions[req.data().command]!=null){
				if(validate(req.data().arguments)){
					ret=actions[req.data().command](req.data().arguments);
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
			print(JSON.stringify({"error":e.toString()}));
		}
	});});
    var t1=new Date();
    console.Log(t1-t0);
@>








