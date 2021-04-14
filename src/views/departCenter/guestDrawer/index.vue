<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:34:13
 * @LastEditTime: 2021-04-14 10:34:48
 * @LastEditors: D.C.base
-->
<template>
  <DrawerModel
    v-model="visible"
    @on-close="closeHandle"
  >
    <!-- 撮合线路 -->
    <DepartLine />
    <!-- 撮合匹配的司机列表 -->
    <MatchDriver />
  </DrawerModel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import DrawerModel from '@/components/DrawerModel/index.vue'
import DepartLine from './components/DepartLine.vue'
import MatchDriver from './components/MatchDriver.vue'
@Component({
  components: {
    DrawerModel,
    DepartLine,
    MatchDriver
  }
})
export default class GuestDrawer extends Vue {
  @Prop({ default: false }) private value !: boolean
  private visible : boolean = false // 抽屉显示隐藏
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
  ::v-deep .el-drawer{
    overflow: initial;
    background: #e6e9f0;
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
