<template>
  <div>
    <!-- 梧桐 -->
    <SelfForm
      v-if="clueStatus < 2"
      ref="dialogFollowUpFirmiana"
      key="dialogFollowUpFirmiana"
      :rules="rulesWT"
      :list-query="dialogPopQuery"
      :form-item="WTItem"
      size="small"
      label-width="120px"
      :pc-col="24"
      @onPass="handlePassClick"
    >
      <div slot="inviteCase">
        <el-button
          v-for="(item,index) in followUpArrWT"
          :key="index"
          :type="dialogPopQuery.inviteStatus === item.code ? 'primary' : ''"
          @click="dialogPopQuery.inviteStatus = item.code"
        >
          {{ item.name }}
        </el-button>
      </div>
    </SelfForm>

    <!-- 雷鸟车池 -->
    <SelfForm
      v-else-if="clueStatus === 2"
      ref="dialogFollowUpBirdCar"
      key="dialogFollowUpBirdCar"
      :rules="rulesBirdCar"
      :list-query="dialogPopQueryBirdCar"
      :form-item="BirdCarItem"
      size="small"
      label-width="120px"
      :pc-col="24"
      @onPass="handlePassClick"
    >
      <div slot="inviteCase">
        <el-button
          v-for="(item,index) in followUpArrBirdCar"
          :key="index"
          :type="dialogPopQueryBirdCar.markStatus === item.code ? 'primary' : ''"
          @click="dialogPopQueryBirdCar.markStatus = item.code"
        >
          {{ item.name }}
        </el-button>
      </div>
    </SelfForm>

    <!-- 雷鸟租赁C -->
    <SelfForm
      v-else-if="clueStatus === 3"
      ref="dialogFollowUpBirdC"
      key="dialogFollowUpBirdC"
      :rules="rulesBirdC"
      :list-query="dialogPopQueryBirdC"
      :form-item="BirdCItem"
      size="small"
      label-width="120px"
      :pc-col="24"
      @onPass="handlePassClick"
    >
      <div slot="inviteCase">
        <el-button
          v-for="(item,index) in followUpArrBirdC"
          :key="index"
          :type="dialogPopQueryBirdC.markStatus === item.code ? 'primary' : ''"
          @click="dialogPopQueryBirdC.markStatus = item.code"
        >
          {{ item.name }}
        </el-button>
      </div>
    </SelfForm>

    <!-- 雷鸟租赁B -->
    <SelfForm
      v-else
      ref="dialogFollowUpBirdB"
      key="dialogFollowUpBirdB"
      :rules="rulesBirdB"
      :list-query="dialogPopQueryBirdB"
      :form-item="BirdBItem"
      size="small"
      label-width="120px"
      :pc-col="24"
      @onPass="handlePassClick"
    >
      <div slot="inviteCase">
        <el-button
          v-for="(item,index) in followUpArrBirdC"
          :key="index"
          :type="dialogPopQueryBirdB.markStatus === item.code ? 'primary' : ''"
          @click="dialogPopQueryBirdB.markStatus = item.code"
        >
          {{ item.name }}
        </el-button>
      </div>
    </SelfForm>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { lock } from '@/utils/index'
import SelfForm from '@/components/Base/SelfForm.vue'
import {
  followClueToFirmiana,
  followClueToThunderBirdTruckPool,
  followClueToThunderBirdRental
} from '@/api/clue'
import { GetDictionaryList } from '@/api/common'
interface IState {
  [key: string]: any;
}

