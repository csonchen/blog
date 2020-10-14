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

module.exports = _