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
			alert('demo');
			console.log([module.id,'start'].join(':'));
			console.log(WorkBench);
			{//basic usage
				$=jq;
				var container=$("<div/>").css({});
				$("body").append(container);
				var wb=new WorkBench({
					"root":"/",
					"svcpath":"./vendor/kwe/filemanager/index.svc.dx.js",
					"container":container
				});
				console.log(wb);
			}
		});
	}
);

