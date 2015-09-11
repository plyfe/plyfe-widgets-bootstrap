/*global Plyfe */

// Don't auto create widgets
window.plyfeAsyncInit = function() {};

describe('Widget created', function() {
  'use strict';

  it('should have created widget #1\'s <iframe>', function() {
    expect(document.querySelector('#widget-1 > iframe')).to.be(null);
    Plyfe.createWidgets();
    var iframe = document.querySelector('#widget-1 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://plyfe.me/w/rd/4');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have found a custom URL for widget #2', function() {
    var iframe = document.querySelector('#widget-2 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('http://localhost/w/rd/1?transparent=true');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have found a custom URL for widget #3', function() {
    var iframe = document.querySelector('#widget-3 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://development.plyfe.me:0/w/vs/5?transparent=true');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have the right URL for widget #4', function() {
    var iframe = document.querySelector('#widget-4 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://plyfe.me/s/5');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have found a custom URL for widget #5', function() {
    var iframe = document.querySelector('#widget-5 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('http://localhost/w/rd/1?transparent=true&custom_id=5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have the right URL for widget #6', function() {
    var iframe = document.querySelector('#widget-6 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://plyfe.me/s/5?custom_id=5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have found a custom URL for widget #7', function() {
    var iframe = document.querySelector('#widget-7 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('http://localhost/w/rd/1?transparent=true&click_tracker_id=5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8');
  });

  // NOTE: depends on Plyfe.createWidgets() being called above.
  it('should have the right URL for widget #8', function() {
    var iframe = document.querySelector('#widget-8 > iframe');
    expect(iframe).to.not.be(null);
    expect(iframe.src).to.be('https://plyfe.me/s/5?click_tracker_id=5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8');
  });
});
