<template>
  <section
    :class="isPC ? 'AppMain' : 'AppMain-m'"
    class="app-main"
  >
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TagsViewModule } from '@/store/modules/tags-view'
import { SettingsModule } from '@/store/modules/settings'
import { GetInfoByUserId } from '@/api/common'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'AppMain'
})
export default class extends Vue {
  get cachedViews() {
    return TagsViewModule.cachedViews
  }

  get key() {
    return this.$route.path
  }

  get isPC() {
    return SettingsModule.isPC
  }

  set isPC(value) {
    SettingsModule.ChangeIsPC({ key: 'isPC', value })
  }

  get tableHeight() {
    return SettingsModule.tableHeight
  }
  set tableHeight(value) {
    SettingsModule.ChangeIsPC({ key: 'tableHeight', value })
  }

  // 添加iframe到dom上
  handleAddDom(obj:IState) {
    const makePhone = document.getElementById('makePhone')
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    // 8011@yunniao  1234Abcd
    const url:string = `./edb/html/webmain.html?loginName=${obj.account}&password=${obj.password}&loginType=sip&agentStatus=0&appId=${obj.appId}&secret=${obj.secret}`
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
        // '8001@yunniao'
        // 2_kHzxLREx8001
        // T00000019075
        // dbfecf80-677b-11eb-a7ab-13b8c3cc732e

        this.handleAddDom({ account: `${loginName}@yunniao`, password, appId, secret })
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`get user fail:${err}`)
    } finally {
      //
    }
  }
  mounted() {
    let makePhoneDom = document.getElementById('makePhone')
    if (!(makePhoneDom as HTMLElement).hasChildNodes()) {
      this.getInfoByUserId()
    }
  }
  created() {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      this.isPC = false
    } else {
      this.isPC = true
    }
    let otherHeight = 340 // 计算后的高度
    if (this.isPC) {
      otherHeight = 340
    } else {
      otherHeight = 300 // 移动端计算后的高度
    }
    this.tableHeight = document.body.offsetHeight - otherHeight || document.documentElement.offsetHeight - otherHeight;
    /**
     * 处理iOS 微信客户端6.7.4 键盘收起页面未下移bug
     */
    (/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener('blur', (e:any) => {
    // 这里加了个类型判断，因为a等元素也会触发blur事件
      ['input', 'textarea'].includes(e.target.localName) && document.body.scrollIntoView(false)
    }, true)
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
}

.fixed-header+.app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
<style lang="scss">
.AppMain{
  .el-form-item__label{
    color: #9e9e9e !important;
    font-weight: 400;
  }
}
.AppMain-m{
  .el-form-item__label {
    color: #4a4a4a!important;
    font-weight: 400;
  }
}
</style>
