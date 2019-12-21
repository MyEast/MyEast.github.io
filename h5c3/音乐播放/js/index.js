window.onload = function() {

	function getid(id) {
		// 获取id
		return document.getElementById(id);
	}
	// 获取的id
	var audio = getid("audio");
	var playLeft = getid("play-left");
	var playPlay = getid("play-play");
	var playRight = getid("play-right");
	var strip = getid("strip");
	var activate = getid("activate");
	var slider = getid("slider");
	var bind = getid("bind");
	var time = getid("time");

	// 判断鼠标按下
	var isp = false;

	//音频初始时长为0
	var duration = 0;

	//音频可以播放事件
	audio.oncanplay = function() {
		//获取音频总时长
		duration = this.duration;
		// console.log("duration =>",duration);
	}

	// console.log("当前播放时间 =>",audio.currentTime);
	// 是否可以修改当前播放时间
	// audio.currentTime = 30;
	// audio.volume = 0.5;
	// console.log("音频音量 =>",audio.volume);

	// 时间格式
	function foTime(t) {
		//不足一分钟按秒算，不足十补零
		var min = Math.floor(t / 60);
		min = min >= 10 ? min : '0' + min;

		var sec = Math.round(t % 60);
		sec = sec >= 10 ? sec : '0' + sec;

		return min + ":" + sec;
	}
	// 监听音频实时播放事件
	audio.ontimeupdate = function() {

		if (isp) {

			// console.log("按下拖动");
			return;
		}
		//格式化当前播放时间 为0
		var c = foTime(this.currentTime);
		//格式化音频总时间 为0
		var d = foTime(duration);

		time.textContent = c + '/' + d;
		// console.log("time =>",time);

		//根据音频播放进度调整滑块的位置
		var per = this.currentTime / duration;
		// console.log("per =>",per);

		slider.style.left = per * (serWidth - sliWidth) + "px";

		activate.style.width = per * (serWidth - sliWidth) + sliWidth / 2 + "px";
	}

	audio.onplay = function() {
		// console.log("播放音乐");
		// console.log("播放音乐的时长 =>",duration);

		var t = foTime(duration);
		time.textContent = '00:00/' + t;
	}
	//音频停止事件
	audio.onpause = function() {

		// console.log("音频停止");
	}
	//监听音频是否播放完成
	audio.onended = function() {

		// console.log("音频播放完成");
		playPlay.setAttribute("name", 0);
		playPlay.style.backgroundImage = "url(images/play.png)";
	}

	playPlay.onclick = function() {
		//name = 0: 停止，name = 1: 播放
		var playName = this.getAttribute("name");
		// console.log("playName =>",playName);

		if (playName == 0) {
			//播放音频
			audio.play();
			this.setAttribute("name", 1);
			this.style.backgroundImage = "url(images/suspend.png)";
		} else {
			//停止音频
			audio.pause();
			this.setAttribute("name", 0);
			this.style.backgroundImage = "url(images/play.png)";
		}
	}

	//进度条
	var serWidth = parseFloat(getComputedStyle(strip).width);
	// console.log("总进度条长度 =>",serWidth);

	var sliWidth = parseFloat(getComputedStyle(slider).width);
	// console.log("当前进度条长度 =>",sliWidth);

	function move(e) {
		//获取相对于当前元素的鼠标坐标
		// console.log(111111);
		var x = e.offsetX;
		// console.log("x",x);
		//滑块移动的left
		var left = x - sliWidth / 2;
		// console.log("left",left);
		//滑块最小移动距离
		var minLeft = 0
		// console.log("minLeft",minLeft);
		//滑块最大移动距离
		var maxLeft = serWidth - sliWidth;
		// console.log("maxLeft",maxLeft);

		//控制滑块的值 在 最小移动距离 和 最大移动距离 之间
		left = left <= minLeft ? minLeft : left >= maxLeft ? maxLeft : left;

		//滑块移动
		slider.style.left = left + "px";
		// console.log("slider",slider);
		//激活进度条
		activate.style.width = x + "px";
		// console.log("activate",activate);
		//修改音频播放进度
		if (isp && !ism) {
			// console.log(343443);
			var per = left / maxLeft;
			audio.currentTime = per * duration;
			audio.play();
			playPlay.setAttribute("name", 1);
			playPlay.style.backgroundImage = "url(images/suspend.png)";
		}

	}

	// 鼠标按下
	var ism = false;

	bind.onmousedown = function(e) {

		isp = true;
		console.log("鼠标按下");
		move(e);
		// 鼠标移动
		this.onmousemove = function(e) {

			ism = true;
			move(e);
		}
	}
	// 鼠标松开
	bind.onmouseup = function(e) {

		// console.log("鼠标松开");

		this.onmousemove = null;
		ism = false;
		move(e);
		isp = false;
	}
	// 鼠标离开
	bind.onmouseleave = function() {

		// console.log("鼠标离开");
		this.onmousemove = null;
	}

	// var audios = getid("audio")[0];
	// var curr = 0;
	playLeft.onclick = function() {

		console.log(11);


	}

	playRight.onclick = function() {

		console.log(22);
	}

}
