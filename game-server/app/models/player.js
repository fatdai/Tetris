/**
 * Created by mac on 15/7/6.
 */


var id = 1;
function Player(opts){
    opts = opts || {};
    this.name = opts.name || 'defailt name';
    this.id = opts.id || id++;
    this.channelId = opts.channelId || -1;
    this.sid = opts.sid;
    this.ready = false;
    this.host = false;
}



module.exports = Player;