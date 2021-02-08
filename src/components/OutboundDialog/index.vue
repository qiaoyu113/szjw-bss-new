<template>
  <div class="outboundDialog">
    <SelfDialog
      :visible.sync="showDialog"
      title="用户信息表单"
      cancel-button-text="挂断并保存"
      :show-other-button="true"
      other-type="primary"
      other-button-text="保存"
      confirm-button-text="保存并拨打下一位"
      width="60%"
      :cancel="handleHangUpAndSaveClick"
      :other="handleSaveClick"
      :confirm="handlePlayAndNextClick"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <make-call />
      <h4>基础信息:</h4>
      <baseInfo1 />
      <h4>备注信息:</h4>
      <remark1 />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import BaseInfo1 from './components/BaseInfo1.vue'
import Remark1 from './components/Remark1.vue'
import MakeCall from './components/makeCall.vue'
@Component({
  name: 'OutboundDialog',
  components: {
    MakeCall,
    SelfDialog,
    BaseInfo1,
    Remark1
  }
})

export default class extends Vue {
  // @Prop({ default: () => {} }) listQuery!:IState
  private showDialog:boolean = false
  @Watch('showDialog')
  handleDialogChange(val:boolean) {
    if (val) {
      this.handleAddDom()
    } else {
      this.handleDeleteDom()
    }
  }
  // 弹框关闭
  handleDialogClosed() {

  }
  // 保存
  handleSaveClick(done:Function) {
    done()
  }
  // 挂断并保存
  handleHangUpAndSaveClick(done:Function) {
    done()
  }
  // 保存并拨打下一位
  handlePlayAndNextClick(done:Function) {
    done()
  }
  // 删除dom
  handleDeleteDom() {
    let makePhone = document.getElementById('makePhone')
    const child = (makePhone as HTMLHtmlElement).children[0];
    (makePhone as HTMLHtmlElement).removeChild(child)
  }
  // 添加iframe到dom上
  handleAddDom() {
    const makePhone = document.getElementById('makePhone')
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    const url:string = './edb/html/webmain.html?loginName=8011@yunniao&password=1234Abcd&loginType=sip&agentStatus=0'
    iframe.name = 'szjwCall'
    iframe.src = url;
    (makePhone as HTMLHtmlElement).appendChild(iframe)
  }
}
</script>

<style scoped>
  .outboundDialog >>> .el-button--default {
    background: #F56C6C;

  }
  .outboundDialog >>> .el-button--default  span {
    color:#fff;
  }
</style>
