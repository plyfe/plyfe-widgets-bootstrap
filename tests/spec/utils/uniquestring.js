define(['utils'], function(utils) {
  'use strict';

  describe('Utils.uniqueString()', function() {

    it('should make a random string with the right length', function() {
      expect(utils.uniqueString(1).length).to.be(1);
      expect(utils.uniqueString(-1).length).to.be(0);
      expect(utils.uniqueString(10).length).to.be(10);
      expect(utils.uniqueString('a').length).to.be(0);
      expect(utils.uniqueString(null).length).to.be(0);
      expect(utils.uniqueString(undefined).length).to.be(0);
    });

  });

});
