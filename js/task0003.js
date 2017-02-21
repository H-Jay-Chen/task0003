
////////////////////////////////////////////////

(function (win) {
	
	win.reloadTree = reloadTree;
	
	var currShownToDo;   //用于存储第三栏当前显示的todo数据对象；////////////////////////////////////


	/////////////第一栏///////////////////////////////////////////////

	//分类列表的加载、刷新。
	function reloadTree() {
		var level2_ul = $("#levelTwo");

		//先把ul重新初始化
		level2_ul.innerHTML = '<li>'
								+	'<div id="defaultKind" class="notaddnew level2" style="background-color: white;">'
								+		'<span>默认分类</span>'
								+		'<span>(n)</span>'
								+	'</div>'
								+'</li>';
		

		//重新获取列表数据
		var newDataObj = JSON.parse(localStorage.kindTree);
		//遍历数据对象加载列表。
		for (var kindData in newDataObj) {
			var l2_Item = document.createElement("li");
			l2_Item.innerHTML = '<div class="level2">'
								+	'<span></span>'
								+	'<span>(n)</span>'
								+	'<span class="delete-icon"></span>'
								+'</div>';
			l2_Item.firstElementChild.firstElementChild.innerHTML = kindData;
			level2_ul.appendChild(l2_Item);

			//判断2级分支下是否有3级分支的数据，有的话继续加载3级分支
			if (newDataObj[kindData] instanceof Array && newDataObj[kindData].length > 0) {
				var taskData = newDataObj[kindData];
				var level3_ul = document.createElement("ul");

				for (var i = 0, tLen = taskData.length; i < tLen; i++) {
					var l3_Item = document.createElement("li");
					l3_Item.innerHTML = '<div class="level3 notaddnew">'
										+	'<span></span>'
										+	'<span>(n)</span>'
										+	'<span class="delete-icon"></span>'
										+'</div>';
					l3_Item.firstElementChild.firstElementChild.innerHTML = taskData[i];
					level3_ul.appendChild(l3_Item);
				}

				l2_Item.appendChild(level3_ul);
			}
			else {
				continue;
			}
		}

		//刷新“未完成”数.
		unfinishNumReflash();

		//模拟一个点击事件，点击“默认分类”
		var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
		eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
		$("#defaultKind").dispatchEvent(eventSimulater);
	}

	//新建分类
	$.click("#new-kind",newKindHandler);
	function newKindHandler() {

		var divOne = getCurrItem();       //获取当前树列表的选中项div；
		if (!divOne || divOne.className.search("notaddnew") != -1) {
			alert("当前选中项分支不支持新建子分类，请选择上一级分支节点尝试新建!");
			return null;
		}
		
		var newKindName;
		newKindName = prompt("请为新建分类命名：","未命名");
		if (!newKindName || !newKindName.trim()) {
			alert("新分类名不能为空或空格字符串。");
			return null;
		}

		var kindTree = JSON.parse(localStorage.kindTree);
		
		//判断将添加的是2级还是3级分类项；
		if (divOne.firstElementChild.innerHTML == "分类列表") {
			//检查命名是否存在重复；
			if (getObjectLength_2(kindTree) > 0) {
				for (var eachKind in kindTree) {
					if (newKindName == eachKind) {
						alert("level2命名重复，请重新输入！");
						return null;
					}
				}
			}
			
			var newLevel2 = creatNewItem("level2",newKindName);
			$("#levelTwo").appendChild(newLevel2);
			//保存项名
			kindTree[newKindName] = [];
			localStorage.kindTree = JSON.stringify(kindTree);
		}

		else if (divOne.className == "level2") {
			//检查命名是否存在重复；
			var todoTasks = kindTree[divOne.firstElementChild.innerHTML];
			if (Array.isArray(todoTasks) && todoTasks.length > 0) {
				for (var i = 0; i < todoTasks.length; i++) {
					if (todoTasks[i] == newKindName) {
						alert("level3命名重复，请重新输入！");
						return null;
					}
				}
			}

			var newLevel3 = creatNewItem("level3",newKindName);               //添加3级项；
			//检测该li下是否已经存在ul
			var checkUL = divOne.nextElementSibling;
			if (checkUL && checkUL.nodeName == "UL") {
				checkUL.appendChild(newLevel3);
			}
			else if (!checkUL) {
				var newUL = document.createElement("ul");
				newUL.appendChild(newLevel3);
				divOne.parentNode.appendChild(newUL);
			}
			else {
				console.log("Error!判断UL是否存在过程出错。");
				return null;
			}
			//保存项名
			kindTree[divOne.firstElementChild.innerHTML].push(newKindName);
			localStorage.kindTree = JSON.stringify(kindTree);
		}

		else {
			console.log("不能为当前项添加新分类："+divOne);
			return null;
		}
	}

	//为第一栏添加类的点击事件
	$.click("#levelOne",kindClickedHandler);
	function kindClickedHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);
		var realTarget;
		var divTarget;

		if (target.className == "delete-icon") {
			return null;
		}
		else if (target.nodeName == "DIV") {
			realTarget = target;
		}
		else if (target.nodeName == "SPAN") {
			realTarget = target.parentNode;
		}
		else {
			console.log("error!");
			return null;
		}

		/*//如果点击的是“分类列表”，使点击无效。
		if (realTarget.firstElementChild.innerHTML== "分类列表") {
			return null;
		}*/

		//去除原点击项的样式，改变选中项的样式（背景色变白）
		getCurrItem().style.backgroundColor = "";
		realTarget.style.backgroundColor = "white";
		divTarget = realTarget;

		//将状态按钮锁定到“所有”；
		var statusBtns = document.querySelectorAll("#tL-header span");
		for (var i = 0; i < statusBtns.length; i++) {
			statusBtns[i].style.backgroundColor = "";
		}
		$("#showAll").style.backgroundColor = "white";

		//接下来根据点中的对应项改变第二栏的列表内容
		reloadList();
	}

	//为第一栏添加类的删除事件
	$.click("#levelOne",kindDeleteHandler);
	function kindDeleteHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);

		if (target.className == "delete-icon") {
			//显示提示窗口；
			if (!confirm("点击确定将删除该分支及其对应的所有任务！")) {
				return null;
			}

			//为避免当前分支或其子分支处于选中状态，模拟一个点击事件，点击“默认分类”。
			var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
			eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
			$("#defaultKind").dispatchEvent(eventSimulater);

			//先删除本地内存的分支数据
			var getKindBelong,
				getTaskBelong,
				kindTree = JSON.parse(localStorage.kindTree),
				allToDos = JSON.parse(localStorage.allToDos);
			if (target.parentNode.className == "level3") {
				getTaskBelong = target.parentNode.firstElementChild.innerHTML;
				getKindBelong = target.parentNode.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML;

				var arr = kindTree[getKindBelong];
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == getTaskBelong) {
						arr.splice(i,1);
						kindTree[getKindBelong] = arr;
						break;
					}
				}
				for (var i = 0; i < allToDos.length; i++) {
					if (allToDos[i].kindBelong == getKindBelong
						&& allToDos[i].taskBelong == getTaskBelong) {
						allToDos.splice(i,1);
						i--;
					}
				}
				localStorage.allToDos = JSON.stringify(allToDos);
				localStorage.kindTree = JSON.stringify(kindTree);

			}
			else if (target.parentNode.className == "level2") {
				getKindBelong = target.parentNode.firstElementChild.innerHTML;

				delete kindTree[getKindBelong];
				for (var i = 0; i < allToDos.length; i++) {
					if (allToDos[i].kindBelong == getKindBelong) {
						allToDos.splice(i,1);
						i--;
					}
				}
				localStorage.allToDos = JSON.stringify(allToDos);
				localStorage.kindTree = JSON.stringify(kindTree);
			}
			
			//再删除第一栏的显示分支
			target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
		}
	}

	//获取当前树列表的选中项div；
	function getCurrItem() {
		var divArr = $("#levelOne").getElementsByTagName("div");
		
		for (var i = 0,len = divArr.length; i < len; i++) {
			if (divArr[i].style.backgroundColor == "white") {
				return divArr[i];     //获取到当前的选中项。
			}
			else if (i == divArr.length-1) {
				console.log("Error,获取当前选中的项失败；列表中无当前选中项。")
				return null;
			}
		}
	}
	//获取当前list栏的三个status按钮的选中项；
	function getCurrStatus() {
		var currStatus;
		if ($('#showAll').style.backgroundColor == "white") {
			currStatus = "showAll";
		}
		else if ($('#finish').style.backgroundColor == "white") {
			currStatus = "finish";
		}
		else if ($('#unfinish').style.backgroundColor == "white") {
			currStatus = "unfinish";
		}
		else {
			console.log('Error!');
			return null;
		}
		return currStatus;
	}

	//创建显示于tree栏的新的dom项。
	function creatNewItem(level,itemName) {
		var newLI = document.createElement("li");
		switch (level) {
			case "level2" : newLI.innerHTML = '<div class="level2">'
												+	'<span>'+itemName+'</span>'
												+	'<span>(n)</span>'
												+	'<span class="delete-icon"></span>'
												+'</div>';
							//itemAddEvent(newLI.querySelector(".level2"));
							break;
			
			case "level3" : newLI.innerHTML = '<div class="level3 notaddnew">'
												+	'<span>'+itemName+'</span>'
												+	'<span>(n)</span>'
												+	'<span class="delete-icon"></span>'
												+'</div>';
							//itemAddEvent(newLI.querySelector(".level3"));
							break;
			
			default : console.log("Error! 无法创建新分类项！");
						return null;
		}
		return newLI;
	}

	//遍历第一栏，为每一项后面的括号添加“未完成”数。
	function unfinishNumReflash() {

		var allItems = document.querySelectorAll("#levelOne li div");
		for (var i = 0; i < allItems.length; i++) {
			if (allItems[i].firstElementChild.innerHTML == "分类列表") {
				continue;
			}
			allItems[i].childNodes[1].innerHTML = "("+ unfinishCount(allItems[i]) +")";
		}

		//传入一个项对象，返回该项下的“未完成”任务数。
		function unfinishCount (inputItem) {
			var allToDos = JSON.parse(localStorage.allToDos);

			var count = 0;
			if (inputItem.className.search("level2") != -1) {
				for (var i = 0; i < allToDos.length; i++) {
					if (allToDos[i].kindBelong == inputItem.firstElementChild.innerHTML 
						&& allToDos[i].status == "unfinish") {
						count++;
					}
				}
			}
			else if (inputItem.className.search("level3") != -1) {
				for (var i = 0; i < allToDos.length; i++) {
					if (allToDos[i].kindBelong == inputItem.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML 
						&& allToDos[i].taskBelong == inputItem.firstElementChild.innerHTML 
						&& allToDos[i].status == "unfinish") {
						count++;
					}
				}
			}

			return count;
		}
	}

	/////////////第二栏//////////////////////////////////////////////////

	//根据“当前选中项”以及“任务状态按钮”来加载todos列表的。
	function reloadList() {
		var list = $("#tL-container");
		var dateStrArr = new Array(),     //提取该类下每个todo数据对象中的日期属性值，放入该数组变量，再去重。
			divOne = getCurrItem(),       //当前选中项
			todosToShow;     //用于存储当前选中项对应的todos。


		//通过status当前选中的状态，进行数据提取；
		if ($('#showAll').style.backgroundColor == "white") {
			todosToShow = selectToDos(divOne,"showAll");
		}
		else if ($('#finish').style.backgroundColor == "white") {
			todosToShow = selectToDos(divOne,"finish");
		}
		else if ($('#unfinish').style.backgroundColor == "white") {
			todosToShow = selectToDos(divOne,"unfinish");
		}
		else {
			console.log('Error!');
			return null;
		}

		//抽取数据的日期
		for (var i = 0; i < todosToShow.length; i++) {
			dateStrArr.push(todosToShow[i].date);
		}
		//对日期数组去重和排序
		dateStrArr = dateOrder(dateStrArr);
		//根据日期数组建立第二栏的List
		list.innerHTML = "";   //清空
		for (var j = 0,leng = dateStrArr.length; j < leng; j++) {
			var newDateLi = document.createElement("li");
			newDateLi.innerHTML = '<div class="dateDiv">'+dateStrArr[j]+'</div>'
									+'<ul>'
									+'</ul>';
			for (var k = 0; k < todosToShow.length; k++) {
				if (todosToShow[k].date == dateStrArr[j]) {
					var newTodoLi = document.createElement("li");
					newTodoLi.className = "todoLi";
					newTodoLi.innerHTML = '<span></span><span class="deleteToDo-icon"></span>';
					newTodoLi.firstElementChild.innerHTML = todosToShow[k].title;
					newDateLi.lastElementChild.appendChild(newTodoLi);
				}
			}
			list.appendChild(newDateLi);
		}

		//最后模拟一个点击事件，点击list的第一个todo，让其成为默认选中项；
		if ($(".todoLi")) {
			var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
			eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
			$(".todoLi").dispatchEvent(eventSimulater);
		}	
	}

	//新建任务，点击事件处理函数。
	$.click("#new-to-do",newTaskHandler);
	function newTaskHandler(event) {
		//判断当前选中项
		var currItem = getCurrItem();
		if (currItem.className.search("level1") != -1) {
			alert("当前选中项不能添加新建任务！");
			return null;
		}

		//新建一个todo对象；
		var newToDoObject = new Object();
		newToDoObject = {
							"title" : "",
							"date" : "",
							"content" : "",
							"status" : "unfinish",
							"kindBelong" : "",
							"taskBelong" : "",
						};
		//输入新任务名；
		newToDoObject.title = prompt("Please enter your new todo-task name!","unnamed");
		if (newToDoObject.title == null) {        //关闭对话框或取消。
			return null;
		}
		if (newToDoObject.title == "") {
			alert("任务名不能为空！");
			return null;
		}

		//输入新任务日期，有默认当前日期的预输入。
		var currTime = new Date();
		var yearStr = currTime.getFullYear();
		var monthStr = currTime.getMonth()+1;
		monthStr < 10 ? monthStr="0"+monthStr : monthStr;
		var dayStr = currTime.getDate();
		dayStr<10 ? dayStr="0"+dayStr : dayStr;
		var suggDate = yearStr+"-"+monthStr+"-"+dayStr;

		newToDoObject.date = prompt("Please enter date like 'xxxx-xx-xx'.",suggDate);
		if (newToDoObject.date == null) {
			return null;
		}
		if (newToDoObject.date == "") {
			alert("日期不能为空！");
			return null;
		}

		//检查日期输入的格式是否有误。
		var datePattern = /^\d{4}-\d{2}-\d{2}$/;
		if (!datePattern.test(newToDoObject.date)) {
			alert("日期格式输入有误。");
			return null;
		}
		

		//检查新建任务命名是否重复。
		var currItemData = selectToDos(currItem,"showAll");
		if (currItemData.length > 0) {
			for (var i = 0; i < currItemData.length; i++) {
				if (currItemData[i].date == newToDoObject.date 
					&& currItemData[i].title == newToDoObject.title) {
					alert("命名重复，请重新命名。");
					return null;
				}
			}
		}

		//检测，当前选中的分类如果是level2项，则taskbelong与kindbelong一样;
		if (currItem.className.search("level2") != -1) {
			newToDoObject.taskBelong = newToDoObject.kindBelong = currItem.firstElementChild.innerHTML;
			console.log("当前新建任务的项为Level2");
		}
		else if (currItem.className.search("level3") != -1) {
			newToDoObject.taskBelong = currItem.firstElementChild.innerHTML;
			newToDoObject.kindBelong = currItem.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML;
			console.log("当前新建任务的项为Level3");
		}
		else {
			console.log("Error！");
			return null;
		}

		//保存新建任务对象到localstorage
		editAllTodos("add",newToDoObject);

		//刷新list
		reloadList();

		//刷新“未完成”数.
		unfinishNumReflash();
	}

	//每一项todo的点击事件
	$.click("#tL-container",todoClickHandler);
	function todoClickHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);

		if (target.className == "deleteToDo-icon") {
			return null;
		}
		else if (target.nodeName == "SPAN") {
			target = target.parentNode;
		}

		//先判断当前第三栏是否处于任务编辑状态
		if ($(".textarea textarea").style.display == "block") {
			if (confirm("当前处于编辑状态，是否先提交保存？")) {
				//模拟提交按钮事件
				var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
				eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
				$("#submit").dispatchEvent(eventSimulater);
			}
		}

		var getAllToDoData = selectToDos(getCurrItem(),getCurrStatus());     //获取所有当前分支下的todos数据；
		var targetObjectData;  //用于保存寻找到的对应点击那个项的数据；
		//判断点击对象
		if (target.className == "todoLi") {

			for (var i = 0; i < getAllToDoData.length; i++) {
				if (getAllToDoData[i].title == target.firstElementChild.innerHTML 
					&& getAllToDoData[i].date == target.parentNode.previousElementSibling.innerHTML) {
					
					targetObjectData = getAllToDoData[i];
					console.log("已找到文章");

					//更新第三栏的显示内容
					$("#title").innerHTML = targetObjectData.title;
					$("#showDate").innerHTML = targetObjectData.date;
					$("#showStatus").innerHTML = targetObjectData.status;
					$(".textarea p").innerHTML = targetObjectData.content;
					$(".textarea textarea").style.display = "none";
					$(".textarea p").style.display = "block";
					break;
				}
			}

			currShownToDo = targetObjectData;  //将当前第三栏的todo对象数据存入全局变量；		
		}
		else {
			return null;
		}

		//改变选中项的背景颜色；
		var arrToDoLi = $("#tL-container").querySelectorAll(".todoLi");
		for (var j = 0; j < arrToDoLi.length; j++) {
			arrToDoLi[j].style.backgroundColor = "";
		}
		target.style.backgroundColor = "#ddd";
	}

	//todo项的删除事件
	$.click("#tL-container",todoDeleteHandler);
	function todoDeleteHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);

		if (target.className == "deleteToDo-icon") {
			var toDeleteObj = getClickedTodo(target.parentNode);
			editAllTodos("delete",toDeleteObj); //删除数据；
			
			//当要删除的对象正处于选中状态时，先模拟一个点击事件，点击list的第一个todo；再删除。
			if (toDeleteObj.date == currShownToDo.date
				&& toDeleteObj.title == currShownToDo.title) {
				var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
				eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
				$("#tL-container").firstElementChild.lastElementChild.firstElementChild.dispatchEvent(eventSimulater);
			}
			
			//删除list中对应的项；
			if (target.parentNode.parentNode.childNodes.length == 0 ) {
				$("#tL-container").removeChild(target.parentNode.parentNode.parentNode);
			}
			else {
				target.parentNode.parentNode.removeChild(target.parentNode);
			}

			//刷新“未完成”数.
			unfinishNumReflash();

		}
		else {
			return null;
		}
	}

	//为三个状态按钮添加点击事件
	$.click("#tL-header",statusClickHandler);
	function statusClickHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);
		if (target.nodeName == "DIV") {
			return null;
		}

		var arrBtn = document.querySelectorAll("#tL-header span");
		for (var i = 0; i < arrBtn.length; i++) {
			arrBtn[i].style.backgroundColor = "";
		}

		target.style.backgroundColor = "white";

		reloadList();
	}


	//todos筛选函数，参数“当前选中项”以及“任务状态”
	function selectToDos(belongKind,status) {
		var selected_1 = new Array(),
			selected_2 = new Array(),
			allToDos = JSON.parse(localStorage.allToDos);
		
		//通过status当前选中的状态，进行第一轮数据提取；
		if (!belongKind || !status) {
			return null;
		}
		switch(status) {
			case "showAll":
				selected_1 = allToDos;
				break;
			case "finish": 
				for (var i = 0; i < allToDos.length; i++) {
					if (allToDos[i].status == "finish") {
						selected_1.push(allToDos[i]);
					}
				};
				break;
			case "unfinish":
				for (var i = 0; i < allToDos.length; i++) {
					if (allToDos[i].status == "unfinish") {
						selected_1.push(allToDos[i]);
					}
				};
				break;
			default : 
				console.log("Error! Error on status of 'function selectToDos(belongKind,status)'.");
				break;

		}

		//获取当前选中项对应的数据及抽取数据的日期，此为第二轮数据的提取；
		if (belongKind.firstElementChild.innerHTML == "所有任务") {
			selected_2 = selected_1;
		}
		else if (belongKind && belongKind.className.search("level2") != -1) {
			for (var j = 0 ,len = selected_1.length; j < len; j++) {
				if (selected_1[j].kindBelong == belongKind.firstElementChild.innerHTML) {
					selected_2.push(selected_1[j]);
				}
			}
		}
		else if (belongKind.className.search("level3") != -1) {
			for (var j = 0,len = selected_1.length; j < len; j++) {
				if (selected_1[j].kindBelong == belongKind.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML 
					&& selected_1[j].taskBelong == belongKind.firstElementChild.innerHTML) {
					selected_2.push(selected_1[j]);
				}
			}
		}
		else {
			console.log("分类列表clicked!");
			//console.log("Error!。Function selectToDos(belongKind,status) 不正常。");
			//return null;
		}

		return selected_2;
	}

	//对日期数组去重和排序
	function dateOrder(dateArr) {
		dateArr = uniqArray_1(dateArr);   //对日期数组去重。

		for (var i = 0; i < dateArr.length; i++) {
			/*if (Date.parse(dateArr[i]) == NaN) {
				console.log("2016-08-12的格式不能表示日期，无法解析。");
			}*/
			dateArr[i] = new Date(Date.parse(dateArr[i]));
		}
		dateArr.sort(compare);

		for (var i = 0; i < dateArr.length; i++) {
			var yearStr = dateArr[i].getFullYear();
			var monthStr = dateArr[i].getMonth()+1;
			monthStr < 10 ? monthStr="0"+monthStr : monthStr;
			var dayStr = dateArr[i].getDate();
			dayStr<10 ? dayStr="0"+dayStr : dayStr;

			dateArr[i] = yearStr+"-"+monthStr+"-"+dayStr;
		}

		//console.log(dateArr);

		return dateArr;

		function compare(val1,val2) {
			if (val1 > val2) {
				return -1;
			} else if (val1 < val2) {
				return 1;
			} else {
				return 0;
			}
		}
	}

	//用于向localStorage“add”/“delete”数据的函数。
	function editAllTodos (motion,obj) {
		var allToDos = JSON.parse(localStorage.allToDos);
		// console.log(motion);
		// console.log(obj);
		switch(motion) {
			case "add" : 
						allToDos.push(obj);
						//console.log("data add over!");
						break;

			case "delete" : 
						for (var i = 0; i < allToDos.length; i++) {
							if (allToDos[i].title == obj.title
								&& allToDos[i].date == obj.date
								&& allToDos[i].status == obj.status
								&& allToDos[i].kindBelong == obj.kindBelong
								&& allToDos[i].taskBelong == obj.taskBelong) {

								allToDos.splice(i,1);
								//console.log("data delete over!");
								break;
							}
						};
						break;
			default :
						console.log("Error!");
						return null;
		}

		localStorage.allToDos = JSON.stringify(allToDos);
	}

	//用于获取第二栏点击到的todo项的数据对象；
	function getClickedTodo(clickedLi) {
		var getListToDos = selectToDos(getCurrItem(),getCurrStatus());     //获取所有当前分支下的todos数据；
		for (var i = 0; i < getListToDos.length; i++) {
			if (getListToDos[i].date == clickedLi.parentNode.previousElementSibling.innerHTML
				&& getListToDos[i].title == clickedLi.firstElementChild.innerHTML) {
				return getListToDos[i];
			}
		}
	}


	/////////第三栏//////////////////////////////

	//为编辑按钮添加点击事件
	$.click("#edit",editClickHandler);
	function editClickHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);

		var textareaShow = $(".textarea textarea");
		var paraShow = $(".textarea p");

		if (textareaShow.style.display == "block") {   //处于编辑状态的话，就使编辑按钮无效化；
			return null;
		}
		
		//切换到编辑内容的状态；
		$("#title").style.display = "none";
		$("#showDate").style.display = "none";
		$("#showStatus").style.display = "none";
		paraShow.style.display = "none";
		
		$("#editTitle input").value = currShownToDo.title;
		$("#editDate").value = currShownToDo.date;
		$("#editStatus").value = currShownToDo.status;
		textareaShow.value = currShownToDo.content;
		
		textareaShow.style.display = "block";
		$("#attention").style.display = "block";
		$("#editTitle").style.display = "inline-block";
		$("#editDate").style.display = "inline-block";
		$("#editStatus").style.display = "inline-block";

	}


	//为提交按钮添加点击事件
	$.click("#submit",submitClickHandler);
	function submitClickHandler(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);

		var textareaShow = $(".textarea textarea");
		var paraShow = $(".textarea p");

		if (paraShow.style.display == "block") {   //如果处于非编辑状态的话就使提交按钮无效化
			return null;
		}

		//检查title重复性，日期格式，状态内容，三者是否正确
		var datePattern = /^\d{4}-\d{2}-\d{2}$/;
		if (!datePattern.test($("#editDate").value)) {
			alert("日期格式输入有误。");
			return null;
		}
		if ($("#taskName").value != currShownToDo.title) {
			//检查新建任务命名是否重复。
			var currItemData = selectToDos(getCurrItem(),"showAll");
			if (currItemData.length > 0) {
				for (var i = 0; i < currItemData.length; i++) {
					if (currItemData[i].date == $("#editDate").value 
						&& currItemData[i].title == $("#taskName").value) {
						alert("命名重复，请重新命名。");
						return null;
					}
				}
			}
		}

		if ($("#editStatus").value != "finish" && $("#editStatus").value != "unfinish") {
			alert("请输入“finish”或“unfinish”作为状态。");
			return null;
		}

		//提交前先删除alltodos中的旧数据
		editAllTodos ("delete",currShownToDo);
		//编辑完成后，需要更新一下存放着 当前显示的todo 的变量（currShownToDo）中的数据。
		currShownToDo.title = $("#taskName").value;
		currShownToDo.date = $("#editDate").value;
		currShownToDo.status = $("#editStatus").value;
		currShownToDo.content = textareaShow.value;
		//把编辑后的对象存入localStorage
		editAllTodos ("add",currShownToDo);

		//刷新“未完成”数.
		unfinishNumReflash();

		//切换到显示内容的状态；
		textareaShow.style.display = "none";
		$("#editTitle").style.display = "none";
		$("#editDate").style.display = "none";
		$("#editStatus").style.display = "none";
		$("#attention").style.display = "none";



		
		$("#title").style.display = "inline-block";
		$("#showDate").style.display = "inline-block";
		$("#showStatus").style.display = "inline-block";
		paraShow.style.display = "block";

		//重新加载list。
		reloadList();
	}

}) (window)


