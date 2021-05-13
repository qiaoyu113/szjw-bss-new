<template>
  <div class="DetailDialog">
    <SelfDialog
      :visible.sync="show"
      title="司机信息"
      :show-cancel-button="false"
      :show-confirm-button="false"
      append-to-body
      @open="open"
    >
      <div style="min-height:500px">
        <el-tabs
          v-model="active"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="基础信息"
            name="first"
          >
            <SelfForm
              :list-query="listQuery"
              :form-item="formItem"
              label-width="120px"
              label-suffix=" :"
            >
              <template slot="address">
                <span v-if="listQuery.liveDistrict">{{ listQuery.liveProvinceName }}-{{ listQuery.liveCityName }}-{{ listQuery.liveCountyName }}-{{ listQuery.liveDistrict }}</span>
                <span v-else>{{ listQuery.liveProvinceName }}-{{ listQuery.liveCityName }}-{{ listQuery.liveCountyName }}</span>
              </template>
            </SelfForm>
          </el-tab-pane>
          <el-tab-pane
            label="司机标签"
            name="second"
          >
            <SelfForm
              :list-query="listQuery"
              :form-item="formItem1"
              label-width="120px"
              label-suffix=" :"
            >
              <template slot="behaviorArea">
                <span>{{ listQuery.breakingNodrivingProvinceName }}-{{ listQuery.breakingNodrivingCityName }}-{{ listQuery.breakingNodrivingCountyName }}</span>
              </template>
              <template slot="restrictionArea">
                <span>{{ listQuery.breakingTrafficRestrictionProvinceName }}-{{ listQuery.breakingTrafficRestrictionCityName }}-{{ listQuery.breakingTrafficRestrictionCountyName }}</span>
              </template>

              <template slot="startArea">
                <span class="area">{{ listQuery.startPointProvinceName }}-{{ listQuery.startPointCityName }}-{{ listQuery.startPointCountyName }}</span>
                <span>{{ listQuery.startPointStartTime }}-{{ listQuery.startPointEndTime }}</span>
              </template>
              <template slot="lineArea">
                <span class="area">{{ listQuery.deliveryPointProvinceName }}-{{ listQuery.deliveryPointCityName }}-{{ listQuery.deliveryPointCountyName }}</span>
                <span>{{ listQuery.deliveryPointStartTime }}-{{ listQuery.deliveryPointEndTime }}</span>
              </template>
            </SelfForm>
          </el-tab-pane>
          <el-tab-pane
            label="试跑信息"
            name="third"
          >
            <SelfTable
              :columns="columns"
              :index="false"
              :table-data="tableDataDetailInfor"
              :operation-list="[]"
              :page="page"
              @onPageSize="handlePageSize"
            >
              <template v-slot:distributionTime="scope">
                <span v-if="scope.row.deliveryStartDate"> {{ scope.row.deliveryStartDate }}-{{ scope.row.deliveryEndDate }}</span>
                <span v-else>暂无数据</span>
              </template>
            </SelfTable>
          </el-tab-pane>
          <el-tab-pane
            label="外呼记录"
            name="fourth"
          >
            <SelfTable
              :columns="columns1"
              :index="false"
              :table-data="tableDataDetailRecord"
              :operation-list="[]"
              :page="page"
              @onPageSize="handlePageSize1"
            >
              <template v-slot:recordFileAddress="scope">
                <a
                  v-if="scope.row.recordFileAddress"
                  :href="scope.row.recordFileAddress"
                  style="color:#649CEE;cursor: pointer;"
                >Mp4</a>
                <span v-else>暂无数据</span>
              </template>
            </SelfTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import { getCallDetail, getRunDetail, getDriverDetail, getBasicDetail } from '@/api/departCenter'
import { logout } from '@/api/users'
interface IState {
  [key: string]: any;
}
  interface PageObj {
    page:number,
    limit:number,
    total?:number
  }
