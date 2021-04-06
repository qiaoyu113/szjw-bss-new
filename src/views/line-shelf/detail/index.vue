<template>
  <div class="p15 Detail">
    <h2
      v-show="isShowTitle"
      style="color:#ff455b"
    >
      线路快照:线路运营操作检查线路时候的线路信息的快照,作为评判的依据
    </h2>
    <SectionContainer
      title="基础信息"
      :md="true"
    >
      <self-form
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        class="p15 SuggestForm"
        :pc-col="6"
      />
    </SectionContainer>
    <SectionContainer
      title="配送信息"
      :md="true"
    >
      <self-form
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem1"
        size="small"
        class="p15 SuggestForm"
        :pc-col="6"
      >
        <template slot="lineArea">
          <div>
            {{ listQuery.provinceAreaName }}/{{ listQuery.cityAreaName }}/{{ listQuery.countyAreaName }}
          </div>
        </template>
        <template slot="serviceRequirementName">
          <el-tooltip
            v-if="listQuery.serviceRequirementName||listQuery.remark"
            placement="right"
          >
            <div
              slot="content"
              style="max-width:300px"
            >
              {{ listQuery.serviceRequirementName }} {{ listQuery.remark }}
            </div>
            <div
              class="ellipsis"
            >
              {{ listQuery.serviceRequirementName }} {{ listQuery.remark }}
            </div>
          </el-tooltip>
          <div v-else>
            暂无数据
          </div>
        </template>
      </self-form>
    </SectionContainer>
    <SectionContainer
      title="配送时间信息"
      :md="true"
    >
      <self-form
        ref="opopopop"
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem2"
        size="small"
        class="p15 SuggestForm"
        :pc-col="6"
      >
        <template slot="time">
          <div v-show="Number(listQuery.lineCategory) === 2">
            {{ listQuery.deliveryStartDate.split(" ")[0] }}-{{
              listQuery.deliveryEndDate.split(" ")[0]
            }}
          </div>
          <div v-show="Number(listQuery.lineCategory) === 1">
            {{ listQuery.deliveryWeekCycle }}
          </div>
        </template>
      </self-form>
    </SectionContainer>
    <SectionContainer
      title="结算信息"
      :md="true"
    >
      <self-form
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem3"
      />
    </SectionContainer>
    <SectionContainer
      title="货物信息"
      :md="true"
    >
      <self-form
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem4"
      />
    </SectionContainer>
    <SectionContainer
      title="标签信息"
      :md="true"
    >
      <self-form
        label-position="top"
        :list-query="listQuery"
        :form-item="formItem5"
      />
    </SectionContainer>
    <SectionContainer
      title="策展信息"
      :md="true"
    >
      <CuratorialInformation
        :img-arr="ImgArr"
        :project-strategy-info-v-o="projectStrategyInfoVO"
      />
    </SectionContainer>
    <SectionContainer
      title="操作日志"
      :md="true"
    >
      <self-table
        :row-class-name="tableRed"
        :index="false"
        :columns="columns"
        :table-data="tableData"
      >
        <template v-slot:beforeStateName="scope">
          <span>{{ scope.row.beforeStateName }}</span>
        </template>
        <template v-slot:afterStateName="scope">
          <span>{{ scope.row.afterStateName }}</span>
        </template>
      </self-table>
    </SectionContainer>
  </div>
</template>

