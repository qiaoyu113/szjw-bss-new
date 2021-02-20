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
      label-width="55px"
      class="p15 SuggestForm"
    >
      <div
        slot="btn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="success"
          name="driverclue_filter_btn"
          @click="bindingClick"
        >
          绑定
        </el-button>
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
        <el-button
          type="text"
          size="small"
          @click="changeSeatNumber(scope.row)"
        >
          更换绑定
        </el-button>
      </template>
    </self-table>
    <!--座席号改绑-->
    <el-dialog
      title="坐席号改绑"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="changeSeatForm">
        <DetailItem
          name="绑定人"
          :value="changeSeatForm.nickName"
        />
        <DetailItem
          name="绑定人坐席号"
          :value="changeSeatForm.nickName"
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
          <el-select
            v-model="changeSeatForm.nickName"
            filterable
            name="freightlist_gmId_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in optionsBind"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div v-if="changeSeatForm.nickName">
          <DetailItem
            name="确定更改绑定人信息:"
            value=""
            style="border-top: 1px solid #dfdfdf;padding-top:10px;"
          />
          <DetailItem
            name="角色"
            :value="changeSeatForm.nickName + '12'"
          />
          <DetailItem
            name="组织架构"
            :value="changeSeatForm.nickName + '12'"
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
          @click="dialogFormVisible = false"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!--座席号新建-->
    <el-dialog
      title="坐席号绑定"
      :visible.sync="bindFormVisible"
    >
      <el-form :model="newSeatForm">
        <el-form-item
          label="绑定人"
          label-width="120px"
        >
          <el-input
            v-model="newSeatForm.nickName"
            maxlength="10"
            placeholder="请输入绑定人姓名"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item
          label="绑定人手机号"
          prop="phone"
          label-width="120px"
        >
          <el-input
            v-model="newSeatForm.phone"
            placeholder="请输入绑定人手机号"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="勾选坐席号"
          label-width="120px"
          style="font-size:13px !important"
        >
          <el-select
            v-model="newSeatForm.seatNumber"
            filterable
            name="freightlist_gmId_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in optionsBindNumber"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div v-if="newSeatForm.nickName && newSeatForm.seatNumber && newSeatForm.phone">
          <DetailItem
            name="确定更改绑定人信息:"
            value=""
            style="border-top: 1px solid #dfdfdf;padding-top:10px;"
          />
          <DetailItem
            name="姓名"
            :value="newSeatForm.nickName + '12'"
          />
          <DetailItem
            name="绑定人手机号"
            :value="newSeatForm.phone + '12'"
          />
          <DetailItem
            name="绑定人坐席号"
            :value="newSeatForm.nickName + '12'"
          />
          <DetailItem
            name="角色"
            :value="newSeatForm.nickName + '12'"
          />
          <DetailItem
            name="组织架构"
            :value="newSeatForm.nickName + '12'"
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
          @click="bindFormVisible = false"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { getUserManagerList, enableOrDisableUser, resetPassword, pushUserToCRM } from '@/api/system'
