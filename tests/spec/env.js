/*global Plyfe */
describe('Loaded', function() {
  'use strict';

  it('should have loaded', function() {
    expect(Plyfe).to.be.ok();
  });

  it('should have changed to use test.plyfe.me', function() {
    expect(Plyfe.settings.domain).to.be('test.plyfe.me');
  });

  it('should use the default test env port', function() {
    expect(Plyfe.settings.port).to.be(999);
  });

  it('should use https for port 443', function() {
    expect(Plyfe.settings.scheme).to.be('https');
  });
});
