define(['switchboard'], function(switchboard) {
  'use strict';

  switchboard.setup();

  describe('Switchboard', function() {

    it('should listen for messages', function(done) {
      switchboard.on('testing', function() {
        switchboard.off('testing');
        expect(true).to.be(true);
        done();
      });

      switchboard.send({}, 'testing', window);
    });

    it('should ignore un-serialized object payloads', function(done) {
      var caughtMessage = false;

      switchboard.on('*', function() {
        caughtMessage = true;
      });

      window.postMessage({a: 1}, '*');

      setTimeout(function() {
        expect(caughtMessage).to.be(false);
        switchboard.off('*');
        done();
      }, 50);
    });

  });

});
