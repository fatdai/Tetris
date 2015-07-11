/**
 * Created by mac on 15/7/7.
 */


(function(){

    var Block = function(opts){
        opts = opts || {};
        this.color = opts.color || '#000000';
        this.row = opts.row;
        this.column = opts.column;
        this.x = opts.x || 0;
        this.y = opts.y || 0;
        //this.index = opts.index;

        //this.idx = opts.idx;
        //this.idy = opts.idy;

        //this.arr = opts.arr.slice(0);
        this.arr = opts.arr.slice(0);
            //Shape[this.index].arr.slice(0);
    };


    Block.prototype.draw = function(context){
        context.save();
        context.fillStyle = this.color;
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.translate(this.x,this.y);
        for(var i = 0; i < this.row; ++i){
            for(var j = 0; j < this.column; ++j){
                if(this.arr[ i * this.column + j] == 1){
                    var x = j * Config.WIDTH;
                    var y = i * Config.HEIGHT;
                    context.fillRect(x,y,Config.WIDTH,Config.HEIGHT);
                    context.strokeRect(x,y,Config.WIDTH,Config.HEIGHT);
                }
            }
        }
        context.restore();
    }


    //**********************************************************
    // Item
    function Item(opts){
        opts = opts || {};
        this.color = opts.color || "#000";
        this.value = opts.value;
    };

    Item.prototype.toString = function(){
        return "color:" + this.color + "; value : " + this.value;
    }

    window.Block = Block;
    window.Item = Item;
})();