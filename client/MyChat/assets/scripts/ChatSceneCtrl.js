/**
 * MainSceneCtrl.js
 */

const ItemType = cc.Enum({
    left: 1,
    Right: 0
});
const IMG_WIDTH = 150;
const IMG_HEIGHT = 150;
const DELTA_X = 40;
const DELTA_Y = 20;

cc.Class({
    extends: cc.Component,

    properties: {
        leftItem: cc.Prefab,
        rightItem: cc.Prefab,
        scrollView: cc.ScrollView,
        content: cc.Node,
        faceImgs: [cc.SpriteFrame],
        editbox: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.userID = UserID;
        console.log("用户名哈哈：" + window.UserID);

        this.socket = window.io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('连接成功');
        });

        this.socket.on('message', (data) => {
            if (data.type === 'text') {
                // 处理文本
                // 如果是自己的消息，显示在右侧
                if (data.userID === this.userID) {
                    this.createText(ItemType.Right, data.string);
                } else {
                    this.createText(ItemType.Left, data.string);
                }
            } else if (data.type === 'img') {
                // 处理图片
                if (data.userID === this.userID) {
                    this.createImg(ItemType.Right, data.index);
                } else {
                    this.createImg(ItemType.Left, data.index);
                }
            }
        });
    },

    start() {

    },

    // update (dt) {},

    /**
     * 创建文本消息
     * @param {*} item 
     * @param {*} string 
     */
    convertToTextItem(item, string) {
        // 第一帧
        item.opacity = 0.001;
        let text = item.getChildByName('text');
        console.log(text);

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
     * 创建图片消息
     * @param {*} item 
     * @param {*} index 
     */
    convertToImgItem(item, index) {
        // 图片内容
        let img = item.getChildByName('img');
        img.active = true;
        img.getComponent(cc.Sprite).spriteFrame = this.faceImgs[index];
        img.width = IMG_WIDTH;
        img.height = IMG_HEIGHT;
        // 调整高度与背景图
        item.height = IMG_HEIGHT + 2 * DELTA_Y;
        let bk = item.getChildByName('bubbleBody');
        bk.width = IMG_WIDTH + 2 * DELTA_X;
        bk.height = IMG_WIDTH + 2 * DELTA_Y;
    },

    /**
     * 创建图片
     * @param {*} itemType 
     * @param {*} index 
     */
    createImg(itemType, index) {
        let item = this.createItem(itemType);
        this.convertToImgItem(item, index);
        this.insertItem(itemType, item);
    },

    /**
     * 创建文本
     * @param {*} itemType 
     * @param {*} string 
     */
    createText(itemType, string) {
        let item = this.createItem(itemType);
        this.convertToTextItem(item, string);
        this.insertItem(itemType, item);
    },

    /**
     * 插入消息
     * @param {*} item 
     */
    insertItem(itemType, item) {
        console.log(item);
        item.parent = this.content;



        if (itemType === ItemType.Left) {
            item.x = -330;
        } else {
            item.x = 330;
        }


        this.scheduleOnce(() => {
            this.scrollView.scrollToBottom(0.5);
        }, 0.1);
    },

    /**
     * 创建消息
     * @param {*} itemType 
     */
    createItem(itemType) {
        let item;
        if (itemType === ItemType.Left) {
            item = cc.instantiate(this.leftItem);
        } else {
            item = cc.instantiate(this.rightItem);
        }
        return item;
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
