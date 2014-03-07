/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');
  var settings = require('settings');
  var api = require('api');
  var dialog = require('dialog');
  var widget = require('widget');
  var switchboard = require('switchboard');

  var globalInitFnName = 'plyfeAsyncInit';
  // NOTE: Have to use `=== false`. Check build_frags/start.frag for the hack.
  var loadedViaRealAMDLoader = !window.Plyfe || window.Plyfe.amd !== false;

  function PlyfeError(message) {
    this.name = 'PlyfeError';
    this.message = (message || '');
  }
  PlyfeError.prototype = Error.prototype;


  var userToken, widgetDomain, widgetPort, widgetClassName = 'plyfe-widget';

  // Find <script> tag that loaded this code
  var scripts = document.getElementsByTagName('script');
  for(var i = scripts.length - 1; i >= 0; i--) {
    var script = scripts[i];
    if(/\/plyfe-widgets.*?\.js(\?|#|$)/.test(script.src)) {
      settings.api.userToken = utils.dataAttr(script, 'user-token', null);
      settings.api.scheme = utils.dataAttr(script, 'scheme', settings.api.scheme);
      settings.api.domain = utils.dataAttr(script, 'domain', settings.api.domain);
      settings.api.port = +utils.dataAttr(script, 'port') || settings.api.port; // '+' casts to int

      settings.widget.theme = utils.dataAttr(script, 'theme');

      globalInitFnName = utils.dataAttr(script, 'init-name', globalInitFnName);
      break;
    }
  }

  // The globalInitFnName and the auto-creation of widgets doesn't make sense in
  // the AMD load case.
  if(!loadedViaRealAMDLoader) {
    utils.domReady(function() {
      if(window[globalInitFnName] && typeof window[globalInitFnName] === 'function') {
        // NOTE: Have to use setTimeout to make sure that the rest of the
        // main.js executes first before we call the callback. If we don't then
        // there is a race condition where the window.Plyfe object won't exist
        // yet.
        setTimeout(window[globalInitFnName], 0);
      } else if(settings.api.userToken) { // We can login the user so load widgets
        login(function() {
          createWidgets();
        });
      }
    });
  }

  function createWidgets() {
    var divs = utils.getElementsByClassName(settings.widget.className);
    for(var i = 0; i < divs.length; i++) {
      widget.create(divs[i]);
    }
  }

  function createWidget(el) {
    return widget.create(el);
  }

  function login(callback) {
    if(!settings.api.userToken) {
      throw new PlyfeError('A userToken must be set before login.');
    }

    var options = {
      withCredentials: true
    };

    if(callback) { options.onSuccess = callback; }

    return api.post('/external_sessions/', { auth_token: settings.api.userToken }, options);
  }

  return {
    settings: settings,
    createWidgets: createWidgets,
    createWidget: createWidget,
    login: login,
  };

});
