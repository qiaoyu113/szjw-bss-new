<template>
  <div
    class="SelfDrawer"
    :class="{
      p15: isPC
    }"
  >
    2213
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'SelfDrawer'
})
export default class extends Vue {
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scoped>
</style>
