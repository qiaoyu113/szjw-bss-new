<template>
  <section class="matchDriver">
    <!-- 搜索项 -->
    <SearchKeyWords
      ref="searchKeyWords"
      @on-search="searchData"
    />
    <h3>司机匹配线路</h3>
    <div class="lineTable">
      <AtableDriver
        ref="tableDriver"
        :list-query="listQuery"
        :is-show-percent="true"
        :driver-table-data="driverTableData"
        :is-more="true"
        :op-type="[-1,3,4,5]"
        @call="setCallHandle"
        @tag="setTagHandle"
        @creatRun="creatRunHandle"
        @detail="detailHandle"
      />
    </div>
    <SetTag
      ref="tagShow"
      @on-success="setSuccess"
    />
    <CreateTryRun
      ref="tryRunShow"
      :obj="rowData"
    />
    <DetailDialog
      actived="third"
      :driver-id="detailId"
      :dialog-table-visible.sync="detailDialog"
    />
  </section>
</template>

<script lang="ts">
import SearchKeyWords from './SearchKeyWords.vue'
import AtableDriver from '../../chauffeurList/components/Atable.vue'
import SetTag from './SetTag.vue'
import { queryMatchDriverForMatchLine } from '@/api/drawer-guest'
import CreateTryRun from '../../guestList/components/CreateTryRun.vue'
import DetailDialog from '../../chauffeurList/components/DetailDialog.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
const lineKey = 'line_row'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    AtableDriver,
    SearchKeyWords,
    SetTag,
    CreateTryRun,
    DetailDialog
  }
})
export default class DepartLine extends Vue {
  private tryRunShow:boolean = false
  private rowData:object = {}
  private listQueryLine:IState = {}
  private driverTableData:IState[] = [] // 司机列表
  private detailDialog:Boolean = false
  private detailId:string = ''
  private pageSize:number = 0
  private listQuery:IState = {}
  params(params:any) {
    let ret:any = {}
    // 过滤空值数据
    for (let prop in params) {
      // eslint-disable-next-line no-prototype-builtins
      if (!params.hasOwnProperty(prop)) continue
      let value = params[prop]
      // eslint-disable-next-line no-undefined
      if (value !== '' && value !== undefined && value !== null && value !== 'null') ret[prop] = value
    }
    console.log(ret)
    return ret
  }
  setTagHandle(row:any) {
    (this.$refs.tagShow as any).isShow = true
    this.rowData = row
    console.log(row)
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
      (this.$refs.tableDriver as any).callPhone(phone, '123')
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消拨打'
      })
    })
  }
  creatRunHandle(data:any) {
    (this.$refs.tryRunShow as any).showDialog = true
    this.rowData = data
  }
  detailHandle() {
    this.detailDialog = true
  }
  // 获取列表数据
  /* async getLists() {
    try {
      this.pageSize++
      let num:number = 3
      // this.driverTableData = []
      for (let i = 0; i < num; i++) {
        let obj:IState = {
          driverName: '张三',
          joinManagerName: '李四',
          driverMatchManagerName: '加盟经理',
          driverId: 'SJ20210415',
          carTypeName: '4.2米厢货',
          carType: 10,
          isNewEnergy: true,
          canBreakingNodriving: true,
          canBreakingTrafficRestriction: false,
          busiTypeName: '共享',
          liveAddressProvinceName: '北京市',
          liveAddressCityName: '北京市',
          liveAddressCountyName: '朝阳区',
          startingPointProvinceName: '湖南省',
          startingPointCityName: '长沙市',
          startingPointCountyName: '芙蓉区',
          deliveryPointProvinceName: '山东省',
          deliveryPointCityName: '济南市',
          deliveryPointCountyName: '历下区',
          expectedFreightMonth: 600,
          expectedFreightTrip: 500,
          expectAccountingPeriodName: '现结',
          intentCargoTypeName: '团购',
          heavyLiftingName: '只装不卸',
          deliveryDifficultyNames: '整车',
          workHours: ['9:00-12:00', '13:00-18:00'],
          expectStabilityTemporaryNames: '稳定',
          driverSituationName: '着急试跑',
          driverStatusName: '已上岗',
          newDealName: '当月新成交',
          isNoviceName: '小白司机',
          tryRunNum: 2,
          followCarNum: 1,
          age: 40,
          drivingLicenceTypeName: 'A1',
          drivingExperience: 2,
          sourceChannelName: '58同城',
          driverPassTime: '2020-11-20',
          driverMatchRemarksName: '不怕累活',
          driverMatchManuallyRemarks: '什么活都可以干'
        }
        obj.isOpen = false
        obj.id = ((this.pageSize - 1) * 3 + i + 1)
        this.driverTableData.push({ ...obj })
      }
      if (this.pageSize > 3) {
        this.$emit('on-end')
      }
    } catch (err) {
      console.log(`get list fail fail:${err}`)
    } finally {
      console.log('')
    }
  } */
  // 获取列表数据
  searchData(data:any) {
    this.pageSize = 1
    this.driverTableData = []
    this.listQueryLine = data
    this.getLists()
    console.log(data)
  }
  async getLists() {
    this.listQueryLine.lineId = 'XL202111070005'
    this.listQueryLine.page = this.pageSize
    this.listQueryLine.limit = 10
    let { data: res } = await queryMatchDriverForMatchLine(this.params(this.listQueryLine))
    if (res.success) {
      this.driverTableData = [...this.driverTableData, ...res.data]
      if (res.data.length < 10) {
        this.$emit('on-end')
      }
      console.log(this.driverTableData)
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  // 从缓存获取线路信息
  getLineInfoFromStorage() {
    let str = sessionStorage.getItem(lineKey) || ''
    if (str) {
      let obj:IState = JSON.parse(str) || {}
      this.rowData = obj
      console.log(obj)
    }
  }
  // 瀑布流加载
  getMoreData() {
    this.pageSize++
    this.getLists()
  }
  // 初始化数据
  initData() {
    this.pageSize = 1
    this.driverTableData = []
    this.getLists()
  }
  // 打标签成功
  setSuccess(data:any, driverId:string) {
    let index = this.driverTableData.findIndex((item:any) => {
      return item.driverId === driverId
    })
    this.driverTableData[index].canBreakingNodriving = data.canBreakingNodriving // 司机能否闯禁行
    this.driverTableData[index].canBreakingTrafficRestriction = data.canBreakingTrafficRestriction // 司机能否闯限行
    this.driverTableData[index].expectAccountingPeriod = data.expectAccountingPeriod // 结算周期
    this.driverTableData[index].expectAccountingPeriodName = data.expectAccountingPeriodName // 结算周期
    this.driverTableData[index].deliveryDifficulty = data.deliveryDifficulty // 配送复杂度
    this.driverTableData[index].deliveryDifficultyNames = data.deliveryDifficultyNames // 配送复杂度
    this.driverTableData[index].expectStabilityTemporary = data.expectStabilityTemporary // 稳定/临时
    this.driverTableData[index].expectStabilityTemporaryNames = data.expectStabilityTemporaryNames // 稳定/临时
    this.driverTableData[index].heavyLifting = data.heavyLifting // 装卸难度
    this.driverTableData[index].heavyLiftingName = data.heavyLiftingName // 装卸难度
    console.log(this.driverTableData)
  }
  mounted() {
    this.getLineInfoFromStorage()
  }
}
</script>
<style lang="scss" scoped>
.matchDriver{
  background: #fff;
  padding-bottom: 20px;
  h3{
    padding: 0 30px;
    margin-top: 15px;
  }
  .lineTable{
    width:100%;
    padding: 0 30px;
    overflow: auto;
  }
}
</style>
