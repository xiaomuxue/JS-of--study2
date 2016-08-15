// JavaScript Document
function prepareSlideShow(){
    if( !yc.isCompatible() ){return false;}
	if( !yc.$("linklist") ) return false;
	if( !yc.$("preview") ) return false;
	//为图片应用样式
	var preview=yc.$("preview");
	preview.style.position="absolute";
	preview.style.left="0px";
	preview.style.top="0px";
	//取得列表中所有的链接
	var list=yc.$("linklist");
	var links=list.getElementsByTagName("a");
	
	//为每一个link绑定事件
	//形成了闭包问题，全部循环完才会跳出，所以i值永远为  4
	/*for( var i=0;i<links.length;i++){
	   yc.addEvent( links[i],'mouseover',function(){
		      yc.moveElement("preview",(i+1)*100,0,10);
		});
	}*/
	
   //解决方案一：
   //写三个事件绑定。  缺点：写死了，事件多了就不好绑定了
 /*  links[0].onmouseover=function(){
      yc.moveElement("preview",-100,0,10);      //preview代表ID元素名，-100代表X轴的值   0代表Y的值，左右移时，Y值永远不变。
   }
   links[1].onmouseover=function(){
      yc.moveElement("preview",-200,0,10);
   }
   links[2].onmouseover=function(){
      yc.moveElement("preview",-300,0,10);
   }*/
   
   
   //解决方案二： 如果要用循环，如何处理
   //         a.给当前的节点增加一个属性，来存当前的索引值，然后事件激活后，使用这个属性值
   
  /*  for( var i=0;i<links.length;i++){
	   links[i].index=i+1;    //把索引值取出来
	   yc.addEvent( links[i],'mouseover',function(){
	          yc.moveElement("preview",this.index*(-100),0,10);
			  //alert( this.index*(-100) );     //测试是否取到每一个图片的位置
	   });
	}*/
   
   //解决方案三：
   //使用闭包来实现
   for( var i=0;i<links.length;i++){
       //自调用的匿名函数，自调用自己，保存了当前i的值到index
	   (function(index){
		     yc.addEvent( links[index],"mouseover",function(){
		          yc.moveElement("preview",(index+1)*(-100),0,10);
			 });
		})(i);
   }
   
   	
}

yc.addLoadEvent( prepareSlideShow );