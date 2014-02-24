describe('Loaded via an AMD loader', function() {
  'use strict';

  it('should have loaded', function(done) {
    require(['plyfe-widget'], function(plyfe) {
      expect(plyfe).to.be.ok();
      done();
    });
  });

});
