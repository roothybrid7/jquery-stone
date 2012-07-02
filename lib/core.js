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

// TODO: buffer.
  Plugin.prototype = {
    init: function() {
      // TODO: initialize.
      var engine = this.options.enableEngines[0];
      this.database = engines[engine];
    },
    get: function(key, options) {
      // TODO: get item from storage.
      var keyPath = this.getDataUrl(key),
          data = null;

      if (keyPath in this._buffer) {
        data = this._buffer[keyPath];
      } else {
        data = this.database.get.call(this, keyPath, options);
        this._buffer[keyPath] = data;
      }
      return data;
    },
    set: function(key, value, options) {
      // TODO: set item to storage.
      /*!
       * {value, expires || timestamp, [path, domain, secure]}
       * localStorage: {value, timestamp}
       * cookie: {value, expires}
       */
      if (typeof value === 'undefined') return;
      var keyPath = this.getDataUrl(key);
      this.database.set.call(this, keyPath, value, options);
      this._buffer[keyPath] = value;
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

  /**
   * Registered available engines.
   * @type {Object.<string, Object>}
   */
  var engines = {};

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

  return $;
}(jQuery, this));
