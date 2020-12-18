<template>
  <div
    class="payList"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      ref="searchForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="searchRules"
      label-width="100px"
      class="p15"
      size="small"
    >
      <template slot="driverId">
        <el-select
          v-model.trim="listQuery.driverId"
          v-loadmore="loadQueryDriverByKeyword"
          placeholder="请选择"
          reserve-keyword
          :default-first-option="true"
          clearable
          filterable
          remote
          :remote-method="querySearchByKeyword"
          @clear="handleClearQueryDriver"
        >
          <el-option
            v-for="item in driverOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template slot="sno">
        <el-select
          v-model.trim="listQuery.sno"
          v-loadmore="loadQuerySnoweyword"
          placeholder="请选择"
          reserve-keyword
          :default-first-option="true"
          clearable
          filterable
          remote
          :remote-method="querySearchBySno"
          @clear="handleClearQuerySno"
        >
          <el-option
            v-for="item in snoOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <template slot="payNo">
        <el-select
          v-model.trim="listQuery.payNo"
          v-loadmore="loadQueryPayNoweyword"
          placeholder="请选择"
          reserve-keyword
          :default-first-option="true"
          clearable
          filterable
          remote
          :remote-method="querySearchByPayNo"
          @clear="handleClearQueryPayNo"
        >
          <el-option
            v-for="item in payNoOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
      <div
        slot="btn1"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          @click="goRoute('addPay')"
        >
          新建缴费
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_query_btn"
          size="small"
          @click="handleQueryClick"
        >
          查询
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_reset_btn"
          size="small"
          @click="handleResetClick"
        >
          重置
        </el-button>
        <el-button
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_export_btn"
          size="small"
          @click="handleExportClick"
        >
          导出
        </el-button>
      </div>

      <div
        slot="payStatus"
        class="tableTitle"
      >
        <div class="statusBox">
          <div class="btnBox">
            <el-badge
              v-for="(item,index) in status"
              :key="index"
              :value="item.num"
              class="item"
            >
              <el-button
                size="small"
                :plain="item.value !== listQuery.payStatus"
                :type="index === active ? 'primary' : 'default' "
                @click="changeStatus(item,index)"
              >
                {{ item.label }}
              </el-button>
            </el-badge>
          </div>
        </div>
      </div>
    </self-form>
    <!-- 表头 -->

    <div class="table_box">
      <div class="middle">
        <div
          class="count"
          v-text="`筛选结果（${page.total}条）`"
        />
      </div>
      <!-- 表格 -->
      <self-table
        ref="driverListTable"
        v-loading="listLoading"
        height="calc(100vh - 550px)"
        :index="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:applyDate="scope">
          {{ scope.row.applyDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
        <template v-slot:isReceipt="scope">
          {{ scope.row.isReceipt ? '是' : '否' }}
        </template>
        <template v-slot:op="scope">
          <div>
            <span
              class="doItem"
              @click="goRoute('payDetail',scope.row.id)"
            >详情</span>
            <span
              v-if="scope.row.payStatusValue === 0 "
              class="doItem"
              @click="goRoute('payAudit',scope.row.id)"
            >审核</span>
            <span
              v-if="scope.row.payStatusValue === 2"
              class="doItem"
              @click="goRoute('payEdit',scope.row.id)"
            >编辑</span>
          </div>
        </template>
      </self-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/Base/SelfTable.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { getLabel, phoneRegExp, IdRegExp } from '@/utils/index.ts'
import { getPayList, payExport, getSnoList, getPayNoList } from '@/api/driver-account'
import { delayTime } from '@/settings.ts'
import { getDriverNoAndNameList, getDriverNameByNo } from '@/api/driver'
import { HandlePages, phoneReg, lock } from '@/utils/index'
import { getSpecifiedUserListByCondition, GetOpenCityData, GetSpecifiedRoleList, getOfficeByTypeAndOfficeId, getOfficeByType, GetDutyListByLevel } from '@/api/common'
import data from '@/views/pdf/content'
interface IState {
  [key: string]: any;
}
interface PageObj {
  page: Number;
  limit: Number;
  total?: Number;
}

interface Tab {
  label: String;
  name: String;
  id: Number;
  num?: Number | undefined;
}

@Component({
  name: 'payList',
  components: {
    SelfForm,
    SelfTable,
    TableHeader
  }
})
export default class extends Vue {
  private active: number = 0;
  private listLoading: boolean = false; // loading
  private tags: any[] = []; // 回显label
  private dutyListOptions:IState[] = [];// 业务线列表
  private driverOptions:IState[] = [];
  private searchKeyword:string = '';
  private row:IState = {}
  private type: string = ''; // 修改加盟经理or分配加盟经理
  private queryPage:PageObj = {
    page: 0,
    limit: 10
  }
  private status: any[] = [
    { label: '全部', value: '', num: '' },
    { label: '待审核', value: 0, num: '' },
    { label: '审核通过', value: 1, num: '' },
    { label: '审核不通过', value: 2, num: '' }
  ];
  private gmOptions: any[] = []; // 加盟经理列表
  private pageTitle: any = {
    all: '',
    toAudit: '',
    passAudit: '',
    noAudit: ''
  };
  // 表单对象
  private listQuery: IState = {
    workCity: '',
    busiType: '',
    gmName: '',
    payModel: '',
    payNo: '',
    applyDate: [],
    sno: '',
    driverId: '',
    driverStatus: '',
    payStatus: ''
  };
  private searchRules: any = {
    payNo: [{ validator: this.checkID, trigger: 'blur' }],
    driverCode: [{ validator: this.checkID, trigger: 'blur' }]
  };
  // 表单数组
  private formItem: any[] = [
    {
      type: 8,
      key: 'workCity',
      col: 8,
      label: '所属城市',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'workCity',
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      listeners: {
        'change': () => {
          this.listQuery.gmName = ''
          this.listQuery.busiType = ''
          this.resetDriver()
          this.handleClearQueryDriver()
          this.getGmOptions()
        }
      }
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '业务线',
      key: 'busiType',
      col: 8,
      options: this.dutyListOptions,
      listeners: {
        'change': () => {
          this.listQuery.gmName = ''
          this.handleClearQueryDriver()
          this.getGmOptions()
        }
      }
    },
    {
      type: 2,
      key: 'gmName',
      col: 8,
      label: '加盟经理',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: this.gmOptions,
      listeners: {
        'change': this.handleClearQueryDriver
      }
    },
    {
      type: 2,
      key: 'payModel',
      label: '缴费类型',
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '订单续费',
          value: 1
        },
        {
          label: '无订单充值',
          value: 0
        }
      ]
    },
    {
      type: 'payNo',
      key: 'payNo',
      slot: true,
      label: '缴费编号',
      col: 8,
      tagAttrs: {
        placeholder: '请输入',
        // maxlength: 20,
        // 'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 3,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        filterable: true
      },
      label: '缴费申请日期',
      col: 8,
      key: 'applyDate'
    },
    {
      type: 'sno',
      key: 'sno',
      label: '交易流水号',
      slot: true,
      col: 8
    },
    {
      type: 'driverId',
      slot: true,
      col: 8,
      w: '180',
      label: '司机姓名/编号/手机号',
      key: 'driverId',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 2,
      col: 8,
      key: 'driverStatus',
      label: '司机状态',
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
          label: '已面试',
          value: 1
        },
        {
          label: '待成交',
          value: 2
        },
        {
          label: '已成交',
          value: 3
        },
        {
          label: '已上岗',
          value: 4
        },
        {
          label: '已终止服务',
          value: 5
        }
      ]
    },
    {
      slot: true,
      label: '缴费状态',
      col: 18,
      type: 'payStatus'
    },
    {
      slot: true,
      col: 6,
      w: '0px',
      type: 'btn1'
    }
  ];
  // 表格
  private tableData: any[] = [];
  // 列数组
  private columns: any[] = [
    {
      key: 'payNo',
      label: '缴费编号'
    },
    {
      key: 'driverCode',
      label: '司机编号',
      width: '140px'
    },
    {
      key: 'driverName',
      label: '司机姓名'
    },
    {
      key: 'driverCity',
      label: '所属城市'
    },
    {
      key: 'gmName',
      label: '所属加盟经理'
    },
    {
      key: 'busiType',
      label: '业务线'
    },
    {
      key: 'driverStatus',
      label: '司机状态'
    },
    {
      key: 'balance',
      label: '账户总金额（元）',
      width: '120px'
    },
    {
      key: 'freezing',
      label: '冻结金额（元）',
      width: '120px'
    },
    {
      key: 'canExtract',
      label: '可提现金额（元）',
      width: '120px'
    },
    {
      key: 'payAmount',
      label: '缴费金额',
      width: '120px'
    },
    {
      key: 'payModel',
      label: '支付方式'
    },
    {
      key: 'sno',
      label: '交易流水号'
    },
    {
      key: 'payDate',
      label: '打款时间'
    },
    {
      key: 'applyDate',
      label: '申请时间'
    },
    {
      key: 'checkDate',
      label: '审核时间'
    },
    {
      key: 'applyBy',
      label: '申请人'
    },
    {
      key: 'operator',
      label: '审批人'
    },
    {
      key: 'payStatus',
      label: '缴费状态'
    },
    {
      key: 'op',
      label: '操作',
      disabled: true,
      slot: true,
      fixed: 'right',
      width: this.isPC ? '150px' : '50px'
    }
  ];
  /**
   *分页对象
   */
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };

  // 字母数字校验
  private checkID(rule: any, value: any, callback: any) {
    const can = IdRegExp.test(value)
    if (can) {
      callback()
    } else {
      callback(new Error('请输入正确的编号'))
    }
  }
  // 获取业务线
  private async getDutyListByLevel() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await GetDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        }))
        if (options.length === 1) {
          this.listQuery.busiType = options[0].value
        } else {
          this.dutyListOptions.unshift({
            label: '全部',
            value: ''
          })
        }
        this.dutyListOptions.push(...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
    }
  }
  /**
   *获取加盟经理列表
   */
  async getGmOptions() {
    try {
      this.listQuery.gmName = ''
      let params:any = {
        roleTypes: [1],
        uri: '/v2/wt-driver-account/refund/queryGM'
      }
      this.listQuery.workCity[1] !== '' && (params.cityCode = this.listQuery.workCity[1])
      this.listQuery.busiType !== '' && (params.productLine = this.listQuery.busiType)
      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        let gms = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        let lenGm:number = this.gmOptions.length
        if (lenGm > 0) {
          this.gmOptions.splice(0, lenGm)
        }
        this.gmOptions.push(...gms)
        if (this.gmOptions.length === 1) {
          this.listQuery.gmName = this.gmOptions[0].value
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 获取大区和城市
  private async showWork(node:any, resolve:any) {
    let query: any = {
      parentId: ''
    }
    if (node.level === 1) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes = await this.areaAddress({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }
  private async areaAddress(params: any) {
    try {
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  private async cityDetail(params: any) {
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
  }
  // 获取交易流水号接口
  async loadQuerySnoweywords(params:IState) {
    try {
      let { data: res } = await getSnoList(params)
      let result:any[] = res.data.map((item:any) => ({
        label: item.sno,
        value: item.sno
      }))
      return result
    } catch (err) {
      console.log(1)
      return []
    }
  }
  // 获取交易流水号
  private searchOfSno:string=''
  private queryPageOfSno = {
    page: 1,
    limit: 30
  }
  private snoOption = []
  // 获取跟多交易流水号
  private async loadQuerySnoweyword(val?:String) {
    val = this.searchOfSno
    this.queryPageOfSno.page = (this.queryPageOfSno.page as number) + 1
    let params:IState = {
      page: this.queryPageOfSno.page,
      limit: this.queryPageOfSno.limit
    }
    val !== '' && (params.key = val)
    try {
      let result:IState[] = await this.loadQuerySnoweywords(params)
      this.snoOption.push()
    } catch (err) {
      console.log(11)
    } finally {
      console.log('finally')
    }
  }
  // 搜索交易流水号
  private querySearchBySno(val:string) {
    this.queryPageOfSno.page = 1
    this.resetSno()
    this.searchOfSno = val
    this.loadQuerySnoweyword(val)
  }
  // 清除交易流水号
  private handleClearQuerySno() {
    this.searchOfSno = ''
    this.resetSno()
    this.loadQuerySnoweyword()
  }
  // 重置交易流水号
  private resetSno() {
    this.listQuery.sno = ''
    this.searchOfSno = ''
    let len:number = this.snoOption.length
    if (len > 0) {
      this.queryPageOfSno.page = 0
      this.snoOption.splice(0, len)
    }
  }

  // 获取缴费编号接口
  async loadQueryPayNoweywords(params:IState) {
    try {
      let { data: res } = await getPayNoList(params)
      let result:any[] = res.data.map((item:any) => ({
        label: item.payNo,
        value: item.payNo
      }))
      return result
    } catch (err) {
      console.log(1)
      return []
    }
  }
  // 获取缴费编号
  private searchOfPayNo:string=''
  private queryPageOfPayNo = {
    page: 1,
    limit: 30
  }
  private payNoOption = []
  // 获取更多缴费编号
  private async loadQueryPayNoweyword(val?:String) {
    val = this.searchOfPayNo
    this.queryPageOfPayNo.page = (this.queryPageOfPayNo.page as number) + 1
    let params:IState = {
      page: this.queryPageOfPayNo.page,
      limit: this.queryPageOfPayNo.limit
    }
    val !== '' && (params.key = val)
    try {
      let result:IState[] = await this.loadQueryPayNoweywords(params)
      this.payNoOption.push()
    } catch (err) {
      console.log(11)
    } finally {
      console.log('finally')
    }
  }
  // 搜索缴费编号
  private querySearchByPayNo(val:string) {
    this.queryPageOfPayNo.page = 1
    this.resetPayNo()
    this.searchOfPayNo = val
    this.loadQueryPayNoweyword(val)
  }
  // 清除缴费编号
  private handleClearQueryPayNo() {
    this.searchOfPayNo = ''
    this.resetPayNo()
    this.loadQueryPayNoweyword()
  }
  // 重置缴费编号
  private resetPayNo() {
    this.listQuery.payNo = ''
    this.searchOfPayNo = ''
    let len:number = this.payNoOption.length
    if (len > 0) {
      this.queryPageOfPayNo.page = 0
      this.payNoOption.splice(0, len)
    }
  }

  // 获取司机列表接口
  async loadDriverByKeyword(params:IState) {
    try {
      if (this.listQuery.workCity && this.listQuery.workCity.length > 0) {
        params.workCity = this.listQuery.workCity[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmName !== '' && (params.gmName = this.listQuery.gmName)
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/v2/wt-driver-account/refund/queryDriverList'
      })
      let result:any[] = res.data.map((item:any) => ({
        label: `${item.name}/${item.phone}`,
        value: item.driverId
      }))
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 获取更多司机
  async loadQueryDriverByKeyword(val?:string) {
    val = this.searchKeyword
    this.queryPage.page = (this.queryPage.page as number) + 1
    let params:IState = {
      page: this.queryPage.page,
      limit: this.queryPage.limit
    }
    val !== '' && (params.key = val)

    try {
      let result:IState[] = await this.loadDriverByKeyword(params)
      this.driverOptions.push(...result)
    } finally {
      console.log('finally')
    }
  }
  // 搜索司机
  querySearchByKeyword(val:string) {
    this.queryPage.page = 0
    this.resetDriver()
    this.searchKeyword = val
    this.loadQueryDriverByKeyword(val)
  }
  // 清除司机
  handleClearQueryDriver() {
    this.searchKeyword = ''
    this.resetDriver()
    this.loadQueryDriverByKeyword()
  }
  // 重置司机
  resetDriver() {
    this.listQuery.driverId = ''
    // this.listQuery.gmName = ''
    this.searchKeyword = ''
    let len:number = this.driverOptions.length
    if (len > 0) {
      this.queryPage.page = 0
      this.driverOptions.splice(0, len)
    }
  }
  /**
   *获取列表
   */
  async getList() {
    try {
      // if (this.listQuery.driverMobile && !phoneReg.test(this.listQuery.driverMobile)) {
      //   return this.$message.error('请输入正确的手机号')
      // }
      this.listLoading = true
      let params: any = {
        limit: this.page.limit,
        page: this.page.page
      }

      this.listQuery.payStatus !== '' && (params.payStatus = +this.listQuery.payStatus)
      this.listQuery.payStatus && (params.payStatus = +this.listQuery.payStatus)
      this.listQuery.workCity && (params.workCity = this.listQuery.workCity)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)
      this.listQuery.payModel && (params.payModel = this.listQuery.payModel)
      this.listQuery.payNo !== '' && (params.payNo = this.listQuery.payNo)
      this.listQuery.gmName !== '' && (params.gmName = this.listQuery.gmName)
      this.listQuery.sno && (params.sno = this.listQuery.sno)
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.driverStatus && (params.driverStatus = this.listQuery.driverStatus)
      if (this.listQuery.applyDate.length > 1) {
        params.startDate = new Date(this.listQuery.applyDate[0]).setHours(0, 0, 0)
        params.endDate = new Date(this.listQuery.applyDate[1]).setHours(23, 59, 59)
      }
      let { data: res } = await getPayList(params)
      this.listLoading = false
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data
        this.pageTitle = res.title
        // this.statusOptions[0].num = this.pageTitle.all
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      this.listLoading = false
      console.log(`get lists fail:`, err)
    }
  }

  private changeStatus(item: any, index: number) {
    this.active = index
    this.listQuery.payStatus = item.value
    this.getList()
  }
  /**
   * 路径跳转
   */
  goRoute(url: string, id: any) {
    console.log(id, 'id')
    if (id) {
      this.$router.push({ path: url, query: { id: id } })
    } else {
      this.$router.push({ path: url })
    }
  }
  /**
   * 查询
   */
  private handleQueryClick() {
    this.getList()
  }
  /**
   *重置
   */
  private handleResetClick() {
    this.listQuery = {
      workCity: '',
      busiType: '',
      gmName: '',
      payModel: '',
      payNo: '',
      applyDate: [],
      sno: '',
      driverId: '',
      driverStatus: '',
      payStatus: ''
    };
    ((this.$refs.searchForm) as any).resetForm()
    this.tags = []
    // this.getList()
  }
  // 导出
  @lock
  private async handleExportClick() {
    try {
      let params:IState = {}
      if (this.listQuery.applyDate && this.listQuery.applyDate.length > 1) {
        params.startDate = new Date(this.listQuery.applyDate[0]).setHours(0, 0, 0)
        params.endDate = new Date(this.listQuery.applyDate[1]).setHours(23, 59, 59)
      } else {
        return this.$message.error('需要按缴费申请日期进行导出')
      }
      if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
        params.workCity = this.listQuery.workCity[1]
      }
      this.listQuery.payNo !== '' && (params.payNo = this.listQuery.payNo)
      this.listQuery.payModel && (params.payModel = this.listQuery.payModel)
      this.listQuery.busiType && (params.busiType = this.listQuery.busiType)
      this.listQuery.gmName && (params.gmName = this.listQuery.gmName)
      this.listQuery.driverId && (params.driverId = this.listQuery.driverId)

      const { data } = await payExport(params)
      if (data.success) {
        this.$message.success('导出成功')
      } else {
        this.$message.error(data.errorMsg || data.message)
      }
    } catch (err) {
      console.log(`export fail:${err}`)
    } finally {
      console.log(`export finish`)
    }
  }

  /**
   * 分页
   */
  handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.getList()
    this.getGmOptions()
    this.getDutyListByLevel()
    this.loadQueryDriverByKeyword()
  }
}
</script>
<style lang="scss" scoped>
.payList {
  .table_box {
    padding: 0px 20px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    .middle {
      margin: 10px 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .count {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .tableTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .el-badge {
      margin-right: 10px;
    }
    .statusBox {
      display: flex;
      align-items: center;
      .btnBox {
        display: flex;
        align-items: center;
      }
    }
  }
  .mobile {
    width: 100%;
    text-align: center;
  }
  .btnMobile {
    margin-left: 0;
    margin-top: 10px;
    width: 80%;
  }
  .btnPc {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>

<style scoped>
.payList >>> .selfForm {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
}
.payList >>> .el-form-item__label {
  color: #999;
}
.doItem {
  color: #649cee;
  margin: 0 5px;
  cursor: pointer;
}
@media screen and (min-width: 700px) {
  .payList >>> .el-collapse-item__wrap {
    position: absolute;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 15px;
    left: 15px;
  }
  .payList >>> .el-collapse-item__content {
    padding-bottom: 0px;
  }
  .payList >>> .selfTable {
    padding: 0px!important;
  }
}
</style>

<style>
@media screen and (max-width: 700px) {
  .el-message-box__wrapper {
    top: 0 !important;
    left: 5% !important;
    right: 5% !important;
  }
  .el-message-box {
    width: 100%;
  }
}

</style>
