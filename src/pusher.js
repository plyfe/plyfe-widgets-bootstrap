/*
* @license plyfe-widgets Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets/LICENSE for details
*/

/*global Pusher */
/*jshint unused:false */

define(function(require) {
  'use strict';

  // TODO: load pusher.js async from their CDN. Store incoming listen requests
  // until pusher.js is loaded.

  var pusher = new Pusher();

  function listen(channelName, eventName, callback) {
    var channel = pusher.channel(channelName);
    if(!channel) {
      channel = pusher.subscribe(channelName);
    }
    channel.bind(eventName, callback);
  }

  return {
    listen: listen
  };
});
