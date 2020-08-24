var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var buzzes = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
app.use(express.static(__dirname + '/pink'));

 
  io.on('connection', (socket) => 
    {
    var n = Date.now();
    var socketId = socket.id;
    console.log(socketId + ' is now connected');
    socket.on('disconnect', () => {
    console.log('user disconnected');
    });
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msg) => 
        {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
        });
  });
  

  io.on('connection', (socket) => {
    socket.on('buzzer', (msg) => 
        {
        var n = Date.now();
        var newbuzz = {id:socket.id, time:n};
        buzzes.push(newbuzz);
        console.log(buzzes);
        var total = buzzes.length;
        io.emit('rank',buzzes);
        });
  });

  io.on('connection', (socket) => {
    socket.on('reset', (value) => {
      buzzes = [];
      io.emit('reset',true);
    });
  });
 
  
  http.listen(3000, () => {
    console.log('listening on *:3000');
  });