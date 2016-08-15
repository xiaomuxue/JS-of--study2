// JavaScript Document
UserData={
     storageObject:null,    //用来存所有的键值的对象。
	 init:function(){      //初始化的方法，因为存或取得时候一定要指定节点，要有形为
	     if( !this.storageObject){
		     this.storageObject=document.createElement("div");
			 this.storageObject.addBehavior("#default#userData");    //给节点指定行为   最新版本已经不支持此行为了
			 this.storageObject.style.display="none";
			 document.body.appendChild(this.storageObject);
		}
	 },
	 set:function( key,value ){
	     if( !(this.storageObject )){
		      this.init();
		}
		this.storageObjct.setAttribute(key,value);    //对象中有数据，
		this.storageObject.save("a");    //将对象中的数据序列化到磁盘上。   save（）中的参数就是文件名
		return value;
	},
	get:function( key ){
	    if( !this.storageObject ){
		     this.init();
		}
		this.storageObject.load("a");     //从磁盘上读取 a 这个文件，将a中的数据反序列化到节点div的userData中
		return this.storageObject.getAttribute( key );
	},
	del:function( key ){
	     if( !this.storageObject ){
		      this.init();
		}
		this.storageObject.removeAttribute( key );
		this.storageObject.save("a");     //删除完div中的userData中的数据后，在覆盖 a 文件中的数据。
	},
	isAvailable:function(){
	    return ('\v'=='v');     //判定是否为ie浏览器   在IE中'\v' 得到 'v'        在其它浏览器中，'\v'当成转义字符看，表示垂直制表位。
	}
}