<template>
  <el-dialog
    width="30%"
    title="内层 Dialog"
    :visible.sync="innerVisible"
    append-to-body
  />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'

@Component({
  name: 'ImgDialog',
  components: {
    SelfDialog
  }
})
export default class extends Vue {
  onConfirm(callback: Function) {
    // this.setPolicyConfirm(callback)
  }
}
</script>

<style>

</style>
