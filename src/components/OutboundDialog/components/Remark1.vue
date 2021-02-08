<template>
  <div class="remark1">
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="100px"
      class="p15 SuggestForm"
      :pc-col="12"
    >
      <template #other>
        <el-col
          v-if="listQuery.isInvite===true"
          :span="isPC ? 12 : 24"
        >
          <el-form-item
            label="填写面试时间"
          >
            <el-date-picker
              v-model="listQuery.interviewDate"
              :editable="false"
              format="yyyy-MM-dd HH:mm"
              type="datetime"
              placeholder="请选择"
              value-format="timestamp"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-else-if="listQuery.isInvite===false"
          :span="isPC ? 12 : 24"
        >
          <el-form-item
            label="邀约失败原因"
          >
            <el-select
              v-model="listQuery.inviteFail"
              placeholder="请选择"
            >
              <el-option
                v-for="(sub,index) in inviteReasons"
                :key="'select-'+sub.value+'-'+index"
                :label="sub.label"
                :value="sub.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          v-if="listQuery.inviteFail === 2"
          :span="isPC ? 12 : 24"
        >
          <el-form-item
            label="意向度"
          >
            <el-select
              v-model="listQuery.intentionality"
              placeholder="请选择"
            >
              <el-option
                v-for="(sub,index) in intentionalityOptions"
                :key="'select-'+sub.value+'-'+index"
                :label="sub.label"
                :value="sub.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="isPC ? 12 : 24">
          <el-form-item label="备注">
            <el-input
              v-model.trim="listQuery.remark"
              placeholder="请填写本次通话意向如何..."
              maxlength="50"
              show-word-limit
              type="textarea"
              :rows="3"
            />
          </el-form-item>
        </el-col>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Remark1',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  // 邀约失败原因列表
  private inviteReasons:IState[] = [
    {
      label: '考虑中-交钱',
      value: 1
    },
    {
      label: '考虑中-有时间再联系',
      value: 2
    }
  ]
  // 意向度列表
  private intentionalityOptions:IState[] = [
    {
      label: '非常有意向',
      value: 1
    }
  ]
  private listQuery:IState = {
    isInvite: '',
    interviewDate: '',
    inviteFail: '',
    intentionality: '',
    remark: ''
  };
  private formItem:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择'
      },
      label: '是否邀约成功',
      key: 'isInvite',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      listeners: {
        change: this.handleInviteChange
      }
    }
  ]
  private pickerOptions = {
    disabledDate(time:any) {
      return time.getTime() < Date.now() - 86400000
    },
    step: '00:30'
  }
  // 区分设备
  get isPC() {
    return SettingsModule.isPC
  }
  // 是否邀约成功变化
  private handleInviteChange(val:boolean) {
    if (val) {
      this.listQuery.inviteFail = ''
      this.listQuery.intentionality = ''
    } else {
      this.listQuery.interviewDate = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .remark1 {

  }
</style>
