define([
	"module",
	"jquery",
	"jspanel",
	"css!vendor/jspanel/jspanel.css",
	"css!vendor/animate/4.4.1/animate.min.css",
	"css!vendor/bootswatch/4.5.2/slate/bootstrap.css",
	"css!vendor/fontawesome/css/font-awesome.min.css",
],function(
	module,
	jq,
	jspanel,
){
	$=jq;
	function Browser(args){
		args=typeof(args)=="object"?args:{};
		var panelHintConfig={
			panelSize:[500,400].join(" "),
			theme:"#222222 fillcolor #252525",
			headerControls:{
				size:"xs"
			},
			animateIn:"animate__animated animate__bounceIn",
			animateOut:"animate__animated animate__bounceOut"
		};
		this.panel=jsPanel.create({
			config:panelHintConfig,
			headerTitle:"Browser",
			callback:function(panel){
				$(panel.content).css({"height":"100%"});
				var iframe=$("<iframe/>").css({
					"height":"100%",
					"width":"100%",
					"border":"0px",
				});
				var addressbar=$("<input/>").addClass([
					"form-control",
					"form-control-sm"
				]).keyup(function(e){
					if(e.keyCode==13)
						iframe.attr({
							"src":addressbar.val()
						});
				});
				$(panel.content).append(addressbar);
				$(panel.content).append(iframe);
				var iframeheight=$(panel.content).height()-40;
				var iframewidth=$(panel.content).width();
				iframe.height(iframeheight);
				iframe.width(iframewidth);
				panel.options.resizeit.resize.push(function(){//note how to add callbacks
					var iframeheight=$(panel.content).height()-40;
					var iframewidth=$(panel.content).width();
					iframe.height(iframeheight);
					iframe.width(iframewidth);
				}.bind(this));
				panel.options.resizeit.stop.push(function(){//note how to add callbacks
					var iframeheight=$(panel.content).height()-40;
					var iframewidth=$(panel.content).width();
					iframe.height(iframeheight);
					iframe.width(iframewidth);
				}.bind(this));

			}.bind(this),
			panelSize:[320,160].join(" "),
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
			onclosed:function(){}
		});
	};
	module.exports=Browser;
});
