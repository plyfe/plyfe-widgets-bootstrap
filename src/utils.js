/*
* @license plyfe-widget Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widget/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  function dataAttr(el, name, defval) {
    return el.getAttribute('data-' + name) || defval;
  }

  function buildQueryString(params, suppressQuestionMark) {
    var qs = [];

    for(var name in params) {
      if(params.hasOwnProperty(name)) {
        var value = params[name];
        if(value === undefined) { continue; }
        var part = encodeURIComponent(name);
        if(value !== null) {
          part += '=' + encodeURIComponent(value);
        }
        qs.push(part);
      }
    }

    if(qs.length === 0) { return ''; }

    return (suppressQuestionMark ? '' : '?') + qs.join('&');
  }

  function buildUrl(protocol, domain, port, path, qs) {
    var url = protocol + '://' + domain + ((port && port !== 80) ? ':' + port : '');
    if(path) {
      url += ('/' + path).replace(/\/{2,}/g, '/') + buildQueryString(qs || { });
    }
    return url;
  }

  var isCorsSupported = false;
  if(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
    isCorsSupported = true;
  }

  return {
    dataAttr: dataAttr,
    buildQueryString: buildQueryString,
    buildUrl: buildUrl,
    isCorsSupported: isCorsSupported
  };
});
