/**
 * Created by mac on 15/7/6.
 */

var pomelo = require('pomelo');
var Room = require('./room');
var Player = require('./player');

var game = {};

var players = {};
var rooms = {};

game.init = function(){
    setInterval(tick,100);
};

game.addPlayer = function(player){
    players[player.id] = player;
}

game.getPlayer = function(playerId){
    return players[playerId];
};

game.players = function(){
    return players;
};

game.getRoom = function(roomname){
    return rooms[roomname];
};

game.allocationRoom = function(player){

    for(var i  in  rooms){
        if(!rooms[i].isFull){
            rooms[i].opponent = player;
            rooms[i].isFull = true;
            return rooms[i];
        }
    }

    var newchannel = pomelo.app.get('channelService').getChannel(player.name,true);
    newchannel.add(player.id,player.sid);

    // 创建一个新房间
    player.host = true;
    var room = new Room({
        channel : newchannel,
        name : player.name,
        player : player
    });

    rooms[room.name] = room;
    return room;
}

//*********************************************
// private method
function tick(){



}

module.exports = game;