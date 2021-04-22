<template>
  <div class="monitor-container">
    <!-- 提示tips -->
    <div class="tips">
      <p>
        场次：{{ scoreInfo.sessionId || '-' }}
      </p>
      <p>
        本场时间：{{ scoreInfo.startDate }}-{{ scoreInfo.endDate }}
      </p>
      <p>
        预计打分人数一共{{ scoreInfo.estimateAllScorer || '0' }}人，已提交<span>{{ scoreInfo.allSubmitted || '0' }}</span>人，未提交<span>{{ scoreInfo.allUnsubmitted || '0' }}</span>人，其中：
      </p>
      <p>
        GMR({{ scoreInfo.gmrWeight || '0' }}%)预计打分{{ scoreInfo.estimateScorerGmr || '0' }}人，实际<span>{{ scoreInfo.submittedScorerGmr || '0' }}</span>人
      </p>
      <p>
        GMC({{ scoreInfo.gmcWeight || '0' }}%)预计打分{{ scoreInfo.estimateScorerGmc || '0' }}人，实际打分<span>{{ scoreInfo.submittedScorerGmc || '0' }}</span>人
      </p>
      <p>
        城市公共({{ scoreInfo.cityWeight || '0' }}%)预计打分{{ scoreInfo.estimateScorerCity || '0' }}人，实际打分<span>{{ scoreInfo.submittedScorerCity || '0' }}</span>人
      </p>
    </div>
    <div class="table_box">
      <self-table
        :operation-list="[]"
        :index="false"
        :columns="columns"
        :table-data="tableData"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:officeName="scope">
          <span
            style="color:#649CEE"
          >{{ scope.row.officeName }}</span>
        </template>
        <template v-slot:commitDate="scope">
          <span v-if="scope.row.commitDate">{{ scope.row.commitDate }}</span>
          <span v-else />
        </template>

        <template v-slot:status="scope">
          <span
            v-if="scope.row.status === 1"
            style="color:green"
          >已提交</span>
          <span
            v-else
            style="color:red"
          >未提交</span>
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
      key: 'personName',
      label: '姓名'
    },
    {
      key: 'officeName',
      label: '组织架构',
      slot: true
    },
    {
      key: 'roleName',
      label: '职务'
    },
    {
      key: 'mobile',
      label: '手机号'
    },
    {
      key: 'commitDate',
      label: '提交时间',
      slot: true
    },
    {
      key: 'status',
      label: '提交状态',
      slot: true
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
  private timer: any = ''

  mounted() {
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.getList()
      this.getScorerNum()
      this.timer = setInterval(() => {
        this.getList()
        this.getScorerNum()
        console.log('mounted定时触发了')
      }, 3000)
    }
  }
  destroyed() {
    clearInterval(this.timer)
  }
  beforeRouteLeave(to:any, from:any, next:Function) {
    console.log('')
    clearInterval(this.timer)
    next()
  }
  // 页数更改
  handlePageSize(page: any) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  // 获取list
  async getList() {
    this.listLoading = true
    try {
      let params: any = {
        pageNum: this.page.page,
        pageSize: this.page.limit
      }

      let { data: res } = await getScoreStatusList(params)
      if (res.success) {
        if (res.data) {
          this.listLoading = false
          this.tableData = res.data
          this.page.total = res.page.total
        }
      }
    } catch (err) {
      console.log(`getScoreStatusList fail:`, err)
    }
  }

  async getScorerNum() {
    let { data: res } = await getScorerNum()
    if (res.success) {
      if (res.data) {
        this.scoreInfo = res.data
      }
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
