
var consts = require('../../../models/consts');
var game = require('../../../models/game');
var Player = require('../../../models/player');
var Room = require('../../../models/room');

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

        room.channel.pushMessage({
            route : 'onReady',
            opponent : player
        });

        next(null,{
            code : consts.MESSAGE.STARTGAME,
            room : room
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
    }
    next(null,{code:consts.MESSAGE.RES});
};


var onUserLeave = function (app, session) {
    if (!!session && session.uid) {
        console.log('有用户离开......,应该销毁房间,暂时不实现');
    }
}