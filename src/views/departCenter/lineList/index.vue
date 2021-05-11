
<template>
  <div
    v-loading.body="listLoading"
    class="LineListBox"
    :class="{
      p15: isPC
    }"
  >
    <self-form
      ref="selectForm"
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      :load-by-keyword="loadLineByKeyword"
      label-width="110px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <template slot="customerStatus">
        <el-button
          v-for="item in btns"
          :key="item.text"
          type="primary"
          :plain="item.name !== listQuery.customerStatus"
          margin-right="20px"
          @click="() => {
            listQuery.customerStatus = item.name
            showInviteCityHandle(item)
            handleFilterClick()
          }"
        >
          {{ item.text }}
        </el-button>
      </template>
      <div
        slot="mulBtn"
        :class="isPC ? 'btnPc left' : 'mobile'"
      >
        <el-button
          v-if="listQuery.customerStatus === '1'"
          type="primary"
          @click="batchLaunchGuest"
        >
          批量发起客邀
        </el-button>
        <el-button
          v-if="listQuery.customerStatus === '2'"
          type="primary"
          @click="batchCancelGuest"
        >
          批量取消客邀
        </el-button>

        <el-button
          type="primary"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>
      <template slot="freightSection">
        <input-range
          v-model="listQuery.freightSection"
          v-only-number="{min: 1, max: 19999, precision: 0}"
        />
      </template>
      <template
        slot="guestCity"
      >
        <el-select
          v-model="listQuery.guestCity"
          placeholder="请选择"
        >
          <el-option
            v-for="item in cityList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template slot="time">
        <timeSelect
          v-model="listQuery.time"
        />
      </template>
    </self-form>
    <div
      class="table_box"
    >
      <div class="middle">
        <span>筛选结果：{{ 111 }}条</span>
      </div>
      <Btable
        ref="listTable"
        :list-query="listQuery"
        :is-show-percent="true"
        :obj="{}"
        @launchGuest="handleLaunchGuest($event)"
        @cancelGuest="handleCancelGuest($event)"
        @cancelTryRun="handleCancelTryRun($event)"
        @SelectionChange="checkOff($event)"
      />
      <pagination
        :operation-list="[]"
        :total="page.total"
        :page.sync="page.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :limit.sync="page.limit"
        @pagination="handlePageSizeChange"
      />
    </div>
    <launch-guest
      :id="ids"
      ref="launchGuest"
      :launch-arguments="launchArguments"
    />
    <cancel-guest
      ref="cancelGuest"
      :cust-invite-id="custInviteId"
    />
    <cancel-tryRun
      ref="cancelTryRun"
      :cancel-data="cancelData"
      @success="ctrSuccessHandle"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetDictionaryList } from '@/api/common'
