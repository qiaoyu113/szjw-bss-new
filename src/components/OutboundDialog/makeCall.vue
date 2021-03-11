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
          v-if="[2,3,4].includes(status)"
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
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { PhoneModule } from '@/store/modules/phone'
import { callPhone, hangUp } from './phone'
@Component({
  name: 'MakeCall'
})
export default class extends Vue {
  @Prop({ default: '' }) phone!:string
  @Prop({ default: '' }) callId!:string
  /**
   *外呼状态变化
   *1:初始状态
   *2:开始打电话了
   *3:接通了
   *4:来电
  */
  private callTime:string = '' // 通话时长的展示文案
  private anwserTime:number = 0 // 接通的时间戳
  private timer:null | any = null // 定时器

  // 电话状态
  get status() {
    return PhoneModule.status
  }
  @Watch('status')
  handleStatusChange(val:number) {
    if (val === 3) { // 接听电话触发的事件
      this.anwserTime = Date.now()
      this.startRecordTime()
    }
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
  // 呼出电话
  handleCallClick() {
    let random:string = callPhone(this.phone, this.callId)
    this.$emit('random', random)
  }
  handleHangUp() {
    hangUp()
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
