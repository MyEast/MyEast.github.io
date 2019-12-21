// 获取开始按钮对象
var begin = query("#begin");
// 开始界面
var start = query("#start");
// 游戏界面
var game = query("#game");
// 飞机移动范围
var layer = query("#layer");
// 分数值
var number = query("#number");
// 我方飞机范围宽度和高度
var myplane = query("#myplane");
var myplaneWidth = parseInt(getStyle(myplane,"width"));
var myplaneHeight = parseInt(getStyle(myplane,"height"));
// 界面范围宽度和高度
var plane = query("#plane");
var planeWidth = parseInt(getStyle(plane,"width"));
var planeHeight = parseInt(getStyle(plane,"height"));

// 生成子弹实例定时器
var bulletTimer = null;
// 子弹移动定时器
var moveBulletTiemr = null;
// 创建敌机定时器
var enemyPlaneTimer = null;
// 敌机移动定时器
var moveEnemyPlaneTimer = null;
// 背景定时器
var moveBgTimer = null;
// 敌机创建时间
var EnemyPlanetimer = 1500;

// 我方飞机移动效果
function myPlane(e){
	// 获取鼠标坐标
	var x = e.offsetX;
	var y = e.offsetY;
	
	// 我方飞机左右移动范围
	var maxX = planeWidth - myplaneWidth;
	var minX = 0;
	
	// 我方飞机上下移动范围
	var maxY = planeHeight - myplaneHeight;
	var minY = 0;
	
	// 我方飞机移动坐标
	var x0 = x - myplaneWidth / 2;
	var y0 = y - myplaneHeight / 2;
	
	// 控制我方飞机移动范围
	x0 = x0 > maxX ? maxX : x0 < minX ? minX : x0;
	y0 = y0 > maxY ? maxY : y0 < minY ? minY : y0;
	
	myplane.style.left = x0 +"px";
	myplane.style.top = y0 + "px";
	
}

// 子弹类
function Bullet(){
	// 子弹宽度高度
	this.bulletWidth = 6;
	this.bulletHeight = 14;
	
	// 子弹坐标
	this.bulletX = 0;
	this.bulletY = 0;
	
	// 子弹图片
	this.bulletSrc = "./images/bullet.png";
	
	// DOM对象
	this.currentBullet = null;
	
}
// 创建子弹
Bullet.prototype.createBullet = function(){
	// 创建子弹图片元素
	this.currentBullet = document.createElement("img");
	
	// 链接子弹图片资源
	this.currentBullet.src = this.bulletSrc;
	
	this.currentBullet.style.position = "absolute";
	this.currentBullet.style.zIndex = 2;
	this.currentBullet.style.width = this.bulletWidth;
	this.currentBullet.style.height = this.bulletHeight;
	
	// 获取我方飞机坐标
	var myplaneX = parseInt(myplane.style.left);
	var myplaneY = parseInt(myplane.style.top);
	
	// 生成子弹坐标
	this.bulletX = myplaneX + myplaneWidth / 2;
	this.bulletY = myplaneY - this.bulletHeight;
	
	// 设置子弹坐标
	this.currentBullet.style.left = this.bulletX + 'px';
	this.currentBullet.style.top = this.bulletY + 'px';
	
	// 将子弹DOM添加在游戏几面元素game中
	game.appendChild(this.currentBullet);
}

// 移动子弹
Bullet.prototype.moveBullet = function(bullets,index){
	// 每一步移动两个像素
	this.bulletY -= 2;
	
	if(this.bulletY <=0){
		// 移除子弹DOM元素
		this.currentBullet.remove();
		// 从子弹数组中移除当前子弹对象
		bullets.splice(index,1);
	}else{
		this.currentBullet.style.top = this.bulletY + 'px';
	}
}

// 子弹与敌机碰撞
Bullet.prototype.shootEnemyPlane = function(bullets,enemyPlanes,index){
	// 当前对象子弹和遍历敌机判断
	for(var i=0;i<enemyPlanes.length;i++){
		// 子弹碰撞
		if(this.bulletX >= enemyPlanes[i].enemyPlaneX - this.bulletWidth
			&& this.bulletX <= enemyPlanes[i].enemyPlaneX + enemyPlanes[i].enemyPlaneWidth
			&& this.bulletY >= enemyPlanes[i].enemyPlaneY - this.bulletHeight
			&& this.bulletY <= enemyPlanes[i].enemyPlaneY + enemyPlanes[i].enemyPlaneHeight
		){
			// 减少敌机的血量
			enemyPlanes[i].enemyPlaneBlood -= 1;
			// 判断血量为0,需要移除敌机DOM,数组里面对象,显示爆炸效果
			if(enemyPlanes[i].enemyPlaneBlood <= 0){
				
				number.innerText = parseInt(number.innerText) + enemyPlanes[i].enemyPlaneNumber;
				// 创建敌机爆炸图
				var boomEnemyPlane = document.createElement("img");
				boomEnemyPlane.src = enemyPlanes[i].enemyPlaneDieSrc;
				boomEnemyPlane.style.width = enemyPlanes[i].enemyPlaneWidth + "px";
				boomEnemyPlane.style.height = enemyPlanes[i].enemyPlaneHeight + "px";
				
				boomEnemyPlane.style.position = "absolute";
				boomEnemyPlane.style.zIndex = 3;
				
				boomEnemyPlane.style.left = enemyPlanes[i].enemyPlaneX + "px";
				boomEnemyPlane.style.top = enemyPlanes[i].enemyPlaneY + "px";
				
				// 移除敌机DOM
				enemyPlanes[i].currentEnemyPlane.remove();
				// 从敌机中移除数组
				enemyPlanes.splice(i,1);
				
				game.appendChild(boomEnemyPlane);
				
				// 定时400毫秒后清除爆炸图片
				(function(ele){
					setTimeout(function(){
						ele.remove();
					},400);
				}(boomEnemyPlane))
			}
			// 移除碰撞后子弹
			this.currentBullet.remove();
			// 从数组中移除掉子弹
			bullets.splice(index,1);
		}
	}
}

