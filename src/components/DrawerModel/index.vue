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
    @close="closeHandle(false)"
    @open="handleOpenClick"
  >
    <div
      class="drawerContent"
      @mousemove="onMouseMove"
      @click="onClick"
    >
      <slot />
    </div>
    <a
      href="javascript:;"
      class="actionBtn"
      @click="closeHandle(false)"
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
  private interval: any = null
  private timeout: any = null
  private isTimeout: boolean = false
  private time = 0
  @Watch('value')
  onValueChanged(val: boolean, oldVal: boolean) {
    this.visible = val
  }
  // 关闭回调事件
  closeHandle(shouldUpdate: boolean) {
    this.visible = false
    clearInterval(this.interval)
    clearTimeout(this.timeout)
    this.$emit('input', false)
    this.$emit('on-close')
    if (shouldUpdate) {
      this.$router.go(0)
    }
  }
  handleOpenClick() {
    this.$emit('open')
    clearInterval(this.interval)
    clearTimeout(this.timeout)
    this.isTimeout = false
    this.startInterval()
  }
  startInterval() {
    this.time = 0
    this.isTimeout = false
    this.interval = setInterval(() => {
      if (this.time > 30 * 60 * 1000) {
        clearInterval(this.interval)
        this.isTimeout = true
      } else {
        this.time += 100
      }
    }, 100)
  }
  onMouseMove() {
    clearTimeout(this.timeout)
    clearInterval(this.interval)
    if (this.isTimeout) {
      this.$confirm('此页面已失效，请重新打开', '提示', {
        type: 'warning',
        callback: () => {
          this.isTimeout = true
          this.closeHandle(true)
        }
      })
    } else {
      this.timeout = setTimeout(() => {
        this.time = 0
        this.startInterval()
      }, 1000)
    }
  }
  onClick() {
    this.onMouseMove()
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