@Component({
  name: 'FollowForm',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private clueStatus!: number;
  @Prop({ default: '' }) private callId?: string;
  @Prop({ default: '' }) private clueId?: string;

  // 字典数组
  private inviteFailReasonOptions: object[] = [];
  private intentDegreeOptions: object[] = [];
  private demandTypeOptions: object[] = [];
  private carOptions: object[] = [
    { label: '金杯', value: 1 },
    { label: '依维柯', value: 10 },
    { label: '4.2米厢货', value: 2 },
    { label: '面包', value: 48 },
    { label: '其他', value: 45 }
  ];

  // 梧桐
  private followUpArrWT: IState[] = [
    { name: '成功', code: 1 },
    { name: '失败', code: 0 }
  ];
  private rulesWT: IState = {
    inviteStatus: [{ required: true, message: '请选择跟进情况', trigger: 'change' }],
    inviteDate: [{ required: true, message: '请选择邀约面试时间' }],
    intentDegree: [{ required: true, message: '请选择意向度' }],
    inviteFailReason: [{ required: true, message: '请选择邀约失败原因' }]
  };
  private dialogFormItem: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'inviteStatus',
      label: '邀约情况',
      col: 24
    },
    {
      type: 1,
      key: 'remark',
      label: '跟进备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填，最多输入100个字',
        maxlength: '100',
        showWordLimit: true
      }
    }
  ];
  private dialogPopQuery: IState = {
    inviteStatus: '',
    remark: '',
    inviteDate: '',
    inviteFailReason: '',
    intentDegree: ''
  };
  private popFailItem: IState[] = [
    {
      type: 2,
      key: 'inviteFailReason',
      label: '邀约失败原因',
      col: 24,
      options: this.inviteFailReasonOptions
    },
    {
      type: 2,
      key: 'intentDegree',
      label: '意向度',
      col: 24,
      options: this.intentDegreeOptions
    }
  ];
  private popSuccessItem: IState[] = [
    {
      type: 9,
      key: 'inviteDate',
      label: '邀约面试时间',
      col: 24,
      tagAttrs: {
        placeholder: '请选择面试时间',
        clearable: true,
        format: 'yyyy-MM-dd HH:mm',
        'value-format': 'yyyy-MM-dd HH:mm',
        'picker-options': {
          disabledDate: (time:Date) => {
            return time.getTime() <= Date.now() - 86400000
          }
        }
      }
    }
  ];

  // 雷鸟车池
  private followUpArrBirdCar: IState[] = [
    { name: '可入池', code: 1 },
    { name: '不可入池', code: 2 },
    { name: '待入池', code: 3 },
    { name: '已入池', code: 4 }
  ];
  private rulesBirdCar: IState = {
    markStatus: [{ required: true, message: '请选择标记状态' }],
    demandType: [{ required: true, message: '请选择需求类型' }],
    remark: [{ required: false, message: '请填写跟进备注', trigger: 'blur' }]
  };
  private dialogPopQueryBirdCar: IState = {
    markStatus: '',
    demandType: '',
    remark: '',
    hasIntentionGold: '',
    contact: ''
  };
  private dialogFormItemBirdCar: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'markStatus',
      label: '标记状态',
      col: 24
    },
    {
      type: 1,
      key: 'remark',
      label: '跟进备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '最多输入100个字',
        maxlength: '100',
        showWordLimit: true
      }
    }
  ];
  private poptabBirdCar0: IState[] = [
    {
      type: 2,
      key: 'demandType',
      label: '需求类型',
      col: 24,
      options: this.demandTypeOptions
    }
  ];
  private poptabBirdCar1: IState[] = [
    {
      type: 4,
      key: 'contact',
      label: '是否联系上',
      col: 24,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  ];
  private poptabBirdCar3: IState[] = [
    {
      type: 4,
      key: 'hasIntentionGold',
      label: '是否交意向金',
      col: 24,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  ];

  // 雷鸟租赁C
  private followUpArrBirdC: IState[] = [
    { name: '有意向', code: 5 },
    { name: '无意向', code: 6 },
    { name: '已看中', code: 7 },
    { name: '已成交', code: 8 }
  ];
  private rulesBirdC: IState = {
    markStatus: [{ required: true, message: '请选择标记状态' }],
    intentModel: [{ required: true, message: '请选择意向车型' }],
    remark: [{ required: false, message: '请选择跟进备注' }],
    fancyCar: [{ required: true, message: '请选择看中车型' }]
  };
  private dialogPopQueryBirdC: IState = {
    markStatus: '',
    intentModel: '',
    remark: '',
    fancyCar: '',
    contact: ''
  };
  private dialogFormItemBirdC: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'markStatus',
      label: '标记状态',
      col: 24
    },
    {
      type: 1,
      key: 'remark',
      label: '跟进备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '最多输入100个字',
        maxlength: '100',
        showWordLimit: true
      }
    }
  ];
  private poptabBirdC0: IState[] = [
    {
      type: 2,
      key: 'intentModel',
      label: '意向车型',
      col: 24,
      options: this.carOptions
    }
  ];
  private poptabBirdC1: IState[] = [
    {
      type: 4,
      key: 'contact',
      label: '是否联系上',
      col: 24,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  ];
  private poptabBirdC2: IState[] = [
    {
      type: 2,
      key: 'fancyCar',
      label: '看中车型',
      col: 24,
      options: this.carOptions
    }
  ];

  // 雷鸟租赁B
  private rulesBirdB: IState = {
    markStatus: [{ required: true, message: '请选择标记状态' }],
    intentModel: [{ required: true, message: '请选择意向车型' }],
    remark: [{ required: false, message: '请选择跟进备注' }],
    fancyCar: [{ required: true, message: '请选择看中车型' }]
  };
  private dialogPopQueryBirdB: IState = {
    markStatus: '',
    intentModel: [],
    remark: '',
    fancyCar: [],
    contact: ''
  };
  private dialogFormItemBirdB: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'markStatus',
      label: '标记状态',
      col: 24
    },
    {
      type: 1,
      key: 'remark',
      label: '跟进备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '最多输入100个字',
        maxlength: '100',
        showWordLimit: true
      }
    }
  ];
  private poptabBirdB0: IState[] = [
    {
      type: 5,
      key: 'intentModel',
      label: '意向车型',
      col: 24,
      options: this.carOptions
    }
  ];
  private poptabBirdB1: IState[] = [
    {
      type: 4,
      key: 'contact',
      label: '是否联系上',
      col: 24,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    }
  ];
  private poptabBirdB2: IState[] = [
    {
      type: 5,
      key: 'fancyCar',
      label: '看中车型',
      col: 24,
      options: this.carOptions
    }
  ];

  get WTItem() {
    let arr: object[] = [...this.dialogFormItem]
    switch (this.dialogPopQuery.inviteStatus) {
      case 0:
        arr.splice(1, 0, ...this.popFailItem)
        break
      case 1:
        arr.splice(1, 0, ...this.popSuccessItem)
        break
      case '':
        break
    }
    return arr
  }

  get BirdCarItem() {
    let arr: object[] = [...this.dialogFormItemBirdCar]
    switch (this.dialogPopQueryBirdCar.markStatus) {
      case 1:
        arr.splice(1, 0, ...this.poptabBirdCar0)
        break
      case 2:
        arr.splice(1, 0, ...this.poptabBirdCar1)
        break
      case 4:
        arr.splice(1, 0, ...this.poptabBirdCar3)
        break
      case '':
        break
    }
    return arr
  }

  get BirdCItem() {
    let arr: object[] = [...this.dialogFormItemBirdC]
    switch (this.dialogPopQueryBirdC.markStatus) {
      case 5:
        arr.splice(1, 0, ...this.poptabBirdC0)
        break
      case 6:
        arr.splice(1, 0, ...this.poptabBirdC1)
        break
      case 8:
        arr.splice(1, 0, ...this.poptabBirdC2)
        break
    }
    return arr
  }

  get formStatus() {
    let ref = ''
    switch (this.clueStatus) {
      case 0:
        ref = 'dialogFollowUpFirmiana'
        break
      case 1:
        ref = 'dialogFollowUpFirmiana'
        break
      case 2:
        ref = 'dialogFollowUpBirdCar'
        break
      case 3:
        ref = 'dialogFollowUpBirdC'
        break
      case 4:
        ref = 'dialogFollowUpBirdB'
        break
    }
    return ref
  }

  get BirdBItem() {
    let arr: object[] = [...this.dialogFormItemBirdB]
    switch (this.dialogPopQueryBirdB.markStatus) {
      case 5:
        arr.splice(1, 0, ...this.poptabBirdB0)
        break
      case 6:
        arr.splice(1, 0, ...this.poptabBirdB1)
        break
      case 7:
        arr.splice(1, 0, ...this.poptabBirdB2)
        break
    }
    return arr
  }

  @Watch('dialogPopQuery.inviteStatus')
  chooseInvite(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQuery = {
          ...this.dialogPopQuery,
          remark: ''
        }
      }
    }
    setTimeout(() => {
      (this.$refs['dialogFollowUpFirmiana'] as any).clearValidate()
    }, 10)
  }

  @Watch('dialogPopQueryBirdCar.markStatus')
  chooseBirdCar(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQueryBirdCar = {
          ...this.dialogPopQueryBirdCar,
          remark: ''
        }
      }
      if (val !== 2) {
        Reflect.set(this.rulesBirdCar, 'remark', [
          { required: false, message: '请填写跟进备注' }
        ])
      } else {
        Reflect.set(this.rulesBirdCar, 'remark', [
          { required: true, message: '请填写跟进备注' }
        ])
      }
      setTimeout(() => {
        (this.$refs['dialogFollowUpBirdCar'] as any).clearValidate()
      }, 10)
    }
  }

  @Watch('dialogPopQueryBirdC.markStatus')
  chooseBirdC(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQueryBirdC = {
          ...this.dialogPopQueryBirdC,
          remark: ''
        }
      }
      if (val !== 6) {
        Reflect.set(this.rulesBirdC, 'remark', [
          { required: false, message: '请填写跟进备注' }
        ])
      } else {
        Reflect.set(this.rulesBirdC, 'remark', [
          { required: true, message: '请填写跟进备注' }
        ])
      }

      setTimeout(() => {
        (this.$refs['dialogFollowUpBirdC'] as any).clearValidate()
      }, 10)
    }
  }

  @Watch('dialogPopQueryBirdB.markStatus')
  chooseBirdB(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQueryBirdB = {
          ...this.dialogPopQueryBirdB,
          remark: ''
        }
      }
      if (val !== 6) {
        Reflect.set(this.rulesBirdB, 'remark', [
          { required: false, message: '请填写跟进备注' }
        ])
      } else {
        Reflect.set(this.rulesBirdB, 'remark', [
          { required: true, message: '请填写跟进备注' }
        ])
      }
      setTimeout(() => {
        (this.$refs['dialogFollowUpBirdB'] as any).clearValidate()
      }, 10)
    }
  }

  private codeChange(arr: IState[]) {
    let newArr = arr.map(function(item: any) {
      return { label: item.dictLabel, value: +item.dictValue }
    })
    return newArr
  }

  async getOptionInfo() {
    try {
      let params = ['invite_fail_reason', 'intent_degree', 'demand_type']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        let {
          invite_fail_reason: inviteFailReasonOptions,
          intent_degree: intentDegreeOptions,
          demand_type: demandTypeOptions
        } = res.data
        this.inviteFailReasonOptions.push(
          ...this.codeChange(inviteFailReasonOptions)
        )
        this.intentDegreeOptions.push(...this.codeChange(intentDegreeOptions))
        this.demandTypeOptions.push(...this.codeChange(demandTypeOptions))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }

  // 验证通过
  @lock
  private async handlePassClick(val: boolean) {
    this.$emit('followPass', val)
  }

  async sendWtFollow(value: IState) {
    try {
      let params: IState = {
        clueId: this.clueId
      }
      if (value.inviteStatus) {
        let { inviteStatus, inviteDate, remark } = value
        params.inviteStatus = inviteStatus
        params.inviteDate = inviteDate
        remark !== '' && (params.remark = remark)
      } else {
        let { inviteStatus, inviteFailReason, intentDegree, remark } = value
        params.inviteStatus = inviteStatus
        params.inviteFailReason = inviteFailReason
        params.intentDegree = intentDegree
        remark !== '' && (params.remark = remark)
      }
      if (this.callId) {
        params.callLogId = this.callId
      }
      let { data: res } = await followClueToFirmiana(params)
      if (res.success) {
        this.$emit('success', { state: true })
        return Promise.resolve(true)
      } else {
        this.$emit('success', { state: false, msg: res.errorMsg })
        console.log('fail', res.errorMsg)
      }
    } catch (err) {
      console.log('fail:', err)
    }
  }

  async sendBirdCarFollow(value: IState) {
    try {
      let params: IState = {
        clueId: this.clueId
      }
      let { markStatus, demandType, remark, contact, hasIntentionGold } = value
      switch (value.markStatus) {
        case 1:
          params.demandType = demandType
          remark !== '' && (params.remark = remark)
          break
        case 2:
          contact !== '' && (params.contact = contact)
          params.remark = remark
          break
        case 3:
          remark !== '' && (params.remark = remark)
          break
        case 4:
          hasIntentionGold !== '' &&
            (params.hasIntentionGold = hasIntentionGold)
          remark !== '' && (params.remark = remark)
          break
      }
      if (this.callId) {
        params.callLogId = this.callId
      }
      params.markStatus = markStatus
      let { data: res } = await followClueToThunderBirdTruckPool(params)
      if (res.success) {
        this.$emit('success', { state: true })
        return Promise.resolve(true)
      } else {
        this.$emit('success', { state: false, msg: res.errorMsg })
        console.log('fail', res.errorMsg)
      }
    } catch (err) {
      console.log('fail:', err)
    }
  }

  async sendRentalFollow(value: IState) {
    try {
      let params: IState = {
        clueId: this.clueId
      }
      let { markStatus, intentModel, remark, contact, fancyCar } = value
      switch (value.markStatus) {
        case 5:
          params.intentModel =
            intentModel instanceof Array ? String(intentModel) : intentModel
          remark !== '' && (params.remark = remark)
          break
        case 6:
          contact !== '' && (params.contact = contact)
          params.remark = remark
          break
        case 7:
          params.fancyCar =
            fancyCar instanceof Array ? String(fancyCar) : fancyCar
          remark !== '' && (params.remark = remark)
          break
        case 8:
          remark !== '' && (params.remark = remark)
          break
      }
      if (this.callId) {
        params.callLogId = this.callId
      }
      params.markStatus = markStatus
      let { data: res } = await followClueToThunderBirdRental(params)
      if (res.success) {
        this.$emit('success', { state: true })
        return Promise.resolve(true)
      } else {
        this.$emit('success', { state: false, msg: res.errorMsg })
        console.log('fail', res.errorMsg)
      }
    } catch (err) {
      console.log('fail:', err)
    }
  }

  submitForms() {
    (this.$refs[this.formStatus] as any).submitForm()
  }

  followType() {
    if (this.clueStatus < 2) {
      return this.sendWtFollow(this.dialogPopQuery)
    } else if (this.clueStatus === 2) {
      return this.sendBirdCarFollow(this.dialogPopQueryBirdCar)
    } else if (this.clueStatus === 3) {
      return this.sendRentalFollow(this.dialogPopQueryBirdC)
    } else {
      return this.sendRentalFollow(this.dialogPopQueryBirdB)
    }
  }

  sendFollow() {
    let obj:IState = {
      0: followClueToFirmiana,
      1: followClueToFirmiana,
      2: followClueToThunderBirdTruckPool,
      3: followClueToThunderBirdRental,
      4: followClueToThunderBirdRental
    }
    return obj[this.clueStatus]
  }

  resetForms() {
    (this.$refs[this.formStatus] as any).resetForm()
    setTimeout(() => {
      (this.$refs[this.formStatus] as any).clearValidate()
      this.intentDegreeOptions.splice(0, this.intentDegreeOptions.length)
      this.demandTypeOptions.splice(0, this.demandTypeOptions.length)
    }, 10)
  }

  mounted() {
    this.$nextTick(() => {
      this.$on('show', (val:boolean) => {
        if (val) {
          this.getOptionInfo()
        } else {
          this.resetForms()
        }
      })
    })
  }
}
</script>
