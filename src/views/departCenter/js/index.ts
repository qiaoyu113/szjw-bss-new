import { Message } from 'element-ui'
import { GetCityByCode } from '@/api/common'
interface IState {
  [key: string]: any;
}
interface DictData {
  label:string;
  value:number;
}
// 转换字典接口获取的数据
export function mapDictData(arr:IState[]):DictData[] {
  let brr:DictData[] = []
  for (let i = 0; i < arr.length; i++) {
    let item:IState = arr[i]
    brr.push({
      label: item.dictLabel,
      value: +item.dictValue
    })
  }
  return brr
}
// 获取省、市、县三级联动
export async function getProviceCityCountryData(node: any, resolve: any) {
  if (node.level === 0) {
    let params = ['100000']
    let citys = await getProvinceList(params)
    resolve(citys)
  } else if (node.level === 1) {
    let params = ['100000']
    params.push(node.value)
    let groups = await getProvinceList(params)
    resolve(groups)
  } else if (node.level === 2) {
    let params = ['100000']
    params.push(node.parent.value)
    params.push(node.value)
    let users = await getProvinceList(params, 3)
    resolve(users)
  } else {
    resolve([])
  }
}
// 分别获取省、市、县
export async function getProvinceList(params:string[], level?:number, disabled?:boolean) {
  try {
    let { data: res } = await GetCityByCode(params)
    console.log(disabled)
    if (res.success) {
      let arr:DictData[] = res.data.filter((item:IState) => Number(item.code) !== -99).map((item:IState) => ({
        leaf: level ? (level === 3) : false,
        label: item.name,
        value: +item.code,
        disabled: (disabled === undefined) ? params.length === 1 : false
      }))
      return arr
    } else {
      Message.error(res.errorMsg)
    }
  } catch (err) {
    console.log(`get list fail:${err}`)
  } finally {
    //
  }
}
// 获取省、市 二级联动
export async function getProviceCityData(node: any, resolve: any) {
  console.log(node)
  if (node.level === 0) {
    let params = ['100000']
    let citys:any = await getProvinceList(params, 1, false)
    resolve(citys)
  } else if (node.level === 1) {
    let params = ['100000']
    params.push(node.value)
    let groups:any = await getProvinceList(params, 3, false)
    resolve(groups)
  }
}
// 获取省、市、县三级联动
export async function getProviceCityAndCountry(node: any, resolve: any) {
  if (node.level === 0) {
    let params = ['100000']
    let citys = await getProvinceList(params, 1, false)
    resolve(citys)
  } else if (node.level === 1) {
    let params = ['100000']
    params.push(node.value)
    let groups = await getProvinceList(params, 2, false)
    resolve(groups)
  } else if (node.level === 2) {
    let params = ['100000']
    params.push(node.parent.value)
    params.push(node.value)
    let users = await getProvinceList(params, 3, false)
    resolve(users)
  } else {
    resolve([])
  }
}
