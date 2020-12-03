
const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path');
    //bebop = require("./lib/node-bebop");

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {

    var bebop = require("./lib/node-bebop");

    var drone = bebop.createClient();

    drone.connect(function () {

        socket.on('takeoff', function () {
            console.log("takeoff");
            drone.takeOff();


            /*
            setTimeout(function() {
                drone.land()
            }, 5000);


            setTimeout(function() {
                drone.stop();
            }, 3000);

            setTimeout(function() {
                drone.right(3);
            }, 4000);

            setTimeout(function() {
                drone.stop();
            }, 4000);

            setTimeout(function() {
                drone.left(3);
            }, 5000);

            setTimeout(function() {
                drone.stop();
            }, 6000);

            setTimeout(function() {
                drone.land();
            }, 7000);
             */
    });

    socket.on('forward', function () {
        console.log("forward");
        drone.forward(5);
    });

    socket.on('backward', function () {
        console.log("backward");
        drone.backward(5);
    });

    socket.on('right', function () {
        console.log("right");
        drone.right(5);
    });

    socket.on('left', function () {
        console.log("left");
        drone.left(5);
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

});

http.listen(process.env.PORT || 3000);
console.log('Node server running on port 3000');