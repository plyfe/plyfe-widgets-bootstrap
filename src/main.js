/*
* @license plyfe-widget Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widget/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');
  var api = require('api');

  var globalInitFnName = 'plyfeAsyncInit';

  var Plyfe = {
    widgetClassName: 'plyfe-widget',
    createWidgets: createWidgets,
    createWidget: createWidget,
    login: login
  };

  function PlyfeError(message) {
    this.name = 'PlyfeError';
    this.message = (message || '');
  }
  PlyfeError.prototype = Error.prototype;


  // Find <script> tag that loaded this code
  var scripts = document.getElementsByTagName('script');
  for(var i = scripts.length - 1; i >= 0; i--) {
    var script = scripts[i];
    if(/\/plyfe-widget.*?\.js(\?|#|$)/.test(script.src)) {
      Plyfe.userToken = utils.dataAttr(script, 'user-token');
      Plyfe.domain = utils.dataAttr(script, 'domain', 'plyfe.me');
      Plyfe.port = +utils.dataAttr(script, 'port') || 443; // '+' casts to int
      globalInitFnName = utils.dataAttr(script, 'init-name', globalInitFnName);
      break;
    }
  }

  // TODO: Use something like this:
  // https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
  var readyCalled = false;
  function ready() {
    if(readyCalled) { return; }
    readyCalled = true;

    if(window[globalInitFnName] && typeof window[globalInitFnName] === 'function') {
      window[globalInitFnName](Plyfe);
    } else if(Plyfe.userToken) { // We can login the user so load widgets
      Plyfe.login(function() {
        Plyfe.createWidgets();
      });
    }
  }
  utils.addEvent(window, 'load', ready);
  utils.addEvent(document, 'DOMContentLoaded', ready);


  var widgetCount = 0;
  function Widget(el) {
    this.el = el;
    this.venue = utils.dataAttr(el, 'venue');
    this.type = utils.dataAttr(el, 'type');
    this.id = utils.dataAttr(el, 'id');

    if(!this.venue) { throw new PlyfeError("data-venue attribute required"); }
    if(!this.type) { throw new PlyfeError("data-type attribute required"); }
    if(!this.id) { throw new PlyfeError("data-id attribute required"); }

    var path = ['w', this.venue, this.type, this.id];

    var params = {};

    var url = buildUrl('https', Plyfe.domain, Plyfe.port, path.join('/'), params);

    console.log('widget url:', url);

    var iframeName = 'plyfe-' + (++widgetCount);
    this.el.innerHTML = '<iframe' +
      ' name="' + iframeName + '"' +
      ' scrolling="auto"' +
      ' frameborder="no"' +
      ' src="' + url + '"' +
      ' style="display:block; width:100%; height:100%;"' +
      '>';

    this.iframe = this.el.firstChild;
  }

  // TODO: look into using https://github.com/dperini/ContentLoaded
  function createWidgets() {
    var widgets = utils.getElementsByAClass(Plyfe.widgetClassName);
    for(var i = 0; i < widgets.length; i++) {
      createWidget(widgets[i]);
    }
  }

  function createWidget(el) {
    if(!el && el.firstChild) { throw new PlyfeError('createWidget() must be called with a DOM element'); }
    // Be defensive against repeated calls to createWidget()
    if(el.firstChild.nodeName !== 'iframe') {
      new Widget(el);
    }
  }

  function login(callback) {
    if(!Plyfe.userToken) {
      throw new PlyfeError('The Plyfe.userToken must be set before login.');
    }

    var options = {
      withCredentials: true
    };

    if(callback) { options.onSuccess = callback; }

    return makeReq('post', utils.buildApiUrl('/external_sessions/'), { auth_token: Plyfe.userToken }, options);
  }

  return Plyfe;
});
