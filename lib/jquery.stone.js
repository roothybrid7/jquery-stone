/*!
 * jquery.stone.js - DOM Storage library. cookie, localstorage and etc.
 *
 * Copyright 2012, Satoshi Ohki.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone';
  var defaults = {};

  $[pluginName] = {
    VERSION: '0.0.0',
    registerStorageEngine: function(name, object) {
      // TODO: write code here.
      null;
    };
  };

  /**
   * Plugin constructor.
   * @param {Object} options A plugin options.
   * @constructor
   */
  function Plugin(options) {
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype.init = function() {
    // TODO: initialize.
    null;
  };

  // Bootstrap.
  $.fn[pluginName] = function(options) {
    return new Plugin(options);
  };
}(jQuery, this));
