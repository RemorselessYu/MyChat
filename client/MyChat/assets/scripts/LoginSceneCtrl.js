/**
 * LoginSceneCtrl.js
 */

window.UserID = null;

cc.Class({
    extends: cc.Component,

    properties: {
        userIDEditBox: {
            default: null,
            type: cc.EditBox
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.socket = window.io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('连接成功');
        });

        this.socket.on('login', (data) => {
            // 判断是否成功
            if (data.msg === 'ok') {
                this.userID = data.userID;
                window.UserID = data.userID;
                // 隐藏登入页
                cc.director.loadScene('ChatScene');
            }
        });
    },

    start() {

    },

    // update (dt) {},

    // 按钮点击事件
    onClickLoginButton() {

        let id = this.userIDEditBox.string;

        // 检测是否为空
        if (id == '') return;

        // 先检测连接是否还在
        if (this.socket.connected) {
            // 发送 userID 进行校验
            this.socket.emit('testlogin', { userID: id });
        }
    },
});
