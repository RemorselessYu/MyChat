/**
 * MainSceneCtrl.js
 */

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },

    // update (dt) {},

    convertToTextItem(item, string) {
        // 第一帧
        item.opacity = 0.001;
        let text = item.getChildByName('text');
        text.active = true;
        let label = text.getComponent(cc.Label);
        label.string = string;
        // 第二帧
        this.scheduleOnce(() => {
            if (text.width < 500) {
                showItem(text.width);
            } else {
                // 自动换行模式
                label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
                text.width = 500;
                showItem(text.width);
            }
        }, 0);
        // 第三帧
        let showItem = () => {
            this.scheduleOnce(() => {
                item.opacity = 255;
                let h = text.height;
                let w = text.width;
                // 调整高度与背景图，DELTA 为数字常量
                item.height = h + 2 * DELTA_Y;
                let bk = item.getChildByName('bubbleBody');
                bk.width = w + 2 * DELTA_X;
                bk.height = h + 2 * DELTA_Y;
            }, 0);
        }
    },

    /**
     * 发送图片信息
     * @param {*} event 
     * @param {*} customEventData 
     */
    onClickImg(event, customEventData) {
        let index = parseInt(customEventData);
        if (this.socket.connected) {
            let msg = {
                userID: this.userID,
                type: 'img',
                index: index
            }
            this.socket.emit('message', msg);
        }
    },

    /**
     * 发送文字信息
     * @param {*} editbox 
     */
    onMsgEditBoxEnter(editbox) {
        let string = editbox.string;
        if (string === '') return;
        editbox.string = '';
        if (this.socket.connected) {
            let msg = {
                userID: this.userID,
                type: 'text',
                string: string
            }
            this.socket.emit('message', msg);
        }
    },

});