import SelfForm from '@/components/Base/SelfForm.vue'
import { getLabel, phoneReg } from '@/utils/index.ts'
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
  private dialogFormVisible:any = false
  private bindFormVisible:any = false
  private tags:any[] = []// 顶部查询按钮回显的数组
  private listLoading:boolean = false
  private tableData:tableObj[] = []
  // 渲染表格的列表
  private columns:ColumnsObj[] = [
    {
      key: 'seatNumber',
      label: '坐席号',
      'min-width': '140px'
    },
    {
      key: 'nickName',
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
    nickName: '', // 绑定人
    seatNumber: '', // 绑定人坐席号
    changeName: '', // 更改后的绑定人
    roleName: '', // 角色
    officeName: '' // 组织架构
  }
  // 新建绑定
  private newSeatForm: any = {}
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 查询表单
  private listQuery:IState = {
    status: '',
    mobile: '',
    nickName: ''
  }
  // 渲染查询表单的列表
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 10,
        clearable: true
      },
      label: '姓名',
      key: 'nickName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 11,
        clearable: true
      },
      label: '坐席号',
      key: 'seatNumber'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 11,
        clearable: true
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
    this.getLists()
  }
  // 获取用户列表
  async getLists() {
    try {
      this.listLoading = true
      interface Params {
        limit:number;
        page:number;
        nickName?:string;
        mobile?:string;
        status?:string|number
      }
      let params:Params = {
        limit: +this.page.limit,
        page: +this.page.page,
        status: this.listQuery.status
      }
      this.listQuery.nickName && (params.nickName = this.listQuery.nickName)
      this.listQuery.mobile && (params.mobile = this.listQuery.mobile)
      let { data: res } = await getUserManagerList(params)
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
  // 启用、禁用
  async enableOrDisableUser(row:any) {
    try {
      let params = {
        id: row.id,
        status: row.status === 1 ? 2 : 1
      }
      let { data: res } = await enableOrDisableUser(params)
      if (res.success) {
        // 同步crm
        if (row.syncStatus) {
          if (row.status === 1) { // 禁用
            this.$message.success('禁用状态同步CRM系统状态成功!')
          } else { // 启用
            this.$message.success('启用状态同步CRM系统状态成功,需在CRM系统中进行用户授权！')
          }
        } else {
          this.$message.success('操作成功!')
        }
        this.getLists()
      } else {
        if (row.syncStatus) {
          this.$message.error(`${row.status === 1 ? '禁用' : '启用'}状态同步CRM系统状态失败！请联系系统管理员或在CRM中操作${row.status === 1 ? '禁用' : '启用'}`)
        } else {
          this.$message.error(res.errorMsg)
        }
      }
    } catch (err) {
      console.log(`enable or disable fail:${err}`)
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 打开禁用确认框
  openDisableUser(row:any) {
    this.$confirm(`您确定要${row.status === 1 ? '禁' : '启'}用${row.nickName}吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.enableOrDisableUser(row)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    })
  }
  // 更多操作
  handleCommandChange(key:string|number, row:any) {
    if (key === 'edit') { // 编辑
      this.$router.push({
        path: '/system/modifyUser',
        query: {
          userId: row.id
        }
      })
    } else if (key === 'resetPwd') { // 重置密码
      this.openResetPassword(row)
    } else if (key === 'status') { // 重置密码
      this.openDisableUser(row)
    } else if (key === 'crm') {
      this.openSendCrmData(row)
      console.log('crm')
    }
  }
  // 同步crm弹框
  openSendCrmData(row:any) {
    this.$confirm(`确定要同步生成${row.nickName}用户的CRM账户吗?(注意:确认生成后需要前往激活方可生效)`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.pushUserToCRM(row)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    })
  }
  // 同步用户到crm
  async pushUserToCRM(row:any) {
    try {
      let params = {
        userId: row.id
      }
      let { data: res } = await pushUserToCRM(params)
      if (res.success) {
        this.$message.success(`同步CRM账号成功！`)
        this.getLists()
      } else {
        if (res.errorMsg.indexOf('already') > -1) {
          this.$message.error('用户账号已同步CRM')
        } else {
          this.$message.error(res.errorMsg)
        }
      }
    } catch (err) {
      console.log(`push userto crm fail:${err}`)
    }
  }
  // 删除顶部表单的选项
  handleQuery(value:any, key:keyof FormObj | 'state') {
    if (key === 'state') {
      this.page.page = 1
      this.listQuery.status = value
    } else {
      this.listQuery[key] = value
    }
    this.getLists()
  }
  // 重置表单
  handleResetClick() {
    this.listQuery = {
      status: '',
      mobile: '',
      nickName: ''
    }
    this.tags = []
    // this.getLists()
  }
  // 获取列表
  handleFilterClick() {
    let blackLists = ['status']
    this.tags = []
    for (let key in this.listQuery) {
      if (this.listQuery[key] !== '' && (this.tags.findIndex(item => item.key === key) === -1) && !blackLists.includes(key)) {
        let name = getLabel(this.formItem, this.listQuery, key)
        if (name) {
          this.tags.push({
            type: 'info',
            name: name,
            key: key
          })
        }
      }
    }
    this.getLists()
  }
  // 打开重置密码的弹框
  openResetPassword(row:any) {
    this.$confirm(`确定要将密码重置为手机号吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.resetPassword(row)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    })
  }
  // 重置密码
  async resetPassword(row:any) {
    try {
      let params = {
        id: row.id
      }
      let { data: res } = await resetPassword(params)
      if (res.success) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`reset password fail:${err}`)
    }
  }
  // 坐席号改绑
  async changeSeatNumber(row: any) {
    this.dialogFormVisible = true
  }
  // 新建绑定
  bindingClick() {
    this.bindFormVisible = true
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
