<template>
  <el-drawer
    class="drawerBox"
    :visible.sync="visible"
    :with-header="false"
    :modal-append-to-body="false"
    size="100%"
    top="84px"
    :modal="false"
    :destroy-on-close="true"
    @close="closeHandle"
    @open="handleOpenClick"
  >
    <div class="drawerContent">
      <slot />
    </div>
    <a
      href="javascript:;"
      class="actionBtn"
      @click="closeHandle"
    >
      <i class="el-icon-d-arrow-right" />
    </a>
    <div
      class="maskModel"
      @click="closeHandle"
    />
  </el-drawer>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'DrawerModel'
})
/**
   * @property  {boolean}    value           true:显示  false:隐藏
   */
export default class DrawerModel extends Vue {
  @Prop({ default: true }) private value !: boolean
  private visible : boolean = false // 抽屉显示隐藏
  @Watch('value')
  onValueChanged(val: boolean, oldVal: boolean) {
    this.visible = val
  }
  // 关闭回调事件
  closeHandle() {
    this.visible = false
    this.$emit('input', false)
    this.$emit('on-close')
  }
  handleOpenClick() {
    this.$emit('open')
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body{
  height: 100%;
  background:rgba(0,0,0,0.5);
  padding-left: 18%;
  >div{
    height: 100%;
    overflow: auto;
    background:#e6e9f0 ;
  }
}
.isDrawer .el-drawer__wrapper{
  top: 84px;
}
::v-deep .el-drawer{
    background: transparent;
    box-shadow: none;
}
.drawerBox {
  width: 100%;
  height: 100%;
  ::v-deep .el-drawer{
    overflow: auto!important;
    //background: #e6e9f0;
  }
}
.maskModel{
  width: 18%;
  height: 100%;
  position: absolute;
  left: 0;
  top:0;
  opacity: 0;
}
.actionBtn{
    display: flex;
    width: 25px;
    height: 60px;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: calc(18% - 25px);
    top:50%;
    transform: translateY(-50%);
    background: #fff;
    border-radius: 10px 0 0 10px;
    z-index: 1000;
  }
</style>
