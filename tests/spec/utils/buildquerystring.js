/*global Plyfe */

define(['utils'], function(utils) {
  'use strict';

  describe('Utils.buildQueryString()', function() {

    it('should stringify an object', function() {
      expect(utils.buildQueryString({})).to.be('');
      expect(utils.buildQueryString({a: 1})).to.be('a=1');
      expect(utils.buildQueryString({a: 1, b: 2})).to.be('a=1&b=2');
      expect(utils.buildQueryString({empty: ''})).to.be('empty=');
      expect(utils.buildQueryString({number: 1})).to.be('number=1');
    });

    it('should skip undefined', function() {
      expect(utils.buildQueryString({a: undefined})).to.be('');
      expect(utils.buildQueryString({a: 1, b: undefined})).to.be('a=1');
    });

    it('should blank nulls', function() {
      expect(utils.buildQueryString({a: null})).to.be('a');
      expect(utils.buildQueryString({a: 1, b: null})).to.be('a=1&b');
    });

    it('should URL encode unsafe values', function() {
      expect(utils.buildQueryString({'$&*@*': '@*16!^'})).to.be('%24%26*%40*=%40*16!%5E');
    });

    it('should work with a passed array', function() {
      expect(utils.buildQueryString([ 1, 2, 'foo' ])).to.be('0=1&1=2&2=foo');
    });

  });

});
