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
					{
						"belongto" : "默认分类",
						"name" : "default task",
					}
					];
	localStorage.taskData = JSON.stringify(taskData);
}

window.onload = function (event) {
	var 
}


///////第一栏////////////////////////////////////////////////////////////

//为“新建分类”添加点击事件
var newKind = document.getElementById("new-kind");
addClickEvent(newKind,newKindHandler);

function newKindHandler(event) {
	var 
}


