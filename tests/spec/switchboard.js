define(['switchboard', 'utils'], function(switchboard, utils) {

  describe('Switchboard', function() {
    'use strict';

    it('should listen for plyfe messages', function(done) {
      utils.addEvent(window, 'message', function(e) {
        expect(e.data).to.be('testing');
        done();
      });

      postMessage('testing', '*');
    });
  });

});