// 清除子弹
Bullet.prototype.removeBullet = function(){
	this.currentBullet.remove();
}

// 保存子弹数组
var bullets = [];
var bullet;

// 生产子弹
function createEveruBullet(){
	// 每隔多少毫秒创建一颗子弹
	bulletTimer = setInterval(function(){
		// 调用子弹类
		bullet = new Bullet();
		// 调用创建子弹方法
		bullet.createBullet();
		// 保存子弹数组
		bullets.push(bullet);
	},100);
}

// 移动每一颗子弹
function moveEveryBullet(){
	
	moveBulletTiemr =setInterval(function(){
		for(var i=0;i<bullets.length;i++){
			// 每颗子弹实例
			bullets[i].moveBullet(bullets,i);
			// 如果单签子弹不存在,拦截子弹碰撞
			if(bullets[i] == undefined){return;}
			// 存在敌机,需要判断子弹是否碰撞敌机
			bullets[i].shootEnemyPlane(bullets,enemyPlanes,i);
		}
	},5)
}

// 敌机数据
var enemy = [
	{img:"./images/enemy1.png",dieImg:"./images/enemy1b.gif",width:34,height:24,blood:1},
	{img:"./images/enemy2.png",dieImg:"./images/enemy2b.gif",width:46,height:60,blood:2},
	{img:"./images/enemy3.png",dieImg:"./images/enemy3b.gif",width:110,height:164,blood:3},
];
// 构造敌机类
function EnemyPlane(){
	//根据敌机数据创建相应敌机
	var emy =null;
	// 0-0.5生成小型敌机
	// 0.5-0.9 生成中型敌机
	// 0.9-1 生成大型敌机
	var random = Math.random();
	if(random <=0.5){
		emy = enemy[0];//小型敌机
	}else if(random <= 0.9){
		emy = enemy[1];//中型敌机
	}else{
		emy = enemy[2];//大型敌机
	}
	// 敌机宽度高度
	this.enemyPlaneWidth = emy.width;
	this.enemyPlaneHeight = emy.height;
	// 随机生成敌机横向坐标,纵向坐标
	this.enemyPlaneX = Math.random() * (planeWidth - this.enemyPlaneWidth);
	this.enemyPlaneY = -this.enemyPlaneHeight;
	// 敌机图片路径
	this.enemyPlaneSrc = emy.img;
	// 敌机爆炸图片
	this.enemyPlaneDieSrc = emy.dieImg;
	// 敌机血量
	this.enemyPlaneBlood = emy.blood;
	// 敌机分数
	this.enemyPlaneNumber = emy.blood *100;
	// 敌机DOM元素
	this.currentEnemyPlane = null;
	
}
// 创建敌机
EnemyPlane.prototype.createEnemyPlane = function(){
	// 创建DOM对象
	this.currentEnemyPlane = document.createElement("img");
	this.currentEnemyPlane.src = this.enemyPlaneSrc;
	this.currentEnemyPlane.style.width = this.enemyPlaneWidth + "px";
	this.currentEnemyPlane.style.height = this.enemyPlaneHeight + "px";
	
	this.currentEnemyPlane.style.position = "absolute";
	this.currentEnemyPlane.style.zIndex = 3;
	
	this.currentEnemyPlane.style.left = this.enemyPlaneX + "px";
	this.currentEnemyPlane.style.top = this.enemyPlaneY + "px";
	
	game.appendChild(this.currentEnemyPlane);
	
}

