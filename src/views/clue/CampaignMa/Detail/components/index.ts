// 是否为整数，否则保留2位
export const isInteger = (num:number) => {
  if (parseInt(String(num), 10) === num) {
    return num
  }
  return +num.toFixed(2)
}

export const accMulFunc = (num1:number, num2:number) => {
  return +accMul(num1, num2).toFixed(2)
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
    return sums
  }
}

// 除法
export const divisionFunc = (values:number, value:number, percent:number = 0) => {
  if (value === 0) {
    return 0
  }
  let num:number = Div(values, value)
  console.log(values, value, num)
  if (percent) {
    return +accMul(num, 100).toFixed(2)
  } else {
    return +num.toFixed(4)
  }
}
// 两个浮点数相除
const Div = (num1: any, num2: any) => {
  let t1
  let t2
  try {
    t1 = `${num1}`.split('.')[1].length
  } catch (e) {
    t1 = 0
  }
  try {
    t2 = `${num2}`.toString().split('.')[1].length
  } catch (e) {
    t2 = 0
  }
  const r1 = Number(`${num1}`.replace('.', ''))
  const r2 = Number(`${num2}`.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}
// 乘法函数
function accMul(arg1: { toString: () => any }, arg2: { toString: () => any }) {
  var m = 0; var s1 = arg1.toString(); var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
    //
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
    //
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) /
          Math.pow(10, m)
}
