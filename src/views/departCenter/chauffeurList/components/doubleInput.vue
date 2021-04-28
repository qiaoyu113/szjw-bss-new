<template>
  <div class="inputRange">
    <el-input
      :value="modelArr[0]"
      v-bind="$attrs"
      class="input"
      clearable
      placeholder="最低"
      @input="changeInput1"
    />
    <span class="icon">~</span>
    <el-input
      :value="modelArr[1]"
      v-bind="$attrs"
      class="input"
      clearable
      placeholder="最高"
      @input="changeInput2"
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
  private changeInput1(val:string) {
    this.sendMessage(val.replace(/[^\d]/g, ''), 0)
  }
  private changeInput2(val:string) {
    this.sendMessage(val.replace(/[^\d]/g, ''), 1)
  }

  @Emit('inputChange')
  sendMessage(e:any, index:number) {
    this.newModelArr.splice(index, 1, e)
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