window.onload = function(event) {

		if (!localStorage.allToDos || localStorage.initDate != "20170218") {
		
		localStorage.initDate = "20170218";   //用于确保allToDos与kindTree是由此应用程序初始化的。

		var alldata = [
							{
								"title" : "to-do 1",
								"date" : "2016-08-12",
								"content" : "重写task0003个人任务管理系统。",
								"status" : "unfinish",
								"kindBelong" : "百度IFE项目",
								"taskBelong" : "task2",
							},

							{
								"title" : "to-do 2",
								"date" : "2016-08-18",
								"content" : "重写task0003个人任务管理系统。",
								"status" : "finish",
								"kindBelong" : "百度IFE项目",
								"taskBelong" : "task2",
							},

							{
								"title" : "to-do 3",
								"date" : "2016-08-12",
								"content" : "重写task0003个人任务管理系统。",
								"status" : "unfinish",
								"kindBelong" : "百度IFE项目",
								"taskBelong" : "task2",
							},

							{
								"title" : "to-do 4",
								"date" : "2016-08-18",
								"content" : "重写task0003个人任务管理系统。",
								"status" : "finish",
								"kindBelong" : "百度IFE项目",
								"taskBelong" : "task2",
							},

							{
								"title" : "to-do 5",
								"date" : "2016-08-12",
								"content" : "内容文字。",
								"status" : "finish",
								"kindBelong" : "默认分类",
								"taskBelong" : "默认分类",
							}
						];
		localStorage.allToDos = JSON.stringify(alldata);

		var kindTree = {
						"百度IFE项目":["task1","task2"],
						"毕业设计":["step1","step2","step3"],
						"社团活动":["meeting","active"],
						"家庭生活":["dailyTraining"]
					};
		localStorage.kindTree = JSON.stringify(kindTree);
		
		}

		reloadTree();    //加载第一栏的内容
	}

