<template>
  <div>
    <h4>基础信息:</h4>
    <base-info2 />
    <h4>备注信息:</h4>
    <remark2 />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import BaseInfo2 from './BaseInfo2.vue'
import Remark2 from './Remark2.vue'
@Component({
  name: 'Thunderbirds',
  components: {
    BaseInfo2,
    Remark2
  }
})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
</style>
