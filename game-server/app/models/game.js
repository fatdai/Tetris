/**
 * Created by mac on 15/7/6.
 */


var game = {};

var players = {};
var channels = {};

game.init = function(){
    setInterval(tick,100);
};

game.prototype.getPlayer = function(playerId){
    return players[playerId];
}

game.prototype.players = function(){
    return players;
}

//*********************************************
// private method
function tick(){

}

module.exports = game;