<script lang="ts">
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getLineDetail, getLineSnapshot } from '@/api/line-shelf'
import CuratorialInformation from '@/views/line-shelf/detail/CuratorialInformation.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'LineDetail',
  components: {
    SectionContainer,
    SelfForm,
    SelfTable,
    CuratorialInformation
  }
})
export default class extends Vue {
  private isShowTitle = false;
  private dayIndex = 1000;
  private projectStrategyInfoVO: IState = {};
  private AllImg: Array<any> = [];
  private listQuery: IState = {
    lineName: '',
    lineId: '',
    projectName: '',
    projectId: '',
    deliveryStartDate: '',
    deliveryEndDate: '',
    warehouseName: '',
    lineCategoryName: '',
    lineTypeName: '',
    lineBalanceName: '',
    lineStateName: '',
    runTestStateName: '',
    waitDirveValidity: '',
    recruitWindowPeriod: '',
    stabilityRateName: '',
    lineSaleName: '',
    dutyManagerIdName: '',
    carTypeName: '', // 车型
    lineArea: '', // 配送区域
    districtArea: '', // 详细地址
    provinceAreaName: '',
    cityAreaName: '',
    countyAreaName: '',
    isBehavior: '', // 是否走禁行
    isRestriction: '', // 是否走现行
    oilElectricityRequirementName: '', // 油电要求
    handlingDifficultyName: '', // 装卸要求
    runSpeed: '', // 是否走高速
    returnBill: '', // 是否返仓
    serviceRequirementName: '', // 服务要求和备注
    warehouseDistrict: '', // 仓库位置
    distributionWay: '', // 配送方式
    deliveryNum: '', // 配送点数量
    distance: '', // 配送总里程

    time: '', // 配送时间
    lineCategory: '', // 是否稳定
    deliveryWeekCycle: '', // 稳定线路配送时间
    monthNum: '', // 预计月出车天数
    dayNum: '', // 每日配送趟数
    lineDeliveryInfoFORMS: [], // 预计工作时间段

    everyTripGuaranteed: '', // 每趟保底（元）
    everyUnitPrice: '', // 每趟提成（元）
    shipperOffer: '', // 预计月报价（元）
    incomeSettlementMethodName: '', // 计价方式
    settlementCycleName: '', // 结算周期
    settlementDays: '', // 结算天数
    incomeSettlementMethod: '', // 按趟计费

    cargoTypeName: '', // 货物类型
    carry: '', // 是否需要搬运

    isHot: '', // 是否爆款
    labelTypeName: '', // 线路肥瘦标签
    lineAdapterName: '', // 适配性
    lineUrgentName: '' // 线路紧急程度
  };
  // 基础信息
  private formItem: IState[] = [
    {
      type: 7,
      label: '线路名称',
      key: 'lineName'
    },
    {
      type: 7,
      label: '线路编号',
      key: 'lineId'
    },
    {
      type: 7,
      label: '项目名称',
      key: 'projectName'
    },
    {
      type: 7,
      label: '项目编号',
      key: 'projectId'
    },
    {
      type: 7,
      label: '仓名称',
      key: 'warehouseName'
    },
    {
      type: 7,
      label: '线路分类',
      key: 'lineCategoryName'
    },
    {
      type: 7,
      label: '是否为城配线',
      key: 'lineTypeName'
    },
    {
      type: 7,
      label: '是否有线路余额',
      key: 'lineBalanceName'
    },
    {
      type: 7,
      label: '线路状态',
      key: 'lineStateName'
    },
    {
      type: 7,
      label: '试跑状态',
      key: 'runTestStateName'
    },
    {
      type: 7,
      label: '上架截止日期',
      key: 'waitDirveValidity'
    },
    {
      type: 7,
      label: '招车窗口期',
      key: 'recruitWindowPeriod'
    },
    {
      type: 7,
      label: '线路稳定性',
      key: 'stabilityRateName'
    },
    {
      type: 7,
      label: '外线销售',
      key: 'lineSaleName'
    },
    {
      type: 7,
      label: '客户维护经理',
      key: 'dutyManagerIdName'
    }
  ];

