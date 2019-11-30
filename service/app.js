/**
 * app.js
 */

const port = 3000;
const io = require('socket.io')(port);

io.on('connection', (socket) => {
    console.log("一个客户端已连接");

    socket.on('disconnect', (err) => {
        console.log("一个客户端已失去链接");
    });
});