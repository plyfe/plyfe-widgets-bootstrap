define(['api', 'utils', 'settings'], function(api, utils, settings) {
  'use strict';

  describe('API', function() {

    it('should work via JSONP', function(done) {
      var req = new api.JSONPRequest('callback1');
      req.open('get', 'fixtures/api/jsonp/simple.js');
      req.onreadystatechange = function() {
        expect(req.responseText).to.eql({ foo: 'bar' });
        done();
      };
      req.send();
    });

    it('should build the correct API URL', function() {
      expect(api.buildApiUrl('/foo')).to.be('https://plyfe.me/foo');
    });

    it('should allow URL overrides via settings', function() {
      settings.api.scheme = 'http';
      settings.api.domain = 'example.com';
      settings.api.port   = 80;
      expect(api.buildApiUrl('/foo')).to.be('http://example.com/foo');

      settings.api.scheme = 'https';
      settings.api.domain = 'development.plyfe.me';
      settings.api.port   = 3001;
      expect(api.buildApiUrl('/foo/bar')).to.be('https://development.plyfe.me:3001/foo/bar');
      expect(api.buildApiUrl('/foo/bar?a=1')).to.be('https://development.plyfe.me:3001/foo/bar?a=1');
    });

  });

});
