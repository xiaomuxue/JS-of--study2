// JavaScript Document
function ShowQuestions(questions){
     this.que=questions;
}
	var timer;
	ShowQuestions.prototype={
		showque:function(){
			var ques=document.getElementById("questions");
				//插入剩余时间的div
			var timebox=document.createElement("div");
			timebox.innerHTML="剩余时间(单位 s)：";
			var time=document.createElement("span");
			timebox.appendChild(time);
			var setTime=new Date().getTime()+20000;
			timer=setInterval(function(){
			var innertime=parseInt( ( setTime-new Date().getTime() )/1000 );
				if(innertime==0){
					clearInterval(timer);
					submit(timer);
				}
						time.innerHTML=innertime;
				}, 50)
				document.body.insertBefore(timebox,ques);

				//插入所有的题目
				for(var i=0;i<this.getTotal();i++){
					var num=document.createElement("span");
					num.id="q"+i;
					num.innerHTML=this.que[i][0]+"、";
					ques.appendChild(num);
					var question=document.createElement("span");
					question.innerHTML=this.que[i][1];
					ques.appendChild(question);
					var options=document.createElement("p");
					for(var j=0;j<4;j++){
						var inp=document.createElement("input");
						inp.type="radio";
						inp.name="ans"+i;
						inp.value=j+1;
						
						//给每个选项绑定一个值改变事件
						(function(i,j){
						      yc.addEvent(inp,"change",function(){
							       //i 题号，对应数组的下标
								   //j  对应了选项。
								   ansarr[i]=j+1;      //记录当前用户选定的选项值   [4,0,0,0,0]
								   console.log(ansarr);
								   sqlhelper.exesql("delete from answer");
								   //ansarr.join()    ->    1,2,1,3,4,0,0,0,1
								   sqlhelper.exesql("insert into answer(num,answer) values(1,'"+ansarr.join()+"')");
								   
							  });
						})(i,j);
						
						var ans=document.createElement("span");
						ans.innerHTML="&#"+(65+j)+":、"+this.que[i][2+j];

						options.appendChild(inp);
						options.appendChild(ans);
					}
					ques.appendChild(options);
					ques.appendChild(document.createElement("hr") );
				}

				var btn=document.createElement("input");
				btn.type="button";
				btn.value="提交试卷";
				btn.onclick=submit;
				ques.appendChild(btn);
				
				var getlastans=document.createElement("button");
				getlastans.innerHTML="恢复上次答案";
				//  select * from answer where num=1
				getlastans.onclick=function(){
				     sqlhelper.select("answer","answer","null=?",[1],showlastans);
				}
				//将按钮放到页面的最前面
				yc.prependChild(document.body.getlastans);

			},
			getTotal:function(){
				return this.que.length;
			},
		}


       function showlastans(rows){
	       if( !rows||rows==false){
		        return;
		   }
		   var answers=rows.item(0).answer;       //[4,0,0,0,0]
	       ansarr=answers.split(",");
	       var allp=document.getElementsByTagName("p");
	       for(var i=0;i<allp.length;i++){
	       var allopt=allp[i].getElementsByTagName("input");     //<p><input type=radio><input type=radio>
			//j代表这个题目中的第几个选项
		  for(var j=0;j<allopt.length;j++){
			   if(ansarr[i]==j+1){
				   allopt[j].checked=true;
			   }
			}
	   }
	   }
	  

		function submit(){
			clearInterval(timer);

			var allinput=document.getElementsByTagName("input");
			for(var i=0;i<allinput.length;i++){
				allinput[i].disabled=true;
			}

			var ans=[];
			for(var i=0;i<allque.que.length;i++){
				var num="ans"+i;
				var answer=document.getElementsByName(num);
				//var flag=true;

				for(var j=0;j<answer.length;j++){
					if(answer[j].checked){
						ans.push(answer[j].value);
						flag=false;
					}
				}
				if(flag){
						ans.push("0");
				}
			}

			var score=0;
			for(var j=0;j<allque.que.length;j++){
				if(ans[j]==allque.que[j][6]){
					score+=10;
				}
			}

			var newpage="submit.html#"+(allque.que.length*10)+"_"+score;
			window.open(newpage,"new window","width=300,height=300");
			close();
		}
		
		
		//往数据库中插入数据
		var sqlhelper=new SqlHelper("Questions",2);
		//创建表
		var queFields={"num":"int not null primary key","que":"text","opt1":"text","opt2":"text","opt3":"text","opt4":"text","ans":"int"};
		sqlhelper.createTable("question",queFields);
		//在sqlite中一次插入多条数据的语法：insert into tablename(fields) values(value1),(value2),(value3)...
		sql1="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(1,'中国的首都？','北京','长沙','上海','重庆',1)";
		sql2="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(2,'湖南的省会？','北京','长沙','上海','重庆',2)";
		sql3="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(3,'湖南位于中国的？','北部','南部','西部','东部',2)";
		sql4="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(4,'下列哪个是沿海城市？','北京','衡阳','厦门','成都',3)";
		sql5="insert into question(num,que,opt1,opt2,opt3,opt4,ans) values(5,'世界四大洋中面积最小的是？','太平洋','大西洋','印度洋','北冰洋',4)";
		sqlhelper.exesql(sql1);
		sqlhelper.exesql(sql2);
		sqlhelper.exesql(sql3);
		sqlhelper.exesql(sql4);
		sqlhelper.exesql(sql5);
		
		
		
		var ansarr=new Array(5);     //存用户选择的答案
		for(var i=0;i<ansarr.length;i++){
		     ansarr[i]=0;
		}
		//创建一个表用来存放选择的每项答案
		var ansFields={"num":"int not null primary key","answer":"text"};
		sqlhelper.createTable("answer",ansFields);
		//1,        0,0,0,0,0
		sqlhelper.exesql("insert into answer(num,answer) values(1,'"+ansarr.join()+"')");