<template>
  <div>
    <SelfDialog
      :visible.sync="show"
      title="跟进情况"
      :confirm="confirm"
      width="800px"
      :sumbit-again="submitLoading"
      @closed="handleDialogClosed"
    >
      <!-- 梧桐 -->
      <SelfForm
        v-if="Number(clueStatus) < 2"
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
        v-else-if="Number(clueStatus) === 2"
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
        v-else-if="Number(clueStatus) === 3"
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
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
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
  name: 'FollowUpDio',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: false }) private showDialog!: boolean;
  @Prop({ default: '0' }) private clueStatus!: string;
  private submitLoading: boolean = false;

  // 字典数组
  private inviteFailReasonOptions: object[] = [];
  private intentDegreeOptions: object[] = [];
  private demandTypeOptions: object[] = [];
  private carOptions:object[] = [
    { label: '金杯', value: 1 },
    { label: '依维柯', value: 10 },
    { label: '4.2米厢货', value: 2 },
    { label: '面包', value: 35 },
    { label: '其他', value: 45 }
  ]

  // 梧桐
  private followUpArrWT: IState[] = [
    { name: '成功', code: 1 },
    { name: '失败', code: 0 }
  ];
  private rulesWT: IState = {
    inviteStatus: [{ required: true, message: '请选择跟进情况' }],
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
        placeholder: '请选择面试时间'
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
        placeholder: '选填，最多输入100个字',
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
        placeholder: '选填，最多输入100个字',
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
        placeholder: '选填，最多输入100个字',
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

  get show() {
    return this.showDialog
  }
  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

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
    switch (Number(this.clueStatus)) {
      case 0:
        ref = 'editFormWt'
        break
      case 1:
        ref = 'editFormWt'
        break
      case 2:
        ref = 'editFormBirdCar'
        break
      case 3:
        ref = 'editFormBirdC'
        break
      case 4:
        ref = 'editFormBirdB'
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

  @Watch('showDialog')
  onShowDialog(val: boolean) {
    if (val) {
      if (this.showDialog) {
        this.getOptionInfo()
      }
    }
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
  // 弹窗关闭
  private handleDialogClosed() {
    setTimeout(() => {
      if (Number(this.clueStatus) < 2) {
        this.dialogFormItem.splice(1, this.dialogFormItem.length - 2);
        (this.$refs['dialogFollowUpFirmiana'] as any).resetForm();
        (this.$refs['dialogFollowUpFirmiana'] as any).clearValidate()
      } else if (Number(this.clueStatus) === 2) {
        this.dialogFormItemBirdCar.splice(
          1,
          this.dialogFormItemBirdCar.length - 2
        );
        (this.$refs['dialogFollowUpBirdCar'] as any).resetForm();
        (this.$refs['dialogFollowUpBirdCar'] as any).clearValidate()
      } else if (Number(this.clueStatus) === 3) {
        this.dialogFormItemBirdC.splice(1, this.dialogFormItemBirdC.length - 2);
        (this.$refs['dialogFollowUpBirdC'] as any).resetForm();
        (this.$refs['dialogFollowUpBirdC'] as any).clearValidate()
      } else {
        this.dialogFormItemBirdB.splice(1, this.dialogFormItemBirdB.length - 2);
        (this.$refs['dialogFollowUpBirdB'] as any).resetForm();
        (this.$refs['dialogFollowUpBirdB'] as any).clearValidate()
      }
      this.inviteFailReasonOptions.splice(
        0,
        this.inviteFailReasonOptions.length
      )
      this.intentDegreeOptions.splice(0, this.intentDegreeOptions.length)
      this.demandTypeOptions.splice(0, this.demandTypeOptions.length)
    }, 10)
  }
  // 弹框确认
  private confirm() {
    if (Number(this.clueStatus) < 2) {
      (this.$refs['dialogFollowUpFirmiana'] as any).submitForm()
    } else if (Number(this.clueStatus) === 2) {
      (this.$refs['dialogFollowUpBirdCar'] as any).submitForm()
    } else if (Number(this.clueStatus) === 3) {
      (this.$refs['dialogFollowUpBirdC'] as any).submitForm()
    } else {
      (this.$refs['dialogFollowUpBirdB'] as any).submitForm()
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
    if (Number(this.clueStatus) < 2) {
      this.sendWtFollow(this.dialogPopQuery)
    } else if (Number(this.clueStatus) === 2) {
      this.sendBirdCarFollow(this.dialogPopQueryBirdCar)
    } else if (Number(this.clueStatus) === 3) {
      this.sendRentalFollow(this.dialogPopQueryBirdC)
    } else {
      this.sendRentalFollow(this.dialogPopQueryBirdB)
    }
    this.show = false
  }

  async sendWtFollow(value: IState) {
    try {
      let params: IState = {}
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
      let { data: res } = await followClueToFirmiana(params)
      if (res.success) {
        this.$message({
          type: 'success',
          message: '添加线下跟进成功!'
        });
        (this.$parent as any).getDetailApi()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('fail:', err)
    }
  }

  async sendBirdCarFollow(value: IState) {
    try {
      let params: IState = {}
      let {
        markStatus,
        demandType,
        remark,
        contact,
        hasIntentionGold
      } = value
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
      params.markStatus = markStatus
      let { data: res } = await followClueToThunderBirdTruckPool(params)
      if (res.success) {
        this.$message({
          type: 'success',
          message: '添加线下跟进成功!'
        });
        (this.$parent as any).getDetailApi()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('fail:', err)
    }
  }

  async sendRentalFollow(value: IState) {
    try {
      let params: IState = {}
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
      params.markStatus = markStatus
      let { data: res } = await followClueToThunderBirdRental(params)
      if (res.success) {
        this.$message({
          type: 'success',
          message: '添加线下跟进成功!'
        });
        (this.$parent as any).getDetailApi()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log('fail:', err)
    }
  }
}
</script>
