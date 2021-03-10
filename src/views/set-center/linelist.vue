<template>
  <div
    v-loading="listLoading"
    class="LineList"
    :class="{
      p15: isPC
    }"
  >
    线路列表
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  name: 'LineList'
})
export default class extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
