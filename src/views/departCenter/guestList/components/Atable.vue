<template>
  <div class="lineTableContainer">
    <el-table
      ref="lineTable"
      :data="tableData"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      size="mini"
      :row-style="{height: '20px'}"
      fit
      :header-cell-style="{padding: '6px 20px'}"
      :cell-style="{padding: '5px 20px'}"
    >
      <el-table-column
        min-width="70"
        label=""
        class-name="firstColumn"
      >
        <template slot-scope="scope">
          <div class="arrow" />
          <div
            v-if="isShowPercent"
            class="percent"
          >
            <template v-if="(scope.$index +1) > 9">
              {{ scope.$index +1 }}
            </template>
            <template v-else>
              {{ '0'+ (scope.$index + 1) }}
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="基础信息"
        min-width="220"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.a }}
          <el-popover
            placement="right"
            width="200"
            trigger="hover"
          >
            <div class="text1">
              这条线路是异常<el-button
                type="text"
                size="small"
              >
                火爆
              </el-button>,4.2厢货,场景简单,菜鸟也能干...
            </div>
            <i
              slot="reference"
              class="el-icon-chat-dot-round"
            />
          </el-popover>
          <p :class="obj.b === row.b ? 'blue text' : 'text'">
            ({{ row.b }})
          </p>
          <p
            :class="obj.lineId === row.lineId ? 'blue text' : 'text'"
          >
            {{ row.lineId }}
          </p>
          <p
            class="text"
            :class="obj.c === row.c ? 'blue text' : 'text'"
          >
            窗口期:剩余{{ row.c }}天
          </p>
          <p class="text scale">
            {{ row.createDate }}创建
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="车辆"
        min-width="150"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :class="obj.d === row.d ? 'blue text' : 'text'"
          >
            {{ row.d }}/{{ row.e }}
          </p>
          <p
            class="text"
            :class="obj.f === row.f ? 'blue text' : 'text'"
          >
            {{ row.f }}/{{ row.g }}/{{ row.h }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="配送信息"
        min-width="240"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :class="obj.p1 === row.p1 ? 'blue text' : 'text'"
          >
            仓库位置:{{ row.p1 }}-{{ row.c1 }}-{{ row.c2 }}
          </p>
          <p
            class="text"
            :class="obj.c1 === row.c1 ? 'blue text' : 'text'"
          >
            配送区域:{{ row.p1 }}-{{ row.c1 }}-{{ row.c2 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="结算"
        min-width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :class="obj.m1 === row.m1 ? 'blue text' : 'text'"
          >
            单趟运费:{{ row.m1 }}元
          </p>
          <p
            class="text"
            :class="obj.m1 === row.m1 ? 'blue text' : 'text'"
          >
            每日配送趟数:{{ row.m1 }}趟
          </p>
          <p
            class="text"
          >
            预计月出车天数:{{ row.m1 }}天
          </p>
          <p
            class="text"
            :class="obj.m1 === row.m1 ? 'blue text' : 'text'"
          >
            预计月运费:{{ row.m1 }}元
          </p>
          <p class="text">
            结算周期/天数:周结/7天
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="线路特点"
        min-width="260"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :class="obj.lineId === row.lineId ? 'blue text' : 'text'"
          >
            货品:食品/团购
          </p>
          <p class="text">
            装卸难度:只装不卸
          </p>
          <p
            class="text"
            :class="obj.lineId === row.lineId ? 'blue text' : 'text'"
          >
            配送复杂度:整车
          </p>
          <p
            class="text"
            :class="obj.time === row.time ? 'blue text' : 'text'"
          >
            工作时间段:{{ row.time }}/稳定/五个月
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
        min-width="100"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            v-if="row.a"
            class="text"
          >
            爆款
          </p>
          <p class="text">
            客急
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="160"
        align="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            <i
              class="el-icon-s-custom"
            /> 老张
          </p>
          <!-- <p
            v-if="row.a"
            class="text"
          >
            已上架
          </p> -->
          <p
            class="text"
            :a="row.a"
          >
            <template v-if="true">
              <span class="blue">3</span>个城市已客邀
            </template>
            <template v-else>
              天津已客邀
            </template>
          </p>
          <!-- <p class="text">
            待确认意向
          </p> -->
          <p class="text">
            本城已客邀
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="150"
        align="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            <el-button
              v-if="!isMore"
              type="text"
              size="small"
              @click.stop="handleMatchClick(row)"
            >
              匹配撮合
            </el-button>
          </p>
          <p class="text">
            <el-button
              type="text"
              size="small"
              @click.stop="handleDetailClick(row)"
            >
              查看线路详情
            </el-button>
          </p>
          <p
            v-if="isMore"
            class="text"
          >
            <el-button
              size="mini"
              @click.stop="toogleExpand(row)"
            >
              {{ row.isOpen ? '收起':'展开' }}详情<i :class="row.isOpen ?'el-icon-arrow-up':'el-icon-arrow-down'" />
            </el-button>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isMore"
        type="expand"
        width="1"
        class-name="expand"
      >
        <template slot-scope="{row}">
          <div class="item">
            <div class="title">
              项目信息:
            </div>
            <div class="content">
              <el-button
                v-for="item in row.arr"
                :key="item"
                size="mini"
                class="btn"
              >
                {{ item }}
              </el-button>
            </div>
          </div>
          <div class="item">
            <div class="title">
              配送信息:
            </div>
            <div class="content">
              <el-button
                v-for="item in row.brr"
                :key="item"
                size="mini"
                class="btn"
              >
                {{ item }}
              </el-button>
            </div>
          </div>
          <div class="item">
            <div class="title">
              撮合信息:
            </div>
            <div class="content">
              <el-button
                v-for="item in row.crr"
                :key="item"
                size="mini"
                class="btn"
              >
                {{ item }}
              </el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
const key = 'line_row'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'lineTable'
})
export default class extends Vue {
  @Prop({ default: false }) isMore!:boolean
  @Prop({ default: false }) isShowPercent!:boolean
  @Prop({ default: () => {} }) listQuery!:IState
  @Prop({ default: () => {} }) obj!:IState
  private tableData:IState[] = []
  // 展开
  toogleExpand(row:IState) {
    let $table:any = this.$refs.lineTable
    for (let i = 0; i < this.tableData.length; i++) {
      let item:IState = this.tableData[i]
      if ((row.id !== item.id)) {
        row.isOpen = false
        $table.toggleRowExpansion(item, false)
      } else if (row.isOpen) {
        row.isOpen = false
        $table.toggleRowExpansion(item, false)
        return false
      }
      row.isOpen = true
      $table.toggleRowExpansion(row)
    }
  }
  // 匹配撮合
  handleMatchClick(row:IState) {
    sessionStorage.setItem(key, JSON.stringify(row))
    this.$emit('match', row)
  }
  // 查看详情
  handleDetailClick(row:IState) {
    let { href } = this.$router.resolve({
      path: `/lineshelf/linedetail`,
      query: {
        id: 'XL202104250009'
      }
    })
    window.open(href, '_blank')
  }
  // 获取列表数据
  async getLists() {
    try {
      let num:number = 3
      if (this.isMore) {
        num = 1
      }
      this.tableData = []
      for (let i = 0; i < num; i++) {
        let obj:IState = {
          a: '京东传站',
          b: '李外线经理',
          lineId: 'XL202012300377',
          c: '3',
          d: '4.2米厢货',
          e: '油车',
          f: '能闯禁行',
          g: '能闯限行',
          h: '单肥',
          p1: '湖南省',
          c1: '长沙市',
          c2: '短沙县',
          m1: 500,
          time: '9:00~18:00',
          percent: 80,
          id: 1,
          arr: ['商贸信息', '已创建30条线路', '15条在跑', '5条线路已掉线', '3条线路在上架找车'],
          brr: ['1个点', '每日1趟', '每月12天', '每趟120公里', '走高速', '回单', '城配线', '稳定(2个月)'],
          crr: ['已发起3次客邀', '已创建意向3次', '试跑失败2次', '司机爽约1次', '扭头就走1次', '掉线1次'],
          createDate: '2021-04-15 12:00'
        }
        obj.isOpen = false
        obj.id = (i + 1)
        this.tableData.push({ ...obj })
      }
    } catch (err) {
      console.log(`get list fail fail:${err}`)
    } finally {
      (this.$parent as any).listLoading = false
    }
  }
  // 抽屉内移出被匹配项(客邀列表是线路)的信息
  removeTableInfo() {
    sessionStorage.removeItem(key)
  }
  mounted() {
    if (this.isMore && !this.isShowPercent) {
      let str = sessionStorage.getItem(key) || ''
      if (str) {
        this.tableData = [JSON.parse(str)]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .lineTableContainer {
    .arrow {
      height: 0;
      border-top: 30px solid #639DEC;
      border-right: 30px solid transparent;
      border-left:30px solid transparent;
      transform: rotate(135deg);
      position: absolute;
      top: -8px;
      left: -21px;
    }
    .arrow::after {
      content: "线";
      display: inline-block;
      position: relative;
      bottom: 30px;
      left: 5px;
      transform: rotate(-135deg);
      color: white;
    }
    .percent {
      position: absolute;
      top: 50px;
      left: 7px;
      font-size: 12px;
      color: #639DEC;
      text-align: center;
      width: 40px;
      line-height: 14px;
    }
    .text {
      margin:0px;
      color:#444444;
      font-size:12px;
      line-height: 20px;
      &.scale {
        margin-left: -50%;
        width: 200%;
        font-size:18px;
        transform: scale(0.5);
      }
    }
    .tip {
      margin:0px;
      font-size:20px;
      color:#999;
      transform: scaleY(0.5);
    }
    .el-icon-s-custom,
    .el-icon-chat-dot-round {
      color:#DBDDE1;
      font-size: 14px;
    }
    .el-icon-chat-dot-round {
      color:#ACC4E2;
      font-size: 18px;
      cursor: pointer;
    }
    .item {
      margin-top:10px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .title {
        margin-right: 20px;
        color:#464646;
        font-weight:bold;
        font-size:14px;
      }
      .btn {
        background: #F7F7F7;
        border-radius:6px;
      }
    }
    .blue {
      color:#639DEC
    }
  }
</style>

<style scoped>

.lineTableContainer >>> .expand .cell{
  padding: 0px!important;
}
.lineTableContainer >>> .firstColumn {
  overflow: hidden;
}

</style>

<style>
.text1 {
  font-size:12px;
}
</style>
