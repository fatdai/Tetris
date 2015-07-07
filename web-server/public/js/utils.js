/**
 * Created by dai on 15/6/14.
 */

//**********************************************
//  requestAnimation
// 开始定义 requestAnimationFrame
if(!window.requestAnimationFrame){
    window.requestAnimationFrame = (
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        return window.setTimeout(callback,1000/60);
    });
};
//**********************************************

// 计算鼠标位置
window.utils = {};

utils.captureMouse = function(element){
    var mouse = {x:0,y:0};
    element.addEventListener('mousemove',function(event){
        var x,y;

        // 有的浏览器不支持 pageX,pageY 属性
        if(event.pageX || event.pageY){
            x = event.pageX;
            y = event.pageY;
        }else{
             x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
             y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= element.offsetLeft;
        y -= element.offsetTop;

        mouse.x = x;
        mouse.y = y;
    },false);
    return mouse;
};

utils.captureTouch = function(element){
    var touch = {x:null,y:null,isPressed :false};

    element.addEventListener('touchstart',function(event){
        touch.isPressed = true;
    },false);

    element.addEventListener('touchend',function(event){
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
    },false);

    element.addEventListener('touchmove',function(event){
        var x,y;
        var touch_event = event.touches[0]; // first touch

        // 有的浏览器不支持 pageX,pageY 属性
        if(touch_event.pageX || touch_event.pageY){
            x = touch_event.pageX;
            y = touch_event.pageY;
        }else{
            x = touch_event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = touch_event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= element.offsetLeft;
        y -= element.offsetTop;

        touch.x = x;
        touch.y = y;
    },false);
    return touch;
};


utils.getDis = function (pos1,pos2){
    return Math.sqrt(Math.pow((pos1.x - pos2.x),2) + Math.pow((pos1.y - pos2.y),2));
}
