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
          v-if="[2,3].includes(status)"
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
      <div
        id="szjw_answer_btn"
        @click="handleAnwserStatus"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class extends Vue {
  @Prop({ default: '' }) phone!:string
  /**
   *外呼状态变化
   *1:初始状态
   *2:打电话了
   *3:接通了
  */
  private status:number = 1 // 电话状态
  private callTime:string = '' // 通话时长的展示文案
  private anwserTime:number = 0 // 接通的时间戳
  private timer:null | any = null // 定时器
  private idx:number = 0 // 当前拨打的是第几个人
  private notification:any =null // 通知框实例

  // 呼叫
  handleCallClick() {
    if (!this.phone) {
      return this.$message.warning('请输入外呼电话')
    }
    // 设置电话
    (window.frames as any).szjwCall.document.getElementById('moorCall-dialout-input').value = this.phone;
    // 外呼
    (window.frames as any).szjwCall.document.getElementById('smallDialEnable').click()
  }
  // 挂断
  handleHangUp() {
    if (this.status !== 1) {
      // 挂机
      (window.frames as any).szjwCall.document.getElementById('HangupEnable').click();
      (window.frames as any).szjwCall.document.getElementById('moorCall-dialout-input').value = ''
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
    if (this.notification) {
      this.notification.close()
      this.notification = null
    }
  }
  // 有人呼入，电话来了
  handleAnwserStatus() {
    this.status = 2
    const h = this.$createElement
    this.notification = this.$notify({
      title: '有人来电话了',
      dangerouslyUseHTMLString: true,
      duration: 0,
      message: h('div', {
        style: {
          'margin-top:': '10px'
        }
      }, [
        h('button', { style: {
          color: 'rgb(255, 255, 255)',
          background: '#67c23a',
          'border-radius': '4px',
          border: 'none',
          padding: '3px 10px',
          'margin-right': '10px'
        },
        on: {
          'click': this.handleAnwserClick
        }
        }, '接听'),
        h('button', { style: {
          color: 'rgb(255, 255, 255)',
          background: '#f56c6c',
          'border-radius': '4px',
          border: 'none',
          padding: '3px 10px'
        },
        on: {
          'click': this.handleHangUp
        }
        }, '挂断')
      ])
    })
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
  // 接听电话
  handleAnwserClick() {
    (window.frames as any).szjwCall.document.getElementById('incomingcall').click()
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
