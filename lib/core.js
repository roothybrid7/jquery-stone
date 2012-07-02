/*!
 * core.js - DOM Storage library core script.
 *
 * Copyright 2012, Satoshi Ohki.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone',
      version = '0.0.0';

  /**
   * Plugin default parameters.
   *  enableEngines: Storage engine names for plugin.
   *  saveStrategy: Save mode of storage[fallback, all].
   *  syncBufferLimit: bufferd data number.
   * @type {Object.<string,*>}
   */
  var defaults = {
    dataScheme: 'jqstone',
//    enableEngines: ['localstorage', 'cookie'],
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
    get: function(key, options) {
      // TODO: get item from storage.
      var opts = $.extend({}, options),
          keyPath = this.getDataUrl(key),
          data = null;

      if (keyPath in this._buffer) {
        data = this._buffer[keyPath];
      } else {
        data = this.database.get.call(this, keyPath, opts);
        if (this.database.deserialize) {
          data = this.database.deserialize.call(this, data);
        }
        this._buffer[keyPath] = data;
      }
      return data && data.value;
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
       * localStorage: {value, timestamp}
       * cookie: {value, expires}
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
      if (this.database.serialize) {
        data = this.database.serialize.call(this, data);
      }
      this.database.set.call(this, keyPath, data, opts);
      delete this._buffer[keyPath];
      return this;
    },
    remove: function(key, options) {
      // TODO: remove item from storage.
      var keyPath = this.getDataUrl(key);
      this.database.remove.call(this, keyPath, options);
      delete this._buffer[keyPath];
      return this;
    },
    clear: function() {
      // TODO: clear storage.
      this.database.clear.call(this, new RegExp(this.getDataUrl('')));
      this._buffer = {};
      return this;
    },
    getDataUrl: function(key) {
      return this.options.dataScheme + '://' + key;
    }
  };

  /*!
   * Plugin functions.
   */
  $[pluginName] = {
    _version: function() {
      return version;
    },
    _defaults: function() {
      return defaults;
    },
    availableEngines: function() {
      return engines;
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
