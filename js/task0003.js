
if (!localStorage.allToDos) {
	var alldata = [
						{
							"title" : "to-do 1",
							"date" : "2016-08-12",
							"content" : "内容文字。",
							"status" : "unfinish",
							"kindBelong" : "百度IFE项目",
							"taskBelong" : "task2",
						},

						{
							"title" : "to-do 2",
							"date" : "2016-08-18",
							"content" : "内容文字。",
							"status" : "finish",
							"kindBelong" : "百度IFE项目",
							"taskBelong" : "task2",
						},

						{
							"title" : "to-do 3",
							"date" : "2016-08-12",
							"content" : "内容文字。",
							"status" : "unfinish",
							"kindBelong" : "百度IFE项目",
							"taskBelong" : "task2",
						},

						{
							"title" : "to-do 4",
							"date" : "2016-08-18",
							"content" : "内容文字。",
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
							"taskBelong" : "defaultTask",
						}
					];

	localStorage.allToDos = JSON.stringify(alldata);

}
if (!localStorage.kindTree) {
	
	var kindTree = ["百度IFE项目","毕业设计","社团活动","家庭生活"];
	localStorage.kindTree = JSON.stringify(kindTree);

	var taskData = [
					{
						"belongto" : "百度IFE项目",
						"name" : "task1",
					},
					{
						"belongto" : "百度IFE项目",
						"name" : "task2",
					},
					];
	localStorage.taskData = JSON.stringify(taskData);
}


/////////////////////

//传入新建的项名及所属级别，保存到localStorage；
function saveItemName(newItem,level) {
	if (level == 2) {
		var getKindTree = JSON.parse(localStorage.kindTree);
		getKindTree.push(newItem);
		localStorage.kindTree = JSON.stringify(getKindTree);
	}
	else if(level == 3) {
		var addItem = {"belongto" : "","name" : ""};

		var level2Item = getCurrItem();
		addItem.belongto = level2Item.firstElementChild.innerHTML;
		addItem.name = newItem;

		var getTaskData = JSON.parse(localStorage.taskData);
		getTaskData.push(addItem);
		localStorage.taskData = JSON.stringify(getTaskData);
	}
	else {
		console.log("保存新建项名出错！");
		return null;
	}
}

//传入一个todo的数据对象，更新或新建到localStorage.allToDos中
//status: new / submit
function saveToDo(todoObject,status) {
	if (status == "new") {
		var allToDos = JSON.parse(localStorage.allToDos);
		allToDos.push(todoObject);
		localStorage.allToDos = JSON.stringify(allToDos);
	}
	else if (status == "submit") {
		var allToDos = JSON.parse(localStorage.allToDos);
		for (var i = 0; i < allToDos.length; i++) {
			if (allToDos[i].kindBelong == todoObject.kindBelong 
				&& allToDos[i].taskBelong == todoObject.taskBelong 
				&& allToDos[i].date == todoObject.date 
				&& allToDos[i].title == todoObject.title) {
				allToDos[i] = todoObject;
				break;
			}
			else if (i == allToDos.length-1) {
				return false;
			}
		}
		localStorage.allToDos = JSON.stringify(allToDos);
		return true;
	}
}

//传入一个level2名，获取对应的level3的所有项名；
function getLevel3Names (level2Name) {
	var dataObj = JSON.parse(localStorage.taskData);
	var level3Names = new Array();
	for (var i = 0; i < dataObj.length; i++) {
		if (dataObj[i].belongto == level2Name) {
			level3Names.push(dataObj[i].name);
		}
	}
	return level3Names;
}


function craEle(str) {
	return document.createElement(str);
}

function creatLevel2Item(itemName) {
	var newLI = craEle("li");
	newLI.innerHTML = "<div class='level2'><span>"+itemName+"</span><span>(n)</span><span class='delete-icon'></span></div>";
	itemAddEvent(newLI.querySelector(".level2"));
	return newLI;
}

