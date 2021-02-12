//todo:initialize/switch http/ws mod
define(
"vim",
[
	"module",
	"jquery",
	"idutils",
	"jspanel",
	"ace",
	"css!vendor/jspanel/jspanel.css",
	"css!vendor/animate/4.4.1/animate.min.css",
	"css!vendor/fontawesome/css/font-awesome.min.css",
],function(
	module,
	jquery,
	idutils,
	jspanel,
	ace,
){
	console.log("Setting up vim...");
	$=jq;
	module.exports=function vim(options){
		options=typeof(options)=="object"?options:{};
		options.filename=typeof(options.filename)=="string"?options.filename:"Unnamed";
		options.contents=typeof(options.contents)=="string"?options.contents:"Unnamed";
		options.path=typeof(options.path)=="string"?options.path:"Unnamed";
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
			headerTitle:"Vim - "+options.filename,
			callback:function(panel){
				$(panel.content).css({"height":"100%"});
				var id=idutils.uuidv4();
				var container=$("<div/>").attr({"id":id});
				$(panel.content).append(container);
				bool_vikeys=false;
				editor=ace.edit(id);
				//editor.setValue(val.result,-1);
				editor.setValue(options.contents,-1);
				//$(panel.content).text(options.contents);
				//editor.setTheme("ace/theme/tomorrow_night_eighties");//chaos");
				//editor.setHighlightActiveLine(true);
				//editor.setBehavioursEnabled(true);
				//editor.setShowPrintMargin(false);
				editor.on("commandExecuted",function(evt){
				});
				editor.setOptions({
					//maxLines: 1,
					autoScrollEditorIntoView: true,
					highlightActiveLine: false,
					printMargin: false,
					showGutter: false,
					enableLiveAutocompletion: true,
					enableBasicAutocompletion: true,
					enableSnippets: false,
					mode: "ace/mode/javascript",
					theme: "ace/theme/tomorrow_night_eighties"
				});
				editor.setKeyboardHandler("ace/keyboard/vim");//set prior to loading module...
				ace.config.loadModule(
					'ace/keyboard/vim',
					function(module){
						var VimApi = module.CodeMirror.Vim;
						VimApi.defineEx("write", "w", function(cm, input) {
							cm.ace.execCommand("save");
						});
					}
				);
				if(bool_vikeys){
					editor.setKeyboardHandler("ace/keyboard/vim");
					bool_vikeys=!bool_vikeys;

				}else{
					editor.setKeyboardHandler();
					bool_vikeys=!bool_vikeys;
				}
				//--------------------------------------------------------------------------------
				//toggle vi
				//--------------------------------------------------------------------------------
				editor.commands.addCommand(
					{
						name:"toggleVi",
						bindKey:{
							win:"Alt-J",
							mac:"Command-J",
							sender:"editor|cli"
						},
						exec:function(aceenv,aceargs,acerequest){
							if(bool_vikeys){
								editor.setKeyboardHandler("ace/keyboard/vim");
								bool_vikeys=!bool_vikeys;

							}else{
								editor.setKeyboardHandler();
								bool_vikeys=!bool_vikeys;
							}
						}.bind(this)
					}
				);
				//--------------------------------------------------------------------------------
				//save
				//--------------------------------------------------------------------------------
				editor.commands.addCommand(
					{
						name:"save",
						bindKey:{
							win:"Alt-W",
							mac:"Command-W",
							sender:"editor|cli"
						},
						exec:function(aceenv,aceargs,acerequest){
							if(options.path==null||options.path==""){
								alert('invalid path');
								return 1;
							}
							var t0=new Date();
							term.ws.send(`sjs this.fileManager.setcontents(${JSON.stringify(options.path)},${JSON.stringify(aceenv.getValue())})`).then(function(val){
								var t1=new Date();
								var td=t1-t0;
								term.echo(`${aceenv.getValue().length} bytes saved to ${options.path} in ${td} ms`);//JSON.stringify(val));
							});
							/*
							var r=args.component._controller._fileProvider._executeRequest(
								"SetFileContents",{
									"pathInfo":args.file.getFullPathInfo(),
									"value":aceenv.getValue(),
									"name":args.file.name
								}
							);
							r.then(function(val){
								aceenv.state.cm.openNotification(val.result,{bottom:true,duration:5000})
							}.bind(this),function(err){
								console.error(err);
								aceenv.state.cm.openNotification(val.errorText,{bottom:true,duration:5000});
							}.bind(this));
							*/
						}.bind(this)
					}
				);
				//editor.getSession().setMode("ace/mode/c");
				editor.focus();
				editor.renderer.on('afterRender', function() {
					var nlines=Math.floor($(panel.content).height()/editor.renderer.lineHeight);
					editor.setOptions({
						minLines:nlines,
						maxLines:nlines
					});
					$(editor.container).css({
						height:"100%",
						width:"100%"
					})
				}.bind(this));

				function hdliconclick(a,b,c){
				}
				var iconstyle={
					"padding-right":"4px"
				}

				var headertoolbar=[
					$("<span/>").css(iconstyle).click(hdliconclick).addClass(["fa","fa-folder-open"]).text('').click(function(){
						alert('stub');
						editor.focus();
					}.bind(this))[0],
					$("<span/>").css(iconstyle).click(hdliconclick).addClass(["fa","fa-save"]).text('').click(function(){
						editor.execCommand('save')
						editor.focus();
					}.bind(this))[0],
				];
				panel.addToolbar('header',headertoolbar,(panel)=>{
					// callback to add handlers for example
				});
				var footertoolbar=[
					$("<span/>").css(iconstyle).click(hdliconclick).css({"font-size":"8px"}).addClass().text("Editor Version 0.1")[0],
					$("<span/>").css(iconstyle).click(hdliconclick).css({"font-size":"8px"}).addClass(["fa","fa-question"])[0],
				];
				panel.addToolbar('footer',footertoolbar,(panel)=>{
					// callback to add handlers for example
				});

				panel.options.resizeit.resize.push(function(){//note how to add callbacks
					var nlines=Math.floor(0.8*$(panel.content).height()/editor.renderer.lineHeight);
					editor.setOptions({
						minLines:nlines,
						maxLines:nlines
					});
				}.bind(this));
				panel.options.resizeit.stop.push(function(){//note how to add callbacks
					var nlines=Math.floor(0.8*$(panel.content).height()/editor.renderer.lineHeight);
					//var nlines=Math.floor($(editor.container).height()/editor.renderer.lineHeight);
					editor.setOptions({
						minLines:nlines,
						maxLines:nlines
					});
				}.bind(this));

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
	}
	console.log("Done setting up vim...");
});



