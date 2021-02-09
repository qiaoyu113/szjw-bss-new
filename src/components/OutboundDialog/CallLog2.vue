<template>
  <div class="callLog1">
    <h4>通话操作日志</h4>
    <self-table
      :indexes="true"
      :index="false"
      :is-p30="false"
      :operation-list="[]"
      :table-data="tableData"
      :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
      :columns="columns"
      :page="page"
      @onPageSize="handlePageSize"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'CallLog1',
  components: {
    SelfTable
  }
})
export default class extends Vue {
  private tableData:IState[] = [
    {}, {}
  ];
  private columns:IState[] = [
    {
      key: 'a',
      label: '邀约人',
      'width': '140px'
    },
    {
      key: 'b',
      label: '拨打状态',
      'width': '140px'
    },
    {
      key: 'c',
      label: '拨打时长',
      'width': '140px'
    },
    {
      key: 'd',
      label: '接通/挂断时间',
      'width': '140px'
    },
    {
      key: 'e',
      label: '通话录音文件',
      'width': '140px'
    },
    {
      key: 'f',
      label: '跟进情况',
      'width': '140px'
    },
    {
      key: 'g',
      label: '意向车型',
      'width': '140px'
    },
    {
      key: 'h',
      label: '备注',
      'width': '140px'
    }
  ];
  // 表格分页
  private page :PageObj= {
    page: 1,
    limit: 20,
    total: 0
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
  }
}
</script>
<style lang="scss" scoped>
  .callLog1 {
    padding: 30px 30px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
</style>
