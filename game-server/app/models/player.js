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
    if(this.canMoveDown()){
        ++this.curBlock.idy;
        this.curBlock.y += Data.Config.HEIGHT;
    }else{

        if(this.curBlock.idy == 0){
            console.log('游戏失败');
            this.failed = true;
            room.syncGameFail(this);
            return;
        }

        // 放置到map中
        this.put();

        // 产生新的 block
        this.curBlock = this.nextBlock;
        this.curBlock.idy = 0;
        this.curBlock.idx = Math.floor((10 - this.curBlock.column)/2);
        this.curBlock.x =  this.curBlock.idx * Data.Config.WIDTH;
        this.curBlock.y = 80;

        this.nextBlock = Block.randomBlock();
        this.nextBlock.x = 260 - this.nextBlock.width/2;
        this.nextBlock.y = 140 - this.nextBlock.height/2;
    }

    room.sync();
};

Player.prototype.left = function(){
    // 先判断是否可以左移
    if(this.curBlock.idx == 0){
        return;
    }

    var idx = this.curBlock.idx - 1;
    var idy = this.curBlock.idy;

    if(this.isValid(idx,idy)){
        // 左移
        this.curBlock.idx = idx;
        this.curBlock.x = idx * Data.Config.WIDTH;
    }
};

Player.prototype.right = function(){
    // 先判断是否可以右移
    if(this.curBlock.idx + this.curBlock.column >= 10){
        return;
    }

    var idx = this.curBlock.idx + 1;
    var idy = this.curBlock.idy;

    if(this.isValid(idx,idy)){
        // 右移
        this.curBlock.idx = idx;
        this.curBlock.x = idx * Data.Config.WIDTH;
    }
};

Player.prototype.isValid = function(idx,idy){

    for (var i = 0; i < this.curBlock.row; ++i) {
        for (var j = 0; j < this.curBlock.column; ++j) {
            if (this.curBlock.arr[j + i * this.curBlock.column] == 1 &&
                this.map[idy + i][idx + j].value == 1) {
                return false;
            }
        }
    }
    return true;
};

module.exports = Player;