var initCallbackCalled = false;
var initCallbackCount = 0;
function _customInitCallback() {
  'use strict';
  initCallbackCalled = true;
  initCallbackCount++;
}
window.customInitCall = _customInitCallback;

/*global Plyfe */
describe('Loaded', function() {
  'use strict';

  it('should have loaded', function() {
    expect(Plyfe).to.be.ok();
  });

  it('should have changed the default domain', function() {
    expect(Plyfe.settings.domain).to.be('example.com');
  });

  it('should have changed the default port', function() {
    expect(Plyfe.settings.port).to.be(8080);
  });

  it('should have changed the default URL scheme', function() {
    expect(Plyfe.settings.scheme).to.be('http');
  });

  it('should have changed the default global init callback', function(done) {
    // A race conditions between the DOMContentLoaded event and when this test
    // runs. To handle both cases we need to test to see if the custom Plyfe
    // callback is called already, if it is we are done. But if it isn't we need
    // to setup a async callback for Mocha's done() function.
    if(initCallbackCalled) {
      done();
    } else {
      window.customInitCall = function() {
        // Set the customInitCall back to the original fn handler in this file.
        window.customInitCall = _customInitCallback;
        done();
      };
    }
  });

  it('should handle multiple <script> tags', function(done) {
    var script = document.createElement('script');
    script.src = '../dist/plyfe-widgets-bootstrap.js';
    script.setAttribute('data-init-name', 'customInitCall');
    script.onload = function() {
      // wait a bit to make sure that the JS inside the second script tag has
      // time to execute.
      setTimeout(function() {
        expect(initCallbackCount).to.be(1);
        done();
      }, 20);
    };
    document.body.appendChild(script);
  });

});
