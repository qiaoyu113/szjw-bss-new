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
      :driver-id="driverData.driverId"
      @on-success="setSuccess"
    />
    <CreateTryRun
      ref="tryRunShow"
      :obj.sync="rowData"
      @success="createTryRunSuccess"
    />
    <DetailDialog
      actived="third"
      :driver-id="driverData.driverId"
      :dialog-table-visible.sync="detailDialog"
    />
  </section>
</template>

<script lang="ts">
import SearchKeyWords from './SearchKeyWords.vue'
import AtableDriver from '../../chauffeurList/components/Atable.vue'
import SetTag from './SetTag.vue'
import { queryMatchDriverForMatchLine } from '@/api/departCenter'
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
  private rowData:any = {}
  private driverData:any = {}
  private listQueryLine:IState = {}
  private driverTableData:IState[] = [] // 司机列表
  private detailDialog:Boolean = false
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
    return ret
  }
  setTagHandle(row:any) {
    (this.$refs.tagShow as any).isShow = true
    this.driverData = row
  }
  setCallHandle(data:any) {
    let phone = data.driverPhone
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
    this.rowData.driverId = data.driverId
    this.rowData.matchType = 2
  }
  detailHandle(row:any) {
    this.detailDialog = true
    this.driverData = row
  }
  // 获取列表数据
  searchData(data:any) {
    this.pageSize = 1
    this.driverTableData = []
    this.listQueryLine = data
    this.getLists()
  }
  async getLists() {
    try {
      this.listQueryLine.lineId = 'XL202011070277' // this.rowData.lineId
      this.listQueryLine.page = this.pageSize
      this.listQueryLine.limit = 10
      let notIncludedDriverIds:any = []
      this.driverTableData.forEach((item:any) => {
        notIncludedDriverIds.push(item.driverId)
      })
      this.listQueryLine.notIncludedDriverIds = notIncludedDriverIds.length === 0 ? null : notIncludedDriverIds
      this.$emit('on-loading', true)
      let { data: res } = await queryMatchDriverForMatchLine(this.params(this.listQueryLine))
      if (res.success) {
        this.driverTableData = [...this.driverTableData, ...res.data]
        if (res.data.length < 10) {
          this.$emit('on-end')
        }
        if (this.driverTableData.length < 10 && this.pageSize === 1) {
          this.$emit('on-lock')
        }
        console.log(this.driverTableData)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail fail:${err}`)
    } finally {
      this.$emit('on-loading', false)
    }
  }
  // 从缓存获取线路信息
  getLineInfoFromStorage() {
    let str = sessionStorage.getItem(lineKey) || ''
    if (str) {
      let obj:IState = JSON.parse(str) || {}
      this.rowData = obj
    }
  }
  // 瀑布流加载
  getMoreData() {
    if (this.driverTableData.length > 9) {
      this.pageSize++
      this.getLists()
    } else {
      this.$emit('on-end')
    }
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
  // 创建试跑意向成功
  createTryRunSuccess() {
    setTimeout(() => {
      this.$router.go(0)
    }, 1000)
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
