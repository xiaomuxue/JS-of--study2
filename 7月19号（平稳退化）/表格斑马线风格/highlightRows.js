// JavaScript Document
//给每行加入事件，以实现切换效果

function highlightRows(){
   if( !yc.isCompatible()){return false;}
   var rows=document.getElementsByTagName("tr");
   for( var i=0;i<rows.length;i++){
       rows[i].onmouseover=function(){          //这样直接加样式不好。
	       this.style.fontWeight="bold";
		   this.style.color='#f00';
	   }
	   rows[i].onmouseout=function(){
	       this.style.fontWeight="normal";
		   this.style.color='#000';
	   }
   }
}
yc.addLoadEvent( highlightRows);