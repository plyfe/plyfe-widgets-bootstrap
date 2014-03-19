define(['utils'], function(utils) {
  'use strict';

  describe('Utils.trim()', function() {

    it('should trim whitespace', function() {
      expect(utils.trim(' foo ')).to.be('foo');
      expect(utils.trim(' foo  bar ')).to.be('foo  bar');
      expect(utils.trim(' foo\n')).to.be('foo');
      expect(utils.trim('\r foo \r\n')).to.be('foo');
    });

  });

});
