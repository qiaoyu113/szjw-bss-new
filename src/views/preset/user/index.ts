import { Message } from 'element-ui'
import { getDutyAndRoleList, getOfficeByCurrentUserV2 as getOfficeByCurrentUser } from '@/api/system'
import { getOfficeList } from '@/api/preset'
interface IState {
  [key: string]: any;
}
// 获取组织架构
export const GetOfficeByCurrentUser = async() => {
  try {
    let { data: res } = await getOfficeByCurrentUser()
    if (res.success) {
      let arrs = res.data
      let brrs = deeploopOffice(arrs)
      let officeArr:[] = []
      officeArr.push(...(brrs as []))
      return officeArr
    } else {
      Message.error(res.errorMsg)
      return []
    }
  } catch (err) {
    console.log(`get office fail:${err}`)
    return []
  } finally {
    //
  }
}

export const GetOfficeByCurrentUser1 = async(node:any) => {
  try {
    let params:IState = {
      flag: true
    }
    if (node.level === 0) {
      let arr = [
        {
          value: 16,
          label: '城市组织',
          leaf: false,
          type: 2,
          disabled: true
        },
        {
          value: -1,
          label: '大区公共组织',
          type: 2,
          leaf: false,
          disabled: true
        },
        {
          value: -2,
          label: '总部组织',
          leaf: true,
          disabled: true
        }
      ]
      return arr
    } else if (node.level === 1) {
      params.parentId = node.value
    } else {
      params.parentId = node.value.split('-')[0]
    }
    let { data: res } = await getOfficeList(params)
    if (res.success) {
      let arr:[] = res.data.map((item:IState) => ({
        value: `${item.id}-${item.type}-${item.dutyId}`,
        label: item.name,
        disabled: item.type === 3,
        leaf: false
      }))
      return arr
    } else {
      Message.error(res.errorMsg)
      return []
    }
  } catch (err) {
    console.log(`get office fail:${err}`)
    return []
  } finally {
    //
  }
}
// 组织架构数据改造
export const deeploopOffice = (arrs:any[]) => {
  let brrs:any[] = []
  arrs.forEach(item => {
    if (item.type === 3) {
      item.disabled = true
    }
    if (item.officeVOs === null || item.officeVOs.length === 0) {
      delete item.officeVOs
    } else {
      let crr = deeploopOffice(item.officeVOs)
      item.officeVOs = crr
    }
    brrs.push(item)
  })
  return brrs
}

// 获取角色
export const GetDutyAndRoleList = async(params:IState) => {
  try {
    let { data: res } = await getDutyAndRoleList(params)
    if (res.success) {
      let arrs = res.data
      let roleArr:[] = []
      let brrs = deeploopRole(arrs)
      roleArr.push(...(brrs as []))
      return roleArr
    } else {
      Message.error(res.errorMsg)
      return []
    }
  } catch (err) {
    console.log(`get role list fail:{err}`)
    return []
  } finally {
    //
  }
}
// 角色列表数据改造
export const deeploopRole = (arrs:any[]) => {
  let brrs:any[] = []
  arrs.forEach(item => {
    if (item.childDuty === null || item.childDuty.length === 0) {
      delete item.childDuty
      if (item.dutyLevel < 3) {
        item.disabled = true
      }
    } else {
      let crr = deeploopRole(item.childDuty)
      item.childDuty = crr
    }
    brrs.push(item)
  })
  return brrs
}
// 组织变化拼接获取角色的参数组装
export const GetRoleParamsByOfficeId = (val:number[], officeArr:IState[]) => {
  let obj:{
    [propName:string]:any
    } = {
      officeVOs: []
    }
  if (val.length >= 1) {
    obj = officeArr.filter((item:any) => item.id === val[0])[0]
  }

  if (val.length >= 2) {
    obj = obj.officeVOs.filter((item:any) => item.id === val[1])[0]
  }

  if (val.length >= 3) {
    obj = obj.officeVOs.filter((item:any) => item.id === val[2])[0]
  }
  if (val.length >= 4) {
    obj = obj.officeVOs.filter((item:any) => item.id === val[3])[0]
  }
  if (val.length >= 5) {
    obj = obj.officeVOs.filter((item:any) => item.id === val[4])[0]
  }
  // 目前最大是5级
  let officeLevel:number = 0
  if (obj.type === 1) { // 总部
    officeLevel = 1
  } else if (obj.type === 2) { // 大区
    officeLevel = 2
  } else { // 业务线
    officeLevel = 3
  }
  let params:IState = {
    officeLevel
  }
  if (obj.type > 3) {
    params.dutyId = obj.dutyId
  }
  return params
}
