interface configLineType {
 readonly WTZC:Array<number>,
 readonly WTGX:Array<number>,
 readonly LNCC:Array<number>,
 readonly LNZLB:Array<number>,
 readonly LNZLC:Array<number>,
}

enum configLineTypes {
  'WTZC'= 0,
  'WTGX'= 1,
  'LNCC'= 2,
  'LNZLB'= 3,
  'LNZLC'= 4
}
const lineType:configLineType = {
  WTZC: [0],
  WTGX: [1],
  LNCC: [175],
  LNZLB: [176],
  LNZLC: [176]
}

const roleType:configLineType = {
  WTZC: [1, 9],
  WTGX: [1, 10],
  LNCC: [11],
  LNZLB: [12, 13],
  LNZLC: [12, 13]
}

// 业务线
const lineTypeArr = [[0], [1], [175], [176], [176]]
// vvvv
const roleTypeArr = [[1, 9], [1, 10], [11], [12, 13], [12, 13]]
export const getLineType = (clueType:number) => {
  // let str = configLineTypes[clueType]
  // return lineType[str]
  return lineTypeArr[clueType]
}
export const getLineRoleType = (clueType:number) => {
  // let str = configLineTypes[clueType]
  // return roleType[str]
  return roleTypeArr[clueType]
}
