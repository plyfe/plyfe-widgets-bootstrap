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

  it('should send default data with cardStart', function(done) {
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

  it('should send default data with cardComplete', function(done) {
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

  it('should send card, user and choice data with choiceSelection', function(done) {
    Plyfe.onChoiceSelection = function(card, user, choice) {
      expect(card).to.not.be(null);
      expect(user).to.not.be(null);
      expect(choice).to.not.be(null);
      expect(card.id).to.be(1);
      expect(card.type).to.be('trivia_challenge');
      expect(user.id).to.be(1);
      expect(choice.id).to.be(1);
      expect(choice.name).to.be('Choice 1');
      expect(choice.correct).to.be(true);
      done();
    };

    var data = {
      card: { id: 1, type: 'trivia_challenge' },
      user: { id: 1 },
      choice: { id: 1, name: 'Choice 1', correct: true }
    };

    window.postMessage('plyfe:choice:selection' + '\n' + JSON.stringify(data), '*');
  });

  it('should send default data with choiceSelection', function(done) {
    Plyfe.onChoiceSelection = function(card, user, choice) {
      expect(card).to.not.be(null);
      expect(user).to.not.be(null);
      expect(choice).to.not.be(null);
      expect(card.id).to.be(0);
      expect(card.type).to.be('no_type');
      expect(user.id).to.be(0);
      expect(choice.id).to.be(0);
      expect(choice.name).to.be('no_name');
      expect(choice.correct).to.be(null);
      done();
    };

    window.postMessage('plyfe:choice:selection' + '\n' + JSON.stringify({}), '*');
  });
});
