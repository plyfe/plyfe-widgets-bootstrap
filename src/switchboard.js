/*
* @license plyfe-widgets-bootstrap Copyright (c) 2015, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets-bootstrap/LICENSE for details
*/

define(function(require) {
  'use strict';

  var utils = require('utils');

  var MESSAGE_PREFIX = 'plyfe:';
  var ORIGIN = '*';
  var events = {};

  function pm(win, name, data) {
    if(!name) { throw new TypeError('Argument name required'); }
    // console.log('pm(', win, ',' + name +', ', JSON.stringify(data),')');
    win.postMessage(MESSAGE_PREFIX + name + '\n' + JSON.stringify(data), ORIGIN);
  }

  function gotMessage(e) {
    // If we get a message but are in a browser with no JSON.parse then ignore.
    if(!window.JSON) { return; }

    var payload = e.data;

    // We expect our messages to be serialized JSON
    if(typeof payload !== 'string') { return; }

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

  function findEventHandlers() {
    // console.log('findEventHandlers', arguments);
    var handlers = [];
    for(var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      handlers = handlers.concat(events[arg] || []);
    }
    return handlers;
  }

  function routeMessage(name, data, sourceWindow) {
    // console.log(name, data);
    var parts = name.split(':');

    var handlers = findEventHandlers(name, events[parts[0] + ':*'], '*');
    for(var i = 0; i < handlers.length; i++) {
      handlers[i](name, data, sourceWindow);
    }

    if(handlers.length === 0) {
      console.warn("Switchboard recieved a unhandled '" + name + "' message", data);
    }
  }

  function addListener(name, callback) {
    if(typeof callback !== 'function') { throw new TypeError('second argument must be a function'); }

    var listeners = events[name] = events[name] || [];
    listeners.push(callback);
  }

  function removeListener(name, callback) {
    if(callback) {
      var handlers = events[name] || [];
      for(var i = handlers.length - 1; i >= 0; i--) {
        if(handlers[i] === callback) {
          handlers.splice(i, 1);
        }
      }
    } else {
      delete events[name];
    }
  }

  function setup() {
    utils.addEvent(window, 'message', gotMessage);
  }

  return {
    setup: setup,
    send: pm,
    on: addListener,
    off: removeListener,
    events: events
  };
});
