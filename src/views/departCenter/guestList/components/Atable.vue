<template>
  <div class="lineTableContainer">
    <el-table
      ref="lineTable"
      :data="_tableData"
      style="width: 100%"
      border
      stripe
      highlight-current-row
      size="mini"
      fit
    >
      <el-table-column
        label="基础信息"
        min-width="190"
        align="center"
        class-name="firstColumn"
      >
        <template slot-scope="scope">
          <div class="arrow" />
          <div
            v-if="isShowPercent"
            class="percent"
          >
            {{ scope.$index + 1 | addZreo }}
          </div>
          <div style="margin-left:50px;">
            <p
              class="text"
            >
              {{ scope.row.lineName }}
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
              >
                <div class="text1">
                  {{ scope.row.remark }}
                </div>
                <i
                  v-if="scope.row.isHot"
                  slot="reference"
                  class="el-icon-chat-dot-round"
                />
              </el-popover>
            </p>
            <p :class="obj.lineSaleName === scope.row.lineSaleName ? 'blue text' : 'text'">
              ({{ scope.row.lineSaleName }})
            </p>
            <p
              :class="obj.lineId === scope.row.lineId ? 'blue text' : 'text'"
            >
              {{ scope.row.lineId }}
            </p>
            <p
              class="text"
              :class="isMore && obj.c === scope.row.c ? 'blue text' : 'text'"
            >
              窗口期:剩余{{ _calcDay(scope.row) }}天
            </p>
            <p class="text scale">
              {{ scope.row.lineCreateDate | formatDate('YYYY-MM-DD HH:mm') }}创建
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
          <p
            class="text"
            :class="isMore && obj.carTypeValue === row.carType ? 'blue text' : 'text'"
          >
            {{ row.carTypeValue }}/{{ row.oilElectricityRequirementValue }}
          </p>
          <p
            class="text"
            :class="isMore && row.labelTypeHit ? 'blue text' : 'text'"
          >
            {{ row.isBehavior ===1 ? '能闯禁行' : '不能闯禁行' }}/{{ row.isRestriction ===1? '能闯限行':'不能闯限行' }}/{{ row.labelTypeValue }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="配送信息"
        min-width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :class="isMore && obj.provinceArea === row.warehouseCity ? 'blue text' : 'text'"
          >
            仓库位置:{{ row.warehouseProvince }}-{{ row.warehouseCity }}-{{ row.warehouseCounty }}
          </p>
          <p
            class="text"
            :class="isMore && obj.provinceArea === row.cityArea ? 'blue text' : 'text'"
          >
            配送区域:{{ row.provinceArea }}-{{ row.cityArea }}-{{ row.countyArea }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="结算"
        min-width="190"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :class="isMore && row.settlementCycleHit ? 'blue text' : 'text'"
          >
            单趟运费:{{ row.everyTripGuaranteed }}元/{{ row.dayNum }}趟/{{ row.monthNum }}天
          </p>
          <p
            class="text"
            :class="isMore && obj.m1 === row.shipperOffer ? 'blue text' : 'text'"
          >
            预计月运费:{{ row.shipperOffer }}元
          </p>
          <p class="text">
            结算周期/天数:{{ row.settlementCycleValue }}/{{ row.settlementDays }}天
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="线路特点"
        min-width="240"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :class="isMore && row.cargoTypeHit ? 'blue text' : 'text'"
          >
            货品:{{ row.cargoTypeValue }}
          </p>
          <p :class="isMore && row.handlingDifficultyHit ? 'blue text' : 'text'">
            装卸难度:{{ row.handlingDifficultyValue }}
          </p>
          <p
            class="text"
            :class="isMore && row.distributionWayHit ? 'blue text' : 'text'"
          >
            配送复杂度:{{ row.distributionWayValue }}
          </p>
          <p
            class="text"
            :class="isMore && row.workingHoursHit ? 'blue text' : 'text'"
          >
            工作时间段:<template v-if="row.workingHours&&row.workingHours.length >1">
              {{ row.workingHours[0] }}~{{ row.workingHours[1] }}
            </template>/
            <template v-if="row.lineCategory ===1">
              稳定/{{ row.stabilityRateValue }}
            </template>
            <template v-else>
              临时/{{ row.waitDirveValidity }}
            </template>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
        min-width="60"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            v-if="row.isHot === 1"
            class="text"
          >
            爆款
          </p>
          <p
            v-if="row.urgent"
            class="text"
          >
            客急
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="110"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
          >
            <template v-if="row.inviteCitys && row.inviteCitys.length > 3">
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
              >
                <div class="text">
                  {{ (row.inviteCitys || []).join('、') }}
                </div>
                <template slot="reference">
                  <span class="orange">{{ row.inviteCitys.length }}</span>个城市已客邀
                </template>
              </el-popover>
            </template>
            <template v-else>
              {{ (row.inviteCitys || []).join('、') }}已客邀
            </template>
          </p>
          <p
            v-if="row.currentCityInvite"
            class="text"
          >
            本城已客邀
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="110"
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
              v-if="isShowPercent"
              type="text"
              size="small"
              @click.stop="handleCreateTryRunClick(row)"
            >
              创建试跑意向
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
  name: 'lineTable',
  filters: {
    addZreo(val: string) {
      return +val > 9 ? val : `0${val}`
    }
  }
})
export default class extends Vue {
  @Prop({ default: false }) isMore!:boolean
  @Prop({ default: false }) isShowPercent!:boolean
  @Prop({ default: () => {} }) obj!:IState
  @Prop({ default: () => [] }) lineTableData!:IState[]

  get _tableData() {
    return this.lineTableData
  }
  set _tableData(val:IState[]) {
    this.$emit('update:lineTableData', val)
  }
  // 计算窗口期
  private _calcDay(row:IState) {
    let day = Number(row.recruitWindowPeriod)
    if (row.lineCreateDate && day) {
      return parseInt((new Date(row.lineCreateDate).getTime() + day * 3600 * 24 * 1000 - Date.now()) / (3600 * 24 * 1000) + '')
    } else {
      return 0
    }
  }

  // 展开
  toogleExpand(row:IState) {
    let $table:any = this.$refs.lineTable
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
  // 匹配撮合
  handleMatchClick(row:IState) {
    sessionStorage.setItem(key, JSON.stringify(row))
    this.$emit('match', row)
  }
  // 创建试跑意向
  handleCreateTryRunClick(row:IState) {
    this.$emit('tryRun', row)
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
  // 抽屉内移出被匹配项(客邀列表是线路)的信息
  removeTableInfo() {
    sessionStorage.removeItem(key)
  }
  // 从缓存获取
  getStorage() {
    let str = sessionStorage.getItem(key) || ''
    if (str) {
      this._tableData = [JSON.parse(str)]
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
      text-align: left;
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
    .orange {
      color:#f5a821;
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
