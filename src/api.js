/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');

  // Use a local undefined variable instead of global in case undefined was
  // altered.
  var _undefined;
  var head = document.getElementsByTagName('head')[0];
  var isCorsSupported = window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest();

  function makeRequest(method, url, data, options) {
    options = options || {};
    method = method.toUpperCase();
    url = utils.buildApiUrl(url);

    var req = isCorsSupported ? new XMLHttpRequest() : new JSONPRequest();

    req.onreadystatechange = function() {
      if(req.readyState === 4) {
        switch(req.status) {
          case 0:
            throw new Error('Request ' + url + ' returned an invalid HTTP status of 0.');
          case 200:
          case 304: // fall through on purpose
            if(options.onSuccess) { // Only parse the response if we have a callback
              var data = req.responseText;
              if(typeof data === 'string') {
                data = JSON.parse(data);
              }

              options.onSuccess(data, req.status);
            }
          break;
        }
      }
    };

    if(method === 'GET' && data) {
      url += utils.buildQueryString(data);
    }

    req.open(method, url, true);

    if(options.withCredentials) {
      req.withCredentials = true;
    }

    if(method === 'POST' && data) {
      req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

      if(typeof data === 'object') {
        data = utils.buildQueryString(data, true);
      }
    }

    req.send(data ? data : null);
  }

  // XHR like interface for JSONP
  function JSONPRequest() {
    this.el = document.createElement('script');
    this.uniqueCallbackName = 'plyfeJsonPCallback_' + Math.random().toString(36).substring(2);
  }

  JSONPRequest.prototype.setRequestHeader = function() { };

  JSONPRequest.prototype.open = function(method, url /*, blocking */) {
    this.method = method;
    this.url = url;
  };

  JSONPRequest.prototype.send = function(data) {
    var self = this;

    window[this.uniqueCallbackName] = function(data) {
      // Using a try/catch just in the element has already been removed.
      try {
        // Remove this JSONP callback
        delete window[self.uniqueCallbackName];
      } catch(e) {
        window[self.uniqueCallbackName] = _undefined;
      }

      // NOTE: not a string we don't want to go through all the overhead of
      // calling JSON.stringify on the already parsed JSON - just to turn around
      // and parse it again in the xhr.onload function.
      self.responseText = data;
      self.readyState = 4;
      self.status = data.http_status_code || 200;
      self.onreadystatechange(); // NOTE: we don't pass an event object here.
    };

    // TODO: Investigate how to trap script loading 'onerror's in IE <= 8 which
    // doesn't support script.onerror.

    var params = {
      callback: this.uniqueCallbackName,
      http_method: this.method.toUpperCase()
    };

    if(data) {
      params.http_data = data;
    }

    // NOTE: We are slapping the as a manual QS param here because we don't have
    // code inspecting the http_data parameter above yet.
    // TODO: Remove this hack in the future.
    this.el.src = this.url + utils.buildQueryString(params) + '&' + data;

    head.appendChild(this.el);

    setTimeout(function() {
      // Using a try/catch just in the element has already been removed.
      try {
        head.removeChild(self.el);
      } catch(e) {}
    }, 200); // wait 200ms then remove the <script>
  };

  function post(path, data, options) {
    return makeRequest.call(null, 'post', path, data, options);
  }

  function get(path, data, options) {
    return makeRequest.call(null, 'get', path, data, options);
  }

  return {
    POST: post,
    GET: get
  };

});
