<template>
  <div class="AllowDio">
    <SelfDialog
      :visible.sync="show"
      :title="dialogTit"
      :confirm="confirm"
      top="5vh"
      width="80%"
      :sumbit-again="submitLoading"
      :destroy-on-close="true"
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
          @onPageSize="handlePageSize"
          @selection-change="handleSelectionChange"
        >
          <template v-slot:createDate="scope">
            {{ scope.row.createDate }}
          </template>
          <template v-slot:op="scope">
            <el-button
              type="text"
              :disabled="!isCanallocation"
              @click="handleAllotClick(scope.row)"
            >
              分配
            </el-button>
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
import { roleList } from '@/api/system'
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
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ required: false }) showDialog!: boolean;
  @Prop({ default: {} }) allowData!: IState;

  private pageSize:number[] = [10, 20, 50, 100, 150, 200]
  private listLoading: boolean = true;
  private submitLoading: boolean = false;
  private tableData:IState = []
  private multipleSelection: any[] = []; // 当前页选中的数据
  private listQuery: IState = {
    name: '',
    phone: ''
  };
  private formItem: IState[] = [
    {
      type: 1,
      label: '用户姓名',
      key: 'name',
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
      key: 'phone',
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
      key: 'description',
      label: '电话'
    },
    {
      key: 'dutyName',
      label: '组织架构'
    },
    {
      key: 'usedUserCount',
      label: '角色'
    },
    {
      key: 'user',
      label: '用户状态'
    },
    {
      key: 'account',
      label: '帐号状态'
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
    return `当前角色：【${this.allowData.nickName}】，请为该角色分配用户`
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
  checkPhone(value:string) {
    this.listQuery.phone = value.replace(/[^\d]/g, '')
  }
  openDio(value:any) {
    if (this.show) this.getLists()
  }
  // 查询
  handleFilterClick() {}
  handleResetClick() {
    (this.$refs['searchForm'] as any).resetForm()
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
      let params = { ...this.listQuery, ...this.page }
      const { data } = await roleList(params)
      this.listLoading = false
      if (data.success) {
        this.tableData = data.data
        data.page = await HandlePages(data.page)
        this.page.total = data.page.total
      } else {
        this.$message.error(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  private handleSelectionChange(val:any) {
    this.multipleSelection = val
  }
  // 编辑确认按钮
  confirm() {
    console.log('confirm')
  }
  // 取消按钮
  handleClosed() {
    console.log('cancel')
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
