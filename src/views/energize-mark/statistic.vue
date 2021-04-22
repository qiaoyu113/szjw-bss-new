<template>
  <div class="statistic-container">
    <div class="left-container">
      <ul>
        <li
          v-for="(item, index) in listData"
          :key="index"
          :class="itemIsClicked && itemClick === index ? 'item-clicked' : ''"
          @click="handleItemClick(item, index)"
        >
          {{ item.sessionId.slice(0, 8) }}
        </li>
      </ul>
      <p v-if="loading">
        加载中...
      </p>
      <!-- <p v-if="noMore">
        没有更多了
      </p> -->
    </div>
    <div class="right-container">
      <section-container
        :title="`场次编号：${scorerNumVO.sessionId}`"
        :md="true"
      >
        <!-- 提示tips -->
        <div class="tips">
          <p>
            本场时间：{{ scorerNumVO.startDate }}-{{ scorerNumVO.endDate }}
          </p>
          <p>
            预计打分人数一共{{ scorerNumVO.estimateAllScorer }}人，已提交<span>{{ scorerNumVO.allSubmitted }}</span>人，未提交<span>{{ scorerNumVO.allUnsubmitted }}</span>人，其中：
          </p>
          <p>
            GMR（{{ scorerNumVO.gmrWeight || '0' }}%）预计打分{{ scorerNumVO.estimateScorerGmr }}人，实际<span>{{ scorerNumVO.submittedScoreGmr }}</span>人
          </p>
          <p>
            GMC（{{ scorerNumVO.gmcWeight || '0' }}%）预计打分{{ scorerNumVO.estimateScoreGmc }}人，实际打分<span>{{ scorerNumVO.submittedScorerGmc }}</span>人
          </p>
          <p>
            城市公共（{{ scorerNumVO.cityPublicWeight || '0' }}%）预计打分{{ scorerNumVO.estimateScoreCity }}人，实际打分<span>{{ scorerNumVO.submittedScorerCity }}</span>人，抽取人数：<span>{{ scorerNumVO.cityPublicNum || '0' }}</span>人
          </p>
        </div>
      </section-container>
      <!-- table表 -->
      <div class="table_box">
        <div class="head_title">
          场次：{{ scorerNumVO.sessionId }}
        </div>
        <el-table
          v-loading="listLoading"
          border
          :data="reportOneLevelScoreVOS"
          :row-class-name="tableRowClassName"
        >
          <el-table-column
            align="center"
          >
            <template
              #header
            >
              <p>一级部门</p>
              <p>会计</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.deptName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              #header
            >
              <p>合计</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.totalScore }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              #header
            >
              <p>GMR（{{ scorerNumVO.gmrWeight }}%）</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.gmrScore }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              #header
            >
              <p>GMC（{{ scorerNumVO.gmcWeight }}%）</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.gmcScore }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              #header
            >
              <p>GG（{{ scorerNumVO.cityPublicWeight }}%）</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.cityPublicScore }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { getHistorySessionList, getReportInfo } from '@/api/score'

@Component({
  name: 'Statistic',
  components: {
    SectionContainer
  }
})
export default class extends Vue {
  private listData: any[] = []
  private loading: boolean = false
  private itemIsClicked: boolean = true
  private itemClick: number = 0
  private listLoading: boolean = false
  private scorerNumVO: object = {
    submittedScorerGmc: '',
    submittedScorerCity: '',
    submittedScoreGmr: '',
    startDate: '',
    sessionId: '',
    gmrWeight: '',
    gmcWeight: '',
    estimateScorerGmr: '',
    estimateScoreGmc: '',
    estimateScoreCity: '',
    estimateAllScorer: '',
    endDate: '',
    cityPublicWeight: '',
    cityPublicNum: '',
    allUnsubmitted: '',
    allSubmitted: ''
  }
  private reportOneLevelScoreVOS: any[] = []

  // 查询历史场次列表
  async getHistorySessionList() {
    this.loading = true
    try {
      let { data: res } = await getHistorySessionList()
      this.loading = false
      if (res.success) {
        this.listData = res.data
        this.getReportInfo(res.data[0].sessionId)
      }
    } catch (error) {
      this.loading = false
      console.log(`getHistorySessionList fail:`, error)
    }
  }

