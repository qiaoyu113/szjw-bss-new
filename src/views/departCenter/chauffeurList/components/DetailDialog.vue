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
            />
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
              <!-- <template slot="behaviorArea">
                <span>{{ listQuery.breakingNodrivingProvinceName }}-{{ listQuery.breakingNodrivingCityName }}-{{ listQuery.breakingNodrivingCounty }}</span>
              </template> -->
              <template slot="startArea">
                <span class="area">北京市-北京市-顺义区-南法信镇</span>
                <span>10:00</span>
              </template>
              <template slot="lineArea">
                <span class="area">北京市-北京市-顺义区</span>
                <span>10:00</span>
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
            >
              <template v-slot:distributionTime="scope">
                <span> {{ scope.row.deliveryStartDate }}-{{ scope.row.deliveryEndDate }}</span>
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
            >
              <template v-slot:recordFileAddress="scope">
                <span> Mp4 </span>
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
import { getCallDetail, getRunDetail, getDriverDetail } from '@/api/departCenter'
interface IState {
  [key: string]: any;
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
  @Prop({ default: true }) dialogTableVisible!: boolean; // 弹框显示
  @Prop({ default: '' }) driverId!: String;
  @PropSync('actived', { type: String }) active!: string
  @PropSync('dialogTableVisible', { type: Boolean }) show!: Boolean
  private listQuery: any = {
    carTypeName: '',
    isBehavior: '',
    isRestriction: '',
    carNumber: '', // 车牌号
    businessLines: '', // 业务线
    address: '', // 居住地址
    old: '', // 年龄
    state: '', // 状态
    orderId: '', // 订单编号
    contractState: '', // 合同状态
    canBreakingNodriving: '', // 是否可以闯禁行
    // behaviorArea: '', // 可闯禁行区域
    breakingNodrivingProvinceName: '',
    breakingNodrivingCityName: '',
    breakingNodrivingCounty: '',
    canBreakingTrafficRestriction: '', // 是否可以闯限行
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
    remak: '' // 备注
  };
  private formItem: any[] = [
    {
      type: 7,
      key: 'carTypeName',
      label: '车型',
      col: 24
    },
    {
      type: 7,
      key: 'isBehavior',
      label: '能否闯禁行',
      col: 24
    },
    {
      type: 7,
      key: 'isRestriction',
      label: '能否闯限行',
      col: 24
    },
    {
      type: 7,
      key: 'carNumber',
      label: '车牌号',
      col: 24
    },
    {
      type: 7,
      key: 'businessLines',
      label: '业务线',
      col: 24
    },
    {
      type: 7,
      key: 'address',
      label: '现居住地址',
      col: 24
    },
    {
      type: 7,
      key: 'old',
      label: '司机年龄',
      col: 24
    },
    {
      type: 7,
      key: 'state',
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
      key: 'contractState',
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
      type: 7,
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
      type: 7,
      key: 'restrictionArea',
      label: '可闯限行区域',
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
      label: '期望运费',
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
      key: 'manuallyRemarks',
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
  private tableDataDetailInfor: IState = [
    {
      createTime: '2020-02-01  16:44:24',
      runStartTime: '2020-02-01 ',
      runEndTime: '2020-02-01 ',
      lineName: '京东2121',
      warehouseArea: '上海莫个地方',
      distributionArea: '上海市上海区',
      distributionTime: '06:30-14:00',
      distributionNum: '20',
      offLineReason: '司机换线',
      dutyManagerIdName: '张经理'
    }
  ];
  private columns: IState = [
    {
      key: 'createDate',
      label: '创建意向时间'
    },
    {
      key: 'startDate',
      label: '试跑开始时间'
    },
    {
      key: 'endDate',
      label: '试跑结束时间'
    },
    {
      key: 'lineName',
      label: '线路名称'
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
      label: '外呼时间'
    },
    {
      key: 'endTime',
      label: '挂断时间'
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
    console.log(index, 'get')
    this.getCallRecord()
    this.getRunInfor()
    this.getDriverLabel()
  }
  // 外呼记录
  async getCallRecord() {
    try {
      let params:any = {
        limit: 1,
        page: 1,
        businessId: '12121212'
      }
      let { data: res } = await getCallDetail(params)
      if (res.success) {
        this.tableDataDetailRecord = res.data
      }
      console.log(res.data)
    } catch {
      console.log('1212')
    }
  }
  async getRunInfor() {
    try {
      let parmas:any = {
        driverId: 2
      }
      let { data: res } = await getRunDetail(parmas)
      if (res.success) {
        this.tableDataDetailInfor = res.data
      }
    } catch {
      console.log('12121')
    }
  }
  async getDriverLabel() {
    try {
      let parmas:any = {
        driverId: 'BJS201903301'
      }
      let { data: res } = await getDriverDetail(parmas)
      if (res.success) {
        this.listQuery.canBreakingNodriving = res.data.canBreakingNodriving
        this.listQuery.canBreakingTrafficRestriction = res.data.canBreakingTrafficRestriction
        this.listQuery.heavyLifting = res.data.heavyLifting
        this.listQuery.deliveryDifficulty = res.data.deliveryDifficulty
        this.listQuery.expectAccountingPeriod = res.data.expectAccountingPeriod
        this.listQuery.expectIncomeTrip = res.data.expectIncomeTrip
        this.listQuery.expectStabilityTemporary = res.data.expectStabilityTemporary
        this.listQuery.hasIncomeOutside = res.data.hasIncomeOutside
        this.listQuery.driverSituation = res.data.driverSituation
        this.listQuery.manuallyRemarks = res.data.manuallyRemarks
      }
    } catch {
      console.log('xxxx')
    }
  }
}
</script>

<style lang="scss" scoped>
.area {
  margin-right: 20px;
}
</style>
