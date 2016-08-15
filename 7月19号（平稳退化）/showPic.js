// JavaScript Document
function showPic( whichPic,source ){
   var placeholder=yc.$("placeholder");
   placeholder.setAttribute("src",source);
   
   var text=whichPic.getAttribute("title");
   var description=yc.$("description");
   
   description.firstChild.nodeValue=text;
}

//这个版本的案例，如果浏览器不支持JS或者用户禁用了浏览器，则<a href="#" onclick="showPic(this,'images/1.jpg');return false;" title="桃花">桃花</a>  不能实现效果

//因href中的值为#，页面不会显示图片，而我们的目标是全显示。