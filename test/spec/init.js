describe('Plyfe Widgets via AMD load', function() {
  'use strict';

  it('should have loaded', function(done) {
    require(['main'], function(plyfe) {
      expect(plyfe).to.be.ok();
      done();
    });
  });

});
