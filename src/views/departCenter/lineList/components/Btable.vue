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
        :row-style="{height: '20px'}"
        fit
        :header-cell-style="{padding: '6px 20px'}"
        :cell-style="{padding: '5px 20px'}"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column
          type="selection"
          width="80"
        />
        <!-- <el-table-column
          label=""
          width="50"
          class-name="noP"
        >
          <template slot-scope="{row}">
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
          </template>
        </el-table-column> -->
        <el-table-column
          label="基础信息"
          align="center"
          class-name="firstColumn"
        >
          <template slot-scope="{row}">
            <div class="arrow" />
            <router-link to="#">
              {{ row.basicInfo.name }}
            </router-link>
            <el-popover
              placement="right"
              width="200"
              trigger="hover"
            >
              <div class="text1">
                <!-- 这条线路是异常<el-button
                  type="text"
                  size="small"
                >
                  火爆
                </el-button>,4.2厢货,场景简单,菜鸟也能干... -->
                {{ row.basicInfo.introduce }}
              </div>
              <i
                slot="reference"
                class="el-icon-chat-dot-round"
              />
            </el-popover>
            <p class="text">
              ({{ row.basicInfo.post }})
            </p>
            <p class="text">
              {{ row.basicInfo.lineId }}
            </p>
            <p class="text">
              窗口期:剩余{{ row.c }}天
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆"
          width="180"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              {{ row.carInfo.type }}/{{ row.carInfo.feature }}
            </p>
            <p
              v-for="(item,index) in row.carInfo.rules"
              :key="item.index"
              class="text"
            >
              {{ item }}{{ index===row.carInfo.rules.length-1?'':'/' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="配送信息"
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
          width="180"
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
              配送类型:{{ row.lineTrait.sendtype===1?'整车':'' }}
            </p>
            <p class="text">
              工作时间段:{{ row.lineTrait.time }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="标签"
          width="140"
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
          width="180"
          class-name="center"
        >
          <template slot-scope="{row}">
            <p class="text">
              <i
                class="el-icon-s-custom"
              /> {{ row.status.name }}
            </p>
            <p
              v-if="row.a"
              class="text"
            >
              {{ row.status.state===1?'已上架':'未上架' }}
            </p>
            <p class="text">
              {{ row.status.iscustomInvite===1?'已发起客邀':'未发起客邀' }}
            </p>
            <p class="text">
              {{ row.status.intention===1?'待确认意向':'已确认意向' }}
            </p>
            <p class="text">
              {{ row.status.customInviteStatus===1?'客邀成功':'客邀失败' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          class-name="center"
        >
          <!-- <template slot-scope="{row}"> -->
          <template>
            <p class="text">
              <el-button
                type="text"
                size="small"
                @click.stop="handleLaunchGuest"
              >
                发起客邀
              </el-button>
            </p>
            <p class="text">
              <el-button
                type="text"
                size="small"
                @click.stop="handleCancelGuest"
              >
                取消客邀
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
            <!-- <p
              v-if="isMore"
              class="text"
            >
              <el-button
                size="mini"
                @click.stop="toogleExpand(row)"
              >
                {{ row.isOpen ? '收起':'展开' }}详情<i :class="row.isOpen ?'el-icon-arrow-up':'el-icon-arrow-down'" />
              </el-button>
            </p> -->
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
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { getLineInfo } from '@/api/line'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Btable',
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
            introduce: '这条线路是异常火爆,4.2厢货,场景简单,菜鸟也能干...'
          },
          carInfo: {
            type: '4.2米厢货',
            feature: '油车',
            rules: ['能闯禁行', '能闯限行', '共享']
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
            time: '9:00~18:00'
          },
          label: ['爆款', '客急', '客邀线'],
          status: {
            name: '老王',
            state: 1, // 1:已上架
            iscustomInvite: 1, // 1:已发起客邀
            intention: 1, // 1:待确认意向
            customInviteStatus: 1// 1:客邀成功
          }
        }
        obj.id = (i + 1)
        this.tableData.push({ ...obj })
      }
    } catch (err) {
      console.log(`get list fail fail:${err}`)
    } finally {
      (this.$parent as any).listLoading = false
    }
  }

  // 展开
  // toogleExpand(row:IState) {
  //   let $table:any = this.$refs.lineTable
  //   for (let i = 0; i < this.tableData.length; i++) {
  //     let item:IState = this.tableData[i]
  //     if ((row.id !== item.id)) {
  //       row.isOpen = false
  //       $table.toggleRowExpansion(item, false)
  //     } else if (row.isOpen) {
  //       row.isOpen = false
  //       $table.toggleRowExpansion(item, false)
  //       return false
  //     }
  //     row.isOpen = true
  //     $table.toggleRowExpansion(row)
  //   }
  // }
  // 取消客邀
  handleCancelGuest() {
    this.$emit('cancelGuest')
  }
  // 发起客邀
  handleLaunchGuest() {
    this.$emit('launchGuest')
  }
  // 选择事件
  handleSelect(selection:[], row:{}) {
    console.log(selection, row)
  }
  // 全选
  handleSelectAll(selection:[]) {
    console.log(selection)
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
/* .lineTableContainer >>> .expand .cell */
/* .lineTableContainer >>> .noP .cell {
  padding: 0px!important;
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  text-align: right;
} */
</style>

<style>
.text1 {
  font-size:12px;
}
</style>
