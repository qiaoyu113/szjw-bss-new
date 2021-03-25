<template>
  <div class="UserList">
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
      <template v-slot:status="scope">
        <span v-if="scope.row.status ===1">启用</span>
        <span v-else>禁用</span>
      </template>
      <template v-slot:op="scope">
        <el-dropdown
          :trigger="isPC ? 'hover' : 'click'"
          name="driverclue_moreMenu_dropdown"
          @command="(e) => handleCommandChange(e,scope.row)"
        >
          <span
            v-if="isPC"
            class="el-dropdown-link"
          >
            更多操作<i
              v-if="isPC"
              class="el-icon-arrow-down el-icon--right"
            />
          </span>
          <span
            v-else
            style="font-size: 18px;"
            class="el-dropdown-link"
          >
            <i class="el-icon-setting el-icon--right" />
          </span>

          <el-dropdown-menu
            slot="dropdown"
          >
            <el-dropdown-item
              v-permission="['/v2/base/user/enableOrDisable']"
              command="status"
            >
              <template v-if="scope.row.status ===1">
                禁用
              </template>
              <template v-else>
                启用
              </template>
            </el-dropdown-item>
            <el-dropdown-item
              v-permission="['/v1/base/user/password/reset']"
              command="resetPwd"
            >
              重置密码
            </el-dropdown-item>
            <el-dropdown-item
              v-permission="['/v3/base/user/update']"
              command="edit"
            >
              编辑
            </el-dropdown-item>
            <el-dropdown-item
              v-if="scope.row.syncPermission"
              command="crm"
            >
              同步CRM账号
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </self-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { enableOrDisableUser, resetPassword, pushUserToCRM } from '@/api/system'
import { GetUserListsV3 } from '@/api/preset'
import { HandlePages } from '@/utils/index'
interface IState {
  [key: string]: any;
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
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
@Component({
  name: 'UserList',
  components: {
    SelfTable
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) listQuery!:IState
  private listLoading:boolean = false
  private tableData:tableObj[] = []
  private columns:ColumnsObj[] = [
    {
      key: 'nickName',
      label: '用户姓名',
      'min-width': '140px'
    },
    {
      key: 'mobile',
      label: '电话',
      'min-width': '140px'
    },
    {
      key: 'officeName',
      label: '组织架构',
      'min-width': '200px'
    },
    {
      key: 'roleName',
      label: '角色名称',
      'min-width': '140px'
    },
    {
      key: 'status',
      label: '账号状态',
      'min-width': '140px',
      slot: true
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ]
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 获取用户列表
  async getLists() {
    try {
      this.listLoading = true
      let params:IState = {
        limit: +this.page.limit,
        page: +this.page.page,
        url: '/v3/base/user/page/list'
      }

      if (this.listQuery.officeId1 && this.listQuery.officeId1.length > 0) {
        let firstLevel = this.listQuery.officeId1[0]
        if (firstLevel === 16) {
          params.flag = 3
        } else if (firstLevel === -1) {
          params.flag = 2
        } else {
          params.flag = 1
        }
      }

      this.listQuery.status !== '' && (params.status = this.listQuery.status)
      this.listQuery.nickName && (params.nickName = this.listQuery.nickName)
      this.listQuery.mobile && (params.mobile = this.listQuery.mobile)

      this.listQuery.officeId1 && this.listQuery.officeId1.length > 0 && (params.officeId = this.listQuery.officeId1[this.listQuery.officeId1.length - 1])
      this.listQuery.roleId !== '' && (params.roleId = this.listQuery.roleId)
      this.listQuery.roleName && (params.roleName = this.listQuery.roleName)
      let { data: res } = await GetUserListsV3(params)
      if (res.success) {
        res.page = await HandlePages(res.page)
        this.tableData = res.data
        this.page.total = res.page.total
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get lists fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 删除colums操作
  deteleOp() {
    this.columns.splice(this.columns.length - 1, 1)
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 更多操作
  handleCommandChange(key:string|number, row:any) {
    if (key === 'edit') { // 编辑
      this.$router.push({
        path: '/roleSystem/addUser',
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
    }
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
}
</script>
<style lang="scss" scoped>

</style>
