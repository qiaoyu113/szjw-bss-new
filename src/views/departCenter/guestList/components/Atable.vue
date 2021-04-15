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
      row-key="id"
      :row-style="{height: '20px'}"
      fit
      :cell-style="{padding: '5px 0'}"
    >
      <el-table-column
        label="基础信息"
        width="180"
        class-name="center noP"
      >
        <template slot-scope="{row}">
          <div class="left">
            <div class="arrow" />
            <div class="name">
              线
            </div>
            <div
              v-if="isShowPercent"
              class="percent"
            >
              匹配度{{ row.percent }}%
            </div>
          </div>
          <div class="right">
            <router-link to="#">
              {{ row.a }}
            </router-link>
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
            <p class="text">
              ({{ row.b }})
            </p>
            <p class="text">
              {{ row.lineId }}
            </p>
            <p class="text">
              窗口期:剩余{{ row.c }}天
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="车辆"
        width="180"
        class-name="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            {{ row.d }}/{{ row.e }}
          </p>
          <p class="text">
            {{ row.f }}/{{ row.g }}/{{ row.h }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="配送信息"
        width="200"
        class-name="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            仓地址:{{ row.p1 }}-{{ row.c1 }}-{{ row.c2 }}
          </p>
          <p class="text">
            配送区域:{{ row.p1 }}-{{ row.c1 }}-{{ row.c2 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="结算"
        width="180"
        class-name="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            趟运费:{{ row.m1 }}元
          </p>
          <p class="text">
            预计月运费:{{ row.m1 }}元
          </p>
          <p class="text">
            结算周期:周结
          </p>
          <p class="text">
            结算天数:7天
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="线路特点"
        width="180"
        class-name="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            货品:食品/团购
          </p>
          <p class="text">
            装卸难度:只装不卸
          </p>
          <p class="text">
            配送类型:整车
          </p>
          <p class="text">
            工作时间段:{{ row.time }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
        width="120"
        class-name="center"
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
          <p class="text">
            客邀线
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="120"
        class-name="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            <i
              class="el-icon-s-custom"
            /> 老张
          </p>
          <p
            v-if="row.a"
            class="text"
          >
            已上架
          </p>
          <p class="text">
            已发起客邀
          </p>
          <p class="text">
            待确认意向
          </p>
          <p class="text">
            客邀成功
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        class-name="center"
        fixed="right"
      >
        <template slot-scope="{row}">
          <p class="text">
            <el-button
              v-if="isMore&&row.a"
              type="text"
              size="small"
            >
              匹配撮合
            </el-button>
          </p>
          <p class="text">
            <el-button
              type="text"
              size="small"
              @click.stop="handleCreateTruRun"
            >
              创建意向
            </el-button>
          </p>
          <p class="text">
            <el-button
              type="text"
              size="small"
              @click.stop="handleCancelTruRun"
            >
              取消意向
            </el-button>
          </p>
          <p class="text">
            <el-button
              type="text"
              size="small"
            >
              查看详情
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
  private tableData:IState[] = [
    {
      a: '京东传站',
      b: '李外线经理',
      lineId: 'XL202012300377',
      c: '3',
      d: '4.2米厢货',
      e: '油车',
      f: '能闯禁行',
      g: '能闯限行行',
      h: '共享',
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
      isOpen: false
    }
  ]
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
  // 创建意向
  handleCreateTruRun() {
    this.$emit('tryRun')
  }
  // 取消意向
  handleCancelTruRun() {
    this.$emit('cancelTryRun')
  }
}
</script>
<style lang="scss" scoped>
  .lineTableContainer {
    .left {
      width: 50px;
      .arrow {
        height: 0;
        border-top: 30px solid #639DEC;
        border-right: 30px solid transparent;
        border-left:30px solid transparent;
        transform: rotate(135deg);
        position: absolute;
        top: -5px;
        left: -20px;
      }
      .name {
        font-size: 12px;
        color: #fff;
        position: relative;
        top: -40px;
        left: -16px;
      }
    }
    .percent {
      position: absolute;
      top: 35px;
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
  }
</style>

<style scoped>
.lineTableContainer >>> .center {
  text-align: center;
}
.lineTableContainer >>> .noP {
  padding: 0px!important;
  position: relative;
}
.lineTableContainer >>> .expand .cell{
  padding: 0px!important;
}
.lineTableContainer >>> .noP .cell {
  display: flex;
  align-items: center;
  padding: 0px!important;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  text-align: center;
  width: 100%;
}
</style>

<style>
.text1 {
  font-size:12px;
}
</style>
