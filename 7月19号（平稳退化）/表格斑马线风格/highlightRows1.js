// JavaScript Document
function highlightRows(){
   if( !yc.isCompatible()){return false;}
   var rows=document.getElementsByTagName("tr");
   for( var i=0;i<rows.length;i++){
       rows[i].onmouseover=function(){
	      yc.removeClassName( this,'mouseout');
		  yc.addClassName( this,'mouseover');
	   };
	   rows[i].onmouseout=function(){
	      yc.removeClassName( this,'mouseover');
		  yc.addClassName( this,'mouseout');
	   };
   }
}
yc.addLoadEvent( highlightRows);