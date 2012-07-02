/*!
 * cookie.js - cookie engine plugin.
 *
 * Copyright 2012, Satoshi Ohki.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone';

  // Register default engines.
  $[pluginName].registerStorageEngine('cookie', {
    isAvailable: function() {
      return 'cookie' in document;
    },
    set: function(key, value, options) {
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