function creatLevel3Item(itemName) {
	var newLI = craEle("li");
	newLI.innerHTML = "<div class='level3'><span>"+itemName+"</span><span>(n)</span><span class='delete-icon'></span></div>";
	itemAddEvent(newLI.querySelector(".level3"));
	return newLI;
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
//遍历第一栏，为每一项后面的括号添加“未完成”数。
function unfinishNumReflash() {
	var allItems = document.querySelectorAll("#levelOne li div");
	for (var i = 0; i < allItems.length; i++) {
		if (allItems[i].firstElementChild.innerHTML == "分类列表") {
			continue;
		}
		allItems[i].childNodes[1].innerHTML = "("+ unfinishCount(allItems[i]) +")";
	}
}



//////////////////////////

window.onload = function(event) {
	//为“所有任务”和“默认分类”和“分类列表”添加点击事件；
	var specialItems = document.querySelectorAll(".notaddnew");
	for (var i = 0; i < specialItems.length; i++) {
		itemAddEvent(specialItems[i]);
	}
	var firstNode = document.querySelector(".firstNode");
	firstNode.onclick = function(event) {
		event = EventUtil.getEvent(event);
		var target = EventUtil.getTarget(event);
		var divTarget;

		//去除原点击项的样式，改变选中项的样式（背景色变白）
		getCurrItem().style.backgroundColor = "";
		if (target.nodeName == "DIV") {
			target.style.backgroundColor = "white";
			divTarget = target;
		}
		else if (target.nodeName == "SPAN") {
			target.parentNode.style.backgroundColor = "white";
			divTarget = target.parentNode;
		}
		else {
			console.log("error!");
			return null;
		}

		var tLcontainer = document.getElementById("tL-container");   //获取用于显示列表的目标对象
		tLcontainer.innerHTML = "";        //清空

	}


	var getKinds = JSON.parse(localStorage.kindTree);    //获取第一栏level2的每一项名的数据；
	for (var i = 0; i < getKinds.length; i++) {
		var newLI2 = creatLevel2Item(getKinds[i]);
		
		var getTasks = getLevel3Names(getKinds[i]);      //获取level2下对应的level3数据；
		if (getTasks.length > 0) {
			var newUL = craEle("ul");
			newUL.dataset.level = "3";
			for (var j = 0; j < getTasks.length; j++) {
				var newLI3 = creatLevel3Item(getTasks[j]);
				newUL.appendChild(newLI3);
				newLI2.appendChild(newUL);
			}
		}

		document.querySelector("#levelTwo").appendChild(newLI2);
	}

	//刷新每一项的（n）
	unfinishNumReflash();

	//模拟一个点击事件，点击默认分类，使第二栏显示对应的内容。
	var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
	eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
	var defaultKind = document.querySelector("#defaultKind");
	defaultKind.dispatchEvent(eventSimulater);
	

	console.log("finished.");
}

///////第一栏////////////////////////////////////////////////////////////

//获取当前树列表的选中项div；
function getCurrItem() {
	var divArr = document.getElementById("levelOne").getElementsByTagName("div");
	//console.log(divArr.length);
	for (var i = 0; i < divArr.length; i++) {
		if (divArr[i].style.backgroundColor == "white") {
			var divOne = divArr[i];     //获取到要新建分类的那一个节点，也即是当前的选中项。
			//console.log("当前选中的项:"+divOne);
			return divOne;
		}
		else if (i == divArr.length-1) {
			console.log("Error,获取当前选中的项失败。")
			return null;
		}
	}
}

//对日期数组去重和排序
function dateOrder(dateArr) {
	dateArr = uniqArray_1(dateArr);   //对日期数组去重。

	for (var i = 0; i < dateArr.length; i++) {
		if (Date.parse(dateArr[i]) == NaN) {
			console.log("2016-08-12的格式不能表示日期，无法解析。");
		}
		dateArr[i] = new Date(Date.parse(dateArr[i]));
	}
	dateArr.reverse();

	for (var i = 0; i < dateArr.length; i++) {
		var yearStr = dateArr[i].getFullYear();
		var monthStr = dateArr[i].getMonth()+1;
		monthStr < 10 ? monthStr="0"+monthStr : monthStr;
		var dayStr = dateArr[i].getDate();
		dayStr<10 ? dayStr="0"+dayStr : dayStr;

		dateArr[i] = yearStr+"-"+monthStr+"-"+dayStr;
	}

	console.log(dateArr);

	return dateArr;
}

//为每个可以点击的分类项添加单击事件及处理函数；同时添加hover事件处理函数
function itemAddEvent(targetItem) {
	var spanInnerStr = targetItem.firstElementChild.innerHTML;
	
	if (spanInnerStr == "分类列表") {
		return null;
	}
	addClickEvent(targetItem,kindClickedHandler);

	if (spanInnerStr == "默认分类" || spanInnerStr == "所有任务") {
		return null;
	}
	addEvent(targetItem,"mouseover",kindHoverIn);
	addEvent(targetItem,"mouseout",kindHoverOut);
	addEvent(targetItem.lastElementChild,"click",deleteItemHandler);
}
function itemRemoveEvent(targetItem) {
	removeEvent(targetItem,"click",kindClickedHandler);
	removeEvent(targetItem,"mouseover",kindHoverIn);
	removeEvent(targetItem,"mouseout",kindHoverOut);
	removeEvent(targetItem.lastElementChild,"click",deleteItemHandler);
}


//为“新建分类”添加点击事件
var newKind = document.getElementById("new-kind");
addClickEvent(newKind,newKindHandler);

function newKindHandler(event) {
	
	//获取当前树列表的选中项div；
	var divOne = getCurrItem();
	if (!divOne || divOne.className.search("notaddnew") != -1) {
		alert("当前选中项不能添加新建分类!");
		return null;
	}
	
	var newKindName = prompt("请为新建分类命名：","未命名");
	if (!newKindName) {
		return null;
	}

	//判断将添加的是2级还是3级分类项；
	if (divOne.firstElementChild.innerHTML == "分类列表") {
		//检查命名是否存在重复；
		var kindTree = JSON.parse(localStorage.kindTree);
		if (Array.isArray(kindTree) && kindTree.length > 0) {
			for (var i = 0; i < kindTree.length; i++) {
				if (kindTree[i] == newKindName) {
					alert("level2命名重复，请重新输入！");
					newKindName = prompt("请为新建分类命名：","");
					if (!newKindName) {
						return null;
					}
				}
			}
		}

		var newLevel2 = creatLevel2Item(newKindName);               //添加2级项；
		document.getElementById("levelTwo").appendChild(newLevel2);
		saveItemName(newKindName,2);      //保存项名
	}

	else if (divOne.className == "level2") {
		//检查命名是否存在重复；
		var todoTasks = getLevel3Names (divOne.firstElementChild.innerHTML);
		if (Array.isArray(todoTasks) && todoTasks.length > 0) {
			for (var i = 0; i < todoTasks.length; i++) {
				if (todoTasks[i] == newKindName) {
					alert("level3命名重复，请重新输入！");
					newKindName = prompt("请为新建分类命名：","");
					if (!newKindName) {
						return null;
					}
				}
			}
		}

		var newLevel3 = creatLevel3Item(newKindName);               //添加3级项；
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
		saveItemName(newKindName,3);      //保存项名
	}

	else {
		console.log("不能为当前项添加新分类："+divOne);
		return null;
	}

}

function deleteItemHandler(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var itemTarget = target.parentNode;
	EventUtil.stopPropagation(event);

	//弹框提示！！
	if (!confirm("确认删除该项分支及其所有任务数据？")) {
		return null;
	}

	//如果当前选中对象就是要删除的对象，那么需要转移当前选中项为“默认分类”，可以模拟点击事件;
	//模拟一个点击事件，点击默认分类，使第二栏显示对应的内容。
	var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
	eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
	var defaultKind = document.querySelector("#defaultKind");
	defaultKind.dispatchEvent(eventSimulater);

	//接下来开始删除，先删除当前项的绑定事件；
	itemRemoveEvent(target.parentNode);

	//如果点击删除的是level2项，那么还需要删除level3的所有项的绑定事件；
	if (itemTarget.className == "level2" && itemTarget.nextElementSibling) {
		if (itemTarget.nextElementSibling.childNode) {
			var level3Items = itemTarget.nextElementSibling.childNode
			for (var i = 0; i < level3Items.length; i++) {
				itemRemoveEvent(level3Items[i].firstElementChild);
			}
		}
	}
	
	//还需要移除对应项在localStorage中的数据；
	if (itemTarget.className == "level2") {
		deleteData(itemTarget.firstElementChild.innerHTML);
	}
	else if (itemTarget.className == "level3") {
		var parentItem = itemTarget.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML
		deleteData(itemTarget.firstElementChild.innerHTML,parentItem);
	}
	else {console.log("Error!");}

	//移除第一栏文件Tree里面的目标项节点整个分支；
	itemTarget.parentNode.parentNode.removeChild(itemTarget.parentNode);

}

//删除对应的storage数据；
function deleteData(itemName,parentItem){

	if (!parentItem) {
		var kindTree = JSON.parse(localStorage.kindTree);
		var index = kindTree.indexOf(itemName);
		kindTree.splice(index,1);
		localStorage.kindTree = JSON.stringify(kindTree);

		var taskData = JSON.parse(localStorage.taskData);
		for (var i = 0; i < taskData.length; i++) {
			if (taskData[i].belongto == itemName) {
				taskData.splice(i,1);
				i--;
			}
		}
		localStorage.taskData = JSON.stringify(taskData);

		var allToDos = JSON.parse(localStorage.allToDos);
		for (var i = 0; i < allToDos.length; i++) {
			if (allToDos[i].kindBelong == itemName) {
				allToDos.splice(i,1);
				i--;
			}
		}
		localStorage.allToDos = JSON.stringify(allToDos);


	}
	else if (parentItem) {

		var taskData = JSON.parse(localStorage.taskData);
		for (var i = 0; i < taskData.length; i++) {
			if (taskData[i].name == itemName && taskData[i].belongto == parentItem) {
				taskData.splice(i,1);
				break;
			}
		}
		localStorage.taskData = JSON.stringify(taskData);
		console.log(localStorage.taskData);

		var allToDos = JSON.parse(localStorage.allToDos);
		for (var i = 0; i < allToDos.length; i++) {
			if (allToDos[i].taskBelong == itemName && allToDos[i].kindBelong == parentItem) {
				allToDos.splice(i,1);
				i--;
			}
		}
		localStorage.allToDos = JSON.stringify(allToDos);
	}
	else {
		console.log("Error!");
	}
}

function kindClickedHandler(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);
	var divTarget;

	//去除原点击项的样式，改变选中项的样式（背景色变白）
	getCurrItem().style.backgroundColor = "";
	if (target.nodeName == "DIV") {
		target.style.backgroundColor = "white";
		divTarget = target;
	}
	else if (target.nodeName == "SPAN") {
		target.parentNode.style.backgroundColor = "white";
		divTarget = target.parentNode;
	}
	else {
		console.log("error!");
		return null;
	}

	//接下来根据点中的对应项改变第二栏的列表内容
	var objectsOfKind = new Array();  //提取该类下的所有todo数据对象，放入该数组变量中。
	var dateStrArr = new Array();     //提取该类下每个todo数据对象中的日期属性值，放入该数组变量，再去重。

	var allToDos = JSON.parse(localStorage.allToDos);  //获取所有todo数据，是一个对象数组。
		//console.log(allToDos.length);
	//点击的是二级分类时，遍历筛选todo 时的筛选条件与点击三级时不同。
	if (divTarget.className.search("level2") != -1) {
		console.log("level2 clicked!");
		for (var i = 0; i < allToDos.length; i++) {
			if (allToDos[i].kindBelong == divTarget.firstElementChild.innerHTML) {
				objectsOfKind.push(allToDos[i]);
				dateStrArr.push(allToDos[i].date);
			}
		}
	}
	else if (divTarget.className.search("level3") != -1) {
		console.log("level3 clicked!");
		for (var i = 0; i < allToDos.length; i++) {
			if (allToDos[i].taskBelong == divTarget.firstElementChild.innerHTML 
				&& allToDos[i].kindBelong == divTarget.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML) {
				objectsOfKind.push(allToDos[i]);
				dateStrArr.push(allToDos[i].date);
			}
		}
	}
	else if (divTarget.firstElementChild.innerHTML == "所有任务") {
		console.log("所有任务，clicked!");
		objectsOfKind = allToDos;
		for (var i = 0; i < allToDos.length; i++) {
			dateStrArr.push(allToDos[i].date);
		}
	}
	else {
		console.log("Error!点击该项无效。");
		return null;
	}
	
	dateStrArr = dateOrder(dateStrArr);       //对日期数组去重和排序

	//将状态按钮锁定到“所有”；
	var statusBtns = document.querySelectorAll("#tL-header span");
	for (var i = 0; i < statusBtns.length; i++) {
		statusBtns[i].style.backgroundColor = "";
	}
	document.querySelector("#showALL").style.backgroundColor = "white";

	var tLcontainer = document.getElementById("tL-container");   //获取用于显示列表的目标对象
	tLcontainer.innerHTML = "";        //先清空
	//开始添加要显示的列表内容
	for (var i = 0; i < dateStrArr.length; i++) {
		//遍历日期数组，为每个日期新建一个<ul><li>(对应日期)</li></ul>
		var newDateUl = document.createElement("ul");
		newDateUl.innerHTML = "<li class='dateLi'>"+dateStrArr[i]+"</li>";
		//遍历objectsOfKind数组，把以上日期下的todos添加进Ul中
		for (var j = 0; j < objectsOfKind.length; j++) {
			if (objectsOfKind[j].date == dateStrArr[i]) {
				var addToDoLi = document.createElement("li");
				addToDoLi.innerHTML = objectsOfKind[j].title;
				addToDoLi.className = "todoLi";
				addToDoLi.dataset.kindBelong = objectsOfKind[j].kindBelong;
				addToDoLi.dataset.taskBelong = objectsOfKind[j].taskBelong;
				addToDoLi.dataset.status = objectsOfKind[j].status;
				newDateUl.appendChild(addToDoLi);
			}
		}

		tLcontainer.appendChild(newDateUl);
	}
}

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
}



