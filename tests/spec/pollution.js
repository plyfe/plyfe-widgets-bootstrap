// Mess with global JS properties before loading plyfe-widgets-bootstrap.js to simulate
// our <script> being included inside a hostile webpage.

// Add stuff to the Object.prototype to mess up simple `for in`  loops
Object.prototype.foobar = function() {
  'use strict';
  return 'foobar';
};

// Set undefined to something weird. Only applicable for non-ES5 browsers. E.g
// IE <= 8
window.undefined = '__undefined__';
var undefinedIsOverrideable = (undefined !== void 0);


describe('Hostile Page', function() {
  'use strict';

  it('should mess up simple for ... in loops', function() {
    var obj = { a: 'b' };
    var names = [];

    for(var name in obj) {
      // NOTE: missing .hasOwnProperty check here is on purpose
      names.push(name);
    }

    expect(names).to.eql(['a', 'foobar']);
  });

  if(undefinedIsOverrideable) {
    it('should have overwritten undefined', function() {
      var undef = void 0; // a truly undefined variable
      expect(undefined).to.not.be(undef);
    });
  }

});
