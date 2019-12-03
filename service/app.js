/**
 * app.js
 */

const port = 3000;
const io = require('socket.io')(port);

// 在线用户列表
let userList = [];

io.on('connection', (socket) => {
    // 监听用户的登录请求
    socket.on('testlogin', (data) => {
        let userID = data.userID;
        // 是否在线标志
        let isOnLine = false;
        // 查找
        for (let i = 0; i < userList.length; i++) {
            // 如果找到
            if (userList[i] === userID) {
                isOnLine = true;
                break;
            }
        }
        // 在线了，返回 err。没在线，允许登录返回 ok。
        if (isOnLine) {
            socket.emit('login', { msg: 'err' });
            console.log("已登录！");
        } else {
            // 为本 socket 记录 userID
            socket.userID = userID;
            userList.push(userID);
            socket.emit('login', { msg: 'ok', userID: userID });
            console.log("登录：" + userID);
        }
    });

    // 下线
    socket.on('disconnect', (err) => {
        // 把对应的用户剔除
        for (let i = 0; i < userList.length; i++) {
            if (userList[i] === socket.userID) {
                // 找到后删除
                userList.splice(i, 1);
                break;
            }
        }

        console.log("下线：" + socket.userID);

    });

    // 消息到来后广播（ io 的事件发送会到达所有的 socket ）
    socket.on('message', (data) => {
        io.emit('message', data);
    });
});