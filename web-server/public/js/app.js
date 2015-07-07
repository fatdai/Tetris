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
        app.logic();
        app.render();
    }

    app.logic = function(){

    };

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

        // msg
        pomelo.on('onGameStart',function(){
            console.log(">>>>>>>>> received onGameStart");
            self.state = State.GAMING;
        });
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