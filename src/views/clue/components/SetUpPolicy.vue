<template>
  <SelfDialog
    class="dasdadad"
    title="设置policy"
    v-bind="$attrs"
    :width="'40%'"
    v-on="$listeners"
  >
    <el-form
      :model="queryInfo"
      label-width="80px"
      label-position="left"
    >
      <h3>不可接受线索人员</h3>
      <el-form-item label="小组">
        <el-select
          v-model="queryInfo.group"
          placeholder="请选择活动区域"
        >
          <el-option
            label="区域一"
            value="shanghai"
          />
          <el-option
            label="区域二"
            value="beijing"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="人员">
        <el-checkbox-group v-model="queryInfo.person">
          <el-checkbox
            label="美食/餐厅线上活动"
            name="type"
          />
          <el-checkbox
            label="地推活动"
            name="type"
          />
          <el-checkbox
            label="线下主题活动"
            name="type"
          />
          <el-checkbox
            label="单纯品牌曝光"
            name="type"
          />
        </el-checkbox-group>
      </el-form-item>
      <p class="setup-title">
        设置成功后，随机分配线索时，选中的人员将不能接收到线索
      </p>
      <h3>设置线索回流时间</h3>
      <el-form-item label="待跟进">
        <el-input-number
          v-model="queryInfo.num[0]"
          :min="1"
          :max="10"
          label="jkj"
          class="num-input-setup-clue"
        />
      </el-form-item>
      <el-form-item label="待跟进">
        <el-input-number
          v-model="queryInfo.num[1]"
          :min="1"
          :max="10"
          label="jkj"
          class="num-input-setup-clue"
        />
      </el-form-item>
      <p class="setup-title">
        设置成功后，该状态的线索在设置的天数没有被跟进时，该线索会依据随机分配规则重新分配跟进人
      </p>
    </el-form>
  </SelfDialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
@Component({
  name: 'SetUpPolicy',
  components: {
    SelfDialog
  }
})
export default class extends Vue {
  private queryInfo: any = {
    group: '',
    person: [],
    toFollowed: [],
    num: [0, 0]
  }
  form: any = {}
  isShowDialogc: boolean = true
  cc(val: Function) {
    this.isShowDialogc = false
    console.log(val())
  }
}
</script>

<style lang="scss" >
.dasdadad {
  color: #333;
  .el-dialog__body{
  padding: 0px 30px 40px;

  }
  h3{
    margin: 40px 0;
  }
  .el-input-number {
    width: 140px !important;
    border: none !important;
    .el-input-number__decrease {
      color: rebeccapurple;
    }
    input {
      border: none !important;
      text-align: left !important;
      padding: 0 24px;
      padding-left: 51px;
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
  .setup-title{
    color: #999;
    font-size: 16px;
    margin: 18px 0 22px 0;
  }
}
</style>
