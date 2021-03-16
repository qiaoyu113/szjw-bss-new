<template>
  <div>
    <div class="table_box">
      <div class="table-title">
        回流policy设置
      </div>
      <self-table
        ref="ConfigurationForm"
        :is-p30="false"
        :index="false"
        :table-data="tableData"
        :columns="columns"
        row-key="id"
        :page="page"
        :operation-list="[]"
        :default-sort="{prop: 'setDate', order: 'default'}"
        @onPageSize="handlePageSize"
        @sort-change="sortDate"
      >
        <template v-slot:op="scope">
          <el-button
            type="text"
            size="small"
            @click="setPolicyAuto(scope.row)"
          >
            设置回流policy
          </el-button>
        </template>
      </self-table>
    </div>
    <SetUpPolicy
      :visible.sync="showPolicy"
      :policy-data="policyData"
      @success="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SetUpPolicy from '../components/SetUpPolicy.vue'
import { getBackFlowPolicyList } from '@/api/clue'
import { OrderExport } from '@/api/join'
@Component({
  name: 'BackflowPolicy',
  components: {
    SelfTable,
    SetUpPolicy
  }
})
export default class extends Vue {
  tableData = []
  private page = {
    page: 1,
    limit: 30,
    total: 0
  }
  private columns: any[] = [
    {
      key: 'cityName',
      label: '城市'
    },
    {
      key: 'busiTypeName',
      label: '线索类型'
    },
    {
      key: 'updateName',
      label: '设置人',
      width: '120px'
    },
    {
      key: 'updateDate',
      label: '设置时间',
      attrs: {
        sortable: true
      }
    },
    {
      key: 'op',
      label: '操作',
      slot: true
    }
  ]
  policyData = {}
  showPolicy = false
  setPolicyAuto(item: any) {
    const object = {
      id: item.id,
      followedReflowedDayNum: item.followedReflowedDayNum,
      followingReflowedDayNum: item.followingReflowedDayNum
    }
    this.policyData = object
    this.showPolicy = true
  }
  mounted() {
    this.getList()
  }
  sortDate({ order }:any) {
    if (order) {
      order = order === 'ascending' ? '1' : '2'
    } else {
      order = ''
    }
    this.getList(undefined, order)
  }
  async getList(isReload?:boolean, order?:string) {
    if (isReload) {
      this.page.page = 1
      this.page.limit = 30
    }
    const params = {
      page: this.page.page,
      limit: this.page.limit,
      order: order || ''
    }
    try {
      const { data } = await getBackFlowPolicyList(params)
      if (!data.success) {
        return this.$message({
          type: 'error',
          message: data.errorMsg
        })
      }
      this.tableData = data.data
      this.page.total = data.page.total
    } catch (error) {
      return error
    }
  }
  handlePageSize(page:any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
}
</script>

<style scoped>
.table_box {
  padding: 10px 30px;
  margin-top: 15px;
  background: #ffffff;
  -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  overflow: hidden;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
.table-title {
  margin: 12px 0 20px 0;
  font-weight: 600;
}

</style>
