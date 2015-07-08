/**
 * Created by mac on 15/7/6.
 */




//****************************************
// 控制全局的东西
(function(){

    // 游戏分为一些状态
    var State = {
        LOGINING : 0,  // 登陆中
        WAITING:1,  //  登陆后,由于没有对手所以进行等待
        READY:2,    //  进行匹配到对手
        GAMING : 3  // 游戏进行中
    };

    var app = {};
    app.canvas = null;
    app.context = null;
    app.room = null;
    app.state = State.LOGINING;  // 游戏状态

    //*********************************************
    // 计算  fps 需要使用的东西
    var tickCount = 0;
    var time = 0;
    var frameRate = 0;

    app.start = function(){

        time = Date.now();

        var self = this;
        window.addEventListener('keydown',function(event){
            var key = event.keyCode;
            if(key == keycode.LEFT){
                self.left();
            }else if(key == keycode.RIGHT){
                self.right();
            }else if(key == keycode.UP){
                self.up();
            }else if(key == keycode.DOWN){
                self.down();
            }

            //else if(key == keycode.SPACE){
            //    self.room.player.paused = !self.room.player.paused;
            //}
        });

        tick();
    };

    function tick(){

        var next = Date.now();
        ++tickCount;
        var passedTime = next - time;

        if(passedTime >= 1000){
            //  每秒多少帧
            frameRate = tickCount * 1000 / passedTime;
            time = next;
            tickCount = 0;
        }

        window.requestAnimationFrame(tick);
      //  app.logic();
        app.render();
    }

    //app.logic = function(){
    //    if(this.state == State.GAMING){
    //        this.room.player.update();
    //        this.room.opponent.update();
    //    }
    //};

    app.render = function(){

        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);

        if(this.state == State.WAITING){
            this.context.fillStyle = "#ff0000";
            this.context.font = 20 + "px Arial";
            this.context.fillText(this.room.player.name + "   正在等待玩家进入!!!",this.canvas.width/2 - 100,this.canvas.height/2);
        }else if(this.state == State.READY){
            // 双方都准备完毕
            this.context.fillStyle = '#ff0000';
            this.context.font = 20 + "px Arial";
            this.context.fillText(this.room.player.name+"     Ready!",10,100);
            this.context.fillText(this.room.opponent.name+"   Ready!",500,100);

        }else if(this.state == State.GAMING){

            this.context.font = 20 + "px Arial";

            // 绘制本体的东西
            this.room.player.drawMap(this.context);

            // 绘制中线
            this.room.player.drawMiddleLine(this.context);

            // 绘制对手的东西
            this.room.opponent.drawMap(this.context);
        }

        // draw fps
        this.context.fillStyle = "#000000";
        this.context.fillText("FPS:"+Math.floor(frameRate),0,25);
    };

    app.msgHandler = function(){

        var self = this;

        // onReady
        pomelo.on('onReady',function(data){
            console.log('receive onReady event');
            if(data.opponent.id != self.room.player.id){
                // 收都的是对手的信息
                self.room.opponent = new Player({
                    name:data.opponent.name,
                    id : data.opponent.id
                });

                self.state = State.READY;
                self.room.player.ready();
            }
        });

        // onUserLeave
        pomelo.on('onUserLeave',function(data){

        });

        // onGameStart
        pomelo.on('onGameStart',function(){
            console.log(">>>>>>>>> received onGameStart");
            self.state = State.GAMING;
        });

        //   onFallDown
        pomelo.on('onFallDown',function(data){

            var curBlock1 = new Block(data.curBlock1);  // 主机的
            var nextBlock1 = new Block(data.nextBlock1);
            var curBlock2 = new Block(data.curBlock2);
            var nextBlock2 = new Block(data.nextBlock2);

            if(self.room.player.host){
                self.room.player.curBlock = curBlock1;
                self.room.player.nextBlock = nextBlock1;
                self.room.player.speed = data.speed1;

                self.room.opponent.curBlock = curBlock2;
                self.room.opponent.nextBlock = nextBlock2;
                self.room.opponent.speed = data.speed2;
            }else{
                self.room.player.curBlock = curBlock2;
                self.room.player.nextBlock = nextBlock2;
                self.room.player.speed = data.speed2;

                self.room.opponent.curBlock = curBlock1;
                self.room.opponent.nextBlock = nextBlock1;
                self.room.opponent.speed = data.speed1;
            }

            //self.room.player.fallDown();
            //self.room.opponent.fallDown();
        });

        // onGameFail
        pomelo.on('onGameFail',function(data){

            if(data.code == consts.MESSAGE.RES){
                var playerId = data.player.id;
                if(self.room.player.id == playerId){
                    // 自己挂了
                    self.room.player.failed = true;
                }else{
                    // 别人挂了
                    self.room.opponent.failed = true;
                }
            }
        });


        // onMessage
        pomelo.on('onMessage',function(data){
            if(data.code == consts.MESSAGE.SYNC){
                var map1 = data.map1;
                var map2 = data.map2;
                var curBlock1 = new Block(data.curBlock1);  // 主机的
                var nextBlock1 = new Block(data.nextBlock1);
                var curBlock2 = new Block(data.curBlock2);
                var nextBlock2 = new Block(data.nextBlock2);

                // 进行同步内容
                if(self.room.player.host){
                    for(var i = 0; i < 20; ++i){
                        for(var j = 0; j < 10; ++j){
                            self.room.player.map[i][j].value = map1[i][j].value;
                            self.room.player.map[i][j].color = map1[i][j].color;

                            self.room.opponent.map[i][j].value = map2[i][j].value;
                            self.room.opponent.map[i][j].color = map2[i][j].color;
                        }
                    }
                    self.room.player.curBlock = curBlock1;
                    self.room.player.nextBlock = nextBlock1;
                    self.room.player.speed = data.speed1;

                    self.room.opponent.curBlock = curBlock2;
                    self.room.opponent.nextBlock = nextBlock2;
                    self.room.opponent.speed = data.speed2;
                }else{
                    for(var i = 0; i < 20; ++i){
                        for(var j = 0; j < 10; ++j){
                            self.room.player.map[i][j].value = map2[i][j].value;
                            self.room.player.map[i][j].color = map2[i][j].color;

                            self.room.opponent.map[i][j].value = map1[i][j].value;
                            self.room.opponent.map[i][j].color = map1[i][j].color;
                        }
                    }
                    self.room.player.curBlock = curBlock2;
                    self.room.player.nextBlock = nextBlock2;
                    self.room.player.speed = data.speed2;

                    self.room.opponent.curBlock = curBlock1;
                    self.room.opponent.nextBlock = nextBlock1;
                    self.room.opponent.speed = data.speed1;
                }


                //self.room.player.fallDown();
                //self.room.opponent.fallDown();
            }
        });
    };


    app.left = function(){
        // 告诉服务器需要左移动
        // 暂时先不考虑用户体验(本来可以先处理,再验证)

        var route = 'connector.entryHandler.left';
        var msg = {
            playerId:this.room.player.id,
            roomname : this.room.name
        };
        pomelo.request(route,msg,function(data){

        });
    };

    app.right = function(){
        var route = 'connector.entryHandler.right';
        var msg = {
            playerId:this.room.player.id,
            roomname : this.room.name
        };
        pomelo.request(route,msg,function(data){

        });
    };

    app.up = function(){

    };

    app.down = function(){

    };

    app.createCanvas = function(){
        $('#user').append('<canvas id="mycanvas" width="640px" height="480px" style="border: 1px solid"></canvas>');
        this.canvas = document.getElementById('mycanvas');
        this.context = this.canvas.getContext('2d');
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    };

    window.app = app;
    window.State = State;
})();