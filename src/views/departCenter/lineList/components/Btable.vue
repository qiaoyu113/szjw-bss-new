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
            <div class="arrow" />
            <div
              style="margin-left:50px;"
            >
              <p class="text">
                {{ row.lineName }}
                <el-popover
                  placement="right"
                  min-width="200"
                  trigger="hover"
                  @show="showMarkHandle({lineId: row.lineId,city: row.currentCity||249})"
                >
                  <div class="text1">
                    {{ remarks }}
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
                窗口期:剩余{{ row.recruitWindowPeriod||' ' }}天
              </p>
              <p class="text scale">
                {{ row.lineCreateDate }}创建
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆"
          min-width="150"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              {{ row.carType }}/{{ row.oilElectricityRequirement }}
            </p>
            <p
              v-if="row.behavior"
              class="text"
            >
              能闯禁行
            </p>
            <p
              v-if="row.restriction"
              class="text"
            >
              能闯限行
            </p>
            <p
              class="text"
            >
              {{ row.labelType | labelFilter }}
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
              每日{{ row.dayNum }}趟/{{ row.monthNum }}天(元)
            </p>
            <p class="text">
              预计月运费:{{ row.shipperOffer }}元
            </p>
            <p class="text">
              结算周期/天数:{{ row.settlementCycle||'  ' }}/{{ row.settlementDays||'  ' }}天
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
              装卸难度:{{ row.handlingDifficulty }}
            </p>
            <p class="text">
              配送复杂度:{{ row.distributionWay }}
            </p>
            <p class="text">
              工作时间段:{{ row.workingTime }}/{{ row.lineCategory==='1'?'稳定':'临时' }}/{{ row.stabilityRate }}
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
              v-show="row.hot"
              class="text"
            >
              爆款
            </p>
            <p
              class="text"
            >
              {{ row.urgent | urgentFilter }}
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
              v-if="row.inviteCities&&row.inviteCities.length===1"
              class="text"
            >
              {{ row.inviteCities[0] }}已客邀
            </p>
            <p
              v-if="row.inviteCities&&row.inviteCities.length===2"
              class="text"
            >
              {{ row.inviteCities[0]+'、'+row.inviteCities[1] }}已客邀
            </p>
            <p
              v-if="row.inviteCities&&row.inviteCities.length>2"
              class="text"
            >
              <el-popover
                placement="top-start"
                min-width="200"
                trigger="hover"
              >
                <div class="text1">
                  {{ row.inviteCities | cityListFilter }}
                </div>
                <span
                  slot="reference"
                  style="color:orange"
                >{{ row.inviteCities.length }}<span style="color:#444">个城市已客邀</span></span>
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
            <p
              v-if="row.matchStatus === 2"
              class="text"
            >
              {{ row.driverName }}
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
              v-if="row.matchStatus===1 && row.currentCityInvited"
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
              v-if="!row.currentCityInvited && row.matchStatus===1"
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
              v-if="row.currentCitySuccess&&listQuery.customerStatus===''"
              class="text"
            >
              <!-- 本城客邀撮合成功时显示 -->
              <el-button
                type="text"
                size="small"
                @click.stop="handleCancelTryRun(row)"
              >
                取消试跑意向
              </el-button>
            </p>
            <!-- 只有当本城客邀撮合成功时不展示 -->
            <p
              v-if="!row.currentCitySuccess"
              class="text"
            >
              <el-button
                v-permission="['/v3/line/shelf/menu']"
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
import { getLineInfo, getLineRemarks } from '@/api/departCenter'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Btable',
  filters: {
    cityListFilter(value:[]) {
      let str = ''
      value.forEach(item => {
        str += item + '、'
      })
      str = str.slice(0, str.length - 1)
      return str
    },
    labelFilter(value:number) {
      switch (value) {
        case 1: return '超肥'
        case 2: return '单肥'
        case 3: return '次肥'
        case 4: return '中瘦'
        case 5: return '极瘦'
      }
    },
    urgentFilter(value:number) {
      switch (value) {
        case 0 : return '已下架'
        case 1 : return '客急'
        case 2 : return '客常'
      }
    }
  }
})
export default class extends Vue {
  @Prop({ default: false }) isMore!:boolean
  @Prop({ default: false }) isShowPercent!:boolean
  @Prop({ default: () => {} }) listQuery!:IState
  @Prop({ default: () => {} }) pageobj!:IState
  private tableData:IState[] = []

  private multipleSelection:IState[] = []

  private selection:[] = []
  private remarks:string = ''

  // 调用接口获取表单数据
  // 获取列表数据
  async getLists() {
    console.log('listQuery', this.listQuery, this.pageobj)
    try {
    // 调用查询接口
      let { page, limit } = this.pageobj
      let params = { ...this.listQuery, page, limit }
      console.log('params', params)
      let { data: res } = await getLineInfo(params)
      this.tableData = res.data;
      (this.$parent as any).total = res.page.total
    } catch (err) {
      console.log('err', err)
    } finally {
      (this.$parent as any).listLoading = false
    }
  }
  // 取消客邀(撮合单待撮合状态，)
  handleCancelGuest(custInviteId:string) {
    if (!this.selection.length) {
      this.$emit('cancelGuest', custInviteId)
    } else {
      this.$message.error('请取消勾选项')
    }
  }
  // 发起客邀
  handleLaunchGuest(row:any) {
    const { lineId, matchId } = row
    if (!this.selection.length) {
      this.$emit('launchGuest', { lineId, matchId })
    } else {
      this.$message.error('请取消勾选项')
    }
  }
  // 取消意向
  handleCancelTryRun(row:any) {
    if (!this.selection.length) {
      this.$emit('cancelTryRun', row)
    } else {
      this.$message.error('请取消勾选项')
    }
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
  // 勾选
  handleSelectionChange(selection:[]) {
    this.selection = selection
    this.$emit('SelectionChange', selection)
  }

  showMarkHandle(params:any) {
    console.log(params)
    this.getRemarks(params)
  }
  async getRemarks(params:any) {
    let { data: res } = await getLineRemarks(params)
    if (res.success) {
      this.remarks = res.data || '这条线路非常火爆，4.2米箱货城配，场景简单，菜鸟也能干'
    }
    console.log(res)
  }

  // 更新列表
  refreshList() {
    console.log('刷新列表')
    this.getLists()
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
