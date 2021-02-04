//https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileManager/Overview/jQuery/Dark/
//https://js.devexpress.com/Documentation/20_1/ApiReference/UI_Components/dxFileManager/Configuration/
define([
	"module",
	"jquery",
	"kwe.workbench",
],function(
	module,
	jq,
	WorkBench
){
	console.log([module.id,'start'].join(':'));
	console.log(WorkBench);
	{//basic usage
		$=jq;
		var container=$("<div/>").css({});
		$("body").append(container);
		var wb=new WorkBench({
			"root":"/",
			"container":container
		});
		console.log(wb);
	}
});