///////第二栏////////////////////////////////////////////////////////////

//传入一个选中项DIV对象，返回该项下的todos对象数组
//注意：传入level2的项时，获取的只是level2中没有归入内部level3的剩余todos
function getItemToDos (inputItem) {
	var allToDos = JSON.parse(localStorage.allToDos);

	var inputItemToDos = new Array();
	if (inputItem.className.search("level2") != -1) {
		for (var i = 0; i < allToDos.length; i++) {
			if (allToDos[i].kindBelong == inputItem.firstElementChild.innerHTML 
				&& allToDos[i].taskBelong == inputItem.firstElementChild.innerHTML) {
				inputItemToDos.push(allToDos[i]);
			}
		}
	}
	else if (inputItem.className.search("level3") != -1) {
		for (var i = 0; i < allToDos.length; i++) {
			if (allToDos[i].kindBelong == inputItem.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML 
				&& allToDos[i].taskBelong == inputItem.firstElementChild.innerHTML) {
				inputItemToDos.push(allToDos[i]);
			}
		}
	}

	return inputItemToDos;
}

//为“新建任务”添加事件处理函数
var newTask = document.getElementById("new-to-do");
addClickEvent(newTask,newToDoHandler);

function newToDoHandler(event) {
	
	//判断当前选中项
	var targetItem = getCurrItem();
	if (targetItem.className.search("level1") != -1) {
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
	newToDoObject.title = prompt("Please enter your new todo-task name!","unnamed");
	if (newToDoObject.title == null) {
		return null;
	}
	if (newToDoObject.title == "") {
		alert("任务名不能为空！");
		return null;
	}
	
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

	//检查新建任务命名是否重复。
	var currItemData = getItemToDos(getCurrItem());
	console.log(currItemData);
	if (currItemData.length > 0) {
		for (var i = 0; i < currItemData.length; i++) {
			if (currItemData[i].date == newToDoObject.date 
				&& currItemData[i].title == newToDoObject.title) {
				alert("命名重复，请重新命名。");
				newToDoObject.title = prompt("Please enter your new todo-task name!","");
				if (newToDoObject.title == null) {
					return null;
				}
			}
		}
	}


	//检测，当前选中的分类如果是level2项，则taskbelong与kindbelong一样;
	if (targetItem.style.backgroundColor == "white" && targetItem.className.search("level2") != -1) {
		newToDoObject.taskBelong = newToDoObject.kindBelong = targetItem.firstElementChild.innerHTML;
		console.log("当前新建任务的项为Level2");
	}
	else if (targetItem.style.backgroundColor == "white" && targetItem.className.search("level3") != -1) {
		newToDoObject.taskBelong = targetItem.firstElementChild.innerHTML;
		newToDoObject.kindBelong = targetItem.parentNode.parentNode.previousElementSibling.firstElementChild.innerHTML;
		console.log("当前新建任务的项为Level3");
	}
	else {
		console.log("当前选中项不能添加新建任务！");
		return null;
	}
	
	saveToDo(newToDoObject,"new");
	
	//模拟点击事件，刷新第二栏的显示内容。
	var event = document.createEvent("MouseEvents");  //创建事件对象
	event.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
	targetItem.dispatchEvent(event);
}


//为每个todo任务添加点击事件，采用事件代理
var tLcontainer = document.getElementById("tL-container");
addClickEvent(tLcontainer,todoClickHandler);
//定义一个变量存放当前第三栏显示的任务对象；
var currShownToDo;

function todoClickHandler(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);

	//先判断当前第三栏是否处于任务编辑状态
	if (document.querySelector(".textarea textarea").style.display == "block") {
		if (confirm("当前处于编辑状态，是否先提交保存？")) {
			//模拟提交按钮事件
			var eventSimulater = document.createEvent("MouseEvents");    //创建事件对象
			eventSimulater.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
			var submitBtn = document.querySelector("#submit");
			submitBtn.dispatchEvent(eventSimulater);
		}
	}

	var getAllToDoData = JSON.parse(localStorage.allToDos);     //获取所有数据；
	var targetObjectData;  //用于保存寻找到的对应点击那个项的数据；
	//判断点击对象
	if (target.className == "todoLi") {
		for (var i = 0; i < getAllToDoData.length; i++) {
			if (getAllToDoData[i].title == target.innerHTML 
				&& getAllToDoData[i].date == target.parentNode.firstElementChild.innerHTML 
				&& getAllToDoData[i].kindBelong == target.dataset.kindBelong 
				&& getAllToDoData[i].taskBelong == target.dataset.taskBelong) {
				targetObjectData = getAllToDoData[i];
				console.log("已找到文章");

				//更新第三栏的显示内容
				document.getElementById("title").innerHTML = targetObjectData.title;
				document.getElementById("date").lastElementChild.innerHTML = targetObjectData.date;
				document.querySelector(".textarea p").innerHTML = targetObjectData.content;
				document.querySelector(".textarea textarea").style.display = "none";
				document.querySelector(".textarea p").style.display = "block";
				break;
			}
		}
		currShownToDo = targetObjectData;  //将当前第三栏的todo对象数据存入全局变量；		
	}
	else {
		return null;
	}
}


