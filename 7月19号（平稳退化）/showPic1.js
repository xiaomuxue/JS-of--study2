// JavaScript Document

function showPic( whichPic ){
    //从whichPic中取出图片
	var pichref=whichPic.getAttribute("href");
	var placeholder=yc.$("placeholder");
	placeholder.setAttribute("src",pichref);
	var text=whichPic.getAttribute("title");
	var description=yc.$("description");
	
	description.firstChild.nodeValue=text;
}