@Component({
  name: 'DetailDialog',
  components: {
    SelfDialog,
    SelfForm,
    SelfTable
  }
})
export default class extends Vue {
  @Prop({ default: false }) dialogTableVisible!: boolean; // 弹框显示
  @Prop({ default: '' }) driverId!: String;
  @PropSync('actived', { type: String }) active!: string
  @PropSync('dialogTableVisible', { type: Boolean }) show!: Boolean
  private page :PageObj= {
    page: 1,
    limit: 10,
    total: 1
  }
  private listQuery: any = {
    currentCarTypeName: '',
    canBreakingNodriving: '',
    canBreakingTrafficRestriction: '',
    plateNo: '', // 车牌号
    busiTypeName: '', // 业务线
    liveDistrict: '', // 居住地址
    age: '', // 年龄
    statusName: '', // 状态
    orderId: '', // 订单编号
    contractStatusName: '', // 合同状态
    behaviorArea: '', // 可闯禁行区域
    breakingNodrivingProvinceName: '',
    breakingNodrivingCityName: '',
    breakingNodrivingCounty: '',
    restrictionArea: '', // 可闯限行区域
    heavyLifting: '', // 装卸接收程度
    deliveryDifficulty: '', // 配送复杂度
    expectAccountingPeriod: '', // 期望账期
    expectIncomeTrip: '', // 期望运费
    expectStabilityTemporary: '', // 期望稳定/临时
    hasIncomeOutside: '', // 外面是否有活
    startArea: '', // 起始点
    lineArea: '', // 配送点
    driverSituation: '', // 司机情况
    remarksName: '', // 备注
    liveProvinceName: '',
    liveCityName: '',
    liveCountyName: ''
  };
  private formItem: any[] = [
    {
      type: 7,
      key: 'currentCarTypeName',
      label: '车型',
      col: 24
    },
    {
      type: 7,
      key: 'canBreakingNodriving',
      label: '能否闯禁行',
      col: 24
    },
    {
      type: 7,
      key: 'canBreakingTrafficRestriction',
      label: '能否闯限行',
      col: 24
    },
    {
      type: 7,
      key: 'plateNo',
      label: '车牌号',
      col: 24
    },
    {
      type: 7,
      key: 'busiTypeName',
      label: '业务线',
      col: 24
    },
    {
      type: 'address',
      key: 'address',
      label: '现居住地址',
      col: 24,
      slot: true
    },
    {
      type: 7,
      key: 'age',
      label: '司机年龄',
      col: 24
    },
    {
      type: 7,
      key: 'statusName',
      label: '司机状态',
      col: 24
    },
    {
      type: 7,
      key: 'orderId',
      label: '订单编号',
      col: 24
    },
    {
      type: 7,
      key: 'contractStatusName',
      label: '合同状态',
      col: 24
    }
  ];
  private formItem1: any[] = [
    {
      type: 7,
      key: 'canBreakingNodriving',
      label: '是否可以闯禁行',
      col: 24
    },
    {
      type: 'behaviorArea',
      key: 'behaviorArea',
      label: '可闯禁行区域',
      slot: true,
      col: 24
    },
    {
      type: 7,
      key: 'canBreakingTrafficRestriction',
      label: '是否可以闯限行',
      col: 24
    },
    {
      type: 'restrictionArea',
      key: 'restrictionArea',
      label: '可闯限行区域',
      slot: true,
      col: 24
    },
    {
      type: 7,
      key: 'heavyLifting',
      label: '装卸接收程度',
      col: 24
    },
    {
      type: 7,
      key: 'deliveryDifficulty',
      label: '配送复杂度',
      col: 24
    },
    {
      type: 7,
      key: 'expectAccountingPeriod',
      label: '期望账期',
      col: 24
    },
    {
      type: 7,
      key: 'expectIncomeTrip',
      label: '期望运费（趟）',
      col: 24
    },
    {
      type: 7,
      key: 'expectStabilityTemporary',
      label: '期望稳定/临时',
      col: 24
    },
    {
      type: 7,
      key: 'hasIncomeOutside',
      label: '外面是否有活',
      col: 24
    },
    {
      type: 'startArea',
      key: 'startArea',
      label: '起始点 (4级)',
      col: 24,
      slot: true
    },
    {
      type: 'lineArea',
      key: 'lineArea',
      label: '配送点 (4级)',
      col: 24,
      slot: true
    },
    {
      type: 7,
      key: 'driverSituation',
      label: '司机情况',
      col: 24
    },
    {
      type: 7,
      key: 'remarksName',
      label: '备注',
      col: 24
    }
  ];
   private formItem2: any[] = [
     {
       type: 7,
       key: 'canBreakingNodriving',
       label: '是否可以闯禁行',
       col: 24
     },
     {
       type: 'behaviorArea',
       key: 'behaviorArea',
       label: '可闯禁行区域',
       slot: true,
       col: 24
     },
     {
       type: 7,
       key: 'canBreakingTrafficRestriction',
       label: '是否可以闯限行',
       col: 24
     },
     {
       type: 'restrictionArea',
       key: 'restrictionArea',
       label: '可闯限行区域',
       slot: true,
       col: 24
     },
     {
       type: 7,
       key: 'heavyLifting',
       label: '装卸接收程度',
       col: 24
     },
     {
       type: 7,
       key: 'deliveryDifficulty',
       label: '配送复杂度',
       col: 24
     },
     {
       type: 7,
       key: 'expectAccountingPeriod',
       label: '期望账期',
       col: 24
     },
     {
       type: 7,
       key: 'expectIncomeTrip',
       label: '期望运费（趟）',
       col: 24
     },
     {
       type: 7,
       key: 'expectStabilityTemporary',
       label: '期望稳定/临时',
       col: 24
     },
     {
       type: 7,
       key: 'hasIncomeOutside',
       label: '外面是否有活',
       col: 24
     },
     {
       type: 'startArea',
       key: 'startArea',
       label: '起始点 (4级)',
       col: 24,
       slot: true
     },
     {
       type: 'lineArea',
       key: 'lineArea',
       label: '配送点 (4级)',
       col: 24,
       slot: true
     },
     {
       type: 7,
       key: 'driverSituation',
       label: '司机情况',
       col: 24
     },
     {
       type: 7,
       key: 'remarksName',
       label: '备注',
       col: 24
     }
   ];

