(function (requirejs, require, define) {

// VideoSpeedControl module.
define(
'videoalpha/display/video_speed_control.js',
['videoalpha/display/bind.js'],
function (bind) {

    // VideoSpeedControl() function - what this module "exports".
    return function (state) {
        state.videoSpeedControl = {};

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
        state.videoSpeedControl.changeVideoSpeed = bind(changeVideoSpeed, state);
        state.videoSpeedControl.setSpeed = bind(setSpeed, state);
        state.videoSpeedControl.reRender = bind(reRender, state);
    }

    // function renderElements(state)
    //
    //     Create any necessary DOM elements, attach them, and set their initial configuration. Also
    //     make the created DOM elements available via the 'state' object. Much easier to work this
    //     way - you don't have to do repeated jQuery element selects.
    function renderElements(state) {
        state.videoSpeedControl.speeds = state.speeds;

        state.videoSpeedControl.el = $(
            '<div class="speeds">' +
                '<a href="#">' +
                    '<h3>Speed</h3>' +
                    '<p class="active"></p>' +
                '</a>' +
                '<ol class="video_speeds"></ol>' +
            '</div>'
        );

        state.videoSpeedControl.videoSpeedsEl = state.videoSpeedControl.el.find('.video_speeds');

        state.videoControl.secondaryControlsEl.prepend(state.videoSpeedControl.el);

        $.each(state.videoSpeedControl.speeds, function(index, speed) {
            var link;

            link = $('<a>').attr({
                'href': '#'
             }).html('' + speed + 'x');

            state.videoSpeedControl.videoSpeedsEl.prepend($('<li>').attr('data-speed', speed).html(link));
        });

        state.videoSpeedControl.setSpeed(state.speed);
    }

    // function bindHandlers(state)
    //
    //     Bind any necessary function callbacks to DOM events (click, mousemove, etc.).
    function bindHandlers(state) {
        state.videoSpeedControl.videoSpeedsEl.find('a').on('click', state.videoSpeedControl.changeVideoSpeed);

        if (onTouchBasedDevice()) {
            state.videoSpeedControl.el.on('click', function(event) {
                event.preventDefault();
                $(this).toggleClass('open');
            });
        } else {
            state.videoSpeedControl.el.on('mouseenter', function() {
                $(this).addClass('open');
            });

            state.videoSpeedControl.el.on('mouseleave', function() {
                $(this).removeClass('open');
            });

            state.videoSpeedControl.el.on('click', function(event) {
                event.preventDefault();
                $(this).removeClass('open');
            });
        }
    }

    // function registerCallbacks(state)
    //
    //     Register function callbacks to be called by other modules.
    function registerCallbacks(state) {
        state.callbacks.videoPlayer.onSpeedSetChange.push(state.videoSpeedControl.reRender);
    }

    // ***************************************************************
    // Public functions start here.
    // These are available via the 'state' object. Their context ('this' keyword) is the 'state' object.
    // The magic private function that makes them available and sets up their context is makeFunctionsPublic().
    // ***************************************************************

    function setSpeed(speed) {
        this.videoSpeedControl.videoSpeedsEl.find('li').removeClass('active');
        this.videoSpeedControl.videoSpeedsEl.find("li[data-speed='" + speed + "']").addClass('active');
        this.videoSpeedControl.el.find('p.active').html('' + speed + 'x');
    }

    function changeVideoSpeed(event) {
        var _this;

        event.preventDefault();

        if (!$(event.target).parent().hasClass('active')) {
            this.videoSpeedControl.currentSpeed = $(event.target).parent().data('speed');

            this.videoSpeedControl.setSpeed(
                parseFloat(this.videoSpeedControl.currentSpeed).toFixed(2).replace(/\.00$/, '.0')
            );

            _this = this;

            $.each(this.callbacks.videoSpeedControl.changeVideoSpeed, function (index, value) {
                // Each value is a registered callback (JavaScript function object).
                value(_this.videoSpeedControl.currentSpeed);
            });
        }
    }

    function reRender(newSpeeds, currentSpeed) {
        var _this;

        this.videoSpeedControl.videoSpeedsEl.empty();
        this.videoSpeedControl.videoSpeedsEl.find('li').removeClass('active');
        this.videoSpeedControl.speeds = newSpeeds;

        _this = this;
        $.each(this.videoSpeedControl.speeds, function(index, speed) {
            var link, listItem;

            link = $('<a>').attr({
                'href': '#'
            }).html('' + speed + 'x');

            listItem = $('<li>').attr('data-speed', speed).html(link);

            if (speed === currentSpeed) {
                listItem.addClass('active');
            }

            _this.videoSpeedControl.videoSpeedsEl.prepend(listItem);
        });

        this.videoSpeedControl.videoSpeedsEl.find('a').on('click', this.videoSpeedControl.changeVideoSpeed);
    }

});

}(RequireJS.requirejs, RequireJS.require, RequireJS.define));

