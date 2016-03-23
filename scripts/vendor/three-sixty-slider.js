// @SAUCE: http://heartcode.robertpataki.com/360-image-slider/

$(document).ready(function () {

    var ready               = false,
        dragging            = false,
        pointerStartPosX    = 0,
        pointerEndPosX      = 0,
        pointerDistance     = 0,

        monitorStartTime    = 0,
        monitorInt          = 10,
        ticker              = 0,
        speedMultiplier     = 10,
        spinner,

        totalFrames         = 180,
        currentFrame        = 0,
        frames              = [],
        endFrame            = 0,
        loadedImages        = 0,

        $document           = $(document),
        $container          = $('#threesixty'),
        $images             = $('#threesixty_images'),

        demoMode            = true,
        fakePointerTimer    = 0,
        fakePointer = {
            x: 0,
            speed: 4
        }
    ;

    function addSpinner () {
        spinner = new CanvasLoader("spinner");
        spinner.setShape("spiral");
        spinner.setDiameter(90);
        spinner.setDensity(90);
        spinner.setRange(1);
        spinner.setSpeed(4);
        spinner.setColor("#333333");
        spinner.show();
        $("#spinner").fadeIn("slow");
    };

    function loadImage() {
        var li = document.createElement("li");
        var imageName = "img/threesixty_" + (loadedImages + 1) + ".jpg";

        var image = $('<img>').attr('src', imageName).addClass("previous-image").appendTo(li);
        frames.push(image);
        $images.append(li);

        $(image).load(function() {
            imageLoaded();
        });
    };

    function imageLoaded() {
        loadedImages++;
        $("#spinner span").text(Math.floor(loadedImages / totalFrames * 100) + "%");
        if (loadedImages == totalFrames) {
            frames[0].removeClass("previous-image").addClass("current-image");

            $("#spinner").fadeOut("slow", function(){
                spinner.hide();
                showThreesixty();
            });
        } else {
            loadImage();
        }
    };

    function showThreesixty () {
        $images.fadeIn("slow");
        ready = true;
        endFrame = -720;
        if(!demoMode) {
            refresh();
        } else {
            fakePointerTimer = window.setInterval(moveFakePointer, 100);
        }
    };

    function moveFakePointer () {
        fakePointer.x += fakePointer.speed;
        trackPointer();
    };


    function quitDemoMode() {
        window.clearInterval(fakePointerTimer);
        demoMode = false;
    };

    addSpinner();
    loadImage();

    function render () {
        if(currentFrame !== endFrame)
        {
            var frameEasing = endFrame < currentFrame ? Math.floor((endFrame - currentFrame) * 0.1) : Math.ceil((endFrame - currentFrame) * 0.1);
            hidePreviousFrame();
            currentFrame += frameEasing;
            showCurrentFrame();
        } else {
            window.clearInterval(ticker);
            ticker = 0;
        }
    };

    function refresh () {
        if (ticker === 0) {
            ticker = self.setInterval(render, Math.round(1000 / 60));
        }
    };

    function hidePreviousFrame() {
        frames[getNormalizedCurrentFrame()].removeClass("current-image").addClass("previous-image");
    };

    function showCurrentFrame() {
        frames[getNormalizedCurrentFrame()].removeClass("previous-image").addClass("current-image");
    };

    function getNormalizedCurrentFrame() {
        var c = -Math.ceil(currentFrame % totalFrames);
        if (c < 0) c += (totalFrames - 1);
        return c;
    };

    function getPointerEvent(event) {
        return event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
    };

    $container.on("mousedown", function (event) {
        quitDemoMode();
        event.preventDefault();
        pointerStartPosX = getPointerEvent(event).pageX;
        dragging = true;
    });

    $document.on("mouseup", function (event){
        event.preventDefault();
        dragging = false;
    });

    $document.on("mousemove", function (event){
        if (demoMode) { return; }
        event.preventDefault();
        trackPointer(event);
    });

    $container.on("touchstart", function (event) {
        quitDemoMode();
        event.preventDefault();
        pointerStartPosX = getPointerEvent(event).pageX;
        dragging = true;
    });

    $container.on("touchmove", function (event) {
        event.preventDefault();
        trackPointer(event);
    });

    $container.on("touchend", function (event) {
        event.preventDefault();
        dragging = false;
    });

    function trackPointer(event) {
        var userDragging = ready && dragging ? true : false;
        var demoDragging = demoMode;

        if(userDragging || demoDragging) {
            pointerEndPosX = userDragging ? getPointerEvent(event).pageX : fakePointer.x;

            if(monitorStartTime < new Date().getTime() - monitorInt) {
                pointerDistance = pointerEndPosX - pointerStartPosX;
                endFrame = currentFrame + Math.ceil((totalFrames - 1) * speedMultiplier * (pointerDistance / $container.width()));
                refresh();
                monitorStartTime = new Date().getTime();
                pointerStartPosX = userDragging ? getPointerEvent(event).pageX : fakePointer.x;
            }
        } else {
            return;
        }
    };
});