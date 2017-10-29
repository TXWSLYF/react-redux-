//将hasOwn的引用事先保存下来，减少沿原型链检索时间
const hasOwn = Object.prototype.hasOwnProperty

//判断两个参数是否一致
function is(x, y) {
  //当两个参数严格相等时，可能会出现(-0, 0)这种情况，应该判断为不一致
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    //当两个参数判断为不一致时，可能会出现(NaN, NaN)这种情况，这种情况应该判断为一致，在js里只有NaN是和自身不相等的
    return x !== x && y !== y
  }
}

export default function shallowEqual(objA, objB) {
  //如果两个参数一致，直接返回true
  if (is(objA, objB)) return true

  //在两个参数不一致的前提下，如果objA是基本类型，这时objB有两种情况
  //1.objB也是基本类型，应该返回false
  //2.objB为引用类型，应该返回false
  //所以objA !== 'object'可以直接判断应该返回false
  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  //如果两者的键值数目不同，直接返回false
  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    //只要两者有一个键值对不同，就返回false。从这里可以看出，shallowEqual只进行了一层比较
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}
