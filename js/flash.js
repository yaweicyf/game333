/**
**幻灯片插件；
**外部传入 imgarr 对象数组: [
								{url:'图片地址',title:'此处填写标题',link:'此处填写外链地址'},
								{url:'图片地址',title:'此处填写标题',link:'此处填写外链地址'},
								{url:'图片地址',title:'此处填写标题',link:'此处填写外链地址'},
								{url:'图片地址',title:'此处填写标题',link:'此处填写外链地址'}
							],							
**flash.js?width=255&height=250 传入幻灯片的高度宽度，同比缩放；
**不依赖jQuery 框架；
**兼容IE8 ，chrome ，firfox，
** create at : 2016-11-09;
** create by : yaweicyf							
**/

(function(){
	
	//imgarr 获取；
	if(!imgarr){
		throw new Error("Flash_js Error:imgarr is not find!(没有幻灯片js外部数据)");
	}
	
	//@param imgarr 传入swiper插件的图片数组；	
	var param = script.init(/flash\.js/,'&').param; //参数解析；
	var topdom = script.dom ; //当前的脚本节点；
	var swiper = {};
	swiper.width = param.width ? param.width : 300;
	swiper.height = param.height ? param.height : 250;
	
	
	//图片swiper窗口；
	var wind = document.createElement('div') ;
		wind.id = 'swiper';
		wind.style.width=swiper.width+'px';
		wind.style.height = swiper.height+'px';
		wind.style.background = '#ddd';
	
	//标题是口；
	var titlebox = document.createElement('div');
		titlebox.style.width = swiper.width + "px";
		titlebox.style.height = "40px" ;
		titlebox.style.marginTop = (swiper.height*(11/14)-40)+'px';
		titlebox.style.zIndex = '1000';
		titlebox.style.position = 'absolute';
		titlebox.style.background = '#222';
		titlebox.style.float = 'left';
		titlebox.style.opacity = '0.7';
		titlebox.style.textAlign = 'center';
		titlebox.style.lineHeight = '40px';
		titlebox.innerHTML = '<a style="color:#fff" href="'+imgarr[0].link+'" target="_blank" >'+imgarr[0].title+'</a>';
		
	//图片切换视口；
	var swiperbox = document.createElement('div');
		swiperbox.style.height = swiper.height*(11/14)+'px';
	
	//小图列表；
	var imgbox = document.createElement('div');
		imgbox.style.height = swiper.height*(3/14)+'px';
		imgbox.style.overflow = "hidden";

	//小图列表；
	var ulli = document.createElement('ul');
		ulli.id = 'smimglist';
		ulli.style.width=swiper.width + 'px';
		ulli.style.listStyleType = "none";
		ulli.style.margin = '0';
		ulli.style.padding = '0';
		ulli.style.width = 'auto';
		
	var smallwidth =  (swiper.width-40)/4 ;
	var smallheight = (swiper.height*(3/14)-10) ; 
		
		
	var imglist = '';
	
	var alink,img ;
	var imgobx = [] ;
	var titleobx = [] ;
	var interId ;
	
		//imgbox是图片对象的数组；
	for( var v in imgarr ){
		imglist +='<li style="width:'+ smallwidth +'px;height:'+ smallheight +'px;float:left;margin:5px;" ><img width='+smallwidth+' height='+smallheight+' src="'+imgarr[v].url+'" /></li>';
		alink = document.createElement('a');
		alink.href=imgarr[v].link ;
		alink.target = "_blank" ;
		img = document.createElement('img');
		img.style.width  = swiper.width + 'px';
		img.style.height = swiper.height*(11/14)+'px';
		img.src = imgarr[v].url ;
		img.alt = imgarr[v].title ;
		img.style.display="block";
		img.style.float = 'left';
		img.style.position = 'absolute';
		img.style.zIndex = 20 - parseInt(v);
		imgobx.push(img);
		titleobx.push(imgarr[v].title);
		alink.appendChild(img);
		swiperbox.appendChild(alink);
	}
	
	ulli.innerHTML = imglist;
	imgbox.appendChild(ulli);
	swiperbox.appendChild(titlebox);
	wind.appendChild(swiperbox);
	wind.appendChild(imgbox);
	topdom.parentNode.appendChild(wind);
	
	
	//轮询执行；
	var timerfun = function(){
		var id = setInterval(function(){
			init();
		},3000);
		return id ;
	};
	
	
	//获取一组img对象中，zindex最小的一个；
	var minobjzindex = function(obxarr){
		var minobj ;
		var minzindex = 2147483647;
		for(var v in obxarr){
			if( parseInt(obxarr[v].style.zIndex) < minzindex ){
				minzindex = parseInt(obxarr[v].style.zIndex);
				minobj = obxarr[v];
		    }
		}
		return minobj;
	};
	
	//获取一组中，zindex最大的一个；
	var maxobjzindex = function(obxarr){
		var maxobj ;
		var maxzindex = 0 ;
		for(var v in obxarr){
			if( parseInt(obxarr[v].style.zIndex) > maxzindex ){
				maxzindex = parseInt(obxarr[v].style.zIndex);
				maxobj = obxarr[v];
		    }
		}
		return maxobj;
	}
	
	//初始化动作；
	//@state : 是否需要时间绑定；
	//@minobc : 目标对象；
	var init = function(state,miniobx){
		var minobj;
		
		minobj = miniobx ? miniobx : minobjzindex(imgobx);
		maxobj = maxobjzindex(imgobx);
		minobj.style.zIndex = parseInt(minobj.style.zIndex)+ (parseInt(maxobj.style.zIndex)-parseInt(minobj.style.zIndex)+1) ;
		titlebox.innerHTML = '<a href="'+minobj.parentNode.href+'" target="_blank" style="color:#fff" >'+minobj.alt+'</a>' ;
		var imgliste = document.getElementById('smimglist').getElementsByTagName('img');
		for(var v in imgliste){
			if(imgliste[v].src == minobj.src){
				imgliste[v].style.border = '2px solid #fc7424';
			}else{
				try{
					imgliste[v].style.border = '1px solid #999';
				}catch(error){
					
				}
			}
		}
		
		if(state){ //是否为初次状态；
			var imgccss = document.getElementById('swiper').childNodes[0].getElementsByTagName('img');
			for(var i=0;i<imgliste.length;i++){
				imgliste[i].onmouseover =  function(){
					for(var v in imgccss){
						if(imgccss[v].src==this.src){
							init(0,imgccss[v]);
						}
					}
					clearInterval(interId);
				};
				imgliste[i].onmouseout = function(){
					swiper.run();
				}
			}
		}
		
	}
	
	//swiper初始化；
	swiper.init = function(){
		setTimeout(function(){ //等待swiper加载完毕之后进行初始化；基于回调函数来实现异步；
			init(1);
		},0);
	};
	
	//swiper运行；
	swiper.run = function(){
		interId = timerfun();
	}
	
	swiper.init();
	swiper.run ();
}());