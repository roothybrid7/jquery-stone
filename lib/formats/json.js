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
