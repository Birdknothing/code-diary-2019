// 判断一级对象是否相同
export const eq = (oldData, newData) => {
  let equalFlag = true
  for (let key in oldData) {
    if (oldData[key] !== newData[key]) {
      equalFlag = false
      break
    }
  }
  return equalFlag
}
