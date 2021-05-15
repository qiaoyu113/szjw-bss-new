<template>
  <DrawerModel
    v-model="visible"
    @on-close="closeHandle"
    @open="handleOpenClick"
  >
    <div v-loading.body="listLoading">
      <Scroll
        :on-reach-bottom="loadMoreHandle"
        :stop-slide="disabled"
        :is-lock="isLock"
        :distance-to-edge="50"
      >
        <!-- 撮合线路 -->
        <section class="departLine">
          <h3>待撮合线路</h3>
          <AtableLine
            ref="lineDrawer"
            :line-table-data.sync="lineTableData"
            :is-more="true"
          />
        </section>
        <!-- 撮合匹配的司机列表 -->
        <MatchDriver
          ref="matchDriver"
          @on-loading="loadChange"
          @on-end="disabled=true"
          @on-lock="isLock=true"
          @on-reset="resetScroll"
        />
      </Scroll>
    </div>
  </DrawerModel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SearchKeyWords from './components/SearchKeyWords.vue'
import DrawerModel from '@/components/DrawerModel/index.vue'
import Scroll from '@/components/Scroll/index.vue'
import AtableLine from '../guestList/components/Atable.vue'
import MatchDriver from './components/MatchDriver.vue'
import { AppModule } from '@/store/modules/app'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    Scroll,
    DrawerModel,
    SearchKeyWords,
    AtableLine,
    MatchDriver
  }
})
export default class GuestDrawer extends Vue {
  @Prop({ default: false }) private value !: boolean
  private visible : boolean = false // 抽屉显示隐藏
  private rowData:object = {}
  private listLoading:boolean = false
  private disabled: boolean = false
  private isLock: boolean = false
  private lineTableData:IState[] = [] // 线路列表
  $eventBus: any
  @Watch('value')
  onValueChanged(val: boolean, oldVal: boolean) {
    console.log('works', val)
    this.visible = val
    this.$eventBus.$emit('setIndex', val)
  }
  closeHandle() {
    this.visible = false
    this.$emit('input', false);
    // 关闭抽屉删掉线路表格的数据
    (this.$refs.lineDrawer as any).removeTableInfo();
    ((this.$refs.matchDriver as any).$refs.searchKeyWords as any).resetData()
  }
  // 取消创建试跑意向
  handleCancelTryRun1() {
    (this.$refs.cancelTryRun1 as any).showDialog = true
  }
  handleOpenClick() {
    AppModule.CloseSideBar(false)
    setTimeout(() => {
      (this.$refs.lineDrawer as any).getStorage();
      ((this.$refs.matchDriver as any).$refs.tableDriver as any).getLineInfoFromStorage();
      ((this.$refs.matchDriver as any).$refs.searchKeyWords as any).initData()
    }, 20)
  }
  loadMoreHandle() {
    (this.$refs.matchDriver as any).getMoreData()
  }
  loadChange(status:any) {
    this.listLoading = status
  }
  resetScroll() {
    this.isLock = false
    this.disabled = false
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
}
.departLine{
  padding: 1px 30px 20px;
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
