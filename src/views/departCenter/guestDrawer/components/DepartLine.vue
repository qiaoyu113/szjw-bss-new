<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:36:20
 * @LastEditTime: 2021-04-15 08:45:19
 * @LastEditors: D.C.base
-->
<template>
  <section class="departLine">
    <Atable
      :list-query="listQuery"
      :is-more="true"
      @tryRun="handleCreateTryRun"
      @cancelTryRun="handleCancelTryRun"
    />
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Atable from './Atable.vue'
@Component({
  components: {
    Atable
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
.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.departLine{
  padding: 20px 30px;
  background: #fff;
  margin-bottom: 10px;
}
</style>