  // 详情弹框外呼记录表格
  private tableDataDetailRecord: IState = [
    {
      phoneName: '张吃错',
      phoneState: '已接通',
      phoneTime: '4分04秒',
      outboundTime: '2021-4-30 16:10:20',
      hangUpTime: '2021-5-01 16:10:20',
      phonefile: 'txt',
      createInterval: '一小时'
    }
  ];
  private tableDataDetailInfor: IState = [];
  private columns: IState = [
    {
      key: 'createDate',
      label: '创建意向时间',
      'width': '140px'
    },
    {
      key: 'startDate',
      label: '试跑开始时间',
      'width': '140px'
    },
    {
      key: 'endDate',
      label: '试跑结束时间',
      'width': '140px'
    },
    {
      key: 'lineName',
      label: '线路名称',
      'width': '140px'
    },
    {
      key: 'warehouseAreaName',
      label: '仓库位置'
    },
    {
      key: 'deliveryAreaName',
      label: '主要配送区域'
    },
    {
      key: 'distributionTime',
      label: '配送时间',
      'width': '245px',
      slot: true
    },
    {
      key: 'deliveryCount',
      label: '配送次数'
    },
    {
      key: 'droppedReason',
      label: '掉线原因'
    },
    {
      key: 'driverMatchManager',
      label: '司机撮合经理'
    }
  ];
  private columns1: IState = [
    {
      key: 'inviteName',
      label: '拨打人'
    },
    {
      key: 'callStatusName',
      label: '拨打状态'
    },
    {
      key: 'callDuration',
      label: '拨打时长'
    },
    {
      key: 'beginTime',
      label: '外呼时间',
      'width': '140px'
    },
    {
      key: 'endTime',
      label: '挂断时间',
      'width': '140px'
    },
    {
      key: 'recordFileAddress',
      label: '通话录音文件',
      slot: true
    },
    {
      key: 'intentionIntervalTime',
      label: '创建试跑意向间隔时间'
    }
  ];

