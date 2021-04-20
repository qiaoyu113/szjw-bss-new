<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:34:13
 * @LastEditTime: 2021-04-20 18:16:04
 * @LastEditors: D.C.base
-->
<template>
  <DrawerModel
    v-model="visible"
    @on-close="closeHandle"
  >
    <!-- 撮合线路 -->
    <section class="departLine">
      <h3>待撮合线路</h3>
      <AtableLine
        :list-query="listQueryLine"
        :is-more="true"
      />
    </section>
    <!-- 撮合匹配的司机列表 -->
    <section class="matchDriver">
      <!-- 搜索项 -->
      <SearchKeyWords />
      <h3>司机匹配线路</h3>
      <div class="lineTable">
        <AtableDriver
          :list-query="listQueryDriver"
          :is-more="true"
        />
      </div>
    </section>
    <SetTag v-if="showTag" />
  </DrawerModel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SearchKeyWords from './components/SearchKeyWords.vue'
import DrawerModel from '@/components/DrawerModel/index.vue'
import AtableLine from './components/AtableLine.vue'
import AtableDriver from './components/AtableDriver.vue'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    DrawerModel,
    SearchKeyWords,
    AtableLine,
    AtableDriver
  }
})
export default class GuestDrawer extends Vue {
  @Prop({ default: false }) private value !: boolean
  private visible : boolean = false // 抽屉显示隐藏
  private showTag : boolean = false // 司机打标签显示隐藏
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
  @Watch('value')
  onValueChanged(val: boolean, oldVal: boolean) {
    this.visible = val
  }
  closeHandle() {
    this.visible = false
    this.$emit('input', false)
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
    background: #e6e9f0;
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
