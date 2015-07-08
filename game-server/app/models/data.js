/**
 * Created by mac on 15/7/7.
 */
var Data = {};

Data.Config = {
    WIDTH : 20,
    HEIGHT: 20
};

// 一般是7个形状
Data.Shape = [
    {
        row:2,
        column : 3,
        arr : [0,1,0,1,1,1],
        index : 0
    },
    {
        row : 2,
        column : 3,
        arr : [1,1,0,0,1,1],
        index : 1,
    },
    {
        row : 2,
        column : 2,
        arr : [1,1,1,1],
        index : 2
    },
    {
        row : 4,
        column : 1,
        arr : [1,1,1,1],
        index : 3
    },
    {
        row : 2,
        column : 3,
        arr : [0,1,1,1,1,0],
        index : 4
    },
    {
        row : 3,
        column : 2,
        arr : [1,0,1,0,1,1],
        index : 5
    },
    {
        row : 3,
        column : 2,
        arr :[0,1,0,1,1,1],
        index : 6
    }
];

Data.Colors = ["#ff0000", // red
    "#ffff00", // yellow
    "#00ff00", // green
    "#0000ff", // blue
    "#00ffff", // 浅蓝
    "#ff00ff"  // 浅红
];

module.exports = Data;