<template>
  <div class="makeCall">
    <h4>
      <div class="status">
        通话状态:
        <template v-if="status === 1">
          已挂断
        </template>
        <template v-else-if="status === 2">
          正在拨打中...
        </template>
        <template v-else-if="status === 3">
          {{ callTime }}
        </template>
      </div>
      <div class="btn">
        <el-button
          v-if="status === 3"
          type="danger"
          @click="handleHangUp"
        >
          挂断
        </el-button>
        <el-button
          v-if="status === 1"
          type="primary"
          @click="handleCallClick"
        >
          再次拨打
        </el-button>
      </div>
    </h4>

    <!-- 隐藏按钮 -->
    <template v-show="false">
      <div
        id="szjw_status_start"
        @click="handleStartStatus"
      />
      <div
        id="szjw_status_play"
        @click="handlePlayStatus"
      />
      <div
        id="szjw_status_hangup"
        @click="handleHangUpStatus"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class extends Vue {
  /**
   *外呼状态变化
   *1:初始状态
   *2:打电话了
   *3:接通了
  */
  private status:number = 1 // 电话状态
  private phone:string = '13295040858' // 电话
  private callTime:string = '' // 通话时长的展示文案
  private anwserTime:number = 0 // 接通的时间戳
  private timer:null | any = null // 定时器
  private idx:number = 0 // 当前拨打的是第几个人

  // 呼叫
  handleCallClick() {
    // 设置电话
    (window.frames as any).szjwCall.document.getElementById('moorCall-dialout-input').value = this.phone;
    // 外呼
    (window.frames as any).szjwCall.document.getElementById('DialEnable').click()
  }
  // 挂断
  handleHangUp() {
    if (this.status !== 1) {
      // 挂机
      (window.frames as any).szjwCall.document.getElementById('HangupEnable').click()
    }
  }
  // 拨打下一位
  handleCallNextClick() {
    let str:string | null = window.sessionStorage.getItem('phoneLists')
    if (str) {
      let lists:[] = JSON.parse(str)
      this.idx = this.idx + 1
      if (this.idx < lists.length) {
        this.phone = lists[this.idx]
        this.handleCallClick()
      } else {
        this.$message.error('请点击查询下一页的数据')
      }
    }
  }
  // 开始拨打电话触发的事件
  handleStartStatus() {
    this.status = 2
  }
  // 接听电话触发的事件
  handlePlayStatus() {
    this.status = 3
    this.anwserTime = Date.now()
    this.startRecordTime()
  }
  // 挂断电话触发的事件
  handleHangUpStatus() {
    this.status = 1
  }
  // 电话拨通后开始计时
  startRecordTime() {
    this.timer = setInterval(() => {
      let now:number = Date.now()
      let diff:number = (now - this.anwserTime) / 1000
      let hour = this.formatTime(Math.floor(diff / 3600))
      let min = this.formatTime(Math.floor(diff % 3600 / 60))
      let sencond = this.formatTime(Math.floor(diff % 3600 % 60))
      this.callTime = `${hour}:${min}:${sencond}`
    }, 1000)
  }
  // 格式化时间
  formatTime(num:number) {
    if (num < 10) {
      return `0${num}`
    }
    return num
  }
}
</script>
<style lang="scss" scoped>
  .makeCall {
    h4 {
      display: flex;
      align-items: center;
      .status {
        width:200px;
      }
      .btn {
        margin-left: -200px;
        display: flex;
        flex:1;
        justify-content: center;
      }
    }
  }
</style>
