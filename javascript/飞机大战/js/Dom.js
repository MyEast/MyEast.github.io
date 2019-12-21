// 封装获取元素方法
function query(selector){
	// css选择器
	return document.querySelector(selector);
}

// 封装绑定事件方法(考虑兼容性)
function addEvent(element,type,fn){
		
	if(window.addEventListener){
		element.addEventListener(type,fn);
	}else{  //ie8以下浏览器绑定事件
		element.attachEvent("on"+type,fn);
	}
}

// 解决浏览器兼容内嵌式与外链式样式
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return window.getComputedStyle(obj,null)[attr];
	}
}