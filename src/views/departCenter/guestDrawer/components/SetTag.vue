<template>
  <div class="setTag">
    <SelfDialog
      :visible.sync="isShow"
      title="给司机打标签"
      :confirm="confirm"
      :cancel="handleDialogClosed"
      :modal="false"
      width="800px"
    >
      <self-form
        ref="setTagFrom"
        :list-query="listQuery"
        :form-item="formItem"
        :rules="rules"
        size="mini"
        label-width="130px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassChange"
      >
        <template
          slot="jobStartDate"
        >
          <el-time-select
            v-model="listQuery['jobStartDate']"
            class="timeSelect"
            prop="jobStartDate"
            placeholder="起始时间"
            style="width:50px"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00'
            }"
          />
        </template>
        <template
          slot="jobEndDate"
        >
          <span style="margin-left:-20px;padding: 0 3px;">-</span>
          <el-time-select
            v-model="listQuery['jobEndDate']"
            class="timeSelect"
            prop="jobEndDate"
            style="width:50px"
            placeholder="结束时间"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00',
              minTime: listQuery['jobStartDate']
            }"
          />
        </template>
        <template slot="expected">
          <el-input
            v-model.trim="listQuery['expected']"
            v-only-number="{min: 0, max: 20000, precision: 0}"
            style="width:100px;flex:initial"
            :clearable="true"
            placeholder="请输入"
          />
        </template>
        <template
          slot="jobStartDate2"
        >
          <el-time-select
            v-model="listQuery['jobStartDate2']"
            class="timeSelect"
            placeholder="起始时间"
            prop="jobStartDate2"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00'
            }"
          />
        </template>
        <template
          slot="jobEndDate2"
        >
          <span style="margin-left:-20px;padding: 0 3px;">-</span>
          <el-time-select
            v-model="listQuery['jobEndDate2']"
            class="timeSelect"
            prop="jobEndDate2"
            placeholder="结束时间"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00',
              minTime: listQuery['jobStartDate2']
            }"
          />
        </template>
        <template slot="remark">
          <el-input
            v-model="listQuery.remark"
            class="remark"
            type="textarea"
            :rows="2"
            clearable
            maxlength="20"
            show-word-limit
            placeholder="请输入内容"
          />
          <div class="tags">
            <el-checkbox-group
              v-model="listQuery.tags"
              size="mini"
            >
              <el-checkbox
                v-for="(item,index) in reasonLists"
                :key="index"
                border
                :label="item.value"
              >
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
      </self-form>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { getProviceCityData, getProvinceList, getProviceCityAndCountry } from '../../js/index'
