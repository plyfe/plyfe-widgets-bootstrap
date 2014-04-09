define(['auth', 'api', 'utils', 'settings'], function(auth, api, utils, settings) {
  'use strict';

  describe('Login', function() {

    var sandbox, authToken = 'ABC-123';

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      settings.authToken = authToken;
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should not work without a authToken ', function() {
      settings.authToken = null;
      expect(auth.logIn).to.throwError();
    });

    it('should call login() callback', function(done) {
      require(['api'], function(api) {

        var stub = sandbox.stub(api, 'post', function(path, params, options) {
          expect(path).to.be('/external_sessions');
          expect(params).to.eql({ auth_token: authToken });
          options.onSuccess({ logged_in: true });
        });

        auth.logIn(function(data) {
          expect(stub.calledOnce).to.be(true);
          expect(data.logged_in).to.be(true);
          done();
        });

      });
    });

    it('should not let login() be more then once', function() {
      expect(auth.logIn).to.throwError();
    });

  });

});
