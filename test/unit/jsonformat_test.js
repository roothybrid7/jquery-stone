/*!
 * jsonformat_test.js
 */

'use strict';

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Stone JsonFormat", {
  setUp: function() {
    this.PLUGIN_NAME = 'stone';
    this.DEFS = $.stone._defaults();
    this.origDocumentData = $(document).data();
    this.formatter = $.stone.JsonFormat;
  },
  tearDown: function() {
    $(document).data(this.origDocumentData);
  },
  'properties': function() {
    var ext = this.formatter.extension(),
        mime = this.formatter.mimeType();
    buster.log('Ext:', ext, 'MIME-Type:', mime);
    assert.equals('json', ext);
    assert.equals('application/json', mime);
  },
  'encode and decode': {
    'undefined': function() {
      var data = undefined,
          encodedData = this.formatter.encode(data);
      buster.log('input:', data, 'output:', encodedData);
      assert.isNull(encodedData);
    },
    'null': function() {
      var data = null,
          encodedData = this.formatter.encode(data);
      buster.log('input:', data, 'output:', encodedData);
      assert.isNull(encodedData);
    },
    'true and false': function() {
      var dataTrue = true,
          dataFalse = false,
          encodedDataTrue = this.formatter.encode(dataTrue),
          encodedDataFalse = this.formatter.encode(dataFalse);
      assert.same(dataTrue, encodedDataTrue);
      assert.same(dataFalse, encodedDataFalse);
      var decodedTrue = this.formatter.decode(encodedDataTrue),
          decodedFalse = this.formatter.decode(encodedDataFalse);
      assert.same(dataTrue, decodedTrue);
      assert.same(dataFalse, decodedFalse);
    },
    'string': function() {
      var data = 'a',
          emptyData = '',
          encodedData = this.formatter.encode(data),
          encodedEmptyData = this.formatter.encode(emptyData);
      buster.log('input "a":',data,'output "a":',encodedData);
      buster.log('input "":',emptyData,'output "":',encodedEmptyData);
      assert.equals(JSON.stringify(data), encodedData);
      assert.equals(JSON.stringify(emptyData), encodedEmptyData);
      var decoded = this.formatter.decode(encodedData),
          decodedEmpty = this.formatter.decode(encodedEmptyData);
      assert.equals(data, decoded);
      assert.equals(emptyData, decodedEmpty);
    },
    'Object': function() {
      var data = {a:0, b:0.1, c:null, d:'abc', e: {f: 'g'}, h: false, i: undefined},
          encodedData = this.formatter.encode(data);
      buster.log('input:',data,'output:',encodedData);
      assert.equals(JSON.stringify(data), encodedData);
      var decoded = this.formatter.decode(encodedData);
      assert.equals(JSON.parse(JSON.stringify(data)), decoded);
    },
    'Array': function() {
      var data = [0,1,{id:1, data:'text'},{id:2, data:'text2', d: undefined}],
          encodedData = this.formatter.encode(data);
      buster.log('input:',data,'output:',encodedData);
      assert.equals(JSON.stringify(data), encodedData);
      var decoded = this.formatter.decode(encodedData);
      assert.equals(JSON.parse(JSON.stringify(data)), decoded);
    }
  }
});