  open() {
    // 请求第一次tab的数据
    this.getData(this.active)
  }
  handleClick(tab: any) {
    this.getData(tab.name)
  }
  getData(index:string) {
    this.page.page = 1
    this.page.limit = 10
    if (index === 'first') {
      this.getBasicsInfor()
    } else if (index === 'second') {
      this.getDriverLabel()
    } else if (index === 'third') {
      this.getRunInfor()
    } else if (index === 'fourth') {
      this.getCallRecord()
    }
  }
  // 外呼记录
  async getCallRecord() {
    try {
      let params:any = {
        limit: this.page.limit,
        page: this.page.page,
        businessId: this.driverId,
        module: 'match',
        operType: 'driver_push'
      }
      let { data: res } = await getCallDetail(params)

      if (res.success) {
        this.tableDataDetailRecord = res.data
        this.page.total = res.page.total
      }
    } catch (err) {
      console.log(err)
    }
  }
  async getRunInfor() {
    try {
      let parmas:any = {
        limit: this.page.limit,
        page: this.page.page,
        driverId: this.driverId
      }
      let { data: res } = await getRunDetail(parmas)
      if (res.success) {
        this.tableDataDetailInfor = res.data
        this.page.total = res.page.total
      }
    } catch (err) {
      console.log(err)
    }
  }
  async getDriverLabel() {
    try {
      let parmas:any = {
        driverId: this.driverId
      }
      let { data: res } = await getDriverDetail(parmas)
      if (res.success) {
        this.formItem1 = this.formItem2
        this.listQuery.canBreakingNodriving = res.data.canBreakingNodriving ? '是' : '否'
        if (!res.data.canBreakingNodriving) {
          this.formItem1 = this.formItem1.filter((item:any, index:any) => {
            return item.key !== 'behaviorArea'
          })
        }
        // 禁行区域
        this.listQuery.breakingNodrivingProvinceName = res.data.breakingNodrivingProvinceName
        this.listQuery.breakingNodrivingCityName = res.data.breakingNodrivingCityName
        this.listQuery.breakingTrafficRestrictionProvinceName = res.data.breakingTrafficRestrictionProvinceName
        this.listQuery.breakingTrafficRestrictionCityName = res.data.breakingTrafficRestrictionCityName
        this.listQuery.breakingNodrivingCountyName = res.data.breakingNodrivingCountyName
        this.listQuery.breakingNodrivingCountyName = this.listQuery.breakingNodrivingCountyName.join(' ')
        this.listQuery.breakingTrafficRestrictionCountyName = res.data.breakingTrafficRestrictionCountyName
        this.listQuery.breakingTrafficRestrictionCountyName = this.listQuery.breakingTrafficRestrictionCountyName.join(' ')
        // 起始点
        this.listQuery.startPointProvinceName = res.data.startPointProvinceName
        this.listQuery.startPointCityName = res.data.startPointCityName
        this.listQuery.startPointCountyName = res.data.startPointCountyName
        this.listQuery.startPointStartTime = res.data.startPointStartTime
        this.listQuery.startPointEndTime = res.data.startPointEndTime
        // 配送点
        this.listQuery.deliveryPointProvinceName = res.data.deliveryPointProvinceName
        this.listQuery.deliveryPointCityName = res.data.deliveryPointCityName
        this.listQuery.deliveryPointCountyName = res.data.deliveryPointCountyName
        this.listQuery.deliveryPointStartTime = res.data.deliveryPointStartTime
        this.listQuery.deliveryPointEndTime = res.data.deliveryPointEndTime
        this.listQuery.canBreakingTrafficRestriction = res.data.canBreakingTrafficRestriction ? '是' : '否'
        if (!res.data.canBreakingTrafficRestriction) {
          this.formItem1 = this.formItem1.filter((item:any, index:any) => {
            return item.key !== 'restrictionArea'
          })
        }
        this.listQuery.heavyLifting = res.data.heavyLiftingName
        this.listQuery.deliveryDifficulty = res.data.deliveryDifficultyName // 数组
        this.listQuery.deliveryDifficulty = this.listQuery.deliveryDifficulty.join('、') // 数组
        this.listQuery.expectAccountingPeriod = res.data.expectAccountingPeriodName
        this.listQuery.expectIncomeTrip = res.data.expectIncomeTrip
        this.listQuery.expectStabilityTemporary = res.data.expectStabilityTemporaryName // 数组
        this.listQuery.expectStabilityTemporary = this.listQuery.expectStabilityTemporary.join('、')
        this.listQuery.hasIncomeOutside = res.data.hasIncomeOutside ? '是' : '否'
        this.listQuery.driverSituation = res.data.driverSituationName
        this.listQuery.remarksName = res.data.remarksName
      }
    } catch (err) {
      console.log(err)
    }
  }
  async getBasicsInfor() {
    try {
      let parmas:any = {
        driverId: this.driverId
      }
      let { data: res } = await getBasicDetail(parmas)
      if (res.success) {
        this.listQuery.currentCarTypeName = res.data.currentCarTypeName
        this.listQuery.canBreakingNodriving = res.data.canBreakingNodriving === 1 ? '是' : '否'
        this.listQuery.canBreakingTrafficRestriction = res.data.canBreakingTrafficRestriction === 1 ? '是' : '否'
        this.listQuery.plateNo = res.data.plateNo
        this.listQuery.busiTypeName = res.data.busiTypeName

        this.listQuery.liveProvinceName = res.data.liveProvinceName
        this.listQuery.liveCityName = res.data.liveCityName
        this.listQuery.liveCountyName = res.data.liveCountyName
        this.listQuery.liveDistrict = res.data.liveDistrict

        this.listQuery.age = res.data.age
        this.listQuery.statusName = res.data.statusName
        this.listQuery.orderId = res.data.orderId
        this.listQuery.contractStatusName = res.data.contractStatusName
        console.log('xxxx:', this.listQuery, res.data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getRunInfor()
  }
  handlePageSize1(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getCallRecord()
  }
}
</script>

<style lang="scss" scoped>
.area {
  margin-right: 20px;
}
</style>
