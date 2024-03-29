/*!
 * cookie.js - cookie engine plugin.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone',
      pluginNs = $[pluginName];

  // Register default engines.
  pluginNs.registerStorageEngine('cookie', {
    isAvailable: function() {
      return 'cookie' in document;
    },
    _setCookie: function(key, data, options) {
      return (document.cookie = [
        encodeURIComponent(key), '=',
        encodeURIComponent(data),
        options.expires ? '; expires=' + options.expires : '',
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
      ].join(''));
    },
    // value: {value: [data], timestamp: [timestamp]}
    set: function(key, data, options) {
      var opts = $.extend({}, options),
          value = data.value,
          timestamp = data.timestamp;
      if (typeof value === 'undefined' || value === null) {
        opts.expires = -1;  // invalidate.
      }
      if (timestamp) {
        opts.expires = new Date(timestamp).toUTCString();
      }
      data = pluginNs.JsonFormat.encode(data);
      return this._setCookie(key, data, opts);
    },
    get: function(key, options) {
      var opts = $.extend({}, options);
      var exp = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)'),
          result = exp.exec(document.cookie);
      if (result) {
        var data = decodeURIComponent(result[1]);
        var data = (opts.raw ? data : pluginNs.JsonFormat.decode(data));
        if (data === 'null') {
          data = null;
        } else if (data === 'true' || data === 'false') {
          data = Boolean(data);
        }
        return data;
      } else {
        return null;
      }
    },
    remove: function(key, options) {
      var opts = $.extend({}, options);
      opts.expires = -1;
      this._setCookie(key, null, opts);
    },
    clear: function(pattern) {
      var cookies = document.cookie.split('; '),
          length = cookies.length;
      for (var i = 0; i < length; i++) {
        var key = cookies[i].split('=')[0];
        if (pattern) {
          if (key.match(pattern)) {
            this.remove(key);
          }
        } else {
          this.remove(keyValue[0]);
        }
      }
    }
  });
}(jQuery, this));
