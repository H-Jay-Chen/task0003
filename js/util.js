		
	// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
	// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
		function clone(obj){
			var o;
			switch(typeof obj){
			case 'undefined': break;
			case 'string'   : o = obj + '';break;
			case 'number'   : o = obj - 0;break;
			case 'boolean'  : o = obj;break;
			case 'object'   :
				if(obj === null){
					o = null;
				}else{
					if(obj instanceof Array){
						o = [];
						for(var i = 0, len = obj.length; i < len; i++){
							o.push(clone(obj[i]));
						}
					}else{
						o = {};
						for(var k in obj){
							o[k] = clone(obj[k]);
						}
					}
				}
				break;
			default:		
				o = obj;break;
			}
			return o;	
		}


	// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
		function uniqArray_1(arr){
			if (!arr instanceof Array) {
				console.log("请为该函数传入一个数组类型的参数。");
				return null;
			}
			for (var i =0, len =arr.length; i < len; i++) {
				if (typeof arr[i] != "string" && typeof arr[i] != "number") {
					//console.log("arr["+i+"]"+" is "+typeof arr[i]);
					console.log("Error! 数组中第"+(i+1)+"个元素既不是数字也不是字符串！");
				}
			}

			for (i = 0; i < arr.length; i++) {
				for (var j = i+1; j < arr.length; j++){
					if (arr[i]==arr[j]){
						arr.splice(j,1);
						j--;
					}
				}
			}

			return arr;
		}

	
		function uniqArray_2(arr){
			if (!arr instanceof Array) {
				console.log("请为该函数传入一个数组类型的参数。");
				return null;
			}
			for (var i =0, len =arr.length; i < len; i++) {
				if (typeof arr[i] != "string" && typeof arr[i] != "number") {
					//console.log("arr["+i+"]"+" is "+typeof arr[i]);
					console.log("Error! 数组中第"+(i+1)+"个元素既不是数字也不是字符串！");
				}
			}

			var arrBack = new Array(); 
			arrBack[0] = arr[0];
			for (var i = 1; i < arr.length; i++) {
				for (var j = 0; j < arrBack.length; j++) {
					if(arr[i] === arrBack[j]){
						break;
					}
					else if(j === arrBack.length-1){
						arrBack.push(arr[i]);
						break;
					}
					else{
						continue;
					}
				}
			}
			return arrBack;
		}

		
		function uniqArray_3(arr) {
		    var newArr = [];
		    for (var i in arr) {
		        if(newArr.indexOf(arr[i]) == -1) {
		            newArr.push(arr[i]);
		        }
		    }
		    return newArr;
		}


	// 真正实现一个trim
	// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
	// 尝试使用一行简洁的正则表达式完成该题目
		function trim(str) {
		    var pattern = /^\s+|\s+$/g ;
		    if (pattern.test(str)) {
		    	return str.replace(pattern,"");
		    }
		    else {
		    	return str;
		    }
		}
	

	// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
		function each(arr, fn) {
		    // your implement
		    for (var i = 0; i < arr.length; i++) {
		    	//fn(arr[i]);
		    	fn(arr[i],i);     // 其中fn函数可以接受两个参数：item和index
		    }
		}
		

	// 判断是否为邮箱地址
		function isEmail(emailStr) {
		    // your implement
		    var pattern_E = /(\w+)@(\w+\.com)/ig;
		    return pattern_E.test(emailStr);
		}

	// 判断是否为手机号
		function isMobilePhone(phone) {
		    // your implement
		    var pattern_P = /(^\d{4}-\d{11}$)|(^\d{11}$)/g;
		    return pattern_P.test(phone);
		}


	// 获取一个对象里面第一层元素的数量，返回一个整数
		function getObjectLength_1(obj) {
			var i = 0;
			for (var arr in obj){
				i++;
			}
			return i;
		}


		function getObjectLength_2(obj){
		    var length=0;
		    for(var propName in obj){
		        if(obj.hasOwnProperty(propName)){
		            length++;
		        }
		    }
		    return length;
		}

		function getObjectLength_3(obj){
		    var length=0;
		    return Object.keys(obj).length;//键值
		}
		//思路：
		//for in语句会枚举出对象的所有属性，我们这里不需要全部属性，只需要对象的实例属性，所以还要用hasOwnProperty属性过滤一遍. 
		//第二种：直接用Object.keys(obj)方法,返回的也是实例属性.但是貌似是es5里面的. 
		//另外提一下，Object.getOwnPropertyNames(obj),可以返回obj的所有属性，但是好像也是es5的.



