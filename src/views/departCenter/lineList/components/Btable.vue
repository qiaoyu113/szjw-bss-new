<template>
  <div class="lineTableContainer">
    <template>
      <el-table
        ref="lineTable"
        :data="tableData"
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
          v-if="listQuery.customerStatus!==''"
          type="selection"
          align="center"
          width="40"
        />
        <el-table-column
          label="基础信息"
          min-width="190"
          align="center"
          class-name="firstColumn"
        >
          <template slot-scope="{row}">
            <p class="text">
              {{ row.lineName }}
              <el-popover
                placement="right"
                min-width="200"
                trigger="hover"
              >
                <div class="text1">
                  {{ row.lineName }}
                </div>
                <i
                  slot="reference"
                  class="el-icon-chat-dot-round"
                />
              </el-popover>
            </p>

            <p class="text">
              ({{ row.lineSaleName }})
            </p>
            <p class="text">
              {{ row.lineSaleId }}
            </p>
            <p class="text">
              窗口期:剩余{{ row.dayNum }}天
            </p>
            <p class="text scale">
              {{ row.lineCreateDate }}创建
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆"
          min-width="150"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              {{ row.carType }}/{{ row.cargoType }}
            </p>
            <p
              v-if="row.isBehavior===1"
              class="text"
            >
              能闯禁行
            </p>
            <p
              v-if="row.isRestriction===1"
              class="text"
            >
              能闯限行
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="配送信息"
          min-width="200"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              仓地址:{{ row.warehouseProvince }}-{{ row.warehouseCity }}-{{ row.warehouseCounty }}
            </p>
            <p class="text">
              配送区域:{{ row.provinceArea }}-{{ row.cityArea }}-{{ row.countyArea }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="结算"
          min-width="190"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              单趟运费:{{ row.everyTripGuaranteed }}元
            </p>
            <p class="text">
              每日{{ row.everyTripGuaranteed }}趟/{{ row.monthNum }}天(元)
            </p>
            <p class="text">
              预计月运费:{{ row.shipperOffer }}元
            </p>
            <p class="text">
              结算周期/天数:{{ row.settlementCycle }}/7天
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="线路特点"
          min-width="240"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              货品:{{ row.cargoType }}
            </p>
            <p class="text">
              装卸难度:{{ row.handlingDifficulty |difficultyFilter }}
            </p>
            <p class="text">
              配送复杂度:{{ row.distributionWay }}
            </p>
            <p class="text">
              工作时间段:{{ row.workingHours }}/{{ row.lineCategory }}/{{ row.stabilityRate }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="标签"
          min-width="60"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p
              v-show="row.isHot===1"
              class="text"
            >
              爆款
            </p>
            <p
              class="text"
            >
              {{ row.urgent }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="110"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p
              v-show="row.inviteCitys.length===1"
              class="text"
            >
              {{ row.inviteCitys[0] }}已客邀
            </p>
            <p
              v-show="row.inviteCitys.length===2"
              class="text"
            >
              {{ row.inviteCitys[0]+'、'+row.inviteCitys[1] }}已客邀
            </p>
            <p
              v-show="row.inviteCitys.length>2"
              class="text"
            >
              <el-popover
                placement="top-start"
                min-width="200"
                trigger="hover"
              >
                <div class="text1">
                  {{ row.inviteCitys | cityListFilter }}
                </div>
                <span
                  slot="reference"
                  style="color:orange"
                >{{ row.inviteCitys.length }}<span style="color:#444">个城市已客邀</span></span>
              </el-popover>
            </p>

            <p
              v-if="row.currentCityInvited&&!row.currentCitySuccess"
              class="text"
            >
              本城已客邀
            </p>
            <p
              v-if="!row.currentCityInvited&&!row.currentCitySuccess"
              class="text"
            >
              本城未客邀
            </p>

            <p
              v-show="row.currentCitySuccess"
              class="text"
            >
              本城客邀撮合成功
            </p>
            <p
              v-show="row.successCity"
              class="text"
            >
              {{ row.successCity }}客邀撮合成功
            </p>
            <p
              v-if="row.matchStatus === 3"
              class="text"
            >
              不可发起客邀
            </p>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          min-width="110"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p
              v-if="row.currentCityInvited && !row.currentCitySuccess"
              class="text"
            >
              <el-button
                type="text"
                size="small"
                @click.stop="handleCancelGuest(row.custInviteId)"
              >
                取消客邀
              </el-button>
            </p>
            <p
              v-if="!row.currentCityInvited && !row.currentCitySuccess"
              class="text"
            >
              <el-button
                type="text"
                size="small"
                @click.stop="handleLaunchGuest(row)"
              >
                发起客邀
              </el-button>
            </p>
            <p
              v-if="row.currentCitySuccess"
              class="text"
            >
              <!-- 本城客邀撮合成功时显示 -->
              <el-button
                type="text"
                size="small"
                @click.stop="handleCancelTryRun(row.id)"
              >
                取消试跑意向
              </el-button>
            </p>
            <!-- 只有当本城客邀撮合成功时不展示 -->
            <p
              v-else
              class="text"
            >
              <el-button
                type="text"
                size="small"
                @click.stop="handleDetailClick(row)"
              >
                查看线路详情
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getLineInfo } from '@/api/departCenter'
import CancelGuest from './CancelGuest.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Btable',
  components: {
    CancelGuest
  },
  filters: {
    difficultyFilter(value:number) {
      switch (value) {
        case 1: return '不装卸'
        case 2: return '只装不卸（轻）'
        case 3: return '只卸不装（轻）'
        case 4: return '只装不卸（重）'
        case 5: return '只卸不装（重）'
        case 6: return '重装卸（重）'
      }
    },
    cityListFilter(value:[]) {
      let str = ''
      value.forEach(item => {
        str += item + '、'
      })
      str = str.slice(0, str.length - 1)
      return str
    }
  }
})
export default class extends Vue {
  @Prop({ default: false }) isMore!:boolean
  @Prop({ default: false }) isShowPercent!:boolean
  @Prop({ default: () => {} }) listQuery!:IState
  private tableData:IState[] = []

