<template>
  <div :class="isPC ? 'RoleManage' : 'RoleManage-m'">
    <div>
      <!-- 查询表单 -->
      <self-form
        ref="searchForm"
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="140px"
        class="p15 SuggestForm"
        :pc-col="8"
      >
        <div
          slot="mulBtn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <el-button
            size="small"
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            @click="handleFilterClick"
          >
            查询
          </el-button>
          <el-button
            size="small"
            :class="isPC ? '' : 'btnMobile'"
            @click="handleResetClick"
          >
            重置
          </el-button>
          <el-button
            v-permission="['/v1/base/role/create/8','/v1/base/role/create/1','/v1/base/role/create/3','/v1/base/role/create/7','/v1/base/role/create/6']"
            size="small"
            :class="isPC ? '' : 'btnMobile'"
            type="primary"
            @click="goCreateUser"
          >
            新建角色
          </el-button>
        </div>
      </self-form>
      <div
        v-loading="listLoading"
        class="table_center"
      >
        <!-- 表格 -->
        <self-table
          ref="selfDriverTag"
          height="100px"
          :is-p30="false"
          :operation-list="[]"
          :table-data="list"
          :columns="columns"
          :index="false"
          :page="page"
          @onPageSize="handlePageSize"
        >
          <template v-slot:user="scope">
            <el-button
              type="text"
              @click="goUserPage(scope.row.id)"
            >
              查看用户列表
            </el-button>
          </template>
          <template v-slot:op="scope">
            <el-dropdown
              :trigger="isPC ? 'hover' : 'click'"
              name="rolemanage_moreMenu_dropdown"
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
                name="rolemanage_moreMenuItem_dropdown"
              >
                <el-dropdown-item
                  v-permission="['/v3/base/role/distributeRoleToUser']"
                  @click.native="handleAllowClick(scope.row)"
                >
                  分配用户
                </el-dropdown-item>
                <el-dropdown-item
                  v-permission="['/v1/base/role/deleteByAuthId/8','/v1/base/role/deleteByAuthId/1','/v1/base/role/deleteByAuthId/3','/v1/base/role/deleteByAuthId/7','/v1/base/role/deleteByAuthId/6']"
                  @click.native="deleteRole(scope.row)"
                >
                  删除
                </el-dropdown-item>
                <el-dropdown-item
                  v-permission="['/v1/base/role/update/8','/v1/base/role/update/1','/v1/base/role/update/3','/v1/base/role/update/7','/v1/base/role/update/6']"
                  @click.native="editRole(scope.row)"
                >
                  编辑
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </self-table>
      </div>
    </div>
    <AllowDio
      :show-dialog.sync="showAllow"
      :allow-data="allowData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { roleList, deleteRole } from '@/api/preset'
import { HandlePages } from '@/utils/index'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import AllowDio from './components/AllowDio.vue'

import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}
interface PageObj {
  page:number,
  limit:number,
  total?:number
}

