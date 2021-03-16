<template>
  <div :class="isPC ? 'RoleManage' : 'RoleManage-m'">
    123
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SuggestContainer from '@/components/SuggestContainer/index.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { roleList, createRole, updateRole, deleteRole } from '@/api/system'
import Pagination from '@/components/Pagination/index.vue'
import { HandlePages } from '@/utils/index'

import { SettingsModule } from '@/store/modules/settings'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}

@Component({
  name: 'RoleManage',
  components: {
    SuggestContainer,
    TableHeader,
    Pagination
  }
})
export default class extends Vue {
  private loading: boolean = false;
  private tags: any[] = [];
  private tab: any[] = [
    {
      label: '角色管理',
      name: '0'
    }
  ];
  private dropdownList: any[] = [
    '名称',
    '描述',
    '职责',
    '人数',
    '操作'
  ];
  private checkList: any[] = this.dropdownList;
  // table
  private total = 0;
  private list: any[] = [];
  private page: Object | undefined = '';
  private listLoading = false;
  private listQuery: IState = {
    page: 1,
    limit: 30
  };
  // Watch
  @Watch('checkList', { deep: true })
  private onval(value: any) {
    this.$nextTick(() => {
      ((this.$refs['multipleTable']) as any).doLayout()
    })
  }
  // 计算属性
  get isPC() {
    return SettingsModule.isPC
  }
  get tableHeight() {
    return SettingsModule.tableHeight + 110
  }
  // 事件处理
  // 处理tags方法
  // 所有请求方法
  private fetchData() {
    this.getList(this.listQuery)
  }
  // button
  // 添加明细原因 row 当前行 column 当前列
  private tableClick(row: any, column: any, cell: any, event: any) {}
  // 请求列表
  private async getList(value: any) {
    this.listLoading = true
    this.listQuery.page = value.page
    this.listQuery.limit = value.limit
    const { data } = await roleList(this.listQuery)
    this.listLoading = false
    if (data.success) {
      this.list = data.data
      data.page = await HandlePages(data.page)
      this.total = data.page.total
    } else {
      this.$message.error(data)
    }
  }
  private goCreateUser() {
    this.$router.push({ name: 'CreateRole' })
  }
  private editRole(row: any) {
    this.$router.push({ name: 'EditRole', query: { id: row.id } })
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
        this.getList(this.listQuery)
      } else {
        this.$message.error(data)
      }
    })
  }
  private goDetails(row: any) {
    this.$router.push({ name: 'RoleDetails', query: { id: row.id } })
  }
  mounted() {
    this.fetchData()
  }
  activated() {
    this.$nextTick(() => {
      ((this.$refs['multipleTable']) as any).doLayout()
    })
  }
}
</script>
<style lang="scss" scoped>
.RoleManage {
  padding: 15px;
  padding-bottom: 0;
  box-sizing: border-box;
  .table_box {
    background: #ffffff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    transform: translateZ(0);
    .table_center {
      padding: 0 30px;
      box-sizing: border-box;
      background: #ffffff;
    }
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