  // li点击事件
  handleItemClick(item: any, index: number) {
    this.itemIsClicked = true
    this.itemClick = index
    this.getReportInfo(item.sessionId)
  }

  mounted() {
    this.getHistorySessionList()
  }

  // 查询报表详情
  async getReportInfo(id: string) {
    this.listLoading = true
    try {
      let params: any = {
        sessionId: id
      }
      let { data: res } = await getReportInfo(params)
      this.listLoading = false
      if (res.success) {
        this.scorerNumVO = { ...this.scorerNumVO, ...res.data.reportScorerNumVO }
        // this.reportOneLevelScoreVOS = res.data.reportOneLevelScoreVOS
        let tableArr:any[] = []
        for (let i = 0; i < res.data.reportOneLevelScoreVOS.length; i++) {
          let item:any = res.data.reportOneLevelScoreVOS[i]
          let arr:any[] = []
          if (item.reportTwoLevelScoreVOS && item.reportTwoLevelScoreVOS.length > 0) {
            for (let j = 0; j < item.reportTwoLevelScoreVOS.length; j++) {
              let sub = item.reportTwoLevelScoreVOS[j]
              arr.push({
                deptName: sub.deptName,
                totalScore: sub.twoLevelTotalScore,
                gmrScore: sub.gmrScore,
                gmcScore: sub.gmcScore,
                cityPublicScore: sub.cityPublicScore
              })
            }

            tableArr.push(...arr)
            tableArr.push({
              deptName: item.deptName,
              totalScore: item.columnOneLevelTotalScore || 0,
              gmrScore: item.gmrOneLevelScore,
              gmcScore: item.gmcOneLevelScore,
              cityPublicScore: item.cityPublicOneLevelScore,
              flag: true
            })
          }
        }
        this.reportOneLevelScoreVOS = tableArr
      }
    } catch (err) {
      this.listLoading = false
      console.log(`getReportInfo fail:`, err)
    }
  }
  tableRowClassName({ row }:{row:any}) {
    if (row.flag) {
      return 'gray'
    }
    return ''
  }
}
</script>

<style lang="scss" scoped>
  .statistic-container {
    overflow: hidden;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    width: 100%;
    .left-container {
      height: 100%;
      min-width: 240px;
      width: 240px;
      overflow: auto;
      background: #d9deef;
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        li {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          height: 65px;
          text-align: center;
          margin: 0;
          padding: 0;
          line-height: 65px;
          color: #4A4A4A;
          font-size: 18px;
        }
        .item-clicked {
          background: #eff3fe;
        }
      }
      p {
        text-align: center;
      }
    }
    .right-container {
      overflow: auto;
      flex: 1;
      margin: 10px 10px 0;
      .SectionContainer {
        .tips {
          margin-left: 30px;
          p {
            margin-top: 0;
            color: #4A4A4A;
            font-size: 20px;
            font-family: 'PingFangSC-Medium';
            span {
                color: #FFCA73;
              }
          }
          p:nth-child(1) {
            color: #9B9B9B;
            font-size: 18px;
          }
          p:nth-child(n+3) {
            font-size: 22px;
            font-family: 'PingFangSC-Regular';
            margin: 0 0 10px 45px;
            padding: 1px;
            line-height: 20px;
          }
        }
      }
      .table_box {
        margin: 4px 0 0;
        padding: 10px 30px;
        background: #ffffff;
        -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
        box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
        overflow: hidden;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        .head_title {
          background: #F6F6F6;
          height: 60px;
          line-height: 60px;
          text-align: center;
          font-size: 18px;
          color: #333;
          font-family: 'PingFangSC-Semibold';
        }
        .el-table {
          th > .cell {
            p {
            margin: 0;
            padding: 0;
            }
          }
        }
      }
    }
  }
</style>

<style scoped>
  .statistic-container .right-container .SectionContainer >>> .title {
    border: 0;
    font-size: 22px;
    color: #4A4A4A;
    font-family: 'PingFangSC-Medium';
  }
  .statistic-container .right-container .SectionContainer >>> .context_d {
    padding: 0 30px 30px 0;
  }
  .statistic-container .right-container .table_box >>> .el-table th:nth-child(n+3) > .cell {
    transform: translateX(0);
  }
  .statistic-container .right-container .table_box >>> .el-table--border td {
    border-bottom: 0;
  }
  .table_box  >>> .gray {
    background:#d4dae9;
  }
</style>
