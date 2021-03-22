<template>
  <div class="cpmplate-container">
    fdhajfhjafhj
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LineLayout, NewLineAgent } from '../components'
@Component({
  name: 'Agent',
  components: {
    LineLayout,
    NewLineAgent
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
  padding: 12px;
  background: #fff;
}
</style>