//为“所有”、“未完成”、“已完成”三个按钮添加点击事件，采用事件代理
var showToDo = document.getElementById("tL-header");
addClickEvent(showToDo,showToDoClickHandler);

function showToDoClickHandler (event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);

	//判断点击对象确实为分类项li，避免点击在父元素的空白上触发事件。
	if (target.nodeName !== "SPAN") {
		return null;
	}

	//改变按钮状态；
	var statusBtns = document.querySelectorAll("#tL-header span");
	for (var i = 0; i < statusBtns.length; i++) {
		statusBtns[i].style.backgroundColor = "";
	}
	target.style.backgroundColor = "white";


	//判断点击的是哪个按钮；
	var status;
	switch (target.innerHTML) {
		case "所有" :
			status = "all";
			break;
		case "未完成" :
			status = "unfinish";
			break;
		case "已完成" :
			status = "finish";
			break;
		default :
			console.log("无法判断点击的按钮。");
			return null;
	}

	if (status == "all") {
		var getAllLi = document.querySelectorAll("#tL-container li");
		for (var i = 0; i < getAllLi.length; i++) {
			getAllLi[i].style.display = "block";
		}
	}
	else if (status == "unfinish") {
		var getToDoLi = document.querySelectorAll("#tL-container li.todoLi");
		for (var i = 0; i < getToDoLi.length; i++) {
			getToDoLi[i].style.display = "block";
			if (getToDoLi[i].dataset.status == "finish") {
				getToDoLi[i].style.display = "none";
			}
		}
	}
	else if (status == "finish") {
		var getToDoLi = document.querySelectorAll("#tL-container li.todoLi");
		for (var i = 0; i < getToDoLi.length; i++) {
			getToDoLi[i].style.display = "block";
			if (getToDoLi[i].dataset.status == "unfinish") {
				getToDoLi[i].style.display = "none";
			}
		}
	}
	else {console.log("Error!");}

}






