import { Message } from 'element-ui'
import { getDutyAndRoleList, getOfficeByCurrentUserV2 as getOfficeByCurrentUser } from '@/api/system'
import { getOfficeList } from '@/api/preset'
interface IState {
  [key: string]: any;
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
          value: 0,
          label: '总部组织',
          leaf: true,
          disabled: true
        }
      ]
      return arr
    } else if (node.level === 1) {
      params.parentId = node.value
    } else {
      params.parentId = node.value.split(',')[0]
    }
    let { data: res } = await getOfficeList(params)
    if (res.success) {
      let arr:[] = res.data.map((item:IState) => ({
        value: `${item.id},${item.type},${item.dutyId}`,
        label: item.name,
        disabled: item.type === 3
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
