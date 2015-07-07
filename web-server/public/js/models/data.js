/**
 * Created by mac on 15/7/7.
 */


var Config = {
    WIDTH : 20,
    HEIGHT: 20
};

// 一般是7个形状
var Shape = [
    {
        row:2,
        column : 3,
        arr : [0,1,0,1,1,1]
    },
    {
        row : 2,
        column : 3,
        arr : [1,1,0,0,1,1]
    },
    {
        row : 2,
        column : 2,
        arr : [1,1,1,1]
    },
    {
        row : 4,
        column : 1,
        arr : [1,1,1,1]
    },
    {
        row : 2,
        column : 3,
        arr : [0,1,1,1,1,0]
    },
    {
        row : 3,
        column : 2,
        arr : [1,0,1,0,1,1]
    },
    {
        row : 3,
        column : 2,
        arr :[0,1,0,1,1,1]
    }
];

var Colors = ["#ff0000", // red
    "#ffff00", // yellow
    "#00ff00", // green
    "#0000ff", // blue
    "#00ffff", // 浅蓝
    "#ff00ff"  // 浅红
];

// 创建一个随机的block,颜色随机
// Math.random()  范围:[0,1)
function randomBlock(){
    var color = Colors[Math.floor(Math.random() * Colors.length)];
    var shape = Shape[Math.floor(Math.random() * Shape.length)];
    var b = new Block(shape);
    b.color = color;
    return b;
}