<template>
  <div
    v-loading.body="listLoading"
    class="chauffeurListContainer"
    :style="{'overflow': showDrawer ?'hidden':'auto'}"
    :class="{
      p15: isPC,
      isDrawer: showDrawer
    }"
  >
    <!-- 查询表单 -->
    <searchForm
      ref="searchForm"
      :list-query="listQuery"
      @status="handleStatusChange"
    />
    <!-- 表格 -->
    <div class="table_box">
      <Atable
        ref="Atable"
        :driver-table-data="tableData"
        :is-show-percent="false"
        :is-more="false"
        :op-type="[2,1,5,6]"
        @call="call"
        @tag="tag"
        @depart="depart"
        @checkData="checkData"
        @allotSome="allotSome"
        @chooseCity="chooseCity"
      />
      <pagination
        :operation-list="[]"
        :total="page.total"
        :page.sync="page.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :limit.sync="page.limit"
        @pagination="handlePageSizeChange"
      />
    </div>
    <SetTag
      ref="setTag"
      :driver-id="checkOne.driverId"
      @on-success="listSuccess"
    />
    <ChauffeureDrawer v-model="showDrawer" />
    <allotDio
      :dialog-visible.sync="allotDialog"
      :allot-title="allotTitle"
      :driver-id-list="driverIdList"
      @close="closeAllot"
    />
    <chooseCity
      :dialog-visible.sync="cityDio"
      :options="cityOptions"
      :obj="checkOne"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { matchDriverInfo, getDriverWorkCity } from '@/api/departCenter'
import Atable from './components/Atable.vue'
import { showWork, HandlePages } from '@/utils'
import { delayTime } from '@/settings'
import Pagination from '@/components/Pagination/index.vue'
import SearchForm from './components/searchForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import SetTag from '../guestDrawer/components/SetTag.vue'
import ChauffeureDrawer from '../chauffeurDrawer/index.vue'
import allotDio from './components/allotDio.vue'
import chooseCity from './components/chooseCity.vue'
  interface PageObj {
    page: number;
    limit: number;
    total?: number;
  }

  interface IState {
    [key: string]: any;
  }
  @Component({
    name: 'ChauffeurList',
    components: {
      Atable,
      Pagination,
      SearchForm,
      SetTag,
      ChauffeureDrawer,
      allotDio,
      chooseCity
    }
  })
export default class extends Vue {
    private tableData:IState[] = [];
    private listQuery: IState = {
      busiType: '',
      carType: '',
      oilElectricityRequirement: '',
      driverId: '',
      address: [],
      heavyLifting: '',
      expectStabilityTemporary: '',
      expectAccountingPeriod: '',
      rents: [],
      time: [],
      status: 3,
      driverMatchManagerId: '',
      hasDriverMatchManager: ''
    };
    private listLoading: boolean = false;
    private callPhoneDio: boolean = false;
    private clueId: string = '';
    private phone: string = '';
    private cityDio:Boolean = false
    private allotDialog:Boolean = false
    private allotTitle:string = ''
    private showTag:Boolean = false
    private showDrawer: Boolean = false
    private allotData:IState[] = []
    private checkOne:IState = {}
    private cityOptions:IState[] = []
    private driverIdList:IState[] = []
    // 表格分页
    private page: PageObj = {
      page: 1,
      limit: 30,
      total: 0
    };
    get isPC() {
      return SettingsModule.isPC
    }

