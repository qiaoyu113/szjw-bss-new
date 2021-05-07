<template>
  <SelfDialog
    :visible.sync="showDialog"
    title="取消客邀"
    :confirm="confirm"
    width="500px"
    :destroy-on-close="false"
    @closed="handleDialogClosed"
  >
    <self-form
      ref="cancelForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="rules"
      size="small"
      label-width="150px"
      class="p15 SuggestForm"
      :pc-col="24"
      @onPass="handlePassChange"
    />
  </SelfDialog>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { cancelMatchCustInvite } from '@/api/departCenter'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'CancelGuest',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: '123' }) custInviteId!:string
  private showDialog:boolean = false
  private cancelOptions:IState[] = [] // 取消原因
  private listQuery:IState = {
    a: ''
  }
  private formItem:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '取消客邀的原因?',
      key: 'a',
      options: this.cancelOptions
    }
  ]
  private rules:IState = {
    a: [
      { required: true, message: '请选择取消客邀的原因', trigger: 'blur' }
    ]
  }
  // 确定按钮
  private confirm() {
    (this.$refs.cancelForm as any).submitForm()
    this.cancelGuest()
  }
  // 弹框关闭
  private handleDialogClosed() {
    (this.$refs.cancelForm as any).resetForm()
  }
  // 验证通过
  handlePassChange() {
    this.showDialog = false
  }
  // 取消客邀
  async cancelGuest() {
    console.log('取消客邀接口参数', this.custInviteId)
    try {
      let params:IState = {
        custInviteId: this.listQuery.custInviteId,
        cancelInviteReason: this.listQuery.cancelInviteReason
      }
      let { data: res } = await cancelMatchCustInvite(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.$emit('success')
      } else {
        // this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`launch guest fail:${err}`)
    } finally {
      //
    }
  }
}
</script>
