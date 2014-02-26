/*
* @license plyfe-widget Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widget/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');

  var widgets = [];
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

    var params = {
      theme: Plyfe.theme
    };

    var url = utils.buildUrl('https', Plyfe.domain, Plyfe.port, path.join('/'), params);

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

  function createWidget(el) {
    if(!el && el.nodeType === 3) { throw new PlyfeError('createWidget() must be called with a DOM element'); }
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
