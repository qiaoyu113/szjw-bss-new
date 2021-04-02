<template>
  <div
    v-loading="listLoading"
    class="driverClueContainer"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <CustomerInviteForm
      :cus-status="cusStatus"
      :list-query="listQuery"
      @handle-query="getList"
    />
    <!-- 表格 -->
    <div class="table_box">
      <self-table
        ref="multipleTable"
        :index="false"
        :is-p30="false"
        :operation-list="[]"
        :func="disabledFunc"
        row-key="marketClueId"
        :table-data="tableData"
        :style="tableData.length === 0 ? 'margin-bottom: 30px;' : ''"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:line="scope">
          <div class="triangle">
            <span>线</span>
          </div>
        </template>
        <template v-slot:name="scope">
          <p
            v-if="scope.row.name"
            class="text"
          >
            {{ scope.row.name | DataIsNull }}
          </p>
          <p
            v-if="scope.row.phone"
            class="text"
          >
            {{ scope.row.phone | DataIsNull }}
          </p>
          <el-tooltip
            placement="top"
            popper-class="yn-tooltip"
          >
            <div slot="content">
              这条线路非常火爆，4.2米厢货车，场景简单，菜鸟也能干
            </div>
            <i class="el-icon-chat-line-square" />
          </el-tooltip>
        </template>
        <template v-slot:followPerson="scope">
          <template v-if="scope.row.status !== 10">
            <p
              v-if="scope.row.followerName"
              class="text"
            >
              {{ scope.row.followerName | DataIsNull }}
            </p>
            <p
              v-if="scope.row.followerPhone"
              class="text"
            >
              {{ scope.row.followerPhone | DataIsNull }}
            </p>
            <div class="driverMark">
              <span>司</span>
              老张
            </div>
          </template>
          <template v-else>
            暂无数据
          </template>
        </template>
        <template v-slot:city="scope">
          <p class="text">
            {{ scope.row.cityName }}/{{ scope.row.busiTypeName }}
          </p>
        </template>
        <template v-slot:statusName="scope">
          <p class="text">
            {{ scope.row.statusName | DataIsNull }}
          </p>
          <p
            v-if="scope.row.status === 40 && scope.row.interviewDate"
            class="text"
          >
            {{ scope.row.interviewDate }}
          </p>
        </template>
        <template v-slot:allocatedDate="scope">
          <template v-if="scope.row.allocatedDate || scope.row.followerDate">
            <p
              v-if="scope.row.allocatedDate"
              class="text"
            >
              {{ scope.row.allocatedDate }}
            </p>
            <template v-else>
              暂无数据
            </template>
            <p
              v-if="scope.row.followerDate"
              class="text"
            >
              {{ scope.row.followerDate }}
            </p>
            <template v-else>
              暂无数据
            </template>
          </template>
          <template v-else>
            暂无数据
          </template>
        </template>
        <template v-slot:remark="scope">
          <template v-if="scope.row.remark">
            <el-tooltip placement="top">
              <!-- eslint-disable vue/no-v-html -->
              <div
                slot="content"
                v-html="toBreak(scope.row.remark)"
              />
              <div class="ellipsis">
                {{ scope.row.remark }}
              </div>
            </el-tooltip>
          </template>
          <template v-else>
            暂无数据
          </template>
        </template>
        <template v-slot:op="scope">
          <el-button
            v-permission="['/v2/clueH5/detail']"
            type="text"
            size="small"
            @click="handleDetailClick(scope.row)"
          >
            匹配撮合
          </el-button>
          <el-button
            v-if="[10, 20, 30, 40].includes(scope.row.status)"
            v-permission="['/v2/clueH5/updateFollowerByMarketClueId1']"
            type="text"
            size="small"
            @click="handleDistributionClick(scope.row)"
          >
            查看详情
          </el-button>
          <el-button
            v-if="[10, 20, 30, 40].includes(scope.row.status)"
            v-permission="['/v2/clueH5/updateFollowerByMarketClueId1']"
            type="text"
            size="small"
            @click="handleDistributionClick(scope.row)"
          >
            取消意向
          </el-button>
        </template>
      </self-table>
    </div>
    <SelfDialog
      class="driverClueContainerDialog"
      :visible.sync="showDialog"
      :title="title"
      :confirm="confirm"
      width="500px"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <self-form
        ref="dialogDriverClue"
        :rules="rules"
        :list-query="dialogListQuery"
        :form-item="dialogFormItem"
        size="small"
        label-width="210px"
        :pc-col="24"
        @onPass="handlePassClick"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import {
  GetDutyListByLevel,
  getOfficeByTypeAndOfficeId,
  getOfficeByType,
  GetDictionaryList,
  GetOpenCityData,
  getGroupInfoByCityCodeAndProductLine,
  GetSpecifiedRoleList
} from '@/api/common'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { CustomerInviteForm } from './component'
import {
  GetDriverClueList,
  ExportDriverClue,
  allocationClue1
} from '@/api/driver-cloud'
import { delayTime } from '@/settings'
import {
  HandlePages,
  lock,
  parseTime,
  showCityGroupPerson,
  showWork,
  DataIsNull
} from '@/utils/index'
import {
  today,
  yesterday,
  month,
  lastmonth,
  threemonth
} from '../driver-freight/components/date'
import { exportFileTip } from '@/utils/exportTip'
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'CustomerInvite',
  components: {
    SelfForm,
    SelfTable,
    SelfDialog,
    CustomerInviteForm
  }
})
export default class extends Vue {
  times: number = 10;
  private listLoading: boolean = false;
  private showDialog: boolean = false; // 弹框
  private title: string = '';
  private rows: IState[] = []; // 弹框选中的数据
  private dutyListOptions: IState[] = []; // 业务线
  private carOptions: IState[] = []; // 车型列表
  private listQuery: IState = {
    optionCity: '', // 城市
    carType: [], // 车型
    lineFat: '', // 线路肥瘦
    loadState: '', // 装卸难度
    runForbiddenArea: '', // 是否闯禁行
    runBan: '', // 是否闯限行
    freight: [], // 运费区间
    workTime: [], // 工作时间
    storeLocation: '', // 仓库位置
    deliveryArea: '', // 配送区域
    stable: '', // 稳定 临时
    lineName: '', // 线路名称/编号
    cusInviteState: '' // 客邀状态
  };

