// JavaScript Document
//库：    放一些内置函数的扩展  （String,  Array,  Object ）
//       放一些自定义的函数，这些函数为了不与别的库冲突，定义到一个命名空间（对象）中

(function(){
   //给window添加了一个属性  [命名空间]
   if( !window.yc){
      //window.yc={};
	  window['yc']={};
   }
  // 第一种写法：   这种写法是指在windows下面加了一个yc属性，并且定义了一个yc原型，在yc的原型下定义了一个$函数。
  /* window.yc.prototype={
      
	  $:function(){}
	  
   }*/
   
  
  //第二种写法：   这种写法是直接在yc下面定义了一个$函数。
  //window.yc.$=$;
  
  
  //第三种写法：  这种写法是直接在yc下面定义了一个$函数。
  
  //////////////////获取页面元素 //////////
  
  //需要实现的功能：   <div id="a">    <div id="b"> 
                //  $("a")   var array=$("a","b");     =>   1个参数则返回一个对象     array  => 1   array  =>  2
				//如果参数是一个字符串，则返回一个对象
				//如果参数是多个字符串，则返回一个数组
				
  function $( ){
     var elements=new Array();      //创建一个新的数组
	 //查找作为元素提供的所有元素
	 for(var i=0;i<arguments.length;i++){
		var element=arguments[i];
		//如果这个元素是一个string,则表明这是一个id
		if(typeof element=='string'){      //判断数组的类型
		   element=document.getElementById(element);         //在document下创建一个id（element）
		} 
		if(  arguments.length==1 ){       //判断数组长度是否为1，为1说明数组只有一个（id）元素
		    return element;	            //则返回这个id        
		}
		elements.push( element );        //把id名加到新的数组里面去
      }
	  return elements;            //返回新的数组
  }
   window['yc']['$']=$;
 
  //判断当前浏览器是否兼容这个库： 浏览器能力检测。
  function isCompatible( other ){
     if( other===false || !Array.prototype.push || !Object.hasOwnProperty  || !document.createElement  || !document.getElementsByTagName ){     //判断这些事件是否存在
	       return false;
	  }
	  return true;
  };
  window['yc']['isCompatible']=isCompatible;     //在window里面添加属性
  
 
 
 /////////////////////////////////事件操作 //////////  ///////////////////// 
  //增加事件：  node：节点    type：事件类型 （'click'）    listener:监听器函数
  function addEvent(node,type,listener){
     if( !isCompatible() ){return false;}     //判断是否兼容
	 if( !(node=$(node) )){return false;}     //判断是否能取到node,若是没有，则返回false
	 //W3C加事件的方法
	 if( node.addEventListener  ){        //在火狐、谷歌等浏览器里面的监听事件
         node.addEventListener(type,listener,false);     //普通的添加监听事件  节点.addEventListener()
		 return true;
	 }else if( node.attachEvent ){      //attachEvent是IE浏览器里面支持的属性
         //MSIE的事件
		 node['e'+type+listener]=listener;      //node['e'+type+listener]为属性命一个名，防止属性名相同，所以取的较长（复杂）。
		 node[type+listener]=function(){
		    node['e'+type+listener]( window.event );     //加window.event事件是为了找到浏览器的窗口大小和鼠标所在位置，必须有。
			//listener(window.event);
		}
		node.attachEvent('on'+type,node[type+listener]);     //在IE浏览器里面，点击事件必须前面加"on"，后面是类型type，若是点击事件，它的type='click';
		return true;
	 }
  };
  window['yc']['addEvent']=addEvent;
  
  
  //移除事件
  function removeEvent(node,type,listener){
      if( !(node=$(node)) ){return false;}
	  if( node.removeEventListener){    //ff,谷歌浏览器的删除属性
	      node.removeEventListener( type,listener,false);     //false应跟调用它的函数那里保持一致，那边是false,则用false，那边用true,则使用true
		  return true;
	  }else if( node.detachEvent ){    //detachEvent是IE的删除函数
	      node.detachEvent('on'+type,node[type+listener]);
		  node[type+listener]=null;      //必须用空替换掉，不然可能出错，这是IE浏览器规定的
		  return true;
	  }
	  return false;
  };
  window['yc']['removeEvent']=removeEvent;
 /////////////注意点：  添加事件时用的函数必须与删除时用的函数要是同一个函数     
 /*    var show=function(){
	      alert("hello");
	   }
       yc.addEvent("show","click",show);        //添加事件时用了一个函数
	   yc.removeEvent("show","click",show);     //删除时用了另一个函数
	   //以上对
	   yc.addEvent("show","click",function(){alert("hello");});
	   yc.removeEvent("show","click",function(){alert("hello");});
	   //以上错误，无法移除，因为匿名函数是两个函数。
*/
 
 
 
 
 //className: 要找的类名    tag:要查找的标签     parent:如果有的话，表示tag所属的容器
 function getElementsByClassName( className,tag,parent ){
    parent=parent||document;       //查看是否能找到parent,若是没有parent,那么就是document.xxx
	if( !(parent=$(parent)) ){      //查找是否存在parent,不存在则返回false，否则返回true
	    return false;
	}
	//查看所有匹配的标签
	var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
	var matchingElements=new Array();
	//创建一个正则表达式，来判断className是否正确     ^a   |   a
	//这个正则表达式代表的意思是：以类名开始或结束，或者以空格开始或结束来跟类名进行匹配
	var regx=new RegExp( "(^|\\s)"+className+"(\\s|$)" );    //两边都使用了分组，与className进行匹配
	var element;
	//检查每一个元素
	for(var i=0;i<allTags.length;i++ ){      //循环出所有的节点
       element=allTags[i];
	   if( regx.test(element.className) ){
	      matchingElements.push( element );
	   }
	}
	return matchingElements;
 };
 window['yc']['getElementsByClassName']=getElementsByClassName;
 
 
 //开关操作       toggle：开关，触发器，栓扣
 function toggleDisplay(node,value){          //传节点和开始设置的display值进来
     if( !(node=$(node))){ return false;}       //判断是否存在此节点
	 if( node.style.display!='none'){         //如果开始是显示的
	    node.style.display='none';            //那么就把它隐藏
	 }else{                                
        node.style.display=value||'';        //否则就取它本身值或者取空。
	 }
	 return true;
 };
 window['yc']['toggleDisplay']=toggleDisplay;
 
 
 //////////////DOM中的节点操作补充///////////////
////   a.appendChild(b)   在a的子节点的最后加入 b
////   a.insertBefore(b);    在a的前面加入一个b  （当前结点加一个节点）
    
	//新增的第一个函数：  给  referenceNode的后面加入一个node
	function insertAfter(node,referenceNode){
        if( !(node=$(node)) ){ return false;}               
		if( !(referenceNode=$(referenceNode))){ return false;}
		var parent=referenceNode.parentNode;
		if( parent.lastChild==referenceNode ){
		    parent.appendChild( node );
		}else{
		   parent.insertBefore( node, referenceNode.nextSibling );
		}
	};
	window['yc']['insertAfter']=insertAfter;
	
  //标准（删除节点）:node.removeChild(childNode) => 一次只能删除一个子节点
  
  
  
  //新增的第二个函数：一次删除所有的子节点
  function removeChildren(parent){
     if( !(parent=$(parent))){return false;}
	 while( parent.firstChild){
	    parent.removeChild( parent.firstChild );
	 }
	 //返回父元素，以实现方法连缀。
	 return parent;
  };
 window['yc']['removeChildren']=removeChildren;
 
//在一个父节点的第一个子节点前面添加一个新节点 
 function prependChild( parent,newChild ){
     if(!(parent=$(parent))){ return false;}
	 if(!(newChild=$(newChild))){return false;}
	 if( parent.firstChild){     //查看parent节点下是否有子节点
	    //如果有一个子节点，就在这个子节点前添加
		parent.insertBefore( newChild,parent.firstChild);
	 }else{
	    //如果没有子节点则直接添加
		parent.appendChild(newChild);
	 }
	 return parent;
 };
 window['yc']['prependChild']=prependChild;
 
 
 
 //替换模板文字   str:模板文字中包包含   {属性名}，
//       o：是对象，格式{属性名：值}
//以o对象中对应的属性名的值来替换str模板。

  /* function supplant(str,o){
	       //   /g  整个字符串全部匹配
		   //   //  正则表达式的标志
		   //   {()}: ()分组，将匹配的值存起来。
      return str.replace(/{([a-z]*)}/g,
	      function (a,b){
			 //alert(a+"\t"+b);    //a:{border}  b:{border}
		     var r=o[b];     //o["border"]=> 2
			               //o["{border}"]
			//return typeof r==='string'?: r :a;
			 return r;
		  }
	  );
   };*/
 //另一种方法：
   var supplant=function(template,data){
      for(var i in data){     //循环data里面的属性，底下进行匹配。
		  //i: first, last, border
	     template=template.replace( "{"+i+"}", data[i] );
		 //template.replace("{border}",data["border"]);
	  }
	  return template;
   };
window['yc']['supplant']=supplant;

  
  //过滤：
   function parseJson( str,filter ){
       var result=eval( "("+str+")" );
	   if( filter!=null && typeof(filter)=='function' ){
	      for(var i in result){
		     result[i]=filter( i, result[i] );
		  }
	   }      //如果去掉这一截判断语句，它的功能就是直接把对象里面的值转成数组输出
	   return result;
   }
   window['yc']['parseJson']=parseJson;
   
   
   ////////////////////////////////////////////////////////////////////////
   /////////////////////    样式表操作第一弹：设置样式规则   ->增强了行内样式，缺点：css加  //////////////////////
   //////////////////////////////////////////////////////////////////////////////
   //camelize:驼峰命名法
   //将word-word 转换为 wordWord       font-size:转换为  fontSize
   
   function camelize( s ){    //s代表测试那边传入的值，可能是font-size  正则返回的值会是一个数组
       return s.replace(/-(\w)/g,function(strMatch, p1){      //-s  p1-> s
		   //如果不知道strMatch代表什么，可以在这里alert下，例：
		     //alert( strMatch );
	         return p1.toUpperCase();      //toUpperCase:代表小写转换为大写
	   });
   }
   window['yc']['camelize']=camelize;
   
   //将wordWord转换为word-word
   function uncamelize(s,sep){
       sep=sep||'-';     //sep:表示链接符-     下面的正则表达式表示：匹配小写和大写在一起的地方，分成了两个组
	   return s.replace(/([a-z])([A-Z])/g,function(match,p1,p2){
	             return p1+sep+p2.toLowerCase();      //toLowerCase:表示大写转换为小写
				 //以上表示小写-大写
	   });
   }
   window['yc']['uncamelize']=uncamelize;
   
   
   
   //通过id修改单个元素的样式  {"backgroundColor":"red"}
   //以下这种添加样式的方式是行内样式
   function setStyleById( element,styles ){    //element是指元素名，  styles指样式
       //取得对象的引用
	   if( !(element=$(element))){return false;}
	   //遍历styles对象的属性，并应用每一个属性。
	   for( property in styles){
	       if( !styles.hasOwnProperty ){
		       continue;
		   }
		   if( element.style.setProperty ){
		       //    setProperty( "background-clor" );
			   //DOM2样式规范   setProperty(propertyName,value,priority);
			   //     uncamelize(property,'-')表示与传进去的值进行匹配，有-的就运行if里面的代码
			   //    setProperty();表示W3c
			   element.style.setProperty( uncamelize(property,'-'),styles[property],null);   //第一个值代表属性名 例：background-color，第二个值代表属性值 例： red， 第三个值null代表索引值
		   }else{
		        //备用方法  element.style["backgroundColor"]="red";
				//IE浏览器
				element.style
		   }
	   }
	   return true;
   }
   window['yc']['setStyleById']=setStyleById;
   
   
   //通过标签名修改斗个样式：调用举例：yc.setStylesByTagName('a',{'color':'red'});
   //tagname:标签名    styles：样式对象      parent：父标签的ID号
   function setStylesByTagName( tagname,styles,parent){
       parent=$(parent)||document;
	   var elements=parent.getElementsByTagName( tagname );   //查找出所有的标签名
	   for( var e=0;e<elements.length;e++){
	        setStyleById( elements[e],styles);
	   }
   }
   window['yc']['setStylesByTagName']=setStylesByTagName;
   
   
   //通过类名修改多个元素的样式      
   //parent：父元素的id       tag:标签名      className:标签上的类名       style:样式对象
   function setStylesByClassName( parent,tag,className, styles){
       if( !(parent=$(parent))){return false;}
	   var elements=getElementsByClassName( className,tag,parent);
	   for( var e=0;e<elements.length;e++){
	       setStyleById( elements[e],styles);
	   }
	   return true;
   }
   window['yc']['setStylesByClassName']=setStylesByClassName;
   
   
   //////////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////样式表操作第二弹：基于className切换样式 /////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////
   //取得元素中类名的元素    
   //element：要查找的类名的元素
   function getClassNames( element ){
       if( !(element=$(element))){return false;}
	   //用一个空格替换多个空格，在基于空格分割类名
	   return element.className.replace(/\s+/,' ').split(' ');
   }
   window['yc']['getClassNames']=getClassNames;
   
   //检查元素中是否存在某个类
   //   element：要查找类名的元素       className：要查找的类名
   
   function hasClassName( element,className ){
        if( !(element=$(element))){
	        return false;
		}
		var classes=getClassNames(element);      //得到所有的类名
		for( var i=0;i<classes.length;i++){
	        if(classes[i]===className){
			    return true;
			}
		}
		return false;
   }
   window['yc']['hasClassName']=hasClassName;
   
   
   //为元素添加类
   //element:要添加类名的元素
   //className：要添加的类名
   function addClassName( element,className){
        if( !(element=$(element))){return false;}
		//将类名添加到当前className的末尾，如果没有类名，则不包含空格
		var space=element.className?' ':'';
		//a b        b
		element.className+=space+className;
		return true;
   }
   window['yc']['addClassName']=addClassName;
   
   
   //从元素中删除类
   function removeClassName( element,className){
       if(!(element=$(element))){return false;}
	   //先获取所有的类
	   var classes=getClassNames(element);
	   //循环遍历数组删除匹配的项
	   //因为从数组中删除项会使数组变短，所以要反向删除
	   var length=classes.length;
	   var a=0;
	   for( var i=length-1;i>=0;i--){
	       if(classes[i]===className){
		       delete(classes[i]);
		   } 
	  }
	  element.className=classes.join(' ');
	  //判断删除是否成功。。。
	  return (length==a?false:true);
   }
   window['yc']['removeClassName']=removeClassName;
   
   
   ////////////////////////////////////////////////////////////////////////////////////////////////
   ///////////////////////////////第三
   ////////////////////////////////////////////////////////////////////////////////////////////////
   
   
   function getStyleSheets(){}
   
   
   
   
   //添加新样式表
   
   function addStyleSheet( url,media ){
       media=media|| 'screen';        //短路的操作，后面是个字符串一定为true,前面的media可能没有传值，为false
	   var link=document.createElement('LINK');      //创建节点后面最好用大写，来区分开来
	   link.setAttribute('href','url');            //创建节点的属性还有一种写法：  link.href='url';
	   link.setAttribute('rel','stylesheet');
	   link.setAttribute('media','media');
	   link.setAttribute('type','text/css');
	   document.getElementsByTagName('head')[0].appendChild( link );
   }
   window['yc']['addStyleSheet']=addStyleSheet;
   
   //移出样式表
   function removeStyleSheet( url,media ){
       var styles=getStyleSheets( url,media );
	   for( var i=0;i<styles.length;i++){
	       //    styles[i]：表示样式表  ->   .ownerNode:表示这个样式表所属的节点<link>
		   var node=styles[i].ownerNode || styles[i].owningElement;
		   //禁用样式表
		   styles[i].disabled=true;
		   //移除节点
		   node.parentNode.removeChild( node );
	   }
   }
  window['yc']['removeStyleSheet']=removeStyleSheet; 
   
  //////////////////////////////////////////////////////////////////////////////////////////////////
   
   
   
   
   
})();


   
/*//递归遍历了新生成的结构，而且将每个名/值对传递给一个过滤函数，以进行可能的替换
    if( typeof filter==='function' ){
       j=walk('',j);
	}
	return j;
 }*/


