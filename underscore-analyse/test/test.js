const assert = require('assert');
const { initial, last, compact, flatten, without, range } = require('../src/source/source');

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

  describe('#compact()', function() {
    it('1. 去掉false，0，"" 三种数据类型的元素', function() {
      assert.deepEqual(compact([0, 1, false, '', 2, '3']), [1,2,'3'])
    })
  })

  describe('#flatten', function() {
    it('1. 全部展示数组元素，组成一维数组', function() {
      assert.deepEqual(flatten([1, [2], [3, [4]]]), [1,2,3,4])
    })
    it('2. shallow: true, 只展开第一层数组', function() {
      assert.deepEqual(flatten([1, [2], [3, [4]]], true), [1, 2, 3, [4]])
    })
  })

  describe('#without', function() {
    it('剔除元素 —— 单项', function() {
      assert.deepEqual(without([1,2,3,0,1,2,3], 0, 1), [2,3,2,3])
    })
  })

  describe('#range', function() {
    it('入参5，生成0 - 4的数组', function() {
      assert.deepEqual(range(5), [0,1,2,3,4])
    })
  })
});