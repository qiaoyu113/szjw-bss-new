<template>
  <div class="inputRange">
    <el-input
      v-model.number="modelArr[0]"
      class="input"
      placeholder="最低"
      @blur="changeInput1"
    />
    <span class="icon">~</span>
    <el-input
      v-model.number="modelArr[1]"
      class="input"
      placeholder="最高"
      @blur="changeInput2"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Model, Emit } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'inputRange',
  components: {}
})
export default class extends Vue {
  @Model('sendMessage', { type: Array }) readonly modelArr!: any[]
  private type:number = 0
  private changeInput1(val:number) {
    this.sendMessage()
  }
  private changeInput2(val:number) {
    this.sendMessage()
  }
  @Emit()
  sendMessage() {
    if (this.modelArr.length > 1) {
      if (this.modelArr.includes('')) {
        this.$message.warning('请完善范围。')
      } else if (+this.modelArr[0] > +this.modelArr[1]) {
        this.$message.warning('后置参数要大于前置参数。')
        this.modelArr.pop()
      }
    }
    return this.modelArr
  }
}
</script>
<style lang="scss" scoped>
.inputRange {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  overflow: hidden;
  .icon {
    width: 24px;
    text-align: center;
    box-sizing: border-box;
  }
}
</style>
