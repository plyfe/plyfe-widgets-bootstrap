define(['utils'], function(utils) {
  'use strict';

  describe('Utils.addClass()', function() {

    var div = document.createElement('div');
    beforeEach(function() {
      div.className = '   foo  bar  ';
    });

    it('should add a classes', function() {
      utils.addClass(div, 'baz');
      expect(div.className).to.be('foo bar baz');
      utils.addClass(div, 1);
      expect(div.className).to.be('foo bar baz 1');
      utils.addClass(div, null);
      expect(div.className).to.be('foo bar baz 1 null');
      utils.addClass(div, undefined);
      expect(div.className).to.be('foo bar baz 1 null undefined');
      utils.addClass(div, [1,2,3]);
      expect(div.className).to.be('foo bar baz 1 null undefined 1,2,3');
      utils.addClass(div, {a:1});
      expect(div.className).to.be('foo bar baz 1 null undefined 1,2,3 [object Object]');
    });

    it('should trim the name', function() {
      utils.addClass(div, '1');
      expect(div.className).to.be('foo bar 1');
      utils.addClass(div, ' 2');
      expect(div.className).to.be('foo bar 1 2');
      utils.addClass(div, ' 3 ');
      expect(div.className).to.be('foo bar 1 2 3');
      utils.addClass(div, '   4  ');
      expect(div.className).to.be('foo bar 1 2 3 4');
    });

    it('shouldn\'t add the same name', function() {
      utils.addClass(div, '1');
      expect(div.className).to.be('foo bar 1');
      utils.addClass(div, '1');
      expect(div.className).to.be('foo bar 1');
    });
  });

});
