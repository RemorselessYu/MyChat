/**
 * MainSceneCtrl.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.socket = window.io('http://localhost:3000');
    },

    start () {

    },

    // update (dt) {},
});
