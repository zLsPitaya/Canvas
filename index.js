(function(global){
	var __INFO__ = {
        plug: "zlCanvas",    //调用插件的方法名
        varsion: "1.0.1",   //版本号
        author: "zL's Pitaya"   //作者
    };
    var defaults = {
    	ID : "MyCanvas",	//canvas对象的ID
    	WIDTH : document.documentElement.clientWidth,	//canvas对象的宽度，默认可视宽度
    	HEIGHT : document.documentElement.clientHeight,		//canvas对象的高度，默认可视高度
    	LINESTYLE : "rgba(255,255,255, 1)",		//线条的颜色样式	
    	ARCSTYLE : "rgba(255,255,255, 0.05)",	//圆的颜色样式
    	POINT : 32	//canvas对象中的随机产生的圆的个数
    }

    var PlugCode = function(options){
    	var settings = Object.assign({},defaults,options);
		var canvas = document.getElementById(settings.ID);
		canvas.width = settings.WIDTH;
		canvas.height = settings.HEIGHT;
		var context = canvas.getContext("2d");
		context.strokeStyle = settings.LINESTYLE;
		context.fillStyle = settings.ARCSTYLE;
		var circleArr = [];		//保存随机的圆位置信息

		//圆的构造器(x坐标, y坐标, r半径, moveX移动的X位置距离, moveY移动的Y位置距离)
		function Circle(x, y, r, moveX, moveY){	
			this.x = x;
			this.y = y;
			this.r = r;
			this.moveX = moveX;
			this.moveY = moveY;
		}

		//线条的构造器(x起始坐标, y起始坐标, _x终点坐标, _y终点坐标, opre透明度)
		function Line(x, y, _x, _y, opre){
			this.beginX = x;
			this.beginY = y;
			this.closeX = _x;
			this.closeY = _y;
			this.opre = opre;
		}

		//绘制圆
		function drawCircle(ctx, x, y, r, moveX, moveY){	
			var circle = new Circle(x, y, r, moveX, moveY);
			ctx.beginPath();
			ctx.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI);
			ctx.closePath();
			ctx.fill();		//绘制
			return circle;
		}

		//随机数
		function randNum(max, min){	
			var min = arguments[1] || 0;
			return Math.floor((max - min + 1)*Math.random() + min);
		}

		//绘制线条  绘制对象，指定的起始x,y坐标，绘制到结束点的x,y,透明度
		function drawLine(ctx, x, y, _x, _y, opre){
			var line = new Line(x, y, _x, _y, opre);
			ctx.beginPath();
			ctx.strokeStyle = 'rgba(255,255,255,'+ opre +')';
			ctx.moveTo(line.beginX, line.beginY);
			ctx.lineTo(line.closeX, line.closeY);
			ctx.closePath();
			ctx.stroke();	//保存绘制
			return line;
		}

		//调用绘制
		function draw(){
			//第二次绘制的时候，需要清空前一次的绘制
			context.clearRect(0, 0, canvas.width, canvas.height);
			for(var n = 0; n < settings.POINT; n++){
				drawCircle(context, circleArr[n].x, circleArr[n].y, circleArr[n].r);
			}
			for(var i = 0; i < settings.POINT; i++){
				for(var j = 0; j < settings.POINT; j++){
					if(i + j < settings.POINT){
						var A = Math.abs(circleArr[i+j].x - circleArr[i].x);	//用勾股定律设置线条透明度
						var B = Math.abs(circleArr[i+j].y - circleArr[i].y);
						var lineLength = Math.sqrt(A*A + B*B);
						var C = 1/lineLength*8 - 0.009;
						var lineOpacity = C > 0.2 ? 0.2 : C;
						if(lineOpacity > 0){
							drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity);
						}
					}
				}
			}
		}

		//初始化
		function init(){
			for(var i = 0; i < settings.POINT; i++){
				//绘制对象canvas、x、y、圆点半径、走动的间距x和y
				circleArr.push(drawCircle(context, randNum(settings.WIDTH), randNum(settings.HEIGHT), randNum(12,1), 
					randNum(10, -10)/settings.POINT, randNum(10, -10)/settings.POINT));	//绘制圆并保存圆的位置
			}
			draw();
		}

		window.onload = function(){
			init();
			setInterval(function(){
				for (var i = 0; i < settings.POINT; i++) {
					var cir = circleArr[i];
					cir.x += cir.moveX;	//加上x移动距离，再重新绘制实现移动
					cir.y += cir.moveY;	//加上y移动距离，再重新绘制实现移动
					if(cir.x > settings.WIDTH){
						cir.x = 0;
					}else if(cir.x < 0){
						cir.x = settings.WIDTH;
					}
					if(cir.y > settings.HEIGHT){
						cir.y = 0;
					}else if(cir.y < 0){
						cir.y = settings.HEIGHT;
					}
				}
				draw();
			}, 57);
		}
	}
	global[__INFO__.plug] = PlugCode;

})(typeof window === "undefined" ? window : this)
