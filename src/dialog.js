/*
* @license plyfe-widgets-bootstrap Copyright (c) 2014, Plyfe Inc.
* All Rights Reserved.
* Available via the MIT license.
* see: http://github.com/plyfe/plyfe-widgets-bootstrap/LICENSE for details
*/

define(function(require) {
  'use strict';

  var utils = require('utils');

  var MODAL_DIALOG_CSS = '' +
    '#plyfe-modal-container {' +
      'position: fixed;' +
      'top: 0;' +
      'right: 0;' +
      'bottom: 0;' +
      'left: 0;' +
      'visibility: hidden;' +
      'background-color: transparent;' +
      utils.cssRule('transition', 'background-color 1s, visibility 0s linear 1s') +
    '}' +
    '\n' +
    '#plyfe-modal-container.show {' +
      'visibility: visible;' +
      'background-color: rgba(0, 0, 0, 0.5);' + // rgba not supported in IE <= 8
      utils.cssRule('transition', 'background-color 500ms') +
    '}' +
    '\n' +
    '#plyfe-modal-dialog {' +
      'position: absolute;' +
      'top: 20%;' +
      'left: 50%;' +
      'margin-left: 150px;' +
      'width: 300px;' +
      'opacity: 0;' +
      'border: 1px solid #DDD;' +
      'border-radius: 5px;' +
      'background-color: #EEE;' +
      utils.cssRule('transition', 'opacity 500ms') +
    '}' +
    '#plyfe-modal-dialog.ready {' +
      'opacity: 1' + // TODO: filter for IE <= 8?
    '}' +
    '\n' +
    '#plyfe-modal-iframe {' +
      'display: block;' +
      'width: 100%;' +
      'height: 100%;' +
      'border: none;' +
      'overflow: hidden;' +
      'margin: 1.5%;' +
    '}';

  utils.customStyleSheet(MODAL_DIALOG_CSS, { id: 'plyfe-dialog-css' });

  var container = document.createElement('div');
  container.id = 'plyfe-modal-container';

  var dialog = document.createElement('div');
  dialog.id = 'plyfe-modal-dialog';
  container.appendChild(dialog);

  var iframe = document.createElement('iframe');
  iframe.id = 'plyfe-modal-iframe';
  iframe.allowtransparency = 'true';
  iframe.onload = function() {
    dialog.className = 'ready';
  };
  dialog.appendChild(iframe);

  utils.domReady(function() {
    document.body.appendChild(container);
  });

  utils.addEvent(container, 'mousedown', function(e) {
    if(e.target === container) { // only direct clicks on bg close
      close();
    }
  });

  utils.addEvent(document, 'keyup', function(e) {
    if(e.keyCode === 27) { // ESC key
      close();
    }
  });

  function open(src, width, height) {
    width = Math.max(Math.min(+width || 320, document.documentElement.clientWidth), 240);
    height = Math.max(Math.min(+height || 200, document.documentElement.clientWidth), 100);

    close();

    container.className = 'show';
    iframe.src = src;

    utils.setStyles(dialog, {
      width: width,
      height: height,
      marginLeft: width / 2
    });
  }

  function close() {
    container.className = '';
    dialog.className = '';
  }

  return {
    open: open,
    close: close,
  };
});
