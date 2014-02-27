/*global Plyfe */

define(['utils'], function(utils) {
  'use strict';

  describe('Utils.buildUrl()', function() {

    it('should work the same for http or https', function() {
      expect(utils.buildUrl('http')).to.be('http://');
      expect(utils.buildUrl('https')).to.be('https://');
      expect(utils.buildUrl('http', 'foo.com')).to.be('http://foo.com');
      expect(utils.buildUrl('https', 'foo.com')).to.be('https://foo.com');
      expect(utils.buildUrl('http', 'foo.com', 80)).to.be('http://foo.com');
      expect(utils.buildUrl('https', 'foo.com', 443)).to.be('https://foo.com');
      expect(utils.buildUrl('http', 'foo.com', 8080)).to.be('http://foo.com:8080');
      expect(utils.buildUrl('https', 'foo.com', 4433)).to.be('https://foo.com:4433');
      expect(utils.buildUrl('http', 'foo.com', undefined)).to.be('http://foo.com');
      expect(utils.buildUrl('https', 'foo.com', undefined)).to.be('https://foo.com');
      expect(utils.buildUrl('http', 'foo.com', null)).to.be('http://foo.com');
      expect(utils.buildUrl('https', 'foo.com', null)).to.be('https://foo.com');
      expect(utils.buildUrl('http', 'foo.com', null, 'foo')).to.be('http://foo.com/foo');
      expect(utils.buildUrl('https', 'foo.com', null, 'foo')).to.be('https://foo.com/foo');
      expect(utils.buildUrl('http', 'foo.com', null, 'foo', {a:1})).to.be('http://foo.com/foo?a=1');
      expect(utils.buildUrl('https', 'foo.com', null, 'foo', {a:1})).to.be('https://foo.com/foo?a=1');
    });

    it('should normalize double slashes in path', function() {
      expect(utils.buildUrl('http', 'foo.com', null, '/')).to.be('http://foo.com/');
      expect(utils.buildUrl('http', 'foo.com', null, '//')).to.be('http://foo.com/');
      expect(utils.buildUrl('http', 'foo.com', null, 'foo')).to.be('http://foo.com/foo');
      expect(utils.buildUrl('http', 'foo.com', null, '/foo')).to.be('http://foo.com/foo');
      expect(utils.buildUrl('http', 'foo.com', null, '/foo/' + '/bar/')).to.be('http://foo.com/foo/bar/');
    });

  });

});
