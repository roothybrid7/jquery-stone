/*!
 * register_test.js
 */

'use strict';

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Stone Register Storage engines", {
  setUp: function() {
    this.PLUGIN_NAME = 'stone';
    this.DEFS = $.stone._defaults();
    this.origDocumentData = $(document).data();
  },
  tearDown: function() {
    $(document).data(this.origDocumentData);
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
});
