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

_.isArray = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

_.isArguments = function(obj) {
  return _.has(obj, 'callee')
}

_.has = function(obj, key) {
  return obj != null && Object.prototype.hasOwnProperty.call(obj, key)
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

function flatten(array, shallow, strict, startIndex) {
  var output = [], idx = 0
  for (let i = startIndex || 0, len = array.length; i < len; i++) {
    let value = array[i]

    if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
      // 递归展开
      if (!shallow) {
        value = flatten(value, shallow, strict)
      }

      let j = 0, len = value.length
      output.length += len

      while(j < len) {
        output[idx++] = value[j++]
      }
    } else if (!strict) {
      output[idx++] = value
    }
  }
  return output
}

_.flatten = function(array, shallow) {
  return flatten(array, shallow)
}

_.without = function(array) {
  return _.difference(array, Array.prototype.slice.call(arguments, 1))
}

_.contains = function(obj, item) {
  if (!isArrayLike(obj)) {
    obj = _.values(obj)
  }

  return obj.indexOf(item) >= 0
}

_.difference = function(array) {
  var rest = flatten(arguments, true, true, 1)

  return _.filter(array, function(value) {
    return !_.contains(rest, value)
  })
}

module.exports = _