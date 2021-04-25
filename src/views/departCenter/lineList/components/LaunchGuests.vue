<template>
  <div class="launchGuestContainer">
    <SelfDialog
      :visible.sync="showDialog"
      title="发起客邀"
      :confirm="confirm"
      width="500px"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <self-form
        ref="tryForm"
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="140px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassChange"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { CreateLntentionRun } from '@/api/departCenter'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'LaunchGuest',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) obj!:IState
  private showDialog:boolean = false
  private listQuery:IState = {
    guestCity: 1,
    otherReason: ''
  }

  private formItem:any[] = [
    {
      type: 2,
      label: '客邀城市',
      key: 'guestCity',
      options: [
        {
          label: '北京',
          value: 1
        }
      ]
    },
    {
      type: 1,
      label: '备注',
      key: 'otherReason',
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填,20字以内',
        clearable: true,
        maxlength: 20,
        'show-word-limit': true
      }
    }
  ]
  // 确定按钮
  private confirm() {
    (this.$refs.tryForm as any).submitForm()
    this.saveData()
  }
  // 弹框关闭
  private handleDialogClosed() {
    (this.$refs.tryForm as any).resetForm()
  }
  private qqq() {
    console.log(123)
  }
  // 验证通过
  handlePassChange() {
    this.showDialog = false
  }
  // 发起客邀
  async saveData() {
    try {
      let params:IState = {
        operateFlag: 'creatIntentionRun',
        guestCity: this.listQuery.guestCity,
        otherReason: this.listQuery.otherReason
      }
      let { data: res } = await CreateLntentionRun(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.$emit('success')
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`launch guest fail:${err}`)
    } finally {
      //
    }
  }
}
</script>
