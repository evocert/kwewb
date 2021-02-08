//https://stackoverflow.com/questions/39050659/parsing-a-string-into-an-array-of-arguments-with-non-strict-trailing-argument
define(
	"kwe.stringutils.arggen",
	[
		"module",
	],
	function(
		module
	){
		function ArgGen(s,argCount){
			//var re = /\s*(?:("|')([^]*?)\1|(\S+))\s*/g,		//
			var re = /\s*(?:("|')((?:\\[^]|[^\\])*?)\1|(\S+))\s*/g,	//backslash escaping
				result = [],
				match = []; // should be non-null
			argCount = argCount || s.length; // default: large enough to get all items
			// get match and push the capture group that is not null to the result
			while (--argCount && (match = re.exec(s))) result.push(match[2] || match[3]);
			// if text remains, push it to the array as it is, except for 
			// wrapping quotes, which are removed from it
			if (match && re.lastIndex < s.length)
				//result.push(s.substr(re.lastIndex).replace(/^("|')([^]*)\1$/g, '$2'));
				result.push(s.substr(re.lastIndex).replace(/^("|')([^]*)\1$/g, '$2'));
			// process double quote escapes
			//for(var i=0;i<result.length;i++){
				//if(result[i]!=null)result[i]=result[i].replace(/\\"/g,'"');
			//}
			//c.replace(/\\/g,'"')
			return result;
		}
		module.exports=ArgGen;
	}
);
