interface configLineType {
 readonly 'WTZC':Array<number>
 readonly 'WTGX':Array<number>
 readonly 'LNCC':Array<number>
 readonly 'LNZLB':Array<number>
 readonly 'LNZLC':Array<number>
 [key: string]: any
}

enum configLineTypes {
  'WTZC'= 0, // 梧桐共享
  'WTGX'= 1, // 梧桐专车
  'LNCC'= 2, // 雷鸟车池
  'LNZLB'= 3, // 雷鸟租赁B
  'LNZLC'= 4 // 雷鸟租赁C
}
const lineType:configLineType = {
  WTZC: [0],
  WTGX: [1],
  LNCC: [178],
  LNZLB: [5],
  LNZLC: [5]
}

const roleType:configLineType = {
  WTZC: [1, 9],
  WTGX: [1, 10],
  LNCC: [11],
  LNZLB: [12, 13],
  LNZLC: [12, 13]
}

export const getLineType = (clueType:number) => {
  return lineType[configLineTypes[clueType]]
}
export const getLineRoleType = (clueType:number) => {
  return roleType[configLineTypes[clueType]]
}
