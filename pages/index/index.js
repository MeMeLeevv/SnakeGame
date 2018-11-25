var startX = 0,
  startY = 0,
  endX = 0,
  endY = 0,
  X = 0,
  Y = 0;
//蛇头的对象
var snakehead = {
  x: 0,
  y: 0,
  color: "#ff0000",
  w: 8,
  h: 8
}
var conflictBool = true;
var game = true;
var grade=0;
var requestAF;
var snakeBodys = [];
var foods = [];
var windowWidth = 0;
var windowHeight = 0;
var bodyNums = 0;
var direction = "right";
Page({
  /*data:{
    grades:0
  },*/
  canvasStart: function(e) {
    startX = e.touches[0].x;
    startY = e.touches[0].y;
  },
  canvasMove: function(e) {
    endX = e.touches[0].x;
    endY = e.touches[0].y;
    X = endX - startX;
    Y = endY - startY;
    console.log(X);
    console.log(Y);
    if (Math.abs(X) > Math.abs(Y) && X > 0) {
      direction = "right";
    } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
      direction = "left";
    } else if (Math.abs(X) < Math.abs(Y) && Y > 0) {
      direction = "bottom";
    } else if (Math.abs(X) < Math.abs(Y) && Y < 0) {
      direction = "top";
    }
  },
  stop: function (e) {
   stopp();
  },
  onReady: function() {
    var that=this;
    var context = wx.createContext();
    var frameNum = 0;

    function draw(obj) {
      context.setFillStyle(obj.color);
      context.beginPath();
      context.rect(obj.x, obj.y, obj.w, obj.h);
      context.closePath();
      context.fill();
    }
    function stopp(){
      game = false;
      wx.showModal({
        title: 'STOPING,WHETHER TO CANCEL?',
        content: '是否取消暂停',
        success: function (res) {
          if (res.confirm) {
            game = true;
            animate();
          } else {
            game = false;
          }
        }

      })
    }



    //碰撞函数
    function conflict(obj1, obj2) {
      var l1 = obj1.x;
      var r1 = obj1.x + obj1.w;
      var t1 = obj1.y;
      var b1 = obj1.y + obj1.h;

      var l2 = obj2.x;
      var r2 = obj2.x + obj2.w;
      var t2 = obj2.y;
      var b2 = obj2.y + obj2.h;
      if (r1 > l2 && b1 > t2 && l1 < r2 && t1 < b2) {
        return true;
      } else {
        return false;
      }

    }
    function init(){
      snakehead.x=0;
      snakehead.y=0;
      snakeBodys.splice(0,snakeBodys.length);
      foods.splice(0,foods.length);
      direction="right";

      for(var i = 0; i < 20; i++) {
      var foodObj = new food();
      foods.push(foodObj);
}
    }



    function animate() {
      //init();
      if (game) {
        frameNum++;
        if (frameNum % 10 == 0) {


          //向蛇身体数组增加上一个数据，也就是还没即时判断方向前的数据
          snakeBodys.unshift({ //作用于数组开头处
            x: snakehead.x,
            y: snakehead.y,
            w: snakehead.w,
            h: snakehead.h,
            color: "#00ff00",
            bodyNums: bodyNums++
          });

          if (snakeBodys.length > 4) {
            if (conflictBool) {
              snakeBodys.pop(); //作用于数组结尾处
              //console.log(snakeBodys);
            } else {
              conflictBool = true;
            }

          }

          if (snakehead.x < 0 || (snakehead.x + snakehead.w) > windowWidth || snakehead.y < 0 || (snakehead.y + snakehead.h) > windowHeight) {
            //console.log("hahaha");
            //window.cancelAnimationFrame(requestAF);
            wx.showModal({
              title: 'SCORES='+grade+'points           snakeBody`s length='+snakeBodys.length+'',
              content:'GAMEOVER,PLEASE START AGAIN',
              success:function(res){
                if(res.confirm){
                  init();
                  animate();
                }else{
                  init();
                  wx.navigateBack({
                    delta:1
                  })
                }

              }
            })
            return;
            game = false;

            //return;
          }
         /* if (snakehead.x <= 0 && direction=== "left"){
            snakehead.x=0;
            game = false;
          }
          if ((snakehead.x + snakehead.w) >= windowWidth && direction === "right"){
            snakehead.x = windowWidth - snakehead.w;
            game = false;
          }
          if (snakehead.y <= 0 && direction === "top"){
            snakehead.y = 0;
            game = false;
          }
          if ((snakehead.y + snakehead.h) >= windowHeight && direction === "bottom"){
            snakehead.y = windowHeight - snakehead.h;
            game = false;
          }*/

         // if(game){
          switch (direction) {
            case "left":
              snakehead.x -= snakehead.w;
              break;
            case "right":
              snakehead.x += snakehead.w;
              break;
            case "bottom":
              snakehead.y += snakehead.h;
              break;
            case "top":
              snakehead.y -= snakehead.h;
              break;
             //  }
          }


        }
        //绘制蛇头
        draw(snakehead);

        for (var i = 0; i < snakeBodys.length; i++) {
          draw(snakeBodys[i]);
        }

        //绘制食物及检测碰撞
        for (var i = 0; i < foods.length; i++) {
          draw(foods[i]);
          if (conflict(snakehead, foods[i])) {
            conflictBool = false;
            wx.showToast({
              title: '+' + 1 + 'point',
              icon: 'success',
              duration: 500
            })
            grade++;
            
           /* that.setData({
              grades:that.data.grades++
            })
            console.log("grades==" + that.data.grades);*/
            foods[i].reset();

          }

        }
        wx.drawCanvas({
          canvasId: "firstCanvas",
          actions: context.getActions() // 获取绘图动作数组
        })

        requestAF = requestAnimationFrame(animate);
      }
    } //animate()

    function rand(min, max) {
      return parseInt(Math.random() * (max - min) + min);
    }

    //构造食物对象
    function food() {
      this.x = rand(0, windowWidth-snakehead.w);
      this.y = rand(0, windowHeight-snakehead.w);
      this.w = snakehead.w;
      this.h = snakehead.w;
      this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
      this.reset = function() {
        this.x = rand(0, windowWidth - snakehead.w);
        this.y = rand(0, windowHeight - snakehead.w);
        this.color = "rgb(" + rand(0, 255) + "," + rand(0, 255) + "," + rand(0, 255) + ")";
      }

    }

    wx.getSystemInfo({
      success: function(res) {
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;
        for (var i = 0; i < 20; i++) {
          var foodObj = new food();
          foods.push(foodObj);
        }

        
        console.log(foods);
      }

    })
    wx.showModal({
      title: 'Please Enjoying The Game!',
      content: 'EVERY FRUITS GETS ONE POINT',
      success:function(res){
        if(res.confirm){
          init();
          animate();
        }else{
          init();
          wx.navigateBack({
            delta:1
          })
        }
      }
    })

  } //onReady()

})