  // 配送信息
  private formItem1: IState[] = [
    {
      type: 7,
      label: '配送车型',
      key: 'carTypeName'
    },
    {
      type: 'lineArea',
      label: '主要配送区域',
      key: 'lineArea',
      slot: true

    },
    {
      type: 7,
      label: '详细地址',
      key: 'districtArea'
    },
    {
      type: 7,
      label: '是否走禁行',
      key: 'isBehavior'
    },
    {
      type: 7,
      label: '是否走限行',
      key: 'isRestriction'
    },
    {
      type: 7,
      label: '油电要求',
      key: 'oilElectricityRequirementName'
    },
    {
      type: 7,
      label: '装卸要求',
      key: 'handlingDifficultyName'
    },
    {
      type: 7,
      label: '是否走高速',
      key: 'runSpeed'
    },
    {
      type: 7,
      label: '是否需要回单',
      key: 'returnBill'
    },
    {
      type: 7,
      label: '是否返仓',
      key: 'returnWarehouseName'
    },
    {
      type: 'serviceRequirementName',
      label: '服务要求和备注',
      key: 'serviceRequirementName',
      slot: true
    },
    {
      type: 7,
      label: '仓库位置',
      key: 'warehouseDistrict' //
    },
    {
      type: 7,
      label: '配送方式',
      key: 'distributionWay' // 1
    },
    {
      type: 7,
      label: '配送点数量',
      key: 'deliveryNum' // 1
    },
    {
      type: 7,
      label: '配送总里程',
      key: 'distance' // 1
    }
  ];
  // 配送时间信息
  private formItem2: IState[] = [
    {
      type: 'time',
      label: '配送时间',
      key: 'time',
      slot: true
    },
    {
      type: 7,
      label: '预计月出车天数',
      key: 'monthNum'
    },
    {
      type: 7,
      label: '每日配送趟数',
      key: 'dayNum'
    }
  ];
  // 结算信息
  private formItem3: IState[] = [
    {
      type: 7,
      label: '每趟提成（元）',
      key: 'everyUnitPrice'
    },
    {
      type: 7,
      label: '预计月报价（元）',
      key: 'shipperOffer'
    },
    {
      type: 7,
      label: '计价方式',
      key: 'incomeSettlementMethodName'
    },
    {
      type: 7,
      label: '结算周期',
      key: 'settlementCycleName'
    },
    {
      type: 7,
      label: '结算天数',
      key: 'settlementDays'
    },
    {
      type: 7,
      label: '每趟保底（元）',
      key: 'everyTripGuaranteed' // 1
    }
  ];
  // 货物信息
  private formItem4: IState[] = [
    {
      type: 7,
      label: '货物类型',
      key: 'cargoTypeName'
    },
    {
      type: 7,
      label: '是否需要搬运',
      key: 'carry'
    }
  ];
  // 标签信息
  private formItem5: IState[] = [
    {
      type: 7,
      label: '是否爆款',
      key: 'isHot'
    },
    {
      type: 7,
      label: '线路肥瘦标签',
      key: 'labelTypeName'
    },
    {
      type: 7,
      label: '适配性',
      key: 'lineAdapterName' // 1
    },
    {
      type: 7,
      label: '线路紧急程度',
      key: 'lineUrgentName' // 1
    }
  ];
  activated() {
    if (this.$route.path.split('/')[2] === 'lineSnapshot') {
      this.isShowTitle = !this.isShowTitle
      this.getAllLineSnapshot()
    } else {
      this.isShowTitle = false
      this.getAllLineDetail()
    }
  }
  // 操作日志
  private columns: IState = [
    {
      key: 'operTypeName',
      label: '类型'
    },
    {
      key: 'createrName',
      label: '用户名'
    },
    {
      key: 'createDate',
      label: '操作时间'
    },
    {
      key: 'beforeStateName',
      label: '操作前',
      slot: true
    },
    {
      key: 'afterStateName',
      label: '操作后',
      slot: true
    }
  ];
  private tableData: IState = [
    //   {
    //   operTypeName: '激活线路',
    //   createrName: '王小虎',
    //   createDate: '2020-01-03 12:00:00',
    //   beforeStateName: '未开跑下架/已开跑下架',
    //   afterStateName: '已上架'
    // },
    // {
    //   operTypeName: '下架线路',
    //   createrName: '王小虎',
    //   createDate: '2020-01-03 12:00:00',
    //   beforeStateName: '已上架/已开跑',
    //   afterStateName: '已开跑下架/未来跑下架'
    // },
    // {
    //   operTypeName: '编辑线路',
    //   createrName: '王小虎',
    //   createDate: '2020-01-03 12:00:00',
    //   beforeStateName: '',
    //   afterStateName: ''
    // },
    // {
    //   operTypeName: '创建线路',
    //   createrName: '王小虎',
    //   createDate: '2020-01-03 12:00:00',
    //   beforeStateName: '',
    //   afterStateName: '已上架'
    // }
  ];
  private ImgArr: IState = [
    {
      imgArr: [],
      tiele: '仓库图片'
    },
    {
      imgArr: [],
      tiele: '货物图片'
    },
    {
      imgArr: [],
      tiele: '装货图片'
    }
  ];

