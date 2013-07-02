(function() {
  describe('VideoAlpha HTML5Video', function() {
    var state, player;

    beforeEach(function() {
      loadFixtures('videoalpha_html5.html');
      state = new VideoAlpha('#example');
      player = state.videoPlayer.player;
    });

    describe('events:', function() {
      beforeEach(function() {
        spyOn(player, 'callStateChangeCallback').andCallThrough();
      });
    
      describe('click', function() {
        var playbackRates = [0.75, 1.0, 1.25, 1.5];
        describe('when player is paused', function() {
          beforeEach(function() {
            spyOn(player.video, 'play').andCallThrough();
            player.playerState = 2;
            $(player.videoEl).trigger('click');
          });

          it('native play event was called', function() {
            expect(player.video.play).toHaveBeenCalled();
          });

          it('player state was changed', function() {
            waitsFor(function() {
              return player.getPlayerState() !== 2; 
            }, 'Player state should be changed', 1000);
            runs(function() {
              expect(player.getPlayerState()).toBe(1);
            });
          });

          it('callback was called', function() {
            waitsFor(function() {
              return state.videoPlayer.player.getPlayerState() !== 2;
            }, 'Player state should be changed', 1000);
            runs(function() {
              expect(player.callStateChangeCallback).toHaveBeenCalled();
            });
          });
        });
      });

      describe('when player is played', function() {
        beforeEach(function() {
          spyOn(player.video, 'pause').andCallThrough();
          player.playerState  = 1;
          $(player.videoEl).trigger('click');
        });

        it('native event was called', function() {
          expect(player.video.pause).toHaveBeenCalled();
        });

        it('player state was changed', function() {
          waitsFor(function() {
            return player.getPlayerState() !== 1;
          }, 'Player state should be changed', 1000);
          runs(function() {
            expect(player.getPlayerState()).toBe(2);
          });
        });

        it('callback was called', function() {
          waitsFor(function() {
            return player.getPlayerState() !== 1;
          }, 'Player state should be changed', 1000);
          runs(function() {
            expect(player.callStateChangeCallback).toHaveBeenCalled();
          });
        });
      });

      describe('play', function() {
        beforeEach(function() {
          spyOn(player.video, 'play').andCallThrough();
          player.playerState = 2;
          player.playVideo();
        });  
        
        it('native event was called', function() {
          expect(player.video.play).toHaveBeenCalled();
        });

        it('player state was changed', function() {
          waitsFor(function() {
            return player.getPlayerState() !== 2;
          }, 'Player state should be changed', 1000); // Why 1000ms and not something else?
          runs(function() {
            expect(player.getPlayerState()).toBe(1);
          });
        });

        it('callback was called', function() {
          waitsFor(function() {
            return player.getPlayerState() !== 2; 
          }, 'Player state should be changed', 1000);
          runs(function() {
            expect(player.callStateChangeCallback).toHaveBeenCalled();
          });
        });
      });

      describe('pause', function() {
        beforeEach(function() {
          spyOn(player.video, 'pause').andCallThrough();
          player.playVideo();
          player.pauseVideo();
        });

        it('native event was called', function() {
          expect(player.video.pause).toHaveBeenCalled();
        });

        it('player state was changed', function() {
          waitsFor(function() {
            return player.getPlayerState() !== -1;
          }, 'Player state should be changed', 1000);
          runs(function() {
            expect(player.getPlayerState()).toBe(2);
          });
        });

        it('callback was called', function() {
          waitsFor(function() {
            return player.getPlayerState() !== -1;
          }, 'Player state should be changed', 1000);
          runs(function() {
            expect(player.callStateChangeCallback).toHaveBeenCalled();
          });
        });
      });
    
      describe('canplay', function() {
        beforeEach(function() {
          waitsFor(function() {
            return player.getPlayerState() !== -1;
          }, 'Video cannot be played', 1000);
        });

        // FIX, DOESN'T PASS
        it('player state was changed', function() {
          runs(function() {
            expect(player.getPlayerState()).toBe(2);
          });
        });

        // FIX, DOESN'T PASS
        it('end property was defined', function() {
          runs(function() {
            expect(player.end).not.toBeNull();
          });
        });

        // FIX, DOESN'T PASS
        it('start position was defined', function() {
          runs(function() {
            expect(player.video.currentTime).toBe(player.start);
          });
        });

        // FIX, DOESN'T PASS
        it('callback was called', function() {
          runs(function() {
            expect(state.videoPlayer.onReady).toHaveBeenCalled();
          });
        });
      });

      describe('ended', function() {
        beforeEach(function() {
          waitsFor(function() {
            return player.getPlayerState() !== -1;
          }, 'Video cannot be played', 1000);
        });

        // FIX, DOESN'T PASS
        it('player state was changed', function() {
          runs(function() {
            jasmine.fireEvent(player.videoEl, "ended");
            expect(player.getPlayerState()).toBe(2);
          });
        });

        // FIX, DOESN'T PASS
        it('callback was called', function() {
          jasmine.fireEvent(player.videoEl, "ended");
          expect(player.callStateChangeCallback).toHaveBeenCalled();
        });
      });
    });  

    describe('methods', function() {
      var volume, seek, duration, playbackRate;

      beforeEach(function() {
        volume = player.video.volume;
        seek = player.video.currentTime;
        //FIX, DOESN'T PASS
        /*waitsFor((function() {
          volume = state.videoPlayer.player.video.volume;
          seek = state.videoPlayer.player.video.currentTime;
          state.videoPlayer.player.getPlayerState() === -1; //Temporary
        }), 'Video cannot be played', 1000);*/
      });

      it('pauseVideo', function() {
        runs(function() {
          spyOn(player.video, 'pause').andCallThrough();
          player.pauseVideo();
          expect(player.video.pause).toHaveBeenCalled();
        });
      });

      describe('seekTo', function() {
        //FIX DOESN'T PASS
        it('set new correct value', function() {
          runs(function() {
            player.seekTo(2);
            expect(player.getCurrentTime()).toBe(2);
          });
        });
          
        it('set new inccorrect values', function() {
          runs(function() {
            player.seekTo(-50);
            expect(player.getCurrentTime()).toBe(seek);
            player.seekTo('5');
            expect(player.getCurrentTime()).toBe(seek);
            player.seekTo(500000);
            expect(player.getCurrentTime()).toBe(seek);
          });
        });
      });

      describe('setVolume', function() {
        it('set new correct value', function() {
          runs(function() {
            player.setVolume(50);
            expect(player.getVolume()).toBe(50 * 0.01);
          });
        });

        it('set new incorrect values', function() {
          runs(function() {
            player.setVolume(-50);
            expect(player.getVolume()).toBe(volume);
            player.setVolume('5');
            expect(player.getVolume()).toBe(volume);
            player.setVolume(500000);
            expect(player.getVolume()).toBe(volume);
          });
        });
      });

      //FIX DOESN'T PASS
      it('getCurrentTime', function() {
        runs(function() {
          player.video.currentTime = 3;
          expect(player.getCurrentTime()).toBe(player.video.currentTime);
        });
      });

      it('playVideo', function() {
        runs(function() {
          spyOn(player.video, 'play').andCallThrough();
          player.playVideo();
          expect(player.video.play).toHaveBeenCalled();
        });
      });

      it('getPlayerState', function() {
        runs(function() {
          player.playerState = 1;
          expect(player.getPlayerState()).toBe(1);
          player.playerState = 0;
          expect(player.getPlayerState()).toBe(0);
        });
      });

      it('getVolume', function() {
        runs(function() {
          volume = player.video.volume = 0.5;
          expect(player.getVolume()).toBe(volume);
        });
      });

      //FIX DOESN'T PASS
      it('getDuration', function() {
        runs(function() {
          duration = player.video.duration;
          expect(player.getDuration()).toBe(duration);
        });
      });

      describe('setPlaybackRate', function() {
        it('set a correct value', function() {
          playbackRate = 1.5;
          player.setPlaybackRate(playbackRate);
          expect(player.video.playbackRate).toBe(playbackRate);
        });

        it('set NaN value', function() {
          playbackRate = NaN;
          player.setPlaybackRate(playbackRate);
          expect(player.video.playbackRate).toBe(1.0);
        });
      });

      //FIX DOESN'T PASS
      it('getAvailablePlaybackRates', function() {
        expect(player.getAvailablePlaybackRates()).toEqual(playbackRates);
      });
    });

  });
}).call(this);
