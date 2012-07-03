/*!
 * uri.js - URI format functions.
 */

;(function($, global, undefined) {
  'use strict';

  var pluginName = 'stone',
      module = {};

  module.URIFormat = {
    /**
     * Returns file extension.
     * @return {string} File extension.
     */
    extension: function() {
      return null;
    },
    /**
     * Returns mime type.
     * @return {string} Mime type.
     */
    mimeType: function() {
      return 'text/html';
    },
    /**
     * URI encode.
     * @param {*} data A encode target data.
     * @return {*} The encoded data.
     */
    encode: function(data) {
      if (typeof data === 'undefined' || data === null) {
        return '';
      }
      return encodeURIComponent(data);
    },
    /**
     * URI decode.
     * @param {string} data A encoded data.
     * @return {*} The decoded data.
     */
    decode: function(data) {
      return decodeURIComponent(data);
    }
  };
  $.extend($[pluginName], module);
}(jQuery, this));
