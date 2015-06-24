/*
* @license plyfe-widgets-bootstrap Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets-bootstrap/LICENSE for details
*/

define(function(require) {
  'use strict';

  var utils = require('utils');
  var settings = require('settings');
  var widget = require('widget');
  var auth = require('auth');
  var switchboard = require('switchboard');
  var environments = require('env');

  switchboard.setup();

  var globalInitFnName = 'plyfeAsyncInit';

  // Find <script> tag that loaded this code
  var scripts = document.getElementsByTagName('script');
  for(var i = scripts.length - 1; i >= 0; i--) {
    var script = scripts[i];
    if(/\/plyfe-widgets-bootstrap.*?\.js(\?|#|$)/.test(script.src)) {
      settings.authToken = utils.dataAttr(script, 'auth-token', null);
      settings.scheme = utils.dataAttr(script, 'scheme', settings.scheme);
      settings.env = utils.dataAttr(script, 'env', settings.env);

      var env = environments[settings.env] || environments.production;

      settings.domain = env.domain;
      settings.port   = env.port;

      settings.domain = utils.dataAttr(script, 'domain', settings.domain);
      settings.port   = +utils.dataAttr(script, 'port') || settings.port; // '+' casts to int

      settings.theme = utils.dataAttr(script, 'theme');

      globalInitFnName = utils.dataAttr(script, 'init-name', globalInitFnName);
      break;
    }
  }

  utils.domReady(function() {
    if(window[globalInitFnName] && typeof window[globalInitFnName] === 'function') {
      // NOTE: Have to use setTimeout to make sure that the rest of the
      // main.js executes first before we call the callback. If we don't then
      // there is a race condition where the window.Plyfe object won't exist
      // yet.
      setTimeout(window[globalInitFnName], 0);
    } else if(settings.authToken) { // Can login via SSO then load widgets
      auth.logIn(function() {
        createWidgets();
      });
    } else {
      createWidgets();
    }
  });

  function createWidgets() {
    var divs = document.querySelectorAll(settings.selector);
    for(var i = 0; i < divs.length; i++) {
      widget.create(divs[i]);
    }
  }

  function createWidget(el) {
    return widget.create(el);
  }

  function cardStart(data) {
    var user = data.user; // todo ->
    var card = data.card; // defend against bad data
    plyfeObj.onCardStart.call(plyfeObj, user, card);
  }

  switchboard.on('card:start', cardStart);

  var plyfeObj = {
    settings: settings,
    createWidgets: createWidgets,
    createWidget: createWidget,
    logIn: auth.logIn,
    onCardStart: function(){}
  };

  return plyfeObj;

});
