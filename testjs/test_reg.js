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

var arr = []
for(var i = 0; i < 5; ++i){
    arr[i] = [];
    for(var j = 0 ; j < 4; ++j){
        arr[i][j] = 1;
    }
}
console.log(arr);