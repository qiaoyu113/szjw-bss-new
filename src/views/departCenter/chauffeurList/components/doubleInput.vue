<template>
  <div class="inputRange">
    <el-input
      :value="modelArr[0]"
      v-bind="$attrs"
      class="input"
      placeholder="最低"
      @input="changeInput1"
      @blur="blurChange"
    />
    <span class="icon">~</span>
    <el-input
      :value="modelArr[1]"
      v-bind="$attrs"
      class="input"
      placeholder="最高"
      @input="changeInput2"
      @blur="blurChange"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Model, Emit, Prop } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'inputRange',
  components: {}
})
export default class extends Vue {
  @Model('inputChange', { type: Array }) readonly modelArr!: any[]
  @Prop({ default: () => [] }) range?:number[]
  private newModelArr:string[] = ['', '']
  get sortModel() {
    return (this.range as number[]).sort((a, b) => a - b)
  }
  private changeInput1(val:number) {
    this.sendMessage(val, 0)
  }
  private changeInput2(val:number) {
    this.sendMessage(val, 1)
  }
  private blurChange() {
    if (this.sortModel.length > 0) {
      let some = this.modelArr.some((item, index) => {
        if (+item >= this.sortModel[1] || +item <= this.sortModel[0]) {
          this.$message.warning(`最大范围为${this.sortModel[0]}-${this.sortModel[1]}之间`)
          this.modelArr.splice(index, 1, '')
          return true
        }
      })

      if (some) return
    }

    if (this.modelArr.length > 1 && !this.modelArr.includes('')) {
      if (+this.modelArr[0] >= +this.modelArr[1]) {
        this.$message.warning('后置参数要大于前置参数。')
        return this.modelArr.pop()
      }
    }
  }
  @Emit('inputChange')
  sendMessage(e:any, index:number) {
    this.newModelArr.splice(index, 1, e)
    console.log(this.newModelArr, 'this.newModelArr')
    return this.newModelArr
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