interface IState {
  [key: string]: any;
}
var _this:any = {}
@Component({
  name: 'SetTag',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  private isShow : boolean = false // 抽屉显示隐藏
  private countyOptions:IState[] = []
  private cancelOptions:IState[] = [] // 取消原因
  private reasonLists:IState[] = [
    {
      label: '电话停机',
      value: '电话停机'
    },
    {
      label: '电话长期打不通',
      value: '电话长期打不通'
    },
    {
      label: '电话空号',
      value: '电话空号'
    },
    {
      label: '电话号码错误',
      value: '电话号码错误'
    },
    {
      label: '态度恶劣，无法沟通',
      value: '态度恶劣，无法沟通'
    }
  ]
  private timeLists:IState[] = []
  private listQuery:IState = {
    prohibition1: '',
    prohibitionAddress: '',
    prohibitArea: [],
    prohibition2: '',
    prohibitionRegion: '',
    limitArea: [],
    hard: '',
    complexity: [],
    period: '',
    expected: '',
    isWork: '',
    chargingCode: 0,
    stable: [],
    starting: '',
    detailed: '',
    jobStartDate2: null,
    jobEndDate2: null,
    distribution: '',
    detailed2: '',
    situation: '',
    tags: [],
    remark: ''
  }
  @Watch('listQuery.prohibition1')
  onlistQueryChanged(val: any, oldVal: any) {
    this.formItem[1].hidden = !val
    this.formItem[2].hidden = !val
  }
  @Watch('listQuery.prohibition2')
  onlistQueryRegionChanged(val: any, oldVal: any) {
    this.formItem[4].hidden = !val
    this.formItem[5].hidden = !val
  }
  @Watch('listQuery.isWork')
  onlistQueryWorkChanged(val: any, oldVal: any) {
    this.formItem[12].hidden = !val
    this.formItem[13].hidden = !val
    this.formItem[14].hidden = !val
    this.formItem[15].hidden = !val
    this.formItem[16].hidden = !val
    this.formItem[17].hidden = !val
  }
  @Watch('listQuery.tags')
  onlistQuerytagsChanged(val: any, oldVal: any) {
    if (val.length > 1) {
      this.listQuery.tags.shift()
    }
    this.listQuery.remark = ''
  }
  private formItem:any[] = [
    {
      type: 4,
      key: 'prohibition1',
      label: '能否闯禁行',
      col: 24,
      options: [
        { label: '不可以', value: false },
        { label: '可以', value: true }
      ]
    },
    {
      type: 8,
      hidden: false,
      key: 'prohibitionAddress',
      label: '可闯禁行区域',
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        multiple: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityData
        }
      },
      listeners: {
        'visible-change': (visible:boolean) => {
          if (!visible) {
            _this.getCountryData('prohibitionAddress', 2)
          }
        }
      }
    },
    {
      type: 2,
      col: 14,
      hidden: false,
      key: 'prohibitArea',
      label: '',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        multiple: true
      },
      options: []
    },
    {
      type: 4,
      key: 'prohibition2',
      label: '能否闯限行',
      col: 24,
      options: [
        { label: '不可以', value: false },
        { label: '可以', value: true }
      ]
    },
    {
      type: 8,
      hidden: false,
      key: 'prohibitionRegion',
      label: '可闯限行区域',
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        multiple: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityData
        }
      },
      listeners: {
        'visible-change': (visible:boolean) => {
          if (!visible) {
            _this.getCountryData('prohibitionRegion', 5)
          }
        }
      }
    },
    {
      type: 2,
      col: 14,
      hidden: false,
      key: 'limitArea',
      label: '',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        multiple: true
      },
      options: []
    },
    {
      type: 4,
      key: 'hard',
      label: '装卸接受度',
      col: 24,
      options: [
        { label: '不接受装卸', value: 0 },
        { label: '轻装卸', value: 1 },
        { label: '重装卸', value: 2 }
      ]
    },
    {
      type: 5,
      key: 'complexity',
      label: '配送复杂度',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: [
        { label: '整车', value: 1 },
        { label: '多点配', value: 2 }
      ]
    },
    {
      type: 4,
      key: 'period',
      label: '期望账期',
      col: 24,
      options: [
        { label: '现结', value: 0 },
        { label: '周结', value: 1 },
        { label: '半月结', value: 2 },
        { label: '月结', value: 3 },
        { label: '季度结', value: 4 }
      ]
    },
    {
      slot: true,
      type: 'expected',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      style: {
        flex: 'none',
        width: '100px'
      },
      label: '期望运费（趟）',
      key: 'expected'
    },
    {
      type: 5,
      key: 'stable',
      label: '期望稳定/临时',
      tagAttrs: {
        placeholder: '请选择'
      },
      options: [
        { label: '稳定', value: 1 },
        { label: '临时', value: 2 }
      ]
    },
    {
      type: 4,
      key: 'isWork',
      label: '外边是否有活',
      col: 24,
      options: [
        { label: '没有', value: false },
        { label: '有', value: true }
      ]
    },
    {
      type: 8,
      col: 12,
      hidden: false,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityAndCountry
        }
      },
      label: '起始点',
      key: 'starting'
    },
    {
      slot: true,
      hidden: false,
      type: 'jobStartDate',
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 4,
      key: 'jobStartDate'
    },
    {
      slot: true,
      hidden: false,
      type: 'jobEndDate',
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 4,
      key: 'jobEndDate'
    },
    {
      type: 8,
      col: 12,
      hidden: false,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityAndCountry
        }
      },
      label: '配送点',
      key: 'distribution'
    },
    {
      slot: true,
      hidden: false,
      type: 'jobStartDate2',
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 4,
      key: 'jobStartDate2'
    },
    {
      slot: true,
      hidden: false,
      type: 'jobEndDate2',
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 4,
      key: 'jobEndDate2'
    },
    {
      type: 4,
      key: 'situation',
      label: '司机情况',
      col: 24,
      options: [
        { label: '着急试跑', value: '1' },
        { label: '想跟跑', value: '2' },
        { label: '考虑退费', value: '3' },
        { label: '威胁司撮要退费', value: '4' },
        { label: '铁了心要退费', value: '5' },
        { label: '不要再给我打电话', value: '6' },
        { label: '想请假', value: '7' }
      ]
    },
    {
      slot: true,
      type: 'remark',
      label: '备注:',
      key: 'remark'
    }
  ]
  private rules:IState = {
    prohibitionAddress: [
      { required: true, message: '请选择可闯禁行区域', trigger: 'change' }
    ],
    prohibitArea: [
      { required: true, message: '请选择可闯禁行区域', trigger: 'change' }
    ],
    prohibitionRegion: [
      { required: true, message: '请选择可闯限行区域', trigger: 'change' }
    ],
    limitArea: [
      { required: true, message: '请选择可闯限行区域', trigger: 'change' }
    ],
    starting: [
      { required: true, message: '请选择起始点', trigger: 'change' }
    ],
    jobStartDate: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    jobEndDate: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    jobStartDate2: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    jobEndDate2: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    distribution: [
      { required: true, message: '请选择配送点', trigger: 'change' }
    ]
  }
  // 确定按钮
  private confirm() {
    (this.$refs.setTagFrom as any).submitForm()
    console.log(this.listQuery)
  }
  // 弹框关闭
  private handleDialogClosed() {
    this.$confirm('是否放弃给司机打标签?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      (this.$refs.setTagFrom as any).resetForm()
      this.listQuery.prohibitionAddress = ''
      this.listQuery.prohibitionRegion = ''
      this.listQuery.starting = ''
      this.listQuery.distribution = ''
      this.isShow = false
    }).catch(() => {

    })
  }
  private getCountryData(key:string, index:number) {
    setTimeout(async() => {
      if (!this.listQuery[key]) return false
      console.log(this.listQuery[key])
      let res:any = await getProvinceList(['100000', ...this.listQuery[key]])
      if (key === 'prohibitionAddress') {
        this.listQuery.prohibitArea = []
      } else {
        this.listQuery.limitArea = []
      }
      this.$set(this.formItem[index], 'options', res)
    }, 10)
  }

  // 验证通过
  handlePassChange() {

  }
  created() {
    _this = this
    for (let i = 0; i < 24; i++) {
      let count = i < 9 ? `0${i}:00` : `${i}:00`
      this.timeLists.push({
        label: count,
        value: count
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__wrapper{
    background:rgba(0,0,0,0.5);
}
::v-deep .el-form-item__label{
  width:100px;
}
::v-deep .el-date-editor{
  .el-input__inner{
    padding-right: 5px;
  }
}
::v-deep .el-form-item__content{
    margin: 0 !important;
}
.tags{
  display: flex;
  position: absolute;
  top:5px;
  left: 5px;
  flex-wrap: wrap;
  ::v-deep .el-checkbox{
    margin: 0;
    margin-left: 0 !important;
    margin-right: 5px;
    padding: 0 10px 0 0;

  }
  ::v-deep .el-checkbox{
    line-height: 26px;
  }
  ::v-deep .el-checkbox__input{
    display: none;
  }
}
.remark ::v-deep .el-textarea__inner{
  padding-top: 40px;
}
</style>
