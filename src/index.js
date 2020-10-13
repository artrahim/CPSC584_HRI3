const bebop = require("node-bebop"),
    fs = require("fs");

const output = fs.createWriteStream("./video.h264"),
    drone = bebop.createClient(),
    video = drone.getVideoStream();
// console.log(output);
// console.log(drone);
// console.log(video);

video.pipe(output);

// start a live stream
// drone.connect(() => {
//     drone.MediaStreaming.videoEnable(1);
// });

// take a 5 second recording with the drone
drone.connect(() => {
    drone.startRecording();

    setTimeout(function() {
        drone.stopRecording();
    }, 5000);
});

drone.on('ready', () => {
    console.log('the drone has connected!');
});