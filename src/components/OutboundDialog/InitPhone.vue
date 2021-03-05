<template>
  <div />
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { GetInfoByUserId } from '@/api/common'
import { PhoneModule } from '@/store/modules/phone'
import { hangUp, anwserPhone } from './phone'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'InitPhone'
})
export default class extends Vue {
  private notification:any =null // 通知框实例
  // 电话状态
  get status() {
    return PhoneModule.status
  }
  // 呼入电话
  get originCallNo() {
    return PhoneModule.originCallNo
  }
  // 呼入电话所在省
  get callerProvince() {
    return PhoneModule.callerProvince
  }
  // 呼入电话所在市
  get callerCity() {
    return PhoneModule.callerCity
  }
  @Watch('status')
  handleStatusChange(val:number) {
    if (val === 1 && this.notification) { // 挂断电话
      this.notification.close()
      this.notification = null
    } else if (val === 4) { // 接听电话
      this.handleAnwserStatus()
    }
  }

  // 添加监听事件
  addEventListener() {
    window.addEventListener('message', async(obj:IState) => {
      let { data } = obj
      if (data.status) {
        await PhoneModule.ChangePhone(data)
      }
    })
  }
  // 添加iframe到dom上
  handleAddDom(obj:IState) {
    const makePhone = document.getElementById('makePhone')
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    const url:string = `./edb/html/webmain.html?loginName=${obj.account}&password=${obj.password}&loginType=sip&agentStatus=0`
    iframe.name = 'szjwCall'
    iframe.src = url;
    (makePhone as HTMLHtmlElement).appendChild(iframe)
  }
  // 根据用户id获取坐席号
  async getInfoByUserId() {
    try {
      let userId = localStorage.getItem('userId')
      let params = {
        userId
      }
      let { data: res } = await GetInfoByUserId(params)
      if (res.success) {
        let { loginName, password, appId, secret } = res.data
        if (!loginName || !password || !appId || !secret) {
          return this.$message.error('当前用户没有配置坐席号')
        }
        let obj:IState = { appId, secret }
        await PhoneModule.ChangePhone(obj)
        // '8001@yunniao'
        // 2_kHzxLREx8001
        // T00000019075
        // dbfecf80-677b-11eb-a7ab-13b8c3cc732e
        // this.handleAddDom({ account: `8001@yunniao`, password: '2_kHzxLREx8001' })
        this.handleAddDom({ account: `${loginName}@yunniao`, password })
        this.addEventListener()
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`get user fail:${err}`)
    } finally {
      //
    }
  }
  // 有人呼入，电话来了
  handleAnwserStatus() {
    const h = this.$createElement
    this.notification = this.$notify({
      title: `${this.originCallNo} ${this.callerProvince} ${this.callerCity}`,
      dangerouslyUseHTMLString: true,
      duration: 0,
      message: h('div', {
        style: {
          'margin-top:': '10px'
        }
      }, [
        this.status === 4 ? h('button', { style: {
          color: 'rgb(255, 255, 255)',
          background: '#67c23a',
          'border-radius': '4px',
          border: 'none',
          padding: '3px 10px',
          'margin-right': '10px'
        },
        on: {
          'click': function(e:any) {
            anwserPhone()
            e.target.style.display = 'none'
          }
        }
        }, '接听') : null,
        h('button', { style: {
          color: 'rgb(255, 255, 255)',
          background: '#f56c6c',
          'border-radius': '4px',
          border: 'none',
          padding: '3px 10px'
        },
        on: {
          'click': hangUp
        }
        }, '挂断')
      ])
    })
  }
  mounted() {
    this.getInfoByUserId()
  }
}
</script>
<style lang="scss" scoped>
</style>
