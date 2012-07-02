/*!
 * localstorage_test.js
 */

'use strict';

var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Stone localStorage", {
  setUp: function() {
    this.PLUGIN_NAME = 'stone';
    this.DEFS = $.stone._defaults();
    this.origDocumentData = $(document).data();
    this.locStorage = $.stone.create({enableEngines: ['localStorage']});
  },
  tearDown: function() {
    $(document).data(this.origDocumentData);
    this.locStorage = null;
  },
  'serialize deserialize': {
    setUp: function() {
      this.serializeEngine = $.stone.availableEngines()['localStorage'];
    },
    tearDown: function() {
      this.serializeEngine = null;
    },
    'undefined': function() {
      var data = undefined,
          encodedData = this.serializeEngine.serialize(data);
      assert.isNull(encodedData);
    },
    'null': function() {
      var data = null;
      console.log(data, typeof data);
      var encodedData = this.serializeEngine.serialize(data);
      assert.isNull(encodedData);
    },
    'true/false': function() {
      var dataTrue = true,
          dataFalse = false,
          encodedDataTrue = this.serializeEngine.serialize(dataTrue),
          encodedDataFalse = this.serializeEngine.serialize(dataFalse);
      assert.same(true, encodedDataTrue);
      assert.same(false, encodedDataFalse);
    },
    'string': function() {
      var data = 'a',
          encodedData = this.serializeEngine.serialize(data);
      assert(typeof encodedData === 'string');
      var decodedData = this.serializeEngine.deserialize(encodedData);
      assert.equals(data, decodedData);
    },
    'Object': function() {
      var data = {a:0, b:1, c:null, d:'abc', e: {f: 'g'}, h: false},
          encodedData = this.serializeEngine.serialize(data);
      assert(typeof encodedData === 'string');
      var decodedData = this.serializeEngine.deserialize(encodedData);
      assert.equals(data, decodedData);
    },
    'Array': function() {
      var data = [0,1,{id:1, data:'text'},{id:2, data:'text2'}],
          encodedData = this.serializeEngine.serialize(data);
      assert(typeof encodedData === 'string');
      var decodedData = this.serializeEngine.deserialize(encodedData);
      assert.equals(data, decodedData);
    }
  },
  '//set, get and remove null, undefined illigal': function() {
    this.locStorage.set('nu', null);
    this.locStorage.set('undef', undefined);
    buster.log(this.locStorage.get('nu'));
    buster.log(this.locStorage.get('undef'));
    assert.isNull(this.locStorage.get('nu'));
    assert.isNull(this.locStorage.get('undef'));
    this.locStorage.remove('nu');
    this.locStorage.remove('undef');
  },
  '//set, get and remove string': function() {
    this.locStorage.set('foo', 'bar');
    var ret_val = this.locStorage.get('foo');
    buster.log(ret_val);
    assert.equals('bar', ret_val);
    this.locStorage.remove('foo');
    ret_val = this.locStorage.get('foo');
    assert.isNull(ret_val);
  },
  '//set, get and remove number': function() {
    var num0 = 0, num1 = 1, num0_01 = 0.01;
    this.locStorage.set('foo_num0', num0);
    this.locStorage.set('foo_num1', num1);
    this.locStorage.set('foo_num0_01', num0_01);
    var ret_vals = [];
    ret_vals.push(this.locStorage.get('foo_num0'));
    ret_vals.push(this.locStorage.get('foo_num1'));
    ret_vals.push(this.locStorage.get('foo_num0_01'));
    assert.equals(num0, ret_vals[0]);
    assert.equals(num1, ret_vals[1]);
    assert.equals(num0_01, ret_vals[2]);
    this.locStorage.remove('foo_num0');
    this.locStorage.remove('foo_num1');
    this.locStorage.remove('foo_num0_01');
    assert.isNull(this.locStorage.get('foo_num0'));
    assert.isNull(this.locStorage.get('foo_num1'));
    assert.isNull(this.locStorage.get('foo_num0_01'));
  },
  '//set, get and remove array': function() {
    var arr = [1,'two','three', 4];
    this.locStorage.set('foo_arr', arr);
    var ret_val = this.locStorage.get('foo_arr');
    assert.equals(arr, ret_val);
    this.locStorage.remove('foo_arr');
    ret_val = this.locStorage.get('foo_arr');
    assert.isNull(ret_val);
  },
  '//set, get and remove object literal': function() {
    var obj = {a: 'foo', b: 2, c: 'buz'};
    this.locStorage.set('foo_obj', obj);
    var ret_val = this.locStorage.get('foo_obj');
    assert.equals(obj, ret_val);
    this.locStorage.remove('foo_obj');
    ret_val = this.locStorage.get('foo_obj');
    assert.isNull(ret_val);
  },
  '//set, get and remove recursive': function() {
    var data = [{id:1, text:'first text'}, {id:2, text:'second text'}];
    this.locStorage.set('foo_recur', data);
    var ret_val = this.locStorage.get('foo_recur');
    assert.equals(data, ret_val);
    this.locStorage.remove('foo_recur');
    ret_val = this.locStorage.get('foo_recur');
    assert.isNull(ret_val);
  }
});

