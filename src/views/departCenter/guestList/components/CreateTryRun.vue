<template>
  <SelfDialog
    :visible.sync="showDialog"
    title="创建试跑意向"
    :modal-append-to-body="false"
    :confirm="confirm"
    width="500px"
    :destroy-on-close="false"
    @closed="handleDialogClosed"
    @opened="handleDialogOpend"
  >
    <self-form
      ref="tryForm"
      :list-query="listQuery"
      :form-item="formItem"
      :rules="rules"
      size="small"
      label-width="140px"
      class="p15 SuggestForm"
      :pc-col="24"
      @onPass="handlePassChange"
    >
      <template #driverId>
        {{ obj.name }} ({{ obj.driverId }})
      </template>
      <template #lineId>
        {{ obj.lineName }} ({{ obj.lineId }})
      </template>
    </self-form>
  </SelfDialog>
</template>
<script lang="ts">
import { Vue, Component, PropSync } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { CreateLntentionRun, getLineDetailInfo } from '@/api/departCenter'
import { lock } from '@/utils/index'
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
  @PropSync('obj', { default: () => {} }) _obj!:IState

  // driverId:'' //司机id
  // name:''//司机姓名
  // phone:''//司机手机号
  // lineId:''//线路id
  // matchType 撮合类型(1: 司推系、2：客邀系)
  // matchId  撮合单编号

  private showDialog:boolean = false
  private workingTime:Date = new Date(new Date(Date.now() + 1 * 3600 * 24 * 1000).setHours(0, 0))
  private listQuery:IState = {
    intentionType: 1,
    otherReason: '',
    arrivalTime: ''
  }

  private formItem:any[] = [
    {
      type: 'driverId',
      label: '司机',
      key: 'driverId',
      slot: true
    },
    {
      type: 'lineId',
      label: '线路',
      key: 'lineId',
      slot: true
    },
    {
      type: 4,
      label: '试跑类型',
      key: 'intentionType',
      options: [
        {
          label: '试跑',
          value: 2
        },
        {
          label: '跟车',
          value: 1
        }
      ]
    },
    {
      type: 9,
      label: '到仓时间',
      key: 'arrivalTime',
      tagAttrs: {
        placeholder: '请选择到仓时间',
        format: 'yyyy-MM-dd HH:mm',
        'value-format': 'yyyy-MM-dd HH:mm',
        pickerOptions: {
          disabledDate(time:Date) {
            let startDate:number = new Date().setHours(0, 0, 0, 0) - 1
            let endDate:number = Date.now() + 3600 * 1000 * 24 * 7
            return (time.getTime() < startDate || time.getTime() > endDate)
          }
        }
      }
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
  private rules:IState = {
    arrivalTime: [
      { required: true, message: '请选择时间', trigger: 'blur' }
    ]
  }
  handleWorkingTimeStartChange(val:string | null) {
    if (val) {
      let timearr = val.split(',')
      let dates = timearr[0].split(':')
      let hour = Number(dates[0])
      let min = Number(dates[1])
      this.listQuery.arrivalTime = new Date(new Date(this.workingTime.setHours(hour, min)))
    }
  }
  // 弹框打开
  handleDialogOpend() {
    setTimeout(() => {
      this.getLineDetail()
    }, 20)
  }
  // 获取线路详情
  async getLineDetail() {
    try {
      let params:IState = {
        lineId: this._obj.lineId
      }
      let { data: res } = await getLineDetailInfo(params)
      if (res.success) {
        let times:IState[] = res.data.lineDeliveryInfoFORMS
        if (Array.isArray(times) && times.length > 0) {
          this._obj.workingTimeStart = times[0].workingTimeStart || '00:00'
          this._obj.lineCategory = res.data.lineCategory
          this._obj.lineName = res.data.lineName
          this._obj.dutyManagerId = res.data.dutyManagerId
        }
        this.handleWorkingTimeStartChange(this._obj.workingTimeStart)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get line detail fail:${err}`)
    } finally {
      //
    }
  }
  // 确定按钮
  private confirm() {
    (this.$refs.tryForm as any).submitForm()
  }
  // 弹框关闭
  private handleDialogClosed() {
    (this.$refs.tryForm as any).resetForm()
  }
  // 验证通过
  handlePassChange() {
    this.saveData()
  }
  // 创建试跑意向
  @lock
  async saveData() {
    try {
      let params:IState = {
        lineCategory: this._obj.lineCategory,
        driverMessage: `${this._obj.name}/${this._obj.phone}`,
        lineMessage: `${this._obj.lineName}/${this._obj.lineId}`,
        dutyManagerId: this._obj.dutyManagerId,
        driverId: this._obj.driverId,
        lineId: this._obj.lineId,
        operateFlag: 'creatIntentionRun',
        intentionType: this.listQuery.intentionType,
        otherReason: this.listQuery.otherReason,
        arrivalTime: new Date(this.listQuery.arrivalTime).getTime(),
        matchType: this._obj.matchType, // 撮合类型(1: 司推系、2：客邀系)
        matchId: this._obj.matchId, // 撮合单编号
        createRunTestOrigin: 1 // 创建试跑意向来源（1：司撮、2：H5）
      }
      let { data: res } = await CreateLntentionRun(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.$emit('success')
        this.showDialog = false
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`create tryRun fail:${err}`)
    } finally {
      //
    }
  }
}
</script>
