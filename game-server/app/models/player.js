/**
 * Created by mac on 15/7/6.
 */

var Item = require('./item');
var Data = require('./data');
var Block = require('./block');

var id = 1;
function Player(opts){
    opts = opts || {};
    this.name = opts.name || 'defailt name';
    this.id = opts.id || id++;
    this.channelId = opts.channelId || -1;
    this.sid = opts.sid;
    this.ready = false;
    this.host = false;
    this.map = null;

    this.curBlock = null;
    this.nextBlock = null;
    this.speed = 1000;
    this.time = 0;
    this.failed = false;

    this.minrow = 19;
};

Player.prototype.initMap = function(){
    this.map = [];
    for(var i = 0; i < 20; ++i){
        this.map[i] = [];
        for(var j = 0; j < 10; ++j){
            this.map[i][j] = new Item({value:0});
        }
    }
};

Player.prototype.toJSON = function(){
    return {
        name : this.name,
        host : this.host,
        speed : this.speed,
        id : this.id
    };
};

Player.prototype.canMoveDown = function(){

    var idx = this.curBlock.idx;
    var idy = this.curBlock.idy + 1;

    if(idy + this.curBlock.row > 20){
        return false;
    }

    return this.isValid(idx,idy);
};


Player.prototype.put = function () {
    var idx = this.curBlock.idx;
    var idy = this.curBlock.idy;

    for (var i = 0; i < this.curBlock.row; ++i) {
        for (var j = 0; j < this.curBlock.column; ++j) {
            if(this.curBlock.arr[j + i * this.curBlock.column] == 1){
                this.map[idy + i][idx + j].value = 1;
                this.map[idy + i][idx + j].color = this.curBlock.color;
            }
        }
    }

    if(idy < this.minrow){
        this.minrow = idy;
    }
};

Player.prototype.push = function(disrow){
    if(this.minrow <= disrow){
        // 下落
        for(var i = disrow-1;i >= this.minrow; --i){
            for(var j = 0; j < 10;++j){
                this.map[i + 1][j].value = this.map[i][j].value;
                this.map[i + 1][j].color = this.map[i][j].color;
            }

        }
        --this.minrow;
    }
};

Player.prototype.checkDismiss = function(){

    // 只检查 brick所在的行
    for(var i = this.curBlock.idy; i < this.curBlock.idy + this.curBlock+this.row; ++i){
        var sum = 0;
        for(var j = 0; j < 10;++j){
            sum += this.map[i][j].value;
        }
        if(sum == 10){

            console.log("消除一行");
          //  throw  new Error("确定删除一行");

            // 消去的行
            for(var k = 0; k < 10; ++k){
                this.map[i][k].value = 0;
            }
            this.push(i);
        }
    }
};

Player.prototype.movedown = function(room){

    if(this.canMoveDown()){
        ++this.curBlock.idy;
        this.curBlock.y += Data.Config.HEIGHT;
        return true;
    }else{

        if(this.curBlock.idy == 0){
            console.log('游戏失败');
            this.failed = true;
            room.syncGameFail(this);
            return false;
        }

        // 放置到map中
        this.put();

        // 检查是否可以消去
        this.checkDismiss();

        // 产生新的 block
        this.curBlock = this.nextBlock;
        this.curBlock.idy = 0;
        this.curBlock.idx = Math.floor((10 - this.curBlock.column)/2);
        this.curBlock.x =  this.curBlock.idx * Data.Config.WIDTH;
        this.curBlock.y = 80;

        this.nextBlock = Block.randomBlock();
        this.nextBlock.x = 260 - this.nextBlock.width/2;
        this.nextBlock.y = 140 - this.nextBlock.height/2;

        return false;
    }
};

Player.prototype.checked = function(room){

    if(this.failed){
        return;
    }

    var dt = Date.now() - this.time;
    if(dt < this.speed){
        return;
    }

    this.time = Date.now();
    this.movedown(room);
    room.sync();
};

Player.prototype.left = function(){
    // 先判断是否可以左移
    if(this.curBlock.idx == 0){
        return false;
    }

    var idx = this.curBlock.idx - 1;
    var idy = this.curBlock.idy;

    if(this.isValid(idx,idy)){
        // 左移
        this.curBlock.idx = idx;
        this.curBlock.x = idx * Data.Config.WIDTH;
        return true;
    }

    return false;
};

Player.prototype.right = function(){
    // 先判断是否可以右移
    if(this.curBlock.idx + this.curBlock.column >= 10){
        return false;
    }

    var idx = this.curBlock.idx + 1;
    var idy = this.curBlock.idy;

    if(this.isValid(idx,idy)){
        // 右移
        this.curBlock.idx = idx;
        this.curBlock.x = idx * Data.Config.WIDTH;
        return true;
    }
    return false;
};

Player.prototype.up = function(){

    // 先判断是否可以变型
    // 怎么变型？
    // 检查一些位置
    var newb = this.curBlock.rotate();

    // 检查newb 是否可以放到地图里
    if(newb.idx>=10-newb.column){
        if(this.isValid(10-newb.column,newb.idy,newb)){
            newb.idx = 10-newb.column;
            this.curBlock = newb;
            return true;
        }
    }else{
        if(this.isValid(newb.idx,newb.idy,newb)){
            this.curBlock = newb;
            return true;
        }
    }

    return false;
};

Player.prototype.down = function(room){

    // 快速下落,直接一次落2格
    if(this.movedown(room)){
        this.movedown(room);
    }
    room.sync();
    return true;
};

Player.prototype.isValid = function(idx,idy,block){

    if(arguments.length == 2){
        block = this.curBlock;
    }

    for (var i = 0; i < block.row; ++i) {
        for (var j = 0; j < block.column; ++j) {
            if (block.arr[j + i * block.column] == 1 &&
                this.map[idy + i][idx + j].value == 1) {
                return false;
            }
        }
    }
    return true;
};

module.exports = Player;