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
  $[pluginName].registerStorageEngine('localStorage', {
    isAvailable: function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (ex) {
        return false;
      }
    },
    set: function(key, value, options) {
      console.log('SET_LOC', value);
      var data = JSON.stringify(value);
      localStorage.setItem(key, data);
    },
    get: function(key, options) {
      var data = localStorage.getItem(key),
          parsedData = null;
      try {
        parsedData = JSON.parse(data);
      } catch (ex) {
        parsedData = null;
      }
      return parsedData;
    },
    remove: function(key, options) {
      localStorage.removeItem(key);
    },
    clear: function(pattern) {
      if (pattern) {
        for (var i = 0, l = localStorage.length; i < l; i++) {
          var key = localStorage.key(i);
          if (key.match(pattern)) {
            localStorage.removeItem(key);
          }
        }
      } else {
        localStorage.clear();
      }
    }
  });

  return $;
}(jQuery, this));
