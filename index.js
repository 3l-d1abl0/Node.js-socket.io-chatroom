var express = require('express');
var http = require('http');
var app = express();
//var server = http.createServer(app).listen(8080);
var server = http.Server(app);

var io= require('socket.io').listen(server);
var fs=require("fs");
var mongoose=require('mongoose');

var nicknames= [];

mongoose.connect('mongodb://localhost/chat',function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('Connected to MongoDB!');
    }
});

//DataBase Schema
var dbSchema= mongoose.Schema({
    nick: String,
    msg: String,
    time: {type:Date, default: Date.now}
});


//DataBase Model
var Chat = mongoose.model('Message',dbSchema);

app.use(express.static(__dirname+'/pub'));

app.get('*',function(req,res){

    //res.redirect('default.html');
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){

    console.log('Client Connected!!!');

    socket.on('newUser',function(nick){

        if(nicknames.indexOf(nick) !=-1){
            //callback(false);
            socket.emit('userExists',nick);
            console.log(nick + 'Exists !');
        }
        else{
            //console.log('New User');
            //callback(true);
            socket.nick=nick;
           /* socket.set('nickname', nick, function(err) {

            });*/
            nicknames.push(nick);
            io.sockets.emit('userNames',nicknames);
            console.log('New User: '+nick +' entered ');
            /*
            for(var i=0;i<nicknames.length;i++){
                console.log(i+' : '+nicknames[i]);
            } */
        }
    });

    socket.on('sendMessage',function(message){
                //alert(message);
        io.sockets.emit('newMessage',message);
        //console.log(message);
        //socket.broadcast.emit('NewNessage',message);
    });

    socket.on('disconnect',function(data){
        if(!socket.nick){
            return;
        }
        else{
            console.log(socket.nick+' Leaving....');
            nicknames.splice(nicknames.indexOf(socket.nick),1);
            io.sockets.emit('userNames',nicknames);
            console.log(nicknames.length +' users remaing....');
            
        }
    });
    
});





/*
app.get('/',function(req,res){
	//res.sendFile(__dirname + '/index.html');

	console.log(req.path);

    fs.readFile('index.html',function (err, data){
        if(!err)
        {
            res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
            res.write(data);
            res.end();
        }
        else
        {
            res.writeHead(400, {'Content-Type': 'text/html'});
            res.end("index.html not found");
        }
    });
});


io.on('connection', function (socket) {

    console.log('a user connected');

    socket.on('send message',function(data){

            io.emit('new message',data);
            //socket.broadcast.emit('new message',data);
    });

});





app.get("/css/*",function(req,res){
	console.log("Request:" +req.url);
	res.sendFile(__dirname + req.url);

});

app.get("/js/*",function(req,res){
    console.log("Request:" +req.url);
    res.sendFile(__dirname + req.url);

});

app.get("/img/*",function(req,res){
	console.log("Request:" +req.url);
	res.sendFile(__dirname + req.url);

});

app.get("*",function(req,res){
    console.log("Request:" +req.url);
    res.send('<center> <h1>What the..??? 404...!!</h1> </center>');

});

*/

server.listen(8080, function(){
  console.log('listening on *: 8080');
});