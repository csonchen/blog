const _ = require('underscore');

let result = null

const base = [5,4,3,2,1]

// _.first
result = _.first(base, 2)

// _.initial
result = _.initial(base, 2)

// _.last
result = _.last(base, 2)

console.log(result)