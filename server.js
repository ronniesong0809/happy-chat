var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

connections = [];
users = [];
app.get('/',function(req,res){
   res.sendFile(__dirname + '/chatGUI.html');
});

io.on('connection',function(socket){ //listen on the connection event
    connections.push(socket);
    console.log('a user connected' + connections.length);

    socket.on('disconnect',function(data){
        users.splice(users.indexOf(socket.username),1);

        connections.splice(connections.indexOf(socket),1);
        console.log('disconnected',connections.length)
    });

     // new user

     socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        console.log('data username' + socket.username);
        users.push(socket.username);
        updateUsers();
    });

    socket.on('send message', function(data){
        console.log('server' + data);
        io.sockets.emit('new message', {msg:data, name:socket.username });
    });
    
    function updateUsers() {
        io.sockets.emit('get users', users);

    }
});



server.listen(3033,function(){
    console.log('Server running')
}); // return the HTTP server intance
