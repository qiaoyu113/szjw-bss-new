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
      row-key="driverId"
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
                class="changeCity"
              >
                <i class="el-icon-refresh" />
              </el-tooltip>
            </p>
            <p class="text">
              <span>({{ `${scope.row.joinManagerName}加盟经理` }})</span>
              <br>
              <span v-if="!isMore && scope.row.driverMatchManagerId">({{ `${scope.row.driverMatchManagerName}司撮经理` }})</span>
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
              :class="addClass(obj.oilElectricityRequirementValue,row.oilElectricityRequirement === 1 ? '油车' : '电车','均可')"
              v-text="row.oilElectricityRequirement === 1 ? '油车' : '电车'"
            />
          </p>
          <p class="text">
            <span :class="addClass(obj.isBehavior === 1,row.canBreakingNodriving,true)">
              {{ row.canBreakingNodriving === null ? '暂无数据' : (row.canBreakingNodriving?'能闯禁行':'不能闯禁行') }}
            </span>
            /
            <span :class="addClass(obj.isRestriction === 1,row.canBreakingTrafficRestriction,true)">
              {{ row.canBreakingTrafficRestriction === null ? '暂无数据' : (row.canBreakingTrafficRestriction?'能闯限行':'不能闯限行') }}
            </span>
            /
            <span :class="hitClass(row.busiTypeHit)">
              {{ row.busiTypeName }}
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="地址信息"
        min-width="220"
        align="center"
      >
        <template slot-scope="{row}">
          <p class="text">
            现居住地址:
            <span
              v-if="row.liveAddressProvince && row.liveAddressCity && row.liveAddressCounty"
              :class="cityClass(row.liveAddressCity)"
            >
              <span>
                {{ row.liveAddressProvinceName }}
              </span> -
              <span>
                {{ row.liveAddressCityName }}
              </span> -
              <span>
                {{ row.liveAddressCountyName }}
              </span>
            </span>
          </p>
          <p class="text">
            其他活仓地址:
            <span
              v-if="row.startingPointProvince && row.startingPointCity && row.startingPointCounty"
              :class="cityClass(row.startingPointCity)"
            >
              <span>
                {{ row.startingPointProvinceName }}
              </span> -
              <span>
                {{ row.startingPointCityName }}
              </span> -
              <span>
                {{ row.startingPointCountyName }}
              </span>
            </span>
          </p>
          <p class="text">
            其他活配送点:
            <span
              v-if="row.deliveryPointProvince && row.deliveryPointCity && row.deliveryPointCounty"
              :class="cityClass(row.deliveryPointCity)"
            >
              <span>
                {{ row.deliveryPointProvinceName }}
              </span> -
              <span>
                {{ row.deliveryPointCityName }}
              </span> -
              <span>
                {{ row.deliveryPointCountyName }}
              </span>
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
            <span>{{ row.expectedFreightTrip }}元</span>
          </p>
          <p class="text">
            期望月:
            <span>{{ row.expectedFreightMonth }}元</span>
          </p>
          <p class="text">
            期望账期:
            <span :class="hitClass(row.expectAccountingPeriodHit)">{{ row.expectAccountingPeriodName }}</span>
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
            <span
              v-for="(item,index) in (row.intentCargoType || [])"
              :key="index"
              :class="(row.intentCargoTypeHitCode || []).includes(item) ? 'orange' : ''"
            >
              {{ row.intentCargoTypeName[index] }}&#8197;
            </span>
          </p>
          <p class="text">
            期望装卸难度:
            <span :class="hitClass(row.heavyLiftingHit)">{{ row.heavyLiftingName }}</span>
          </p>
          <p class="text">
            期望配送复杂度:
            <span
              v-for="(item,index) in row.deliveryDifficulty"
              :key="index"
              :class="addClass(obj.distributionWay,item)"
            >{{ row.deliveryDifficultyNames[index] }}&#8197;</span>
          </p>
          <p
            class="text"
            :class="hitClass(row.workHoursHit)"
          >
            工作时间段:{{ row.workHoursStr | showWorkHours }}
          </p>
          <p class="text">
            期望稳定/临时:
            <span
              v-for="(item,index) in (row.expectStabilityTemporary || [])"
              :key="index"
              :class="addClass(obj.lineCategory,item)"
            >{{ row.expectStabilityTemporaryNames[index] }}&#8197;</span>
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
            <p
              v-permission="['/v1/outboundCall/getListByBusinessId']"
              class="text"
            >
              <el-button
                type="text"
                size="small"
                @click.stop="handleCall(row)"
              >
                呼叫
              </el-button>
              <span class="phone">
                {{ row.driverPhone }}
              </span>
            </p>

            <p
              v-permission="['/v1/matchDriverLabelInfo/updateDriverLabelByDriverId']"
              class="text"
            >
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
                v-permission="['/v1/matchDriverInfo/queryMatchLineForMatchDriver']"
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
                v-permission="['/v2/runtest/creatIntentionRun']"
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
                v-permission="['/v1/matchDriverInfo/getDriverInfoByDriverId']"
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
                <template v-if="!opType.includes(-1)">
                  <el-button
                    v-permission="['/v2/driver/updateDriverDmBatch']"

                    type="text"
                    size="small"
                    @click.stop="handleAllotSome(row)"
                  >
                    分配司撮
                  </el-button>
                </template>
              </p>
              <p
                v-if="opType.includes(6)"
                class="text"
              >
                <el-button
                  v-permission="['/v2/driver/updateDriverWorkCityByDriverId']"
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
          <div
            class="item"
            :a="row"
          >
            <div class="title">
              基础信息:
            </div>
            <div
              v-if="row.unfoldData && Object.keys(row.unfoldData).length > 0"
              class="content center"
            >
              <span>{{ `${row.unfoldData.driverMatchBasicVO.age}岁/${row.unfoldData.driverMatchBasicVO.drivingLicenceTypeName}本/${row.unfoldData.driverMatchBasicVO.experienceName}/${row.unfoldData.driverMatchBasicVO.sourceChannelName}` }}</span>
              <span>{{ `成交:${ parseTime(row.unfoldData.driverLabelsVO.dealDate,'{y}-{m}-{d}')}` }}</span>
              <span>{{ !isShowPercent ? `最后一次出车日期:${ parseTime(row.unfoldData.driverLabelsVO.lastRunDate,'{y}-{m}-{d}')}` : '' }}</span>
            </div>
          </div>
          <div
            v-if="row.unfoldData && Object.keys(row.unfoldData).length > 0"
            class="item"
          >
            <div class="title">
              试跑信息:
            </div>
            <div class="content">
              <el-button
                v-permission="['/v1/matchDriverInfo/getDriverMatchByDriverId','/v1/matchDriverLabelInfo/getDriverLabelByDriverId','/v2/runtest/getRunTestInfoByDriverId','/v1/outboundCall/getListByBusinessId']"
                size="mini"
                type="text"
                @click.stop="handleDetail(row)"
              >
                立即查看
              </el-button>
            </div>
          </div>
          <div
            v-if="row.unfoldData && Object.keys(row.unfoldData).length > 0"
            class="item"
          >
            <div class="title">
              司机状态:
            </div>
            <div
              class="content"
            >
              {{ row.unfoldData.driverLabelsVO.driverSituationName }}
            </div>
          </div>
          <div
            v-if="row.unfoldData && Object.keys(row.unfoldData).length > 0"
            class="item"
          >
            <div class="title">
              备注信息:
            </div>
            <div
              class="content"
            >
              {{ row.unfoldData.driverLabelRemarksVO.manuallyRemarks }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <make-call
      ref="driverCall"
      :is-show-op="false"
      :phone="driverPhone"
      :call-id="callId"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import MakeCall from '@/components/OutboundDialog/makeCall.vue'
import { getDriverInfoByDriverId } from '@/api/departCenter'
import { parseTime } from '@/utils'
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
    },
    showWorkHours(val:string) {
      if (val) {
        let timeArr
        if (val.includes(',')) {
          timeArr = val.split(',')
        } else {
          timeArr = [val]
        }
        let arr = timeArr.map((item) => {
          let itemArr = item.split('-')
          return itemArr.length > 1 ? `${itemArr[0]}:00-${itemArr[1]}:00` : ''
        })
        return arr.toString()
      } else {
        return ''
      }
    }
  }
})
export default class extends Vue {
  @Prop({ default: false }) isMore!: boolean;
  @Prop({ default: false }) isShowPercent!: boolean;
  @Prop({ default: () => {} }) listQuery!: IState;
  @Prop({ default: () => [] }) opType!: number[];
  @PropSync('driverTableData', { default: () => [] }) _tableData!: IState[];

