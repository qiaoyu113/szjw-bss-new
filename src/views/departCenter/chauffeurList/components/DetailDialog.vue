<template>
  <div class="DetailDialog">
    <SelfDialog
      :visible.sync="show"
      title="司机信息"
      :show-cancel-button="false"
      :show-confirm-button="false"
      append-to-body
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
            />
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
              <template v-slot:phonefile="scope">
                <span>{{ scope.row.phonefile }}</span>
              </template>
            </SelfTable>
          </el-tab-pane>
        </el-tabs>
      </div>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
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
  @Prop({ default: false }) dialogTableVisible!: boolean; // 弹框显示
  @Prop({ default: '' }) driverId!: String;
  @Prop({ default: 'first' }) activeName?: String;

  get active() {
    console.log('tag', '2222')
    return this.activeName
  }

  get show() {
    return this.dialogTableVisible
  }

  set show(val:Boolean) {
    console.log(val, 'val')
    this.$emit('update:dialogTableVisible', val)
  }

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
    driverBehavior: '', // 是否可以闯禁行
    behaviorArea: '', // 可闯禁行区域
    driverRestriction: '', // 是否可以闯限行
    restrictionArea: '', // 可闯限行区域
    acceptDegree: '', // 装卸接收程度
    distributionComplex: '', // 配送复杂度
    settlementCycleName: '', // 期望账期
    everyTripGuaranteed: '', // 期望运费
    lineCategory: '', // 期望稳定/临时
    isOtherWork: '', // 外面是否有活
    startArea: '', // 起始点
    lineArea: '', // 配送点
    dirverDeatil: '', // 司机情况
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
      key: 'driverBehavior',
      label: '是否可以闯禁行',
      col: 24
    },
    {
      type: 7,
      key: 'behaviorArea',
      label: '可闯禁行区域',
      col: 24
    },
    {
      type: 7,
      key: 'driverRestriction',
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
      key: 'acceptDegree',
      label: '装卸接收程度',
      col: 24
    },
    {
      type: 7,
      key: 'distributionComplex',
      label: '配送复杂度',
      col: 24
    },
    {
      type: 7,
      key: 'settlementCycleName',
      label: '期望账期',
      col: 24
    },
    {
      type: 7,
      key: 'everyTripGuaranteed',
      label: '期望运费',
      col: 24
    },
    {
      type: 7,
      key: 'lineCategory',
      label: '期望稳定/临时',
      col: 24
    },
    {
      type: 7,
      key: 'isOtherWork',
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
      key: 'dirverDeatil',
      label: '司机情况',
      col: 24
    },
    {
      type: 7,
      key: 'remak',
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
      key: 'createTime',
      label: '创建意向时间'
    },
    {
      key: 'runStartTime',
      label: '试跑开始时间'
    },
    {
      key: 'runEndTime',
      label: '试跑结束时间'
    },
    {
      key: 'lineName',
      label: '线路名称'
    },
    {
      key: 'warehouseArea',
      label: '仓库位置'
    },
    {
      key: 'distributionArea',
      label: '主要配送区域'
    },
    {
      key: 'distributionTime',
      label: '配送时间'
    },
    {
      key: 'distributionNum',
      label: '配送次数'
    },
    {
      key: 'offLineReason',
      label: '掉线原因'
    },
    {
      key: 'dutyManagerIdName',
      label: '司机撮合经理'
    }
  ];
  private columns1: IState = [
    {
      key: 'phoneName',
      label: '拨打人'
    },
    {
      key: 'phoneState',
      label: '拨打状态'
    },
    {
      key: 'phoneTime',
      label: '拨打时长'
    },
    {
      key: 'outboundTime',
      label: '外呼时间'
    },
    {
      key: 'hangUpTime',
      label: '挂断时间'
    },
    {
      key: 'phonefile',
      label: '通话录音文件',
      slot: true
    },
    {
      key: 'createInterval',
      label: '创建试跑意向间隔时间'
    }
  ];
  handleClick(tab: any) {
    console.log(tab.name)
  }
}
</script>

<style lang="scss" scoped>
.area {
  margin-right: 20px;
}
</style>
