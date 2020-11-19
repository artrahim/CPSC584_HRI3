$(function () {
    const socket = io();
    const $takeoff = $("div.takeoff"),
        $land = $("div.land"),
        $forward = $("div.forward"),
        $backward = $("div.back"),
        $stop = $("div.stop"),
        $emergency = $("div.emergency");


    $takeoff.on("click", function(){
        socket.emit('takeoff');
        $takeoff.addClass("hidden");
        $land.removeClass("hidden");

    });

    $forward.on("click", function(){
        socket.emit('forward');
    });

    $backward.on("click", function(){
        socket.emit('backward');
    });

    $land.on("click", function(){
        socket.emit('land');
        $takeoff.removeClass("hidden");
        $land.addClass("hidden");
    });

    $stop.on("click", function(){
        socket.emit('stop');
    });

    $emergency.on("click", function(){
        socket.emit('emergency');
    });
});