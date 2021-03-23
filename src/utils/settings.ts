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
  WTZC: [0],
  WTGX: [1],
  LNCC: [5],
  LNZLB: [5],
  LNZLC: [5]
}

// 业务线
const lineTypeArr = [[0], [1], [175], [176], [176]]
// vvvv
const roleTypeArr = [[0], [1], [175], [176], [176]]
export const getLineType = (clueType:number) => {
  let str = configLineTypes[clueType]
  return lineType[str]
}
export const getLineRoleType = (clueType:number) => {
  let str = configLineTypes[clueType]
  return lineType[str]
}
