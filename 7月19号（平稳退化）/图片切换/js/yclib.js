//库：放一些内置函数的扩展（String,Array,Object）
//	  放一些自定义的函数，这些函数为了不与别的库冲突，定义到一个命名空间（对象）中
(function(){
	if(!window.yc){ 
		//window.yc={};//在window下声明了一个yc的库	
		window['yc']={};	
	}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//============================================浏览器能力检测=============================================//
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//---------------------判断当前浏览器是否兼容这个库：浏览器能力检测--------------------------------------
	function isCompatible(other){//===严格等于：值和类型都要相等   isCompatible：是否兼容
		//other===false  值相同，值也要为false
		if(other===false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement ||
			!document.getElementsByTagName){
			return false;
		}
		return true;
	};
	window['yc']['isCompatible']=isCompatible;



///////////////////////////////////////////////////////////////////////////////////////////////////////////
//=========================================获取页面元素的操作============================================//
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*1
	window.yc.prototype={
		$:function(){

		}
	}
*/
//2 window.ys.$=$;
//<div id="a">   <div id="b">
//$("dddd"); var array=$("a","b") =>1个参数返回一个对象 array=>2  array=>0
//如果参数是一个字符串，则返回一个对象
//如果参数是多个字符串，则返回一个数组
//---------------------------------------------------$取值-------------------------------------------------
	function $(){	//既可以传字符串，数组也可以，也可以传节点
		var elements=new Array();
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			//如果这个元素是一个string，则表明这是一个id
			if(typeof element=='string'){
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return element;
			}
			elements.push(element);
		}
		return elements;
	}
	window['yc']['$']=$;//3



///////////////////////////////////////////////////////////////////////////////////////////////////////////
//===============================================替换操作================================================//
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------替换模版文字---------- -----------------------------------
//str:模版文字中包含{属性名}，o:是对象，格式{属性名：值}
//方法一
 function supplant(str,o){
 	return str.replace(/{([a-z]*)}/g),
	 	function (a,b){
	 		alert(a+"\t"+b);//a:{border}  b:{border}
	  		var r=o[b];
	 		//return typeof r==='string'?r:a;
	 		return r;
	 	};
 };

 //方法二
var supplant=function(template,data){
 	for(var i in data){
 		//i:first,  last,   border
 		template=template.replace("{"+i+"}",  data[i]);
 		//template.replace("{border}",  data["border"]);
 	}
 	return template
 };
window['yc']['supplant']=supplant;


//----------------------------------------------eval增强带过滤--------------------------------------------
	function parseJson(str,filter){//要过滤的字符串  ，用来过滤的代码块又是一个函数  "age":-20
		var obj=eval( "("+str+")" );
		var objfilter=function(obj){
			for(var i in obj){
				if(obj!=null && typeof obj[i]=="object"){
					objfilter(obj[i]);
				}else if(filter!=null && typeof filter=="function"){
					obj[i]=filter(i,obj[i]);
				}
			}
		}
		objfilter(obj);
		return obj;
	};
	window['yc']['parseJson']=parseJson;



///////////////////////////////////////////////////////////////////////////////////////////////////////////
//==============================================事件操作=================================================//
///////////////////////////////////////////////////////////////////////////////////////////////////////////		
//----------------------------------------------增加事件--------------------------------------------------
	//  node：节点（id）   type：事件类型(事件名)    listener：监听器函数
	function addEvent(node,type,listener){	//绑定事件
		if(!isCompatible()){return false;}
		if(!(node=$(node))){return false;}
		//w3c加事件的方法
		if(node.addEventListener){
			node.addEventListener(type,listener,false);//事件名，事件触发的回调函数，冒泡
			return true;
		}else if(node.attachEvent){
		//MSIE的事件
		//node节点会有重复，e此处是为了避免重复
		    node['e'+type+listener]=listener;//将listener赋值给 node['e'+type+listener]
		    node[type+listener]=function(){// node[type+listener]:只是一个函数名
				node['e'+type+listener]( window.event);//attachEvent(事件类型, 处理函数);
				//listener.( window.event)
			}
			node.attachEvent('on'+type,node[type+listener] );//attachEvent(事件类型, 处理函数);
			return true;
        }
	};
	window['yc']['addEvent']=addEvent;

	
//----------------------------------------------移除事件-------------------------------------------------
	function removeEvent(node,type,listener){
		if(  !(node=$(node) )  ){return false;}
		if(node.removeEventListener){//ff
			node.removeEventListener(type,listener,false);
			return true;
		}else if(node.detachEvent){//ie
			node.detachEvent('on'+type,node[type+listener] );
			node[type+listener]=null;
			return true;
		}
		return false;
	};
	window['yc']['removeEvent']=removeEvent;

	//小结：
	//1.添加事件时用的函数必须与删除时用的函数要是同一个函数
	/*var show=function(){
			alert("Hello");
		};
		yc.addEvent("show","click",show);//添加事件时用了一个函数
		yc.removeEvent("show","click",show);//删除事件时用了另一个函数	
		以上对
		yc.addEvent("show","click",function(){alert("Hello"); });
		yc.removeEvent("show","click",function(){alert("Hello"); });
		以上错，无法移除，因为匿名函数是两个函数

	*/


//---------------------------------------页面加载事件------------------------------------------------------
	function addLoadEvent(func){
		//将现有的window.onload事件处理函数的值存入变量oldOnLoad
		var oldOnload=window.onload;
		//如果在这个处理函数上还没有绑定任何函数，就像平时那样把函数添加给它
		if(typeof window.onload!='function'){
			window.onload=func;
		}else{
		//如果在这个处理函数上已经绑定了一些函数，则将新函数追加到先有指令的尾部
			window.onload=function(){
				oldOnload();//如果以案前这个页面有函数，则调用 以前的函数
				func();//再调用当前的函数
			}
		}
	}
	window['yc']['addLoadEvent']=addLoadEvent;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//===============================================统计操作=================================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------------根据类名统计节点------------------------------------------------
//className:要找的类名  tag：要查找的标签  parent:父节点   tag可写成*代表所有，父节点便可不写
	function getElementsByClassName( className,tag,parent){
		parent=parent||document;//判断父节点是否传入，如果没传入则是代表整个文档，再传值给parent
		if( !(parent=$(parent) )  ){return false;}
		//查找所有匹配的标签
		var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
		var matchingElements=new Array();
		//创建一个正则表达式，来判断className是否正确
		var regex=new RegExp( "(^|\\s)"+className+"(\\s|$)");//(^|\\s) 以className开头或者空格开头
		var element;
		//检查每个元素
		for(var i=0;i<allTags.length;i++){
			element=allTags[i];
			if(regex.test(element.className)){
				matchingElements.push(element);
			}
		}
		return matchingElements;
	};
window['yc']['getElementsByClassName']=getElementsByClassName;



////////////////////////////////////////////////////////////////////////////////////////////////////////////
//===============================================开关操作=================================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------显示与隐藏-------------------------------------------------
	function toggleDisplay(node,value){//node:id,value:显示或者隐藏
		if( !(node=$(node) )  ){return false;}
		if(node.style.display!='none'){
			node.style.display='none'
		}else{
			node.style.display=value||'';
		}
		return true;
	};
	window['yc']['toggleDisplay']=toggleDisplay;



////////////////////////////////////////////////////////////////////////////////////////////////////////////
//===========================================DOM中的节点操作补充==========================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//a.appendChild(b);在a的子节点的最后加入b
//a.insertBefore(b);在a的前面加入一个b
//----------------------------新增的第一个函数：给 referenceNode的后面加入一个node-------------------------
	function insertAfter(node,referenceNode){
		if(! (node=$(node) )  ){ return false;}
		if(!(referenceNode=$(referenceNode) )  ){ return false;}
		var parent=referenceNode.parentNode;
		if(parent.lastChild==referenceNode){//当前节点referenceNode是最后一个节点，则直接添加
			parent.appendChild(node);
		}else{//当前节点后面还有兄弟节点
			parent.insertBefore(node,referenceNode.nextSibling);
		}
	};
	window['yc']['insertAfter']=insertAfter;


//-------------------------------新增第二个人函数：一次删除所有的子节点------------------------------------
//标准（删除节点）：node.removeChild(childNode) =>一次只能删除一个子节点

	function removeChildren(parent){
		if(!(parent=$(parent) )  ){return false;}
		while( parent.firstChild){
			parent.removeChild(parent.firstChild);
		}
		//返回父元素，以实现方法连缀
		return parent;
	};
	window['yc']['removeChildren']=removeChildren;


//-------------新增第三个人函数：在一个父节点的第一个子节点的前面添加一个新节点---------------------------
	function prependChild(parent,newChild){
		if(!(parent=$(parent) )  ){return false;}
		if(!(newChild=$(newChild) )  ){return false;}
		if(parent.firstChild){//查看parent节点下是否有子节点
			//如果有一个子节点，就在这个子节点前面添加
			parent.insertBefore(newChild,parent.firstChild);
		}else{
			//如果没有子节点则直接添加
			parent.appendChild(newChild);
		}
		return parent;
	};
	window['yc']['prependChild']=prependChild;



////////////////////////////////////////////////////////////////////////////////////////////////////////////
//================================样式表操作第一弹：设置样式规则==========================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------------------将word-word 转为wordWord----------------------------------------
	function camelize(s){//"font-size".replace(  /-(\w)/g,)  =>  ["-s","s"]  正则表达式匹配完，返回的都是数组
		return s.replace(/-(\w)/g, function(strMatch,p1){
			return p1.toUpperCase();
		});
	}
	window['yc']['camelize']=camelize;


//-------------------------------------------将wordWord 转为word-word---------------------------------------
	function uncamelize(s,sep){
		sep=sep||'-';
		return s.replace(/([a-z])([A-Z])/g,function(match,p1,p2){
			return p1+sep+p2.toLowerCase();
		});
	}
	window['yc']['uncamelize']=uncamelize;


//---------------------------------------通过id修改单个元素的样式------------------------------------------
	function setStyleById( element,styles){
		//取得对象的引用
		if(!(element=$(element) )  ){return false;}
		//遍历styles对象的属性，并应用每个属性
		for(property in styles){
			if(!styles.hasOwnProperty(property) ){
				continue;//下一个
			}
			if( element.style.setProperty){
				//setProperty("background-color")
				//DOM2样式规范 setProperty(propertyName,value,priority);
				element.style.setProperty( uncamelize(property,'-'), styles[property], null);
			}else{
				//备用方法：elements.style["backgroundColor"]="red";
				elements.style[  camelize(property)]=styles[property];
			}
		}
		return true;
	}
	window['yc']['setStyle']=setStyleById;
	window['yc']['setStyleById']=setStyleById;


//--------------------------------------通过标签名修改多个样式------------------------------------------------
//通过标签名修改多个元素的样式
//tagname：标签名
//styles：样式对象
//parent:父元素的id
	function setStylesByTagName(tagname,styles,parent){
		parent=$(parent)|| document;
		var elements=parent.getElementsByTagName(tagname);
		for( var e=0;e<elements.length;e++){
			setStyleById(elements[e],styles);
		}

	}
	window['yc']['setStylesByTagName']=setStylesByTagName;

//------------------------------------通过类名修改多个元素的样式---------------------------------------------
//通过类名修改多个元素的样式
//tagname：标签名
//styles：样式对象
//parent:父元素的id
	function setStyleByClassName(parent,tag,className,styles){
		if(!(parent=$(parent) )  ) {return false;}
		var elements=getElementsByClassName(className,tag,parent);
		for( var e=0;e<elements.length;e++){
			setStyleById(elements[e],styles);
		}
		return true;
	}
	window['yc']['setStyleByClassName']=setStyleByClassName;



////////////////////////////////////////////////////////////////////////////////////////////////////////////
//=======================样式表操作第二弹：基于className切换样式==========================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////	
//----------------------------------------取得元素中类名的数组----------------------------------------------
//element:要查找类名的id
	function getClassNames(element){
		if(!(element=$(element) )  ) {return false;}
		//用一个空格替换多个空格，再基于空格分隔类名
		return element.className.replace(/\s+/,' ').split(' ');
	}
	window['yc']['getClassNames']=getClassNames;


//--------------------------------------检查元素中是否存在某个类-------------------------------------------
//element:要检查类名的id
//className:要检查的类名
	function hasClassName (element,className){
		if( !(element=$(element) )  ){return false;}
		var classes=getClassNames(element);//得到所有的类名
		for( var i=0;i<classes.length;i++){
			if(classes[i]===className){
				return true;
			}
		}
		return false;
	}
	window['yc']['hasClassName']=hasClassName;


//----------------------------------------------为元素添加类--------------------------------------------
//element:要添加类名的id
//className:要添加的类名
	function addClassName(element,className){
		if( !(element=$(element) )  ){return false;}
		//将类名添加到当前classsName的末尾，如果没有类名，则不包含空格
		var space=element.className?' ':'';
		//如果有类名a，再添b，则是 a空格b，如果没有类名，则直接添加b
		element.className+= space+className;
		return true;
	}
	window['yc']['addClassName']=addClassName;


//--------------------------------------------删除元素中的类--------------------------------------------
	function removeClassName(element,className){
		if( !(element=$(element) )  ){return false;}
		//先获取元素中的类
		var classes=getClassNames(element);
		//循环遍历数组删除匹配的项
		//因为从数组中删除项会使数组变短，所以要反相删除
		var length=classes.length;
		var a=0;
		for(var i=length-1;i>=0;i--){//从数组的最后一个开始取，每取一个逐步-1
			if(classes[i]===className){
				delete(classes[i]);//delete只将数组中下标为i的元素改为 undefined
				a++;
			}
		}
		element.className=classes.join(' ');
		//判断删除是否成功
		return (a>0?true:false);
	}
	window['yc']['removeClassName']=removeClassName;



////////////////////////////////////////////////////////////////////////////////////////////////////////////
//===================样式表操作第三弹：更大范围的改变,切换样式表==========================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------通过url取得包含所有样式表的数组------------------------------------------
	function getStyleSheets(url,media){
		var sheets=[];
		for( var i=0;i<document.styleSheets.length;i++){
			if(!document.styleSheets[i].href){
				continue;
			}
			if(url&&document.styleSheets[i].href.indexOf(url)==-1){
				continue;
			}
			if(media){
				//规范化media字符串
				media=media.replace(/,\s*/,',');
				var sheetMedia;
				if(document.styleSheets[i].media.mediaText){
					//DOM方法
					sheetMedia=document.styleSheets[i].media.mediaText.replace(/,\s*/,',');
					//Safari会添加额外的逗号和空格
					sheetMedia=sheetMedia.replace(/,\s*$/,'');
				}else{
					//IE
					sheetMedia=document.styleSheets[i].meidia.replace(/,\s*/,',');
				}
				//如果media不匹配，则跳过
				if(media!=sheetMedia){
					continue;
				}
			}
			sheets.push(document.styleSheets[i]);
		}
		return sheets;
	}
	window['yc']['getStyleSheets']=getStyleSheets;


//------------------------------------------添加样式表--------------------------------------------------
// addStyleSheet
	function addStyleSheet(url,media){
		media=media||'screen';
		var link=document.createElement("LINK");//节点名最好用大写
		link.setAttribute('rel','stylesheet');
		link.setAttribute('type','text/css');
		link.setAttribute('href',url);
		link.setAttribute('media',media);
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	window['yc']['addStyleSheet']=addStyleSheet;


//-------------------------------------------删除样式表-----------------------------------------------
	function removeStyleSheet(url,media){
		var styles=getStyleSheets(url,media);
		for(var i=0;i<styles.length;i++){
			//style[i]表示样式表  ->   .ownerNode表示这个样式表所属的节点<link>
			var node=styles[i].ownerNode||styles[i].owningElement;
			//禁用样式表
			styles[i].disabled=true;
			//移除节点
			node.parentNode.removeChild(node);
		}
	}
	window['yc']['removeStyleSheet']=removeStyleSheet;



////////////////////////////////////////////////////////////////////////////////////////////////////////////
//================================样式表操作第四弹：修改样式规则==========================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-------------------------------------------添加样式规则--------------------------------------------------
	function addCSSRule(selector,styles,index,url,media){
		var declaration='';
		for(property in styles){
			if(!styles.hasOwnProperty(property)){
				continue;
			}
			declaration+=property+":"+styles[property]+";";
		}
		var styleSheets=getStyleSheets(url,media);
		var newIndex;
		for(var i=0;i<styleSheets.length;i++){
			if(styleSheets[i].insertRule){
				newIndex=(index>=0?index:styleSheets[i].cssRules.length);
				styleSheets[i].insertRule(selector+'{'+declaration+'}',newIndex);
			}else if(styleSheets[i].addRule){
				newIndex=(index>=0?index:-1);
				styleSheets[i].addRule(selector,declaration,newIndex);
			}
		}
	}
	window['yc']['addCSSRule']=addCSSRule;


//----------------------------------------------编辑样式规则-----------------------------------------------
	function editCSSRule(selector,styles,url,media){
		var styleSheets=getStyleSheets(url,media);
		for(i=0;i<styleSheets.length;i++){
			var rules=styleSheets[i].cssRules||styleSheets[i].rules;
			if(!rules){continue;}
			selector=selector.toUpperCase();
			for(var j=0;j<rules.length;j++){
				if(rules[j].selectorText.toUpperCase()==selector){
					for(property in styles){
						if(!styles.hasOwnProperty(property) ){continue;}
						rules[j].style[camelize(property)]=styles[property];
					}
				}
			}
		}	
	}
	window['yc']['editCSSRule']=editCSSRule;

})();



