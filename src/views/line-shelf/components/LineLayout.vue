<template>
  <div class="top-tabrs">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="新线维护"
        name="0"
      >
        <span slot="label">
          <el-badge
            :value="dnamicLable.lineShelfNewNum>999?'999+':dnamicLable.lineShelfNewNum"
            class="item"
          > 新线维护 </el-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane
        label="冗余线路盘点"
        name="1"
      >
        <span slot="label">
          <el-badge
            :value="dnamicLable.redundantNewNum>999?'999+':dnamicLable.redundantNewNum"
            class="item"
          > 冗余线路盘点 </el-badge>
        </span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'LineLayout'
})
export default class extends Vue {
  @Prop({ default: '0' }) active!: string
  @Prop({ default: () => { return { lineShelfNewNum: 0, redundantNewNum: 0 } } }) dnamicLable!:object
  get activeName() {
    return this.active
  }
  set activeName(value) {
    this.$emit('update:active', value)
  }
}
</script>

<style lang="scss" scoped>
.top-tabrs {
  font-size: 18px;
  border-bottom: 8px solid #f7f8f9;
  padding: 0 12px;
  padding-top: 8px;
  ::v-deep .is-active {
    color: #f9932c !important;
  }
  ::v-deep .el-tabs__item:hover {
    color: #f9932c !important;
  }
  ::v-deep .el-tabs__item {
    font-size: 15px;
  }
  ::v-deep.el-tabs__active-bar {
    height: 6px;
    background: #fdc687;
    border-radius: 2px;
  }
  ::v-deep .el-tabs__nav-wrap {
    &::after {
      border: none;
      height: 0;
    }
  }
  .item {
    ::v-deep .is-fixed {
      right: 0;
      top: 8px;
    }
  }
}
</style>
