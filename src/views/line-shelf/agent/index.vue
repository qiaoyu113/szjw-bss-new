<template>
  <div class="cpmplate-container">
    <line-layout
      :num-agent="numImg"
      :active.sync="active"
      :dnamic-lable="numImg"
    />
    <new-line-agent
      v-if="active === '0'"
      :dnamic-lable="numImg"
      @getnum="getLineShelfNumSure"
    />
    <RedundantLine
      v-else
      @getnum="getLineShelfNumSure"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LineLayout, NewLineAgent } from '../components'
import RedundantLine from './RedundantLine.vue'
import { getLineShelfNum } from '@/api/line-shelf'
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
  private numImg = {
    toBeCheckedNum: 0,
    checkedTodayNum: 0,
    lineShelfNewNum: 0,
    redundantNewNum: 0,
    checkedNum: 0
  }
  mounted() {
    this.getLineShelfNumSure()
  }

  private async getLineShelfNumSure() {
    try {
      const { data } = await getLineShelfNum()
      console.log(data)
      if (data.success) {
        this.numImg = data.data
      }
    } catch (error) {
      return error
    }
  }
}
</script>

<style lang="scss" scoped>
.cpmplate-container {
  margin: 12px;
  // padding: 12px;
  background: #fff;
}
</style>
