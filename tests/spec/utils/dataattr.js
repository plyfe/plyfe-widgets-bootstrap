define(['utils'], function(utils) {
  'use strict';

  var div = document.createElement('div');
  div.setAttribute('data-foo', 'bar');
  div.setAttribute('data-foo-bar', 'baz');
  div.setAttribute('data-numbers-are-strings', 1);

  describe('Utils.dataAttr()', function() {

    it('should retrieve string values', function() {
      expect(utils.dataAttr(div, 'foo')).to.be('bar');
      expect(utils.dataAttr(div, 'foo-bar')).to.be('baz');
      expect(utils.dataAttr(div, 'numbers-are-strings')).to.be('1');
    });

    it('should work with a default value', function() {
      expect(utils.dataAttr(div, 'nogood', 'defaultval')).to.be('defaultval');
    });

    it('should expect a DOM node', function() {
      expect(utils.dataAttr).withArgs(null, 'foo').to.throwException();
    });

  });

});
