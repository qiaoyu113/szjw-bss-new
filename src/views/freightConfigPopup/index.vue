<script lang="ts">
import { ElNotificationComponent } from 'element-ui/types/notification'
import { Component, Vue } from 'vue-property-decorator'
import { showConfirmations } from '@/api/freight.ts'
@Component({
  name: 'FreightConfigPopup'
})
export default class extends Vue {
  private promptTiele = ''
  private promptbutton = '去处理'
  private promptMsg = ''
  private notifyHT!: ElNotificationComponent
  created() {
    document.addEventListener('showConfirmation', this.isRenderNotify)
    document.dispatchEvent(new CustomEvent('showConfirmation', { detail: '' }))
  }
  private async runderConfirmation() {
    const h = this.$createElement
    // this.registration = (e as CustomEvent).detail
    this.notifyHT = this.$notify.info({
      title: '重要提示',
      message: h('div', { class: 'sw-update-popup' }, [
        this.promptMsg,
        h('br'),
        h(
          'el-button',
          {
            on: {
              click: (e: Event) => {
                e.preventDefault()
                this.refreshApp()
              }
            },
            props: {
              size: 'mini',
              type: 'primary'
            }
          },
          this.promptbutton
        )
      ]),
      onClose: this.closeNotify,
      position: 'bottom-right',
      duration: 0,
      customClass: 'auto-shipping-confirmation'
    })
  }
  closeNotify() {
    this.$destroy() // 手动销毁组件实例
  }
  private isRenderNotify() {
    const isToken = !this.$store.state.user.token
    if (this.$route.path === '/' && isToken) return
    const day = new Date().getDate()
    if (day <= 10) {
      this.showConfirmationSure()
    } else {
      this.closeNotify()
    }
  }
  refreshApp() {
    this.notifyHT.close() // 关闭弹窗
    if (this.$route.name === 'FreightList') {
      this.$route.params.state = '10'
      this.$store.commit('TOGGLE_STATE', '10')
      return
    }
    this.$router.push({
      name: 'FreightList',
      params: {
        state: '10'
      }
    })
  }
  async showConfirmationSure() {
    try {
      const { data } = await showConfirmations()
      if (data.success && data.data) {
        this.promptMsg = `你还有${data.data}条待单边确认的运费未处理，请及时处理！`
        this.runderConfirmation()
      }
    } catch (error) {
      return error
    }
  }
  render() {
    return null
  }
}
</script>

<style lang="scss">
.auto-shipping-confirmation {
  font-size: 16px;
  .sw-update-popup {
    padding-bottom: 15px;
    button {
      position: absolute;
      right: 30px;
      bottom: 15px;
    }
  }
}
</style>
