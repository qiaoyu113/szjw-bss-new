interface configLineType {
 readonly WTZC:number,
 readonly WTGX:number,
 readonly LNCC:number,
 readonly LNZLB:number,
 readonly LNZLC:number
}

export const configLineType = {
  WTZC: 0,
  WTGX: 1,
  LNCC: 2,
  LNZLB: 3,
  LNZLC: 4
}
// 业务线
const lineTypeArr = [[0], [1], [5], [5], [5]]
// 人员指着
const roleTypeArr = [[0], [1], [175], [176], [176]]
export const getLineType = (clueType:number) => {
  return lineTypeArr[clueType]
}
export const getLineRoleType = (clueType:number) => {
  return roleTypeArr[clueType]
}
