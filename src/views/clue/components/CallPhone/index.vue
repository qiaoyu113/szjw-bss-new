<template>
  <div class="CallPhone">
    <SelfDialog
      center
      :visible.sync="show"
      title="用户信息表单"
      :confirm="confirm"
      width="1200px"
      :sumbit-again="submitLoading"
      confirm-button-text="保存并挂断"
      cancel-button-text="保存"
      @closed="handleDialogClosed"
    >
      <makeCall :phone="phone" />
      <div>
        <div>
          <p>基础信息：</p>
          <baseInfoForm :clue-status="clueStatus" />
        </div>
        <div>
          <p>备注信息：</p>
          <FollowForm
            ref="followform"
            :clue-status="clueStatus"
            @success="successSend"
          />
        </div>
      </div>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import MakeCall from '@/components/OutboundDialog/makeCall.vue'
import { FollowForm, baseInfoForm } from '../index'
import SectionContainer from '@/components/SectionContainer/index.vue'

@Component({
  name: 'CallPhone',
  components: {
    SelfDialog,
    SelfForm,
    FollowForm,
    MakeCall,
    SectionContainer,
    baseInfoForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) private showDialog!: boolean;
  @Prop({ default: '' }) private phone!: string;
  @Prop({ default: 0 }) private clueStatus!: number;

  private submitLoading: boolean = false;

  get show() {
    return this.showDialog
  }

  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

  // 弹框确认
  private confirm() {
    (this.$refs['dialogSendMessage'] as any).submitForm()
  }

  // 弹窗关闭
  private handleDialogClosed() {
    (this.$refs['dialogSendMessage'] as any).resetForm()
    setTimeout(() => {
      (this.$refs['dialogSendMessage'] as any).clearValidate()
    }, 10)
  }

  private successSend(val: boolean) {
    if (val) {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
.CallPhone::v-deep .el-dialog__header {
  text-align: center;
}
</style>
