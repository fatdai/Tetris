
var consts = require('../../../models/consts');
var game = require('../../../models/game');
var Player = require('../../../models/player');
var Room = require('../../../models/room');
var Block = require('../../../models/block');
var Data = require('../../../models/data');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function (msg, session, next) {
    next(null, {code: 200, msg: 'game server is ok.'});
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function (msg, session, next) {
    var result = {
        topic: 'publish',
        payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
    };
    next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function (msg, session, next) {
    var result = {
        topic: 'subscribe',
        payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
    };
    next(null, result);
};


var id = 1;
Handler.prototype.login = function (msg, session, next) {
    var self = this;
    var name = msg.name;
    console.log("name:"+name);

    // 检查是否存在同名的情况
    var players = game.players();
    for(var i in players){
        if(players[i].name == name){
            next(null,{
                code : consts.MESSAGE.ERR,
                error : true
            });
            return;
        }
    }

    console.log("this is a valid player!!");
    //*****************************************
    // 是有效的用户,需要加入到 game
    var playerId = id++;
    console.log("playerId:" + playerId);

    var player = new Player({
        name : name,
        id : playerId,
        sid : self.app.get('serverId')
    });
    game.addPlayer(player);
    var room = game.allocationRoom(player);
    session.bind(playerId);
    session.set('playerId', playerId);
    session.pushAll();

    session.on('closed', onUserLeave.bind(null, self.app));


    if(room.isFull){
        // 成功加入房间,可以马上准备开始游戏
        // 同时需要通知房主,告诉房主游戏可以开始了
        next(null,{
            code : consts.MESSAGE.STARTGAME,
            room : room
        });

        room.channel.pushMessage({
            route : 'onReady',
            opponent : player
        });

    }else{

        // 新创建的房间,等待对手玩家加入
        next(null, {
            code : consts.MESSAGE.RES,
            player : player
        });
    }
};

Handler.prototype.ready = function(msg,session,next){

    var roomname = msg.roomname;
    var playerId = msg.playerId;

    var room = game.getRoom(roomname);

    var testplayerId = session.get('playerId');
    console.log("testplayerId:"+testplayerId);

    var player = game.getPlayer(playerId);
    player.ready = true;

    // 如果两边都准备好了,则推送一个消息告诉客户端都准备好了
    if(room.player.ready && room.opponent.ready){

        room.channel.pushMessage({
            route : 'onGameStart'
        });

        room.ready = true;
        room.startGame();
    }

    next(null,{code:consts.MESSAGE.RES});
};

Handler.prototype.genBlock = function(msg,session,next){

    var playerId = msg.playerId;
    var roomname = msg.roomname;
    var map = msg.map;

    var room = game.getRoom(roomname);
    var player = game.getPlayer(playerId);

    for(var i = 0; i < 20; ++i){
        for(var j = 0; j < 10; ++j){
            player.map[i][j].value = map[i][j].value;
            player.map[i][j].color = map[i][j].color;
        }
    }

    player.curBlock = player.nextBlock;
    player.curBlock.idx = Math.floor((10 - player.curBlock.column)/2);
    player.curBlock.idy = 0;
    player.curBlock.x = player.curBlock.idx * Data.Config.WIDTH;
    player.curBlock.y = 80;

    player.nextBlock = Block.randomBlock();
    player.nextBlock.x = 260 - player.nextBlock.width/2;
    player.nextBlock.y = 140 - player.nextBlock.height/2;

    next(null,{
        code : consts.MESSAGE.RES
    });

    // 将这个消息推送给客户端,让客户端进行同步下
    room.sync();
};

Handler.prototype.left = function(msg,session,next){
    var playerId = msg.playerId;
    var player = game.getPlayer(playerId);
    var room = game.getRoom(msg.roomname);

    player.left();
    next(null,{code:consts.MESSAGE.RES});
    room.sync();
};

Handler.prototype.right = function(msg,session,next){
    var playerId = msg.playerId;
    var player = game.getPlayer(playerId);
    var room = game.getRoom(msg.roomname);

    player.right();
    next(null,{code:consts.MESSAGE.RES});
    room.sync();
};

var onUserLeave = function (app, session) {
    if (!!session && session.uid) {
        console.log('有用户离开......,应该销毁房间,暂时不实现');
    }
};