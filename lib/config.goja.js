define(["module"],function(module){
	var baseUrl=module.uri.substring(0,module.uri.lastIndexOf('/'));
	var modPath="";
	var GOJA=true;
	requirejs.config({
		//"useParseEval":true,
		"waitSeconds":0,
		"baseUrl":baseUrl,
		"paths":{
			"console":modPath+"vendor/kwe/console/index",
			"request":modPath+"vendor/kwe/request/index",
			"idutils":modPath+"vendor/kwe/idutils/index",
			"pathutils":modPath+"vendor/kwe/pathutils/index",
			"class":modPath+"vendor/kwe/class/class.goja",
			"kwe.cmdprocessor":modPath+"vendor/kwe/cmdprocessor/index",
			"kwe.terminal":modPath+"vendor/kwe/terminal/index.svc",
			"kwe.str2arg":modPath+"vendor/kwe/str2arg/index",
			"kwe.filemanager":modPath+"vendor/kwe/filemanager/index"
		},
		"packages":[],
		"config":{},
		"map":{
			"*":{},
		},
		"shim": {
		},
		"deps":[]
	});
});