  private multipleSelection:IState[] = []

  mounted() {
    console.log(this.listQuery)
    // this.init()
  }

  init() {
    this.getLists()
  }
  // 调用接口获取表单数据
  // 获取列表数据
  async getLists() {
    try {
    // 调用查询接口
      let params = {}
      let { data: res } = await getLineInfo(params)
      console.log('res', res)
      this.tableData = res
      console.log('this.tableData', this.tableData)
    } catch (err) {
      console.log('err', err)
    } finally {
      (this.$parent as any).listLoading = false
    }
  }
  // 取消客邀
  handleCancelGuest(custInviteId:string) {
    this.$emit('cancelGuest', custInviteId)
  }
  // 发起客邀
  handleLaunchGuest(row:any) {
    const { lineId, matchId } = row
    console.log('row', row)
    this.$emit('launchGuest', { lineId, matchId })
  }
  // 取消意向
  handleCancelTryRun(id:number) {
    this.$emit('cancelTryRun', id)
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

  // 选择事件
  handleSelect(selection:[], row:{}) {
    console.log(selection, row)
  }
  // 勾选
  selectHandle(selection:[]) {
    console.log(selection)
    this.$emit('select')
  }
  // 勾选
  handleSelectionChange(selection:[]) {
    console.log('勾选项', selection)
    this.$emit('SelectionChange', selection)
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
      &.scale {
        margin-left: -50%;
        width: 200%;
        font-size:18px;
        transform: scale(0.5);
      }
      text-align: left;
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
.lineTableContainer >>> .firstColumn {
  overflow: hidden;
}
</style>

<style>
.text1 {
  font-size:12px;
}
</style>
