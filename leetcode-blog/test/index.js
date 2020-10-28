const assert = require('assert')
const { dp1 } = require('../src/爬楼梯')

describe('dp', function() {
  describe('爬楼梯', function() {
    it('1. 有1级楼梯，有1种方法', function() {
      assert.equal(dp1(1), 1)
    })
    it('2. 有2级楼梯，有2种方法', function() {
      assert.equal(dp1(2), 2)
    })
    it('3. 有4级楼梯，有5种方法', function() {
      assert.equal(dp1(4), 5)
    })
    it('4. 有n（10）级楼梯,有n(9) + n(8)种方法', function() {
      assert(dp1(10), dp1(8) + dp1(9))
    })
  })
})