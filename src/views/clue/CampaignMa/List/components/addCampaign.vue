<template>
  <div class="addCampaignContainer">
    <self-form
      ref="form"
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="140px"
      class="p15 SuggestForm"
      :pc-col="24"
      :rules="rules"
      @onPass="handlePass"
    >
      <template #h>
        <el-input
          v-model="listQuery.h"
          v-only-number="{min: 0, max: 999999.99, precision: 2}"
          placeholder="请输入"
          clearable
        />
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'

interface IState {
  [key: string]: any;
}
@Component({
  name: 'AddCampaign',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) regionList!:IState;
  @Prop({ default: () => {} }) cityList!:IState;
  @Prop({ default: () => {} }) platformList!:IState;
  private listQuery:IState = {}
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入客群细分ID',
        clearable: true,
        maxlength: 10
      },
      label: '客群细分ID',
      key: 'a'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属区域',
      key: 'b',
      options: this.regionList
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '城市',
      key: 'c',
      options: this.cityList
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '投放平台',
      key: 'd',
      options: this.platformList
    },
    {
      type: 6,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59']
      },
      label: '投放起始时间',
      key: 'startTime'
    },
    {
      type: 6,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59']

      },
      label: '投放终止时间',
      key: 'endTime'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 10
      },
      label: '落地页',
      key: 'g'
    },
    {
      type: 'h',
      label: '预算(元)',
      key: 'h',
      slot: true
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '选填,最多输入200个字',
        'show-word-limit': true,
        maxlength: 200,
        type: 'textarea',
        rows: 3
      },
      label: '诉求',
      key: 'i'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '选填,最多输入200个字',
        'show-word-limit': true,
        maxlength: 200,
        type: 'textarea',
        rows: 3
      },
      label: '备注',
      key: 'j'
    }
  ]
  // 表单校验规则
  private rules:IState ={
    a: [
      { required: true, message: '请输入客群细分ID', trigger: 'blur' }
    ],
    b: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    c: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    d: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    startTime: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    endTime: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    g: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    h: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  }
  handlePass() {
    this.$emit('onPass')
  }
  // 验证表单
  handleValidateForm() {
    ((this.$refs.form) as any).submitForm()
  }
}
</script>
<style lang="scss" scoped>
  .addCampaignContainer {

  }
</style>
