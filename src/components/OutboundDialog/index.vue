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
      <make-call ref="callPhone" />
      <!-- 司机线索、司机梧桐账户 -->
      <!-- <driver-clue /> -->
      <!-- 雷鸟线索、雷鸟租车、雷鸟售车列表 -->
      <thunder-birds />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import DriverClue from './components/DriverClue.vue'
import MakeCall from './components/makeCall.vue'
import ThunderBirds from './components/Thunderbirds.vue'
import { lock } from '@/utils'
@Component({
  name: 'OutboundDialog',
  components: {
    MakeCall,
    SelfDialog,
    DriverClue,
    ThunderBirds
  }
})

export default class extends Vue {
  // @Prop({ default: () => {} }) listQuery!:IState
  private showDialog:boolean = false
  @Watch('showDialog')
  handleDialogChange(val:boolean) {
    if (val) {
      let makePhoneDom = document.getElementById('makePhone')
      if (!(makePhoneDom as HTMLElement).hasChildNodes()) {
        this.handleAddDom()
      }
    } else {
      // this.handleDeleteDom()
    }
  }
  // 弹框关闭
  handleDialogClosed() {

  }
  // 保存
  handleSaveClick(done:Function) {
    this.handleSaveInfoClick(done)
  }
  // 挂断并保存
  handleHangUpAndSaveClick(done:Function) {
    // 挂断电话
    (this.$refs.callPhone as any).handleHangUp()
    setTimeout(() => {
      this.handleSaveInfoClick(done)
    }, 100)
  }
  // 保存并拨打下一位
  handlePlayAndNextClick(done:Function) {
    // 挂断电话
    (this.$refs.callPhone as any).handleHangUp()
    setTimeout(async() => {
      await this.handleSaveInfoClick();
      // 呼叫下一位
      (this.$refs.handleCallNextClick as any).handleCallClick()
    }, 100)
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
  // 保存信息
  @lock
  async handleSaveInfoClick(done?:Function) {
    try {
      // api
      let { data: res } = await { data: { errorMsg: '', success: true } }
      if (res.success) {
        if (typeof done === 'function') {
          done()
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`save fail:${err}`)
    } finally {
      // nothing
    }
    //
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
