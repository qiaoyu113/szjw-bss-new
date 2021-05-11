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
      >
        <template
          slot="jobStartDate"
        >
          <el-time-select
            v-model="listQuery['startingPointStartTime']"
            class="timeSelect"
            prop="startingPointStartTime"
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
            v-model="listQuery['startingPointEndTime']"
            class="timeSelect"
            prop="startingPointEndTime"
            style="width:50px"
            placeholder="结束时间"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00',
              minTime: listQuery['startingPointStartTime']
            }"
          />
        </template>
        <template slot="expected">
          <el-input
            v-model.trim="listQuery['expectIncomeTrip']"
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
            v-model="listQuery['deliveryPointStartTime']"
            class="timeSelect"
            placeholder="起始时间"
            prop="deliveryPointStartTime"
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
            v-model="listQuery['deliveryPointEndTime']"
            class="timeSelect"
            prop="deliveryPointEndTime"
            placeholder="结束时间"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00',
              minTime: listQuery['deliveryPointStartTime']
            }"
          />
        </template>
        <template slot="manuallyRemarks">
          <el-input
            v-model="listQuery['manuallyRemarks']"
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
              v-model="listQuery['remarks']"
              size="mini"
              @change="listQuery.manuallyRemarks=''"
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
import { searchMatchDriverInfo, updateDriverTag } from '@/api/drawer-guest'
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
      value: 1
    },
    {
      label: '电话长期打不通',
      value: 2
    },
    {
      label: '电话空号',
      value: 3
    },
    {
      label: '电话号码错误',
      value: 4
    },
    {
      label: '态度恶劣，无法沟通',
      value: 5
    }
  ]
  private timeLists:IState[] = []
  private listQuery:IState = {
    canBreakingNodriving: '', // 能否闯禁行
    prohibitionAddress: '', // 禁行省市
    breakingNodrivingCounty: [], // 可跑禁行区域-区县
    canBreakingTrafficRestriction: '', // 能否闯限行
    prohibitionRegion: '', // 限行省市
    breakingTrafficRestrictionCounty: [], // 可跑限行区域-区县
    heavyLifting: '', // 装卸接受度
    deliveryDifficulty: [], // 配送难度
    expectAccountingPeriod: '', // 期望账期
    expectIncomeTrip: '', // 期望运费（趟）
    hasIncomeOutside: '', // 外面是否有活
    expectStabilityTemporary: [], // 期望稳定/临时
    starting: '', // 起始点
    startingPointStartTime: null, // 起始点-开始时间
    startingPointEndTime: null, // 起始点-结束时间
    deliveryPointStartTime: null, // 配送点-开始时间
    deliveryPointEndTime: null, // 配送点-结束时间
    delivery: '', // 配送点
    driverSituation: '', // 司机情况
    remarks: [], // 司机备注
    manuallyRemarks: '' // 手动备注
  }
  @Watch('isShow')
  onisShowChanged(val: any, oldVal: any) {
    if (val) {
      this.initData()
    }
  }
  @Watch('listQuery.canBreakingNodriving')
  onlistQueryChanged(val: any, oldVal: any) {
    this.formItem[1].hidden = !val
    this.formItem[2].hidden = !val
  }
  @Watch('listQuery.canBreakingTrafficRestriction')
  onlistQueryRegionChanged(val: any, oldVal: any) {
    this.formItem[4].hidden = !val
    this.formItem[5].hidden = !val
  }
  @Watch('listQuery.hasIncomeOutside')
  onlistQueryWorkChanged(val: any, oldVal: any) {
    this.formItem[12].hidden = !val
    this.formItem[13].hidden = !val
    this.formItem[14].hidden = !val
    this.formItem[15].hidden = !val
    this.formItem[16].hidden = !val
    this.formItem[17].hidden = !val
  }
  @Watch('listQuery.remarks')
  onlistQuerytagsChanged(val: any, oldVal: any) {
    if (val.length > 1) {
      this.listQuery.remarks.shift()
    }
    // this.listQuery.manuallyRemarks = ''
  }
  private formItem:any[] = [
    {
      type: 4,
      key: 'canBreakingNodriving',
      label: '能否闯禁行',
      col: 24,
      options: [
        { label: '不可以', value: false },
        { label: '可以', value: true }
      ]
    },
    {
      type: 8,
      hidden: true,
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
      hidden: true,
      key: 'breakingNodrivingCounty',
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
      key: 'canBreakingTrafficRestriction',
      label: '能否闯限行',
      col: 24,
      options: [
        { label: '不可以', value: false },
        { label: '可以', value: true }
      ]
    },
    {
      type: 8,
      hidden: true,
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
      hidden: true,
      key: 'breakingTrafficRestrictionCounty',
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
      key: 'heavyLifting',
      label: '装卸接受度',
      col: 24,
      options: [
        { label: '不接受装卸', value: 2 },
        { label: '轻装卸', value: 1 },
        { label: '重装卸', value: 0 }
      ]
    },
    {
      type: 5,
      key: 'deliveryDifficulty',
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
      key: 'expectAccountingPeriod',
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
      key: 'expectIncomeTrip'
    },
    {
      type: 5,
      key: 'expectStabilityTemporary',
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
      key: 'hasIncomeOutside',
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
      key: 'startingPointStartTime'
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
      key: 'startingPointEndTime'
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
      key: 'delivery'
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
      key: 'deliveryPointStartTime'
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
      key: 'deliveryPointEndTime'
    },
    {
      type: 4,
      key: 'driverSituation',
      label: '司机情况',
      col: 24,
      options: [
        { label: '着急试跑', value: 1 },
        { label: '想跟跑', value: 2 },
        { label: '考虑退费', value: 3 },
        { label: '威胁司撮要退费', value: 4 },
        { label: '铁了心要退费', value: 5 },
        { label: '不要再给我打电话', value: 6 },
        { label: '想请假', value: 7 }
      ]
    },
    {
      slot: true,
      type: 'manuallyRemarks',
      label: '备注:',
      key: 'manuallyRemarks'
    }
  ]
  private rules:IState = {
    prohibitionAddress: [
      { required: true, message: '请选择可闯禁行区域', trigger: 'change' }
    ],
    breakingNodrivingCounty: [
      { required: true, message: '请选择可闯禁行区域', trigger: 'change' }
    ],
    prohibitionRegion: [
      { required: true, message: '请选择可闯限行区域', trigger: 'change' }
    ],
    breakingTrafficRestrictionCounty: [
      { required: true, message: '请选择可闯限行区域', trigger: 'change' }
    ],
    starting: [
      { required: true, message: '请选择起始点', trigger: 'change' }
    ],
    startingPointStartTime: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    startingPointEndTime: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    deliveryPointStartTime: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    deliveryPointEndTime: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    delivery: [
      { required: true, message: '请选择配送点', trigger: 'change' }
    ]
  }
  async initData() {
    let { data: res } = await searchMatchDriverInfo('BJS201903301')
    if (res.success) {
      console.log(res)
      this.listQuery.heavyLifting = res.data.heavyLifting
      this.listQuery.deliveryDifficulty = res.data.deliveryDifficulty
      this.listQuery.expectAccountingPeriod = res.data.expectAccountingPeriod
      this.listQuery.expectIncomeTrip = res.data.expectIncomeTrip
      this.listQuery.hasIncomeOutside = res.data.hasIncomeOutside
      this.listQuery.expectStabilityTemporary = res.data.expectStabilityTemporary
      this.listQuery.startingPointStartTime = res.data.startingPointStartTime
      this.listQuery.startingPointEndTime = res.data.startingPointEndTime
      this.listQuery.deliveryPointStartTime = res.data.deliveryPointStartTime
      this.listQuery.deliveryPointEndTime = res.data.deliveryPointEndTime
      this.listQuery.driverSituation = res.data.driverSituation
      this.listQuery.remarks = [res.data.remarks]
      this.listQuery.manuallyRemarks = res.data.manuallyRemarks
      if (res.data.hasIncomeOutside) {
        this.listQuery.starting = [res.data.startingPointProvince, res.data.startingPointCity, res.data.startingPointCounty]
        this.listQuery.delivery = [res.data.deliveryPointProvince, res.data.deliveryPointCity, res.data.deliveryPointCounty]
      }
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  // 弹框关闭
  private handleDialogClosed() {
    this.$confirm('是否放弃给司机打标签?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.resetFrom()
    }).catch(() => {

    })
  }
  resetFrom() {
    (this.$refs.setTagFrom as any).resetForm()
    this.listQuery.prohibitionAddress = ''
    this.listQuery.prohibitionRegion = ''
    this.listQuery.starting = ''
    this.listQuery.delivery = ''
    this.listQuery.driverSituation = []
    this.isShow = false
  }
  private getCountryData(key:string, index:number) {
    setTimeout(async() => {
      if (!this.listQuery[key]) return false
      console.log(this.listQuery[key])
      let res:any = await getProvinceList(['100000', ...this.listQuery[key]])
      if (key === 'prohibitionAddress') {
        this.listQuery.breakingNodrivingCounty = []
      } else {
        this.listQuery.breakingTrafficRestrictionCounty = []
      }
      this.$set(this.formItem[index], 'options', res)
    }, 10)
  }
  // 确定按钮
  private confirm() {
    (this.$refs.setTagFrom as any).submitForm()
    this.handlePassChange()
  }

  // 验证通过
  async handlePassChange() {
    if (this.listQuery.canBreakingNodriving) {
      this.listQuery.breakingNodrivingCity = this.listQuery.prohibitionAddress[1] // 可跑禁行区域-市
      this.listQuery.breakingNodrivingProvince = this.listQuery.prohibitionAddress[0] // 可跑禁行区域-省
    }
    if (this.listQuery.canBreakingTrafficRestriction) {
      this.listQuery.breakingTrafficRestrictionProvince = this.listQuery.prohibitionRegion[0] // 可跑限行区域-省
      this.listQuery.breakingTrafficRestrictionCity = this.listQuery.prohibitionRegion[1] // 可跑限行区域-市
    }
    if (this.listQuery.hasIncomeOutside) {
      this.listQuery.startingPointCounty = this.listQuery.starting[2]
      this.listQuery.startingPointCity = this.listQuery.starting[1]
      this.listQuery.startingPointProvince = this.listQuery.starting[0]
      this.listQuery.deliveryPointCity = this.listQuery.delivery[1]
      this.listQuery.deliveryPointCounty = this.listQuery.delivery[2]
      this.listQuery.deliveryPointProvince = this.listQuery.delivery[0]
    }
    console.log(this.listQuery)
    let { data: res } = await updateDriverTag(this.listQuery)
    console.log(res)
    if (res.success) {
      this.resetFrom()
      this.$emit('on-success')
    } else {
      this.$message.error(res.errorMsg)
    }
  }
  mounted() {
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
