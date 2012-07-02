/*!
 * stone.js
 */

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Stone", {
  setUp: function() {
    this.PLUGIN_NAME = 'stone';
    this.DEFS = $.stone._defaults();
    this.origDocumentData = $(document).data();
  },
  tearDown: function() {
    $(document).data(this.origDocumentData);
  },
  'stone.version': function() {
    assert($.stone._version());
  },
  'stone.defaults': function() {
    var defs = $.stone._defaults();
    assert.isObject(defs);
    assert.equals('fallback', defs.saveStrategy);
    assert.equals(0, defs.syncBufferLimit);
    assert.equals([], defs.enableEngines);
  },
  'stone.create': {
    'without params': function() {
      var store = $.stone.create(),
          defs = store._defaults,
          opts = store.options,
          dataUrl = store.getDataUrl('foo');
      assert.equals(this.PLUGIN_NAME, store._name);
      assert.equals(this.DEFS, defs);
      assert.equals(defs, opts);
      assert.equals(defs.syncBufferLimit, opts.syncBufferLimit);
      assert.equals(defs.saveStrategy, opts.saveStrategy);
      assert.equals(defs.enableEngines, opts.enableEngines);
      assert.equals(store.options.scheme + '://' + 'foo', dataUrl);
    },
    'with params': function() {
      var storeWithParams = $.stone.create({
        syncBufferLimit: 20,
        saveStrategy: 'all'}),
          defs = storeWithParams._defaults,
          opts = storeWithParams.options;
      assert.equals(this.DEFS, defs);
      refute.equals(defs, opts);
      refute.equals(defs.syncBufferLimit, opts.syncBufferLimit);
      refute.equals(defs.saveStrategy, opts.saveStrategy);
    }
  },
  'stone.registerStorageEngine': {
    'add and remove Engine': function() {
      $[this.PLUGIN_NAME].registerStorageEngine('dummyStorage', {
        isAvailable: function() {
          return true;
        }
      });
      var engines = $[this.PLUGIN_NAME].availableEngines();
      assert('dummyStorage' in engines);
      $[this.PLUGIN_NAME].unregisterStorageEngine('dummyStorage');
      refute('dummyStorage' in engines);
    },
    'cannot register unavailableEngine': function() {
      $[this.PLUGIN_NAME].registerStorageEngine('dummyStorage', {
        isAvailable: function() {
          return false;
        }
      });
      var engines = $[this.PLUGIN_NAME].availableEngines();
      refute('dummyStorage' in engines);
    }
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
          return $(document).data(key);
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
      assert.equals('bar', ret_val);
      assert.equals($(document).data(this.dummyStore.getDataUrl('foo')), ret_val);
      this.dummyStore.remove('foo');
      ret_val = this.dummyStore.get('foo');
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
