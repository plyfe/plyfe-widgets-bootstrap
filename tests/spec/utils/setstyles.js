/*global Plyfe */

define(['utils'], function(utils) {
  'use strict';


  describe('Utils.setStyles()', function() {
    var div;

    beforeEach(function() {
      div = document.createElement('div');
    });

    it('should set style properties', function() {
      utils.setStyles(div, { width: '100px' });
      expect(div.style.width).to.be('100px');
      expect(div.style.height).to.be('');
    });

    it('should work with camel cased properties', function() {
      utils.setStyles(div, { marginLeft: '100px' });
      expect(div.style.marginLeft).to.be('100px');
    });

  });

});
