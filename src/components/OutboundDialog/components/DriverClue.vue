<template>
  <div>
    <h4>基础信息:</h4>
    <base-info1 />
    <h4>备注信息:</h4>
    <remark1 />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseInfo1 from './BaseInfo1.vue'
import Remark1 from './Remark1.vue'
@Component({
  name: 'DriverOutBound',
  components: {
    BaseInfo1,
    Remark1
  }
})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
</style>
