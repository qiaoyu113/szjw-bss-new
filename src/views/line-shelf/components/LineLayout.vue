<template>
  <div class="top-tabrs">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="新线维护"
        name="0"
      />
      <el-tab-pane
        label="冗余线路盘点"
        name="1"
      />
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'LineLayout'
})
export default class extends Vue {
  @Prop({ default: '0' }) active!:string
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
}
</style>
