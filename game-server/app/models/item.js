/**
 * Created by mac on 15/7/8.
 */


//**********************************************************
// Item
function Item(opts){
    opts = opts || {};
    this.color = opts.color || "#000";
    this.value = opts.value;
};

module.exports = Item;