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
      <template #budget>
        <el-input
          v-model="listQuery.budget"
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
  @Prop({ default: () => {} }) cityDetail!:Function;
  private listQuery:IState = {
    userGroupId: '',
    areCity: '',
    city: '',
    launchPlatform: '',
    dropStarTime: '',
    dropEndTime: '',
    landingPage: '',
    budget: '',
    appeal: '',
    remarks: ''
  }
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入客群细分ID',
        clearable: true,
        maxlength: 10
      },
      label: '客群细分ID',
      key: 'userGroupId'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属区域',
      key: 'areCity',
      options: this.regionList,
      listeners: {
        'change': () => {
          this.cityDetail(this.listQuery.areCity)
        }
      }
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '城市',
      key: 'city',
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
      key: 'launchPlatform',
      options: this.platformList
    },
    {
      type: 9,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        format: 'yyyy-MM-dd HH:mm',
        'value-format': 'yyyy-MM-dd HH:mm'
      },
      label: '投放起始时间',
      key: 'dropStarTime'
    },
    {
      type: 9,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        format: 'yyyy-MM-dd HH:mm',
        'value-format': 'yyyy-MM-dd HH:mm',
        'picker-options': {
          disabledDate: (time:Date) => {
            if (!this.listQuery.dropStarTime) {
              return true
            }
            return time.getTime() < new Date(this.listQuery.dropStarTime).getTime()
          }
        }

      },
      label: '投放终止时间',
      key: 'dropEndTime'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 10
      },
      label: '落地页',
      key: 'landingPage'
    },
    {
      type: 'budget',
      label: '预算(元)',
      key: 'budget',
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
      key: 'appeal'
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
      key: 'remarks'
    }
  ]
  // 表单校验规则
  private rules:IState ={
    userGroupId: [
      { required: true, message: '请输入客群细分ID', trigger: 'blur' }
    ],
    areCity: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    city: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    launchPlatform: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    dropStarTime: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    dropEndTime: [
      { required: true, message: '请选择', trigger: 'blur' }
    ],
    landingPage: [
      { required: true, message: '请输入', trigger: 'blur' }
    ],
    budget: [
      { required: true, message: '请输入', trigger: 'blur' }
    ]
  }
  // 表单校验通过
  handlePass() {
    this.$emit('onPass', this.listQuery)
  }
  // 验证表单
  handleValidateForm() {
    ((this.$refs.form) as any).submitForm()
  }
  // 重置表单
  resetForm() {
    ((this.$refs.form) as any).resetForm()
  }
}
</script>
<style lang="scss" scoped>
  .addCampaignContainer {

  }
</style>