//第3. DOM

	// 为element增加一个样式名为newClassName的新样式
		// 方案一，兼容绝大部分浏览器。
		function addClass(element, newClassName) {
	    	// your implement
		    var trimClassName = element.className.trim();
		    var classNames = trimClassName.split(/\s+/);
		    //console.log(classNames.length);
		    if (!element.className || !trimClassName) {
		    	//console.log("className type is :"  + typeof element.className);
		    	element.className = newClassName;
		    }
		    else {
		    	for (var i = 0; i < classNames.length; i++) {
		    		if (classNames[i] === newClassName) {
		    			console.log("This class was existed!");
		    			return;
		    		}
		    	}
		    	var j = classNames.length;
		    	classNames[j] = newClassName;
		    	element.className = classNames.join(" ");
		    }
		}

		// 方案二，仅Firefox 3.6+ 和 chrome 支持classList属性。
		function addClass_2(element, newClassName){
			element.classList.add(newClassName);
		}


	// 移除element中的样式oldClassName
		function removeClass(element, oldClassName) {
		    // your implement
		    var classNames = element.className.split(/\s+/);
		    for (var i = 0; i < classNames.length; i++) {
		    	if (classNames[i] === oldClassName) {
		    		classNames.splice(i,1);
		    		break;
		    	}
		    }
		    element.className = classNames.join(" ");
		}

	// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
		function isSiblingNode(element, siblingNode) {
		    // your implement
		    return element.parentNode===siblingNode.parentNode;

		}

	// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
		function getPosition(element) {
		    // your implement
		    var x = 0,
		    	y = 0;

		    for (var currentEle = element; currentEle.offsetParent ; currentEle = currentEle.offsetParent) {
		    	x += currentEle.offsetLeft;
		    	y += currentEle.offsetTop;
		    }
		    return {x,y};
		}


	//实现一个简单的Query
		// 可以通过id获取DOM对象，通过#标示，例如
		//$("#adom"); // 返回id为adom的DOM对象

		// 可以通过tagName获取DOM对象，例如
		//$("a"); // 返回第一个<a>对象

		// 可以通过样式名称获取DOM对象，例如
		//$(".classa"); // 返回第一个样式定义包含classa的对象

		// 可以通过attribute匹配获取DOM对象，例如
		//$("[data-log]"); // 返回第一个包含属性data-log的对象

		//$("[data-time=2015]"); // 返回第一个包含属性data-time且值为2015的对象

		// 可以通过简单的组合提高查询便利性，例如
		//$("#adom .classa"); // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象
		


		//思路：
		//1、判断分组处理器
		//2、处理层级处理器
		//3、各种元素的处理
		function $(selector) {

		    if (!selector) {
		        console.log("selector 不存在！");
		        return null;
		    }

		    if (selector == document) {
		        return document;
		    }

		    selector = selector.trim();

		    if (selector.indexOf(" ") !== -1) { //若存在空格
		        var selectorArr = selector.split(/\s+/); //拆成数组

		        var rootScope = myQuery(selectorArr[0]); //第一次的查找范围
		        var result = [];
		        
		        //循环选择器中的每一个元素
		        for (var i = 1; i < selectorArr.length; i++) {
		            for (var j = 0; j < rootScope.length; j++) {
		                result = result.concat(myQuery(selectorArr[i], rootScope[j]));
		            }
		            if (i != selectorArr.length-1) {
		            	rootScope = result;
		            	result = [];
		            }
		        }
		        return result[0];

		    } else { //只有一个，直接查询
		        return myQuery(selector, document)[0];
		    }


		    function myQuery(selector, root) {
			    var signal = selector[0]; //
			    var allChildren = null;
			    var content = selector.substr(1);
			    var currAttr = null;
			    var result = [];
			    root = root || document; //若没有给root，赋值document
			    switch (signal) {
			        case "#":
			            result.push(document.getElementById(content));
			            break;
			        case ".":
			            allChildren = root.getElementsByTagName("*");
			            // var pattern0 = new RegExp("\\b" + content + "\\b");
			            for (var i = 0; i < allChildren.length; i++) {
			                currAttr = allChildren[i].getAttribute("class");
			                if (currAttr !== null) {
			                    var currAttrsArr = currAttr.split(/\s+/);
			                    // console.log(currAttr);
			                    for (var j = 0; j < currAttrsArr.length; j++) {
			                        if (content === currAttrsArr[j]) {
			                            result.push(allChildren[i]);
			                            // console.log(result);
			                        }
			                    }
			                }
			            }
			            break;
			        case "[": //属性选择
			            if (content.search("=") == -1) { //只有属性，没有值
			                allChildren = root.getElementsByTagName("*");
			                for (var i = 0; i < allChildren.length; i++) {
			                    if (allChildren[i].getAttribute(selector.slice(1, -1)) !== null) {
			                        result.push(allChildren[i]);
			                    }
			                }
			            } else { //既有属性，又有值
			                allChildren = root.getElementsByTagName("*");
			                var pattern = /\[(\w+)\s*\=\s*(\w+)\]/; //为了分离等号前后的内容
			                var cut = selector.match(pattern); //分离后的结果，为数组
			                var key = cut[1]; //键
			                var value = cut[2]; //值
			                for (var i = 0; i < allChildren.length; i++) {
			                    if (allChildren[i].getAttribute(key) == value) {
			                        result.push(allChildren[i]);
			                    }
			                }
			            }
			            break;
			        default: //tag
						var collectDom = root.getElementsByTagName(selector);
						for (var i = 0; i < collectDom.length; i++) {
							result.push(collectDom[i]);
						}
						break;
			    }
			    return result;
			}
		}
	


