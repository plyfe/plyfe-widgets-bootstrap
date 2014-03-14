/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');
  var dialog = require('dialog');
  var widget = require('widget');

  var MESSAGE_PREFIX = 'plyfe:';
  var ORIGIN = '*';
  var PLYFE_ORIGIN_RE = /https?\:\/\/.*?plyfe.me(\:\d+)?/;

  function pm(win, name, data) {
    if(!name) { throw new TypeError('Argument name required'); }
    // console.log('pm(', win, ',' + name +', ', JSON.stringify(data),')');
    win.postMessage('plyfe\n' + name + '\n' + JSON.stringify(data), ORIGIN);
  }

  function gotMessage(e) {
    // If we get a message but are in a browser with no JSON.parse then ignore.
    if(!window.JSON) { return; }

    var payload = e.data;

    // We don't care what the message's origin is as long as it has the proper
    // prefix.
    var messageForUs = PLYFE_ORIGIN_RE.test(e.origin) && payload.substr(0, MESSAGE_PREFIX.length) === MESSAGE_PREFIX;

    if(messageForUs) {
      var newlinePos = payload.indexOf('\n', MESSAGE_PREFIX.length);
      var name = payload.substring(MESSAGE_PREFIX.length, newlinePos);
      var data = JSON.parse(payload.substr(newlinePos + 1)); // +1 is '\n'
      var frames = window.frames;

      routeMessage(name, data, e.source);

      // console.log('host recieved data: ', name, ':', data);
    }
  }

  function routeMessage(name, data, sourceWindow) {
    switch(name) {
      case 'dialog:open':
        dialog.open(data.src, data.width, data.height);
        break;
      case 'dialog:close':
        dialog.close();
        break;

      case 'sizechanged':
        widget.forEach(function(wgt) {
          if(wgt.iframe.contentWindow === sourceWindow) {
            utils.setStyles(wgt.iframe, { minWidth: data.width, minHeight: data.height });
          }
        });
        break;

      case 'pusher': // TODO: flesh out pusher:
        break;

      case 'broadcast': // TODO: This might not be needed - remove?
        widget.forEach(function(wgt) {
          if(wgt.iframe.contentWindow !== sourceWindow) {
            pm(wgt.iframe, name, data);
          }
        });
        break;

      default:
        console.warn("Switchboard recieved a unhandled '" + name + "' message", data);
    }
  }

  utils.addEvent(window, 'message', gotMessage);

  return {
    postMessage: pm
  };
});
