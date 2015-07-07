/**
 * Created by mac on 15/7/7.
 */

(function(){

    var Room = function(opts){
        opts = opts || {};
        this.name = opts.name;
        this.player = null;
        this.opponent = null;
    }

    window.Room = Room;
})();