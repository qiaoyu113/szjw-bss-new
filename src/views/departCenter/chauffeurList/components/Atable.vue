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
      fit
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="!isMore"
        type="selection"
        width="55"
      />

      <el-table-column
        label="基础信息"
        min-width="190"
        align="center"
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
          <div
            v-if="isShowPercent"
            class="percent"
          >
            {{ scope.$index + 1 | addZreo }}
          </div>
          <div style="margin-left:50px;">
            <p class="text">
              <span
                v-if="scope.row.needDone && !isMore"
                class="cycleTag"
              />
              <span
                :style="{fontWeight: (scope.row.needDone && !isMore ? 'bold' : 'normal')}"
                v-text="scope.row.driverName"
              />
              <span
                style="margin:0px 3px;"
                v-text="scope.row.workCityName"
              />
              <el-tooltip
                v-if="scope.row.workCityChangeLog && !isMore"
                effect="dark"
                :content="scope.row.workCityChangeLog"
                placement="top"
              >
                <i class="el-icon-refresh" />
              </el-tooltip>
            </p>
            <p class="text">
              <span>({{ scope.row.joinManagerName }})</span>
              <span v-if="!isMore">({{ scope.row.driverMatchManagerName }})</span>
            </p>
            <p class="text">
              {{ scope.row.driverId }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="车辆"
        min-width="170"
        align="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            <span
              :class="addClass(obj.carType,row.carType)"
              v-text="row.carTypeName"
            />/
            <span
              :class="addClass(obj.oilElectricityRequirementValue,row.isNewEnergy ? '电车' : '油车',3)"
              v-text="row.isNewEnergy ? '电车' : '油车'"
            />
          </p>
          <p class="text">
            <span :class="addClass(obj.isBehavior === 1,row.canBreakingNodriving)">
              {{ row.canBreakingNodriving?'能闯禁行':'不能闯禁行' }}
            </span>
            /
            <span :class="addClass(obj.isRestriction === 1,row.canBreakingTrafficRestriction)">
              {{ row.canBreakingTrafficRestriction?'能闯限行':'不能闯限行' }}
            </span>
            /
            <span :class="busiTypeClass(obj.labelTypeHit,row.carType)">
              {{ row.busiTypeName }}
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="地址信息"
        min-width="200"
        align="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            现居住地址:
            <span :class="addClass('canBreakingTrafficRestriction',row.canBreakingTrafficRestriction)">
              {{ row.liveAddressProvinceName }}
            </span> -
            <span>
              {{ row.liveAddressCityName }}
            </span> -
            <span>
              {{ row.liveAddressCountyName }}
            </span>
          </p>
          <p class="text">
            其他活仓地址:
            <span>
              {{ row.startingPointProvinceName }}
            </span> -
            <span>
              {{ row.startingPointCityName }}
            </span> -
            <span>
              {{ row.startingPointCountyName }}
            </span>
          </p>
          <p class="text">
            其他活配送点:
            <span>
              {{ row.deliveryPointProvinceName }}
            </span> -
            <span>
              {{ row.deliveryPointCityName }}
            </span> -
            <span>
              {{ row.deliveryPointCountyName }}
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="结算"
        min-width="130"
        align="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            运费趟:
            <span>{{ row.expectedFreightMonth }}元</span>
          </p>
          <p class="text">
            期望月:
            <span>{{ row.expectedFreightTrip }}元</span>
          </p>
          <p class="text">
            期望账期:
            <span>{{ row.expectAccountingPeriodName }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="线路忍耐度"
        min-width="180"
        align="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            期望货品:
            <span :class="addClass(obj.cargoTypeHit,row.intentCargoType)">{{ row.intentCargoTypeName }}</span>
          </p>
          <p class="text">
            期望装卸难度:
            <span :class="addClass(obj.handlingDifficultyHit,row.heavyLifting)">{{ row.heavyLiftingName }}</span>
          </p>
          <p class="text">
            期望类型:
            <span>{{ row.deliveryDifficultyNames }}</span>
          </p>
          <p class="text">
            工作时间段:{{ row.workHours.join(",") }}
          </p>
          <p class="text">
            期望稳定/临时:
            <span :class="addClass(obj.lineCategory === 1,row.canBreakingTrafficRestriction)">{{ row.expectStabilityTemporaryNames }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
        min-width="80"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :a="row"
          >
            {{ row.driverSituationName }}
          </p>
          <p class="text">
            {{ row.newDealName }}
          </p>
          <p
            v-if="row.isNovice"
            class="text"
          >
            小白司机
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="100"
        align="center"
      >
        <template slot-scope="{row}">
          <p
            class="text"
            :a="row"
          >
            {{ row.driverStatusName }}
          </p>
          <p class="text">
            在跟车{{ row.followCarNum }}个
          </p>
          <p class="text">
            在试跑{{ row.tryRunNum }}个
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="170"
        align="center"
        fixed="right"
      >
        <template slot-scope="{row}">
          <section class="opBox">
            <p class="text">
              <el-button
                type="text"
                size="small"
                @click.stop="handleCall(row)"
              >
                呼叫
              </el-button>
              <span class="phone">
                {{ row.phone }}
              </span>
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
              v-if="isMore"
              class="text"
            >
              <el-button
                size="mini"
                class="showMoreBtn"
                @click.stop="toogleExpand(row)"
              >
                {{ row.isOpen ? '收起':'展开' }}详情<i :class="row.isOpen ?'el-icon-arrow-up':'el-icon-arrow-down'" />
              </el-button>
            </p>
            <template v-if="!isMore">
              <p
                v-if="opType.includes(5)"
                class="text"
              >
                <el-button
                  v-if="!opType.includes(-1)"
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
            </template>
          </section>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isMore"
        type="expand"
        width="1"
        class-name="expand"
      >
        <template slot-scope="{row}">
          <div v-loading="listLoading">
            <div
              class="item"
              :a="row"
            >
              <div class="title">
                基础信息:
              </div>
              <div class="content">
                {{ `${unfoldData.age}岁/${unfoldData.drivingLicenceTypeName}本/${unfoldData.drivingExperience}年货运经验/${unfoldData.sourceChannelName}/成交:${unfoldData.driverPassTime}` }}
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
                  @click.stop="handleDetail(row)"
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
                {{ unfoldData.driverSituation }}
              </div>
            </div>
            <div class="item">
              <div class="title">
                备注信息:
              </div>
              <div class="content">
                {{ unfoldData.driverMatchRemarksName }}, {{ unfoldData.driverMatchManuallyRemarks }}
              </div>
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
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import MakeCall from '@/components/OutboundDialog/makeCall.vue'
import { unfoldDriverInfo } from '@/api/departCenter'
const driverKey = 'driver_row'
const lineKey = 'line_row'
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
  @PropSync('driverTableData', { default: () => [] }) _tableData!: IState[];

  private phone: string = '';
  private callId: string | number = '';
  private unfoldData: {} = {};
  private listLoading: boolean = true;
  private obj: IState = {};

  handleSelectionChange(val: IState[]) {
    this.$emit('checkData', val)
  }

  addClass(objData: any, rowData: any, otherData?:any) {
    if (this.isShowPercent) {
      return (objData === rowData || otherData === rowData) ? 'orange' : ''
    } else {
      return ''
    }
  }
  busiTypeClass(objData: any, rowData: any) {
    // <!-- 1:超肥 2:单肥 3:次肥 4:中瘦 5极瘦 -->
    if (this.isShowPercent) {
      if (rowData === 1) {
        return [3, 4, 5].includes(objData) ? 'orange' : ''
      } else if (rowData === 1) {
        return [1, 2, 3, 4, 5].includes(objData) ? 'orange' : ''
      }
    } else {
      return ''
    }
  }
  // 展开
  toogleExpand(row: IState) {
    let $table: any = this.$refs.chauffeurTable
    for (let i = 0; i < this._tableData.length; i++) {
      let item: IState = this._tableData[i]
      if (row.id === item.id && row.isOpen) {
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
    this.unfoldInfo(row.driverId)
  }
  async unfoldInfo(driverId: string) {
    try {
      this.listLoading = true
      let params = driverId
      let { data: res } = await unfoldDriverInfo(params)
      this.unfoldData = res.data
      this.listLoading = false
    } catch (err) {
      this.listLoading = false
      console.log(err)
    } finally {
      this.listLoading = false
    }
  }
  // 外呼
  handleCall(row: IState) {
    this.$emit('call', row)
  }
  // 调用外呼方法
  callPhone(phone: string, callId: string | number) {
    this.phone = phone
    this.callId = callId
    setTimeout(() => {
      (this.$refs.driverCall as any).handleCallClick()
    }, 20)
  }
  // 打标签
  handleTag(row: IState) {
    this.$emit('tag', row)
  }
  // 撮合
  handleDepart(row: IState) {
    sessionStorage.setItem(driverKey, JSON.stringify(row))
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
    sessionStorage.setItem(driverKey, JSON.stringify(row))
    let routeUrl = this.$router.resolve({
      path: '/depart/chauffeurList',
      query: { id: row.driverId }
    })
    window.open(routeUrl.href, '_blank')
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
    sessionStorage.removeItem(driverKey)
  }
  // 从缓存读取
  getStorage() {
    let str = sessionStorage.getItem(driverKey) || ''
    if (str) {
      let obj = JSON.parse(str) || {}
      this._tableData = [obj]
      this.obj = obj
    }
  }
  // 从缓存获取线路信息
  getLineInfoFromStorage() {
    let str = sessionStorage.getItem(lineKey) || ''
    if (str) {
      let obj: IState = JSON.parse(str) || {}
      this.obj = obj
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
    line-height: 20px;
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
    position: relative;
    text-align: left;
  }
  .phone {
    position: absolute;
    bottom: -5px;
    left: -8px;
    color: #888585;
    line-height: 12px;
    font-size: 12px;
    display: block;
    width: 85px;
    -webkit-transform: scale(0.8, 0.8);
    -moz-transform: scale(0.8, 0.8);
    transform: scale(0.8, 0.8);
  }
  .opBox {
    display: flex;
    flex-flow: column wrap;
    align-content: space-around;
    justify-items: flex-start;
    max-height: 120px;
    .text {
      width: 74px;
    }
    .showMoreBtn {
      padding: 7px;
    }
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
  .el-icon-refresh {
    color: red;
    font-size: 14px;
    vertical-align: middle;
  }
  .blue {
    color: #639dec;
  }
  .orange {
    color: #f5a821;
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