// 移动敌机
EnemyPlane.prototype.moveEnemyPlane = function(enemyPlanes,index){
	// 敌机y轴添加两个像素
	this.enemyPlaneY +=2;
	
	if(this.enemyPlaneY >=planeHeight + this.enemyPlaneHeight){
		// 移除敌机DOM
		this.currentEnemyPlane.remove();
		// 从敌机数组中删除当前对象
		enemyPlanes.splice(index,1);
	}else{
		this.currentEnemyPlane.style.top = this.enemyPlaneY +"px";
	}
}
// 清除敌机
EnemyPlane.prototype.removeEnemyPlane = function(){
	this.currentEnemyPlane.remove();
}
// 保存敌机实例数组
var enemyPlanes = [];
var enemyPlane;
// 创建每一台敌机
function createEveryEnemyPlane(){
	enemyPlaneTimer = setInterval(function(){
		// 创建敌机
		enemyPlane = new EnemyPlane();
		// 创建DOM对象
		enemyPlane.createEnemyPlane();
		// 把敌机保存数组中
		enemyPlanes.push(enemyPlane);
	},EnemyPlanetimer)
}

// 移动每一台敌机位置
function moveEveryEnemyPlane(){
	moveEnemyPlaneTimer = setInterval(function(){
		// 获取我方飞机坐标
		var myplaneX = parseInt(myplane.style.left);
		var myplaneY = parseInt(myplane.style.top);
		
		for(var i=0;i<enemyPlanes.length;i++){
			// 调用敌机自身移动方法
			enemyPlanes[i].moveEnemyPlane(enemyPlanes,i);
			// 判断敌机是否碰撞到我方飞机
			if(enemyPlanes[i].enemyPlaneX >=myplaneX - enemyPlanes[i].enemyPlaneWidth
			&& enemyPlanes[i].enemyPlaneX <=myplaneX + myplaneWidth
			&& enemyPlanes[i].enemyPlaneY >=myplaneY - enemyPlanes[i].enemyPlaneHeight
			&& enemyPlanes[i].enemyPlaneY <=myplaneY + myplaneHeight
			){
				// console.log("碰撞");
				myplane.querySelector("img").src = "./images/planeb.gif";
				// 清除定时器
				clearInterval(bulletTimer);
				clearInterval(moveBulletTiemr);
				clearInterval(enemyPlaneTimer);
				clearInterval(moveEnemyPlaneTimer);
				clearInterval(moveBgTimer);
				bulletTimer = moveBulletTiemr = enemyPlaneTimer = moveEnemyPlaneTimer =null;
				
				layer.onmousemove = null;
				// console.log("游戏结束");
				// 清空数组
				for(var z=0;z<enemyPlanes.length;z++){
					enemyPlanes[z].removeEnemyPlane();
				}
				for(var w=0;w<bullets.length;w++){
					bullets[w].removeBullet();
				}
				
				bullets = [];
				enemyPlanes = [];
				
				// 结束游戏回到开始页面
				setTimeout(function(){
					myplane.querySelector("img").src = "./images/plane.gif";
					myplane.style.left = "0px";
					myplane.style.top = "607px";
					game.style.display = "none";
					start.style.display = "block";
				},2000)
			}
		}
	},20)
}

// 初始化游戏
function initGame(){
	// 游戏代码规则
	// 开始游戏的点击事件
	addEvent(begin,"click",function(){
		// 隐藏开始界面
		start.style.display = "none";
		// 显示游戏界面
		game.style.display = "block";
		
		// 开始游戏初始化对象
		// addEvent(layer,"mousemove",function(e){
			// 我方飞机
			// myPlane(e);
			
// 			var enemyplane = new Enemyplane();
// 			enemyplane.createEnemyplane();
		// })
		
		layer.onmousemove = function(e){
			// 我方飞机
			myPlane(e);
			// 计算敌机时间
			moveEnemyPlanetimer();
		}
		
		// 生产子弹
		createEveruBullet();
		// 移动子弹
		moveEveryBullet();
		// 生产敌机
		createEveryEnemyPlane();
		// 移动敌机
		moveEveryEnemyPlane();
		// 背景移动
		moveGameBg();
	})
}

// 页面加载,触发
window.onload = function(){
	// 初始化游戏
	initGame();
}

function moveGameBg(){
	// 获取背景所有元素、
	var bgs = document.getElementsByClassName("bg");
	
	// 开启定时器移动背景
	moveBgTimer = setInterval(function(){
		for(var i=0;i<bgs.length;i++){
			// 获取当前背景元素top
			var currentTop = parseInt(getStyle(bgs[i],"top"));
			// 每次移动两个像素
			currentTop += 2;
			
			// 如果当前top值超出游戏界面高度.将重置top值
			if(currentTop >= planeHeight){
				currentTop = -planeHeight;
			}
			bgs[i].style.top = currentTop + 'px';
		}
	},50)
}


function moveEnemyPlanetimer(){
	var ss = parseInt(parseInt(number.innerText) / 2000);
	
	if(ss == 0){
		EnemyPlanetimer = parseInt(1500 / 1);
	}else if(ss == 1){
		EnemyPlanetimer = parseInt(1500 / 2);
	}else if(ss == 2){
		EnemyPlanetimer = parseInt(1500 / 3);
	}else if(ss == 3){
		EnemyPlanetimer = parseInt(1500 / 4);
	}else{
		EnemyPlanetimer = parseInt(1500 / 5);
	}
	// console.log(EnemyPlanetimer);
}