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
    this.locUtils = $.stone._getEngines()['localStorage'];
    this.timestamp = new Date(Date.now() + 86400 * 1000).getTime();
  },
  tearDown: function() {
    $(document).data(this.origDocumentData);
    this.locUtils.clear(new RegExp('test_'));
    this.locStorage.clear();
    this.locStorage = null;
  },
  'enableEngines': function() {
    var opts = this.locStorage.options;
    assert.equals('localStorage', opts.enableEngines[0]);
  },
  'set, get and remove value': function() {
    var a = {value: 'a', timestamp: this.timestamp},
        num0 = {value: 0, timestamp: this.timestamp},
        num0_01 = {value: 0.01, timestamp: this.timestamp};
    this.locUtils.set('test_a', a);
    this.locUtils.set('test_d', num0);
    this.locUtils.set('test_f', num0_01);
    var ret_a = this.locUtils.get('test_a');
    var ret_num0 = this.locUtils.get('test_d');
    var ret_num0_01 = this.locUtils.get('test_f');
    buster.log('a=',ret_a,'num0=',ret_num0,'num0_01=',ret_num0_01);
    assert.equals(a, ret_a);
    assert.equals(num0, ret_num0);
    assert.equals(num0_01, ret_num0_01);
    this.locUtils.remove('test_a');
    this.locUtils.remove('test_d');
    this.locUtils.remove('test_f');
    assert.isNull(this.locUtils.get('test_a'));
    assert.isNull(this.locUtils.get('test_d'));
    assert.isNull(this.locUtils.get('test_f'));
  },
  'set, get and remove object': function() {
    var T = {value: true, timestamp: this.timestamp},
        F = {value: false, timestamp: this.timestamp},
        obj = {value: {a:1,b:{c:2, data: [1,2,3]}}, timestamp: this.timestamp},
        arr = {value: [1,'b',3, {id: 1, text: 'a'}], timestamp: this.timestamp};
    this.locUtils.set('test_T', T);
    this.locUtils.set('test_F', F);
    this.locUtils.set('test_obj', obj);
    this.locUtils.set('test_arr', arr);
    var ret_T = this.locUtils.get('test_T');
    var ret_F = this.locUtils.get('test_F');
    var ret_obj = this.locUtils.get('test_obj');
    var ret_arr = this.locUtils.get('test_arr');
    assert.equals(T, ret_T);
    assert.equals(F, ret_F);
    assert.equals(obj, ret_obj);
    assert.equals(arr, ret_arr);
    this.locUtils.remove('test_T');
    this.locUtils.remove('test_F');
    this.locUtils.remove('test_obj');
    this.locUtils.remove('test_arr');
    assert.isNull(this.locUtils.get('test_T'));
    assert.isNull(this.locUtils.get('test_F'));
    assert.isNull(this.locUtils.get('test_obj'));
    assert.isNull(this.locUtils.get('test_arr'));
  },
  'set, get and remove value by Stone instance': function() {
    var a = 'a', num0 = 0, num0_01 = 0.01;
    this.locStorage.set('loc_a', a);
    this.locStorage.set('loc_num0', num0);
    this.locStorage.set('loc_num0_01', num0_01);
    var ret_a = this.locStorage.get('loc_a');
    var ret_num0 = this.locStorage.get('loc_num0');
    var ret_num0_01 = this.locStorage.get('loc_num0_01');
    buster.log('a=',ret_a, 'num0=',ret_num0, 'num0_01=',ret_num0_01);
    assert.equals(a, ret_a);
    assert.equals(num0, ret_num0);
    assert.equals(num0_01, ret_num0_01);
    this.locStorage.remove('loc_a');
    this.locStorage.remove('loc_num0');
    this.locStorage.remove('loc_num0_01');
    assert.isNull(this.locStorage.get('loc_a'));
    assert.isNull(this.locStorage.get('loc_num0'));
    assert.isNull(this.locStorage.get('loc_num0_01'));
  }
});

