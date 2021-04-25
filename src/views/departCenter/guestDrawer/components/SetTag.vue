<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-17 10:13:08
 * @LastEditTime: 2021-04-25 13:44:32
 * @LastEditors: D.C.base
-->
<template>
  <div class="setTag">
    <SelfDialog
      :visible.sync="isShow"
      title="给司机打标签"
      :confirm="confirm"
      :cancel="handleDialogClosed"
      :modal="false"
      width="800px"
      :destroy-on-close="false"
    >
      <self-form
        ref="setTagFrom"
        :list-query="listQuery"
        :form-item="formItem"
        :rules="rules"
        size="small"
        label-width="130px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassChange"
      >
        <template slot="startTime">
          <el-time-select
            v-model="listQuery['jobStartDate']"
            class="timeSelect"
            placeholder="起始时间"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00'
            }"
          />
          <span style="padding:0 3px">-</span>
          <el-time-select
            v-model="listQuery['jobEndDate']"
            class="timeSelect"
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
            v-only-number="{min: 0, max: 10000, precision: 1}"
            style="width:100px"
            clearable="true"
            placeholder="请输入期望运费"
          />
        </template>
        <template slot="endTime">
          <el-time-select
            v-model="listQuery['jobStartDate2']"
            class="timeSelect"
            placeholder="起始时间"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '23:00'
            }"
          />
          <span style="padding:0 3px">-</span>
          <el-time-select
            v-model="listQuery['jobEndDate2']"
            class="timeSelect"
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
            placeholder="请输入内容"
          />
          <div class="tags">
            <el-radio-group
              v-model="listQuery.remark"
              size="small"
            >
              <el-radio
                v-for="(item,index) in reasonLists"
                :key="index"
                border
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
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
import { getProviceCityAndCountryData, getProvinceList, getProviceCityCountryData } from '../../js/index'
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
    address: '',
    prohibition2: '',
    prohibitionRegion: {
      address: [],
      areas: []
    },
    area2: [],
    hard: '',
    complexity: [],
    period: '',
    expected: '',
    isWork: '',
    chargingCode: 0,
    stable: [],
    starting: '',
    detailed: '',
    jobStartDate: null,
    jobEndDate: null,
    jobStartDate2: null,
    jobEndDate2: null,
    distribution: '',
    detailed2: '',
    situation: '',
    remark: ''
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
      type: 16,
      key: 'prohibitionAddress',
      label: '可闯禁行区域',
      col: 24,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        multiple: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityAndCountryData
        }
      },
      countyOptions: [],
      listeners(visible:boolean) {
        if (!visible) {
          _this.getData()
        }
      }
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
      type: 16,
      key: 'prohibitionRegion',
      label: '可闯限行区域',
      col: 24,
      value: [],
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        multiple: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityAndCountryData
        }
      },
      countyOptions: [],
      listeners(visible:boolean) {
        if (!visible) {
          _this.getDataRegion()
        }
      }
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
        placeholder: '请输入期望运费',
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
        { label: '没有', value: 0 },
        { label: '有', value: 1 }
      ]
    },
    {
      type: 8,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData
        }
      },
      label: '起始点',
      key: 'starting'
    },
    {
      type: 1,
      w: '0px',
      tagAttrs: {
        placeholder: '请输入详细地址',
        clearable: true
      },
      col: 6,
      key: 'detailed'
    },
    {
      slot: true,
      type: 'startTime',
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 8,
      key: 'startTime'
    },
    {
      type: 8,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData
        }
      },
      label: '配送点',
      key: 'distribution'
    },
    {
      type: 1,
      w: '0px',
      tagAttrs: {
        placeholder: '请输入详细地址',
        clearable: true
      },
      col: 6,
      key: 'detailed2'
    },
    {
      slot: true,
      type: 'endTime',
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 8,
      key: 'endTime'
    },
    {
      type: 4,
      key: 'situation',
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
      type: 'remark',
      label: '备注:',
      tagAttrs: {
        placeholder: '请输入',
        maxlength: 300,
        type: 'textarea',
        'show-word-limit': true,
        rows: '5',
        clearable: true
      },
      key: 'remark'
    }
  ]
  private rules:IState = {
    prohibition1: [
      { required: true, message: '请选择是否闯禁行', trigger: 'change' }
    ],
    prohibition2: [
      { required: true, message: '请选择是否闯限行', trigger: 'change' }
    ],
    hard: [
      { required: true, message: '请选择装卸接受度', trigger: 'change' }
    ],
    complexity: [
      { required: true, message: '请选择配送复杂度', trigger: 'change' }
    ],
    expected: [
      { required: true, message: '请输入期望的运费', trigger: 'blur' }
    ],
    isWork: [
      { required: true, message: '请选择外边是否有活', trigger: 'change' }
    ],
    starting: [
      { required: true, message: '请选择起始点', trigger: 'change' }
    ],
    distribution: [
      { required: true, message: '请选择配送点', trigger: 'change' }
    ],
    situation: [
      { required: true, message: '请选择司机情况', trigger: 'change' }
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
      this.isShow = false
    }).catch(() => {

    })
  }
  private getData() {
    setTimeout(async() => {
      let res = await getProvinceList(['100000', ...this.listQuery.prohibitionAddress])
      this.$set(this.formItem[1], 'countyOptions', res)
    }, 100)
  }
  private getDataRegion() {
    setTimeout(async() => {
      let res = await getProvinceList(['100000', ...this.listQuery.prohibitionRegion])
      this.$set(this.formItem[3], 'countyOptions', res)
    }, 100)
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
.tags{
  display: flex;
  position: absolute;
  top:5px;
  left: 5px;
  flex-wrap: wrap;
  ::v-deep .el-radio{
    margin: 0;
    margin-left: 0 !important;
    margin-right: 5px;
    padding: 0 10px 0 0;

  }
  ::v-deep .el-radio__input{
    display: none;
  }
}
.remark ::v-deep .el-textarea__inner{
  padding-top: 50px;
  padding-bottom: 10px;
}
</style>
