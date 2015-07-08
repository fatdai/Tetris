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
    this.index = opts.index;
    this.width = this.column * Data.Config.WIDTH;
    this.height = this.row * Data.Config.HEIGHT;

    this.idx = 0;
    this.idy = 0;
};

Block.prototype.toJSON = function(){
    return {
        color : this.color,
        row : this.row,
        column : this.column,
        x : this.x,
        y : this.y,
        index : this.index,
        idx : this.idx,
        idy : this.idy
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


