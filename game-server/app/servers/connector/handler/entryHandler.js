
var consts = require('../../../models/consts');
var game = require('../../../models/game');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function (msg, session, next) {
    next(null, {code: 200, msg: 'game server is ok.'});
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function (msg, session, next) {
    var result = {
        topic: 'publish',
        payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
    };
    next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function (msg, session, next) {
    var result = {
        topic: 'subscribe',
        payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
    };
    next(null, result);
};


var id = 1;
Handler.prototype.login = function (msg, session, next) {
    var self = this;
    var name = msg.name;

    // 检查是否存在同名的情况
    var player = game

    var playerId = id++;
    console.log("playerId:" + playerId);

    session.bind(playerId);
    session.set('playerId', playerId);
    session.pushAll();

    session.on('closed', onUserLeave.bind(null, self.app));
    next(null, {
        code : consts.MESSAGE.RES,
        playerId: playerId
    });
};

var onUserLeave = function (app, session) {
    if (!!session && session.uid) {
        console.log('有用户离开......');
    }
}