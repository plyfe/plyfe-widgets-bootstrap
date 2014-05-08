require(['plyfe-widgets-bootstrap'], function(plyfe) {
  'use strict';

  describe('Loaded via an AMD loader', function() {

    it('should have loaded', function(done) {
      expect(plyfe).to.be.ok();
      done();
    });
  });

});
