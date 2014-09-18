/*
* @license plyfe-widgets-bootstrap Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets-bootstrap/LICENSE for details
*/

/*jshint unused:false */
define(function(require) {
  'use strict';

  return {
    production: {
      domain: 'plyfe.me',
      port: 443
    },
    staging: {
      domain: 'staging.plyfe.me',
      port: 443
    },
    demo: {
      domain: 'demo.plyfe.me',
      port: 443
    },
    test: {
      domain: 'test.plyfe.me',
      port: 443
    },
    dev: {
      domain: 'development.plyfe.me',
      port: 3001
    }
  };

});
