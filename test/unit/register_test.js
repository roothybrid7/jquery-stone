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
      buster.log(engines);
      assert($.inArray('dummyStorage', engines) >= 0);
      $[this.PLUGIN_NAME].unregisterStorageEngine('dummyStorage');
      var engines = $[this.PLUGIN_NAME].availableEngines();
      buster.log(engines);
      assert($.inArray('dummyStorage', engines) === -1);
    },
    'cannot register unavailableEngine': function() {
      $[this.PLUGIN_NAME].registerStorageEngine('dummyStorage', {
        isAvailable: function() {
          return false;
        }
      });
      var engines = $[this.PLUGIN_NAME].availableEngines();
      buster.log(engines);
      assert($.inArray('dummyStorage', engines) === -1);
    }
  }
});
