/*!
 * action_test.js
 */

'use strict';

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Stone storage action", {
  setUp: function() {
    this.PLUGIN_NAME = 'stone';
    this.DEFS = $.stone._defaults();
    this.origDocumentData = $(document).data();
  },
  tearDown: function() {
    $(document).data(this.origDocumentData);
  },
  'stone.enableEngines': {
    setUp: function() {
      $[this.PLUGIN_NAME].registerStorageEngine('dummyStorage', {
        isAvailable: function() {
          return true;
        },
        set: function(key, value, options) {
          $(document).data(key, value);
          return this;
        },
        get: function(key, options) {
          var data = $(document).data(key);
          return (typeof data === 'undefined') ? null : data;
        },
        remove: function(key) {
          $(document).removeData(key);
          return this;
        },
        clear: function(pattern) {
          // TODO: all clear
          var data = $(document).data();
          if (pattern) {
            for (var k in data) {
              if (k.match(pattern)) {
                $(document).removeData(k);
              }
            }
          } else {
            $(document).removeData();
            $(document).data(this.origDocumentData);
          }
          return this;
        }
      });
      this.dummyStore = $.stone.create({enableEngines: ['dummyStorage']});
    },
    tearDown: function() {
      this.dummyStore = null;
      $[this.PLUGIN_NAME].unregisterStorageEngine('dummyStorage');
    },
    'set, get and remove data': function() {
      this.dummyStore.set('foo', 'bar');
      var ret_val = this.dummyStore.get('foo');
      buster.log(ret_val);
      assert.equals('bar', ret_val);
      this.dummyStore.remove('foo');
      ret_val = this.dummyStore.get('foo');
      buster.log(ret_val);
      assert.isNull(ret_val);
    },
    'clear data': function() {
      $(document).data('dmy', 1234);
      this.dummyStore.set('foo', 'bar').set('hoge', 'fuga').set('spam', 'egg');
      this.dummyStore.clear();
      assert.isNull(this.dummyStore.get('foo'));
      assert.isNull(this.dummyStore.get('hoge'));
      assert.isNull(this.dummyStore.get('spam'));
      assert.equals(1234, $(document).data('dmy'));
      $(document).removeData('dmy');
    }
  }
});

