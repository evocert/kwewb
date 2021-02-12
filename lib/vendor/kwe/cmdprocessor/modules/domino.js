define([
	"module",
	"console",
	"window",
	"document",
],function(
	module,
	console,
	_window,
	_document
){
	try{
		console.log('----------------------------------------');
		console.log([module.id,'start'].join(':'));
		//bootstrap globals
		window=_window;
		document=_document;
		this.window=window;
		this.document=window;
		require(["console","jquery"],function(console,jq){
			function proc(){
				this.stdio=null;
				this.main=function(argc,argv){
					var $=jq;
					$("body").empty();
					var table=$("<table/>")
					for(var i=0;i<4;i++){
						var tr=$("<tr/>");
						for(var j=0;j<4;j++){
							var td=$("<td/>").text(Math.random());
							tr.append(td);
						}
						table.append(tr);
					}
					$("body").append(table);
					//test events
					this.stdio.stdout=$("body").prop('outerHTML');
					this.stdio.stdin=this.stdio.stdout
					//{
						//feedback:{
							//type:"html",
							//value:$("body").prop('outerHTML')
						//}
						//this.stdio.stdin+Object.values(arguments).join(" ")
					//}
					//this.stdio.stdin=this.stdio.stdout
					return 1;
				}
			};
			module.exports=new proc();
		});
	}catch(e){console.error(e.toString());}

});
