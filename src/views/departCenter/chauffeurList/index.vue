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
      :list-query="listQuery"
      @status="handleStatusChange"
    />
    <!-- 表格 -->
    <div class="table_box">
      <Atable
        ref="Atable"
        :table-data="tableData"
        :is-show-percent="false"
        :is-more="false"
        :op-type="[2,1,5,6]"
        @call="call"
        @tag="tag"
        @detail="detail"
        @depart="depart"
        @checkData="checkData"
        @allotSome="allotSome"
        @chooseCity="chooseCity"
        @closeLoading="listLoading = false"
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
    <CallPhone
      :show-dialog.sync="callObj.callPhoneDio"
      :clue-status="callObj.clueType"
      :phone="callObj.phone"
      :clue-id="callObj.clueId"
      @success="getLists"
    />
    <SetTag ref="setTag" />
    <DetailDialog
      actived="third"
      :driver-id="detailId"
      :dialog-table-visible.sync="detailDio"
    />
    <ChauffeureDrawer v-model="showDrawer" />
    <allotDio
      :dialog-visible.sync="allotDialog"
      :allot-title="allotTitle"
      @close="closeAllot"
    />
    <chooseCity :dialog-visible.sync="cityDio" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Atable from './components/Atable.vue'
import CallPhone from '@/views/clue/components/CallPhone/index.vue'
import DetailDialog from './components/DetailDialog.vue'
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
    CallPhone,
    SearchForm,
    SetTag,
    DetailDialog,
    ChauffeureDrawer,
    allotDio,
    chooseCity
  }
})
export default class extends Vue {
  private listQuery: IState = {
    busiType: null,
    carType: '',
    carKind: null,
    driverId: '',
    address: '',
    hard: null,
    hope: null,
    cycle: null,
    rents: [],
    time: [],
    status: ''
  };
  private listLoading: boolean = false;
  private callPhoneDio: boolean = false;
  private clueType: number = 0;
  private clueId: string = '';
  private phone: string = '';
  private tableData: IState[] = [{}, {}];
  private callObj: IState = {
    callPhoneDio: false,
    clueType: 0,
    clueId: '',
    phone: ''
  };
  private detailDio:Boolean = false
  private cityDio:Boolean = false
  private allotDialog:Boolean = false
  private allotTitle:string = ''
  private detailId:string = ''
  private showTag:Boolean = false
  private showDrawer: Boolean = false
  private allotData:IState[] = []
  private checkOne:IState = {}
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
    console.log(row)
    let phone = '18848885135'
    let repStr = phone.substr(3)
    let newStr = phone.replace(repStr, '********')
    this.$confirm(`将给${newStr}外呼, 请确定是否拨通?`, '外呼提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        console.log(123)
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消拨打'
        })
      })
  }
  tag(row:IState) {
    console.log('tag');
    (this.$refs['setTag'] as any).showDialog = true
  }
  depart() {
    this.showDrawer = true
  }
  checkData(data:IState[]) {
    this.allotData = data
  }
  allotSome(val:IState) {
    this.allotTitle = '分配司撮'
    this.allotDialog = true
    this.checkOne = val
  }
  chooseCity(val:IState) {
    this.cityDio = true
    this.checkOne = val
  }
  detail() {
    console.log('detail')
    this.detailDio = true
  }
  closeAllot() {
    (this.$refs.Atable as any).$refs.chauffeurTable.clearSelection()
  }
  // 获取列表
  async getLists() {
    try {
      console.log('getList', this.listQuery)
      this.listLoading = true
      setTimeout(() => {
        (this.$refs.Atable as any).getLists()
      }, 1000)
    } catch (err) {
      console.log(`getlists fail:${err}`)
    } finally {
      // this.listLoading = false
      //
    }
  }
  // 客邀状态变化
  handleStatusChange(val: string | number) {
    console.log('xxx:', val)
  }
  // 线路名称/编号 模糊搜索
  querySearch(queryString: string, cb: Function) {
    // eslint-disable-next-line standard/no-callback-literal
    cb([])
  }
  // 分页
  handlePageSizeChange(page: number, limit: number) {
    if (page) {
      this.page.page = page
    }
    if (limit) {
      this.page.limit = limit
    }
    this.getLists()
  }
  init() {
    this.getLists()
  }
  activated() {
    this.getLists()
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
