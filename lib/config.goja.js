define(["module"],function(module){
	var baseUrl=module.uri.substring(0,module.uri.lastIndexOf('/'));
	var modPath="";
	var GOJA=true;
	requirejs.config({
		//"useParseEval":true,
		"waitSeconds":0,
		"baseUrl":baseUrl,
		"paths":{
			"sprintf":modPath+"vendor/sprintf/1.1.2/sprintf.min",
			"console":modPath+"vendor/kwe/console/index",
			"request":modPath+"vendor/kwe/request/index",
			"idutils":modPath+"vendor/kwe/idutils/index",
			"pathutils":modPath+"vendor/kwe/pathutils/index",
			"class":modPath+"vendor/kwe/class/class.goja",
			"kwe.cmdprocessor":modPath+"vendor/kwe/cmdprocessor/index",
			"kwe.terminal":modPath+"vendor/kwe/terminal/index.svc",
			"kwe.str2arg":modPath+"vendor/kwe/str2arg/index",
			"kwe.filemanager":modPath+"vendor/kwe/filemanager/index",
			"kwe.stringutils.pad":modPath+"vendor/kwe/stringutils/pad",
		},
		"packages":[],
		"config":{},
		"map":{
			"*":{},
		},
		"shim":{
			"sprintf":{
				"deps":[],
				"exports":"sprintf"
			}
		},
		"deps":[]
	});
});
