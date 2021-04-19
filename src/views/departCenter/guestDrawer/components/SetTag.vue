<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-17 10:13:08
 * @LastEditTime: 2021-04-19 09:09:31
 * @LastEditors: D.C.base
-->
<template>
  <div class="setTag">
    <SelfDialog
      :visible.sync="showDialog"
      title="给司机打标签"
      :confirm="confirm"
      width="770px"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <self-form
        ref="cancelForm"
        :list-query="listQuery"
        :form-item="formItem"
        :rules="rules"
        size="small"
        label-width="200px"
        class="p15 SuggestForm"
        :pc-col="24"
        @onPass="handlePassChange"
      >
        <template slot="remark">
          <el-input
            v-model="listQuery.remark"
            class="remark"
            type="textarea"
            :rows="1"
            placeholder="请输入内容"
          />
          <div class="tags">
            <el-radio
              v-for="(item,index) in reasonLists"
              :key="index"
              border
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </div>
        </template>
      </self-form>
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { getProviceCityAndCountryData, getProvinceList, getProviceCityCountryData } from '../../js/index'
interface IState {
  [key: string]: any;
}
var _this = {}
@Component({
  name: 'SetTag',
  components: {
    SelfDialog,
    SelfForm
  }
})
export default class extends Vue {
  private showDialog:boolean = true
  private countyOptions:Array = []
  private cancelOptions:IState[] = [] // 取消原因
  private reasonLists:IState[] = [
    {
      label: '电话停机',
      value: '1'
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
    prohibitionAddress: '',
    complexity: [],
    stable: [],
    remark: ''
  }
  private formItem:any[] = [
    {
      type: 4,
      key: 'prohibition',
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
          _this.getData()
        }
        // this.$refs['cascader2'].$children.toggleDropDownVisible(false)
      }
    },
    {
      type: 4,
      key: 'prohibition4',
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
        // this.$refs['cascader2'].$children.toggleDropDownVisible(false)
      }
    },
    {
      type: 4,
      key: 'prohibition3',
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
      key: 'prohibition2',
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
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 4,
      label: '期望运费（趟）',
      key: 'chargingCode'
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
      key: 'prohibition6',
      label: '外边是否有活',
      col: 24,
      options: [
        { label: '没有', value: 0 },
        { label: '有', value: 1 }
      ]
    },
    {
      type: 8,
      col: 12,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData
        }
      },
      label: '起始点',
      key: 'i'
    },
    {
      type: 1,
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 6,
      key: 'chargingCode1'
    },
    {
      type: 10,
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 6,
      key: 'chargingCode3'
    },
    {
      type: 8,
      col: 12,
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
        placeholder: '请输入',
        clearable: true
      },
      col: 6,
      key: 'chargingCode4'
    },
    {
      type: 10,
      w: '0px',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true
      },
      col: 6,
      key: 'chargingCode5'
    },
    {
      type: 4,
      key: 'prohibition7',
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
    a: [
      { required: true, message: '请选择取消创建试跑意向的原因', trigger: 'blur' }
    ]
  }
  // 确定按钮
  private confirm() {
    (this.$refs.cancelForm as any).submitForm()
  }
  // 弹框关闭
  private handleDialogClosed() {
    (this.$refs.cancelForm as any).resetForm()
  }
  getData() {
    setTimeout(async() => {
      let res = await getProvinceList(['100000', ...this.listQuery.prohibitionAddress])
      this.$set(this.formItem[1], 'countyOptions', res)
    }, 100)
  }
  getDataRegion() {
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
    //background:rgba(0,0,0,0.5);
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
.setTag {

}
</style>
