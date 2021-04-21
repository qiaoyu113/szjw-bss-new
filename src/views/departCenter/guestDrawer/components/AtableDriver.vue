<template>
  <div class="chauffeurTableContainer">
    <el-table
      ref="chauffeurTable"
      :data="tableData"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      size="mini"
      row-key="id"
      :row-style="{height: '20px'}"
      fit
      :cell-style="{padding: '5px 20px'}"
      :header-cell-style="{padding: '6px 20px'}"
    >
      <el-table-column
        label="基础信息"
        align="center"
      >
        <template slot-scope="{row}">
          <div class="arrow" />
          <!-- <div
            v-if="isShowPercent"
            class="percent"
          >
            匹配度{{ row.percent }}%
          </div> -->
          <div style="textAlign:center">
            <p class="text">
              <span class="cycleTag" />
              <span
                :style="{fontWeight: (!isShowPercent ? 'bold' : 'normal')}"
                v-text="row.driverName"
              />
            </p>
            <p
              class="text"
              v-text="`(${row.manager})`"
            />
            <p class="text">
              {{ row.driverId }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="车辆"
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
        label="地址信息"
      >
        <template slot-scope="{row}">
          <p class="text">
            现居住地址:{{ row.p1 }}-{{ row.c1 }}-{{ row.c2 }}
          </p>
          <p class="text">
            其他活仓地址:{{ row.p1 }}-{{ row.c1 }}-{{ row.c2 }}
          </p>
          <p class="text">
            其他活配送点:{{ row.p1 }}-{{ row.c1 }}-{{ row.c2 }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="结算"
      >
        <template slot-scope="{row}">
          <p class="text">
            运费趟:{{ row.m1 }}元
          </p>
          <p class="text">
            期望月:{{ row.m1 }}元
          </p>
          <p class="text">
            期望账期:现结/周结
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="线路忍耐度"
      >
        <template slot-scope="{row}">
          <p class="text">
            期望货品:食品/团购
          </p>
          <p class="text">
            期望装卸难度:只装不卸
          </p>
          <p class="text">
            期望类型:整车
          </p>
          <p class="text">
            工作时间段:{{ row.time }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :a="row"
          >
            着急试跑
          </p>
          <p class="text">
            本月首岗
          </p>
          <p class="text">
            小白司机
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :a="row"
          >
            已上岗
          </p>
          <p class="text">
            在跟车一个
          </p>
          <p class="text">
            在试跑一个
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        fixed="right"
      >
        <template
          slot-scope="{row}"
          :a="row"
        >
          <p class="text">
            <el-button
              type="text"
              size="small"
              style="paddingBottom:0"
              @click.stop="handleCall"
            >
              呼叫
            </el-button>
            <section class="phone">
              18848885135
            </section>
          </p>
          <p class="text">
            <el-button
              type="text"
              size="small"
              @click.stop="handleTag"
            >
              打标签
            </el-button>
          </p>
          <!-- type="1" -->
          <p
            v-if="opType.includes(1)"
            class="text"
          >
            <el-button
              type="text"
              size="small"
              @click.stop="handleDepart"
            >
              匹配撮合
            </el-button>
          </p>
          <!-- type="2" -->
          <p
            v-if="opType.includes(2)"
            class="text"
          >
            <el-button
              type="text"
              size="small"
              @click.stop="handleDetail"
            >
              查看详情
            </el-button>
          </p>
          <!-- type="3" -->
          <p
            v-if="opType.includes(3)"
            class="text"
          >
            <el-button
              type="text"
              size="small"
              @click.stop="handleCreatRun"
            >
              创建试跑意向
            </el-button>
          </p>
          <!-- type="4" -->
          <p
            v-if="opType.includes(4)"
            class="text"
          >
            <el-button
              type="text"
              size="small"
              @click.stop="handlePutLine"
            >
              推线
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
          <div
            class="item"
            :a="row"
          >
            <div class="title">
              基础信息:
            </div>
            <div class="content">
              40岁/A1本/5年货运经验/58同城/成交：2020-01-01
            </div>
          </div>
          <div class="item">
            <div class="title">
              试跑信息:
            </div>
            <div class="content">
              <el-button
                size="mini"
                type="text"
              >
                立即查看
              </el-button>
            </div>
          </div>
          <div class="item">
            <div class="title">
              司机状态:
            </div>
            <div class="content">
              着急试跑
            </div>
          </div>
          <div class="item">
            <div class="title">
              备注信息:
            </div>
            <div class="content">
              司机有贷款压力，不怕累活，不是稳定活不接受
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
  name: 'chauffeurTable'
})
export default class extends Vue {
  @Prop({ default: false }) isMore!: boolean;
  @Prop({ default: false }) isShowPercent!: boolean;
  @Prop({ default: () => {} }) listQuery!: IState;
  @Prop({ default: () => [] }) opType!: number[];
  private tableData: IState[] = [
    {
      driverName: '张道松',
      manager: '李加盟经理',
      driverId: 'SJ20210415',
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
      arr: [
        '商贸信息',
        '已创建30条线路',
        '15条在跑',
        '5条线路已掉线',
        '3条线路在上架找车'
      ],
      brr: [
        '1个点',
        '每日1趟',
        '每月12天',
        '每趟120公里',
        '走高速',
        '回单',
        '城配线',
        '稳定(2个月)'
      ],
      crr: [
        '已发起3次客邀',
        '已创建意向3次',
        '试跑失败2次',
        '司机爽约1次',
        '扭头就走1次',
        '掉线1次'
      ],
      isOpen: false
    }
  ];
  // 展开
  toogleExpand(row: IState) {
    let $table: any = this.$refs.chauffeurTable
    for (let i = 0; i < this.tableData.length; i++) {
      let item: IState = this.tableData[i]
      if (row.id !== item.id) {
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
  // 外呼
  handleCall() {
    this.$emit('call')
  }
  // 打标签
  handleTag() {
    this.$emit('tag')
  }
  // 撮合
  handleDepart() {
    this.$emit('depart')
  }
  // 查看详情
  handleDetail() {
    this.$emit('detail')
  }
  // 创建试跑
  handleCreatRun() {
    this.$emit('creatRun')
  }
  // 推线
  handlePutLine() {
    this.$emit('line')
  }
}
</script>
<style lang="scss" scoped>
.chauffeurTableContainer {
  .arrow {
    height: 0;
    border-top: 40px solid #f5a821;
    border-right: 40px solid transparent;
    border-left: 40px solid transparent;
    transform: rotate(135deg);
    position: absolute;
    top: -10px;
    left: -30px;
  }
  .arrow::after {
    content: "司";
    display: inline-block;
    position: relative;
    bottom: 35px;
    left: 5px;
    transform: rotate(-135deg);
    color: white;
  }
  .cycleTag {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 6px;
    border-radius: 50%;
    background-color: #649cee;
  }
  .percent {
    position: absolute;
    top: 50%;
    bottom: 50%;
    left: 7px;
    font-size: 12px;
    color: #f5a821;
    text-align: center;
    width: 42px;
    line-height: 16px;
  }
  .text {
    margin: 0px;
    color: #444444;
    font-size: 12px;
    line-height: 20px;
  }
  .phone{
    color:#888585;
    line-height: 12px;
  }
  .tip {
    margin: 0px;
    font-size: 20px;
    color: #999;
    transform: scaleY(0.5);
  }
  .el-icon-s-custom,
  .el-icon-chat-dot-round {
    color: #dbdde1;
    font-size: 14px;
  }
  .el-icon-chat-dot-round {
    color: #acc4e2;
    font-size: 18px;
    cursor: pointer;
  }
  .item {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .title {
      margin-right: 20px;
      color: #464646;
      font-weight: bold;
      font-size: 14px;
    }
    .btn {
      background: #f7f7f7;
      border-radius: 6px;
    }
  }
}
</style>

<style scoped>
</style>

<style>
.text1 {
  font-size: 12px;
}
</style>
