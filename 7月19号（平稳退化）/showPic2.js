// JavaScript Document

//本版本的优点：1.css、js、html完全分离
//           2、浏览器能力检测
//  将 img 和 p 从html中删除，由dom来动态创建和管理
function preparePlaceHolder(){
    //能力检测
	if( !yc.isCompatible()) return false;
	if( !yc.$('imagegallery')) return false;
	var placeholder=document.createElement("img");
	placeholder.setAttribute("src","images/placeholder.png");
	placeholder.setAttribute("id","description");
	placeholder.setAttribute("alt","图片浏览");
	
	var description=document.createElement("p");
	description.setAttribute("id","description");
	var desctext=document.createTextNode("请选择一张图片");
	description.appendChild( desctext );
	
	var gallery=document.getElementById("imagegallery");
	yc.insertAfter( placeholder,gallery );
	yc.insertAfter( description,placeholder );
	
}




function showPic( whichPic ){
    //如果不存在placeholder,则无法显示图片，程序无法运行。
	if( !yc.$('placeholder')){return false;}
	var source=whichPic.getAttribute( "href" );    //图片的地址
	var placeholder=yc.$("placeholder");
	
	if( placeholder.nodeName !="IMG"){return false;}
	
	placeholder.setAttribute("src",source);      //在placeholder中显示图片
	
	//如果description不存在，则不显示
	if( yc.$("description")){
	    var text=whichPic.getAttribute("title")?whichPic.getAttribute("title"):"";
		var description=yc.$("description");
		if( description.firstChild.nodeType==3){       //文本节点的值为：3
		    description.firstChild.nodeValue=text;
		}
	}
	return true;
}





//这个函数用于做浏览器测试和检测，这样JS代码不再依赖于那些没有保证的假设。可以保证JS代码能平稳退化。
function preparePic(){
   if(!yc.isCompatible()) return false;
   //页面上指定了容器ul的id，这样就可以通过js一次性地给所有的a 元素加入事件。
   if(!yc.$("imagegallery")) return false;
   var gallery=yc.$("imagegallery");
   var links=gallery.getElementsByTagName("a");
   for( var i=0;i<links.length;i++){
       links[i].onclick=function(){
	       //this   ->   link[i]
		   return showPic2(this)?false:true;    //只有 这个onclick绑定的函数返回值是 false,才不会运行<a href="">
	   }
   }
}
yc.addLoadEvent( preparePlaceHolder );
yc.addLoadEvent( preparePic );