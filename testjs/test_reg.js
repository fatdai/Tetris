/**
 * Created by mac on 15/7/6.
 */


var str = "zhangsan123";
var reg = new RegExp('/[a-zA-Z0-9]/');
if(reg.test(str)){
    console.log("is OK");
}else{
    console.log("is not OK!");
}