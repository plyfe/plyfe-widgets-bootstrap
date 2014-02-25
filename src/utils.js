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

    objForEach(params, function(name) {
      var value = params[name];
      if(value === undefined) { return; }
      var part = encodeURIComponent(name);
      if(value !== null) {
        part += '=' + encodeURIComponent(value);
      }
      qs.push(part);
    });

    if(qs.length === 0) { return ''; }

    return (suppressQuestionMark ? '' : '?') + qs.join('&');
  }

  function buildUrl(scheme, domain, port, path, qs) {
    var url = scheme + '://' + domain + ((port !== 443 && port !== 80) ? ':' + port : '');
    if(path) {
      url += ('/' + path).replace(/\/{2,}/g, '/') + buildQueryString(qs || { });
    }
    return url;
  }

  var isCorsSupported = false;
  if(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
    isCorsSupported = true;
  }

  function objForEach(obj, callback) {
    for(var name in obj) {
      if(obj.hasOwnProperty(name)) {
        callback(name);
      }
    }
  }

  function keys(obj) {
    var names = [];
    objForEach(obj, function(name) {
      names.push(name);
    });
    return names;
  }

  function getElementsByAClass(className, tag) {
    if(document.getElementsByClass) {
      return document.getElementsByClassName(className);
    } else if(document.querySelectorAll) {
      return document.querySelectorAll('.' + className);
    }

    var els = document.getElementsByTagName(tag || '*');
    var pattern = new RegExp('\\b' + className + '\\b');
    var foundEls = []; // NOTE: not a NodeList object like above document.*

    for(var i = 0, _len = els.length; i < _len; i++) {
      if(pattern.test(els[i].className)) {
        foundEls.push(els[i]);
      }
    }

    return foundEls;
  }

  var addEvent = function(obj, name, fn) {
    obj.addEventListener(name, fn, false);
  };

  if(window.attachEvent) {
    addEvent = function(obj, name, fn) {
      obj.attachEvent('on' + name, fn);
    };
  }

  var removeEvent = function(obj, name, fn) {
    obj.removeEventListener(name, fn, false);
  };

  if(window.detachEvent) {
    removeEvent = function(obj, name, fn) {
      obj.detachEvent('on' + name, fn);
    };
  }

  return {
    dataAttr: dataAttr,
    buildQueryString: buildQueryString,
    buildUrl: buildUrl,
    isCorsSupported: isCorsSupported,
    objForEach: objForEach,
    keys: keys,
    getElementsByAClass: getElementsByAClass,
    addEvent: addEvent,
    removeEvent: removeEvent
  };
});
