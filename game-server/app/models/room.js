/**
 * Created by mac on 15/7/7.
 */

/// 每个房间有每个房间的状态

var Data = require('./data');
var Block = require('./block');
var consts = require('./consts');

//var schedule = require('../../../../node_modules/pomelo/node_modules/pomelo-scheduler/lib/schedule');
//var schedule = require('schedule');

function Room(opts){
    opts = opts || {};
    this.name = opts.name;
    this.channel = opts.channel;
    this.isFull = false;
    this.player = opts.player;   // 表示 主机玩家
    this.opponent = null;        // 表示非主机玩家
    this.ready = false;   // 房间是否准备好
    this.tickFlag = false;
    this.time = 0;
}


Room.prototype.toJSON = function(){
    console.log("Room toJSON called>>>>>>>>>>>>>>>>");
    return {
        name:this.name,
        player : {
            name:this.player.name,
            id:this.player.id
        },
        opponent : {
            name:this.opponent.name || 'opponent name',
            id:this.opponent.id
        }
    }
};


Room.prototype.startGame = function(){
    if(!this.ready  || !this.player  ||  !this.opponent){
        throw  new Error("room is not ready");
    }

    this.player.initMap();
    this.opponent.initMap();

    // room 开始产生2组方块
    // 然后就产生的东西push给客户端
    var curBlock1 = Block.randomBlock();
    curBlock1.idx = Math.floor((10 - curBlock1.column)/2);
    curBlock1.x = curBlock1.idx * Data.Config.WIDTH;
    curBlock1.idy = 0;
    curBlock1.y = 80;

    var nextBlock1 = Block.randomBlock();
    nextBlock1.x = 260 - nextBlock1.width/2;
    nextBlock1.y = 140 - nextBlock1.height/2;
    this.player.curBlock = curBlock1;
    this.player.nextBlock = nextBlock1;

    var curBlock2 = Block.randomBlock();
    curBlock2.x = curBlock1.x;
    curBlock2.y = curBlock1.y;
    curBlock2.idx = curBlock1.idx;
    curBlock2.idy = curBlock1.idy;
    var nextBlock2 = Block.randomBlock();
    nextBlock2.x = nextBlock1.x;
    nextBlock2.y = nextBlock1.y;
    this.opponent.curBlock = curBlock2;
    this.opponent.nextBlock = nextBlock2;

    this.channel.pushMessage({
        route : 'onFallDown',
        curBlock1 : curBlock1,
        nextBlock1 : nextBlock1,
        curBlock2 : curBlock2,
        nextBlock2 : nextBlock2,
        speed1 : this.player.speed,
        speed2 : this.opponent.speed
    });

    // curBlock 开始 下落
    this.tickFlag = true;
    this.player.time = Date.now();
    this.opponent.time = Date.now();
};

Room.prototype.sync = function(){
    // 同步一次位置信息
    // 需要同步哪些内容???
    // 地图信息
    this.channel.pushMessage({
        route : 'onMessage',
        code : consts.MESSAGE.SYNC,
        map1 : this.player.map,
        map2 : this.opponent.map,
        curBlock1 : this.player.curBlock,
        nextBlock1 : this.player.nextBlock,
        curBlock2 : this.opponent.curBlock,
        nextBlock2 : this.opponent.nextBlock,
        speed1 : this.player.speed,
        speed2 : this.opponent.speed,
    });
};

Room.prototype.update = function(){

    if(!this.tickFlag){
        return;
    }

    this.player.checked(this);
    this.opponent.checked(this);
};

Room.prototype.syncGameFail = function(player){
    // 同步游戏结束
    this.channel.pushMessage({
        route : 'onGameFail',
        player : player,
        code : consts.MESSAGE.RES
    });
};


module.exports = Room;