(function (requirejs, require, define) {

// VideoControl module.
define(
'videoalpha/display/video_control.js',
['videoalpha/display/bind.js'],
function (bind) {

    // VideoControl() function - what this module "exports".
    return function (state) {
        state.videoControl = {};

        makeFunctionsPublic(state);
        renderElements(state);
        bindHandlers(state);
    };

    // ***************************************************************
    // Private functions start here.
    // ***************************************************************

    // function makeFunctionsPublic(state)
    //
    //     Functions which will be accessible via 'state' object. When called, these functions will
    //     get the 'state' object as a context.
    function makeFunctionsPublic(state) {
        state.videoControl.play             = bind(play, state);
        state.videoControl.pause            = bind(pause, state);
        state.videoControl.togglePlayback   = bind(togglePlayback, state);
        state.videoControl.toggleFullScreen = bind(toggleFullScreen, state);
        state.videoControl.exitFullScreen   = bind(exitFullScreen, state);
        state.videoControl.updateVcrVidTime = bind(updateVcrVidTime, state);
    }

    // function renderElements(state)
    //
    //     Create any necessary DOM elements, attach them, and set their initial configuration. Also
    //     make the created DOM elements available via the 'state' object. Much easier to work this
    //     way - you don't have to do repeated jQuery element selects.
    function renderElements(state) {
        var el, qTipConfig;

        el = $(
            '<div class="slider"></div>' +
            '<div>' +
                '<ul class="vcr">' +
                    '<li><a class="video_control" href="#" title="Play"></a></li>' +
                    '<li><div class="vidtime">0:00 / 0:00</div></li>' +
                '</ul>' +
                '<div class="secondary-controls">' +
                    '<a href="#" class="add-fullscreen" title="Fill browser">Fill Browser</a>' +
                '</div>' +
            '</div>'
        );

        state.videoControl.el = state.el.find('.video-controls');
        state.videoControl.el.append(el);

        state.videoControl.sliderEl            = state.videoControl.el.find('.slider');
        state.videoControl.playPauseEl         = state.videoControl.el.find('.video_control');
        state.videoControl.secondaryControlsEl = state.videoControl.el.find('.secondary-controls');
        state.videoControl.fullScreenEl        = state.videoControl.el.find('.add-fullscreen');
        state.videoControl.vidTimeEl           = state.videoControl.el.find('.vidtime');

        state.videoControl.fullScreenState = false;

        if (!onTouchBasedDevice()) {
            state.videoControl.pause();

            qTipConfig = {
                'position': {
                    'my': 'top right',
                    'at': 'top center'
                }
            };

            state.videoControl.playPauseEl.qtip(qTipConfig);
            state.videoControl.fullScreenEl.qtip(qTipConfig);
        } else {
            state.videoControl.play();
        }
    }

    // function bindHandlers(state)
    //
    //     Bind any necessary function callbacks to DOM events (click, mousemove, etc.).
    function bindHandlers(state) {
        state.videoControl.playPauseEl.on('click', state.videoControl.togglePlayback);
        state.videoControl.fullScreenEl.on('click', state.videoControl.toggleFullScreen);
        $(document).on('keyup', state.videoControl.exitFullScreen);
    }

    // ***************************************************************
    // Public functions start here.
    // These are available via the 'state' object. Their context ('this' keyword) is the 'state' object.
    // The magic private function that makes them available and sets up their context is makeFunctionsPublic().
    // ***************************************************************

    function play() {
        this.videoControl.playPauseEl.removeClass('play').addClass('pause').attr('title', 'Pause');
        this.videoControl.playPauseState = 'playing';
    }

    function pause() {
        this.videoControl.playPauseEl.removeClass('pause').addClass('play').attr('title', 'Play');
        this.videoControl.playPauseState = 'paused';
    }

    function togglePlayback(event) {
        event.preventDefault();

        if (this.videoControl.playPauseState === 'playing') {
            this.trigger(['videoPlayer', 'pause']);
        } else { // if (this.videoControl.playPauseState === 'paused') {
            this.trigger(['videoPlayer', 'play']);
        }
    }

    function toggleFullScreen(event) {
        event.preventDefault();

        if (this.videoControl.fullScreenState === true) {
            this.videoControl.fullScreenState = false;
            this.el.removeClass('fullscreen');
            this.videoControl.fullScreenEl.attr('title', 'Fill browser');
        } else {
            this.videoControl.fullScreenState = true;
            this.el.addClass('fullscreen');
            this.videoControl.fullScreenEl.attr('title', 'Exit fill browser');
        }

        this.trigger(['videoCaption', 'resize']);
    }

    function exitFullScreen(event) {
        if ((this.el.hasClass('fullscreen') === true) && (event.keyCode === 27)) {
            this.videoControl.toggleFullScreen(event);
        }
    }

    function updateVcrVidTime(params) {
        this.videoControl.vidTimeEl.html(Time.format(params.time) + ' / ' + Time.format(params.duration));
    }

});

}(RequireJS.requirejs, RequireJS.require, RequireJS.define));
