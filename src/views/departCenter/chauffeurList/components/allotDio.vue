<template>
  <SelfDialog
    :visible.sync="show"
    append-to-body
    width="500px"
    :title="allotTitle"
    :confirm="confirm"
    custom-class="a1111"
    :destroy-on-close="false"
    @close="close"
  >
    <self-form
      ref="allotForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="rules"
      size="small"
      class="p15 SuggestForm"
      :pc-col="24"
      @onPass="handlePassChange"
    />
  </SelfDialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, PropSync, Emit } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'allotDio',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) dialogVisible!: boolean; // 弹框显示
  @Prop({ default: '分配司撮' }) allotTitle?: string; // 弹框显示
  @PropSync('dialogVisible', { type: Boolean }) show!: Boolean;
  private managerList: IState[] = []; // 取消原因
  private listQuery: IState = {
    a: ''
  };
  private formItem: any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '司撮经理',
      key: 'a',
      options: this.managerList
    }
  ];
  private rules: IState = {
    a: [
      {
        required: true,
        message: '请选择司撮经理',
        trigger: 'blur'
      }
    ]
  };

  private close() {
    (this.$parent as any).allotTitle = '';
    (this.$refs.allotForm as any).resetForm()
    this.$emit('close')
  }
  // 确定按钮
  private confirm() {
    (this.$refs.allotForm as any).submitForm()
  }
  // 验证通过
  handlePassChange() {
    // (this.$parent as any).getLists()
  }
}
</script>
<style >
.a1111 .el-dialog__header {
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
