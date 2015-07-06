/**
 * Created by mac on 15/7/6.
 */


var game = {};

var players = {};
var channels = {};

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

game.hasChannel = function(){
    for(var i in channels){

    }
}

//*********************************************
// private method
function tick(){

}

module.exports = game;