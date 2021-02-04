define([
	"module",
	"jquery",
	"jspanel",
	"jquery.jsonForm",
	"jsv",
	"jsonform",
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
	function CreateFile(args){
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
			headerTitle:"Create File",
			callback:function(panel){
				var feedback=$("<div/>").addClass(["alert","alert-danger"]).hide();
				var form=$("<form/>");
				var btngroup=$("<div/>").addClass(["btn-group"]);
				var btncreate=$("<button/>").addClass(["btn","btn-sm"]).text("Create")
				var btncancel=$("<button/>").addClass(["btn","btn-sm"]).text("Cancel")
				btngroup.append([btncreate,btncancel]);
				$(panel.content).append([
					$("<div/>").addClass(["container"]).append([
						$("<div/>").addClass(["row"]).append([
							$("<div/>").addClass(["col-md-12"]).append([
								form,
								feedback,
								btngroup
							])
						])
					])
				]);
				var jsf=form.jsonForm({
					schema: {
						name: {
							type: 'string',
							title: 'Name',
							required: true
						}
					},
					form:[
						{
							"key":"name",
							"fieldHtmlClass": "form-control-sm"
						}
					],
					onSubmit: function (errors, values) {
						var r=args.component._controller._fileProvider._executeRequest(
							"CreateFile",{
								"pathInfo":fileManager.getCurrentDirectory().getFullPathInfo(),
								"name":values.name
							}
						);
						r.then(function(val){
							args.component.refresh();
							panel.close();
						}.bind(this),function(err){
							feedback.text(err.errorText);
							feedback.show();
							console.error(err);
						}.bind(this));
					}.bind(this)
				});
				btncreate.click(function(){jsf.submit();}.bind(this));
				btncancel.click(function(){panel.close();}.bind(this));
				$(form.find(".form-control")[0]).focus();
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
	module.exports=CreateFile;
});

