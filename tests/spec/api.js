/*global Plyfe */
describe('Api', function() {
  'use strict';

  it('should listen for messages', function(done) {
    Plyfe.onCardStart = function(card, user) {
      expect(card).to.not.be(null);
      expect(user).to.not.be(null);
      done();
    };

    var data = {
      card: {id: 1, type: 'poll_challenge'},
      user: {id: 1}
    };

    window.postMessage('plyfe:card:start' + '\n' + JSON.stringify(data), '*');
  });

});
