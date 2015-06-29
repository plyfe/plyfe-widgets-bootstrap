/*global Plyfe */
describe('Api', function() {
  'use strict';

  it('should send card and user data with cardStart', function(done) {
    Plyfe.onCardStart = function(card, user) {
      expect(card).to.not.be(null);
      expect(user).to.not.be(null);
      expect(card.id).to.be(1);
      expect(card.type).to.be('poll_challenge');
      expect(user.id).to.be(1);
      done();
    };

    var data = {
      card: {id: 1, type: 'poll_challenge'},
      user: {id: 1}
    };

    window.postMessage('plyfe:card:start' + '\n' + JSON.stringify(data), '*');
  });

  it("should send default data with cardStart", function(done) {
    Plyfe.onCardStart = function(card, user) {
      expect(card).to.not.be(null);
      expect(user).to.not.be(null);
      expect(card.id).to.be(0);
      expect(card.type).to.be('no_type');
      expect(user.id).to.be(0);
      done();
    };

    window.postMessage('plyfe:card:start' + '\n' + JSON.stringify({}), '*');
  });

  it('should send card and user data with cardComplete', function(done) {
    Plyfe.onCardComplete = function(card, user) {
      expect(card).to.not.be(null);
      expect(user).to.not.be(null);
      expect(card.id).to.be(1);
      expect(card.type).to.be('poll_challenge');
      expect(user.id).to.be(1);
      done();
    };

    var data = {
      card: {id: 1, type: 'poll_challenge'},
      user: {id: 1}
    };

    window.postMessage('plyfe:card:complete' + '\n' + JSON.stringify(data), '*');
  });

  it("should send default data with cardComplete", function(done) {
    Plyfe.onCardComplete = function(card, user) {
      expect(card).to.not.be(null);
      expect(user).to.not.be(null);
      expect(card.id).to.be(0);
      expect(card.type).to.be('no_type');
      expect(user.id).to.be(0);
      done();
    };

    window.postMessage('plyfe:card:complete' + '\n' + JSON.stringify({}), '*');
  });

});
