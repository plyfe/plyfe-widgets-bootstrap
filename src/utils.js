/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var head = document.getElementsByTagName('head')[0];
  var _undefined;

  function dataAttr(el, name, defval) {
    return el.getAttribute('data-' + name) || defval;
  }

  function buildQueryString(params) {
    var qs = [];

    objForEach(params || {}, function(name) {
      var value = params[name];
      if(value === _undefined) { return; }
      var part = encodeURIComponent(camelToDashed(name));
      if(value !== null) {
        part += '=' + encodeURIComponent(value);
      }
      qs.push(part);
    });

    return qs.join('&');
  }

  function buildUrl(scheme, domain, port, path, params) {
    switch(scheme) {
      case 'http':
        port = !port || port === 80 ? '': ':' + port;
        break;
      case 'https':
        port = !port || port === 443 ? '': ':' + port;
        break;
    }

    var url = scheme + '://' + (domain || '') + port;
    var qs = buildQueryString(params);

    // remove double '//' from url
    url += (path ? '/' + path : '').replace(/\/{2,}/g, '/');

    // If there is querystring data then prepend a '?'
    url += (qs ? '?' : '') + qs;

    return url;
  }

  var isCorsSupported = false;
  if(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
    isCorsSupported = true;
  }

  function objForEach(obj, callback) {
    for(var name in obj) {
      if(obj.hasOwnProperty(name)) {
        var ret = callback(name, obj[name]);
        if(ret === null) { return; } // allow breaking from loop
      }
    }
  }

  function getElementsByClassName(className, tag) {
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
      el.style[name] = typeof value === 'number' ? value + 'px' : value;
    });
  }

  function dashedToCamel(input) {
    return (input + '').replace(/-(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  }

  function camelToDashed(input) {
    return (input + '').replace(/([A-Z])/g, function(match, group1) {
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

  var vendorPrefixMap = {
    '': '',
    'Moz-': '-moz-',
    'webkit-': '-webkit-',
    'Webkit-': '-webkit-',
    'Khtml-': '-khtml-',
    'O-': '-o-',
    'ms-': '-ms-'
  };
  var cssRules = {};
  var tempDiv = document.createElement('div');

  function findSupportedCSSPropertyName(property) {
    var cacheProperty = cssRules[property];
    if(cacheProperty) { return cacheProperty; }

    objForEach(vendorPrefixMap, function(jsPropertyPrefix, cssPropertyPrefix) {
      var jsProperty = dashedToCamel(jsPropertyPrefix + property); // hyphens are capitalized so a 'Moz-' + 'some-rule' = 'MozSomeRule'
      if(typeof tempDiv.style[jsProperty] === 'string') {
        var cssProperty = cssPropertyPrefix + property;
        cssRules[property] = cssProperty;
        return cssProperty;
     }
    });
  }

  function cssRule(property, value) {
    return findSupportedCSSPropertyName(property) + ': ' + value + ';';
  }

  function uniqueString(size) {
    size = +size || 0;
    var s = '';
    while(s.length < size) {
      s += Math.random()
        .toString(36) // convert to base 36 using a-z0-9
        .substring(2); // chop of leading '0.' from Math.random
    }
    return s.substr(0, size);
  }

  function trim(s) {
    return s.replace(/^\s+|\s+$/g, '');
  }

  function addClass(el, name) {
    var classes = trim(el.className).split(/\s+/);
    for(var i = classes.length - 1; i >= 0; i--) {
      var className = classes[i];
      if(className === name) {
        return;
      }
    }
    classes.push(trim(name + ''));
    el.className = classes.join(' ');
  }

  return {
    head: head,
    dataAttr: dataAttr,
    buildQueryString: buildQueryString,
    buildUrl: buildUrl,
    isCorsSupported: isCorsSupported,
    objForEach: objForEach,
    getElementsByClassName: getElementsByClassName,
    addEvent: addEvent,
    removeEvent: removeEvent,
    domReady: domReady,
    setStyles: setStyles,
    dashedToCamel: dashedToCamel,
    camelToDashed: camelToDashed,
    customStyleSheet: customStyleSheet,
    cssRule: cssRule,
    uniqueString: uniqueString,
    trim: trim,
    addClass: addClass
  };
});
