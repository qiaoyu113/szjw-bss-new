<template>
  <SelfDialog
    class="dasdadad"
    title="设置分配policy"
    v-bind="$attrs"
    :width="'40%'"
    destroy-on-close
    :confirm="onConfirm"
    v-on="$listeners"
  >
    <div>'eqhejhqjehq</div>
  </SelfDialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'

@Component({
  name: 'ImgDialog'
})
export default class extends Vue {
  onConfirm(callback: Function) {
    // this.setPolicyConfirm(callback)
  }
}
</script>

<style>

</style>
