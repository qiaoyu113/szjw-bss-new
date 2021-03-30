<template>
  <div class="cpmplate-container">
    <line-layout :active.sync="active" />
    <new-line-agent v-if="active==='0'" />
    <RedundantLine v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LineLayout, NewLineAgent } from '../components'
import RedundantLine from './RedundantLine.vue'
@Component({
  name: 'Agent',
  components: {
    LineLayout,
    NewLineAgent,
    RedundantLine
  }
})
export default class extends Vue {
  private active: string = '0'
  mounted() {}
}
</script>

<style lang="scss" scoped>
.cpmplate-container {
  margin: 12px;
  // padding: 12px;
  background: #fff;
}
</style>
