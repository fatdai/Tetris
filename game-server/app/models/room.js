/**
 * Created by mac on 15/7/7.
 */

function Room(opts){
    opts = opts || {};
    this.name = opts.name;
    this.channel = opts.channel;
    this.isFull = false;
    this.player = opts.player;   // 表示 主机玩家
    this.opponent = null;        // 表示非主机玩家
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

module.exports = Room;