<template>
  <SelfDialog
    class="dasdadad"
    title="设置policy"
    v-bind="$attrs"
    :width="'40%'"
    destroy-on-close
    :confirm="onConfirm"
    v-on="$listeners"
    @close="resetForm"
    @open="getUserGroupList"
  >
    <el-form
      :model="queryInfo"
      label-width="80px"
      label-position="left"
    >
      <template v-if="isAutoSetpolicy">
        <h3>不可接受线索人员</h3>
        <el-form-item label="小组">
          <el-select
            v-model="queryInfo.group"
            placeholder="请选择活动区域"
            @change="usreGroupChange"
          >
            <el-option
              v-for="item in userGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="人员">
          <el-checkbox-group
            v-model="queryInfo.notReceiveId"
          >
            <el-checkbox
              v-for="item in teamMemberList"
              :key="item.id"
              :label="item.id"
              name="type"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="setup-title">
          设置成功后，随机分配线索时，选中的人员将不能接收到线索
        </p>
      </template>
      <h3>设置线索回流时间</h3>
      <el-form-item label="待跟进">
        <el-input-number
          v-model="queryInfo.followDayNum"
          :min="1"
          :max="10"
          class="num-input-setup-clue"
        />
      </el-form-item>
      <el-form-item label="跟进中">
        <el-input-number
          v-model="queryInfo.followingDayNum"
          :min="1"
          :max="10"
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { getUserGroup, getGroupUser, setPolicy } from '@/api/clue'
@Component({
  name: 'SetUpPolicy',
  components: {
    SelfDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) policyData: any
  private queryInfo: any = {
    group: '',
    notReceiveId: [],
    toFollowed: [],
    followDayNum: undefined,
    followingDayNum: undefined
  }
  get isAutoSetpolicy() {
    return this.policyData.distributionType === 0
  }
  private userGroupList: any = []
  // 获取小组
  async getUserGroupList() {
    try {
      const { data } = await getUserGroup({})
      this.userGroupList = data.data
      console.log(data)
    } catch (error) {
      return error
    }
  }
  usreGroupChange(item:any) {
    this.getTeamMember(item)
  }
  // 小组人员改变
  private teamMemberList:any = []
  async getTeamMember(groudID:string) {
    try {
      const { data } = await getUserGroup({
        groudID
      })
      this.teamMemberList = data.data
      console.log(data)
    } catch (error) {
      return error
    }
  }
  resetForm() {
    this.$nextTick(() => {
      this.queryInfo = {
        group: '',
        notReceiveId: [],
        toFollowed: [],
        followDayNum: undefined,
        followingDayNum: undefined
      }
    })
  }
  async setPolicyConfirm(callback:Function) {
    try {
      const { notReceiveId, id, followingDayNum, followDayNum } = this.queryInfo
      let params = {
        notReceiveId: notReceiveId.join(','),
        id: this.policyData.id,
        followingDayNum: followingDayNum || '',
        followDayNum: followingDayNum || ''
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
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
  onConfirm(callback:Function) {
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
  .setup-title {
    color: #999;
    font-size: 16px;
    margin: 18px 0 22px 0;
  }
}
</style>
