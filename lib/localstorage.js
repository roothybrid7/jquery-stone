/*!
 * localstorage.js - localstorage engine plugin.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone',
      pluginNs = $[pluginName];

  // Register default engines.
  pluginNs.registerStorageEngine('localStorage', {
    isAvailable: function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch (ex) {
        return false;
      }
    },
    set: function(key, value, options) {
      var data = pluginNs.JsonFormat.encode(value);
      localStorage.setItem(key, data);
    },
    get: function(key, options) {
      var opts = $.extend({}, options),
          data = localStorage.getItem(key);
      if (data) {
        return (opts.raw ? data : pluginNs.JsonFormat.decode(data));
      } else {
        return null;
      }
    },
    remove: function(key, options) {
      localStorage.removeItem(key);
    },
    clear: function(pattern) {
      if (pattern) {
        for (var i = 0, l = localStorage.length; i < l; i++) {
          var key = localStorage.key(i);
          if (key && key.match(pattern)) {
            localStorage.removeItem(key);
          }
        }
      } else {
        localStorage.clear();
      }
    }
  });
}(jQuery, this));
