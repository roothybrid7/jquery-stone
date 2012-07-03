/*!
 * core_test.js
 */

'use strict';

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Stone Core", {
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
      assert.equals(store.options.dataScheme + '://' + 'foo', dataUrl);
    },
    'with params': function() {
      var storeWithParams = $.stone.create({
        dataScheme: '',
        syncBufferLimit: 20,
        saveStrategy: 'all'}),
          defs = storeWithParams._defaults,
          opts = storeWithParams.options,
          dataUrl = storeWithParams.getDataUrl('foo');
      assert.equals(this.DEFS, defs);
      refute.equals(defs, opts);
      refute.equals(defs.dataScheme, opts.dataScheme);
      refute.equals(defs.syncBufferLimit, opts.syncBufferLimit);
      refute.equals(defs.saveStrategy, opts.saveStrategy);
      assert.equals('foo', dataUrl);
    }
  }
});
