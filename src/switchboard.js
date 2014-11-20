/*
* @license plyfe-widgets-bootstrap Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets-bootstrap/LICENSE for details
*/

define(function(require) {
  'use strict';

  var utils = require('utils');
  var widget = require('widget');

  var MESSAGE_PREFIX = 'plyfe:';
  var ORIGIN = '*';

  function pm(win, name, data) {
    if(!name) { throw new TypeError('Argument name required'); }
    // console.log('pm(', win, ',' + name +', ', JSON.stringify(data),')');
    win.postMessage(MESSAGE_PREFIX + name + '\n' + JSON.stringify(data), ORIGIN);
  }

  function gotMessage(e) {
    // If we get a message but are in a browser with no JSON.parse then ignore.
    if(!window.JSON) { return; }

    var payload = e.data;

    // We don't care what the message's origin is as long as it has the proper
    // prefix.
    var messageForUs = payload.substr(0, MESSAGE_PREFIX.length) === MESSAGE_PREFIX;

    if(messageForUs) {
      var newlinePos = payload.indexOf('\n', MESSAGE_PREFIX.length);
      var name = payload.substring(MESSAGE_PREFIX.length, newlinePos);
      var data = JSON.parse(payload.substr(newlinePos + 1)); // +1 is '\n'

      routeMessage(name, data, e.source);

      // console.log('host recieved data: ', name, ':', data);
    }
  }

  function findWidget(win) {
    var widgets = widget.list;
    for(var i = widgets.length - 1; i >= 0; i--) {
      var wgt = widgets[i];
      if(wgt.iframe.contentWindow === win) {
        return wgt;
      }
    }
  }

  function routeMessage(name, data, sourceWindow) {
    var parts = name.split(':');

    switch(parts[0]) {
      case 'load':
        // console.log('widget loaded: ', data);
        var wgt = findWidget(sourceWindow);
        wgt.ready(data.width, data.height);
        break;

      case 'broadcast':
        broadcast(parts.slice(1).join(':'), data, sourceWindow);
        break;

      // TODO: remove later
      case 'sizechanged':
        break;

      // case 'dialog':
      //   dialogMessage(parts[1], data);
      //   break;

      default:
        console.warn("Switchboard recieved a unhandled '" + name + "' message", data);
    }
  }

  // function dialogMessage(action, data) {
  //   switch(action) {
  //     case 'open':
  //       dialog.open(data.src, data.width, data.height);
  //       break;
  //     case 'close':
  //       dialog.close();
  //       break;
  //     default:
  //       console.warn("Switchboard recieved unknown dialog action '" + action + "'", data);
  //   }
  // }

  function broadcast(name, data, sourceWindow) {
    widget.forEach(function(wgt) {
      if(wgt.iframe.contentWindow !== sourceWindow) {
        pm(wgt.iframe.contentWindow, name, data);
      }
    });
  }

  function setup() {
    utils.addEvent(window, 'message', gotMessage);
  }

  return {
    setup: setup,
    postMessage: pm
  };
});
