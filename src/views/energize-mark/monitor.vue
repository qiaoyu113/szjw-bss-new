<template>
  <div class="monitor-container">
    <!-- 提示tips -->
    <div class="tips">
      <p>
        场次：{{ scoreInfo.sessionId }}
      </p>
      <p>
        本场时间：2021-04-15 10:03:55-2021-04-15 10:03:55
      </p>
      <p>
        预计打分人数一共170人，已提交<span>20</span>人，未提交<span>150</span>人，其中：
      </p>
      <p>
        GMR(80%)预计打分6人，实际<span>6</span>人
      </p>
      <p>
        GMC(10%)预计打分50人，实际打分<span>49</span>人
      </p>
      <p>
        城市公共(10%)预计打分114人，实际打分<span>109</span>人
      </p>
    </div>
    <div class="table_box">
      <self-table
        v-loading="listLoading"
        :operation-list="[]"
        :index="false"
        :columns="columns"
        :table-data="tableData"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:lineName="scope">
          <span
            style="color:#649CEE"
            @click="goLineDteails(scope.row.lineId)"
          >{{ scope.row.lineName }}</span>
        </template>

        <template v-slot:agentStatus="scope">
          <span v-if="scope.row.agentStatus===1"> 已下架</span>
          <span v-if="scope.row.agentStatus===2"> 忽略</span>
          <span v-else />
        </template>

        <template v-slot:shelvesReasons="scope">
          <span v-if="scope.row.agentStatus!==1" />
          <el-tooltip
            v-else
            placement="top"
          >
            <div slot="content">
              {{ scope.row.shelvesReasons }}
            </div>
            <div class="ellipsis">
              {{ scope.row.shelvesReasons }}
            </div>
          </el-tooltip>
        </template>
      </self-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import { getFinishedLine } from '@/api/line-shelf'

interface PageObj {
  page: Number;
  limit: Number;
  total?: Number;
}
@Component({
  name: 'Monitor',
  components: {
    SelfTable
  }
})
export default class extends Vue {
  private listLoading: boolean = false
  private tableData: any[] = []
  private page: PageObj = {
    page: 1,
    limit: 10,
    total: 0
  }
  private columns: any[] = [
    {
      key: 'agentId',
      label: '姓名'
    },
    {
      key: 'lineName',
      label: '组织架构',
      slot: true
    },
    {
      key: 'lineId',
      label: '职务'
    },
    {
      key: 'updateName',
      label: '手机号'
    },
    {
      key: 'updateDate',
      label: '提交时间'
    },
    {
      key: 'bdProcessingStatusName',
      label: '提交状态'
    }
  ]

  private scoreInfo:any={
    sessionId: '',
    startDate: '',
    endDate: ''
  }
  mounted() {
    this.getList()
  }
  // 页数更改
  handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  // 获取新线维护列表
  async getList() {
    this.listLoading = true
    try {
      let params: any = {
        limit: this.page.limit,
        page: this.page.page,
        inspectionStatus: 4
      }

      let { data: res } = await getFinishedLine(params)

      if (res.success) {
        this.listLoading = false
        this.tableData = res.data
        this.page.total = res.page.total
      } else {
        this.$message.error('出错逻辑  tab详情页接口问题')
      }
    } catch (err) {
      console.log(`get lists fail:`, err)
    }
  }
}
</script>

<style lang="scss" scoped>
  .monitor-container {
    .tips {
    margin-top: 16px;
    margin-bottom: 16px;
    margin-left: 10px;
    p:nth-child(n+3) {
      margin: 0;
      padding: 0;
      line-height: 20px;
      span {
        color: #649CEE;
      }
    }
  }
    .table_box {
      margin: 0 10px;
      padding: 10px 30px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }

</style>