@Component({
  name: 'roleManage',
  components: {
    SelfTable,
    SelfForm,
    AllowDio
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private total = 0;
  private showAllow:boolean = false
  private allowData:IState = {}
  private list: IState[] = [];
  private queryPage: IState = {
    page: 1,
    limit: 30
  };
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  private listLoading = false;
  private listQuery: IState = {
    nick: '',
    dutyName: '',
    sysType: ''
  };
  private formItem: IState[] = [
    {
      type: 1,
      label: '角色名称',
      key: 'nick',
      tagAttrs: {
        placeholder: '请输入角色名称',
        maxlength: 10,
        'show-word-limit': true,
        clearable: true
      },
      listeners: {
        'input': () => { this.trimValue('nick') }
      }
    },
    {
      type: 1,
      label: '岗位职责',
      key: 'dutyName',
      tagAttrs: {
        placeholder: '请输入岗位职责',
        maxlength: 10,
        clearable: true
      },
      listeners: {
        'input': () => { this.trimValue('dutyName') }
      }
    },
    {
      type: 'mulBtn',
      col: 8,
      slot: true,
      w: '0px'
    }
  ];
  private columns: IState[] = [
    {
      key: 'nick',
      label: '角色名称'
    },
    {
      key: 'description',
      label: '角色描述'
    },
    {
      key: 'dutyName',
      label: '岗位职责'
    },
    {
      key: 'usedUserCount',
      label: '使用人数'
    },
    {
      label: '用户',
      key: 'user',
      slot: true
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px'
    }
  ];
  // 计算属性
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    return SettingsModule.tableHeight + 110
  }
  trimValue(this:any, type:string) {
    this.listQuery[type].replace(/ /g, '')
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getList()
  }
  handleResetClick() {
    (this.$refs['searchForm'] as any).resetForm()
    this.$nextTick(() => {
      this.getList()
    })
  }
  handleEditClick() {

  }
  // 分页
  private handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  // 事件处理
  // 处理tags方法
  // 所有请求方法
  private fetchData() {
    this.getList()
  }
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {}
  // 请求列表
  private async getList() {
    try {
      this.listLoading = true
      let params = { ...this.listQuery, ...this.page }
      Reflect.deleteProperty(params, 'total')
      const { data } = await roleList(params)

      if (data.success) {
        this.list = data.data || []
        data.page = await HandlePages(data.page)
        this.page.total = data.page.total
      } else {
        this.$message.error(data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.listLoading = false
    }
  }
  private handleAllowClick(item: any) {
    this.allowData = item
    this.showAllow = true
  }
  private goUserPage(id: string) {
    this.$router.push(
      { name: 'ShowUser',
        query: { id: id }
      })
  }
  private goCreateUser() {
    let name = 'wtSystem'
    switch (this.$route.meta.sysType) {
      case 1:
        name = 'wtSystem'
        break
      case 3:
        name = 'lnSystem'
        break
      case 7:
        name = 'clueSystem'
        break
      case 8:
        name = 'dataSystem'
        break
      case 6:
        name = 'roleSystem'
        break
    }
    this.$router.push({ path: `/roleSystem/${name}/RoleCreate`, query: { sysType: this.$route.meta.sysType } })
  }
  private editRole(row: any) {
    let name = 'wtSystem'
    switch (this.$route.meta.sysType) {
      case 1:
        name = 'wtSystem'
        break
      case 3:
        name = 'lnSystem'
        break
      case 7:
        name = 'clueSystem'
        break
      case 8:
        name = 'dataSystem'
        break
      case 6:
        name = 'roleSystem'
        break
    }
    this.$router.push({ path: `/roleSystem/${name}/roleOperate`, query: { id: row.id, sysType: this.$route.meta.sysType } })
  }
  private deleteRole(item: any) {
    this.$confirm(`您确定要删除“${item.nick}”吗？`, '删除角色', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { data } = await deleteRole(item.id)
      if (data.success) {
        this.$message.success(`删除成功`)
        this.getList()
      } else {
        this.$message.error(data)
      }
    })
  }
  mounted() {
    this.listQuery.sysType = this.$route.meta.sysType
    this.fetchData()
  }
  activated() {
    this.listQuery.sysType = this.$route.meta.sysType
    this.$nextTick(() => {
      (this.$refs['searchForm'] as any).doLayout()
    })
  }
}
</script>
<style lang="scss" scoped>
.RoleManage {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .btnPc{
    width: 100%;
    padding: 0 20%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
  .table_center {
      padding: 10px 30px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
  }
}
.RoleManage-m{
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      padding-bottom: 30px;
      box-sizing: border-box;
      background: #ffffff;
    }
  }
}
.RoleManage,
.RoleManage-m{
  .btn-item,
  .btn-item-m {
    margin: 0 10px;
  }
  .btn-item-filtrate,
  .btn-item-filtrate-m {
    background-color: $assist-btn;
    border-color: $assist-btn;
  }
}

</style>
