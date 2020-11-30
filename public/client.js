$(function () {
    const socket = io();
    const $add_path = $("button.add-path"),
        $add_predef = $("button.add-predef"),
        $all_predefs = $("div.all-predefs"),
        $aperture = $('input:radio[name="aperture"]'),
        $close_settings = $("button.close-settings"),
        $backward = $("div.back"),
        $back_button = $("button.back"),
        $camera_flip = $("button.flip-view"),
        $camera_settings = $("div.camera-settings"),
        $camera_settings_button = $("img.camera-settings-button"),
        $camera_settings_items = $("div.camera-settings").find("li"),
        $camera_settings_inner = $("div.settings-item"),
        $camera_view = $("div.camera-view"),
        $delete_paths = $("li.delete-paths"),
        $delete_paths_checkbox = $("#delete"),
        $drawing = $("button.draw"),
        $dropdown = $("div.dropdown"),
        $dropdown_button = $("div.dropdown-button"),
        $dropdown_down = $dropdown_button.find(".arrow-down"),
        $dropdown_up = $dropdown_button.find(".arrow-up"),
        $edit_predefs = $("div.edit-predefs"),
        $emergency = $("button.emergency"),
        $eraser = $("button.erase"),
        $fstop_val = $("p.fstop-val"),
        $forward = $("button.forward"),
        $iso = $("div.iso"),
        $iso_settings =  $("div.iso-settings"),
        $iso_settings_input = $('input:radio[name="iso-settings"]'),
        $land = $("button.land"),
        $left = $("button.left"),
        $map_view = $("div.map-view"),
        $name_path = $("form.name-path"),
        $path_settings = $("button.path-settings"),
        $rec = $("button.rec-button"),
        $rec_status = $("div.rec-status"),
        $right = $("button.right"),
        $settings_option = $("ul.options").find("input"),
        $start_path = $("button.start-path"),
        $status = $("p.status"),
        $stop = $("button.stop"),
        $stop_button = $("button.stop-button"),
        $stop_path = $("button.stop-path"),
        $takeoff = $("button.takeoff"),
        $timer = $("div.timer"),
        $timer_value = $timer.find('.value'),
        $time = $("p.time"),
        $unavailable_checkboxes = $("button.not-available"),
        $view_all = $("li.view-all-li"),
        $view_all_checkbox = $("#view-all");

    let stopwatch,
        $deleteable_predefs,
        timeBegan = null,
        $predefs = $("button.predef");

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

    // $delete_paths.on("click", function(){
    //     $delete_paths_checkbox.attr("checked", !$delete_paths_checkbox.attr("checked"));
    // });

    $delete_paths_checkbox.change(function() {
        let trash = $("<img class='icon trash' src='resources/trash.png'></img>"),
            $predefs = $("button.predef"),
            $currentTrash = $(".trash");

        if(this.checked) {
            $predefs.addClass("deletable");
            $predefs.append(trash);

            refreshDeletable();

        } else {
            $predefs.removeClass("deletable");
            $currentTrash.remove();

            $deleteable_predefs.off();
            refreshDeletable();
            refreshPredefEventListener();

        }
    });

    $aperture.change(function(){
        let selected = $(this).val();
        $fstop_val.text(selected);
    });

    $iso_settings_input.change(function(){
        let selected = $(this).val();
        $iso.find("p").text(selected);

    });

    $iso.on("click", function(){
        $camera_settings.removeClass("hidden");
        $iso_settings.removeClass("hidden");
    });

    $settings_option.on("click", function(){
        $(this).parent().addClass("selected");
        ;$(this).parent().siblings().removeClass("selected");
    });

    $rec.on("click", function(){
        socket.emit('land');
        $stop_button.removeClass("hidden");
        $rec.addClass("hidden");

        $status.css("margin-left", "0");
        $rec_status.removeClass("hidden");

        startTimer();
    });

    $back_button.on("click", function(e){
        let parent = $(this).parent(),
            $parent = $(parent);

        e.stopPropagation();
        e.preventDefault();

        $parent.addClass("hidden");
        $parent.parent().siblings().removeClass("hidden");
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

    $path_settings.on("click", function() {
        $edit_predefs.removeClass("hidden");
    });

    $(document).mouseup(function(e) {
        // if the target of the click isn't the container nor a descendant of the container
        if (!$edit_predefs.is(e.target) && $edit_predefs.has(e.target).length === 0) {
            $edit_predefs.addClass("hidden");
        }
    });

    $predefs.on("click", function(e){
        const $selected = $(this);
        let add = false;
        if(!$selected.hasClass("selected") && !$selected.hasClass("deletable")){
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
        $camera_settings_inner.addClass("hidden");
        $camera_settings_items.removeClass("hidden");

    });

    $camera_settings_items.on("click", function(e){
        let current = $(this),
            selection = current.find(".hidden");

        selection.removeClass("hidden");

        current.siblings().addClass("hidden");
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

    // $view_all.on("click", function(){
    //     $view_all_checkbox.click();
    // });

    $view_all_checkbox.change(function() {
        if(this.checked) {
            $unavailable_checkboxes.removeClass("hidden");

        } else {
            $unavailable_checkboxes.addClass("hidden");

        }
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

    function refreshDeletable() {
        $deleteable_predefs = $("button.deletable");
        $deleteable_predefs.off();


        $deleteable_predefs.on("click", function(e){
            e.preventDefault();
            e.stopPropagation();

            $(this).remove();
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
        let pathName = $("<span class='name'></span>").text(name);
            newPath = $("<button class='predef'></button>");

            newPath.append(pathName);


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