<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:34:13
 * @LastEditTime: 2021-04-28 17:48:58
 * @LastEditors: D.C.base
-->
<template>
  <DrawerModel
    v-model="visible"
    @on-close="closeHandle"
    @open="handleOpenClick"
  >
    <Scroll
      :on-reach-bottom="loadMoreHandle"
      :distance-to-edge="0"
    >
      <!-- 撮合线路 -->
      <section class="departLine">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 16px;">
          待撮合司机
        </div>
        <AtableDriver
          ref="driverDrawer"
          :list-query="listQueryDriver"
          :driver-table-data.sync="driverTableData"
          :is-more="true"
          :is-show-percent="false"
          :op-type="[]"
          @tag="setTagHandle"
          @call="setCallHandle"
          @creatRun="onCreateTryRun"
          @detail="onViewDriverDetail"
        />
      </section>
      <!-- 撮合匹配的司机列表 -->
      <section class="matchDriver">
        <!-- 搜索项 -->
        <SearchKeyWords
          ref="searchKeyWords"
          @query="onQuery"
        />
        <div style="font-size: 16px; font-weight: bold; margin: 16px 30px;">
          司机匹配线路
        </div>
        <div class="lineTable">
          <AtableLine
            ref="lineTableDrawer"
            :line-table-data="lineTableData"
            :is-show-percent="true"
            :is-more="true"
            @tryRun="onCreateTryRun"
          />
        </div>
      </section>
      <SetTag
        ref="tagShow"
        :driver-id="driverId"
      />
    </Scroll>
    <CreateTryRun
      ref="tryRunShow"
      :obj.sync="rowData"
    />
    <DetailDialog
      actived="third"
      :driver-id="driverId"
      :dialog-table-visible.sync="detailDio"
    />
  </DrawerModel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Scroll from '@/components/Scroll/index.vue'
import SearchKeyWords from './components/SearchKeyWords.vue'
import DrawerModel from '@/components/DrawerModel/index.vue'
import CreateTryRun from '../chauffeurList/components/CreateTryRun.vue'
import AtableLine from '../guestList/components/Atable.vue'
import AtableDriver from '../chauffeurList/components/Atable.vue'
import DetailDialog from '../chauffeurList/components/DetailDialog.vue'
import SetTag from '../guestDrawer/components/SetTag.vue'
import { AppModule } from '@/store/modules/app'
import { MatchLineListForDriver } from '@/api/departCenter'
import { parse } from 'node_modules/path-to-regexp'

const pageInfo = {
  limit: 30,
  page: 1
}

  interface IState {
    [key: string]: any;
  }
  @Component({
    components: {
      Scroll,
      DrawerModel,
      SearchKeyWords,
      AtableLine,
      AtableDriver,
      CreateTryRun,
      SetTag,
      DetailDialog
    }
  })
export default class GuestDrawer extends Vue {
    @Prop({ default: false }) private value !: boolean
    private visible : boolean = false // 抽屉显示隐藏
    private driver: any = {}
    private driverId: string = ''
    private tagShow:boolean = false
    private pageSize:number = 1
    private tryRunShow:boolean = false
    private showTryRun:boolean = false
    private rowData:object = {}
    private lineTableData:IState[] = [] // 线路列表
    private driverTableData:IState[] = [] // 司机列表
    private params: object = {} // 来自SearchKeyWords 组件的查询数据
    private pageInfo: any = { ...pageInfo } // 分页数据
    private total: number = 0 // 总数据量
    private listQueryDriver:IState = {
      labelType: '',
      isBehavior: '',
      isRestriction: '',
      status: '',
      start: '',
      end: '',
      f1: '',
      f2: ''
    }
    private detailDio:Boolean = false
    $eventBus: any
    @Watch('value')
    onValueChanged(val: boolean, oldVal: boolean) {
      this.visible = val
      this.$eventBus.$emit('setIndex', val)
    }
    onViewDriverDetail() {
      this.detailDio = true
    }
    closeHandle() {
      this.visible = false
      this.$emit('input', false);
      // 关闭抽屉删掉线路表格的数据
      (this.$refs.driverDrawer as any).removeTableInfo()
    }
    setTagHandle() {
      (this.$refs.tagShow as any).isShow = true
    }
    setCallHandle(data:any) {
      let phone = data.phoneNum
      let repStr = phone.substr(3)
      let newStr = phone.replace(repStr, '********')
      this.$confirm(`将给${newStr}外呼, 请确定是否拨通?`, '外呼提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(123)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消拨打'
        })
      })
    }
    handleOpenClick() {
      AppModule.CloseSideBar(false)
      setTimeout(() => {
        this.driver = JSON.parse(sessionStorage.getItem('driver_row') || '{}')
        this.driverId = this.driver.driverId || ''
        ;(this.$refs.driverDrawer as any).getStorage();
        (this.$refs.lineTableDrawer as any).getDriverInfoFromStorage()
        ;(this.$refs.searchKeyWords as any).initQuery()
      }, 20)
    }
    onCreateTryRun(data:any) {
      const params = Object.assign({}, data, this.driver, {
        name: this.driver.driverName || '',
        phone: this.driver.driverPhone || '',
        // dutyManagerId: data.lineSaleId,
        matchType: 1 // 司推。客邀2
      })
      ;(this.$refs.tryRunShow as any).showDialog = true
      this.rowData = params
    }
    onQuery(params: any) {
      console.log(params)
      const { cargoType, clearCycle, deliverComplexity, distLoc, driverId, f1, f2, keyWords, lineQuality, loadDifficulty, model, repoLoc, stability, workRange } = params
      this.params = {
        carTypeList: model,
        cargoTypeList: cargoType,
        // todo 省市区
        expectAccountingPeriodList: clearCycle,
        expectStabilityTemporaryList: stability,
        expectedFreightTripStart: f1,
        expectedFreightTripEnd: f2,
        heavyLiftingList: loadDifficulty,
        deliveryDifficulty: deliverComplexity,
        labelTypeList: lineQuality,
        lineId: keyWords,
        driverId,
        workHours: workRange // todo confirm
      }
      this.queryData()
    }
    loadMoreHandle() {
      this.queryData(true)
    }
    queryData(append?: boolean) {
      if (append) {
        this.pageInfo.page += 1
      } else {
        this.pageInfo = { ...pageInfo }
      }
      MatchLineListForDriver(Object.assign({}, this.params, this.pageInfo)).then((res: any) => {
        res = res.data || {}
        if (res.success) {
          this.lineTableData = append ? this.lineTableData.concat(res.data || []) : (res.data || [])
          this.total = (res.page || {}).total
        } else {
          console.log(res.errorMsg)
        }
      })
    }
    mounted() {
    }
}
</script>
<style lang="scss" scoped>
  .drawerBox {
    width: 100%;
    height: 100%;
    overflow: auto;
    ::v-deep .el-drawer{
      overflow: initial;
      //background: #e6e9f0;
    }
  }
  .departLine{
    padding: 20px 30px;
    background: #fff;
    margin-bottom: 10px;
  }
  .matchDriver{
    background: #fff;
    padding-bottom: 20px;
    h3{
      padding: 0 30px;
    }
    .lineTable{
      width:100%;
      padding: 0 30px;
      overflow: auto;
    }
  }
  .actionBtn{
    display: flex;
    width: 25px;
    height: 60px;
    justify-content: center;
    align-items: center;
    position: absolute;
    left:-25px;
    top:50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 10px 0 0 10px;
    z-index: 1000;
  }
</style>
