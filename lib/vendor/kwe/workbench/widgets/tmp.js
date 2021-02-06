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
						//call ws send with cmd
						term.ws.send(cmd).then(function(val){
							term.echo(JSON.stringify(val));
						},function(err){
							term.error(val);
						});
					}.bind(this),
					{
						greetings:"KWEterm 0.2",
						pipe:false,//true,
						checkArity:false,
						prompt:"$ ",
						//height:10,
						onInit:function(term){
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
											console.log("done initializing startup code");
										}.bind(this));
									`;
								},
								onmessage:function(val){
									return`ex(${JSON.stringify(val)});`;
								},
								onclose:function(val){
								}
							});
							term.ws.connect().then(function(){
								console.log("connected");
								term.resume()
							}.bind(this),function(err){
								console.log("failed to connect:"+err.toString());
							}.bind(this));
							//--------------------------------------------------------------------------------
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
				term.ws.disconnect();
			}
		});
	};
	module.exports=Terminal;
});



