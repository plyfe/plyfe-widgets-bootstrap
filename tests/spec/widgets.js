/*global Plyfe */

// Don't auto create widgets
window.plyfeAsyncInit = function() {};

describe('Widget created', function() {
  'use strict';

  it("should have created widget #1's <iframe>", function() {
    expect(document.querySelector('#widget-1 > iframe')).to.be(null);
    Plyfe.createWidgets();
    var iframe = document.querySelector('#widget-1 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://plyfe.me/w/r4m-embed/rd/4?theme=plyfe&height=100');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have found a custom URL for widget #2', function() {
    var iframe = document.querySelector('#widget-2 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('http://localhost/w/fake/rd/1?theme=drinkup&theme_data=%7B%22bg_color%22%3A%20%22%23FFFFFF%22%7D&treatment=B&height=100');
  });

});
