<template>
  <SelfDialog
    class="dasdadad"
    title="设置回流policy"
    v-bind="$attrs"
    :width="'40%'"
    destroy-on-close
    :confirm="onConfirm"
    v-on="$listeners"
    @open="getdefaultDate"
  >
    <el-form
      :model="queryInfo"
      label-width="80px"
      label-position="left"
    >
      <h3>设置线索回流时间</h3>
      <el-form-item label="待跟进">
        <el-input-number
          v-model="queryInfo.flowedDayNum"
          :precision="0"
          :min="1"
          :max="99"
          class="num-input-setup-clue"
        />
      </el-form-item>
      <el-form-item label="跟进中">
        <el-input-number
          v-model="queryInfo.flowingDayNum"
          :precision="0"
          :min="1"
          :max="99"
          class="num-input-setup-clue"
        />
      </el-form-item>
      <p class="setup-title">
        人工分配: &nbsp;设置成功后，该状态的线索在设置的天数没有被跟进时,该线索会被退回待分配线索池
      </p>
      <p class="setup-title">
        随机分配+policy: &nbsp;设置成功后，该状态的线索在设置的天数没有被跟进时，该线索会依据随机分配规则重新分配跟进人
      </p>
    </el-form>
  </SelfDialog>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { setPolicy } from '@/api/clue'
@Component({
  name: 'SetUpPolicy',
  components: {
    SelfDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) policyData: any
  private queryInfo: any = {
    flowedDayNum: 0,
    flowingDayNum: 0
  }
  private userGroupList: any = []
  getdefaultDate() {
    this.queryInfo.flowedDayNum = this.policyData.followedReflowedDayNum
    this.queryInfo.flowingDayNum = this.policyData.followingReflowedDayNum
  }
  async setPolicyConfirm(callback: Function) {
    try {
      const { flowingDayNum, flowedDayNum } = this.queryInfo
      const { busiType, cityCode, id } = this.policyData

      let params = {
        id,
        flowingDayNum: flowingDayNum || 0,
        flowedDayNum: flowedDayNum || 0,
        busiType,
        cityCode
      }
      const { data } = await setPolicy(params)
      if (data.success) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        callback()
        this.$emit('success')
      } else {
        this.$message({
          message: data.errorMsg,
          type: 'error'
        })
      }
    } catch (err) {
      console.log(err)
    }
  }
  onConfirm(callback: Function) {
    this.setPolicyConfirm(callback)
  }
}
</script>

<style lang="scss" >
.dasdadad {
  color: #333;
  .el-dialog__body {
    padding: 0px 30px 40px;
  }
  h3 {
    margin: 20px 0 40px 0;
  }
  .el-input-number {
    width: 140px !important;
    border: none !important;
    .el-input-number__decrease {
      color: rebeccapurple;
    }
    input {
      border: none !important;
      padding-left: 39px;
      padding-right: 62px;
      font-size: 17px;
    }
    span {
      background: #fff;
      border: none;
      width: 30px;
    }
  }
  .num-input-setup-clue {
    div {
      position: relative;
      &::before {
        content: '天';
        position: absolute;
        right: 34px;
        z-index: 9;
        height: 32px;
        line-height: 36px;
      }
      &::after {
        content: '';
        position: absolute;
        left: 38px;
        width: 40px;
        height: 36px;
        z-index: 1;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        // height: 32px;
      }
    }
  }
  .setup-title {
    color: #999;
    font-size: 16px;
    margin: 18px 0 22px 0;
  }
  .el-tabs__nav-wrap{
    &::after{
      content: '';
      background-color:transparent;
    }
  }
}
</style>
