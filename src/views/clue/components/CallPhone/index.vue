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
      top="5vh"
      @closed="handleDialogClosed"
    >
      <!-- fullscreen -->
      <makeCall :phone="phone" />
      <div>
        <div>
          <h4>基础信息：</h4>
          <baseInfoForm
            :id="clueId"
            ref="baseInfo"
            :clue-status="clueStatus"
            @basePass="basePass"
            @success="successBase"
          />
        </div>
        <div>
          <h4>备注信息：</h4>
          <FollowForm
            ref="followform"
            :clue-status="clueStatus"
            @success="successSend"
            @followPass="followPass"
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
interface IState {
  [key: string]: any;
}

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
  @Prop({ default: '' }) private clueId!: string;

  private submitLoading: boolean = false;
  private passBase:boolean = false
  private passFollow:boolean = false

  private ApiBase:boolean = false
  private ApiFollow:boolean = false

  get show() {
    return this.showDialog
  }

  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

  // 弹窗打开请求接口
  @Watch('showDialog')
  changeDio(value: number) {
    setTimeout(() => {
      (this.$refs['baseInfo'] as any).$emit('show', value);
      (this.$refs['followform'] as any).$emit('show', value)
    }, 10)
  }

  allSuccess(res:boolean[]) {
    if (res[0] && res[1]) {
      this.$message({
        type: 'success',
        message: '保存成功!'
      })
      this.show = false
    } else if (!res[0] && res[1]) {
      this.$message({
        type: 'warning',
        message: '备注信息保存成功，基础信息保存失败'
      })
    } else if (res[0] && res[1]) {
      this.$message({
        type: 'warning',
        message: '基础信息保存成功，备注信息保存失败'
      })
    } else {
      this.$message({
        type: 'warning',
        message: '保存失败'
      })
    }
    (this.$parent as any).getDetailApi()
  }

  // 弹框确认
  private confirm() {
    (this.$refs['baseInfo'] as any).submitsForm();
    (this.$refs['followform'] as any).submitForms()
    setTimeout(() => {
      this.canSend()
    }, 0)
  }

  private basePass(val:boolean) {
    this.passBase = val
  }

  private followPass(val:boolean) {
    this.passFollow = val
  }

  async canSend() {
    if (this.passBase && this.passFollow) {
      let p1 = (this.$refs['baseInfo'] as any).sendBase
      let p2 = (this.$refs['followform'] as any).followType
      let arrs = [p1(), p2()]
      let res = await Promise.all(arrs)
      this.allSuccess(res)
    }
  }

  // 弹窗关闭
  private handleDialogClosed() {
    this.passBase = false
    this.passFollow = false
  }

  private successBase(val:boolean) {
    this.ApiBase = val
  }

  private successSend(val:IState) {
    this.ApiFollow = val.state
  }
}
</script>
<style lang="scss" scoped>
.CallPhone::v-deep .el-dialog__header {
  text-align: center;
}
.CallPhone::v-deep .el-dialog__body{
    padding: 0 20px;
  }
.CallPhone::v-deep .p15 {
  padding: 5px;
}
.CallPhone{
  p{
    padding:0;
    margin: 0;
  }
  h4{
    margin-top: 0;
    margin-bottom: 5px;
  }

}
</style>
