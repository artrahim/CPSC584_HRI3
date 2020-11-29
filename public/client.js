$(function () {
    const socket = io();
    const $add_path = $("button.add-path"),
        $add_predef = $("button.add-predef"),
        $all_predefs = $("div.all-predefs"),
        $close_settings = $("button.close-settings"),
        $backward = $("div.back"),
        $camera_flip = $("button.flip-view"),
        $camera_settings = $("div.camera-settings"),
        $camera_settings_button = $("img.camera-settings-button"),
        $camera_view = $("div.camera-view"),
        $drawing = $("button.draw"),
        $dropdown = $("div.dropdown"),
        $dropdown_button = $("div.dropdown-button"),
        $dropdown_down = $dropdown_button.find(".arrow-down"),
        $dropdown_up = $dropdown_button.find(".arrow-up"),
        $emergency = $("button.emergency"),
        $eraser = $("button.erase"),
        $forward = $("button.forward"),
        $land = $("button.land"),
        $left = $("button.left"),
        $map_view = $("div.map-view"),
        $name_path = $("form.name-path"),
        $predefs = $("button.predef"),
        $rec = $("button.rec-button"),
        $rec_status = $("div.rec-status"),
        $right = $("button.right"),
        $start_path = $("button.start-path"),
        $status = $("p.status"),
        $stop = $("button.stop"),
        $stop_button = $("button.stop-button"),
        $stop_path = $("button.stop-path"),
        $takeoff = $("button.takeoff"),
        $timer = $("div.timer"),
        $timer_value = $timer.find('.value'),
        $time = $("p.time");

    let stopwatch,
        timeBegan = null;


    $takeoff.on("click", function(){
        socket.emit('takeoff');
        $status.text("TAKEOFF");
        $status.css("background","#17BA29");
        $takeoff.addClass("hidden");
        $land.removeClass("hidden");

        setTimeout(function(){
            $status.text("FLIGHT");
            $status.css("background","#0BB6E3");

        }, 2000);
    });

    $land.on("click", function(){
        socket.emit('land');
        $status.text("LANDING");
        $status.css("background","#17BA29");
        $takeoff.removeClass("hidden");
        $land.addClass("hidden");

        setTimeout(function(){
            $status.text("RESTING");
            $status.css("background","#dba12a");

        }, 2000);
    });

    $rec.on("click", function(){
        socket.emit('land');
        $stop_button.removeClass("hidden");
        $rec.addClass("hidden");

        $status.css("margin-left", "0");
        $rec_status.removeClass("hidden");

        startTimer();
    });

    $start_path.on("click", function(){
        $start_path.addClass("hidden");
        $stop_path.removeClass("hidden");

    });

    $stop_path.on("click", function(){
        $start_path.removeClass("hidden");
        $stop_path.addClass("hidden");

    });

    $camera_settings_button.on("click", function() {
        $camera_settings.removeClass("hidden");
    });

    $predefs.on("click", function(e){
        const $selected = $(this);
        let add = false;
        if(!$selected.hasClass("selected")){
            add = true;
        }

        $predefs.removeClass("selected");

        if(add){
            $selected.addClass("selected");
        } else {
            $selected.removeClass("selected");
        }
    });

    $dropdown_button.on("click", function(){
        openCloseDropdown();
    });

    $dropdown.on("click", function(e){
        e.stopPropagation();
    });

    $stop_button.on("click", function(){
        socket.emit('land');
        $rec.removeClass("hidden");
        $stop_button.addClass("hidden");

        $status.css("margin-left", "61px");
        $rec_status.addClass("hidden");

        window.clearInterval(stopwatch);
        $timer_value.text("00:00:00.000");
    });

    $forward.on("click", function(){
        socket.emit('forward');
    });

    $backward.on("click", function(){
        socket.emit('backward');
    });

    $right.on("click", function(){
        socket.emit('right');
    });

    $left.on("click", function(){
        socket.emit('left');
    });

    $stop.on("click", function(){
        socket.emit('stop');
    });

    $emergency.on("click", function(){
        socket.emit('emergency');
    });

    $camera_flip.on("click", function(){
        switchView();
    });

    $drawing.on("click", function(){
        $drawing.addClass("selected");
        $eraser.removeClass("selected");
    });

    $eraser.on("click", function(){
        $eraser.addClass("selected");
        $drawing.removeClass("selected");

    });

    $add_path.on("click", function(){
        $name_path.removeClass("hidden");


    });

    $close_settings.on("click", function(e){
        e.preventDefault();
        e.stopPropagation();

        $camera_settings.addClass("hidden");
        $name_path.addClass("hidden");

    });

    $add_predef.on("click", function(){
        $map_view.removeClass("hidden");
        $camera_view.addClass("hidden");
        openCloseDropdown();

    });

    $name_path.on("submit", function(e){
        let values, input;
        e.preventDefault();
        e.stopPropagation();

        values = $(this).serialize();
        input = values.split("=")[1];

        $name_path.addClass("hidden");
        addPath(input);
        refreshPredefEventListener();
        switchView();
    });

    function refreshPredefEventListener() {
        let $newPre = $("button.predef");
        $newPre.off();

        // Re-add event handler for all matching elements
        $newPre.on("click", function() {
            const $selected = $(this);
            let add = false;
            if(!$selected.hasClass("selected")){
                add = true;
            }

            $newPre.removeClass("selected");

            if(add){
                $selected.addClass("selected");
            } else {
                $selected.removeClass("selected");
            }
            // Handle event.
        });
    }

    function startTimer(){
        timeBegan = new Date();

        stopwatch = setInterval(clockRunning, 10);
    }

    function clockRunning(){
        let currentTime = new Date(),
            timeElapsed = new Date(currentTime - timeBegan),
            hour = timeElapsed.getUTCHours(),
            min = timeElapsed.getUTCMinutes(),
            sec = timeElapsed.getUTCSeconds(),
            ms = timeElapsed.getUTCMilliseconds();

        $timer_value.text(
            (hour > 9 ? hour : "0" + hour) + ":" +
            (min > 9 ? min : "0" + min) + ":" +
            (sec > 9 ? sec : "0" + sec) + "." +
            (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms));
    };

    function updateTime(){
        let now = new Date(),
            hours = (now.getHours() + 24) % 12 || 12,
            ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            minutes = now.getMinutes() < 10 ? "0"+now.getMinutes() : now.getMinutes(),
            time = hours+":"+minutes+" "+ampm;


        $time.text(time);
        setTimeout(updateTime, 1000);
    }
    updateTime();

    function switchView(){
        if($map_view.hasClass("hidden")){
            $map_view.removeClass("hidden");
            $camera_view.addClass("hidden");
        } else {
            $map_view.addClass("hidden");
            $camera_view.removeClass("hidden");

        }

        zwibbler.newDocument();

    }

    function openCloseDropdown() {

        if($dropdown_button.hasClass("up")){
            $dropdown_down.addClass("hidden");
            $dropdown_up.removeClass("hidden");

            $dropdown_button.removeClass("up");
            $dropdown_button.addClass("down");

            $dropdown.removeClass("closed");
            $dropdown.addClass("open");
        } else {
            $dropdown_up.addClass("hidden");
            $dropdown_down.removeClass("hidden");

            $dropdown_button.removeClass("down");
            $dropdown_button.addClass("up");

            $dropdown.removeClass("open");
            $dropdown.addClass("closed");
        }
    }

    function addPath(name){
        let newPath = $("<button class='predef'></button>").text(name);

        $all_predefs.append(newPath);

    }

    const zwibbler = Zwibbler.create("#zwibbler", {
        allowSelectBox: false,
        scrollbars: false,
        showToolbar: true,
        showPickTool:false,
        showHints: false,
        showCurveTool: false,
        showCopyPaste: false,
        showTextTool: false,
        showLineTool: false,
        showArrowTool: false,
        showSquareTool: false,
        showCircleTool: false,
        showColourPanel: false
    });

});