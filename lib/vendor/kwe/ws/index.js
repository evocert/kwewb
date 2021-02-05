
define([
	"module",
	"cyclejs",
	"uglify"
],function(
	module,
	cyclejs,
	uglify
){
	var Ws=function(args){
		args=typeof(args)=="object"?args:{};
		args.url=typeof(args.url)=="string"?args.url:["ws://",location.hostname,":",location.port].join("");
		args.onconnect=typeof(args.onconnect)=="function"?args.onconnect:function(){return""};
		args.onclose=typeof(args.onclose)=="function"?args.onclose:function(){};
		args.onmessage=typeof(args.onmessage)=="function"?args.onmessage:function(val){return val};
		args.ondisconnect=typeof(args.disconnect)=="function"?args.ondisconnect:function(){};
		//this.onconnect=args.onconnect;
		//this.onmessage=args.onmessage;
		//this.ondisconnect=args.ondisconnect;
		this.url=args.url;
		this.ws=null;
		this.que=[];
		this.connected=false;
		this.connecting=false;
		this.ponopen=null;
		this.ronopen=null;
		this.ponclose=null;
		this.ronclose=null;
		this.connect=function(url){
			url=typeof(url)=="string"?url:this.url;
			if(!this.connecting){
				this.connecting=true;
				this.ponopen=new Promise(function(resolve,reject){
					this.ronopen=resolve;
					if(url==null&&url=="")reject("Invalid url");
					if(!this.connected){
						this.ws=new WebSocket(url);
						this.setupws()
					}else{
						resolve();
					}
				}.bind(this));
			}
			return this.ponopen;
		};
		this.disconnect=function(){
			return new Promise(function(resolve,reject){
				if(!this.connected){
					reject("already disconnected")
				}else{
					this.connected=false;
					this.ronclose=resolve;
					this.ws.close();
				};
			}.bind(this));
		};
		this.setupws=function(){
			this.ws.onopen=this.onopen.bind(this);
			this.ws.onclose=this.onclose.bind(this);
			this.ws.onmessage=this.onmessage.bind(this);
			this.ws.onerror=this.onerror.bind(this);
		};
		this.onopen=function(event){
			this.connecting=false;
			this.connected=true;
			this.ronopen("connected");
			var code=cyclejs.decycle(args.onconnect());
			parsed=UglifyJS.minify(code);
			code=!parsed.error?parsed.code:code;
			var msg=["#!js","\x3C\x40",code,"\x40\x3E","#!commit\n"].join("\n");
			this.ws.send(msg);
		}.bind(this);
		this.onmessage=function(event){
			var val=null;
			try{
				val=JSON.parse(event.data);
			}catch(e){
				val=event.data;
			}
			var cb=this.que.shift();
			if(cb!=null)cb.resolve(val);//.shift();
		}.bind(this);
		this.onclose=function(event){
			this.connected=false;
			if(this.ronclose!=null)this.ronclose();
			this.ronopen=null;
			this.ronclose=null;
			args.onclose();
		}.bind(this);
		this.onerror=function(error){
		}.bind(this);
		this.send=function(msg){
			var queitm={};
			var p=new Promise(function(resolve,reject){
				queitm.resolve=resolve;
				queitm.reject=reject;
				queitm.message=msg;
			}.bind(this));
			this.que.push(queitm);
			if(this.que.length>0){
				var code=args.onmessage(cyclejs.decycle(msg));
				parsed=UglifyJS.minify(code);
				code=!parsed.error?parsed.code:code;
				var msg=["#!js","\x3C\x40",code,"\x40\x3E","#!commit\n"].join("\n");
				this.ws.send(msg);
			}
			return p;
		};
	};
	module.exports=Ws;
	/*
	module.exports={
		create:function(){
			return new Ws();
		},
		getInstance:function(){
			this.instance;
			return (function(){
				if(!this.instance){
					Logger.log("CREATING");
					this.instance=new Ws();
				}else{
					Logger.log("REUSING");
				}
				window.parent.instance=this.instance;
				return this.instance;
			})()
		}
	}
	*/
});
