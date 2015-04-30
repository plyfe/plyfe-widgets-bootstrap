/*global Plyfe */

describe('Loaded alongside require.js', function() {
  "use strict";

  it('should have loaded', function() {
    expect(Plyfe).to.be.ok();
  });
});
