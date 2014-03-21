/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

/*global Plyfe */
define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');
  var settings = require('settings');

  var widgets = [];
  var widgetCount = 0;
  var WIDGET_READY_TIMEOUT = 5000;

  var WIDGET_CSS = '' +
    '.plyfe-widget {' +
      'opacity: 0;' +
      'overflow-x: hidden;' +
      utils.cssRule('transition', 'opacity 300ms') +
    '}' +
    '\n' +
    '.plyfe-widget.ready {' +
      'opacity: 1;' +
    '}' +
    '\n' +
    '.plyfe-widget iframe {' +
      'display: block;' +
      'width: 100%;' +
      'height: 100%;' +
      'border-width: 0;' + // NOTE: has to be border-width for IE
      'overflow: hidden;' +
    '}';

  utils.customStyleSheet(WIDGET_CSS, { id: 'plyfe-widget-css' });

  function Widget(el) {
    this.el = el;
    this.venue = utils.dataAttr(el, 'venue');
    this.type = utils.dataAttr(el, 'type');
    this.id = utils.dataAttr(el, 'id');

    var scheme = utils.dataAttr(el, 'scheme', settings.api.scheme);
    var domain = utils.dataAttr(el, 'domain', settings.api.domain);
    var port   = utils.dataAttr(el, 'port', settings.api.port);

    if(!this.venue) { throw new Error("data-venue attribute required"); }
    if(!this.type) { throw new Error("data-type attribute required"); }
    if(!this.id) { throw new Error("data-id attribute required"); }

    var path = ['w', this.venue, this.type, this.id];

    var params = {
      theme:     utils.dataAttr(el, 'theme', settings.widget.theme),
      treatment: utils.dataAttr(el, 'treatment'),
    };

    var THEME_PREFIX = 'data-theme-';

    for(var i = el.attributes.length - 1; i >= 0; i--) {
      var attr = el.attributes[i];
      if(attr.name.indexOf(THEME_PREFIX) === 0) { // only look for data-theme- attrs
        params[attr.name.substr(THEME_PREFIX.length)] = attr.value;
      }
    }

    var url = utils.buildUrl(scheme, domain, port, path.join('/'), params);

    function widgetIsReady() {
      clearTimeout(readyTimeout);
      utils.addClass(el, 'ready');
    }

    var iframeName = 'plyfe-' + (++widgetCount);
    var iframe = document.createElement('iframe');
    iframe.onload = widgetIsReady;
    iframe.name = iframeName;
    iframe.src = url;
    iframe.scrolling = 'no';
    iframe.allowTransparency = 'true'; // For IE <= 8
    this.el.innerHTML = '';
    this.el.appendChild(iframe);
    this.iframe = iframe;
    var readyTimeout = setTimeout(widgetIsReady, WIDGET_READY_TIMEOUT);
  }

  function createWidget(el) {
    if(!el && el.nodeType === 3) { throw new Error('createWidget() must be called with a DOM element'); }
    // Be defensive against repeated calls to createWidget()
    if(el.firstChild === null || el.firstChild.nodeName !== 'iframe') {
      widgets.push(new Widget(el));
    }
  }

  function destroyWidget(el) {
    if(el.nodeName !== 'iframe') {
      el = el.firstChild;
    }

    if(el && el.nodeName === 'iframe') {
      for(var i = widgets.length - 1; i >= 0; i--) {
        var widget = widgets[i];
        if(widget.iframe === el) {
          widgets.splice(i, 1); // delete the reference from the widgets array.
          el.parentNode.innerHTML = ''; // clean DOM
        }
      }
    }
  }

  function forEach(callback) {
    for(var i = widgets.length - 1; i >= 0; i--) {
      callback(widgets[i]);
    }
  }

  return {
    create: createWidget,
    distroy: destroyWidget,
    list: widgets,
    forEach: forEach
  };
});
