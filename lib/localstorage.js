/*!
 * localstorage.js - localstorage engine plugin.
 *
 * Copyright 2012, Satoshi Ohki.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone';

  // Register default engines.
  $[pluginName].registerStorageEngine('localstorage', {
    isAvailable: function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (ex) {
        return false;
      }
    },
    set: function(key, value, options) {
      localStorage.setItem(key, value);
    },
    get: function(key, options) {
      localStorage.getItem(key);
    },
    remove: function(key, options) {
      localStorage.remove(key);
    },
    clear: function(pattern) {
      localStorage.clear();
    }
  });

  return $;
}(jQuery, this));
