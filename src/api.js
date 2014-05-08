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

  // Use a local undefined variable instead of global in case undefined was
  // altered.
  var _undefined;

  function empty() {}

  function buildApiUrl(path) {
    return utils.buildUrl(settings.scheme, settings.domain, settings.port, '/api/' + path);
  }

  function makeApiRequest(method, path, data, options) {
    options = options || {};
    var success = options.onSuccess || empty;
    var error = options.onError || empty;

    method = method.toUpperCase();
    var url = buildApiUrl(path);

    var req = utils.isCorsSupported ? new XMLHttpRequest() : new JSONPRequest();

    req.onreadystatechange = function() {
      if(req.readyState === 4) {
        var data = JSON.parse(req.responseText || '');
        var status = req.status;

        if(status === 0) {
          error({message: 'Request ' + url + ' returned an invalid HTTP status of 0.'}, 0);
        } else {
          if(status >= 200 && status < 400) { // success
            success(data, status);
          } else if(status >= 400) { // error
            error(data, status);
          }
        }
      }
    };

    if(method === 'GET' && data) {
      url += (url.indexOf('?') >= 0 ? '&' : '?') + utils.buildQueryString(data);
    }

    req.open(method, url);

    if(options.withCredentials) {
      req.withCredentials = true;
    }

    if(method === 'POST' && data) {
      req.setRequestHeader('Content-Type','application/json');

      data = JSON.stringify(data);
    }

    req.send(data ? data : null);

    return req;
  }

  // XHR like interface for JSONP
  function JSONPRequest(callbackName) {
    this.el = document.createElement('script');
    this.uniqueCallbackName = callbackName || 'plyfeJsonPCallback_' + utils.uniqueString(10);
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

    // NOTE: We are slapping the data on as a manual QS param here because we
    // don't have code inspecting the http_data parameter above yet.
    // TODO: Remove this hack in the future.
    this.el.src = this.url + '?' + utils.buildQueryString(params) + '&' + data;

    utils.head.appendChild(this.el);

    setTimeout(function() {
      // Using a try/catch just in the element has already been removed.
      try {
        utils.head.removeChild(self.el);
      } catch(e) {}
    }, 200); // wait 200ms then remove the <script>
  };

  function get(path, data, options) {
    return makeApiRequest.call(null, 'get', path, data, options);
  }

  function post(path, data, options) {
    return makeApiRequest.call(null, 'post', path, data, options);
  }

  return {
    get: get,
    post: post,
    JSONPRequest: JSONPRequest,
    buildApiUrl: buildApiUrl
  };

});
