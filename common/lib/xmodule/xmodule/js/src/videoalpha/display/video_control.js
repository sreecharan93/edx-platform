(function (requirejs, require, define) {

// VideoPlayer module.
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
        registerCallbacks(state);
    };

    // ***************************************************************
    // Private functions start here.
    // ***************************************************************

    // function makeFunctionsPublic(state)
    //
    //     Functions which will be accessible via 'state' object. When called, these functions will
    //     get the 'state' object as a context.
    function makeFunctionsPublic(state) {
        state.videoControl.play           = bind(play, state);
        state.videoControl.pause          = bind(pause, state);
        state.videoControl.togglePlayback = bind(togglePlayback, state);
    }

    // function renderElements(state)
    //
    //     Create any necessary DOM elements, attach them, and set their initial configuration. Also
    //     make the created DOM elements available via the 'state' object. Much easier to work this
    //     way - you don't have to do repeated jQuery element selects.
    function renderElements(state) {
        var el;

        el = $(
            '<div class="slider"></div>' +
            '<div>' +
                '<ul class="vcr">' +
                    '<li><a class="video_control" href="#"></a></li>' +
                    '<li><div class="vidtime">0:00 / 0:00</div></li>' +
                '</ul>' +
                '<div class="secondary-controls">' +
                    '<a href="#" class="add-fullscreen" title="Fill browser">Fill Browser</a>' +
                '</div>' +
            '</div>'
        );

        state.videoControl.el = state.el.find('.video-controls');
        state.videoControl.el.append(el);

        state.videoControl.playPauseEl = state.videoControl.el.find('.video_control');

        if (!onTouchBasedDevice()) {
            state.videoControl.pause();
        } else {
            state.videoControl.play();
        }
    }

    // function bindHandlers(state)
    //
    //     Bind any necessary function callbacks to DOM events (click, mousemove, etc.).
    function bindHandlers(state) {
        state.videoControl.playPauseEl.click(state.videoControl.togglePlayback);
    }

    // function registerCallbacks(state)
    //
    //     Register function callbacks to be called by other modules.
    function registerCallbacks(state) {
        state.callbacks.videoPlayer.onPlay.push(state.videoControl.play);
        state.callbacks.videoPlayer.onPause.push(state.videoControl.pause);
    }

    // ***************************************************************
    // Public functions start here.
    // These are available via the 'state' object. Their context ('this' keyword) is the 'state' object.
    // The magic private function that makes them available and sets up their context is makeFunctionsPublic().
    // ***************************************************************

    function play() {
        this.videoControl.playPauseEl.removeClass('play').addClass('pause').html('Pause');
        this.videoControl.state = 'playing';
    }

    function pause() {
        this.videoControl.playPauseEl.removeClass('pause').addClass('play').html('Play');
        this.videoControl.state = 'paused';
    }

    function togglePlayback(event) {
        event.preventDefault();

        if (this.videoControl.state === 'playing') {
            $.each(this.callbacks.videoControl.togglePlaybackPause, function (index, value) {
                // Each value is a registered callback (JavaScript function object).
                value();
            });
        } else if (this.videoControl.state === 'paused') {
            $.each(this.callbacks.videoControl.togglePlaybackPlay, function (index, value) {
                // Each value is a registered callback (JavaScript function object).
                value();
            });
        }
    }

});

}(RequireJS.requirejs, RequireJS.require, RequireJS.define));
