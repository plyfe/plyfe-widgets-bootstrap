define(['switchboard', 'utils'], function(switchboard, utils) {
  'use strict';

  describe('Switchboard', function() {

    it('should listen for plyfe messages', function(done) {
      utils.addEvent(window, 'message', function(e) {
        expect(e.data).to.be('testing');
        done();
      });

      window.postMessage('testing', '*');
    });
  });

});
