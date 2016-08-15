//需要实现的功能：
    //如果参数是一个字符串，则返回一个对象
   //如果参数是多个字符串，则返回一个数组
   
(function(){
	if(!window.yc){
	   window['yc']={};
	}
	
	function $(){
        var elements=new Array();
		for(var i=0;i<arguments.length;i++){
		    var element=arguments[i];
			if( typeof element=='string'){
			    element=document.getElementById(element);
			}
			if( arguments.length==1 ){
			     return element;
			}
			elements.push(element);
		}
		return elements;
	};
	window['yc']['$']=$;
	
   //判断当前浏览器是否兼容这个库： 浏览器能力检测。
     function isCompatible(other){
          if( other===false||!Array.prototype.push||!Object.hasOwnProperty||!document.createElement||!document.getElementsByTagName){
		        return false;
		  }
		  return true;
	 };
	 window['yc']['isCompatible']=isCompatible;
   
   //////////////////////事件操作////////////////////
   //增加事件：  node：节点   type:事件类型     listener
    function addEvent(node,type,listener){
	    if( !isCompatible()){return false;}
		if( !(node=$(node))){return false;}
		if( node.addEventListener ){
		   node.addEventListener(type,listener,false);
		   return true;
		}else if( node.attachEvent ){
		   node['e'+type+listener]=listener;
		   node[type+listener]=function(){
		       node['e'+type+listener](window.event);
		   }
		   node.attachEvent('on'+type,node[type+listener]);
		   return true;
		}
	};
	window['yc']['addEvent']=addEvent;
	
	
	
	//页面加载事件
	function onLoadEvent( func ){
       var oldOnLoad=window.onload;
	   if( typeof window.onload!='function' ){
		   window.onload=func;
	   }else{
	       window.onload=function(){
		       oldOnLoad();
			   func(); 
		   }
	   }
	};
	window['yc']['onLoadEvent']=onLoadEvent;
   
   
   //移除事件
  function removeEvent(node,type,listener){
      if( !(node=$(node))){return false;}
	  if( node.removeEventListener ){
          node.removeEventListener(type,listener,false);
		  return true;
	  }else if( node.detachEvent ){
	      node.detachEvent('on'+type,node[type+listener]);
		  node[type+listener]=null;
		  return true;
	  }
	  return false;
  };
  window['yc']['removeEvent']=removeEvent;
   
   
   function getElementsByClassName(className,tag,parent){
       parent=parent || document;
	   if( !(parent=$(parent))){return false;}
	   var alltags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
	   var matchingElements=new Array();
	   var regx=new RegExp("(^|\\s)"+className+"(\\s|$)");
	   var element;
	   for(var i=0;i<alltags.length;i++){
	       element=alltags[i];
		   if( regx.test( element.className)){
		       matchingElements.push( element );
		   }
	   }
	   return matchingElementsByClassName;
   };
   window['yc']['getElementsByClassName']=getElementsByClassName;
   
   //开关控制
   function toggleDisplay(node,value){
      if( !(node=$(node))){return false;}
	  if( node.style.display!='none'){
	      node.style.display='none';
	  }else{
	      node.style.display=value||'';
	  }
	  return true;
   };
   window['yc']['toggleDisplay']=toggleDisplay;
   
   /////////////////////DOM节点操作补充/////////////////////
   //创建节点
  function insertAfter( node,referenceNode ){
     if( !(node=$(node))){return false;}
	 if( !(referenceNode=$(referenceNode))){return false;}
	 var parent=referenceNode.parentNode;
	 if( parent.lastChild==referenceNode ){
         paret.appendChild(node);
	 }else{
         parent.insertBefore(node,referenceNode.nextSibling);
	 }
  };
  window['yc']['insertAfter']=insertAfter;
  
  
  //删除所有的节点
 function removeChildren(parent){
     if( !(parent=$(parent))){return false;}
	 while( parent.firstChild ){
	     parent.removeChild( parent.firstChild );
	 }
	 return parent;
 };
 window['yc']['removeChildren']=removeChildren;
 
 //在一个父节点的第一个子节点前面添加一个新节点 
  function prependChild( parent,newChild ){
      if( !(parent=$(parent))){return false;}
	  if( !(newChild=$(newChild))){return false;}
	  if( parent.firstChild ){
	      parent.insertBefore(newChild,parent.firstChild);
	  }else{
	      parent.appendChild(newChild);
	  }
	  return parent;
  };
  window['yc']['prependChild']=prependChild;
 
 
   //模板替换
    function supplant(str,o){
      return str.replace(/{([a-z]*)}/g,
	      function (a,b){
		     var r=o[b];
			 return r;
		  }
	  );
   };
   
   
   //过滤
    function parseJson(str,filter){
        var result=eval("("+str+")");
	    if(filer!=null&&typeof(filer)=='function'){
			for(var i in result){
				result[i]=filer(i,result[i])    
			}
		}
		return result;
	};
	window['yc']['parseJson']=parseJson;
	
	//驼峰命名法(将font-size转为fontSize)
	function camelize( s ){
	   return s.replace(/-(\w)/g,function(strMatch,p1){
	        return p1.toUpperCase();
	   });
	}
	window['yc']['camelize']=camelize;
   
   //驼峰命名法(将fontSize转为font-size)
   function uncamelize( s,sep ){
       sep=sep||'-';
	   return s.replace(/([a-z])([A-Z])/g,function(match,p1,p2){
	        return p1+sep+p2.toLowerCase();
		});
   }
   window['yc']['camlize']=camelize;
   
   
	
	//通过id修改单个元素的样式
	function setStyleById( element,styles ){
	    if( !(element=$(element))){return false;}
		for( property in styles ){
		   if( !styles.hasOwnProperty(property) ){
		        continue;
		   }
		   if( element.styles.setProperty ){
		       element.styles.setProperty( uncamelize(property,'-'),styles[property],null);
		   }else{
		       element.styles[camelize(preoperty)]=styles[property];
		   }
		}
		return true;
	}
	window['yc']['setStyle']=setStyleById;
	window['yc']['setStyleById']=setStyleById;
	
	//通过标签名来修改单个样式
	function setStylesByTagName( tagName,styles,parent ){
	    parent=parent||document;
		var elements=parent.getElementsByTagName(tagName);
		for( var i=0;i<elements.length;i++){
	        setStyleById( element[i],styles );
		}
		return elements;
	}
	window['yc']['setStyleById']=setStylesByTagName;
	
	//通过类名修改多个元素的样式
	
	function setStylesByClassName( parent,tag,className,styles ){
	     if( !(parent=$(parent))){return false;}
		 var elements=getElementsByClassName(tag,className,parent);
		 for( var i=0;i<elements.length;i++){
		     setStyleById( elements[i],styles);
		 }
		 return true;
	}
	window['yc']['setStylesByClassName']=setStylesByClassName;
	
	
	
	
	
   
})();