  private parseTime:Function = parseTime
  private driverPhone: string = '';
  private callId: string | number = '';
  private listLoading: boolean = true;
  private obj: IState = {};

  handleSelectionChange(val: IState[]) {
    this.$emit('checkData', val)
  }

  addClass(objData: any, rowData: any, otherData?:any) {
    if (this.isShowPercent) {
      if (otherData === '均可') {
        return 'orange'
      } else {
        return (objData === rowData || otherData === rowData) ? 'orange' : ''
      }
    } else {
      return ''
    }
  }
  hitClass(val:any) {
    return val ? 'orange' : ''
  }
  cityClass(val:any) {
    if (this.isShowPercent) {
      let cityArr = [this.obj.warehouseCity, this.obj.cityArea]
      return cityArr.includes(val) ? 'orange' : ''
    } else {
      return ''
    }
  }
  // 展开
  async toogleExpand(row: IState) {
    let $table: any = this.$refs.chauffeurTable
    for (let i = 0; i < this._tableData.length; i++) {
      let item: IState = this._tableData[i]
      if (row.driverId === item.driverId && row.isOpen) {
        row.isOpen = false
        $table.toggleRowExpansion(item, false)
        return false
      } else {
        item.isOpen = false
        $table.toggleRowExpansion(item, false)
      }
    }
    row.isOpen = true
    await this.unfoldInfo(row)
    $table.toggleRowExpansion(row, true)
  }
  async unfoldInfo(row:any) {
    try {
      this.listLoading = true
      let params = { driverId: row.driverId }
      let { data: res } = await getDriverInfoByDriverId(params)
      this.$set(row, 'unfoldData', res.data || {})
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
    this.driverPhone = phone
    this.callId = callId
    setTimeout(() => {
      (this.$refs.driverCall as any).handleCallClick('match', 'driver_push')
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
    position: relative;
    top: 1px;
  }
  .changeCity{
    position: relative;
    bottom: 5px;
    right: 2px;
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
  .center{
    display: flex;
    justify-content: space-between;
    align-items: center;
    span{
      margin-left: 30px;
    }
  }
  .center span:first-child {
    margin-left: 0;
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
