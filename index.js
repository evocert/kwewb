var t0=new Date();
require([
	"lib/config.js?cachebust="+new Date().getTime()
],function(){
	require([
		"module",
		"jquery",
		"kwe.workbench",
	],function(
		module,
		jq,
		WorkBench
	){
		var t1=new Date();
		console.log("DURATION:"+(t1-t0));
		console.log([module.id,'start'].join(':'));
		console.log(WorkBench);
		{//basic usage
			$=jq;
			var container=$("<div/>").css({});
			$("body").append(container);
			var wb=new WorkBench({
				"root":<@print(JSON.stringify(osutils.GOOS()=="linux"?"/":"C:/"));@>,
				"container":container
			});
			console.log(wb);
		}
	});
});
