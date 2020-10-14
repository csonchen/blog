const assert = require('assert');
const { initial, last } = require('../src/source/source');

// set basedata
const baseArray = [5,4,3,2,1]

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });

  describe('#initial()', function() {
    it('1. 不传n值，剔除最后一项元素', function() {
      assert.deepEqual(initial(baseArray), [5,4,3,2])
    })
    it('2. n=2, 剔除最后两项元素', function() {
      assert.deepEqual(initial(baseArray, 2), [5,4,3])
    })
  })

  describe('#last()', function() {
    it('1. n == null, 返回最后一项', function() {
      assert.deepEqual(last(baseArray), 1)
    })
    it ('2. n == 2, 返回后两项组成的数组', function() {
      assert.deepEqual(last(baseArray, 2), [2,1])
    })
  })
});