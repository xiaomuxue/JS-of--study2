// JavaScript Document

//创建一个数据库操作对象，并指定数据库名和数据库的大小，单位 （M）
function SqlHelper( dbname,size ){
    this.dbname=dbname;
	this.size=size;
	this.init();
}

SqlHelper.prototype={
    init:function(){     //初始化一个数据库
	     if( !this.db ){
		     if(window.openDatabase ){      //判断该浏览器是否支持wesql的API
			      this.db=openDatabase(this.dbname,1.0,"database",this.size*1024*1024);
			 }else{
			      return false;
			 }
		 }
	},
	//sql: select * from xxx;
	//sql: select * from xxx where id=?,  [1]
	//  replace:是占位符的值班
	exesql:function( sql,replace ){     //执行增、删、改的sql语句
	     if(replace){
		      this.db.transaction(function(tx){tx.executeSql(sql,replace);});
		 }else{
		      this.db.transaction(function(tx){tx.executeSql(sql,[]);});
		 }
	},
	
	//创建一张表
	//tableName  表名
	//fields:表字段信息，是一段json格式的数据    如：{“id”:"int primary key autoincrement","uname":"text"}
	createTable:function(tableName,fields){
	     var sql='CREATE TABLE IF NOT EXISTS '+tableName+'(';
		 
		 //id int primary key autoincrement,
		 //uname text,
		 for(i in fields){
		     if(fields.hasOwnProperty(i)){
			     sql+=i+" "+fields[i]+",";
			 }
		 }
		 sql=sql.substr(0,sql.length-1);        //去掉最后一个字段的
		 
		 sql+=")";
		 
		 this.exesql(sql);
	},
	//查询
	//tableName：表名
	//selectFields:要查询的字段（ id，name  ）,查询所有用  *
	//whereStr   where语句，参数用 ？ 代替         例如： "id=? and name=?"
	//whereParams     用来代替上面参数中的  ？  一个数值
	//callback   对select返回数据的操作的回调函数
	select:function(tableName,selectFields,whereStr,whereParams,callback){
	     var sql= "SELECT"+selectFields+"FROM"+tableName;
		 if(typeof(whereStr) != "undefined" && typeof(whereParams) != "undefined" && whereStr!=""){
		      sql+="where" +whereStr;
		 }
		 this.db.transaction(function(tx){
		      //sql:select * from person where pid=? and pname=?
			  //  [1,"张三"]
			 tx.executeSql(sql,wheraParams,function(tx,results){
			        if(results.rows.length<1){
					    if(typeof(callback)=='function'){
						     callback(false);
						}//没有数据
					}else{
					    if(typeof(callback)=='function'){
						     callback(results.rows);
						}
					}
			  },function(tx,error){
			         return false;
			  }); 
		 });
	},
  
}