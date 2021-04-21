<template>
  <SelfDialog
    :visible.sync="showDialog"
    title="创建试跑意向"
    :modal-append-to-body="false"
    :confirm="confirm"
    width="500px"
    :destroy-on-close="false"
    @closed="handleDialogClosed"
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
        {{ obj.driverName }} ({{ obj.driverId }})
      </template>
      <template #lineId>
        {{ obj.lineName }} ({{ obj.lineId }})
      </template>
    </self-form>
  </SelfDialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { CreateLntentionRun } from '@/api/departCenter'
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
  @Prop({ default: () => {} }) obj!:IState

  // lineCategory:'' //线路分类 稳定线路、临时线路
  // workingTimeStart:'06:10'   工作时间段的开始时间
  // driverId:'' //司机id
  // name:''//司机姓名
  // phone:''//司机手机号
  // lineName:''//线路名字
  // lineId:''//线路id
  // dutyManagerId:''//线路上客户维护经理

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
  @Watch('obj.workingTimeStart', { immediate: true })
  handleWorkingTimeStartChange(val:string | null) {
    if (val) {
      let timearr = val.split(',')
      let dates = timearr[0].split(':')
      let hour = Number(dates[0])
      let min = Number(dates[1])
      this.listQuery.arrivalTime = new Date(new Date(this.workingTime.setHours(hour, min)))
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
    this.showDialog = false
  }
  // 创建试跑意向
  async saveData() {
    try {
      let params:IState = {
        lineCategory: this.obj.lineCategory,
        driverMessage: `${this.obj.name}/${this.obj.phone}`,
        lineMessage: `${this.obj.lineName}/${this.obj.lineId}`,
        dutyManagerId: this.obj.dutyManagerId,
        driverId: this.obj.driverId,
        lineId: this.obj.lineId,
        operateFlag: 'creatIntentionRun',
        intentionType: this.listQuery.intentionType,
        otherReason: this.listQuery.otherReason,
        arrivalTime: new Date(this.listQuery.arrivalTime).getTime()
      }
      let { data: res } = await CreateLntentionRun(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.$emit('success')
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
