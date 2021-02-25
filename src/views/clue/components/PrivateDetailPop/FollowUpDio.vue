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
            :type="dialogPopQuery.inviteCaseSuccessOrFail === item.code ? 'primary' : ''"
            @click="dialogPopQuery.inviteCaseSuccessOrFail = item.code"
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
            :type="dialogPopQueryBirdCar.tagStatus === item.code ? 'primary' : ''"
            @click="dialogPopQueryBirdCar.tagStatus = item.code"
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
            :type="dialogPopQueryBirdC.tagStatus === item.code ? 'primary' : ''"
            @click="dialogPopQueryBirdC.tagStatus = item.code"
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
            :type="dialogPopQueryBirdB.tagStatus === item.code ? 'primary' : ''"
            @click="dialogPopQueryBirdB.tagStatus = item.code"
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

  // 梧桐
  private followUpArrWT: IState[] = [
    { name: '成功', code: 1 },
    { name: '失败', code: 0 }
  ];
  private rulesWT: IState = {
    inviteCaseSuccessOrFail: [{ required: true, message: '请选择跟进情况' }],
    inviteTime: [{ required: true, message: '请选择邀约面试时间' }],
    intentionNum: [{ required: true, message: '请选择意向度' }],
    inviteFailReason: [{ required: true, message: '请选择邀约失败原因' }]
  };
  private dialogFormItem: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'inviteCaseSuccessOrFail',
      label: '跟进情况',
      col: 24
    },
    {
      type: 1,
      key: 'inviteRemark',
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
    inviteCaseSuccessOrFail: '',
    inviteRemark: '',
    inviteTime: '',
    inviteFailReason: '',
    intentionNum: ''
  };
  private popFailItem: IState[] = [
    {
      type: 2,
      key: 'inviteFailReason',
      label: '邀约失败原因',
      col: 24,
      options: []
    },
    {
      type: 2,
      key: 'intentionNum',
      label: '意向度',
      col: 24,
      options: []
    }
  ];
  private popSuccessItem: IState[] = [
    {
      type: 9,
      key: 'inviteTime',
      label: '邀约面试时间',
      col: 24,
      tagAttrs: {
        placeholder: '请选择面试时间'
      }
    }
  ];

  // 雷鸟车池
  private followUpArrBirdCar: IState[] = [
    { name: '可入池', code: 0 },
    { name: '不可入池', code: 1 },
    { name: '待入池', code: 2 },
    { name: '已入池', code: 3 }
  ];
  private rulesBirdCar: IState = {
    tagStatus: [{ required: true, message: '请选择标记状态' }],
    needType: [{ required: true, message: '请选择需求类型' }],
    followRemark: [{ required: false, message: '请填写跟进备注', trigger: 'blur' }]
  };
  private dialogPopQueryBirdCar: IState = {
    tagStatus: '',
    needType: '',
    followRemark: '',
    wantGiveMoney: '',
    canContact: ''
  };
  private dialogFormItemBirdCar: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'tagStatus',
      label: '标记状态',
      col: 24
    },
    {
      type: 1,
      key: 'followRemark',
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
      key: 'needType',
      label: '需求类型',
      col: 24,
      options: []
    }
  ];
  private poptabBirdCar1: IState[] = [
    {
      type: 4,
      key: 'canContact',
      label: '是否联系上',
      col: 24,
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  ];
  private poptabBirdCar3: IState[] = [
    {
      type: 4,
      key: 'wantGiveMoney',
      label: '是否交意向金',
      col: 24,
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  ];

  // 雷鸟租赁C
  private followUpArrBirdC: IState[] = [
    { name: '有意向', code: 0 },
    { name: '无意向', code: 1 },
    { name: '已看中', code: 2 },
    { name: '已成交', code: 3 }
  ];
  private rulesBirdC: IState = {
    tagStatus: [{ required: true, message: '请选择标记状态' }],
    inviteCarType: [{ required: true, message: '请选择意向车型' }],
    followRemark: [{ required: false, message: '请选择跟进备注' }],
    likeCar: [{ required: true, message: '请选择看中车型' }]
  };
  private dialogPopQueryBirdC: IState = {
    tagStatus: '',
    inviteCarType: '',
    followRemark: '',
    likeCar: '',
    canContact: ''
  };
  private dialogFormItemBirdC: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'tagStatus',
      label: '标记状态',
      col: 24
    },
    {
      type: 1,
      key: 'followRemark',
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
      key: 'inviteCarType',
      label: '意向车型',
      col: 24,
      options: []
    }
  ];
  private poptabBirdC1: IState[] = [
    {
      type: 4,
      key: 'canContact',
      label: '是否联系上',
      col: 24,
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  ];
  private poptabBirdC2: IState[] = [
    {
      type: 2,
      key: 'likeCar',
      label: '看中车型',
      col: 24,
      options: []
    }
  ];

  // 雷鸟租赁B
  private rulesBirdB: IState = {
    tagStatus: [{ required: true, message: '请选择标记状态' }],
    inviteCarType: [{ required: true, message: '请选择意向车型' }],
    followRemark: [{ required: false, message: '请选择跟进备注' }],
    likeCar: [{ required: true, message: '请选择看中车型' }]
  };
  private dialogPopQueryBirdB: IState = {
    tagStatus: '',
    inviteCarType: [],
    followRemark: '',
    likeCar: [],
    canContact: ''
  };
  private dialogFormItemBirdB: IState[] = [
    {
      slot: true,
      type: 'inviteCase',
      key: 'tagStatus',
      label: '标记状态',
      col: 24
    },
    {
      type: 1,
      key: 'followRemark',
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
      key: 'inviteCarType',
      label: '意向车型',
      col: 24,
      options: [
        { label: '金杯', value: '0' },
        { label: '依维柯', value: '1' },
        { label: '4.2米厢货', value: '2' },
        { label: '面包', value: '3' },
        { label: '其他', value: '4' }
      ]
    }
  ];
  private poptabBirdB1: IState[] = [
    {
      type: 4,
      key: 'canContact',
      label: '是否联系上',
      col: 24,
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  ];
  private poptabBirdB2: IState[] = [
    {
      type: 5,
      key: 'likeCar',
      label: '看中车型',
      col: 24,
      options: [
        { label: '金杯', value: '0' },
        { label: '依维柯', value: '1' },
        { label: '4.2米厢货', value: '2' },
        { label: '面包', value: '3' },
        { label: '其他', value: '4' }
      ]
    }
  ];

  get show() {
    return this.showDialog
  }
  set show(value: boolean) {
    this.$emit('update:showDialog', value)
  }

  get WTItem() {
    let arr:object[] = [...this.dialogFormItem]
    switch (this.dialogPopQuery.inviteCaseSuccessOrFail) {
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
    let arr:object[] = [...this.dialogFormItemBirdCar]
    switch (this.dialogPopQueryBirdCar.tagStatus) {
      case 0:
        arr.splice(1, 0, ...this.poptabBirdCar0)
        break
      case 1:
        arr.splice(1, 0, ...this.poptabBirdCar1)
        break
      case 3:
        arr.splice(1, 0, ...this.poptabBirdCar3)
        break
      case '':
        break
    }
    return arr
  }

  get BirdCItem() {
    let arr:object[] = [...this.dialogFormItemBirdC]
    switch (this.dialogPopQueryBirdC.tagStatus) {
      case 0:
        arr.splice(1, 0, ...this.poptabBirdC0)
        break
      case 1:
        arr.splice(1, 0, ...this.poptabBirdC1)
        break
      case 3:
        arr.splice(1, 0, ...this.poptabBirdC2)
        break
    }
    return arr
  }

  get BirdBItem() {
    let arr:object[] = [...this.dialogFormItemBirdB]
    switch (this.dialogPopQueryBirdB.tagStatus) {
      case 0:
        arr.splice(1, 0, ...this.poptabBirdB0)
        break
      case 1:
        arr.splice(1, 0, ...this.poptabBirdB1)
        break
      case 2:
        arr.splice(1, 0, ...this.poptabBirdB2)
        break
    }
    return arr
  }

  @Watch('dialogPopQuery.inviteCaseSuccessOrFail')
  chooseInvite(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQuery = {
          ...this.dialogPopQuery,
          inviteRemark: ''
        }
      }
    }
  }

  @Watch('dialogPopQueryBirdCar.tagStatus')
  chooseBirdCar(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQueryBirdCar = {
          ...this.dialogPopQueryBirdCar,
          followRemark: ''
        }
      }
      if (val !== 1) {
        Reflect.set(this.rulesBirdCar, 'followRemark', [
          { required: false, message: '请填写跟进备注' }
        ])
      } else {
        Reflect.set(this.rulesBirdCar, 'followRemark', [
          { required: true, message: '请填写跟进备注' }
        ])
      }
      setTimeout(() => {
        (this.$refs['dialogFollowUpBirdCar'] as any).clearValidate()
      }, 10)
    }
  }

  @Watch('dialogPopQueryBirdC.tagStatus')
  chooseBirdC(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQueryBirdC = {
          ...this.dialogPopQueryBirdC,
          followRemark: ''
        }
      }
      if (val !== 1) {
        Reflect.set(this.rulesBirdC, 'followRemark', [
          { required: false, message: '请填写跟进备注' }
        ])
      } else {
        Reflect.set(this.rulesBirdC, 'followRemark', [
          { required: true, message: '请填写跟进备注' }
        ])
      }

      setTimeout(() => {
        (this.$refs['dialogFollowUpBirdC'] as any).clearValidate()
      }, 10)
    }
  }

  @Watch('dialogPopQueryBirdB.tagStatus')
  chooseBirdB(val: number | string, oldVal: number | string) {
    if (val !== '') {
      if (oldVal !== '') {
        this.dialogPopQueryBirdB = {
          ...this.dialogPopQueryBirdB,
          followRemark: ''
        }
      }
      if (val !== 1) {
        Reflect.set(this.rulesBirdB, 'followRemark', [
          { required: false, message: '请填写跟进备注' }
        ])
      } else {
        Reflect.set(this.rulesBirdB, 'followRemark', [
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
    if (Number(this.clueStatus) < 2) {
      this.dialogFormItem.splice(1, this.dialogFormItem.length - 2)
      this.dialogPopQuery = {
        inviteCaseSuccessOrFail: '',
        inviteRemark: '',
        inviteTime: '',
        inviteFailReason: '',
        intentionNum: ''
      };
      (this.$refs['dialogFollowUpFirmiana'] as any).clearValidate()
    } else if (Number(this.clueStatus) === 2) {
      this.dialogFormItemBirdCar.splice(
        1,
        this.dialogFormItemBirdCar.length - 2
      )
      this.dialogPopQueryBirdCar = {
        tagStatus: '',
        needType: '',
        followRemark: '',
        wantGiveMoney: '',
        canContact: ''
      };
      (this.$refs['dialogFollowUpBirdCar'] as any).clearValidate()
    } else if (Number(this.clueStatus) === 3) {
      this.dialogFormItemBirdC.splice(1, this.dialogFormItemBirdC.length - 2)
      this.dialogPopQueryBirdC = {
        tagStatus: '',
        inviteCarType: '',
        followRemark: '',
        likeCar: '',
        canContact: ''
      };
      (this.$refs['dialogFollowUpBirdC'] as any).clearValidate()
    } else {
      this.dialogFormItemBirdB.splice(1, this.dialogFormItemBirdB.length - 2)
      this.dialogPopQueryBirdB = {
        tagStatus: '',
        inviteCarType: [],
        followRemark: '',
        likeCar: [],
        canContact: ''
      };
      (this.$refs['dialogFollowUpBirdB'] as any).clearValidate()
    }
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
  // 验证通过
  @lock
  private async handlePassClick(val: boolean) {}
}
</script>
