/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var head = document.getElementsByTagName('head')[0];

  function dataAttr(el, name, defval) {
    return el.getAttribute('data-' + name) || defval;
  }

  function buildQueryString(params, suppressQuestionMark) {
    var qs = [];

    objForEach(params, function(name) {
      var value = params[name];
      if(value === undefined) { return; }
      var part = encodeURIComponent(camelToDashed(name));
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
        callback(name, obj[name]);
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
      var _fn = fn.__attachEventRef = function() {
        var e = window.event;
        e.keyCode = e.which;
        fn(e);
      };
      obj.attachEvent('on' + name, _fn);
    };
  }

  var removeEvent = function(obj, name, fn) {
    obj.removeEventListener(name, fn, false);
  };

  if(window.detachEvent) {
    removeEvent = function(obj, name, fn) {
      obj.detachEvent('on' + name, fn.__attachEventRef);
    };
  }

  // TODO: Use something like this:
  // https://github.com/dperini/ContentLoaded/blob/master/src/contentloaded.js
  var readyCallbacks = [];
  var domLoaded = false;
  function ready(e) {
    if(e && e.type === 'readystatechange' && document.readyState !== 'complete') { return; }

    if(domLoaded) { return; }
    domLoaded = true;

    removeEvent(window, 'load', ready);
    removeEvent(document, 'readystatechange', ready);
    removeEvent(document, 'DOMContentLoaded', ready);

    for(var i = 0; i < readyCallbacks.length; i++) {
      readyCallbacks[i]();
    }
  }

  if(document.readyState === 'complete') {
    ready();
  } else {
    addEvent(window, 'load', ready);
    addEvent(document, 'readystatechange', ready);
    addEvent(document, 'DOMContentLoaded', ready);
  }

  function domReady(callback) {
    if(domLoaded) {
      callback();
    } else {
      readyCallbacks.push(callback);
    }
  }

  function setStyles(el, styles) {
    objForEach(styles, function(name, value) {
      el.style[dashedToCamel(name)] = typeof value === 'number' ? value + 'px' : value;
    });
  }

  function dashedToCamel(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  }

  function camelToDashed(input) {
    return input.replace(/([A-Z])/g, function(match, group1) {
      return '-' + group1.toLowerCase();
    });
  }

  function customStyleSheet(css, options) {
    options = options || {};
    var sheet = document.createElement('style');
    sheet.type = "text/css";
    sheet.media = 'screen';
    if(options.id) {
      sheet.id = options.id;
    }

    if(sheet.styleSheet) {
      sheet.styleSheet.cssText = css; //IE only
    } else {
      sheet.appendChild(document.createTextNode(css));
    }

    // insert at the top of <head> so later styles can changed by page css.
    head.insertBefore(sheet, head.firstChild);

    return sheet;
  }

  var transitionRuleName = (function() {
    var tempDiv = document.createElement('div');
    var vendorPrefixes = [null, 'Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
    for(var i = 0; i < vendorPrefixes.length; i++) {
      var prefix = vendorPrefixes[i];
      var prop = !prefix ? 'transition' : prefix + 'Transition';
      if(typeof tempDiv.style[prop] === 'string') {
        return prop;
     }
    }
  })();

  function cssTransition(rule) {
    return transitionRuleName + ': ' + rule + ';';
  }

  return {
    head: head,
    dataAttr: dataAttr,
    buildQueryString: buildQueryString,
    buildUrl: buildUrl,
    isCorsSupported: isCorsSupported,
    objForEach: objForEach,
    keys: keys,
    getElementsByAClass: getElementsByAClass,
    addEvent: addEvent,
    removeEvent: removeEvent,
    domReady: domReady,
    setStyles: setStyles,
    dashedToCamel: dashedToCamel,
    camelToDashed: camelToDashed,
    customStyleSheet: customStyleSheet,
    cssTransition: cssTransition
  };
});
