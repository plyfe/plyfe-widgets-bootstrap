/*
* @license plyfe-widget Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widget/LICENSE for details
*/

define(function(require, exports, module) {
  'use strict';

  var utils = require('utils');
  var api = require('api');

  function PlyfeError(message) {
    this.name = 'PlyfeError';
    this.message = (message || '');
  }
  PlyfeError.prototype = Error.prototype;

  if(!define.amd) {
    alert('here');
  }
});
