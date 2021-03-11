<template>
  <div
    v-loading="listLoading"
    class="DriverMatch"
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
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'DriverMatch',
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scoped>
</style>
