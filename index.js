console.log('here0');
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
		console.log('here1');
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
