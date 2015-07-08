/**
 * Created by mac on 15/7/6.
 */


(function () {

    var Player = function (opts) {
        opts = opts || {};
        this.name = opts.name || 'default name';
        this.id = opts.id || 0;
        this.map = [];
        this.host = opts.host || false;
        for (var i = 0; i < 20; ++i) {
            this.map[i] = [];
            for (var j = 0; j < 10; ++j) {
                this.map[i][j] = new Item({value:0});
            }
        }
        this.curBlock = null;
        this.nextBlock = null;
        this.speed = 1000;  // 下降1格的时间,默认是1000 ms
        this.time = 0;
        this.fd = false;
        this.paused = false;
        this.failed = false;
    };

    //Player.prototype.fallDown = function () {
    //    this.fd = true;
    //    this.time = Date.now();
    //};

    Player.prototype.canMoveDown = function () {

        var idx = this.curBlock.idx;
        var idy = this.curBlock.idy + 1;

        if(idy + this.curBlock.row > 20){
            return false;
        }

        for (var i = 0; i < this.curBlock.row; ++i) {
            for (var j = 0; j < this.curBlock.column; ++j) {
                if (this.curBlock.arr[j + i * this.curBlock.column] == 1 &&
                    this.map[idy + i][idx + j].value == 1) {
                    return false;
                }
            }
        }
        return true;
    };

    Player.prototype.put = function () {
        var idx = this.curBlock.idx;
        var idy = this.curBlock.idy;

        for (var i = 0; i < this.curBlock.row; ++i) {
            for (var j = 0; j < this.curBlock.column; ++j) {
                if(this.curBlock.arr[j + i * this.curBlock.column] == 1){
                    this.map[idy + i][idx + j].value = 1;
                    this.map[idy + i][idx + j].color = this.curBlock.color;
                }
            }
        }
    };

    Player.prototype.drawMap = function (context) {

        // 两种情况
        // 1. room.player.host is true   主机
        // 2. room.player.host is false  非主机

        context.save();

        if (app.room.player.host) {
            if (!this.host) {
                context.translate(app.canvas.width / 2, 0);
            }
        } else {
            if (this.host) {
                context.translate(app.canvas.width / 2, 0);
            }
        }

        context.strokeStyle = "#000000";
        context.lineWidth = 1;

        // 绘制背景格子
        var y = 80;
        var endX = Config.WIDTH * 10;
        context.beginPath();
        context.moveTo(0, y);
        for (var i = 0; i < 21; ++i) {
            context.lineTo(endX, y)
            y += Config.HEIGHT;
            context.moveTo(0, y);
        }

        var x = 0;
        var endY = Config.HEIGHT * 20 + 80;
        context.moveTo(x, 80);
        for (var i = 0; i < 11; ++i) {
            context.lineTo(x, endY);
            x += Config.WIDTH;
            context.moveTo(x, 80);
        }
        context.stroke();

        // 绘制下一个形状出现的位置
        context.strokeRect(260 - 50, 140 - 50, 100, 100);

        // 绘制名字
        if (this.host) {
            context.fillText("房主:" + this.name, app.canvas.width / 4, 25);
        } else {
            context.fillText(this.name, app.canvas.width / 4, 25);
        }


        //------ 绘制 curblock nextblock
        if (!!this.curBlock) {
            this.curBlock.draw(context);
        }

        if (!!this.nextBlock) {
            this.nextBlock.draw(context);
        }

        //---- 绘制地图数据
        context.strokeStyle = "#000";
        for(var i = 0; i < 20; ++i){
            for(var j = 0; j < 10; ++j){
                if(this.map[i][j].value == 1){
                    context.fillStyle = this.map[i][j].color;
                    context.fillRect(j * Config.WIDTH, i * Config.HEIGHT + 80,Config.WIDTH,Config.HEIGHT);
                    context.strokeRect(j * Config.WIDTH, i * Config.HEIGHT + 80,Config.WIDTH,Config.HEIGHT);
                }
            }
        }

        //---- 检查是否挂掉
        if(this.failed){
            context.fillStyle = '#f00';
            context.fillText('Game Failed',app.canvas.width/4 - 100,app.canvas.height/2);
        }

        context.restore();
    };


    Player.prototype.drawMiddleLine = function (context) {
        context.save();
        context.fillStyle = "#000000";
        context.fillRect(app.canvas.width / 2 - 1, 0, 2, app.canvas.height);
        context.restore();
    };

    Player.prototype.ready = function () {
        var route = 'connector.entryHandler.ready';

        console.log("app.room.player.name:" + app.room.player.name);
        console.log("app.player.opponent.name:" + app.room.opponent.name);

        var roomname = app.room.player.host ? app.room.player.name : app.room.opponent.name;
        var msg = {
            roomname: roomname,
            playerId: app.room.player.id
        };
        pomelo.request(route, msg, function (data) {

        });
    }

    window.Player = Player;

})();