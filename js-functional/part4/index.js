
// // trim :: String -> String
const trim = str => str.replace(/^\s*|\s*$/g, '')

// // normalize :: String -> String
const normalize = str => str.replace(/\-/g, '')

// let res = normalize(trim(' 1234-56-78  '))

const R = require('ramda')

// checkType :: Type -> Type -> Type | TypeError
const checkType = R.curry(function(typeDef, obj) {
	if(!R.is(typeDef, obj)) {
		let type = typeof obj;
		throw new TypeError(`Type mismatch. Expected [${typeDef}] but found [${type}]`);
	}
	return obj;
});

const Tuple = function () {
  const typeInfo = Array.prototype.slice.call(arguments, 0)
  const _T = function() {
    const values = Array.prototype.slice.call(arguments, 0)
    if (values.some(val => val === null || val === undefined)) {
      throw new ReferenceError('tuples may not have any null values')
    }

    if (values.length !== typeInfo.length) {
      throw new TypeError('Tuple arity does not match its prototype')
    }

    values.map((val, index) => {
      this['_' + (index + 1)] = checkType(typeInfo[index])(val)
    })
    Object.freeze(this)
  }

  _T.prototype.values = function() {
    return Object.keys(this).map(function(k) {
      return this[k]
    }, this)
  }

  return _T
}

const Status = Tuple(Boolean, String)

const isValid = function(str) {
  if (str.length === 0) {
    return new Status(false, 'Invalid input. Expected not-empty value!')
  } else {
    return new Status(true, 'Success!')
  }
}
res = isValid(normalize(trim('2323-2323-2323')))

const StringPair = Tuple(String, String)
const name = new StringPair('csonchen', 'sam')
const [first, last] = name.values()
console.log(first, last)
// console.log(res)

