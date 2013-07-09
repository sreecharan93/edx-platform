(function() {
  describe('VideoProgressSliderAlpha', function() {
    beforeEach(function() {
      window.onTouchBasedDevice = jasmine.createSpy('onTouchBasedDevice').andReturn(false);
    });

    describe('constructor', function() {
      describe('on a non-touch based device', function() {
        beforeEach(function() {
          spyOn($.fn, 'slider').andCallThrough();
          this.player = jasmine.stubVideoPlayerAlpha(this);
          this.progressSlider = this.player.progressSlider;
        });

        it('build the slider', function() {
          expect(this.progressSlider.slider).toBe('.slider');
          expect($.fn.slider).toHaveBeenCalledWith({
            range: 'min',
            change: this.progressSlider.onChange,
            slide: this.progressSlider.onSlide,
            stop: this.progressSlider.onStop
          });
        });

        it('build the seek handle', function() {
          expect(this.progressSlider.handle).toBe('.slider .ui-slider-handle');
          expect($.fn.qtip).toHaveBeenCalledWith({
            content: "0:00",
            position: {
              my: 'bottom center',
              at: 'top center',
              container: this.progressSlider.handle
            },
            hide: {
              delay: 700
            },
            style: {
              classes: 'ui-tooltip-slider',
              widget: true
            }
          });
        });
      });

      describe('on a touch-based device', function() {
        beforeEach(function() {
          window.onTouchBasedDevice.andReturn(true);
          spyOn($.fn, 'slider').andCallThrough();
          this.player = jasmine.stubVideoPlayerAlpha(this);
          this.progressSlider = this.player.progressSlider;
        });

        it('does not build the slider', function() {
          expect(this.progressSlider.slider).toBeUndefined;
          expect($.fn.slider).not.toHaveBeenCalled();
        });
      });
    });

    describe('play', function() {
      beforeEach(function() {
        spyOn(VideoProgressSliderAlpha.prototype, 'buildSlider').andCallThrough();
        this.player = jasmine.stubVideoPlayerAlpha(this);
        this.progressSlider = this.player.progressSlider;
      });

      describe('when the slider was already built', function() {
        beforeEach(function() {
          this.progressSlider.play();
        });

        it('does not build the slider', function() {
          expect(this.progressSlider.buildSlider.calls.length).toEqual(1);
        });
      });

      describe('when the slider was not already built', function() {
        beforeEach(function() {
          spyOn($.fn, 'slider').andCallThrough();
          this.progressSlider.slider = null;
          this.progressSlider.play();
        });

        it('build the slider', function() {
          expect(this.progressSlider.slider).toBe('.slider');
          expect($.fn.slider).toHaveBeenCalledWith({
            range: 'min',
            change: this.progressSlider.onChange,
            slide: this.progressSlider.onSlide,
            stop: this.progressSlider.onStop
          });
        });
        
        it('build the seek handle', function() {
          expect(this.progressSlider.handle).toBe('.ui-slider-handle');
          expect($.fn.qtip).toHaveBeenCalledWith({
            content: "0:00",
            position: {
              my: 'bottom center',
              at: 'top center',
              container: this.progressSlider.handle
            },
            hide: {
              delay: 700
            },
            style: {
              classes: 'ui-tooltip-slider',
              widget: true
            }
          });
        });
      });
    });

    describe('updatePlayTime', function() {
      beforeEach(function() {
        this.player = jasmine.stubVideoPlayerAlpha(this);
        this.progressSlider = this.player.progressSlider;
      });

      describe('when frozen', function() {
        beforeEach(function() {
          spyOn($.fn, 'slider').andCallThrough();
          this.progressSlider.frozen = true;
          this.progressSlider.updatePlayTime(20, 120);
        });

        it('does not update the slider', function() {
          expect($.fn.slider).not.toHaveBeenCalled();
        });
      });
      
      describe('when not frozen', function() {
        beforeEach(function() {
          spyOn($.fn, 'slider').andCallThrough();
          this.progressSlider.frozen = false;
          this.progressSlider.updatePlayTime(20, 120);
        });

        it('update the max value of the slider', function() {
          expect($.fn.slider).toHaveBeenCalledWith('option', 'max', 120);
        });

        it('update current value of the slider', function() {
          expect($.fn.slider).toHaveBeenCalledWith('value', 20);
        });
      });
    });

    describe('onSlide', function() {
      beforeEach(function() {
        this.player = jasmine.stubVideoPlayerAlpha(this);
        this.progressSlider = this.player.progressSlider;
        spyOnEvent(this.progressSlider, 'slide_seek');
        this.progressSlider.onSlide({}, {
          value: 20
        });
      });

      it('freeze the slider', function() {
        expect(this.progressSlider.frozen).toBeTruthy();
      });

      it('update the tooltip', function() {
        expect($.fn.qtip).toHaveBeenCalled();
      });

      it('trigger seek event', function() {
        expect('slide_seek').toHaveBeenTriggeredOn(this.progressSlider);
        expect(this.player.currentTime).toEqual(20);
      });
    });

    describe('onChange', function() {
      beforeEach(function() {
        this.player = jasmine.stubVideoPlayerAlpha(this);
        this.progressSlider = this.player.progressSlider;
        this.progressSlider.onChange({}, {
          value: 20
        });
      });
      it('update the tooltip', function() {
        expect($.fn.qtip).toHaveBeenCalled();
      });
    });

    describe('onStop', function() {
      beforeEach(function() {
        this.player = jasmine.stubVideoPlayerAlpha(this);
        this.progressSlider = this.player.progressSlider;
        spyOnEvent(this.progressSlider, 'slide_seek');
        this.progressSlider.onStop({}, {
          value: 20
        });
      });

      it('freeze the slider', function() {
        expect(this.progressSlider.frozen).toBeTruthy();
      });

      it('trigger seek event', function() {
        expect('slide_seek').toHaveBeenTriggeredOn(this.progressSlider);
        expect(this.player.currentTime).toEqual(20);
      });

      it('set timeout to unfreeze the slider', function() {
        expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 200);
        window.setTimeout.mostRecentCall.args[0]();
        expect(this.progressSlider.frozen).toBeFalsy();
      });
    });
    
    describe('updateTooltip', function() {
      beforeEach(function() {
        this.player = jasmine.stubVideoPlayerAlpha(this);
        this.progressSlider = this.player.progressSlider;
        this.progressSlider.updateTooltip(90);
      });
      
      it('set the tooltip value', function() {
        expect($.fn.qtip).toHaveBeenCalledWith('option', 'content.text', '1:30');
      });
    });
  });

}).call(this);
