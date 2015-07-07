/**
 * Created by mac on 15/7/7.
 */

(function(){

    var Room = function(opts){
        opts = opts || {};
        this.name = opts.name;
        this.player = null;    // 这个表示当前客户端的玩家,注意与 服务端的 room.player 的区别
        this.opponent = null;
    }

    window.Room = Room;
})();