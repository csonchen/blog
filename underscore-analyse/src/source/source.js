const _ = {}

_.first = function(array, n) {
  if (array == null) return void 0

  if (n == null) return array[0]

  return _.initial(array, array.length - n)
}

_.initial = function(array, n) {
  return Array.prototype.slice.call(
    array, 
    0, 
    Math.max(0, array.length - (n == null ? 1 : n))
  )
}

_.rest = function(array, n) {
  return Array.prototype.slice.call(
    array,
    n == null ? 1 : n
  )
}

_.last = function(array, n) {
  if (array == null) return void 0

  if (n == null) return array[array.length - 1]

  return _.rest(array, Math.max(0, array.length - n))
}

_.identity = function(value) {
  return value
}

_.compact = function(array) {
  return _.filter(array, _.identity)
}

_.filter = function(obj, predicate, context) {
  var results = []

  _.each(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value)
  })
  return results
}

function isArrayLike(obj) {
  return obj.length && typeof obj.length == 'number' && obj.length >= 0
}

_.each = function(obj, iteratee, context) {
  // iteratee = optimizeCb(iteratee, context)

  var i, length
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj) // value, index, obj
    }
  } else {
    var keys = Object.keys(obj)
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj) // value, key, obj
    }
  }

  return obj
}

module.exports = _