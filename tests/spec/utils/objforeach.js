define(['utils'], function(utils) {
  'use strict';

  describe('Utils.objForEach()', function() {

    it('should loop through an objects keys', function() {
      var keys = [], values = [];
      utils.objForEach({a:1, b:2}, function(key, value) {
        keys.push(key);
        values.push(value);
      });
      expect(keys).to.eql(['a','b']);
      expect(values).to.eql([1, 2]);
    });

  });

});
