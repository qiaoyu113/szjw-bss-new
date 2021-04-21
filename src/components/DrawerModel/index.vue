<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:34:13
 * @LastEditTime: 2021-04-21 14:11:09
 * @LastEditors: D.C.base
-->
<template>
  <el-drawer
    class="drawerBox"
    :visible.sync="visible"
    :with-header="false"
    :modal-append-to-body="false"
    size="80%"
    top="84px"
    @close="closeHandle"
  >
    <div class="">
      <slot />
    </div>
    <a
      href="javascript:;"
      class="actionBtn"
      @click="closeHandle"
    >
      <i class="el-icon-d-arrow-left" />
    </a>
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
  @Prop({ default: false }) private value !: boolean
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
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.drawerBox {
  // margin-top:84px;
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
