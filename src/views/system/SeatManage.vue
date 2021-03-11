<template>
  <div
    class="userManager"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      :pc-col="8"
      label-width="90px"
      class="p15 SuggestForm"
    >
      <div
        slot="btn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          name="driverclue_filter_btn"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          name="driverclue_reset_btn"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>
    </self-form>

    <table-header
      :tab="[
        {
          name: '坐席管理',
          label: '坐席管理'
        }
      ]"
      active-name="坐席管理"
    />
    <self-table
      v-loading="listLoading"
      :operation-list="[]"
      :index="false"
      :height="'auto'"
      :table-data="tableData"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
    >
      <template v-slot:op="scope">
        <div v-if="scope.row.status === 1">
          <el-button
            v-permission="['/v3/base/agent/change']"
            type="text"
            size="small"
            @click="changeSeatNumber(scope.row)"
          >
            更换绑定
          </el-button>
          <el-button
            v-permission="['/v3/base/agent/unbundling']"
            type="text"
            size="small"
            @click="unbundlingClick(scope.row)"
          >
            解绑
          </el-button>
        </div>
        <div v-else>
          <el-button
            v-permission="['/v3/base/agent/bundling']"
            type="text"
            size="small"
            @click="bindingClick(scope.row)"
          >
            绑定
          </el-button>
        </div>
      </template>
    </self-table>
    <!--座席号改绑-->
    <el-dialog
      v-loading="loadingDialog"
      title="坐席号改绑"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="ruleChangeSeatForm"
        :model="changeSeatForm"
        :rules="ruleChangeSeatForm"
      >
        <DetailItem
          name="当前绑定人"
          :value="beforeSeatForm.nickName"
        />
        <DetailItem
          name="当前坐席号"
          :value="beforeSeatForm.seatNumber"
        />
        <DetailItem
          name="更改绑定"
          value=""
          style="border-top: 1px solid #dfdfdf;padding-top:10px;"
        />
        <el-form-item
          label="更改后的绑定人"
          label-width="120px"
          style="font-size:13px !important"
        >
          <el-autocomplete
            v-model="changeSeatForm.value"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入绑定人姓名或手机号"
            @select="handleChangeUser"
          />
        </el-form-item>
        <div v-if="changeSeatForm.nickName">
          <DetailItem
            name="确定更改绑定人信息:"
            value=""
            style="border-top: 1px solid #dfdfdf;padding-top:10px;"
          />
          <DetailItem
            name="姓名"
            :value="changeSeatForm.nickName"
          />
          <DetailItem
            name="绑定人手机号"
            :value="changeSeatForm.mobile"
          />
          <DetailItem
            name="角色"
            :value="changeSeatForm.roleName"
          />
          <DetailItem
            name="组织架构"
            :value="changeSeatForm.officeName"
          />
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="changeFormSubmit"
        >
          更改绑定
        </el-button>
      </div>
    </el-dialog>
    <!--座席号新建-->
    <el-dialog
      v-loading="loadingDialog"
      title="坐席号绑定"
      :visible.sync="bindFormVisible"
    >
      <el-form
        ref="ruleNewSeatForm"
        :model="newSeatForm"
        :rules="ruleNewSeatForm"
      >
        <el-form-item
          label="坐席号"
          label-width="120px"
          style="font-size:13px !important"
        >
          <el-input
            v-model="newSeatForm.seatNumber"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="选择用户"
          label-width="120px"
        >
          <el-autocomplete
            v-model="newSeatForm.value"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入绑定人姓名/手机号"
            @select="handleSelectUser"
          />
        </el-form-item>
        <div v-if="newSeatForm.nickName && newSeatForm.seatNumber">
          <DetailItem
            name="确定更改绑定人信息:"
            value=""
            style="border-top: 1px solid #dfdfdf;padding-top:10px;"
          />
          <DetailItem
            name="姓名"
            :value="newSeatForm.nickName"
          />
          <DetailItem
            name="绑定人手机号"
            :value="newSeatForm.mobile"
          />
          <DetailItem
            name="绑定人坐席号"
            :value="newSeatForm.seatNumber"
          />
          <DetailItem
            name="角色"
            :value="newSeatForm.roleName"
          />
          <DetailItem
            name="组织架构"
            :value="newSeatForm.officeName"
          />
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="bindFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="bindFormSubmit"
        >
          绑 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { getAgentList, getEnableAgentNums, getQueryGM, agentBundling, agentChangeBundling, getDutyListByLevel, agentChangeUnBundling } from '@/api/system'
import { showWork } from '@/utils'
import SelfForm from '@/components/Base/SelfForm.vue'
import { HandlePages } from '@/utils/index'
import DetailItem from '@/components/DetailItem/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
interface PageObj {
  page:Number,
  limit:Number,
  total?:Number
}

interface ColumnsObj {
  key: string;
  label: string;
  width?: string;
  'min-width'?:string;
  slot?:boolean;
  fixed?:string;
}

