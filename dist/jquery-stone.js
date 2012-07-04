/*! jquery-stone - v0.0.0 - 2012-07-04
* https://github.com/roothybrid7/jquery-stone
* Copyright (c) 2012 Satoshi Ohki; Licensed MIT, GPLv2 */

/*!
 * core.js - DOM Storage library core script.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone';

  /**
   * Plugin default parameters.
   *  enableEngines: Storage engine names for plugin.
   *  saveStrategy: Save mode of storage[fallback, all].
   *  syncBufferLimit: bufferd data number.
   * @type {Object.<string,*>}
   */
  var defaults = {
    dataScheme: 'jqstone',
//    enableEngines: ['localStorage', 'cookie'],
    enableEngines: [],
    saveStrategy: 'fallback',
    syncBufferLimit: 0,  // 0: realtime[default]
  };

  /**
   * Registered available engines.
   * @type {Object.<string, Object>}
   */
  var engines = {};

  // Storage event signature.
  // StorageEvent(key, oldValue, newValue, url, storageArea, callback);
  // jQuery.Event, jQuery.trigger.

  /**
   * Plugin constructor.
   * @param {Object} options A plugin options.
   * @constructor
   */
  function Plugin(options) {
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this._buffer = {};
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      // TODO: initialize.
      var engine = this.options.enableEngines[0];
      this.database = engines[engine];
    },
    /**
     * get value by key from buffer cache or storage.
     * @param {string} key The stored key.
     * @param {Object.<string,*>=} options The plugin and storage options.
     * @return {*} stored value.
     */
    get: function(key, options) {
      var opts = $.extend({}, options),
          keyPath = this.getDataUrl(key),
          data = null;
      if (keyPath in this._buffer) {
        data = this._buffer[keyPath];
      } else if (this.database) {
        data = this.database.get(keyPath, opts);
      }
      if (data) {
        if (data.timestamp && data.timestamp < Date.now()) {
          this.database.remove(keyPath);
          delete this._buffer[keyPath];
        } else {
          this._buffer[keyPath] = data;
        }
      }
      return ($.isPlainObject(data) ? data.value : null);
    },
    /**
     * store key:value to storage.
     * @param {(string|Object.<string,*>)} key
     *    The stored key OR key:value object.
     * @param {(*|Object.<string,*>=)} value
     *    The stored value OR plugin and storage options.
     * @param {Object.<string,*>=} options
     *    The plugin and storage options.
     */
    set: function(key, value, options) {
      /*!
       * {value, expires || timestamp, [path, domain, secure]}
       */
      var opts = $.extend({}, options),
          keyPath = this.getDataUrl(key),
          expires = opts.expires,
          data = {value: (typeof value === 'undefined') ? null : value};
      if (expires instanceof Date) {
        data.timestamp = expires.getTime();
      } else if (typeof expires === 'number') {
        var time = new Date();
        time.setTime(time.getTime() + expires);
        data.timestamp = time.getTime();
      }
      this.database && this.database.set(keyPath, data, opts);
      this._buffer[keyPath] = data; // Refresh cache.
      return this;
    },
    /**
     * Remove value from storage and cache by key.
     * @param {string} key The stored key.
     * @param {Object.<string,*>=} options The plugin and storage options.
     */
    remove: function(key, options) {
      // TODO: remove item from storage.
      var keyPath = this.getDataUrl(key);
      this.database && this.database.remove(keyPath, options);
      delete this._buffer[keyPath];
      return this;
    },
    /**
     * Clear values in storage and cache.
     */
    clear: function() {
      // TODO: clear storage.
      var dataUrl = this.getDataUrl(''),
          pattern = dataUrl ? new RegExp(dataUrl) : null;
      this.database && this.database.clear(pattern);
      this._buffer = {};
      return this;
    },
    getDataUrl: function(key) {
      var dataScheme = this.options.dataScheme;
      return dataScheme ? (dataScheme + '://' + key) : key;
    },
    _dumpCache: function() {
      return this._buffer;
    }
  };

  /*!
   * Plugin functions.
   */
  $[pluginName] = {
    _defaults: function() {
      return defaults;
    },
    _getEngines: function() {
      return engines;
    },
    availableEngines: function() {
      return $.map(engines, function(v, k) { return k; });
    },
    unregisterStorageEngine: function(name) {
      delete engines[name];
    },
    registerStorageEngine: function(name, object) {
      if (object.isAvailable()) {
        engines[name] = object;
      }
    },
    create: function(options) {
      return new Plugin(options);
    }
  };
}(jQuery, this));

/*!
 * json.js - JSON format functions.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone',
      module = {};

  module.JsonFormat = {
    /**
     * Returns file extension.
     * @return {string} File extension.
     */
    extension: function() {
      return 'json';
    },
    /**
     * Returns mime type.
     * @return {string} Mime type.
     */
    mimeType: function() {
      return 'application/json';
    },
    /**
     * JSON encode.
     * @param {*} data A encode target data.
     * @param {...*} va_args encoder parameters.
     * @return {*} The encoded data.
     */
    encode: function(data, va_args) {
      if (typeof data === 'undefined' || data === null) {
        return null;
      }
      if (typeof data === 'object' || typeof data === 'string') {
        return JSON.stringify.apply(JSON, arguments);
      }
      return data;
    },
    /**
     * JSON decode.
     * @param {string} data A encoded data.
     * @param {...*} va_args decoder parameters.
     * @return {*} The decoded data.
     */
    decode: function(data, va_args) {
      var parsedData = null;
      try {
        parsedData = JSON.parse.apply(JSON, arguments);
      } catch (ex) {
        parsedData = null;
      }
      return parsedData;
    }
  };
  $.extend($[pluginName], module);
}(jQuery, this));

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
        var keys = [];
        for (var i = 0, l = localStorage.length; i < l; i++) {
          var key = localStorage.key(i);
          if (key && key.match(pattern)) {
            keys.push(key);
          }
        }
        for (var i = 0, l = keys.length; i < l; i++) {
          localStorage.removeItem(keys[i]);
        }
      } else {
        localStorage.clear();
      }
    }
  });
}(jQuery, this));