////////////////////////////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////////////



//为每个可以删除的项添加hover事件处理函数

	/*addEvent(targetItem,"mouseover",kindHoverIn);
	addEvent(targetItem,"mouseout",kindHoverOut);

	removeEvent(targetItem,"mouseover",kindHoverIn);
	removeEvent(targetItem,"mouseout",kindHoverOut);

	function kindHoverIn(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);
		var realTarget;
		if (target.nodeName == "DIV") {
			realTarget = target;
		}
		else if (target.nodeName == "SPAN") {
			realTarget = target.parentNode;
		}
		else {
			console.log("Error!");
		}

		if (realTarget.lastElementChild && realTarget.lastElementChild.className == "delete-icon") {
			realTarget.lastElementChild.style.opacity = 1;
		}
		else {
			console.log("faill.");
			return null;
		}
	}

	function kindHoverOut(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);
		var realTarget;
		if (target.nodeName == "DIV") {
			realTarget = target;
		}
		else if (target.nodeName == "SPAN") {
			realTarget = target.parentNode;
		}
		else {
			console.log("Error!");
		}

		if (realTarget.lastElementChild && realTarget.lastElementChild.className == "delete-icon") {
			realTarget.lastElementChild.style.opacity = 0;
		}
		else {
			return null;
		}
	}*/