import { mapDictData, getProviceCityCountryData } from '../js/index'
import { getLineSearch, GetcustInviteCitys } from '@/api/departCenter'
import Btable from './components/Btable.vue'
import LaunchGuest from './components/LaunchGuests.vue'
import CancelGuest from './components/CancelGuest.vue'
import timeSelect from '../chauffeurList/components/timeSelect.vue'
import Pagination from '@/components/Pagination/index.vue'
import InputRange from '../chauffeurList/components/doubleInput.vue'
import CancelTryRun from './components/CancelTryRun.vue'
import { showWork } from '@/utils'
import { cloneDeep } from 'lodash'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'LineList',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog,
    Btable,
    Pagination,
    LaunchGuest,
    CancelGuest,
    InputRange,
    timeSelect,
    CancelTryRun
  }
})
export default class extends Vue {
  private listLoading:boolean = false
  private carLists:IState[] = [] // 车型列表
  private labelTypeArr:IState[] = [{ label: '全部', value: '' }] // 线路肥瘦
  private loadDiffArr:IState[] = [{ label: '全部', value: '' }] // 装卸难度
  private cityList:IState[] = []; // 城市列表
  private timeLists:IState[] = []
  private shareScopeEnd:IState[] = []
  private showDialog: boolean = false
  private tableData:any[] = []
  private ids = []
  private listQuery:IState = {
    workCity: [],
    carType: '',
    lineFineness: '',
    handlingDifficulty: '',
    guestCity: '',
    freightSection: [],
    time: [],
    warehouseLocation: '',
    distributionArea: '',
    stabilityTemporary: '',
    lineName: '',
    customerStatus: ''
  }
  private formItem:any[] = [
    {
      type: 8,
      key: 'workCity',
      col: 8,
      label: '城市',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 2,
      key: 'carType',
      label: '车型',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: this.carLists
    },
    {
      type: 2,
      key: 'lineFineness',
      label: '线路肥瘦',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: this.labelTypeArr
    },
    {
      type: 2,
      key: 'handlingDifficulty',
      label: '装卸难度',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: this.loadDiffArr
    },
    // {
    //   type: 'guestCity',
    //   label: '客邀城市',
    //   key: 'guestCity',
    //   slot: true
    // },
    {
      type: 'freightSection',
      label: '单趟运费区间',
      key: 'freightSection',
      w: '110px',
      slot: true
    },
    {
      type: 'time',
      label: '工作时间段',
      key: 'time',
      slot: true
    },
    {
      type: 8,
      key: 'warehouseLocation',
      label: '仓库位置',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData,
          checkStrictly: true
        }
      },
      listeners: {
        'change': (e:any[]) => {
          this.handleCascaderChange(e, 'warehouseLocation')
        }
      }
    },
    {
      type: 8,
      key: 'distributionArea',
      label: '配送区域',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData,
          checkStrictly: true
        }
      },
      listeners: {
        'change': (e:any[]) => {
          this.handleCascaderChange(e, 'distributionArea')
        }
      }
    },
    {
      type: 2,
      key: 'stabilityTemporary',
      label: '稳定/临时',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '稳定',
          value: 1
        },
        {
          label: '临时',
          value: 2
        }
      ]
    },
    {
      type: 15,
      label: '线路名称/编号',
      key: 'lineName',
      slot: true,
      w: '110px',
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      col: 17,
      label: '客邀状态',
      type: 'customerStatus',
      slot: true
    },
    {
      type: 'mulBtn',
      col: 7,
      slot: true,
      w: '0px'
    }
  ]
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '1',
      text: '未发起客邀'
    },
    {
      name: '2',
      text: '已发起客邀'
    }
  ]
  private custInviteId:string=''
  private cancelData:{}={}
  private launchArguments:{}={
    lineId: '',
    matchId: ''
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 分页
  // handlePageSize(page:PageObj) {
  //   this.page.page = page.page
  //   this.page.limit = page.limit
  // }
  // 分页
  handlePageSizeChange(page:number, limit:number) {
    if (page) {
      this.page.page = page
    }
    if (limit) {
      this.page.limit = limit
    }
    setTimeout(() => {
      this.getList()
    }, 20)
  }
  // 根据关键字查线路id
  async loadLineByKeyword(params:IState) {
    try {
      let { data: res } = await getLineSearch(params)
      let result:any[] = res.data.map((item:any) => ({
        label: item.lineName,
        value: item.lineId
      }))
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 查询
  handleFilterClick() {
    // 单趟运费区间
    const moneyRange = (this.listQuery.freightSection || []).filter((item:string | number) => item !== '')
    if (moneyRange.length === 1) {
      return this.$message.warning('单趟运费输入不完整')
    } else if (moneyRange.length === 2) {
      if (Number(moneyRange[0]) > Number(moneyRange[1])) {
        return this.$message.warning('单趟运费起始金额不能大于终止金额')
      }
    }
    // 工作时间段
    const timeRange = (this.listQuery.time || []).filter((item:string | number) => item !== '')
    if (timeRange.length === 1) {
      return this.$message.warning('工作时间段输入不完整')
    }
    this.getList()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      workCity: [],
      carType: '',
      lineFineness: '',
      handlingDifficulty: '',
      guestCity: '',
      freightSection: [],
      time: [],
      warehouseLocation: '',
      distributionArea: '',
      stabilityTemporary: '',
      lineName: '',
      customerStatus: ''
    }
  }
  // 获取列表
  private async getList() {
    try {
      this.listLoading = true
      // let params: IState = {
      //   page: this.page.page,
      //   limit: this.page.limit
      // }
      // if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
      //   params.workCity = this.listQuery.workCity[1]
      // }
      // this.listQuery.carType !== '' && (params.carType = this.listQuery.carTpe)
      // this.listQuery.lineFineness !== '' && (params.lineFineness = this.listQuery.lineFineness)
      // this.listQuery.handlingDifficulty !== '' && (params.handlingDifficulty = this.listQuery.handlingDifficulty)
      // this.listQuery.freightSection !== '' && (params.freightSection = this.listQuery.freightSection)
      // this.listQuery.warehouseLocation !== '' && (params.warehouseLocation = this.listQuery.warehouseLocation)
      // this.listQuery.distributionArea !== '' && (params.distributionArea = this.listQuery.distributionArea)
      // this.listQuery.stabilityTemporary !== '' && (params.stabilityTemporary = this.listQuery.stabilityTemporary)
      setTimeout(() => {
        (this.$refs.listTable as any).getLists()
      }, 500)
      // console.log('listQuery', this.listQuery)
      // let { data: res } = await getLists(params)
    } catch (err) {
      console.log(`getlist fail:${err}`)
    } finally {
      // this.listLoading = false
    }
  }
  // 获取字典列表
  async getDictList() {
    try {
      let params:string[] = ['Intentional_compartment', 'line_label', 'line_handling_difficulty']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        this.labelTypeArr.push(...mapDictData(res.data.line_label || []))
        this.loadDiffArr.push(...mapDictData(res.data.line_handling_difficulty || []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get dict list fail:${err}`)
    } finally {
      //
    }
  }
  // 根据大区获取城市列表
  async cityDetail() {
    let { data: res } = await GetcustInviteCitys()
    if (res.success) {
      const nodes = res.data.map(function(item: any) {
        return {
          value: item.id,
          label: item.name
        }
      })
      this.cityList.push(...nodes)
    }
  }
  // 级联框变化
  handleCascaderChange(val:IState[], key:string) {
    // 是否与上次的类型相同
    let changeFlag = false
    let changeItem:any = null
    if (this.shareScopeEnd.length === 0) {
      this.listQuery[key] = val
    } else {
      // 与原数组比对
      this.listQuery[key].forEach((item:any[]) => {
        if (item[0] !== this.shareScopeEnd[0][0]) { // 一级标签不同
          changeFlag = true
          changeItem = item
        } else if (item[1] !== this.shareScopeEnd[0][1]) { // 一级标签相同但是二级标签不同
          changeFlag = true
          changeItem = item
        } else if ((!item[2] && this.shareScopeEnd[0][2]) || (item[2] && !this.shareScopeEnd[0][2]) || (item[2] && item[2] === -99) || (this.shareScopeEnd[0][2] === -99)) {
          changeFlag = true
          changeItem = item
        }
      })
    }
    if (changeFlag) {
      this.listQuery[key] = []
      this.listQuery[key].push(changeItem)
    }
    this.shareScopeEnd = this.listQuery[key]
  }
  // 发起客邀
  handleLaunchGuest(data:{}) {
    (this.$refs.launchGuest as any).showDialog = true;
    (this.$refs.launchGuest as any).launchGuestState = 1
    this.launchArguments = data
  }
  // 取消客邀
  handleCancelGuest(custInviteId:string) {
    (this.$refs.cancelGuest as any).showDialog = true;
    (this.$refs.cancelGuest as any).cancelGuestState = 1
    // (this.$refs.cancelGuest as any).getDictList()
    this.custInviteId = custInviteId
  }

  // 批量发起客邀
  private batchLaunchGuest() {
    (this.$refs.launchGuest as any).showDialog = true;
    (this.$refs.launchGuest as any).launchGuestState = 2
  }
  // 批量取消客邀
  private batchCancelGuest() {
    (this.$refs.cancelGuest as any).showDialog = true;
    (this.$refs.cancelGuest as any).cancelGuestState = 2
  }
  // 取消创建试跑意向
  handleCancelTryRun(row:any) {
    (this.$refs.cancelTryRun as any).showDialog = true
    const { lineId, matchId, matchStatus, runTestId, status } = row
    const cancelData = { lineId, matchId, matchStatus, runTestId, status, ancelRunTestOrigin: 1, type: 'CANCEL', remark: '' }
    this.cancelData = cancelData
  }
  private checkOff(id:any) {
    this.ids = id.map((item:any) => {
      return item.id
    })
  }

  // 控制客邀城市显示
  showInviteCityHandle(item:any) {
    const values = {
      type: 'guestCity',
      label: '客邀城市',
      key: 'guestCity',
      slot: true
    }
    if (item.name !== '2') {
      if (this.formItem[4].key === 'guestCity') { this.formItem.splice(4, 1) }
    } else {
      this.formItem.splice(4, 0, values)
    }
  }

  // 取消试跑成功后刷新列表
  ctrSuccessHandle() {
    (this.$refs.listTable as any).refreshList()
  }
  init() {
    this.cityDetail()
    this.getDictList();
    (this.$refs.selectForm as any).loadQueryLineByKeyword()
  }
  mounted() {
    this.init()
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.LineListBox {
   min-width: 860px;
   height: 100%;
   overflow: auto;
  .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .el-button{
      margin-right: 8px;
    }
    .btnPc{
       width: 100%;
       padding: 0 10px;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
       &.left {
         justify-content: flex-end;
       }
    }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
    .middle {
      margin: 10px 0px;
      .count {
        font-size:14px;
        color:#666;
      }
    }
    .table_box {
      padding: 0px 20px 20px 20px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
}
</style>

<style scoped>
.LineListBox >>> .end .el-form-item__label::before {
    content:'~';
    color: #9e9e9e;
  }
</style>
