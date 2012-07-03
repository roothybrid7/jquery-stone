/*!
 * cookie_test.js
 */

'use strict';

var assert = buster.assert;
var refute = buster.refute;

buster.testCase('Stone cookie', {
  setUp: function() {
    this.PLUGIN_NAME = 'stone';
    this.DEFS = $.stone._defaults();
    this.origDocumentData = $(document).data();
    this.cookieStorage = $.stone.create({enableEngines: ['cookie']});
    this.cookieUtils = $.stone.availableEngines()['cookie'];
    this.timestamp = new Date(Date.now() + 86400 * 1000).getTime();
  },
  tearDown: function() {
    $(document).data(this.origDocumentData);
    this.cookieUtils.clear(new RegExp('test_'));
    this.cookieStorage.clear();
    this.cookieStorage = null;
  },
  'enableEngines': function() {
    var opts = this.cookieStorage.options;
    assert.equals('cookie', opts.enableEngines[0]);
  },
  'set, get and remove value': function() {
    var a = {value: 'a', timestamp: this.timestamp},
        num0 = {value: 0, timestamp: this.timestamp},
        num0_01 = {value: 0.01, timestamp: this.timestamp};
    this.cookieUtils.set('test_a', a);
    this.cookieUtils.set('test_d', num0);
    this.cookieUtils.set('test_f', num0_01);
    var ret_a = this.cookieUtils.get('test_a');
    var ret_num0 = this.cookieUtils.get('test_d');
    var ret_num0_01 = this.cookieUtils.get('test_f');
    buster.log('a=',ret_a,'num0=',ret_num0,'num0_01=',ret_num0_01);
    assert.equals(a, ret_a);
    assert.equals(num0, ret_num0);
    assert.equals(num0_01, ret_num0_01);
    this.cookieUtils.remove('test_a');
    this.cookieUtils.remove('test_d');
    this.cookieUtils.remove('test_f');
    assert.isNull(this.cookieUtils.get('test_a'));
    assert.isNull(this.cookieUtils.get('test_d'));
    assert.isNull(this.cookieUtils.get('test_f'));
  },
  'set, get and remove object': function() {
    var T = {value: true, timestamp: this.timestamp},
        F = {value: false, timestamp: this.timestamp},
        obj = {value: {a:1,b:{c:2, data: [1,2,3]}}, timestamp: this.timestamp},
        arr = {value: [1,'b',3, {id: 1, text: 'a'}], timestamp: this.timestamp};
    this.cookieUtils.set('test_T', T);
    this.cookieUtils.set('test_F', F);
    this.cookieUtils.set('test_obj', obj);
    this.cookieUtils.set('test_arr', arr);
    var ret_T = this.cookieUtils.get('test_T');
    var ret_F = this.cookieUtils.get('test_F');
    var ret_obj = this.cookieUtils.get('test_obj');
    var ret_arr = this.cookieUtils.get('test_arr');
    assert.equals(T, ret_T);
    assert.equals(F, ret_F);
    assert.equals(obj, ret_obj);
    assert.equals(arr, ret_arr);
    this.cookieUtils.remove('test_T');
    this.cookieUtils.remove('test_F');
    this.cookieUtils.remove('test_obj');
    this.cookieUtils.remove('test_arr');
    assert.isNull(this.cookieUtils.get('test_T'));
    assert.isNull(this.cookieUtils.get('test_F'));
    assert.isNull(this.cookieUtils.get('test_obj'));
    assert.isNull(this.cookieUtils.get('test_arr'));
  },
  'clear values': function() {
    var val = {value: 'a', timestamp: this.timestamp},
        recVal = {value: {a: 1, b:2, c: [1,3,4]}, timestamp: this.timestamp};
    this.cookieUtils.set('clr_val', val);
    this.cookieUtils.set('clr_recVal', recVal);
    this.cookieUtils.clear(new RegExp('clr_'));
    assert.isNull(this.cookieUtils.get('clr_val'));
    assert.isNull(this.cookieUtils.get('clr_recVal'));
  }
});
