<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:38:14
 * @LastEditTime: 2021-04-15 08:46:12
 * @LastEditors: D.C.base
-->
<template>
  <section class="matchDriver">
    <!-- 搜索项 -->
    <SearchKeyWords />
    <h3>司机匹配线路</h3>
    <div class="lineTable">
      <Atable
        :list-query="listQuery"
        :is-more="true"
        @tryRun="handleCreateTryRun"
        @cancelTryRun="handleCancelTryRun"
      />
    </div>
  </section>
</template>

<script lang="ts">
import SearchKeyWords from './SearchKeyWords.vue'
import Atable from './Atable.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    Atable,
    SearchKeyWords
  }
})
export default class DepartLine extends Vue {
  private listLoading:boolean = false
  private listQuery:IState = {
    labelType: '',
    isBehavior: '',
    isRestriction: '',
    status: '',
    start: '',
    end: '',
    f1: '',
    f2: ''
  }
  // 创建试跑意向
  handleCreateTryRun() {
    (this.$refs.createTryRun as any).showDialog = true
  }
  // 取消创建试跑意向
  handleCancelTryRun() {
    (this.$refs.cancelTryRun as any).showDialog = true
  }
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.matchDriver{
  background: #fff;
  padding-bottom: 20px;
  h3{
    padding: 0 30px;
  }
  .lineTable{
    width:100%;
    padding: 0 30px;
    overflow: auto;
  }
}
</style>
