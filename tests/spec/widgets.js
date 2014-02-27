/*global Plyfe */

describe('Widget created', function() {
  'use strict';

  it('should have found a widget <div>', function() {
    expect(document.querySelector('#widget-1 > iframe')).to.be(null);
    Plyfe.createWidgets();
    var iframe = document.querySelector('#widget-1 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://plyfe.me/w/r4m-embed/lb/4');
  });

});
