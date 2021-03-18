// 是否为整数，否则保留2位
export const isInteger = (num:number) => {
  if (parseInt(String(num), 10) === num) {
    return num
  }
  return +num.toFixed(2)
}

// 求和函数
export const sumFunc = (values:number[]) => {
  let sums:number = 0
  if (!values.every(value => isNaN(value))) {
    sums = values.reduce((prev, curr) => {
      const value = Number(curr)
      if (!isNaN(value)) {
        return prev + curr
      } else {
        return prev
      }
    }, 0)
    return isInteger(sums)
  }
}

// 除法
export const divisionFunc = (values:number, value:number) => {
  if (value === 0) {
    return 0
  }
  let num:number = values / value
  return isInteger(num)
}
