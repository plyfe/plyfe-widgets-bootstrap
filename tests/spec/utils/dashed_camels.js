define(['utils'], function(utils) {
  'use strict';

  describe('Utils.dashedToCamel()', function() {

    it('should camelCase a string', function() {
      expect(utils.dashedToCamel(1)).to.be('1');
      expect(utils.dashedToCamel(null)).to.be('null');
      expect(utils.dashedToCamel(undefined)).to.be('undefined');
      expect(utils.dashedToCamel('a')).to.be('a');
      expect(utils.dashedToCamel('a-b')).to.be('aB');
      expect(utils.dashedToCamel('-a-b-c-')).to.be('ABC-');
    });

  });

  describe('Utils.camelToDashed()', function() {

    it('should dasherize a camelCased string', function() {
      expect(utils.camelToDashed(1)).to.be('1');
      expect(utils.camelToDashed(null)).to.be('null');
      expect(utils.camelToDashed(undefined)).to.be('undefined');
      expect(utils.camelToDashed('a')).to.be('a');
      expect(utils.camelToDashed('aB')).to.be('a-b');
      expect(utils.camelToDashed('aBCD')).to.be('a-b-c-d');
    });

  });

});