////////////////////////////////////////////////////////////////////////////////////////////////////////////
//==================================================JSON==================================================//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//扩展全局的window.Object.prototype=xxx
//Object,array  ->js中原生对象
//需求：给object类的prototype添加一个功能  toJSONString，将属性的值以json格式输出
	//{"name":"zy",age:"30","sex":"男"}
	//for(var i in person) person[i]取出值
	//返回json字符串
//-----------------------------------------------对象转JSON格式--------------------------------------------
	Object.prototype.toJSONString=function(){   
		var jsonarr=[];
			for(var i in this ){ //object -> 所有的属性
				if(this.hasOwnProperty(i)){
					jsonarr.push( "\""+i+"\""+":\""+this[i]+"\"");//转义字符，用于计算机识别
				}
			}

		var r=jsonarr.join(",\n");
		r="{"+r+"}";
		return r;//返回json字符串
}

 //---------------------------------------------数组转JSON格式---------------------------------------------
	Array.prototype.toJSONString=function(){    
		var json=[];
		for(var i=0;i<this.length;i++)
			json[i]=(this[i]!=null)?this[i].toJSONString():"null";
			return "["+json.join(",")+"]"
}

//--------------------------------------------字符串转JSON格式---------------------------------------------
	String.prototype.toJSONString=function(){
	//此处这样写是因为
		return '"'+this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){
			var a=argumnets[0];
			return (a=='\n')?'\\n':(a=='\r')?'\\r':(a=='\t')?'\\t':""})+'"'
}	

Boolean.prototype.toJSONString=function(){return this}
Function.prototype.toJSONString=function(){return this}
Number.prototype.toJSONString=function(){return this}
RegExp.prototype.toJSONString=function(){return this}




