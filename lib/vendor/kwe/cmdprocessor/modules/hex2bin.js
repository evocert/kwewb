define([
	"module",
	"console",
	"kwe.stringutils.pad",
],function(
	module,
	console,
	pad
){
	"use strict";
	function ConvertStringToHex(str,w) {
		w=typeof(w)=="number"?w:16;
		var arr=[];
		for(var i=0;i<str.length;i++){
			//arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
			arr[i] = (str.charCodeAt(i).toString(16)).slice(-4);
		}
		var ret="";
		for(var i=0;i<arr.length;i++){
			if(i%w==0){
				ret+="\n";
				ret+=pad("00000000",i.toString(16),true)+": ";
			}
			ret+=arr[i]+" ";
		}
		//return "\\u" + arr.join("\\u");
		return ret;//arr.join(" ");
	}
	function proc(){
		this.stdio=null;
		this.main=function(argc,argv){
			console.log(module.id);
			this.stdio.stdout=ConvertStringToHex(this.stdio.stdin,typeof(arguments[1])!="undefined"?parseInt(arguments[1]):8);
			return 1;
		}
	};
	module.exports=new proc();
});
