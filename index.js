const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    bebop = require("./lib/node-bebop/lib");


app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){

    const drone = bebop.createClient();

    socket.on('takeoff', function () {
        console.log("takeoff");
        drone.takeOff();
    });

    socket.on('forward', function () {
        console.log("forward");
        drone.forward(10);
    });

    socket.on('backward', function () {
        console.log("backward");
        drone.backward(10);
    });

    socket.on('land', function () {
        console.log("land");
        drone.land();
    });

    socket.on('stop', function () {
        console.log("stop");
        drone.stop();
    });

    socket.on('emergency', function () {
        // makes the drone drop immediately
        console.log("emergency");
        drone.emergency();
    });


    socket.on('disconnect', function () {
        drone.emergency();
    });

    socket.on('error', function (err) {
        console.log(err);
    });

});

http.listen(process.env.PORT || 3000);
console.log('Node server running on port 3000');