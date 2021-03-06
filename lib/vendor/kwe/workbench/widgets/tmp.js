//todo:initialize/switch http/ws mod
define([
	"module",
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
	FileManager,
	jq,
	jspanel,
	jqt,
){
	$=jq;
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
			headerTitle:"TerminalTest",
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
						//call ws send with cmd
						term.ws.send(cmd).then(function(val){
							if(typeof(val)=="undefined"||val==null||val==""||val=="\n"){
							}else if(typeof(val)=='string'||typeof(val)=="number"||typeof(val)=="boolean"){
								/*
								require(["sam"],function(sam){
									sam(val.replace(/[\W_]+/g," ").substring(0,128));
								});
								*/
								term.echo(val);
							}else if(typeof(val)=="object"){
								//process feedback
								if(Array.isArray(val.feedback)){
									val.feedback.forEach(function(feedbackitem){
										switch(feedbackitem.type){
											case "html":
												try{
													term.echo($(feedbackitem.value));
												}catch(e){
													term.error(e.toString());
												}
												break;
											case "exec":
												try{
													eval(feedbackitem.value);
												}catch(e){
													term.error(e.toString());
												}
												break;
											case "reload":
												window.location.reload();
												break;
											case "alert":
												alert(feedbackitem.value);
												break;
											case "console.log":
												console.log(feedbackitem.value);
												break;
											case "console.error":
												console.error(feedbackitem.value);
												break;
											case "console.warn":
												console.warn(feedbackitem.value);
												break;
											case "console.debug":
												console.debug(feedbackitem.value);
												break;
											case "echo":
												term.echo(feedbackitem.value);
												break;
											default:
												term.error("invalid feedback");
												console.error("invalid feedback");
												break;
										};
									}.bind(this));

								}else if(typeof(val.feedback)=="object"){
									switch(val.feedback.type){
										case "html":
											try{
												term.echo($(val.feedback.value));
											}catch(e){
												term.error(e.toString());
											}
											break;
										case "exec":
											try{
												eval(val.feedback.value);
											}catch(e){
												term.error(e.toString());
											}
											break;
										case "reload":
											window.location.reload();
											break;
										case "alert":
											alert(val.feedback.value);
											break;
										case "console.log":
											console.log(val.feedback.value);
											break;
										case "console.error":
											console.error(val.feedback.value);
											break;
										case "console.warn":
											console.warn(val.feedback.value);
											break;
										case "console.debug":
											console.debug(val.feedback.value);
											break;
										case "echo":
											term.echo(val.feedback.value);
											break;
										default:
											console.error("invalid feedback");
											break;
									};
								}else{
									if(val.cwd){
										term.set_prompt(val.cwd+" $ ");
									}
									term.echo(JSON.stringify(val,0,2));
								}
							}
						},function(err){
							term.error(val);
						});
					}.bind(this),
					{
						greetings:"KWEterm 0.2",
						pipe:true,//true,
						checkArity:false,
						prompt:"$ ",
						//height:10,
						onInit:function(term){
							term.pause()
							term.setupws=function(){
								term.pause()
								//initialize ws
								//initialize startup code
								//   load general terminal handler
								//todo: startup handler template
								term.ws=new Ws({
									//url:"ws://localhost:1030",
									onconnect:function(){
										//init script
										//edit ./www/kwewb/lib/kwe/cmdprocessor/index.js to add functionality
										//for input process output
										return`
											//require=null;
											//requirejs=null;
											//define=null;
											//eval(fsutils.File2String("./www/kwewb/lib/vendor/requirejs/require.evocert.js"));
											require(["./www/kwewb/lib/config.goja.js"]);
											require([
												"module",
												"console",
												"kwe.cmdprocessor",
											],function(
												module,
												console,
												CmdProcessor
											){
												this.cmdProcessor=new CmdProcessor();
												console.log("initializing startup code");
												this.ex=function(args){
													try{
														print(JSON.stringify(this.cmdProcessor.exec(args)));
													}catch(err){
														print(JSON.stringify({"error":err.toString()}));
													}
												};
												this.poll=function(args){
													try{
														print(JSON.stringify(this.cmdProcessor.poll(args)));
													}catch(err){
														print(JSON.stringify({"error":err.toString()}));
													}
												};
												console.log("done initializing startup code");
											}.bind(this));
										`;
									},
									onmessage:function(val){
										return`ex(${JSON.stringify(val)});`;
									},
									onclose:function(val){
										term.echo("Closed: Reconnecting....");
										term.setupws();
									}.bind(this),
								});
								//--------------------------------------------------------------------------------
								term.ws.connect().then(function(){
									term.echo("Connected");
									term.pollinterval=500;
									term.pollfunction="poll();"
									term.pollon=false;
									term.setpollfunction=function(val){
										if(typeof(val)=="string"){
											term.pollfunction=val;
											term.echo("polling function set to "+val);
											if(!term.pollon)return;
											window.clearInterval(panel.term.poller);
											term.startpoll();
										}else{
											term.error("invalid argument");
										}
									}
									term.setpollinterval=function(val){
										if(typeof(val)=="number"){
											term.pollinterval=val;
											term.echo("polling interval set to "+val);
											if(!term.pollon)return;
											window.clearInterval(panel.term.poller);
											term.startpoll();
										}else{
										}
									};
									term.startpoll=function(){
										term.echo("polling started at "+term.pollinterval+" ms");
										term.pollon=true;
										term.poller=window.setInterval(function(){
											if(!term.pollon)return;
											term.ws.sendraw(term.pollfunction).then(function(val){
												if(typeof(val)=="undefined"||val==null||val==""||val=="\n")return;
												if(typeof(val)=='string')term.echo(val);else{
													if(val.cwd)term.set_prompt(val.cwd+" $ ");
													term.echo(JSON.stringify(val,0,2));
												}
											},function(err){
												term.error(val);
											});
										}.bind(this),term.pollinterval);
									}
									term.stoppoll=function(){
										term.pollon=false;
										window.clearInterval(panel.term.poller);
										term.echo("polling stopped");
									}
									term.resume()
								}.bind(this),function(err){
									term.echo("Failed to connect");
									//window.setTimeout(term.connect.bind(this),1000);
								}.bind(this));
								//--------------------------------------------------------------------------------
							}
							term.setupws();
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
				panel.term.stoppoll();
				panel.term.ws.disconnect();
			}
		});
	};
	module.exports=Terminal;
});



