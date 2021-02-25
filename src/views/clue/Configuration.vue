<template>
  <div>
    <!-- 我是配置管理页面 -->
    <div class="table_box">
      <div class="middle" />
      <self-table
        ref="ConfigurationForm"
        :is-p30="false"
        :index="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        row-key="id"
        :page="page"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:op="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >
            调整干涉人
          </el-button>
          <el-button
            type="text"
            size="small"
          >
            调整分配人
          </el-button>
          <el-button
            type="text"
            size="small"
          >
            调整监督人
          </el-button>
          <el-button
            type="text"
            size="small"
          >
            设置policy
          </el-button>
        </template>
      </self-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import data from '../pdf/content'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Configuration',
  components: {
    SelfTable
  }
})
export default class extends Vue {
  private tableData:any[] = [];
  private multipleSelection: any[] = []
  private columns:any[] = [
    {
      key: 'city',
      label: '城市'
    },
    {
      key: 'customerSegmentNumber',
      label: '客群细分编号/业务线/客群类型',
      'width': '120px'
    },
    {
      key: 'targetPortraitTag',
      label: '目标画像标签'
    },
    {
      key: 'distributionMechanism',
      label: '分配机制'
    },
    {
      key: 'distributionMechanismAdmin',
      label: '分配机制管理员',
      'width': '120px'
    },
    {
      key: 'policyInterloper',
      label: 'policy干涉人'
    },
    {
      key: 'assigner',
      label: '分配人'
    },
    {
      key: 'superintendent',
      label: '监督人'
    },
    {
      key: 'remark',
      label: '备注'
    },
    {
      key: 'creator',
      label: '创建人'
    },
    {
      key: 'creationTime',
      label: '创建时间'
    },
    {
      key: 'recentNews',
      label: '最新动态'
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      'width': '300px',
      fixed: 'right'
    }
  ];
private page :PageObj= {
  page: 1,
  limit: 30,
  total: 0
}
// 分页
handlePageSize(page:PageObj) {
  this.page.page = page.page
  this.page.limit = page.limit
  // this.getLists()
}
handleSelectionChange(val:any) {
  this.multipleSelection = val
}
private handleClick(row:IState) {
}

data() {
  return {
    tableData: [{
      city: '1',
      customerSegmentNumber: '2',
      targetPortraitTag: '3',
      distributionMechanism: '4',
      distributionMechanismAdmin: '5',
      policyInterloper: '6',
      assigner: '7',
      superintendent: '8',
      remark: '9',
      creator: '10',
      creationTime: '11',
      recentNews: '12'
    }]
  }
}
}
</script>

<style lang="scss" scoped>
.table_box {
      padding: 0px 20px 20px 20px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
</style>
