/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');
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
      userToken = utils.dataAttr(script, 'user-token');
      widgetDomain = utils.dataAttr(script, 'domain', 'plyfe.me');
      widgetPort = +utils.dataAttr(script, 'port') || 443; // '+' casts to int
      globalInitFnName = utils.dataAttr(script, 'init-name', globalInitFnName);
      break;
    }
  }

  // The globalInitFnName and the auto-creation of widgets doesn't make sense in
  // the AMD load case.
  if(!loadedViaRealAMDLoader) {
    utils.domReady(function() {
      if(window[globalInitFnName] && typeof window[globalInitFnName] === 'function') {
        window[globalInitFnName](externalApi);
      } else if(externalApi.userToken) { // We can login the user so load widgets
        login(function() {
          createWidgets();
        });
      }
    });
  }

  function createWidgets() {
    var divs = utils.getElementsByClassName(externalApi.widgetClassName);
    for(var i = 0; i < divs.length; i++) {
      widget.create(divs[i]);
    }
  }

  function login(callback) {
    if(!externalApi.userToken) {
      throw new PlyfeError('A userToken must be set before login.');
    }

    var options = {
      withCredentials: true
    };

    if(callback) { options.onSuccess = callback; }

    return api.POST('/external_sessions/', { auth_token: externalApi.userToken }, options);
  }

  var externalApi = {
    userToken: userToken,
    domain: widgetDomain,
    port: widgetPort,
    theme: undefined, // undefined = 'default' on the server
    widgetClassName: widgetClassName,
    createWidgets: createWidgets,
    createWidget: widget.create,
    login: login
  };

  return externalApi;

});
