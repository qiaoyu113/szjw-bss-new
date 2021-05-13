<template>
  <SelfDialog
    :visible.sync="showDialog"
    title="取消试跑意向"
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
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { cancelIntention } from '@/api/departCenter'
import { GetDictionaryList } from '@/api/common'
import { mapDictData } from '../../js/index'
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
   @Prop({ default: {} }) cancelData!:{}
  private showDialog:boolean = false
  private cancelOptions:IState[] = [] // 取消原因
  private listQuery:IState = {
    dictValue: ''
  }
  private reasonList:IState[] = []
  private formItem:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '取消创建试跑意向的原因?',
      key: 'dictValue',
      options: this.cancelOptions
    }
  ]
  private rules:IState = {
    dictValue: [
      { required: true, message: '请选择取消创建试跑意向的原因', trigger: 'blur' }
    ]
  }
  // 确定按钮
  private confirm() {
    (this.$refs.cancelForm as any).submitForm()
    console.log('取消试跑意向接口参数', this.cancelData)
  }
  // 弹框关闭
  private handleDialogClosed() {
    (this.$refs.cancelForm as any).resetForm()
  }
  // 验证通过
  handlePassChange() {
    console.log('验证通过')
    this.cancel()
  }

  async cancel() {
    try {
      let params:IState = { ...this.cancelData, matchCode: this.listQuery.dictValue }
      console.log('params', params)
      let { data: res } = await cancelIntention(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.$emit('success');
        (this.$refs.cancelForm as any).resetForm()
      } else {
        this.$emit('success')
        this.$message.error(res.errorMsg);
        (this.$refs.cancelForm as any).resetForm()
      }
    } catch (err) {
      console.log(err)
    }
  }
  mounted() {
    this.init()
  }
  init() {
    this.getDictList()
  }
  // 获取字典列表
  async getDictList() {
    try {
      let params:string[] = ['match_intention_failure_reason']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.cancelOptions.push(...mapDictData(res.data.match_intention_failure_reason || []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get dict list fail:${err}`)
    } finally {
      //
    }
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
