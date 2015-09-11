/*
* @license plyfe-widgets-bootstrap Copyright (c) 2015, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets-bootstrap/LICENSE for details
*/

define(function(require) {
  'use strict';

  var utils = require('utils');
  var settings = require('settings');
  var environments = require('env');
  var switchboard = require('switchboard');

  var widgets = [];
  var widgetCount = 0;

  var WIDGET_CSS = '' +
    '.plyfe-widget {' +
      'height: 0;' +
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

  function findWidgetFromSourceWindow(sourceWindow) {
    for(var i = widgets.length - 1; i >= 0; i--) {
      var wgt = widgets[i];
      if(wgt.iframe.contentWindow === sourceWindow) {
        return wgt;
      }
    }
  }

  function broadcast(data, name, sourceWindow) {
    var broadcastPrefix = 'broadcast:';

    for(var i = 0; i < widgets.length; i++) {
      var wgt = widgets[i];
      if(wgt.iframe.contentWindow !== sourceWindow) {
        // strip "broadcast:" from event name
        var eventName = name.substr(broadcastPrefix.length);
        switchboard.send(data, eventName, wgt.iframe.contentWindow);
      }
    }
  }

  function throwAttrRequired(attr) {
    throw new utils.PlyfeError('data-' + attr + ' attribute required');
  }

  function Widget(el) {
    this.el = el;

    this.slot = utils.dataAttr(el, 'slot');

    var path = [];
    var params = {};
    var scheme = utils.dataAttr(el, 'scheme', settings.scheme);

    // If data-slot exists then load using an s-route
    if(this.slot) {
      path = ['s', this.slot];
    } else { // If no data-slot then we must be loading a w-route widget.
      this.type  = utils.dataAttr(el, 'type');
      this.id    = utils.dataAttr(el, 'id');

      if(!this.type) { throwAttrRequired('type'); }
      if(!this.id) { throwAttrRequired('id'); }

      path = ['w', this.type, this.id];
    }

    if(utils.dataAttr(el, 'transparent-bg')) {
      params.transparent = 'true';
    }

    var domain = settings.domain;
    var port = settings.port;

    // Override the domain & port in settings only if there is a data-env set
    var env = utils.dataAttr(el, 'env');
    if(env) {
      domain = environments[env].domain;
      port = environments[env].port;
    }

    // Now override the domain & port again if there is a data-domain or data-
    // port present.
    domain = utils.dataAttr(el, 'domain', domain);
    port   = utils.dataAttr(el, 'port', port);

    var customId = utils.dataAttr(el, 'custom-id');
    if(customId) {
      params.custom_id = customId;
    }

    var clickTrackerId = utils.dataAttr(el, 'click-tracker-id');
    if(clickTrackerId) {
      params.click_tracker_id = clickTrackerId;
    }

    var url = utils.buildUrl(scheme, domain, port, path.join('/'), params);

    var iframeName = 'plyfe-' + (++widgetCount);
    var iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.src = url;
    iframe.scrolling = 'no';
    iframe.frameBorder = '0'; // NOTE: For IE <= 8
    iframe.allowTransparency = 'true'; // For IE <= 8
    this.el.innerHTML = '';
    this.el.appendChild(iframe);
    this.iframe = iframe;
  }

  Widget.prototype.ready = function widgetReady(data) {
    utils.setStyles(this.el, {
      minWidth: data.minWidth,
      maxWidth: data.maxWidth,
      height: data.height,
      minHeight: data.minHeight
    });
    utils.addClass(this.el, 'ready');
  };

  function createWidget(el) {
    if(!el && el.nodeType === 3) { throw new utils.PlyfeError('createWidget() must be called with a DOM element'); }
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

  switchboard.on('broadcast:*', broadcast);
  switchboard.on('load', function loadEvent(data, name, sourceWindow) {
    // console.log('widget loaded: ', data);
    findWidgetFromSourceWindow(sourceWindow).ready(data);
  });

  switchboard.on('height', function heightChanged(height, name, sourceWindow) {
    // console.log('widget loaded: ', data);
    utils.setStyles(findWidgetFromSourceWindow(sourceWindow).el, {
      height: height
    });
  });

  return {
    create: createWidget,
    distroy: destroyWidget,
    list: widgets
  };
});
