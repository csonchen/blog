const assert = require('assert')
const { rob } = require('../src/打家劫舍')
const { climbStairs } = require('../src/爬楼梯')

describe('dp', function() {
  describe('爬楼梯', function() {
    it('1. 有1级楼梯，有1种方法', function() {
      assert.equal(climbStairs(1), 1)
    })
    it('2. 有2级楼梯，有2种方法', function() {
      assert.equal(climbStairs(2), 2)
    })
    it('3. 有4级楼梯，有5种方法', function() {
      assert.equal(climbStairs(4), 5)
    })
    it('4. 有n（10）级楼梯,有n(9) + n(8)种方法', function() {
      assert(climbStairs(10), climbStairs(8) + climbStairs(9))
    })
  })

  describe('打家劫舍', function() {
    it('1. 只有两家房子,分别有财产55元，44元，偷取最大值55', function() {
      const nums = [55, 44]
      assert.equal(rob(nums), 55)
    })
    it('2. 有4家房子，分别为55, 22, 33, 44，偷取最大值: 99', function() {
      const nums = [55, 22, 33, 44]
      // dp = [55, 55, 88, 99]
      assert.equal(rob(nums), 99)
    })
  })
})