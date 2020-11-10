const _ = require('underscore');

let result = null

const base = [5,4,3,2,1]

// _.first
result = _.first(base, 2)

// _.initial
result = _.initial(base, 2)

// _.last
result = _.last(base, 2)

// _.rest
result = _.rest(base)

// _conpact
result = _.compact([0, 1, false, '', 2, '3'])

// _flatten
result = _.flatten([1, [2], [3, [4]]])

// _.without
result = _.without([1,2,3,0,1,2,3], 0, 1)

// _.range
result = _.range(10, 2)

// _.sortedIndex
result = _.sortedIndex([10, 20, 30, 40], 35)
const stooges = [{name: 'moe', age: 40}, {name: 'curly', age: 60}]
result = _.sortedIndex(stooges, {name: 'cc', age: 44}, 'age')

console.log(result)