  private columns: IState[] = [
    {
      key: 'line',
      label: '',
      slot: true
    },
    {
      key: 'name',
      label: '基础信息',
      width: '140px',
      slot: true
    },
    {
      key: 'haveCar',
      label: '车辆',
      width: '140px'
    },
    {
      key: 'experience',
      label: '配送信息',
      width: '100px'
    },
    {
      key: 'contactSituationName',
      label: '结算',
      width: '140px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'remark',
      label: '线路特点',
      width: '140px',
      slot: true
    },
    {
      key: 'statusName',
      label: '标签',
      width: '150px',
      slot: true
    },
    {
      key: 'followPerson',
      label: '状态',
      width: '140px',
      slot: true
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      width: '100px',
      fixed: 'right'
    }
  ];
  private tableData: IState[] = [];
  // 表格分页
  private page: PageObj = {
    page: 1,
    limit: 10,
    total: 0
  };
  private dialogFormItem: any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '取消创建试跑意向的原因？：',
      key: 'haveCar',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '有',
          value: 1
        },
        {
          label: '无',
          value: 0
        }
      ]
    }
  ];
  private dialogListQuery: IState = {
    follow: []
  };

  private validateFollow(rule: any, value: any, callback: Function) {
    if (value === '') {
      callback(new Error('请选择跟进人!'))
    } else if (value.length === 2) {
      callback(new Error('该组织下无跟进人!'))
    } else {
      callback()
    }
  }
  private rules: IState = {
    follow: [
      { required: true, message: '请选择跟进人', trigger: 'blur' },
      { validator: this.validateFollow, trigger: 'change' }
    ]
  };

  private cusStatus: any[] = [
    {
      label: '全部',
      name: '',
      num: ''
    },
    {
      label: '已发起客邀',
      name: '0',
      num: ''
    },
    {
      label: '客邀成功',
      name: '1',
      num: ''
    },
    {
      label: '司推成功',
      name: '2',
      num: ''
    },
    {
      label: '无法发起客邀',
      name: '3',
      num: ''
    }
  ];
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  toBreak(content: string) {
    if (!content) {
      return ''
    }
    let str: string = ''
    if (content.length > 50) {
      str = content.substring(0, 50)
      str += '<br/>'
      str += content.substring(50, -1)
    } else {
      str = content
    }
    return str
  }

  // 获取业务线
  private async getDutyListByLevel() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item: any) => ({
          label: item.dutyName,
          value: item.id
        }))
        this.dutyListOptions.push({
          label: '全部',
          value: ''
        })
        this.dutyListOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
    }
  }
  // 查询
  handleFilterClick() {
    (this.$refs.multipleTable as any).toggleRowSelection()
    this.page.page = 1
    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      name: '',
      phone: '',
      haveCar: '',
      carType: [],
      contactSituation: [],
      followerId: '',
      time: [],
      workCity: [],
      busiType: '',
      onlyMe: 0,
      status: ''
    }
  }
  // 表格是否禁用
  private disabledFunc(row: any) {
    if ([10, 20, 30, 40].includes(row.status)) {
      return true
    }
    return false
  }
  // 详情
  handleDetailClick(row: IState) {
    this.$router.push({
      path: '/driverClond/driverClueDetail',
      query: {
        id: row.marketClueId
      }
    })
  }
  // 分配
  handleDistributionClick(row: IState) {
    this.rows.push(row)
    this.title = '取消试跑意向'
    this.showDialog = true
  }
  // 导出文件
  _exportFile() {
    exportFileTip(this, this.handleExportClick)
  }
  // 导出
  @lock
  async handleExportClick(sucFun: Function) {
    try {
      try {
        let params: IState = {}
        this.listQuery.haveCar !== '' &&
          (params.haveCar = this.listQuery.haveCar)
        this.listQuery.onlyMe && (params.onlyMe = 1)
        this.listQuery.name && (params.name = this.listQuery.name)
        this.listQuery.phone && (params.phone = this.listQuery.phone)
        this.listQuery.workCity &&
          this.listQuery.workCity.length !== 0 &&
          (params.workCity = this.listQuery.workCity[1])
        this.listQuery.carTypes &&
          this.listQuery.carTypes.length !== 0 &&
          (params.carTypes = this.listQuery.carTypes)
        this.listQuery.contactSituations &&
          this.listQuery.contactSituations.length !== 0 &&
          (params.contactSituations = this.listQuery.contactSituations)
        this.listQuery.followerId !== '' &&
          (params.followerId = this.listQuery.followerId)
        this.listQuery.busiType !== '' &&
          (params.busiType = this.listQuery.busiType)
        this.listQuery.status !== '' &&
          (params.status = +this.listQuery.status)
        if (this.listQuery.time && this.listQuery.time.length > 0) {
          let startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
          let endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
          params.startDate = startDate
          params.endDate = endDate
        }
        if (this.listQuery.createTime && this.listQuery.createTime.length > 0) {
          let createStartDate = new Date(this.listQuery.createTime[0]).setHours(
            0,
            0,
            0
          )
          let createEndDate = new Date(this.listQuery.createTime[1]).setHours(
            23,
            59,
            59
          )
          params.createStartDate = createStartDate
          params.createEndDate = createEndDate
        } else {
          return this.$message.warning('请选择创建日期')
        }
        let { data: res } = await ExportDriverClue(params)
        if (res.success) {
          sucFun()
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.message)
        }
      } catch (err) {
        console.log(`get list fail:${err}`)
      } finally {
        this.listLoading = false
      }
    } catch (err) {
      console.log(`export fail:${err}`)
    } finally {
      console.log(`finally`)
    }
  }
  // 分页
  handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 获取列表
  @lock
  async getLists() {
    try {
      this.listLoading = true
      let params: IState = {
        limit: this.page.limit,
        page: this.page.page
      }
      this.listQuery.haveCar !== '' &&
        (params.haveCar = this.listQuery.haveCar)
      this.listQuery.onlyMe && (params.onlyMe = 1)
      this.listQuery.name && (params.name = this.listQuery.name)
      this.listQuery.phone && (params.phone = this.listQuery.phone)
      this.listQuery.workCity &&
        this.listQuery.workCity.length !== 0 &&
        (params.workCity = this.listQuery.workCity[1])
      this.listQuery.carTypes &&
        this.listQuery.carTypes.length !== 0 &&
        (params.carTypes = this.listQuery.carTypes)
      this.listQuery.contactSituations &&
        this.listQuery.contactSituations.length !== 0 &&
        (params.contactSituations = this.listQuery.contactSituations)
      this.listQuery.followerId !== '' &&
        (params.followerId = this.listQuery.followerId)
      this.listQuery.busiType !== '' &&
        (params.busiType = this.listQuery.busiType)
      this.listQuery.status !== '' && (params.status = +this.listQuery.status)
      if (this.listQuery.time && this.listQuery.time.length > 0) {
        let startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
        let endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
        params.startDate = startDate
        params.endDate = endDate
      }
      if (this.listQuery.createTime && this.listQuery.createTime.length > 0) {
        let createStartDate = new Date(this.listQuery.createTime[0]).setHours(
          0,
          0,
          0
        )
        let createEndDate = new Date(this.listQuery.createTime[1]).setHours(
          23,
          59,
          59
        )
        params.createStartDate = createStartDate
        params.createEndDate = createEndDate
      }

      let { data: res } = await GetDriverClueList(params)
      if (res.success) {
        this.tableData = res.data || []
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.tableData = []
        this.$message.warning(res.message)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 弹框确认
  confirm() {
    (this.$refs.dialogDriverClue as any).submitForm()
  }
  // 表单验证通过
  handlePassClick(val: boolean) {
    this.allocationClue1()
  }
  // 分配、批量分配
  @lock
  async allocationClue1() {
    try {
      if (this.dialogListQuery.follow.length !== 3) {
        this.$message.warning('请选择跟进人')
        return false
      }
      let params: IState = {
        marketClueId: this.rows.map((item: any) => item.marketClueId + ''),
        followerId: +this.dialogListQuery.follow[2]
      }
      let { data: res } = await allocationClue1(params)
      if (res.success) {
        if (res.data.flag) {
          (this.$refs.multipleTable as any).toggleRowSelection()
          this.$message.success(res.data.msg)
        } else {
          this.$message.warning(res.data.msg)
        }
        this.showDialog = false
        setTimeout(() => {
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fenpei fail:${err}`)
    } finally {
      //
    }
  }
  // 弹框关闭后
  handleDialogClosed() {
    (this.$refs.dialogDriverClue as any).resetForm()
    this.dialogListQuery = {
      follow: []
    }
    let len = this.rows.length
    this.rows.splice(0, len)
  }
  // 获取车型
  async getBaseInfo() {
    try {
      let carLen: number = this.carOptions.length
      if (carLen > 0) {
        this.carOptions.splice(0, carLen)
      }
      let params = ['Intentional_compartment', 'driver_clue_contact_situation']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let cars = res.data.Intentional_compartment.map(function(item: any) {
          return { label: item.dictLabel, value: item.dictValue }
        })
        this.carOptions.push(...cars)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }

  init() {
    this.getLists()
    this.getDutyListByLevel()
    this.getBaseInfo()
  }
  activated() {
    this.init()
  }
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.driverClueContainer {
  .btnPc {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
  .mobile {
    width: 100%;
    text-align: center;
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width: 80%;
    }
  }
  .SuggestForm {
    width: 100%;
    background: #fff;
    margin-bottom: 10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  }
  .table_box {
    padding: 30px 30px 0px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    .triangle span {
      color: #fff;
      position: absolute;
      left: 15%;
      top: 10%;
      font-size: 18px;
      font-weight: 600;
    }
    .driverMark {
      position: relative;
      color: #fbd783;
      display: inline-flex;
    }

    .el-icon-chat-line-square {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 200%;
      color: #fbd783;
    }
  }
  .text {
    margin: 0px;
  }
  .wordWrap {
    word-break: break-all;
  }
  .ellipsis {
    width: 140px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .el-button + .el-button {
  margin-left: 0;
}
}
</style>

<style scoped>
.driverClueContainer >>> .el-badge {
  margin-right: 20px;
}
.SuggestForm >>> .el-checkbox__inner {
  border-radius: 50%;
}
.driverClueContainer >>> .el-badge__content {
  z-index: 1;
}

.driverClueContainer >>> .triangle::before {
    left: 0;
    top: 0;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    border-top: 90px solid #39a7f0;
    border-right: 90px solid transparent;
  }
  .driverClueContainer >>> .driverMark::before {
    content: '';
    width: 0;
    height: 0;
    display: inline-flex;
    border-top: 25px solid #fbd783;
    border-right: 25px solid transparent;
  }
  .driverClueContainer >>> .driverMark span {
    color: #fff;
    position: absolute;
    left: 0%;
    top: -10%;
    }
</style>
<style>
  .el-tooltip__popper.yn-tooltip {
    background: #fbd783;
    max-width: 210px;
  }
  .el-tooltip__popper[x-placement^=top].yn-tooltip .popper__arrow {
    border-top-color: #fbd783 !important;
  }
  .el-tooltip__popper[x-placement^=top].yn-tooltip .popper__arrow:after{
    border-top-color: #fbd783 !important;
  }
</style>
