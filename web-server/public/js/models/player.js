/**
 * Created by mac on 15/7/6.
 */


(function(){

    var Player = function(opts){
        opts = opts || {};
        this.name = opts.name || 'default name';
        this.id = opts.id || 0;
        this.opponent = null;
    }



    window.Player = Player;

})();