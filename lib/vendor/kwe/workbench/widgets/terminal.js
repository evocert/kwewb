define([
	"module",
	"axios",
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
		args.svcurl=typeof(args.svcurl)=="string"?args.svcurl:"a";
		this.cwd=args.cwd;
		this.svcurl=args.svcurl;
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
					}.bind(this),
					{
						greetings:"KWEterm 0.1",
						pipe:true,
						checkArity:false,
						prompt:[this.filemanager.cwd,"$ "].join(""),//"$ ",
						//height:10,
						onInit:function(term){
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
			}
		});
	};
	module.exports=Terminal;
});