    call(row:IState) {
      let phone = row.driverPhone || ''
      let repStr = phone.substr(3)
      let newStr = phone.replace(repStr, '********')
      this.$confirm(`将给${newStr}外呼, 请确定是否拨通?`, '外呼提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          (this.$refs.Atable as any).callPhone(phone, row.driverId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消拨打'
          })
        })
    }
    tag(val:IState) {
      this.checkOne = val;
      (this.$refs.setTag as any).isShow = true
    }
    depart() {
      this.showDrawer = true
    }
    checkData(data:IState[]) {
      this.allotData = data
    }
    allotSome(val:IState) {
      this.allotTitle = '分配司撮'
      this.checkOne = val
      this.driverIdList.push(this.checkOne.driverId)
      this.allotDialog = true
    }
    chooseCity(val:IState) {
      this.cityDio = true
      this.checkOne = val
      this.getCityChoose()
    }
    closeAllot() {
      (this.$refs.Atable as any).$refs.chauffeurTable.clearSelection()
    }
    listSuccess() {
      setTimeout(() => {
        this.getLists()
      }, delayTime)
    }
    async getCityChoose() {
      try {
        let params = {
          frontValue: 14
        }
        let { data: res } = await getDriverWorkCity(params)
        if (res.success) {
          let cityOptions = res.data.map((item:IState) => {
            return { label: `${item.city}(${item.name}${item.phone})`, value: JSON.stringify({ dmId: item.id, code: item.cityCode }) }
          })
          this.cityOptions.push(...cityOptions)
        } else {
          this.$message.warning(res.errorMsg)
        }
      } catch (err) {
        console.log(err)
      }
    }

    dealParams(listQuery:IState) {
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      listQuery.busiType !== '' && (params.busiType = listQuery.busiType)
      listQuery.carType !== '' && (params.carType = listQuery.carType)
      listQuery.oilElectricityRequirement !== '' && (params.oilElectricityRequirement = listQuery.oilElectricityRequirement)
      listQuery.driverId !== '' && (params.driverId = listQuery.driverId)
      listQuery.heavyLifting !== '' && (params.heavyLifting = listQuery.heavyLifting)
      listQuery.expectStabilityTemporary !== '' && (params.expectStabilityTemporary = [listQuery.expectStabilityTemporary])
      listQuery.expectAccountingPeriod !== '' && (params.expectAccountingPeriod = listQuery.expectAccountingPeriod)
      if (listQuery.address.length > 1) {
        params.liveAddressProvince = listQuery.address[0]
        params.liveAddressCity = listQuery.address[1]
        listQuery.address[2] && (params.liveAddressCounty = listQuery.address[2])
      }
      if (listQuery.rents.length > 1) {
        params.expectedFreightTripStart = +listQuery.rents[0]
        params.expectedFreightTripEnd = +listQuery.rents[1]
      }
      if (listQuery.time.length > 1) {
        params.workHourStart = listQuery.time[0]
        params.workHourEnd = listQuery.time[1]
      }
      listQuery.driverMatchManagerId !== '' && (params.driverMatchManagerId = listQuery.driverMatchManagerId)
      listQuery.hasDriverMatchManager !== '' && (params.hasDriverMatchManager = listQuery.hasDriverMatchManager)
      listQuery.status !== '' && (params.driverStatus = listQuery.status)
      return params
    }

    // 获取列表数据
    async getLists() {
      try {
        this.listLoading = true
        const params = this.dealParams(this.listQuery)
        let { data: res } = await matchDriverInfo(params)
        if (res.success) {
          this.tableData = res.data
          let page = await HandlePages(res.page)
          this.page.total = page.total
        } else {
          this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`get list fail fail:${err}`)
      } finally {
        this.listLoading = false
      }
    }
    // 客邀状态变化
    handleStatusChange(val: string | number) {
      this.getLists()
    }
    // 线路名称/编号 模糊搜索
    querySearch(queryString: string, cb: Function) {
      // eslint-disable-next-line standard/no-callback-literal
      cb([])
    }
    // 分页
    handlePageSizeChange(page:PageObj) {
      if (page.page) {
        this.page.page = page.page
      }
      if (page.limit) {
        this.page.limit = page.limit
      }
      setTimeout(() => {
        this.getLists()
      }, 20)
    }
    init() {
      let id:any = this.$route.query.id
      if (id) {
        this.listQuery.driverId = id as string
        this.depart();
        (this.$refs['searchForm'] as any).getDriverInfo(id)
      }
      this.getLists()
    }
    activated() {
      this.init()
    }
    mounted() {
      this.init()
    }
}

</script>
<style lang="scss" scoped>
  .chauffeurListContainer {
    height:100%;
    .table_box {
      padding: 30px 30px 0px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
</style>