interface tableObj {
  nickName: string;
  roleName: string;
  officeName: string;
  mobile: string;
  status: number;
}

interface Tab {
  label:String,
  name:String,
  id:Number,
  num?:Number | undefined
}

interface FormObj {
  status:number|string;
  mobile:number|string;
  nickName:string;
}

interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfTable,
    SelfForm,
    TableHeader,
    DetailItem
  }
})
export default class extends Vue {
  // 状态
  private tab:Tab[] = [
    {
      label: '全部',
      name: '',
      id: 0,
      num: 0
    },
    {
      label: '启用',
      name: '1',
      id: 1,
      num: 0
    },
    {
      label: '禁用',
      name: '2',
      id: 2,
      num: 0
    }
  ]
  private timeout: any = null
  private ruleChangeSeatForm: any = {

  }
  private ruleNewSeatForm: any = {

  }
  private beforeSeatForm: any = {
    nickName: '',
    seatNumber: ''
  }
  private dialogFormVisible:any = false
  private bindFormVisible:any = false
  private loadingDialog:any = false
  private tags:any[] = []// 顶部查询按钮回显的数组
  private listLoading:boolean = false
  private tableData:tableObj[] = []
  private busiTypeOptions:any[] = []
  private statusOptions:any[] = [{
    label: '全部',
    value: ''
  }, {
    label: '已绑定',
    value: 1
  }, {
    label: '未绑定',
    value: 2
  }]
  // 渲染表格的列表
  private columns:ColumnsObj[] = [
    {
      key: 'agentNum',
      label: '坐席号',
      'min-width': '140px'
    },
    {
      key: 'busiType',
      label: '所属业务线',
      'min-width': '140px'
    },
    {
      key: 'cityName',
      label: '所属城市',
      'min-width': '140px'
    },
    {
      key: 'userName',
      label: '姓名',
      'min-width': '140px'
    },
    {
      key: 'roleName',
      label: '角色',
      'min-width': '140px'
    },
    {
      key: 'officeName',
      label: '组织架构',
      'min-width': '200px'
    },
    {
      key: 'mobile',
      label: '手机号',
      'min-width': '140px'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ]
  private changeSeatForm: any = {
    value: '',
    nickName: '', // 绑定人
    seatNumber: '', // 绑定人坐席号
    changeName: '', // 更改后的绑定人
    roleName: '', // 角色
    officeName: '' // 组织架构
  }
  // 新建绑定
  private newSeatForm: any = {
    value: '',
    nickName: '', // 绑定人
    seatNumber: '' // 绑定人坐席号
  }
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 查询表单
  private listQuery:IState = {
    cityCode: '',
    status: '',
    busiType: '',
    agentNum: '',
    mobile: '',
    userName: ''
  }
  // 渲染查询表单的列表
  private formItem:any[] = [
    {
      type: 8,
      key: 'cityCode',
      col: 8,
      label: '所属城市',
      tagAttrs: {
        placeholder: '请选择所属城市',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'cityCode',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 2,
      key: 'busiType',
      col: 8,
      label: '所属业务线',
      tagAttrs: {
        placeholder: '请选择',
        name: 'busiType',
        clearable: true
      },
      options: this.busiTypeOptions
    },

    {
      type: 2,
      key: 'status',
      col: 8,
      label: '绑定状态',
      tagAttrs: {
        placeholder: '请选择',
        name: 'status',
        clearable: true
      },
      options: this.statusOptions
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: '姓名',
      key: 'userName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 11,
        clearable: true
      },
      label: '坐席号',
      key: 'agentNum'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 11,
        clearable: true
      },
      listeners: {
        input: this.oninputOnlyNum
      },
      label: '手机号',
      key: 'mobile'
    }
  ]
  private optionsBind: any = []
  private optionsBindNumber: any = []
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  mounted() {
    this.getOffices()
    this.getLists()
  }
  // 获取列表数据
  async getLists() {
    try {
      this.listLoading = true
      interface Params {
        pageSize:number;
        pageNo:number;
        userId?:string;
        agentNum?:string;
        mobile?:string|number;
        userName?:string|number;
        cityCode: string|number;
        status: string|number;
        busiType: string|number;
      }
      let params:Params = {
        pageSize: +this.page.limit,
        pageNo: +this.page.page,
        userId: this.listQuery.userId,
        agentNum: this.listQuery.agentNum,
        mobile: this.listQuery.mobile,
        userName: this.listQuery.userName,
        cityCode: this.listQuery.cityCode[1],
        status: this.listQuery.status,
        busiType: this.listQuery.busiType
      }
      let { data: res } = await getAgentList(params)
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.tableData = res.data
        this.page.total = res.page.total
        for (let i = 0; i < this.tab.length; i++) {
          let item:Tab = this.tab[i]
          if (item.name === '') {
            item.num = res.title.totalCount
          } else if (item.name === '1') {
            item.num = res.title.enableCount
          } else if (item.name === '2') {
            item.num = res.title.disableCount
          }
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 重置表单
  handleResetClick() {
    this.listQuery = {
      userId: '',
      agentNum: '',
      mobile: '',
      userName: '',
      cityCode: '',
      status: '',
      busiType: ''
    }
  }
  // 获取列表
  handleFilterClick() {
    this.getLists()
  }
  // 坐席号改绑
  async changeSeatNumber(row: any) {
    try {
      this.beforeSeatForm = {
        nickName: row.userName,
        seatNumber: row.agentNum
      }
      this.changeSeatForm.id = ''
      this.changeSeatForm.nickName = ''
      this.changeSeatForm.value = ''
      this.dialogFormVisible = true
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  /**
   * 获取组织
   */
  async getOffices() {
    try {
      let params = {
        dutyLevel: 1
      }
      let { data: res } = await getDutyListByLevel(params)
      if (res.success) {
        let options = res.data.map((item:any) => ({
          label: item.dutyName,
          value: item.id
        }))
        this.busiTypeOptions.push({ label: '全部', value: '' }, ...options)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get duty list fail:${err}`)
    }
  }
  // 新建绑定
  bindingClick(row: any) {
    this.newSeatForm.nickName = ''
    this.newSeatForm.value = ''
    this.newSeatForm.id = ''
    this.newSeatForm.seatNumber = row.agentNum
    this.getEnableAgentNum()
  }
  // 解除绑定
  unbundlingClick(row: any) {
    this.$confirm('是否确定解绑该用户', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      let { data: res } = await agentChangeUnBundling({ agentNum: row.agentNum })
      if (res.success) {
        this.$message({
          type: 'success',
          message: '解绑成功!'
        })
        setTimeout(() => {
          this.getLists()
        }, 1000)
      } else {
        this.$message.error(res.errorMsg)
      }
    })
  }
  // 确认绑定
  async bindFormSubmit() {
    if (!this.newSeatForm.id) {
      this.$message.warning('请选择绑定人')
      return false
    }
    this.loadingDialog = true
    try {
      let { data: res } = await agentBundling({
        agentNum: this.newSeatForm.seatNumber,
        userId: this.newSeatForm.id
      })
      if (res.success) {
        if (res.data) {
          this.$message({
            message: '绑定成功!',
            type: 'success'
          })
          this.loadingDialog = false
          this.bindFormVisible = false
          setTimeout(() => {
            this.getLists()
          }, 1000)
        } else {
          this.loadingDialog = false
          this.$message.error(res.errorMsg)
        }
      } else {
        this.loadingDialog = false
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 更换绑定
  async changeFormSubmit() {
    if (!this.changeSeatForm.id) {
      this.$message.warning('请选择绑定人')
      return false
    }
    this.loadingDialog = true
    try {
      let { data: res } = await agentChangeBundling({
        agentNum: this.beforeSeatForm.seatNumber,
        userId: this.changeSeatForm.id
      })
      if (res.success) {
        if (res.data) {
          this.$message({
            message: '更改成功!',
            type: 'success'
          })
          this.loadingDialog = false
          this.dialogFormVisible = false
          setTimeout(() => {
            this.getLists()
          }, 1000)
        } else {
          this.loadingDialog = false
          this.$message.error(res.errorMsg)
        }
      } else {
        this.loadingDialog = false
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 获取所有可用的坐席号
  async getEnableAgentNum() {
    try {
      let { data: res } = await getEnableAgentNums()
      if (res.success) {
        this.optionsBindNumber = res.data
        this.bindFormVisible = true
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 获取绑定人信息
  async querySearchAsync(queryString: any, cb: any) {
    try {
      if (queryString) {
        let { data: res } = await getQueryGM({
          keyword: queryString,
          roleTypes: [8],
          uri: '/v3/base/agent/queryGM'
        })
        if (res.success) {
          res.data.forEach((element: any) => {
            element.value = element.nickName + element.mobile
          })
          let userList = res.data
          let results = queryString ? userList : []
          this.timeout = setTimeout(() => {
            cb(results)
          }, 1000 * Math.random())
        } else {
          let results: any = []
          this.timeout = setTimeout(() => {
            cb(results)
          }, 1000 * Math.random())
        }
      } else {
        let results: any = []
        cb(results)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 选择绑定人
  handleSelectUser(item: any) {
    this.newSeatForm = Object.assign(this.newSeatForm, item)
  }
  // 更换绑定人
  handleChangeUser(item: any) {
    this.changeSeatForm = Object.assign(this.changeSeatForm, item)
  }
  // 手机号校验
  private oninputOnlyNum(value: string) {
    this.listQuery.mobile = value.replace(/[^\d]/g, '')
  }
}
</script>
<style lang="scss" scoped>
  .userManager {
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .subTitle {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
      h4 {
        margin: 0px;
      }
      .createUser {
        margin-bottom:10px;
      }
    }
    .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
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
  }
</style>

<style scoped>
  .userManager >>> .el-card {
    border:none;
  }
  .userManager >>> .el-card__header {
    border-bottom: none;
  }
</style>
