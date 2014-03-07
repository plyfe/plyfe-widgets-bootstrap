/*global Plyfe */

describe('Widget created', function() {
  'use strict';

  it("should have created widget #1's <iframe>", function() {
    expect(document.querySelector('#widget-1 > iframe')).to.be(null);
    Plyfe.createWidgets();
    var iframe = document.querySelector('#widget-1 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://plyfe.me/w/r4m-embed/lb/4?theme=plyfe&max-width=480');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have found a custom URL for widget #2', function() {
    var iframe = document.querySelector('#widget-2 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('http://localhost/w/fake/lb/1?theme=drinkup&body-bg-color=%23FFAACC');
  });

});
