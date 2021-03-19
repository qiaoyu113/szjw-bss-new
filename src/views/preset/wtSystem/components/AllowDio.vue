<template>
  <div class="AllowDio">
    <SelfDialog
      :visible.sync="show"
      :title="dialogTit"
      :confirm="confirm"
      top="5vh"
      width="80%"
      :sumbit-again="canSumbit"
      :destroy-on-close="true"
      :show-confirm-button="true"
      confirm-button-text="提交分配"
      @closed="handleClosed"
      @open="openDio"
    >
      <self-form
        ref="searchForm"
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="140px"
        class="p15 SuggestForm"
        :pc-col="8"
      >
        <template slot="officeId">
          <el-cascader
            v-model="listQuery.officeId"
            placeholder="请选择"
            :props=" {
              checkStrictly: true,
              value: 'id',
              label: 'name',
              children: 'officeVOs'
            }"
            :options="officeArr"
            @change="handleOfficeIdChange"
          />
        </template>
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
        </div>
      </self-form>

      <div
        v-loading="listLoading"
        class="table_box"
      >
        <!-- 表格 -->
        <self-table
          ref="AllowTable"
          :is-p30="false"
          :operation-list="[]"
          :table-data="tableData"
          :columns="columns"
          :index="true"
          :page="page"
          row-key="marketClueId"
          style="overflow: initial;"
          :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
          :max-height="tableHeight"
          :page-size="pageSize"
          :func="disabledCheck"
          :empty="true"
          @onPageSize="handlePageSize"
          @selection-change="handleSelectionChange"
        >
          <template v-slot:status="scope">
            <span v-if="scope.row.status ===1">启用</span>
            <span v-else>禁用</span>
          </template>
        </self-table>
      </div>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages } from '@/utils/index'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { roleList, distributeRoleToUser, GetUserListsV3 } from '@/api/preset'
import userList from '../../user/components/UserLists.vue'
import { GetOfficeByCurrentUser, GetDutyAndRoleList, GetRoleParamsByOfficeId } from '../../user/index'
interface IState {
  [key: string]: any;
}
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
@Component({
  name: 'AllowDio',
  components: {
    SelfDialog,
    SelfTable,
    SelfForm,
    userList
  }
})
export default class extends Vue {
  @Prop({ required: false }) showDialog!: boolean;
  @Prop({ default: {} }) allowData!: IState;

  private officeArr = [] // 组织架构列表
  private roleArr = [] // 角色列表
  private pageSize:number[] = [10, 20, 50, 100, 150, 200]
  private canSumbit:boolean = true
  private listLoading: boolean = false;
  private tableData:IState = []
  private multipleSelection: any[] = []; // 当前页选中的数据
  private listQuery: IState = {
    nickName: '',
    mobile: '',
    officeId: []
  };
  private formItem: IState[] = [
    {
      key: 'officeId',
      type: 'officeId',
      label: '组织结构:',
      slot: true,
      col: 24
    },
    {
      type: 1,
      label: '用户姓名',
      key: 'nickName',
      tagAttrs: {
        placeholder: '请输入角色名称',
        maxlength: 10,
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 1,
      label: '电话',
      key: 'mobile',
      tagAttrs: {
        placeholder: '请输入电话',
        maxlength: 11,
        'show-word-limit': true,
        clearable: true
      },
      listeners: {
        'input': this.checkPhone
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
      key: 'nickName',
      label: '用户姓名'
    },
    {
      key: 'mobile',
      label: '电话'
    },
    {
      key: 'officeName',
      label: '组织架构'
    },
    {
      key: 'roleName',
      label: '角色'
    },
    {
      key: 'status',
      label: '帐号状态',
      slot: true
    }
  ];
  private queryPage: IState = {
    page: 1,
    limit: 30
  };
  // 分页
  private page :PageObj= {
    page: 1,
    limit: 10,
    total: 0
  }

  get show() {
    return this.showDialog
  }
  get dialogTit() {
    return `当前角色：【${this.allowData.nick}】，请为该角色分配用户`
  }
  // 计算属性
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    return SettingsModule.tableHeight - 50
  }
  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

  @Watch('multipleSelection')
  columnsData(arr:object[]) {
    if (arr.length > 0) {
      this.canSumbit = false
    } else {
      this.canSumbit = true
    }
  }

  // 组织架构发生变化
  async handleOfficeIdChange(val:number[]) {
    this.listQuery.roleId = [{ roleId: [] }]
    let params:IState = GetRoleParamsByOfficeId(val, this.officeArr)
    try {
      this.roleArr = []
      let result = await GetDutyAndRoleList(params)
      this.roleArr.push(...result)
    } catch (err) {
      this.roleArr = []
    } finally {
      //
    }
  }
  checkPhone(value:string) {
    this.listQuery.phone = value.replace(/[^\d]/g, '')
  }
  openDio(value:any) {
    this.listQuery.sysType = this.$route.meta.sysType
    this.getOffice()
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getLists()
  }
  handleResetClick() {
    this.page.page = 1
    this.page.total = 0;
    (this.$refs['searchForm'] as any).resetForm()
    this.tableData.splice(0, this.tableData.length)
  }

  private disabledCheck(row:any, index:number) {
    let selfId = this.allowData.id
    let allIds = row.roleIds
    // let busi = this.allowData.busiType
    return !(allIds.includes(selfId))
  }

  // 分页
  private handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }

  private async getLists() {
    try {
      this.listLoading = true
      let params:IState = { ...this.page, officeId: [] }
      this.listQuery.nickName && (params.nickName = this.listQuery.nickName)
      this.listQuery.mobile && (params.mobile = this.listQuery.mobile)
      this.listQuery.officeId.length > 0 && (params.officeId.push(...this.listQuery.officeId))
      params.url = '/v3/base/user/page/list'
      Reflect.deleteProperty(params, 'total')
      const { data } = await GetUserListsV3(params)
      if (data.success) {
        this.tableData = data.data
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

  private handleSelectionChange(val:any) {
    this.multipleSelection = val
  }

  private async sendAllow() {
    try {
      let roleId = this.allowData.id
      let userIds = this.multipleSelection.map((ele:any) => {
        return ele.id
      })
      let params = { roleId, userIds }
      let { data: res } = await distributeRoleToUser(params)
      if (res.success) {
        this.$message.success('分配成功')
        this.show = false
      } else {
        this.$message.warning(res.errorMsg)
      }
      console.log(params)
    } catch (err) {
      console.log(err)
    }
  }
  // 编辑确认按钮
  confirm() {
    if (this.multipleSelection.length > 0) {
      this.sendAllow()
    } else {
      this.$message.warning('请先筛选出分配')
    }
  }
  // 取消按钮
  handleClosed() {
    (this.$refs['searchForm'] as any).resetForm()
    this.tableData.splice(0, this.tableData.length)
  }
  async getOffice() {
    try {
      let result = await GetOfficeByCurrentUser()
      this.officeArr.push(...result)
    } catch (err) {
      this.officeArr = []
    } finally {
      //
    }
  }
}
</script>
<style lang="scss" scoped>
.AllowDio {
  .btnPc {
    width: 100%;
    padding: 0 20%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
