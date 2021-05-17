<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:34:13
 * @LastEditTime: 2021-05-17 20:56:04
 * @LastEditors: Please set LastEditors
-->
<template>
  <DrawerModel
    v-model="visible"
    @on-close="closeHandle"
    @open="handleOpenClick"
  >
    <div class="drawerModel">
      <Scroll
        :stop-slide="isAll"
        :is-lock="isLock"
        :on-reach-bottom="loadMoreHandle"
        :distance-to-edge="50"
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
          @on-success="tagSuccessHandle"
        />
      </Scroll>
      <CreateTryRun
        ref="tryRunShow"
        :obj.sync="rowData"
        @success="onCreateTryRunSucc"
      />
      <DetailDialog
        actived="third"
        :driver-id="driverId"
        :dialog-table-visible.sync="detailDio"
      />
    </div>
  </DrawerModel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Scroll from '@/components/Scroll/index.vue'
import SearchKeyWords from './components/SearchKeyWords.vue'
import DrawerModel from '@/components/DrawerModel/index.vue'
import CreateTryRun from '../guestList/components/CreateTryRun.vue'
import AtableLine from '../guestList/components/Atable.vue'
import AtableDriver from '../chauffeurList/components/Atable.vue'
import DetailDialog from '../chauffeurList/components/DetailDialog.vue'
import SetTag from '../guestDrawer/components/SetTag.vue'
import { AppModule } from '@/store/modules/app'
import { MatchLineListForDriver, queryMatchDriverForMatchLine } from '@/api/departCenter'

const pageInfo = {
  limit: 10,
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
    private isAll: boolean = false
    private isLock: boolean = false
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
      let phone = data.driverPhone || ''
      let repStr = phone.substr(3)
      let newStr = phone.replace(repStr, '********')
      this.$confirm(`将给${newStr}外呼, 请确定是否拨通?`, '外呼提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        (this.$refs.driverDrawer as any).callPhone(phone, this.driverId)
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
      const params = {
        driverId: this.driverId,
        name: this.driver.driverName || '',
        phone: this.driver.driverPhone || '',
        lineId: data.lineId,
        matchId: data.matchId,
        matchType: 1 // 司推。客邀2
      }
      ;(this.$refs.tryRunShow as any).showDialog = true
      this.rowData = params
    }
    onCreateTryRunSucc() {
      (this.$refs.tryRunShow as any).showDialog = false
      this.rowData = {}
      this.closeHandle()
      this.$emit('close')
    }
    onQuery(params: any) {
      const { cargoType, clearCycle, deliverComplexity, distLoc, f1, f2, keyWords, lineQuality, loadDifficulty, model, repoLoc, stability, workRange } = params
      const distInfo = this.composePCC(distLoc)
      const repoInfo = this.composePCC(repoLoc)
      // const workHours = workRange ? workRange.split(',')
      this.params = {
        carTypeList: model || null,
        cargoTypeList: cargoType || null,
        expectAccountingPeriodList: clearCycle || null,
        expectStabilityTemporaryList: stability || null,
        expectedFreightTripStart: f1 || null,
        expectedFreightTripEnd: f2 || null,
        heavyLiftingList: loadDifficulty || null,
        distributionWayList: deliverComplexity || null,
        labelTypeList: lineQuality || null,
        lineId: keyWords || null,
        driverId: this.driverId,
        workHours: workRange,
        warehouseLocation: repoInfo,
        deliveryArea: distInfo
      }
      this.isAll = false
      this.isLock = false
      this.queryData()
    }
    // 组装省市区
    composePCC(selections: any) {
      if (Array.isArray(selections)) {
        return Array.isArray(selections[0]) ? selections : [selections]
      } else {
        return []
      }
    }
    loadMoreHandle() {
      if (!this.isAll) {
        this.queryData(true)
      }
    }
    queryData(append?: boolean) {
      if (append) {
        this.params = Object.assign({}, this.params, {
          shownLines: this.lineTableData.map(v => v.lineId)
        })
        this.pageInfo.page += 1
      } else {
        this.lineTableData = []
        this.pageInfo = { ...pageInfo }
      }
      const params: any = { ...this.params }
      Object.keys(params).forEach((k: any) => {
        if (Array.isArray(params[k])) {
          params[k] = params[k].filter((v: any) => !!v)
        }
      })
      MatchLineListForDriver(Object.assign({}, params, this.pageInfo)).then((res: any) => {
        res = res.data || {}
        if (res.success) {
          const list = res.data || []
          if (list.length < this.pageInfo.limit) {
            this.isAll = true
          }
          this.lineTableData = append ? this.lineTableData.concat(list) : list
          if (this.lineTableData.length < this.pageInfo.limit) {
            this.isLock = true
          }
          this.total = (res.page || {}).total
        } else {
          this.$message({ type: 'error', message: res.errorMsg })
        }
      })
    }
    tagSuccessHandle(data:any, id:any) {
      let index = this.driverTableData.findIndex((item:any) => {
        return item.driverId === id
      })
      // this.getItemData(id, index, data)
    }
    async getItemData(driverId:string, index:number, labelInfo:IState) {
      try {
        const params = { driverInfo: driverId }
        const { data: res } = await queryMatchDriverForMatchLine(params)
        if (res.success) {
          this.driverTableData[index] = {
            ...res.data,
            ...labelInfo.driverLabelRemarksVO
          }
        } else {
          this.$message.warning(res.errorMsg)
        }
      } catch (err) {
        console.log('err:', err)
      }
    }
    mounted() {
    }
}
</script>
<style lang="scss" scoped>
.drawerModel{
  padding-bottom: 20px;
  background: #fff;
}
  .drawerBox {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding-bottom: 30px;
    ::v-deep .el-drawer{
      overflow: initial;
      //background: #e6e9f0;
    }
  }
  .departLine{
    padding: 20px 30px;
    background: #fff;
    border-bottom:10px solid #e6e9f0
  }
  .matchDriver{
    background: #fff;
    //padding-bottom: 20px;
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
