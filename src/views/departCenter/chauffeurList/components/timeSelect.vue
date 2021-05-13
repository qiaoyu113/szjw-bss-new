<template>
  <div class="timeRange">
    <el-select
      :value="modelArr[0]"
      placeholder="请选择"
      class="select"
      clearable
      @change="changeSelect1"
    >
      <el-option
        v-for="item in timeLists"
        :key="item.value"
        :label="item.label"
        :disabled="item.disabled"
        :value="item.value"
      />
    </el-select>
    <span class="icon">~</span>
    <el-select
      :disabled="isDisable"
      :value="modelArr[1]"
      placeholder="请选择"
      class="select"
      clearable
      @change="changeSelect2"
    >
      <el-option
        v-for="item in timeLists"
        :key="item.value"
        :label="item.label"
        :disabled="item.disabled"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Model, Emit } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'timeRange',
  components: {}
})
export default class extends Vue {
  @Model('sendSelect', { type: Array }) readonly modelArr!: any[]
  private timeLists:IState[] = []
  private newModelArr:string[] = ['', '']
  private isDisable:Boolean = true
  private changeSelect1(val:string) {
    this.sendMessage(val, 0)
    this.itemDisable(val)
    val ? (this.isDisable = false) : (this.isDisable = true)
    if (this.newModelArr[1] === this.newModelArr[0] || !val) {
      this.newModelArr[1] = ''
    }
  }
  private changeSelect2(val:string) {
    this.sendMessage(val, 1)
  }
  private itemDisable(val:string) {
    this.timeLists.forEach((ele:IState, i:number) => {
      if (ele.value === val) {
        this.timeLists[i].disabled = true
      } else {
        this.timeLists[i].disabled = false
      }
    })
  }
  @Emit('sendSelect')
  sendMessage(e:any, index:number) {
    this.newModelArr.splice(index, 1, e)
    return this.newModelArr
  }
  mounted() {
    for (let i = 0; i < 24; i++) {
      let count = i < 9 ? `0${i}:00` : `${i}:00`
      this.timeLists.push({
        label: count,
        value: count
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.timeRange {
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
