define(['utils'], function(utils) {
  'use strict';

  var uniqueName = 'foo-' + new Date().getTime();
  var div = document.createElement('div');
  div.className = uniqueName + ' bar';
  document.body.appendChild(div);

  describe('Utils.getElementsByClassName()', function() {

    it('should find the div', function() {
      var divs = utils.getElementsByClassName(uniqueName);
      expect(divs.length).to.be(1);
      expect(divs[0].className).to.be(uniqueName + ' bar');
    });

    it('should not find any elements', function() {
      var divs = utils.getElementsByClassName('i-dont-exist');
      expect(divs.length).to.be(0);
    });

  });

});
