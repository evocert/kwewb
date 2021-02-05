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
	function Terminal(args){
		args=typeof(args)=="object"?args:{};
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
			headerTitle:"WSTerm",
			callback:function(panel){
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
				function sendeval(socket,val){
					var valproc=["#!js","\x3C\x40",val.trim(),"\x40\x3E","#!commit","\r\n"].join("\r\n")
					socket.send(valproc);
				};
				panel.term=container.terminal(
					function(cmd,term){
						sendeval(term.socket,`cmd.exec(${JSON.stringify([cmd,<@ print(JSON.stringify(osutils.GOOS()=="linux"?" 2>&1":"")); @>].join(""))});`);
					}.bind(this),
					{
						greetings:"KWEterm 0.1",
						pipe:true,
						checkArity:false,
						prompt:"$ ",
						//height:10,
						onInit:function(term){
							term.socket=null;
							function setupws(){
								term.socket=new WebSocket("ws://"+window.location.host);
								term.socket.onopen = function(e) {
									console.log('onopen');
									sendeval(term.socket,`println('Setting up shell...');`);
									sendeval(term.socket,
`
try{
	require([
		"module",
		"www/kweutils/lib/vendor/kwe/srvcommand/index.js"
	],function(
		module,
		SrvCommand
	){
		try{//basic usage
			this.cmd=typeof(this.cmd)=='undefined'?(function(){
				return new SrvCommand({
					"path":<@ print(JSON.stringify(osutils.GOOS()=="linux"?"/bin/bash":"cmd.exe")); @>,
					"args":[],
					"timeout":500,
					"defaultcb":function(output,command){print(output);}
				});
			}).bind(this)():(function(){
				return this.cmd;
			}).bind(this)();
		}catch(e){
			println(e.toString());
		}
	}.bind(this));
	cmd.exec(<@ print(JSON.stringify(osutils.GOOS()=="linux"?"bash --version":"@echo off")); @>);
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
				panel.term.done=true;
				panel.term.socket.close();
			}
		});
	};
	module.exports=Terminal;
});
