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
        <SearchKeyWords @query="onQuery" />
        <div style="font-size: 16px; font-weight: bold; margin: 16px 30px;">
          司机匹配线路
        </div>
        <div class="lineTable">
          <AtableLine
            ref="lineTableDrawer"
            :line-table-data="lineTableData"
            :is-show-percent="true"
            obj="{}"
            :is-more="true"
            @tryRun="onCreateTryRun"
          />
        </div>
      </section>
      <SetTag ref="tagShow" />
    </Scroll>
    <CreateTryRun
      ref="tryRunShow"
      :obj="rowData"
    />
    <DetailDialog
      actived="third"
      :driver-id="detailId"
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
import SetTag from './components/SetTag.vue'
import { AppModule } from '@/store/modules/app'
import { MatchLineListForDriver } from '@/api/departCenter'
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
    private tagShow:boolean = false
    private pageSize:number = 1
    private tryRunShow:boolean = false
    private showTryRun:boolean = false
    private rowData:object = {}
    private lineTableData:IState[] = [] // 线路列表
    private driverTableData:IState[] = [] // 司机列表
    private params: object = {}
    private listQueryLine:IState = {
      labelType: '',
      isBehavior: '',
      isRestriction: '',
      status: '',
      start: '',
      end: '',
      f1: '',
      f2: ''
    }
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
    private detailId:string = ''
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
        (this.$refs.driverDrawer as any).getStorage();
        (this.$refs.lineTableDrawer as any).getDriverInfoFromStorage()
      }, 20)
      this.queryData()
    }
    onCreateTryRun(data:any) {
      (this.$refs.tryRunShow as any).showDialog = true
      this.rowData = data
    }
    onQuery(params: any) {
      this.params = params
      this.queryData()
    }
    loadMoreHandle() {
      MatchLineListForDriver(Object.assign({}, this.params)).then((res: any) => {
        console.log(res)
      }) // todo  /*, this.pageInfo */
    }
    queryData() {
      MatchLineListForDriver(this.params).then((res: any) => {
        res = res.data || {}
        console.log(res)
        if (res.success) {
          this.lineTableData = res.data || []
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
