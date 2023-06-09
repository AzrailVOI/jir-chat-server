const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

var user = "Vlad"

const allowedIPs = ['192.168.3.6', '192.168.3.5'];
const corsOptions = {
  /*
  origin: function (origin, callback) {
    if (allowedIPs.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }*/
  origin: 'file:///C:/Users/ggtna/Desktop/%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BF%D0%BA%D0%B0/index.html',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.handshake.address, socket.id);
  socket.emit('userID', String(socket.id))
  socket.on('authForm', userData=>{
    console.log(userData)
    if (userData.username === user){
      socket.emit('authFormServer', true)
    }else{
      socket.emit('authFormServer', false)
    }
  })
  socket.on('user-message', message=>{
    console.log(message)
    let answer={
      id: String(socket.id),
      text: message
    }
    io.emit('some-message', answer)
  })
});

http.listen(5000, () => {
  console.log('listening on *:5000');
});
