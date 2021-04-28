<template>
  <SelfDialog
    :visible.sync="showDialog"
    title="取消试跑意向"
    append-to-body
    :confirm="confirm"
    width="500px"
    custom-class="a1111"
    :destroy-on-close="false"
    @closed="handleDialogClosed"
  >
    <self-form
      ref="cancelForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="rules"
      size="small"
      label-width="200px"
      class="p15 SuggestForm"
      :pc-col="24"
      @onPass="handlePassChange"
    />
  </SelfDialog>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'CreateTryRun',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
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
      label: '取消创建试跑意向的原因?',
      key: 'a',
      options: this.cancelOptions
    }
  ]
  private rules:IState = {
    a: [
      { required: true, message: '请选择取消创建试跑意向的原因', trigger: 'blur' }
    ]
  }
  // 确定按钮
  private confirm() {
    (this.$refs.cancelForm as any).submitForm()
  }
  // 弹框关闭
  private handleDialogClosed() {
    (this.$refs.cancelForm as any).resetForm()
  }
  // 验证通过
  handlePassChange() {

  }
}
</script>

<style>
.a1111 .el-dialog__header{
  padding: 0;
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  background: #2f448a;
  border-radius: 2px;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
}
</style>
