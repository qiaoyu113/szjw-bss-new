<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:34:13
 * @LastEditTime: 2021-04-27 19:25:02
 * @LastEditors: D.C.base
-->
<template>
  <DrawerModel
    v-model="visible"
    @on-close="closeHandle"
    @open="handleOpenClick"
  >
    <!-- 撮合线路 -->
    <section class="departLine">
      <h3>待撮合线路</h3>
      <AtableLine
        ref="lineDrawer"
        :list-query="listQueryLine"
        obj="{}"
        :is-more="true"
        @cancelTryRun="handleCancelTryRun1"
      />
    </section>
    <!-- 撮合匹配的司机列表 -->
    <MatchDriver />
  </DrawerModel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SearchKeyWords from './components/SearchKeyWords.vue'
import DrawerModel from '@/components/DrawerModel/index.vue'
import AtableLine from '../guestList/components/Atable.vue'
import MatchDriver from './components/MatchDriver.vue'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
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
  $eventBus: any
  @Watch('value')
  onValueChanged(val: boolean, oldVal: boolean) {
    this.visible = val
    this.$eventBus.$emit('setIndex', val)
  }
  closeHandle() {
    this.visible = false
    this.$emit('input', false);
    // 关闭抽屉删掉线路表格的数据
    (this.$refs.lineDrawer as any).removeTableInfo()
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
  /* ::v-deep .el-drawer{
    overflow: initial;
    background: #e6e9f0;
  } */
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
