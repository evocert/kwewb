//todo:initialize/switch http/ws mod
define([
	"module",
	"axios",
	"kwe.ws",
	"kwe.filemanager",
	"jquery",
	"jspanel",
	"jquery.terminal",
	"css!vendor/jqueryterminal/css/jquery.terminal-2.19.2.min.css",
	"css!vendor/jspanel/jspanel.css",
	"css!vendor/animate/4.4.1/animate.min.css",
	"css!vendor/bootswatch/4.5.2/slate/bootstrap.css",
	"css!vendor/fontawesome/css/font-awesome.min.css",
],function(
	module,
	Ws,
	axios,
	FileManager,
	jq,
	jspanel,
	jqt,
){
	$=jq;
	function pad(pad,str,padLeft){
		if(typeof(str)==="undefined") 
			return pad;
		if(padLeft){
			return(pad+str).slice(-pad.length);
		}else{
			return(str+pad).substring(0,pad.length);
		}
	}
	function Terminal(args){
		args=typeof(args)=="object"?args:{};
		args.cwd=typeof(args.cwd)=="string"?args.cwd:"/";
		args.svcurl=typeof(args.svcurl)=="string"?args.svcurl:"/kwewb/lib/vendor/kwe/filemanager/index.svc.js";
		switch(args.mode){
			case"ws":
			case"http":
				break;
			default:
				args.mode="ws";
				break;
		};
		this.cwd=args.cwd;
		this.svcurl=args.svcurl;
		this.mode=args.mode;
		var panelHintConfig={
			panelSize:[640,480].join(" "),
			theme:"#222222 fillcolor #252525",
			headerControls:{
				size:"xs"
			},
			animateIn:"animate__animated animate__bounceIn",
			animateOut:"animate__animated animate__bounceOut"
		};
		this.panel=jsPanel.create({
			config:panelHintConfig,
			headerTitle:"Terminal",
			callback:function(panel){
				this.path=["/",args.component.getCurrentDirectory().path].join("");
				this.filemanager=new FileManager({cwd:this.path})
				$(panel.content).css({
					"background":"#000000",
					"height":"100%",
					"width":"100%",
					"padding":"0px",
				});
				var container=$("<div/>").css({
					"height":"100%",
					"width":"100%",
				});
				$(panel.content).append(container);
				panel.term=container.terminal(
					function(cmd,term){
						window.term=term;
						window.fm=this.filemanager;
						cmd=cmd.trim();
						var action=cmd.substring(0,cmd.indexOf(" ")>0?cmd.indexOf(" "):cmd.length);
						var rest=cmd.indexOf(" ")>0?cmd.substring(cmd.indexOf(" ")).trim():null;
						if(term.mode=="ws"){
							switch(action){
								case "pwd":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.pwd()));`);
									break;
								case "ls":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.ls(${JSON.stringify(rest)})));`);
									break;
								case "find":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.find(${JSON.stringify(rest)})));`);
									break;
								case "cd":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.cd(${JSON.stringify(rest)})));`);
									break;
								case "mkdir":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.mkdir(${JSON.stringify(rest)})));`);
									break;
								case "rm":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.rm(${JSON.stringify(rest)})));`);
									break;
								case "touch":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.touch(${JSON.stringify(rest)})));`);
									break;
								case "cat":
									term.sendeval(term.socket,`print(JSON.stringify(this.fm.cat(${JSON.stringify(rest)})));`);
									break;
								default:
									term.echo("Invalid command");
									break;
							};

						}else{
							switch(action){
								case "pwd":
									term.pause();
									this.filemanager.pwd().then(function(val){
										term.resume();
										term.echo(val);
									}.bind(this),function(err){
										term.echo(err.toString());
										term.resume();
									}.bind(this));
									break;
								case "ls":
									term.pause();
									this.filemanager.ls(rest).then(function(val){
										try{
											var maxszlen=0;
											val.forEach(function(item){
												if(item.Size.toString().length>maxszlen)maxszlen=item.Size.toString().length;
											});
											var padding=Array(maxszlen).join(" ");
											val.forEach(function(item){
												term.echo([
													(item.Type=="Dir"?"d":"-"),
													"rwxrwxrwx 1 skullquake skullquake ",
													pad(padding,item.Size,true),
													" Feb  4 00:00 ",
													item.Name
												].join(""));
											})
										}catch(e){
											term.error(e.toString());
										}
										term.resume();
									}.bind(this),function(err){
										term.error(err.toString());
										term.resume();
									}.bind(this));
									break;
								case "find":
									term.pause();
									this.filemanager.find(rest).then(function(val){
										try{
											var maxszlen=0;
											val.forEach(function(item){
												if(item.Size.toString().length>maxszlen)maxszlen=item.Size.toString().length;
											});
											var paddingsz=Array(maxszlen).join(" ");
											var maxpathlen=0;
											val.forEach(function(item){
												if(item.Path.length>maxpathlen)maxszlen=item.Path.length;
											});
											var paddingpath=Array(maxpathlen).join(" ");
											val.forEach(function(item){
												term.echo([
													(item.Type=="Dir"?"d":"-"),
													"rwxrwxrwx 1 skullquake skullquake ",
													pad(paddingsz,item.Size,true),
													" Feb  4 00:00 ",
													pad(paddingpath,item.Path,true)
												].join(""));
											})
										}catch(e){
											term.error(e.toString());
										}
										term.resume();
									}.bind(this),function(err){
										term.error(err.toString());
										term.resume();
									}.bind(this));
									break;

								case "cd":
									term.pause();
									this.filemanager.cd(rest).then(function(val){
										//term.echo(JSON.stringify(val));
										term.set_prompt([this.filemanager.cwd,"$ "].join(""));
										term.resume();
									}.bind(this),function(err){
										term.error(err.toString());
										term.resume();
									}.bind(this));
									break;
								case "mkdir":
									term.pause();
									this.filemanager.mkdir(rest).then(function(val){
										//term.echo(JSON.stringify(val));
										term.resume();
									}.bind(this),function(err){
										term.error(err.toString());
										term.resume();
									}.bind(this));
									break;
								case "rm":
									term.pause();
									this.filemanager.rm(rest).then(function(val){
										//term.echo(JSON.stringify(val));
										term.resume();
									}.bind(this),function(err){
										term.error(err.toString());
										term.resume();
									}.bind(this));
									break;
								case "touch":
									term.pause();
									this.filemanager.touch(rest).then(function(val){
										term.resume();
									}.bind(this),function(err){
										term.error(err.toString());
										term.resume();
									}.bind(this));
									break;
								case "cat":
									term.pause();
									this.filemanager.cat(rest).then(function(val){
										term.echo(val);
										term.resume();
									}.bind(this),function(err){
										term.error(err.toString());
										term.resume();
									}.bind(this));
									break;
								default:
									term.echo("Invalid command");
									break;
							};

						}
					}.bind(this),
					{
						greetings:"KWEterm 0.1",
						pipe:true,
						checkArity:false,
						prompt:[this.filemanager.cwd,"$ "].join(""),//"$ ",
						//height:10,
						onInit:function(term){
							term.mode=args.mode;
							if(term.mode=="ws"){
								term.socket=null;
								term.sendeval=function(socket,val){
									var valproc=["#!js","\x3C\x40",val.trim(),"\x40\x3E","#!commit","\r\n"].join("\r\n")
									socket.send(valproc);
								};
								UTF8 = {
									encode: function(s){
										for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
											s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
										);
										return s.join("");
									},
									decode: function(s){
										for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
											((a = s[i][c](0)) & 0x80) &&
											(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
											o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
										);
										return s.join("");
									}
								};
								function setupws(){
									term.socket=new WebSocket("ws://"+window.location.host);
									term.socket.onopen = function(e) {
										term.clear()
										term.echo("Reconnected")
										console.log('onopen');
										term.sendeval(term.socket,`println('Setting up shell...');`);
										term.sendeval(term.socket,
	`
	try{
		require.config({
			paths:{
				"kwe.srvcommand":"www/kwewb/lib/vendor/kwe/srvcommand/index",
				"kwe.filemanager":"www/kwewb/lib/vendor/kwe/filemanager/index",
				"pathutils":"www/kwewb/lib/vendor/kwe/pathutils/index",
				"console":"www/kwewb/lib/vendor/kwe/console/index",
			}
		});
		require([
			"module",
			"console",
			"kwe.srvcommand",
			"kwe.filemanager",
		],function(
			module,
			console,
			SrvCommand,
			FileManager
		){
			console.log("Initializing filemanager...");
			try{//basic usage
				this.fm=typeof(this.fm)=='undefined'?(function(){
					return new FileManager();
				}).bind(this)():(function(){
					return this.fm;
				}).bind(this)();
			}catch(e){
				console.log(e.toString());
				println(e.toString());
			}
			console.log("Done initializing filemanager...");
		}.bind(this));
	}catch(e){println(e.toString());}
	`
										);
									};
									term.socket.onmessage=function(event){
										var line=event.data.trim();
										if(line!=null&&line!="")term.echo(UTF8.decode(line));
									};
									term.socket.onclose=function(event) {
										console.log('onclose');
										if (event.wasClean) {
											console.log(event.code);
											console.log(event.reason);
										} else {
											// e.g. server process killed or network down
											// event.code is usually 1006 in this case
											console.error('[close] Connection died');
										}
										if(!term.done)setupws();
									};
									term.socket.onerror = function(error) {
										console.error('onerror');
										console.error(error.message);
									};
								}
								setupws();
							}
						}.bind(this)
					}
				);
			}.bind(this),
			position:{
				offsetX:16,
				offsetY:16,
			},
			resizeit:{
				start:$.proxy(function(panel,size){
				},this),
				resize:$.proxy(function(panel,size){
				},this),
				stop:$.proxy(function(panel,size){
				},this)
			},
			onclosed:function(panel){
				if(panel.term.mode=="ws"){
					panel.term.done=true;
					panel.term.socket.close();
				}
			}
		});
	};
	module.exports=Terminal;
});
