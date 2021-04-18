<template>
  <div class="statistic-container">
    <div class="left-container">
      <ul
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
      >
        <li
          v-for="i in count"
          :key="i"
          :class="itemIsClicked && itemClick === i ? 'item-clicked' : ''"
          @click="handleItemClick(i)"
        >
          FN2021-{{ i }}
        </li>
      </ul>
      <p v-if="loading">
        加载中...
      </p>
      <p v-if="noMore">
        没有更多了
      </p>
    </div>
    <div class="right-container">
      <section-container
        :title="`场次编号：202103020001`"
        :md="true"
      >
        <!-- 提示tips -->
        <div class="tips">
          <p>
            本场时间：2021-04-15 10:03:55-2021-04-15 10:03:55
          </p>
          <p>
            预计打分人数一共170人，已提交<span>20</span>人，未提交<span>150</span>人，其中：
          </p>
          <p>
            GMR（80%）预计打分6人，实际<span>6</span>人
          </p>
          <p>
            GMC（10%）预计打分50人，实际打分<span>49</span>人
          </p>
          <p>
            城市公共（10%）预计打分114人，实际打分<span>109</span>人
          </p>
        </div>
      </section-container>
      <!-- table表 -->
      <div class="table_box">
        <div class="head_title">
          场次：2021030100001
        </div>
        <el-table
          v-loading="listLoading"
          border
          :data="tableData"
        >
          <el-table-column
            align="center"
            prop="agentId"
          >
            <template
              slot="header"
            >
              <p>一级部门</p>
              <p>会计</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.agentId }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              slot="header"
            >
              <p>合计</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.lineName }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              slot="header"
            >
              <p>GMR（20%）</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.updateDate }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              slot="header"
            >
              <p>GMC（70%）</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.lineId }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
          >
            <template
              slot="header"
            >
              <p>GG（10%）</p>
              <p>100</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.updateName }}
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="page.total"
          :page="page.page"
          :limit="page.limit"
          :operation-list="[]"
          @pagination="handlePageSize"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { getFinishedLine } from '@/api/line-shelf'
import Pagination from '@/components/Pagination/index.vue'

interface PageObj {
  page: Number;
  limit: Number;
  total?: Number;
}
@Component({
  name: 'Statistic',
  components: {
    SectionContainer,
    Pagination
  }
})
export default class extends Vue {
  private count: number = 10
  private loading: boolean = false
  private itemIsClicked: boolean = false
  private itemClick: number = 1
  private listLoading: boolean = false
  private tableData: any[] = []
  private page: PageObj = {
    page: 1,
    limit: 10,
    total: 0
  }

  get noMore() {
    return this.count >= 50
  }

  get disabled() {
    return this.loading || this.noMore
  }
  // 加载左侧列表
  load() {
    this.loading = true
    setTimeout(() => {
      this.count += 10
      this.loading = false
    }, 1000)
  }

  // li点击事件
  handleItemClick(item: any) {
    this.itemIsClicked = true
    this.itemClick = item
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
            padding: 0;
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
</style>
