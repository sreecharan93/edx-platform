(function() {
  describe('VideoSpeedControlAlpha', function() {
    beforeEach(function() {
      window.onTouchBasedDevice = jasmine.createSpy('onTouchBasedDevice').andReturn(false);
      jasmine.stubVideoPlayerAlpha(this);
      $('.speeds').remove();
    });

    describe('constructor', function() {
      describe('always', function() {
        beforeEach(function() {
          this.speedControl = new VideoSpeedControlAlpha({
            el: $('.secondary-controls'),
            speeds: this.video.speeds,
            currentSpeed: '1.0'
          });
        });

        it('add the video speed control to player', function() {
          var li, secondaryControls, _this = this;
          secondaryControls = $('.secondary-controls');
          li = secondaryControls.find('.video_speeds li');
          expect(secondaryControls).toContain('.speeds');
          expect(secondaryControls).toContain('.video_speeds');
          expect(secondaryControls.find('p.active').text()).toBe('1.0x');
          expect(li.filter('.active')).toHaveData('speed', this.speedControl.currentSpeed);
          expect(li.length).toBe(this.speedControl.speeds.length);
          $.each(li.toArray().reverse(), function(index, link) {
            expect($(link)).toHaveData('speed', _this.speedControl.speeds[index]);
            expect($(link).find('a').text()).toBe(_this.speedControl.speeds[index] + 'x');
          });
        });

        it('bind to change video speed link', function() {
          expect($('.video_speeds a')).toHandleWith('click', this.speedControl.changeVideoSpeed);
        });
      });

      describe('when running on touch based device', function() {
        beforeEach(function() {
          window.onTouchBasedDevice.andReturn(true);
          $('.speeds').removeClass('open');
          this.speedControl = new VideoSpeedControlAlpha({
            el: $('.secondary-controls'),
            speeds: this.video.speeds,
            currentSpeed: '1.0'
          });
        });

        it('open the speed toggle on click', function() {
          $('.speeds').click();
          expect($('.speeds')).toHaveClass('open');
          $('.speeds').click();
          expect($('.speeds')).not.toHaveClass('open');
        });
      });
      
      describe('when running on non-touch based device', function() {
        beforeEach(function() {
          $('.speeds').removeClass('open');
          this.speedControl = new VideoSpeedControlAlpha({
            el: $('.secondary-controls'),
            speeds: this.video.speeds,
            currentSpeed: '1.0'
          });
        });

        it('open the speed toggle on hover', function() {
          $('.speeds').mouseenter();
          expect($('.speeds')).toHaveClass('open');
          $('.speeds').mouseleave();
          expect($('.speeds')).not.toHaveClass('open');
        });

        it('close the speed toggle on mouse out', function() {
          $('.speeds').mouseenter().mouseleave();
          expect($('.speeds')).not.toHaveClass('open');
        });

        it('close the speed toggle on click', function() {
          $('.speeds').mouseenter().click();
          expect($('.speeds')).not.toHaveClass('open');
        });
      });
    });

    describe('changeVideoSpeed', function() {
      beforeEach(function() {
        this.speedControl = new VideoSpeedControlAlpha({
          el: $('.secondary-controls'),
          speeds: this.video.speeds,
          currentSpeed: '1.0'
        });
        this.video.setSpeed('1.0');
      });

      describe('when new speed is the same', function() {
        beforeEach(function() {
          spyOnEvent(this.speedControl, 'speedChange');
          $('li[data-speed="1.0"] a').click();
        });
        
        it('does not trigger speedChange event', function() {
          expect('speedChange').not.toHaveBeenTriggeredOn(this.speedControl);
        });
      });
      
      describe('when new speed is not the same', function() {
        beforeEach(function() {
          var _this = this;
          this.newSpeed = null;
          $(this.speedControl).bind('speedChange', function(event, newSpeed) {
            _this.newSpeed = newSpeed;
          });
          spyOnEvent(this.speedControl, 'speedChange');
          $('li[data-speed="0.75"] a').click();
        });
        it('trigger speedChange event', function() {
          expect('speedChange').toHaveBeenTriggeredOn(this.speedControl);
          expect(this.newSpeed).toEqual(0.75);
        });
      });
    });
    
    describe('onSpeedChange', function() {
      beforeEach(function() {
        this.speedControl = new VideoSpeedControlAlpha({
          el: $('.secondary-controls'),
          speeds: this.video.speeds,
          currentSpeed: '1.0'
        });
        $('li[data-speed="1.0"] a').addClass('active');
        this.speedControl.setSpeed('0.75');
      });
      
      it('set the new speed as active', function() {
        expect($('.video_speeds li[data-speed="1.0"]')).not.toHaveClass('active');
        expect($('.video_speeds li[data-speed="0.75"]')).toHaveClass('active');
        expect($('.speeds p.active')).toHaveHtml('0.75x');
      });
    });
  });

}).call(this);
