<template>
  <div>
    <SelfDialog
      :visible.sync="show"
      title="跟进情况"
      :confirm="confirm"
      width="650px"
      :sumbit-again="submitLoading"
      @closed="handleDialogClosed"
    >
      <FollowForm
        ref="followform"
        :clue-id="id"
        :clue-status="+clueStatus"
        @success="successSend"
        @followPass="followPass"
      />
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { FollowForm } from '../index'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'FollowUpDio',
  components: {
    SelfDialog,
    FollowForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) private showDialog!: boolean;
  @Prop({ default: '0' }) private clueStatus!: string;
  @Prop({ default: '' }) private id!: string;

  private submitLoading: boolean = false;
  private errMsg:IState = {}

  get show() {
    return this.showDialog
  }
  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

  @Watch('showDialog')
  onShowDialog(val: boolean) {
    if (val) {
      if (this.showDialog) {
        setTimeout(() => {
          (this.$refs['followform'] as any).getOptionInfo()
        }, 10)
      }
    }
  }

  // 弹窗关闭
  private handleDialogClosed() {
    (this.$refs['followform'] as any).resetForms()
  }

  // 弹框确认
  private confirm() {
    (this.$refs['followform'] as any).submitForms()
  }

  private followPass(val:boolean) {
    if (val) {
      (this.$refs['followform'] as any).followType()
    }
  }

  private successSend(val:IState) {
    if (val.state) {
      this.$message({
        type: 'success',
        message: '添加线下跟进成功!'
      });
      (this.$parent as any).getDetailApi()
    } else {
      this.$message({
        type: 'warning',
        message: this.errMsg.state
      })
    }
    this.show = false
  }
}
</script>
