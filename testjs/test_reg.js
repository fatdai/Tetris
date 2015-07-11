/**
 * Created by mac on 15/7/6.
 */


//var str = "zhangsan123";
//var reg = new RegExp('/[a-zA-Z0-9]/');
//if(reg.test(str)){
//    console.log("is OK");
//}else{
//    console.log("is not OK!");
//}
//
//var arr = [1,2,3,4];
//
//var other = arr.slice(0);
//arr[1] = 333;
//console.log(other);

//
//function PP(args){
//    this.arr = args;
//}
//
//var p = new PP(arr);
//arr[1] = 222;
//console.log(p);

//var arr = []
//for(var i = 0; i < 5; ++i){
//    arr[i] = [];
//    for(var j = 0 ; j < 4; ++j){
//        arr[i][j] = 1;
//    }
//}
//console.log(arr);

function Block(opts){
    opts = opts || {};
    this.row = opts.row;
    this.column = opts.column;
    this.arr = opts.arr.slice(0);
}

Block.prototype.rotate = function(){

    var oldarr = this.arr.slice(0);

    //
    for(var i = 0; i < this.column; ++i){
        for(var j = 0; j < this.row; ++j){
            this.arr[i * this.row + j] = oldarr[(this.row - 1 - j) * this.column + i];
        }
    }


    var temprow = this.row;
    this.row = this.column;
    this.column = temprow;

    var tempwidth = this.width;
    this.width = this.height;
    this.height = tempwidth;
};

var b1 = new Block({
    row:2,
    column : 3,
    arr : [1,1,0,0,1,1]
});

b1.rotate();

console.log(b1);
