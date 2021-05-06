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
          min-width="50"
          label=""
          class-name="firstColumn"
        >
          <template>
            <div class="arrow" />
          </template>
        </el-table-column>
        <el-table-column
          label="基础信息"
          min-width="140"
          align="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              {{ row.basicInfo.name }}
              <el-popover
                placement="right"
                min-width="200"
                trigger="hover"
              >
                <div class="text1">
                  {{ row.basicInfo.introduce }}
                </div>
                <i
                  slot="reference"
                  class="el-icon-chat-dot-round"
                />
              </el-popover>
            </p>

            <p class="text">
              ({{ row.basicInfo.post }})
            </p>
            <p class="text">
              {{ row.basicInfo.lineId }}
            </p>
            <p class="text">
              窗口期:剩余{{ row.basicInfo.day }}天
            </p>
            <p class="text scale">
              {{ row.basicInfo.createDate }}创建
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
              {{ row.carInfo.type }}/{{ row.carInfo.feature }}
            </p>
            <p
              class="text"
            >
              {{ row.carInfo.rules.join('/') }}
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
              仓地址:{{ row.warehouseSite.province }}-{{ row.warehouseSite.city }}-{{ row.warehouseSite.town }}
            </p>
            <p class="text">
              配送区域:{{ row.sendArear.province }}-{{ row.sendArear.city }}-{{ row.sendArear.town }}
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
              趟运费:{{ row.Settlement.onceFreight }}元
            </p>
            <p class="text">
              预计月运费:{{ row.Settlement.monthFreight }}元
            </p>
            <p class="text">
              结算周期:{{ row.Settlement.period===1?'周结':'' }}
            </p>
            <p class="text">
              结算天数:{{ row.Settlement.days }}天
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
              货品:{{ row.lineTrait.product }}
            </p>
            <p class="text">
              装卸难度:{{ row.lineTrait.handlingDifficulty |difficultyFilter }}
            </p>
            <p class="text">
              配送复杂度:{{ row.lineTrait.sendtype===1?'整车':'' }}
            </p>
            <p class="text">
              工作时间段:{{ row.lineTrait.time }}
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
              v-for="item in row.label "
              :key="item.index"
              class="text"
            >
              {{ item }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          min-width="110"
          class-name="center"
        >
          <template slot-scope="{row}">
            <template v-if="row.status.isAllowInvite">
              <p
                v-show="(row.status.city.length===1||row.status.city.length===2)&&row.status.isInviteSuccess!==1"
                class="text"
              >
                {{ `${row.status.city[0]}${row.status.city[1]?"、"+row.status.city[1]:"" }` }}已客邀
              </p>
              <p
                v-show="row.status.city.length>2"
                class="text"
              >
                <el-popover
                  placement="top-start"
                  min-width="200"
                  trigger="hover"
                >
                  <div class="text1">
                    {{ row.status.city | cityListFilter }}
                  </div>
                  <span
                    slot="reference"
                    style="color:orange"
                  >{{ row.status.city.length }}<span style="color:#444">个城市已客邀</span></span>
                </el-popover>
              </p>
              <p
                v-show="row.status.isLocationInvite===1&&row.status.locationCitySuccess!==1&&row.status.isInviteSuccess!==1"
                class="text"
              >
                本城已客邀
              </p>
              <p
                v-show="row.status.isLocationInvite===0&&row.status.locationCitySuccess!==1&&row.status.isInviteSuccess!==1"
                class="text"
              >
                本城未客邀
              </p>
              <p
                v-show="row.status.isInviteSuccess===1&&row.status.locationCitySuccess===1"
                class="text"
              >
                本城客邀撮合成功
              </p>
              <p
                v-show="row.status.isInviteSuccess===1&&row.status.locationCitySuccess===0"
                class="text"
              >
                {{ row.status.city[0] }}客邀撮合成功
              </p>
            </template>
            <p
              v-else
              class="text"
            >
              不可发起客邀
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="110"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p
              v-if="row.status.isLocationInvite===0&&row.status.isInviteSuccess===0&&row.status.isAllowInvite===1"
              class="text"
            >
              <el-button
                type="text"
                size="small"
                @click.stop="handleLaunchGuest(row.id)"
              >
                发起客邀
              </el-button>
            </p>
            <p
              v-if="row.status.isLocationInvite===1&&row.status.isAllowInvite===1&&row.status.isInviteSuccess===0"
              class="text"
            >
              <el-button
                type="text"
                size="small"
                @click.stop="handleCancelGuest(row.id)"
              >
                取消客邀
              </el-button>
            </p>
            <p
              v-if="row.status.isInviteSuccess===1&&row.status.locationCitySuccess===1"
              class="text"
            >
              <el-button
                type="text"
                size="small"
                @click.stop="handleCancelTryRun(row.id)"
              >
                取消意向
              </el-button>
            </p>
            <p
              v-if="!row.status.locationCitySuccess"
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
import { getLineInfo } from '@/api/lineList'
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
    this.init()
  }

  init() {
    this.getLists()
  }
  // 调用接口获取表单数据
  // 获取列表数据
  async getLists() {
    // 调用查询接口
    let params = {}
    let { data: res } = await getLineInfo(params)
    console.log('res', res)
    try {
      let num:number = 10
      if (this.isMore) {
        num = 1
      }
      this.tableData = []
      for (let i = 0; i < num; i++) {
        let obj:IState = {
          percent: 80,
          id: 1,
          arr: ['商贸信息', '已创建30条线路', '15条在跑', '5条线路已掉线', '3条线路在上架找车'],
          brr: ['1个点', '每日1趟', '每月12天', '每趟120公里', '走高速', '回单', '城配线', '稳定(2个月)'],
          crr: ['已发起3次客邀', '已创建意向3次', '试跑失败2次', '司机爽约1次', '扭头就走1次', '掉线1次'],
          isOpen: false,
          basicInfo: {
            name: '京东传站',
            post: '李外线经理',
            lineId: 'XL202012300377',
            introduce: '这条线路是异常火爆,4.2厢货,场景简单,菜鸟也能干...',
            createDate: '2021-04-15 12:00',
            day: 3
          },
          carInfo: {
            type: '4.2米厢货',
            feature: '油车',
            rules: ['能闯禁行', '能闯限行', '单肥']
          },
          warehouseSite: { province: '湖南省', city: '长沙市', town: '短沙县' },
          sendArear: { province: '湖南省', city: '长沙市', town: '短沙县' },
          Settlement: {
            onceFreight: 500,
            monthFreight: 500,
            period: 1,
            days: 7
          },
          lineTrait: {
            product: '食品/团购',
            handlingDifficulty: 2, // 1:不装卸,2:只装不卸（轻）,3:只卸不装（轻）,4:只装不卸（重）,5:只卸不装（重）,6:重装卸（重）
            sendtype: 1, // 1:整车
            settlementDays: 7,
            time: '9:00~18:00/稳定/五个月'
          },
          label: ['爆款', '客急'],
          status: {
            city: ['天津', '北京'],
            isLocationInvite: 1, // 本城是否已客邀
            isAllowInvite: 1, // 是否可发起客邀
            isInviteSuccess: 0, // 是否客邀撮合成功
            locationCitySuccess: 0// 本城客邀撮合成功
          }
        }
        obj.id = (i + 1)
        this.tableData.push({ ...obj })
      }
      this.tableData[1].status = {
        city: ['天津'],
        isLocationInvite: 1, // 本城是否已客邀
        isAllowInvite: 1, // 是否可发起客邀
        isInviteSuccess: 0, // 是否客邀撮合成功
        locationCitySuccess: 0// 本城客邀撮合成功
      }
      this.tableData[2].status = {
        city: ['天津', '北京', '上海', '南京'],
        isLocationInvite: 0, // 本城是否已客邀
        isAllowInvite: 1, // 是否可发起客邀
        isInviteSuccess: 0, // 是否客邀撮合成功
        locationCitySuccess: 0// 本城客邀撮合成功
      }
      this.tableData[3].status = {
        city: [],
        isLocationInvite: 0, // 本城是否已客邀
        isAllowInvite: 1, // 是否可发起客邀
        isInviteSuccess: 1, // 是否客邀撮合成功
        locationCitySuccess: 1// 本城客邀撮合成功
      }
      this.tableData[4].status = {
        city: ['天津'],
        isLocationInvite: 0, // 本城是否已客邀
        isAllowInvite: 1, // 是否可发起客邀
        isInviteSuccess: 1, // 是否客邀撮合成功
        locationCitySuccess: 0// 本城客邀撮合成功
      }
      this.tableData[4].status = {
        city: ['天津'],
        isLocationInvite: 0, // 本城是否已客邀
        isAllowInvite: 0, // 是否可发起客邀
        isInviteSuccess: 0, // 是否客邀撮合成功
        locationCitySuccess: 0// 本城客邀撮合成功
      }
      this.tableData[5].status = {
        city: ['天津'],
        isLocationInvite: 0, // 本城是否已客邀
        isAllowInvite: 1, // 是否可发起客邀
        isInviteSuccess: 1, // 是否客邀撮合成功
        locationCitySuccess: 0// 本城客邀撮合成功
      }
    } catch (err) {
      console.log(`get list fail fail:${err}`)
    } finally {
      (this.$parent as any).listLoading = false
    }
  }
  // 取消客邀
  handleCancelGuest(id:number) {
    this.$emit('cancelGuest', id)
  }
  // 发起客邀
  handleLaunchGuest(id:number) {
    this.$emit('launchGuest', id)
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
