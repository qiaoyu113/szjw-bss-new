<template>
  <div class="InfoEditDio">
    <SelfDialog
      :visible.sync="show"
      title="编辑"
      :confirm="confirm"
      width="600px"
      :sumbit-again="submitLoading"
      @closed="handleDialogClosed"
    >
      <!-- // 梧桐 -->
      <SelfForm
        v-if="Number(clueStatus) < 2"
        ref="editFormWt"
        key="editFormWt"
        :rules="rulesWT"
        :list-query="WTQuery"
        :form-item="WTItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <div
          slot="carType"
          style="width:100%"
        >
          <template>
            <el-select
              v-model="WTQuery.carType"
              placeholder="请选择车型"
              :disabled="!WTQuery.hasCar"
            >
              <el-option
                v-for="item in optionsCarType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </div>
      </SelfForm>

      <!-- // 雷鸟车池 -->
      <SelfForm
        v-if="Number(clueStatus) === 2"
        ref="editFormBirdCar"
        key="editFormBirdCar"
        :rules="rulesBirdCar"
        :list-query="BirdCarQuery"
        :form-item="BirdCarItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <div
          slot="carType"
          style="width:100%"
        >
          <template>
            <el-select
              v-model="WTQuery.carType"
              placeholder="请选择车型"
              :disabled="!WTQuery.hasCar"
            >
              <el-option
                v-for="item in optionsCarType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </div>
      </SelfForm>

      <!-- // 雷鸟租赁C -->
      <SelfForm
        v-if="Number(clueStatus) === 3"
        ref="editFormBirdC"
        key="editFormBirdC"
        :rules="rulesBirdCar"
        :list-query="BirdCQuery"
        :form-item="BirdCItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      >
        <div
          slot="carType"
          style="width:100%"
        >
          <template>
            <el-select
              v-model="WTQuery.carType"
              placeholder="请选择车型"
              :disabled="!WTQuery.hasCar"
            >
              <el-option
                v-for="item in optionsCarType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </div>
      </SelfForm>

      <!-- // 雷鸟租赁B -->
      <SelfForm
        v-if="Number(clueStatus) === 4"
        ref="editFormBirdB"
        key="editFormBirdB"
        :rules="rulesBirdCar"
        :list-query="BirdBQuery"
        :form-item="BirdBItem"
        size="small"
        label-width="120px"
        :pc-col="24"
        @onPass="handlePassClick"
      />
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
  name: 'InfoEditDio',
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
  private optionsCarType: object[] = [];
  private rulesWT: IState = {
    intentWork: [{ required: true, message: '请选择期望工作区域' }]
  };
  private WTQuery: IState = {
    name: '',
    phone: '',
    hasCar: true,
    carType: '',
    express: '',
    age: '',
    nowJob: '',
    nowAddress: '',
    intentWork: ''
  };
  private WTItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 2,
      key: 'hasCar',
      label: '是否有车',
      col: 10,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
    {
      slot: true,
      type: 'carType',
      key: 'carType',
      col: 14,
      w: '0',
      class: 'carTypeItem'
    },
    {
      type: 1,
      key: 'express',
      label: '货运经验',
      col: 24,
      tag: { name: '月', type: 'append' },
      tagAttrs: {
        placeholder: '请填写'
      }
    },
    {
      type: 1,
      key: 'age',
      label: '年龄',
      col: 24,
      tag: { name: '岁', type: 'append' },
      tagAttrs: {
        placeholder: '请填写'
      }
    },
    {
      type: 2,
      key: 'nowJob',
      label: '当前职业',
      col: 24,
      tagAttrs: {
        placeholder: '请填写'
      },
      option: []
    },
    {
      type: 1,
      key: 'nowAddress',
      label: '现住址',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '请输入',
        maxlength: '50',
        showWordLimit: true
      }
    },
    {
      type: 2,
      key: 'intentWork',
      label: '期望工作区域',
      col: 24,
      tagAttrs: {
        placeholder: '期望工作区域'
      },
      option: []
    }
  ];

  // 雷鸟车池
  private rulesBirdCar: IState = {
    name: [{ required: true, message: '请填写姓名' }]
  };
  private BirdCarQuery: IState = {
    name: '',
    phone: '',
    carType: '',
    needType: '',
    remark: ''
  };
  private BirdCarItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 2,
      key: 'needType',
      label: '需求类型',
      col: 10,
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
    {
      slot: true,
      type: 'carType',
      key: 'carType',
      col: 14,
      w: '0',
      class: 'carTypeItem'
    },
    {
      type: 1,
      key: 'remark',
      label: '备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填，最多输入100个字',
        maxlength: '50',
        showWordLimit: true
      }
    }
  ];

  // 雷鸟租赁C
  private BirdCQuery: IState = {
    name: '',
    phone: '',
    likeType: '',
    seeType: '',
    remark: ''
  };
  private BirdCItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 2,
      key: 'likeType',
      label: '意向类型',
      col: 24,
      options: []
    },
    {
      type: 2,
      key: 'seeType',
      label: '看中类型',
      col: 24,
      options: []
    },
    {
      type: 1,
      key: 'remark',
      label: '备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填，最多输入100个字',
        maxlength: '100',
        showWordLimit: true
      }
    }
  ];

  // 雷鸟租赁B
  private BirdBQuery: IState = {
    name: '',
    phone: '',
    likeType: [],
    seeType: [],
    remark: ''
  };
  private BirdBItem: IState[] = [
    {
      type: 1,
      key: 'name',
      label: '姓名',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        maxlength: '10',
        showWordLimit: true
      }
    },
    {
      type: 1,
      key: 'phone',
      label: '手机号',
      col: 24,
      tagAttrs: {
        placeholder: '请填写',
        disabled: true
      }
    },
    {
      type: 5,
      key: 'likeType',
      label: '意向类型',
      col: 24,
      options: [
        { label: '擎天柱', value: 0 },
        { label: '擎天柱1', value: 1 },
        { label: '擎天柱2', value: 2 }
      ]
    },
    {
      type: 5,
      key: 'seeType',
      label: '看中类型',
      col: 24,
      options: [
        { label: '擎天柱3', value: 0 },
        { label: '擎天柱4', value: 1 },
        { label: '擎天柱5', value: 2 }
      ]
    },
    {
      type: 1,
      key: 'remark',
      label: '备注',
      col: 24,
      tagAttrs: {
        type: 'textarea',
        placeholder: '选填，最多输入100个字',
        maxlength: '100',
        showWordLimit: true
      }
    }
  ];

  get show() {
    return this.showDialog
  }
  set show(value: boolean) {
    this.$emit('update:showDialog', value)
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

  // 弹框确认
  private confirm() {
    (this.$refs[this.formStatus] as any).submitForm()
  }

  // 弹窗关闭
  private handleDialogClosed() {
    setTimeout(() => {
      (this.$refs[this.formStatus] as any).resetForm();
      (this.$refs[this.formStatus] as any).clearValidate()
    }, 10)
  }
  // 验证通过
  @lock
  private async handlePassClick(val: boolean) {}
}
</script>
<style lang="scss" scoped>
.InfoEditDio ::v-deep .carTypeItem .el-form-item__content {
  margin-left: 0 !important;
}
.InfoEditDio ::v-deep .el-input {
  display: table;
}
</style>
