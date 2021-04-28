<template>
  <div class="chauffeurTableContainer">
    <el-table
      ref="chauffeurTable"
      :data="_tableData"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      size="mini"
      row-key="id"
      :row-style="{height: '20px'}"
      fit
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="!isMore"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        min-width="70"
        class-name="firstColumn"
      >
        <template slot-scope="scope">
          <div class="arrow" />
          <!-- <div
            v-if="isShowPercent"
            class="percent"
          >
            匹配度{{ row.percent }}%
          </div> -->
          <template>
            {{ scope.$index + 1 | addZreo }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="基础信息"
        min-width="220"
        align="center"
      >
        <template slot-scope="{row}">
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
        min-width="150"
        align="center"
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
        min-width="240"
        align="center"
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
        min-width="160"
        align="center"
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
        min-width="200"
        align="center"
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
        min-width="100"
        align="center"
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
        min-width="160"
        align="center"
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
        min-width="150"
        align="center"
        fixed="right"
      >
        <template slot-scope="{row}">
          <p class="text">
            <el-button
              type="text"
              size="small"
              style="paddingBottom:0"
              @click.stop="handleCall(row)"
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
              @click.stop="handleTag(row)"
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
              @click.stop="handleDepart(row)"
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
              @click.stop="handleDetail(row)"
            >
              司机详情
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
              @click.stop="handleCreatRun(row)"
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
              @click.stop="handlePutLine(row)"
            >
              推线
            </el-button>
          </p>
          <p
            v-if="opType.includes(5)"
            class="text"
          >
            <el-button
              type="text"
              size="small"
              @click.stop="handleAllotSome(row)"
            >
              分配司撮
            </el-button>
          </p>
          <p
            v-if="opType.includes(6)"
            class="text"
          >
            <el-button
              type="text"
              size="small"
              @click.stop="handleChooseCity(row)"
            >
              更换工作城市
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
    <make-call
      ref="driverCall"
      :is-show-op="false"
      :phone="phone"
      :call-id="callId"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import MakeCall from '@/components/OutboundDialog/makeCall.vue'
const key = 'driver_row'
  interface IState {
    [key: string]: any;
  }
  @Component({
    name: 'chauffeurTable',
    components: {
      MakeCall
    },
    filters: {
      addZreo(val: string) {
        return +val > 9 ? val : `0${val}`
      }
    }
  })
export default class extends Vue {
    @Prop({ default: false }) isMore!: boolean;
    @Prop({ default: false }) isShowPercent!: boolean;
    @Prop({ default: () => {} }) listQuery!: IState;
    @Prop({ default: () => [] }) opType!: number[];
    @Prop({ default: () => [] }) driverTableData!: IState[];
    private phone:string = '15021578502'
    private callId:string = '123'

    get _tableData() {
      return this.driverTableData
    }
    set _tableData(val:IState[]) {
      this.$emit('update:driverTableData', val)
    }
    handleSelectionChange(val: IState[]) {
      this.$emit('checkData', val)
    }
    // 展开
    toogleExpand(row: IState) {
      let $table: any = this.$refs.chauffeurTable
      for (let i = 0; i < this._tableData.length; i++) {
        let item:IState = this._tableData[i]
        if ((row.id === item.id) && row.isOpen) {
          row.isOpen = false
          $table.toggleRowExpansion(item, false)
          return false
        } else {
          item.isOpen = false
          $table.toggleRowExpansion(item, false)
        }
      }
      row.isOpen = true
      $table.toggleRowExpansion(row, true)
    }
    // 外呼
    handleCall(row: IState) {
      this.$emit('call', row);
      (this.$refs.driverCall as any).handleCallClick()
    }
    // 打标签
    handleTag(row: IState) {
      this.$emit('tag', row)
    }
    // 撮合
    handleDepart(row: IState) {
      sessionStorage.setItem(key, JSON.stringify(row))
      this.$emit('depart', row)
    }
    // 查看详情
    handleDetail(row: IState) {
      this.$emit('detail', row)
    }
    // 创建试跑
    handleCreatRun(data: any) {
      this.$emit('creatRun', data)
    }
    // 推线
    handlePutLine(row: IState) {
      this.$emit('line', row)
    }
    // 分配司撮
    handleAllotSome(val: IState) {
      this.$emit('allotSome', val)
    }
    // 更换工作城市
    handleChooseCity(val: IState) {
      this.$emit('chooseCity', val)
    }
    // 抽屉内移出被匹配项(客邀列表是线路)的信息
    removeTableInfo() {
      sessionStorage.removeItem(key)
    }
    mounted() {
      if (this.isMore && !this.isShowPercent) {
        let str = sessionStorage.getItem(key) || ''
        if (str) {
          this._tableData = [JSON.parse(str)]
        }
      }
    }
}
</script>
<style lang="scss" scoped>
  .chauffeurTableContainer {
    .arrow {
      height: 0;
      border-top: 30px solid #f5a821;
      border-right: 30px solid transparent;
      border-left: 30px solid transparent;
      transform: rotate(135deg);
      position: absolute;
      top: -8px;
      left: -21px;
    }
    .arrow::after {
      content: "司";
      display: inline-block;
      position: relative;
      bottom: 30px;
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
    .phone {
      color: #888585;
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
  .text1 {
    font-size: 12px;
  }
  .chauffeurTableContainer >>> .firstColumn {
    overflow: hidden;
  }
</style>
