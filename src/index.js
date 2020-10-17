require('module-alias/register');

var bebop = require("@lib/node-bebop"),
    cv = require("opencv");

var drone = bebop.createClient(),
    mjpg = drone.getMjpegStream(),
    buf = null,
    w = new cv.NamedWindow("Video", 0);

drone.connect(function() {
    drone.MediaStreaming.videoEnable(1);
});

mjpg.on("data", function(data) {
    buf = data;
});

setInterval(function() {
    if (buf == null) {
        return;
    }

    try {
        cv.readImage(buf, function(err, im) {
            if (err) {
                console.log(err);
            } else {
                if (im.width() < 1 || im.height() < 1) {
                    console.log("no width or height");
                    return;
                }
                w.show(im);
                w.blockingWaitKey(0, 50);
            }
        });
    } catch(e) {
        console.log(e);
    }
}, 100);


// const bebop = require("@lib/node-bebop");
//     fs = require("fs");
//
// var output = fs.createWriteStream("./video.h264"),
//     drone = bebop.createClient(),
//     video = drone.getVideoStream();
//
// video.pipe(output);
//
// drone.connect(function() {
//     drone.MediaStreaming.videoEnable(1);
// });

// var bebop = require("@lib/node-bebop");
//
// var drone = bebop.createClient();
//
// drone.connect(function() {
//     drone.takeOff();
//
//     setTimeout(function() {
//         drone.land();
//
//     }, 5000);
// });
// var bebop = require("@lib/node-bebop");
//
// var drone = bebop.createClient();
//
// drone.connect(function() {
//     drone.MediaStreaming.videoStreamMode(0);
//     drone.PictureSettings.videoStabilizationMode(3);
//     drone.MediaStreaming.videoEnable(1);
// });