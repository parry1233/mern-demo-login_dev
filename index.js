const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server); 

// app.get('/', (req, res) => {
//     //res.send('Welcome to Server!');
//     res.sendFile(__dirname+'/public/index.html');
// });
app.use(express.static(__dirname + '/public')); //get other pages

//線上統計人數
let onlineCount = 0;
io.on('connection',(socket) => {
    var address = socket.handshake.address;
    //連線時增加人數
    onlineCount++;
    //發送人數給網頁
    io.emit("online",onlineCount);
    console.log('client online: '+address);
    
    //socket.on("greet",()=>{
    //    socket.emit("greet","Now online: "+onlineCount);
    //});
    socket.on('send',(msg)=>{
        console.log("From: "+address+", message:{"+msg.name+","+msg.msg+"}")
        // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
        // 因此我們直接 return ，終止函式執行。
        if (Object.keys(msg).length < 2) return;

        // 廣播訊息到聊天室
        io.emit("msg",msg)
    });

    socket.on('disconnect', ()=>{
        onlineCount = (onlineCount<0)?0:onlineCount-=1;
        io.emit("online",onlineCount);
        console.log('client leave: '+address);
    });

});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/login', (req, res) => {
    console.log(req.body)
    res.send(req.body)
});

server.listen(3000, () => {
    console.log("Server Started. at port:3000");
});