var colorArr = [

	"#f17c67",
	"#376956",
	"#495A80",
	"#E9F01D",
	"#9966CC",
	"#00FF80",
	"#BDB76A",
	"#FD5B78",
	"#FE4C40",
	"#2a5caa",
	"#33cc33"
];

var img = new Image();
img.src = "./preloadsheet.png";

// 随机颜色
function randomColor() {

	return colorArr[Math.floor(Math.random() * colorArr.length)];
}

/** @type {HTMLCanvasElement} */
// canvas画布
var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");

var game = {

	stageW: 320,
	stageH: 540,
	score: 0,
	center: {
		x: 320 / 2,
		y: 540 / 2
	}
};
// 设置画布大小
canvas.width = game.stageW;
canvas.height = game.stageH;

// 绘制背景
function drawBg() {

	ctx.fillStyle = "#eaeaea";
	ctx.fillRect(0, 0, game.stageW, game.stageH);
}

// 绘制小球
// x,y=圆心坐标 r=半径 color=颜色 fill=是否填充
function drawCircle(x, y, r, color, fill) {
	// 开始绘制
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.closePath();
	if (fill) {

		ctx.fillStyle = color;
		ctx.fill();
	} else {

		ctx.strokeStyle = color;
		ctx.stroke();
	}
}
// 准备场景
var a = {
	r: 50,
	maxR: 50,
	minR: 40,
	zoom: false,
	color: randomColor()
};
var b = {
	r: 30,
	maxR: 30,
	minR: 20,
	zoom: false,
	color: randomColor()
};

function updateZoom(obj) {

	if (!obj.zoom) {

		obj.r -= 0.3;
		obj.zoom = obj.r <= obj.minR ? true : false;
	} else {

		obj.r += 0.3;
		obj.zoom = obj.r >= obj.maxR ? false : true;
	}
}
// 开始按钮参数
var start_btn_png = {

	name: "start_btn_png",
	w: (game.stageW * 2) / 4,
	h: ((file["start_btn_png"].h / file["start_btn_png"].w) * (game.stageW * 2)) / 4,
	x: (game.stageW - (game.stageW * 2) / 4) / 2,
	y: game.stageH / 2 + 50
};
// 结束按钮参数
var again_btn_png = {

	name: "again_btn_png",
	w: (game.stageW * 2) / 4,
	h: ((file["again_btn_png"].h / file["again_btn_png"].w) * (game.stageW * 2)) / 4,
	x: (game.stageW - (game.stageW * 2) / 4) / 2,
	y: game.stageH / 2 + 50
};
// 画出按钮
function drawBtn(obj) {
	// console.log(file[btn]);
	ctx.drawImage(
		img,
		file[obj.name].x,
		file[obj.name].y,
		file[obj.name].w,
		file[obj.name].h,
		obj.x,
		obj.y,
		obj.w,
		obj.h
	);
}
// 游戏准备
function ready() {
	// 更新两个小球 半径
	updateZoom(a);
	updateZoom(b);
	// 画出两个小球
	drawCircle(game.center.x - a.minR, game.center.y - a.maxR, a.r, a.color, true);
	drawCircle(game.center.x + b.minR, game.center.y - b.maxR, b.r, b.color, true);
	// 画出开始按钮
	drawBtn(start_btn_png);
	// 画出结束按钮
	// drawBtn(again_btn_png);
}
// 球构造器
function Boll(m, n) {

	this.r = randomNum(m, n);
	this.color = randomColor();
	this.over = false;
}
// 球原始位置生成
Boll.prototype.generateCoord = function() {

	this.x = -this.r;
	// 随机数代表方向
	var num = randomNum(0, 3);
	switch (num) {

		case 0:
			// 从上面
			this.x = randomNum(-this.r, game.stageW + this.r);
			this.y = -this.r;
			break;
		case 1:
			// 从右面
			this.x = game.stageW + this.r;
			this.y = randomNum(-this.r, game.stageH + this.r);
			break;
		case 2:
			// 从下面
			this.x = randomNum(-this.r, game.stageW + this.r);
			this.y = game.stageH + this.r;
			break;
		case 3:
			this.x = -this.r;
			this.y = randomNum(-this.r, game.stageH + this.r);
			break;
	}
};
var bollspeed = 1;
// 球生成速度
Boll.prototype.generateSpeed = function() {
	
	if (this.x > game.stageW) {
		
		this.sx = -randomFloor(0, bollspeed);
		this.sy = randomFloor(-bollspeed, bollspeed);
	}
	if (this.x < 0) {
		
		this.sx = randomFloor(0, bollspeed);
		this.sy = randomFloor(-bollspeed, bollspeed);
	}
	if (this.y > game.stageH) {
		
		this.sx = randomFloor(-bollspeed, bollspeed);
		this.sy = -randomFloor(0, bollspeed);
	}
	if (this.y < 0) {
		
		this.sx = randomFloor(-bollspeed, bollspeed);
		this.sy = randomFloor(0, bollspeed);
	}
};
// 球移动
Boll.prototype.move = function() {

	this.x = this.x + this.sx;
	this.y = this.y + this.sy;
};
// 球超出
Boll.prototype.checkOver = function() {
	var rightOver = this.x > game.stageW + this.r;
	var leftOver = this.x < -this.r;
	var bottomOver = this.y > game.stageH + this.r;
	var topOver = this.y < -this.r;
	this.over = rightOver || leftOver || topOver || bottomOver;
};
// 我方球构造
function OurBoll() {

	this.x = game.center.x;
	this.y = game.center.y;
	this.r = 5;
	this.color = "#333";
	this.loop = {
		r: this.r,
		minR: this.r,
		maxR: this.r + 10,
		color: randomColor(),
		zoom: true
	};
}
// 创建我方小球
var o = new OurBoll();
var segements = [];
var frames = 0;
var score = 0;

