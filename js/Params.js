/**
**用以获取js传递的参数；
**@param seperator 参数分割符；
**@param chara script的src特征； 
**/
var script ={
	chara:null,
	seperator:null,
	param:{},
	src:'',
	dom:{},
	
	init:function(chara,seperator){
		this.chara = chara;
		this.seperator = seperator ? seperator : '&' ;
		this.getsrc();
		this.getparam();
		return this;
	},
	
	getsrc:function(){
		var script = document.getElementsByTagName('script');
		for(var v in script){
			if(this.chara.test(script[v].src)){
				this.src = script[v].src ;
				this.dom = script[v] ;
			}
		}
		return this.src ;
	},
	
	getparam:function(){
		if(this.src.indexOf('?')<=0) return ;
		var param = this.src.slice(this.src.indexOf('?')+1);
		var arrx = param.split(this.seperator);
		var arrm ;
		if(!arrx) return ;
		for(var v in arrx){
			arrm = arrx[v].split('=');
			if(arrm[0]){
				this.param[arrm[0]] = arrm[1] ? arrm[1] : '';
			}
		}
	}
}