//第4. 事件

	

	// 给一个element绑定一个针对event事件的响应，响应函数为listener
		function addEvent(element, event, listener) {
		    // your implement
		    if (element.addEventListener) {
		    	element.addEventListener(event,listener,false);   //支持DOM2级的浏览器。
		    }
		    else if (element.attachEvent) {
		    	element.attachEvent("on"+event,listener);      // IE浏览器。
		    }
		    else {
		    	element["on"+event] = listener;     // 支持DOM0级的浏览器。
		    }
		}

	// 移除element对象对于event事件发生时执行listener的响应
		function removeEvent(element, event, listener) {
		    // your implement
		    if (element.removeEventListener) {
		    	element.removeEventListener(event,listener,false);   //支持DOM2级的浏览器。
		    }
		    else if (element.detachEvent) {
		    	element.detachEvent("on"+event,listener);      // IE浏览器。
		    }
		    else {
		    	element["on"+event] = null;     // 支持DOM0级的浏览器。
		    }
		}

	// 实现对click事件的绑定
		function addClickEvent(element, listener) {
		    // your implement
		    if (element.addEventListener) {
		    	element.addEventListener("click",listener,false);
		    }
		    else if (element.attachEvent) {
		    	element.attachEvent("onclick",listener);
		    }
		    else {
		    	element.onclick = listener;
		    }
		}

	// 实现对于按Enter键时的事件绑定
		function addEnterEvent(element, listener) {
		    // your implement
		    addEvent(element,"keydown",function(event){
		    	if (event.keyCode = 13) {	
		    		listener.call(element,event);
		    	}
		    });
		}

	//接下来我们把上面几个函数和$做一下结合，把他们变成$对象的一些方法
		//$.on = addEvent;
		//$.un = removeEvent;
		//$.click = addClickEvent;
		//$.enter = addEnterEvent;


	// 事件代理  ，先来简单一些的
		function delegateEvent(element, tag, eventName, listener) {
		    // your implement
		    addEvent(element,eventName, function(event){
		            if (event.target&&event.target.nodeName.toLowerCase()==tag) {
		                listener.call(event.target,event);
		            }
		        });
		}


	
	//对前面的事件函数做封装
		$.on = function(selector, event, listener) {
		    // your implement
		    var element = $(selector);
		    addEvent(element,event,listener);
		}

		$.click = function(selector, listener) {
		    // your implement
		    var element = $(selector);
		    addClickEvent(element,listener);
		}

		$.un = function(selector, event, listener) {
		    // your implement
		    var element = $(selector);
		    removeEvent(element,event,listener);
		}

		$.delegate = function(selector, tag, event, listener) {
		    // your implement
		    var element = $(selector);
		    var eventName = event;
		    addEvent(element,eventName, function(event){
		        if (event.target&&event.target.nodeName.toLowerCase()==tag) {
		            listener.call(event.target,event);
		        }
		    });
		}




