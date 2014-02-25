define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');

  var MESSAGE_PREFIX = 'plyfe';
  var ORIGIN = '*';
  function pm(win, name, data) {
    if(!name) { throw new TypeError('Argument name required'); }
    // console.log('pm(', win, ',' + name +', ', JSON.stringify(data),')');
    win.postMessage('plyfe:' + name + '\n' + JSON.stringify(data), ORIGIN);
  }

  function gotMessage(e) {
    // If we get a message but are in a browser with no JSON.parse then ignore.
    if(!window.JSON) { return; }

    var payload = e.data;

    // We don't care what the message's origin is as long as it has the proper
    // prefix.
    var messageForUs = e.origin === ORIGIN && payload.substr(0, MESSAGE_PREFIX.length) === MESSAGE_PREFIX;

    if(messageForUs) {
      var newlinePos = payload.indexOf('\n', MESSAGE_PREFIX.length + 1);
      var name = payload.substr(MESSAGE_PREFIX.length + 1, newlinePos); // +1 is ':'
      var data = JSON.parse(payload.substr(newlinePos + 1)); // +1 is '\n'
      var frames = window.frames;

      // console.log('host recieved data: ', name, ':', data);
      for(var i = 1; i <= frames.length ; i++) {
        if(window.frames[i] !== e.source) {
          pm(window.frames[i], name, data);
        }
      }
    }
  }

  addEvent(window, 'message', gotMessage);

  return {
    init: init,
    postMessage: pm
  };
});