///////第三栏////////////////////////////////////////////////////////////

//为编辑按钮添加点击事件
var editClick = document.getElementById("edit");
addClickEvent(editClick,editClickHandler);

function editClickHandler(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);

	var textareaShow = document.querySelector(".textarea textarea");
	var paraShow = document.querySelector(".textarea p");

	if (textareaShow.style.display == "block") {   //处于编辑状态的话，就使编辑按钮无效化；
		return null;
	}
	//切换到编辑内容的状态；
	textareaShow.style.display = "block";
	textareaShow.value = paraShow.innerHTML;
	paraShow.style.display = "none";

}


//为提交按钮添加点击事件
var submitClick = document.getElementById("submit");
addClickEvent(submitClick,submitClickHandler);

function submitClickHandler(event) {
	event = EventUtil.getEvent(event);
	var target = EventUtil.getTarget(event);

	var textareaShow = document.querySelector(".textarea textarea");
	var paraShow = document.querySelector(".textarea p");
	var title = document.getElementById("title").innerHTML;
	var date = document.getElementById("date").lastElementChild.innerHTML;

	if (paraShow.style.display == "block") {   //如果处于非编辑状态的话就使提交按钮无效化
		return null;
	}
	if (title == "" || date == "") {
		alert("任务名与日期不能为空！");
		return null;
	}
	
	//提示更新任务状态
	if (confirm("该任务已经完成？")) {
		currShownToDo.status = "finish";
	}
	else {
		currShownToDo.status = "unfinish";
	}

	//把编辑后的对象存入localStorage
	currShownToDo.content = textareaShow.value;
	if (!saveToDo(currShownToDo,"submit")) {
		alert("该任务不存在于storage中!");
		return null;
	}

	//刷新一下第一栏的“（n）”
	unfinishNumReflash();

	//切换到显示内容的状态；
	paraShow.style.display = "block";
	paraShow.innerHTML = textareaShow.value;
	textareaShow.style.display = "none";
}

