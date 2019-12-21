function setRem() {
	var standardWidth = 375;
	var innerW = innerWidth;
	var fontSize = innerWidth / 375 * 100;
	var style = document.createElement("style");
	style.innerHTML = 'html{font-size: ' + (innerW >= 1200 ? 100 : fontSize) + 'px;}';
	style.setAttribute('id', 'stylerem');
	document.getElementsByTagName('head')[0].appendChild(style);
}

setRem();

window.onresize = function() {
	var stylerem = document.getElementById('stylerem');
	if (stylerem) {
		stylerem.remove();
	}
	setRem();
}
