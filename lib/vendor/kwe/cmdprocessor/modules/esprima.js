define([
	"module",
	"esprima"
],function(
	module,
	esprima
){
	module.exports=function(modnam){
		var source=typeof(this[modnam])!="undefined"?
			this[modnam].toString():
				typeof(this.modules[modnam])!="undefined"?this.modules[modnam].toString():
				null
		;
		if(source==null)return 'module not found'
		return esprima.parse(source.replace(/\n/,""));
		/*
		return esprima.parse(Object.values(arguments).join(" "));
		*/
	}
});
