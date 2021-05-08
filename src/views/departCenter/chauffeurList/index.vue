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
        @detail="detail"
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
    private tableData:IState[] = [];
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
    private callObj: IState = {
      callPhoneDio: false,
      clueType: 0,
      clueId: '',
      phone: ''
    };
    private detailDio:Boolean = true
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
      let phone = '18838928206'
      let repStr = phone.substr(3)
      let newStr = phone.replace(repStr, '********')
      this.$confirm(`将给${newStr}外呼, 请确定是否拨通?`, '外呼提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          (this.$refs.Atable as any).callPhone(phone, '123')
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
      this.allotDialog = true
      this.checkOne = val
    }
    chooseCity(val:IState) {
      this.cityDio = true
      this.checkOne = val
    }
    detail() {
      this.detailDio = true
    }
    closeAllot() {
      (this.$refs.Atable as any).$refs.chauffeurTable.clearSelection()
    }

    // 获取列表数据
    async getLists() {
      try {
        this.listLoading = true
        let num:number = 3
        this.tableData = []
        for (let i = 0; i < num; i++) {
          let obj:IState = {
            driverName: '张道松',
            manager: '李加盟经理',
            driverId: 'SJ20210415',
            phoneNum: '132000000000',
            a: '京东传站',
            b: '李外线经理',
            lineId: 'XL202012300377',
            c: '3',
            d: '4.2米厢货',
            e: '油车',
            f: '能闯禁行',
            g: '能闯限行行',
            h: '共享',
            p1: '湖南省',
            c1: '长沙市',
            c2: '短沙县',
            m1: 500,
            time: i ? '9:00~12:00' : '9:00~12:00,16:00~20:00',
            percent: 80,
            id: 1,
            arr: [
              '商贸信息',
              '已创建30条线路',
              '15条在跑',
              '5条线路已掉线',
              '3条线路在上架找车'
            ],
            brr: [
              '1个点',
              '每日1趟',
              '每月12天',
              '每趟120公里',
              '走高速',
              '回单',
              '城配线',
              '稳定(2个月)'
            ],
            crr: [
              '已发起3次客邀',
              '已创建意向3次',
              '试跑失败2次',
              '司机爽约1次',
              '扭头就走1次',
              '掉线1次'
            ]
          }
          obj.isOpen = false
          obj.id = (i + 1)
          obj.driverName = obj.driverName + obj.id
          this.tableData.push({ ...obj })
        }
      } catch (err) {
        console.log(`get list fail fail:${err}`)
      } finally {
        setTimeout(() => {
          this.listLoading = false
        }, 1000)
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
