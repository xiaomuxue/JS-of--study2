// JavaScript Document
Cookies={            //key:键     value:值    minsTopire:时间值  （可要可不要）
	      set:function( key, value, minsTopire ){
		     var expires="";
			 if( minsTopire ){
		         var date=new Date();    //客户端时间（浏览器时间）
				 date.setTime( date.getTime()+(minsTopire*60*1000) );
				 expires="; expires="+date.toGMTString();    //  expires=Sat,14 Mar 2009 17:45:33 CMT;
			 }
			 //      Cookie存的时候，键和值都要编码
			 //   key: "a b" =>  encodeURIComponent  =>  "a%20b"
			 //    /: 表示当前网站下所有的页面
			 document.cookie=encodeURIComponent(key)+"="+encodeURIComponent( value )+expires+";path=/";
			 return value;
		  },
		  get:function( key ){
		     var nameCompare=key+"=";       //name=
			 var cookieArr=document.cookie.split(';');   //name=a%20b;expires=xxx;path=/    name=axxx;
			 for(var i=0;i<cookieArr.length;i++){
			    var a=cookieArr[i].split("=");       //a=>   {"name","a%20"}
				var currentKey=decodeURIComponent( a[0] );
				if( key==currentKey || " "+key==currentKey ){
				    return decodeURIComponent( a[1] );     //取值， decodeURIComponent()解码。
				}
			}
			return null;
		  },
		  //判断浏览器是否禁用了cookie
		  isAvailable:function(){
		      return (this.set('cookieTest','1')==this.get('cookieTest'));
		  },
		  //如果要删除cookie,只需要将 expire设置为一个当前时间之前的过去时间即可。
		  del:function( key ){
		      this.set(key,"",-1);    //-1  负数代表过去的时间。
		  }
	  }