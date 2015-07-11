/**
 * Created by mac on 15/7/7.
 */

var Data = require('./data');


function Block(opts) {
    opts = opts || {};
    this.color = opts.color || '#000000';
    this.row = opts.row;
    this.column = opts.column;
    this.arr = opts.arr.slice(0);
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    //this.index = opts.index;
    this.width = this.column * Data.Config.WIDTH;
    this.height = this.row * Data.Config.HEIGHT;

    this.idx = 0;
    this.idy = 0;
}
Block.prototype.rotate = function(){

    // 作为 demo 简单的处理一下
    var opts = {};
    opts.row = this.column;
    opts.column = this.row;
    opts.color = this.color;
    opts.arr = [];

    for(var i = 0; i < this.column; ++i){
        for(var j = 0; j < this.row; ++j){
            opts.arr[i * this.row + j] = this.arr[(this.row - 1 - j) * this.column + i];
        }
    }

    var newb = new Block(opts);
    newb.idx = this.idx;
    newb.idy = this.idy;
    newb.x = newb.idx * Data.Config.WIDTH;
    newb.y = newb.idy * Data.Config.HEIGHT + 80;

    return newb;
    //var oldarr = this.arr.slice(0);
    //this.arr = [];
    //
    ////
    //for(var i = 0; i < this.column; ++i){
    //    for(var j = 0; j < this.row; ++j){
    //        this.arr[i * this.row + j] = oldarr[(this.row - 1 - j) * this.column + i];
    //    }
    //}
    //
    //var temprow = this.row;
    //this.row = this.column;
    //this.column = temprow;
    //
    //var tempwidth = this.width;
    //this.width = this.height;
    //this.height = tempwidth;
    //
    //// 需要确定 idx  idy  x  y
    //this.idx = sx;
    //this.idy = sy;
    //
    //this.x = this.idx * Data.Config.WIDTH;
    //this.y = this.idy * Data.Config.HEIGHT + 80;
};

Block.prototype.toJSON = function(){
    return {
        color : this.color,
        row : this.row,
        column : this.column,
        x : this.x,
        y : this.y,
        //index : this.index,
        //idx : this.idx,
        //idy : this.idy,
        arr : this.arr
    };
};

// 创建一个随机的block,颜色随机
// Math.random()  范围:[0,1)
Block.randomBlock = function(){
    var color = Data.Colors[Math.floor(Math.random() * Data.Colors.length)];
    var shape = Data.Shape[Math.floor(Math.random() * Data.Shape.length)];
    var b = new Block(shape);
    b.color = color;
    return b;
};

module.exports = Block;