function randomNum(m, n) {

	return Math.round(Math.random() * (n - m)) + m;
}

function randomFloor(m, n) {

	return Math.random() * (n - m) + m;
}

function checkCrash(boll) {
	// 勾股定理 毕达哥拉斯定理
	var s = Math.sqrt((boll.x - o.x) * (boll.x - o.x) + (boll.y - o.y) * (boll.y - o.y));

	if (s < boll.r + o.r && !boll.over) {
		// console.log("11");
		return true;
	}
}
// 测试构造器
// var x = new Boll(5, 0);
// x.generateCoord();
// x.generateSpeed()
// drawCircle(x.x, x.y, x.r, x.color, true);

// 游戏开始
function start() {
	// console.log("游戏开始");
	// 增加帧数
	frames++;
	// 更新我方小球 圆环动画
	updateZoom(o.loop);
	// 画出实心球 和 圆环
	drawCircle(o.x, o.y, o.r, o.color, true);
	// drawCircle(o.x, o.y, o.loop.r, o.loop.color, false);
	// 生成新球
	if (!(frames % 10)) {

		var newBoll = new Boll(o.r - 4, o.r + 20);
		newBoll.generateCoord();
		newBoll.generateSpeed();

		segements.push(newBoll);
	}
	// 遍历所有敌方
	segements.forEach(function(boll, index) {
		// 移动所有 小球
		boll.move();
		// 根据新位置画
		drawCircle(boll.x, boll.y, boll.r, boll.color, true);
		// 检测碰撞
		if (checkCrash(boll)) {
			// 判断半径
			if (boll.r > o.r) {
				// 游戏结束
				gameover();
			} else {
				// 标记死亡（超出）
				boll.die = true;
				// console.log(boll);
				// 我方球球半径增加 圆环半径也要增加
				var addR = 0.5;
				o.r += addR;
				o.loop.r += addR;
				o.loop.minR += addR;
				o.loop.maxR += addR;
				// 增加score
				score++;
			}
		}
		// 检测标记超出
		boll.checkOver();
	});
	// 删除数组里面已经超出的球
	segements.forEach(function(boll, index) {

		if (boll.over || boll.die) {

			segements.splice(index, 1);
			// console.log("shanchu");
		}
	});
	// 更新得分
	ctx.font = "30px Arial";
	ctx.fillStyle = "#333";
	ctx.fillText(score, 10, 50);
}

function gameover() {

	clearInterval(id);
	if (localStorage.score) {
		// 结束画面
		drawBtn(again_btn_png);

		var oldArr = JSON.parse(localStorage.score);
		// 循环数组
		for (var i = 0; i < oldArr.length; i++) {
			// 检查每一个得分数组对象
			for (key in oldArr[i]) {
				// console.log(key);
				if (key == score) {

					oldArr[i][key]++;
					localStorage.score = JSON.stringify(oldArr);
					return;
				}
			}
		}

		// var newScore = {};
		// newScore[score] = 1;
		// oldArr.push(newScore);
		// // 数据按照对象键名排序
		// oldArr.sort(function(a, b) {

		// 	for (keya in a) {

		// 		for (keyb in b) {

		// 			return Number(keya) - Number(keyb);
		// 		}
		// 	}
		// });
		// console.log(oldArr);
		// 新数组写入本地存储
		// localStorage.score = JSON.stringify(oldArr);
		// 计算超过百分比
	} else {
		// console.log("第一次");
		var newScore = {};
		newScore[score] = 1;
		localStorage.score = JSON.stringify(newScore);
	}
}
// 游戏主体
var id = setInterval(function() {
	// 每一帧开始 都清空画布
	ctx.clearRect(0, 0, game.stageW, game.stageH);
	// 画出背景
	drawBg();
	// 判断游戏是否已经开始
	if (!game.start) {
		// 准备界面
		ready()
	} else {
		// 开始游戏
		start();
	}
}, 30);

canvas.onclick = function(event) {
	// console.log(event);
	// 开始
	var xCrash = event.offsetX >= start_btn_png.x && event.offsetX <= start_btn_png.x + start_btn_png.w;
	var yCrash = event.offsetY >= start_btn_png.y && event.offsetY <= start_btn_png.y + start_btn_png.h;
	// 结束
	var xend = event.offsetX >= again_btn_png.x && event.offsetX <= again_btn_png.x + again_btn_png.w;
	var yend = event.offsetY >= again_btn_png.y && event.offsetY <= again_btn_png.y + again_btn_png.h;
	

	if (xCrash && yCrash) {
		// console.log("xxx");
		// 开始游戏
		game.start = true;
	}else if(xend && yend){
		// console.log("xxx");
		// 重新游戏
		// var anew = again_btn_png;
		// // var anew = ready();
		// anew.onclick = function(){
		// 	// 清空
		// 	ready();
		// }
		
		// ready();
	}
	
	// 点击小球才开始 监听鼠标移动 PC
	if (Math.abs(event.offsetX - game.center.x) < 5 && Math.abs(event.offsetY - game.center.y) < 5) {

		canvas.onmousemove = function(event) {
			// console.log(event.offsetX,event.offsetY);
			// 根据鼠标移动位置 更新我方 位置
			o.x = event.offsetX;
			o.y = event.offsetY;
		};
	}
	if (navigator.maxTouchPoints) {

		canvas.ontouchmove = function(event) {
			// console.log(event);
			o.x = event.touches[0].pageX;
			o.y = event.touches[0].pageY;
		};
	}
}