/*
// Generated by CoffeeScript 1.4.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.VideoSpeedControlAlpha = (function(_super) {

    __extends(VideoSpeedControlAlpha, _super);

    function VideoSpeedControlAlpha() {
      this.changeVideoSpeed = __bind(this.changeVideoSpeed, this);
      return VideoSpeedControlAlpha.__super__.constructor.apply(this, arguments);
    }

    VideoSpeedControlAlpha.prototype.bind = function() {
      this.$('.video_speeds a').click(this.changeVideoSpeed);
      if (onTouchBasedDevice()) {
        return this.$('.speeds').click(function(event) {
          event.preventDefault();
          return $(this).toggleClass('open');
        });
      } else {
        this.$('.speeds').mouseenter(function() {
          return $(this).addClass('open');
        });
        this.$('.speeds').mouseleave(function() {
          return $(this).removeClass('open');
        });
        return this.$('.speeds').click(function(event) {
          event.preventDefault();
          return $(this).removeClass('open');
        });
      }
    };

    VideoSpeedControlAlpha.prototype.render = function() {
      var _this = this;
      this.el.prepend("<div class=\"speeds\">\n  <a href=\"#\">\n    <h3>Speed</h3>\n    <p class=\"active\"></p>\n  </a>\n  <ol class=\"video_speeds\"></ol>\n</div>");
      $.each(this.speeds, function(index, speed) {
        var link;
        link = $('<a>').attr({
          href: "#"
        }).html("" + speed + "x");
        return _this.$('.video_speeds').prepend($('<li>').attr('data-speed', speed).html(link));
      });
      return this.setSpeed(this.currentSpeed);
    };

    VideoSpeedControlAlpha.prototype.reRender = function(newSpeeds, currentSpeed) {
      var _this = this;
      this.$('.video_speeds').empty();
      this.$('.video_speeds li').removeClass('active');
      this.speeds = newSpeeds;
      $.each(this.speeds, function(index, speed) {
        var link, listItem;
        link = $('<a>').attr({
          href: "#"
        }).html("" + speed + "x");
        listItem = $('<li>').attr('data-speed', speed).html(link);
        if (speed === currentSpeed) {
          listItem.addClass('active');
        }
        return _this.$('.video_speeds').prepend(listItem);
      });
      return this.$('.video_speeds a').click(this.changeVideoSpeed);
    };

    VideoSpeedControlAlpha.prototype.changeVideoSpeed = function(event) {
      event.preventDefault();
      if (!$(event.target).parent().hasClass('active')) {
        this.currentSpeed = $(event.target).parent().data('speed');
        $(this).trigger('speedChange', $(event.target).parent().data('speed'));
        return this.setSpeed(parseFloat(this.currentSpeed).toFixed(2).replace(/\.00$/, '.0'));
      }
    };

    VideoSpeedControlAlpha.prototype.setSpeed = function(speed) {
      this.$('.video_speeds li').removeClass('active');
      this.$(".video_speeds li[data-speed='" + speed + "']").addClass('active');
      return this.$('.speeds p.active').html("" + speed + "x");
    };

    return VideoSpeedControlAlpha;

  })(SubviewAlpha);

}).call(this);
*/
