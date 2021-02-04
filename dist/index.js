require([
	"lib/config.js?cachebust="+new Date().getTime()
],function(){
	//require(["app/main"],function(){});
	require([
		"module",
		"jquery",
		"kwe.workbench",
	],function(
		module,
		jq,
		WorkBench
	){
		alert('custom');
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
});
