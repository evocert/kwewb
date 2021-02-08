var t0=new Date();
require([
	"./config.js?cachebust="+new Date().getTime()
	],
	function(){
		require([
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
				var t1=new Date();
				console.log("DURATION:"+(t1-t0));
				$=jq;
				var container=$("<div/>").css({});
				$("body").append(container);
				var wb=new WorkBench({
					"root":<@print(JSON.stringify(osutils.GOOS()=="linux"?"/":"C:/"));@>,
					"svcpath":"./vendor/kwe/filemanager/index.svc.dx.js",
					"container":container
				});
				console.log(wb);
			}
		});
	}
);