//第5.BOM的基础练习
		
	// 判断是否为IE浏览器，返回-1或者版本号
		function isIE() {
		    // your implement
		    if (myBrowser()==="IE") {
		    	return navigator.appVersion;
		    }
		    else {
		    	return "-1";
		    }
		}
		//判断浏览器的类型的
		function myBrowser(){
		    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		    var isOpera = userAgent.indexOf("Opera") > -1;
		    if (isOpera) {
		        return "Opera";
		    } //判断是否Opera浏览器
		    else if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
		        return "IE";
		    } //判断是否IE浏览器
		    else if (userAgent.indexOf("Firefox") > -1) {
		        return "FF";
		    } //判断是否Firefox浏览器
		    else if (userAgent.indexOf("Chrome") > -1){
		    	return "Chrome";
		    } //判断是否Chrome浏览器
		    else if (userAgent.indexOf("Safari") > -1) {
		        return "Safari";
		    } //判断是否Safari浏览器
		    else {
		    	return "unknow";
		    }
		}

	// 设置cookie(名-值-过期时间/天)
		function setCookie(cookieName, cookieValue, expiredays) {
		    // your implement
		    var exdate = new Date();
		    exdate.setDate(exdate.getDate() + expiredays);
		    document.cookie  = escape(cookieName) + "=" + escape(cookieValue) + ((expiredays==null)?"":"; expires=" + exdate.toGMTString());
		    //console.log(document.cookie);
		}

	// 获取cookie值
		function getCookie(cookieName) {
		    // your implement
		    var arr,
		    	reg = RegExp("(^|)"+escape(cookieName)+"=([^\\;]*)(\\;|$)");
		    arr = document.cookie.match(reg);
		    //console.log(arr);
		    if (arr) {
		    	return unescape(arr[2]);
		    }
		    else {
		    	return null;
		    }
		}

	// 删除cookie值
		function delectCookie(cookieName) {
			var expire = new Date();
			expire.setDate(expire.getDate() -1);  //把过期时间expries设置为过去时可以立即删除cookie
			var cookieValue = getCookie(cookieName);
			if (cookieValue!=null) {
				document.cookie = escape(cookieName) + "=" + escape(cookieValue) + "; expires=" + expire.toGMTString();
			}
		}

	//检测cookie是否已有值
		function checkCookie() {
			username = getCookie('username');
			if (username!=null && username!="") {
		  		alert('Welcome again '+username+'!');
		  	}
			else {
		  		username=prompt('Please enter your name:',"");
		  		if (username!=null && username!=""){
		    		setCookie('username',username,365);
		    		//console.log(getCookie("username"));
		    	}
		  	}
		}

	    //实例运行
		//console.log(isIE());
		//document.body.onload = checkCookie();




////////////跨浏览器的事件处理程序与事件对象//////////////////////////////////////////////////

	var EventUtil = {
		addHandler : function(element,type,handler){
			if (element.addEventListener) {
				element.addEventListener(type,handler,false);            //DOM2级事件处理程序
			}
			else if (element.attachEvent) {
				element.attachEvent("on"+type,handler);                 //IE中的事件处理程序
			}
			else {
				element["on"+type] = handler;                            //DOM 0级事件处理程序
			}
		},

		removeHandler : function(element,type,handler) {
			if (element.removeEventListener) {
				element.removeEventListener(type,handler,false);
			}
			else if (element.detachEvent) {
				element.detachEvent("on"+type,handler);
			}
			else {
				element["on"+type] = null;
			}
		},

		getEvent : function(event) {
			return event ? event : window.event;      //DOM中的事件对象，与IE中的事件对象
		},

		getTarget : function(event) {
			return event.target || event.srcElement;
		},

		preventDefault : function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			}
			else {
				event.returnValue = false;
			}
		},

		stopPropagation: function(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			}
			else {
				event.cancelBubble = ture;
			}
		}
	};

