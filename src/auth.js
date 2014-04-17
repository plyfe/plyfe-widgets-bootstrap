/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

define(function(require) {
  'use strict';

  var utils = require('utils');
  var settings = require('settings');
  var api = require('api');

  var once = false;

  function logIn(callback, errback) {
    if(!settings.authToken) {
      throw new utils.PlyfeError('A authToken must be set before login.');
    }

    if(once) { throw new utils.PlyfeError("login() can only be called once"); }
    once = true;

    var options = {};
    if(callback) { options.onSuccess = callback; }
    if(errback) { options.onError = errback; }

    var params = {
      auth_token: settings.authToken
    };

    api.post('/external_sessions', params, options);
  }

  return {
    logIn: logIn
  };
});