//扩展全局的  object.prototype=xxx
//  object、array   ->   js中的原生对象
Object.prototype.toJSONString=function(){
  //需求： 给Object类的prototype添加一个功能  toJSONString(), 将属性的值以json格式输出
  //{"name":"zy","age":"20","sex":"男"}
  //for(var i in person ) person[i]取出值
  var jsonarr=[];
  for(var i in this){
	  if( this.hasOwnProperty( i ) ){
	       jsonarr.push(  "\""+i+"\""+":\""+this[i]+"\"" );  //  \"表示转义"" 
	   }
   }
   
   var r=jsonarr.join( " ,\n" );
   r="{"+r+"}";
   return r;      //返回json字符串
 }
  

//  [1,2,3]     
//  ["a","zs"]
//  [{"name":"zs","age":30},{"name":"zz","age":32}]
Array.prototype.toJSONString=function(){
    var json=[];
	for(var i=0;i<this.length;i++){
       json[i]=(this[i]!=null)? this[i].toJSONString() : "null";
	}
   return "["+json.join(",")+"]"     
}

String.prototype.toJSONString=function(){
    return '"'+ this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){
    var a=arguments[0];
	return (a=='\n')?'\\n':(a=='\r')?'\\r':(a=='\t')?'\\t':""})+'"';
}

Boolean.prototype.toJSONString=function(){
	if(!true){
	   return false;
	}
    return this;
}
Function.prototype.toJSONString=function(){return this}
Number.prototype.toJSONString=function(){
	var a;
	if( !typeof(a)=='number'){
	   
	}
	return this;
}
RegExp.prototype.toJSONString=function(){
	
	return this;
}



