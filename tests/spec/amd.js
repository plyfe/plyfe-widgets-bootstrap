require(['plyfe-widget'], function(plyfe) {

  describe('Loaded via an AMD loader', function() {
    'use strict';

    it('should have loaded', function(done) {
      expect(plyfe).to.be.ok();
      done();
    });
  });

});
