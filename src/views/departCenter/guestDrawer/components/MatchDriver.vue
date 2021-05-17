<template>
  <section class="matchDriver">
    <!-- 搜索项 -->
    <SearchKeyWords
      ref="searchKeyWords"
      @on-search="searchData"
    />
    <h3>线路匹配司机</h3>
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
  private notIncludedDriverIds:IState[] = []
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
    this.notIncludedDriverIds = []
    this.listQueryLine = data
    this.$emit('on-reset')
    this.getLists()
  }
  async getLists() {
    try {
      this.listQueryLine.lineId = this.rowData.lineId
      this.listQueryLine.page = this.pageSize
      this.listQueryLine.limit = 10
      this.listQueryLine.notIncludedDriverIds = this.notIncludedDriverIds.length === 0 ? null : this.notIncludedDriverIds
      this.listQueryLine.busiType = (this.listQueryLine.busiType && this.listQueryLine.busiType.indexOf('') === -1) ? this.listQueryLine.busiType : null
      this.listQueryLine.carTypeList = (this.listQueryLine.carTypeList && this.listQueryLine.carTypeList.indexOf('') === -1) ? this.listQueryLine.carTypeList : null
      this.listQueryLine.distributionWay = this.listQueryLine.distributionWay ? this.listQueryLine.distributionWay : null
      this.listQueryLine.cargoType = (this.listQueryLine.cargoType && this.listQueryLine.cargoType.indexOf('') === -1) ? this.listQueryLine.cargoType : null
      this.listQueryLine.handlingDifficulty = (this.listQueryLine.handlingDifficulty && this.listQueryLine.handlingDifficulty.indexOf('') === -1) ? this.listQueryLine.handlingDifficulty : null
      this.listQueryLine.settlementCycle = (this.listQueryLine.settlementCycle && this.listQueryLine.settlementCycle.indexOf('') === -1) ? this.listQueryLine.settlementCycle : null
      let params = { ...this.listQueryLine }
      params.expectStabilityTemporary = (this.listQueryLine.expectStabilityTemporary && this.listQueryLine.expectStabilityTemporary.indexOf('') === -1) ? this.listQueryLine.expectStabilityTemporary[0] : null
      let { data: res } = await queryMatchDriverForMatchLine(this.params(params))
      if (res.success) {
        res.data.forEach((item:any) => {
          this.notIncludedDriverIds.push(item.driverId)
        })
        this.driverTableData = [...this.driverTableData, ...res.data]
        if (res.data.length < 10) {
          this.$emit('on-end')
        }
        if (this.driverTableData.length < 10 && this.pageSize === 1) {
          this.$emit('on-lock')
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail fail:${err}`)
      if (this.driverTableData.length < 10 && this.pageSize === 1) {
        this.$emit('on-lock')
      }
    } finally {
      console.log('')
    }
  }
  async getItemData(driverId:string, index:number, labelInfo:IState) {
    try {
      const params = { driverInfo: driverId, lineId: this.rowData.lineId }
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
      this.getLists()
    } else {
      this.$emit('on-end', true)
    }
  }
  // 打标签成功
  setSuccess(data:any, driverId:string) {
    let index = this.driverTableData.findIndex((item:any) => {
      return item.driverId === driverId
    })
    this.getItemData(driverId, index, data)
  }
  // 创建试跑意向成功
  createTryRunSuccess() {
    setTimeout(() => {
      this.$router.go(0)
    }, 500)
  }
  mounted() {
    this.getLineInfoFromStorage()
  }
}
</script>
<style lang="scss" scoped>
.matchDriver{
  background: #fff;
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