  // 获取基础信息
  private async getAllLineDetail() {
    try {
      let params = {
        lineId: this.$route.query.id
      }
      const { data: res } = await getLineDetail(params)
      if (res.success) {
        // this.listQuery = { ...res.data }
        this.listQuery.lineName = res.data.lineName
        this.listQuery.lineId = res.data.lineId
        this.listQuery.projectName = res.data.projectName
        this.listQuery.projectId = res.data.projectId
        this.listQuery.deliveryStartDate = res.data.deliveryStartDate
        this.listQuery.deliveryEndDate = res.data.deliveryEndDate
        this.listQuery.warehouseName = res.data.warehouseName
        this.listQuery.lineCategoryName = res.data.lineCategoryName
        this.listQuery.lineTypeName = res.data.lineTypeName
        this.listQuery.lineBalanceName = res.data.lineBalanceName
        this.listQuery.lineStateName = res.data.lineStateName
        this.listQuery.runTestStateName = res.data.runTestStateName
        this.listQuery.waitDirveValidity = res.data.waitDirveValidity
        this.listQuery.recruitWindowPeriod =
          res.data.recruitWindowPeriod + '天'
        this.listQuery.stabilityRateName = res.data.stabilityRateName
        this.listQuery.lineSaleName = res.data.lineSaleName
        this.listQuery.dutyManagerIdName = res.data.dutyManagerIdName

        this.listQuery.provinceAreaName = res.data.provinceAreaName
        this.listQuery.cityAreaName = res.data.cityAreaName
        this.listQuery.countyAreaName = res.data.countyAreaName

        this.listQuery.carTypeName = res.data.carTypeName
        this.listQuery.lineArea = res.data.lineArea
        this.listQuery.warehouseDistrict = res.data.warehouseDistrict
        this.listQuery.isBehavior = res.data.isBehavior === 1 ? '是' : '否'
        this.listQuery.isRestriction =
          res.data.isRestriction === 1 ? '是' : '否'
        this.listQuery.oilElectricityRequirementName =
          res.data.oilElectricityRequirementName
        this.listQuery.handlingDifficultyName = res.data.handlingDifficultyName
        this.listQuery.runSpeed = res.data.runSpeed === 1 ? '是' : '否'
        this.listQuery.returnBill = res.data.returnBill === 1 ? '是' : '否'
        this.listQuery.returnWarehouseName = res.data.returnWarehouseName
        this.listQuery.serviceRequirementName = res.data.serviceRequirementName
        this.listQuery.remark = res.data.remark
        this.listQuery.districtArea = res.data.districtArea
        this.listQuery.distributionWay =
          res.data.distributionWay === 1 ? '整车' : '多点配'
        this.listQuery.deliveryNum = res.data.deliveryNum + '个'
        this.listQuery.distance = res.data.distance + '公里'
        // 配送时间信息
        this.listQuery.monthNum = res.data.monthNum
        this.listQuery.lineCategory = res.data.lineCategory
        this.listQuery.dayNum = res.data.dayNum + '趟'
        this.listQuery.lineDeliveryInfoFORMS = res.data.lineDeliveryInfoFORMS
        const object: { [key: string]: any } = {}
        const activeFron: Array<any> = []
        this.listQuery.lineDeliveryInfoFORMS.forEach(
          (item: any, index: number) => {
            let abc = this.workTimeText(item, index)

            object['lineDeliveryInfoFORMS' + index] = abc
            // item.workingTimeStart + '-' + item.workingTimeEnd

            activeFron.push({
              type: 7,
              label: '预计工作时间段',
              key: 'lineDeliveryInfoFORMS' + index
            })
          }
        )
        this.formItem2.push(...activeFron)

        // this.listQuery = Object.assign({}, this.listQuery, object)
        this.listQuery = { ...this.listQuery, ...object }

        // let dayWork = res.data.deliveryWeekCycle.split(',').map((item:any) => {
        //   return '周' + item
        // })
        this.listQuery.deliveryWeekCycle = this.formatWeek(
          res.data.deliveryWeekCycle
        )

        // 结算信息
        this.listQuery.everyTripGuaranteed = res.data.everyTripGuaranteed
        this.listQuery.incomeSettlementMethod = res.data.incomeSettlementMethod
        this.listQuery.everyUnitPrice = res.data.everyUnitPrice
        this.listQuery.shipperOffer = res.data.shipperOffer
        this.listQuery.incomeSettlementMethodName = res.data.incomeSettlementMethodName
        this.listQuery.settlementCycleName = res.data.settlementCycleName
        this.listQuery.settlementDays = res.data.settlementDays
        if (Number(res.data.incomeSettlementMethod) === 1) {
          this.formItem3.splice(0, 1)
        }
        // 货物信息
        this.listQuery.cargoTypeName = res.data.cargoTypeName
        this.listQuery.carry = res.data.carry === 1 ? '是' : '否'
        // 标签信息
        this.listQuery.isHot = res.data.isHot === 1 ? '是' : '否'
        this.listQuery.labelTypeName = res.data.labelTypeName
        this.listQuery.lineAdapterName = res.data.lineAdapterName
        this.listQuery.lineUrgentName = res.data.lineUrgentName

        this.tableData = res.data.busiOperLogVOList
        this.projectStrategyInfoVO = res.data.projectStrategyInfoVO
        this.projectStrategyInfoVO.sellPointName = this.projectStrategyInfoVO.sellPointName.toString()
        let {
          cargoUrl,
          loadingPictureUrl,
          warehousePictureUrl
        } = res.data.projectStrategyInfoVO

        this.AllImg = [warehousePictureUrl, loadingPictureUrl, cargoUrl]
        this.ImgArr.map((item: any, index: any) => {
          item.imgArr = this.AllImg[index]
        })
      } else {
        this.$message.error(res.errorMsg || res.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  get routerKey() {
    return this.$route.query.id
  }
  private async getAllLineSnapshot() {
    try {
      let params = {
        snapshotId: this.$route.query.id
      }
      const { data: res } = await getLineSnapshot(params)
      if (res.success) {
        this.listQuery.lineName = res.data.lineName
        this.listQuery.lineId = res.data.lineId
        this.listQuery.projectName = res.data.projectName
        this.listQuery.projectId = res.data.projectId
        this.listQuery.deliveryStartDate = res.data.deliveryStartDate
        this.listQuery.deliveryEndDate = res.data.deliveryEndDate
        this.listQuery.warehouseName = res.data.warehouseName
        this.listQuery.lineCategoryName = res.data.lineCategoryName
        this.listQuery.lineTypeName = res.data.lineTypeName
        this.listQuery.lineBalanceName = res.data.lineBalanceName
        this.listQuery.lineStateName = res.data.lineStateName
        this.listQuery.runTestStateName = res.data.runTestStateName
        this.listQuery.waitDirveValidity = res.data.waitDirveValidity
        this.listQuery.recruitWindowPeriod =
          res.data.recruitWindowPeriod + '天'
        this.listQuery.stabilityRateName = res.data.stabilityRateName
        this.listQuery.lineSaleName = res.data.lineSaleName
        this.listQuery.dutyManagerIdName = res.data.dutyManagerIdName

        this.listQuery.provinceAreaName = res.data.provinceAreaName
        this.listQuery.cityAreaName = res.data.cityAreaName
        this.listQuery.countyAreaName = res.data.countyAreaName

        this.listQuery.carTypeName = res.data.carTypeName
        this.listQuery.lineArea = res.data.lineArea
        this.listQuery.warehouseDistrict = res.data.warehouseDistrict
        this.listQuery.isBehavior = res.data.isBehavior === 1 ? '是' : '否'
        this.listQuery.isRestriction =
          res.data.isRestriction === 1 ? '是' : '否'
        this.listQuery.oilElectricityRequirementName =
          res.data.oilElectricityRequirementName
        this.listQuery.handlingDifficultyName = res.data.handlingDifficultyName
        this.listQuery.runSpeed = res.data.runSpeed === 1 ? '是' : '否'
        this.listQuery.returnBill = res.data.returnBill === 1 ? '是' : '否'
        this.listQuery.returnWarehouseName = res.data.returnWarehouseName
        this.listQuery.serviceRequirementName = res.data.serviceRequirementName
        this.listQuery.remark = res.data.remark
        this.listQuery.districtArea = res.data.districtArea
        this.listQuery.distributionWay =
          res.data.distributionWay === 1 ? '整车' : '多点配'
        this.listQuery.deliveryNum = res.data.deliveryNum + '个'
        this.listQuery.distance = res.data.distance + '公里'
        // 配送时间信息
        this.listQuery.monthNum = res.data.monthNum
        this.listQuery.lineCategory = res.data.lineCategory
        this.listQuery.dayNum = res.data.dayNum + '趟'
        this.listQuery.lineDeliveryInfoFORMS = res.data.lineDeliveryInfoFORMS
        const object: { [key: string]: any } = {}
        const activeFron: Array<any> = []
        this.listQuery.lineDeliveryInfoFORMS.forEach(
          (item: any, index: number) => {
            let abc = this.workTimeText(item, index)
            object['lineDeliveryInfoFORMS' + index] = abc
            activeFron.push({
              type: 7,
              label: '预计工作时间段',
              key: 'lineDeliveryInfoFORMS' + index
            })
          }
        )
        this.formItem2.push(...activeFron)

        // this.listQuery = Object.assign({}, this.listQuery, object)
        this.listQuery = { ...this.listQuery, ...object }

        // let dayWork = res.data.deliveryWeekCycle.split(',').map((item:any) => {
        //   return '周' + item
        // })
        this.listQuery.deliveryWeekCycle = this.formatWeek(
          res.data.deliveryWeekCycle
        )

        // 结算信息
        this.listQuery.everyTripGuaranteed = res.data.everyTripGuaranteed
        this.listQuery.everyUnitPrice = res.data.everyUnitPrice
        this.listQuery.shipperOffer = res.data.shipperOffer
        this.listQuery.incomeSettlementMethodName =
          res.data.incomeSettlementMethodName
        this.listQuery.settlementCycleName = res.data.settlementCycleName
        this.listQuery.settlementDays = res.data.settlementDays
        if (Number(res.data.incomeSettlementMethod) === 1) {
          this.formItem3.splice(0, 1)
        }
        // 货物信息
        this.listQuery.cargoTypeName = res.data.cargoTypeName
        this.listQuery.carry = res.data.carry === 1 ? '是' : '否'
        // 标签信息
        this.listQuery.isHot = res.data.isHot === 1 ? '是' : '否'
        this.listQuery.labelTypeName = res.data.labelTypeName
        this.listQuery.lineAdapterName = res.data.lineAdapterName
        this.listQuery.lineUrgentName = res.data.lineUrgentName

        this.tableData = res.data.busiOperLogVOList
        this.projectStrategyInfoVO = res.data.projectStrategyInfoVO
        this.projectStrategyInfoVO.sellPointName = this.projectStrategyInfoVO.sellPointName.toString()
        let {
          warehousePictureUrl,
          cargoUrl,
          loadingPictureUrl
        } = res.data.projectStrategyInfoVO
        this.AllImg = [warehousePictureUrl, cargoUrl, loadingPictureUrl]
        this.ImgArr.map((item: any, index: any) => {
          item.imgArr = this.AllImg[index]
        })
      } else {
        this.$message.error(res.errorMsg || res.message)
      }
    } catch (err) {
      console.log(err)
    }
  }
  // 编辑线路变颜色
  private tableRed({ row, rowIndex }: any) {
    if (row.operTypeName === '编辑线路') {
      return 'warning-row'
    }
  }
  private workTimeText(item:any, idx:any) {
    const [start, end] = [item.workingTimeStart, item.workingTimeEnd]
    if (start && end) {
      if (idx > this.dayIndex) {
        return `次日${start}-次日${end}`
      } else if (Number(start.substring(0, 2)) > Number(end.substring(0, 2))) {
        this.dayIndex = idx
        return `${start}-次日${end}`
      }
    }
    return `${start}-${end}`
  }
  // mounted() {
  //   this.getAllLineDetail()
  // }
  created() {
    // this.$route.path.split('/')[2] === 'lineSnapshot' ? this.isShowTitle = !this.isShowTitle : this.isShowTitle = false
    if (this.$route.path.split('/')[2] === 'lineSnapshot') {
      this.isShowTitle = !this.isShowTitle
      this.getAllLineSnapshot()
    } else {
      this.isShowTitle = false
      this.getAllLineDetail()
    }
  }
  formatWeek(time: string) {
    if (!time) {
      return ''
    }
    const arr = [
      {
        label: '周一',
        value: 1
      },
      {
        label: '周二',
        value: 2
      },
      {
        label: '周三',
        value: 3
      },
      {
        label: '周四',
        value: 4
      },
      {
        label: '周五',
        value: 5
      },
      {
        label: '周六',
        value: 6
      },
      {
        label: '周日',
        value: 7
      }
    ]
    const str = time.split(',').sort().map((item: any) => {
      return arr[Number(item) + -1].label
    })
    return str.join(',')
  }
}
</script>
<style lang="scss">
.Detail {
  .el-table {
    .warning-row {
      td {
        color: #ff455b;
      }
    }
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:word-break
  }
}
</style>
