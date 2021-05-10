<template>
  <section class="matchDriver">
    <!-- 搜索项 -->
    <SearchKeyWords @on-search="searchData" />
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
    <SetTag ref="tagShow" />
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
import CreateTryRun from '../../guestList/components/CreateTryRun.vue'
import DetailDialog from '../../chauffeurList/components/DetailDialog.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
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
  private pageSize:number = 1
  private listQuery:IState = {
    labelType: '',
    isBehavior: '',
    isRestriction: '',
    status: '',
    start: '',
    end: '',
    f1: '',
    f2: ''
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
  async getLists() {
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
  }
  searchData(data:any) {
    this.listQueryLine = data
  }
  mounted() {
    this.getLists()
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
