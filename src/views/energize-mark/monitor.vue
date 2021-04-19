<template>
  <div class="monitor-container">
    <!-- 提示tips -->
    <div class="tips">
      <p>
        场次：{{ scoreInfo.sessionId }}
      </p>
      <p>
        本场时间：{{ scoreInfo.startDate }}-{{ scoreInfo.endDate }}
      </p>
      <p>
        预计打分人数一共{{ scoreInfo.estimateAllScorer }}人，已提交<span>{{ scoreInfo.allSubmitted }}</span>人，未提交<span>{{ scoreInfo.allUnsubmitted }}</span>人，其中：
      </p>
      <p>
        GMR({{ scoreInfo.gmrWeight }})预计打分{{ scoreInfo.estimateScorerGmr }}人，实际<span>{{ scoreInfo.submittedScorerGmr }}</span>人
      </p>
      <p>
        GMC({{ scoreInfo.gmcWeight }})预计打分{{ scoreInfo.estimateScorerGmc }}人，实际打分<span>{{ scoreInfo.submittedScorerGmc }}</span>人
      </p>
      <p>
        城市公共({{ scoreInfo.cityWeight }})预计打分{{ scoreInfo.estimateScorerCity }}人，实际打分<span>{{ scoreInfo.submittedScorerCity }}</span>人
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
import { getScorerNum, getScoreStatusList } from '@/api/score'

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
    endDate: '',
    estimateAllScorer: '',
    allUnsubmitted: '',
    submittedScorerGmr: '',
    estimateScorerGmr: '',
    estimateScorerGmc: '',
    submittedScorerGmc: '',
    estimateScorerCity: '',
    submittedScorerCity: ''
  }
  mounted() {
    this.getList()
    this.getScorerNum()
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
        pageSize: this.page.limit,
        pageNum: this.page.page,
        sessionId: ''
      }

      let { data: res } = await getScoreStatusList(params)

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

  async getScorerNum() {
    let sessionId:string = ''
    let { data: res } = await getScorerNum(sessionId)
    if (res.success) {
      this.scoreInfo = res.data
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
