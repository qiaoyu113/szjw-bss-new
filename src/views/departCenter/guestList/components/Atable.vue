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
        min-width="210"
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
          <div
            style="margin-left:50px;"
          >
            <p
              class="text"
            >
              {{ scope.row.lineName }}
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
                @show="handleHoverRemark(scope.row)"
              >
                <div class="text1">
                  <template>
                    {{ scope.row.remark }}
                  </template>
                </div>
                <div slot="reference">
                  <i
                    class="el-icon-chat-dot-round"
                  />
                </div>
              </el-popover>
            </p>
            <p :class="obj.lineSaleName === scope.row.lineSaleName ? 'blue text' : 'text'">
              {{ scope.row.lineSaleName | DataIsNull }}
            </p>
            <p
              :class="obj.lineId === scope.row.lineId ? 'blue text' : 'text'"
            >
              {{ scope.row.lineId }}
            </p>
            <p
              class="text"
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
          >
            <span :class="isShowPercent && obj.carType === row.carType ? 'blue' : ''">{{ row.carTypeValue | DataIsNull }}</span>/<span :class="isShowPercent && ((obj.oilElectricityRequirement === row.oilElectricityRequirement) || Number(row.oilElectricityRequirement) === 3) ? 'blue' : ''">{{ row.oilElectricityRequirementValue }}</span>
          </p>
          <p
            class="text"
          >
            <span :class="isShowPercent && ((row.isBehavior === 1) === obj.canBreakingNodriving) ? 'blue':''"> {{ row.isBehavior ===1 ? '能闯禁行' : '不能闯禁行' }}</span>/<span :class="isShowPercent && ((row.isRestriction ===1) === obj.canBreakingTrafficRestriction) ? 'blue':''">{{ row.isRestriction ===1? '能闯限行':'不能闯限行' }}</span>/<span :class="isShowPercent && row.labelTypeHit ? 'blue' : ''">{{ row.labelTypeValue }}</span>
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
          >
            仓库位置:<span :class="isShowPercent && obj.liveAddressCity === row.warehouseCity ? 'blue' : ''">{{ row.warehouseProvinceValue }}-{{ row.warehouseCityValue }}-{{ row.warehouseCountyValue }}</span>
          </p>
          <p
            class="text"
          >
            配送区域:<span :class="isShowPercent && obj.deliveryPointCity === row.cityArea ? 'blue' : ''">{{ row.provinceAreaValue }}-{{ row.cityAreaValue }}-{{ row.countyAreaValue || '全区域' }}</span>
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
          >
            单趟运费:{{ row.everyTripGuaranteed }}元/{{ row.dayNum }}趟/{{ row.monthNum }}天
          </p>
          <p
            class="text"
          >
            预计月运费:<span :class="isShowPercent && obj.m1 === row.shipperOffer ? 'blue' : ''">{{ row.shipperOffer }}元</span>
          </p>
          <p class="text">
            结算周期/天数:<span :class="isShowPercent && row.settlementCycleHit ? 'blue' : ''">{{ row.settlementCycleValue }}/{{ row.settlementDays }}天</span>
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
          >
            货品:<span :class="isShowPercent && row.cargoTypeHit ? 'blue' : ''">{{ row.cargoTypeValue | DataIsNull }}</span>
          </p>
          <p class="text">
            装卸难度:<span :class="isShowPercent && row.handlingDifficultyHit ? 'blue' : ''">{{ row.handlingDifficultyValue | DataIsNull }}</span>
          </p>
          <p
            class="text"
          >
            配送复杂度:<span :class="isShowPercent && row.distributionWayHit ? 'blue' : ''">{{ row.distributionWayValue | DataIsNull }}</span>
          </p>
          <p
            class="text"
          >
            工作时间段:<template v-if="row.workingTime">
              <span :class="isShowPercent && row.workingHoursHit ? 'blue':''">
                {{ row.workingTime }}
              </span>
            </template>/
            <span :class="isShowPercent && obj.lineCategory.includes(row.lineCategory) ? 'blue':''">
              <template v-if="row.lineCategory ===1">
                稳定/{{ row.stabilityRate }}
              </template>
              <template v-else>
                临时/{{ row.stabilityRate }}
              </template>
            </span>
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
            v-if="row.urgent ===1"
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
            <template v-if="row.inviteCitys && row.inviteCitys.length > 2">
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
            v-if="row.currentCityInvite ===1"
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
              v-permission="['/v3/line/shelf/menu']"
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
            <div
              v-if="row.projectInfo&&Array.isArray(row.projectInfo)"
              class="content"
            >
              <el-button
                v-for="item in row.projectInfo"
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
            <div
              v-if="row.distributionInfo&&Array.isArray(row.distributionInfo)"
              class="content"
            >
              <el-button
                v-for="item in row.distributionInfo"
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
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import { getLineDetail, getLineRemarks } from '@/api/departCenter'
const lineKey = 'line_row'
const driverKey = 'driver_row'
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
  @PropSync('lineTableData', { default: () => [] }) _tableData!:IState[]

  private obj:IState = {}
  // 计算窗口期
  private _calcDay(row:IState) {
    if (row.waitDirveValidity) {
      return parseInt((new Date(row.waitDirveValidity).getTime() - Date.now()) / (3600 * 24 * 1000) + '')
    } else {
      return 0
    }
  }

  // 展开
  async toogleExpand(row:IState) {
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
    await this.getLineDetailByLineId(row)
    $table.toggleRowExpansion(row, true)
  }
  // 匹配撮合
  handleMatchClick(row:IState) {
    sessionStorage.setItem(lineKey, JSON.stringify(row))
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
        id: row.lineId
      }
    })
    window.open(href, '_blank')
  }
  // 抽屉内移出被匹配项(客邀列表是线路)的信息
  removeTableInfo() {
    sessionStorage.removeItem(lineKey)
  }
  // 显示备注
  handleHoverRemark(row:IState) {
    if (!row.remark) {
      this.getLineRemark(row)
    }
  }
  // 获取线路备注
  async getLineRemark(row:IState) {
    try {
      this.$set(row, 'remark', '正在加载中....')
      let params:IState = {
        lineId: row.lineId,
        city: row.currentCityCode
      }
      let { data: res } = await getLineRemarks(params)
      if (res.success) {
        let remarks = res.data.remarks ? res.data.remarks : '暂无数据'
        this.$set(row, 'remark', remarks)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get line remark fail:${err}`)
    } finally {
      //
    }
  }
  // 从缓存获取
  getStorage() {
    let str = sessionStorage.getItem(lineKey) || ''
    if (str) {
      this._tableData = [JSON.parse(str)]
    }
  }
  // 从缓存获取司机信息
  getDriverInfoFromStorage() {
    let str = sessionStorage.getItem(driverKey) || ''
    if (str) {
      let obj:IState = JSON.parse(str) || {}
      this.obj = obj
    }
  }
  // 获取线路详情
  async getLineDetailByLineId(row:IState) {
    try {
      let params:IState = {
        lineId: row.lineId
      }
      let { data: res } = await getLineDetail(params)
      if (res.success) {
        let item:IState = res.data
        let projectInfo = []
        let distributionInfo = []
        projectInfo.push(item.projectName)
        projectInfo.push(`已创建${item.lineSumNum}条线路`)
        projectInfo.push(`${item.lineRunNum}条线路在跑`)
        projectInfo.push(`${item.lineRunOffShelfNum}条线路已掉线`)
        projectInfo.push(`${item.lineFindNum}条线路在上架找车`)
        distributionInfo.push(`${item.deliveryNum}个点`)
        distributionInfo.push(`每日${item.dayNum}趟`)
        distributionInfo.push(`每月${item.monthNum}天`)
        distributionInfo.push(`每趟${item.distance}公里`)
        if (item.runSpeed === 1) {
          distributionInfo.push(`走高速`)
        } else {
          distributionInfo.push(`不需要走高速`)
        }
        if (item.returnBill === 1) {
          distributionInfo.push(`回单`)
        } else {
          distributionInfo.push(`不需要回单`)
        }
        distributionInfo.push(item.lineTypeName)

        if (item.stabilityRate === 1) {
          distributionInfo.push(`稳定`)
        } else {
          distributionInfo.push(`临时${item.deliveryStartDate}/${item.deliveryEndDate}`)
        }
        this.$set(row, 'projectInfo', projectInfo)
        this.$set(row, 'distributionInfo', distributionInfo)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get line detail:${err}`)
    } finally {
      //
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
    .loading-left {
      margin-left:5px;
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
