<template>
  <el-row
    :gutter="20"
    class="selfForm"
    :class="{
      pc: pcBlock,
      mobile: mBlock,
      p15: isPC
    }"
  >
    <el-form
      ref="ruleForm"
      :model="listQuery"
      v-bind="$attrs"
      :rules="rules"
    >
      <el-col
        v-for="item in formItem"
        :key=" item.key||item.label"
        :span="isPC ? item.col || pcCol : 24"
        :offset="item.offset|| 0"
      >
        <el-form-item
          v-if="!item.hidden"
          :label="item.label"
          :prop="item.key"
          :label-width="item.w"
          :class="item.class"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 1"
            v-model.trim="listQuery[item.key]"
            :style="item.style"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          >
            <template
              v-if="item.tag"
              :slot="item.tag.type"
            >
              {{ item.tag.name }}
            </template>
          </el-input>
          <el-input-number
            v-if="item.type === 14"
            v-model.number="listQuery[item.key]"
            style="width:100%"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-input
            v-if="item.type === 13"
            v-model.trim="listQuery[item.key]"
            type="textarea"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <!-- 下拉框 -->
          <el-select
            v-else-if="item.type === 2"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          >
            <el-option
              v-for="(sub,index) in item.options"
              :key="'select-'+sub.value+'-'+index"
              :label="sub.label"
              :value="sub.value"
            />
          </el-select>
          <!-- 日期区间控件 -->
          <el-date-picker
            v-else-if="item.type ===3"
            v-model="listQuery[item.key]"
            :editable="false"
            v-bind="item.tagAttrs || {}"
            :type="item.dateType || 'daterange'"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-on="item.listeners"
          />

          <el-radio-group
            v-else-if="item.type ===4"
            v-model="listQuery[item.key]"
            v-on="item.listeners"
          >
            <el-radio
              v-for="(sub,index) in item.options"
              :key="'radio-'+sub.value+'-'+index"
              :label="sub.value"
              v-bind="item.tagAttrs || {}"
            >
              {{ sub.label }}
            </el-radio>
          </el-radio-group>
          <el-checkbox-group
            v-else-if="item.type ===5"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          >
            <el-checkbox
              v-for="(sub,index) in item.options"
              :key="'checkbox-'+sub.value+'-'+index"
              :label="sub.value"
            >
              {{ sub.label }}
            </el-checkbox>>
          </el-checkbox-group>
          <!-- 选择日期 -->
          <el-date-picker
            v-else-if="item.type ===6"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            :editable="false"
            type="date"
            value-format="timestamp"
            v-on="item.listeners"
          />
          <!-- 显示文本 -->
          <span
            v-else-if="item.type ===7"
            v-bind="item.tagAttrs || {}"
            v-text="canNull(listQuery[item.key],item.isNull,item.filterText,item.unit)"
          />
          <el-cascader
            v-else-if="item.type ===8"
            ref="cascader"
            v-model="listQuery[item.key]"
            :style="item.style"
            v-bind="item.tagAttrs || {}"
            :options="item.options"
            v-on="item.listeners"
          />
          <!-- 选择日期时分秒 -->
          <el-date-picker
            v-else-if="item.type ===9"
            v-model="listQuery[item.key]"
            :editable="false"
            type="datetime"
            value-format="timestamp"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-time-picker
            v-else-if="item.type ===10"
            v-model="listQuery[item.key]"
            :editable="false"
            is-range
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="timestamp"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <el-autocomplete
            v-else-if="item.type ===11"
            v-model="listQuery[item.key]"
            v-bind="item.tagAttrs || {}"
            v-on="item.listeners"
          />
          <template
            v-else-if="item.type ===12"
          >
            <el-time-select
              v-model="listQuery[item.key].jobStartDate"
              class="timeSelect"
              placeholder="起始时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
            />
            <el-time-select
              v-model="listQuery[item.key].jobEndDate"
              class="timeSelect"
              placeholder="结束时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45',
                minTime: listQuery[item.key].jobStartDate
              }"
            />
          </template>
          <template v-else-if="item.type === 15">
            <el-select
              v-model.trim="listQuery[item.key]"
              v-loadmore="loadQueryLineByKeyword"
              placeholder="请选择"
              reserve-keyword
              :default-first-option="true"
              clearable
              filterable
              remote
              :remote-method="queryLineByKeyword"
              @clear="handleClearQueryLine"
            >
              <el-option
                v-for="sub in lineOptions"
                :key="sub.value"
                :label="sub.label"
                :value="sub.value"
              />
            </el-select>
          </template>
          <template v-else-if="item.type === 16">
            <el-col :span="8">
              <el-cascader
                ref="cascader2"
                v-model="listQuery[item.key]"
                v-bind="item.tagAttrs || {}"
                :options="item.options"
                @visible-change="item.listeners"
              />
            </el-col>
            <el-col :span="16">
              <el-select
                v-model="item.value"
                multiple
                placeholder="请选择"
              >
                <el-option
                  v-for="obj in item.countyOptions"
                  :key="obj.value"
                  :label="obj.label"
                  :value="obj.value"
                />
              </el-select>
            </el-col>
          </template>
          <slot
            v-else-if="item.slot"
            :name="item.type"
            :row="{...listQuery,...{key: item.key}}"
          />
        </el-form-item>
      </el-col>
      <slot name="other" />
      <div class="clearfix" />
    </el-form>
    <slot name="btn" />
  </el-row>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { DataIsNull } from '@/utils/index'
import '@/styles/common.scss'

interface IState {
  [key: string]: any;
}
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
@Component({
  name: 'SelfForm.houseAddress'
})
export default class extends Vue {
    // 判断是否是PC
    @Prop({ default: () => {} }) listQuery!:IState
    @Prop({ default: () => [] }) formItem!:any[]
    @Prop({ default: 6 }) pcCol!:Number
    @Prop({ default: () => {} }) rules!:IState
    @Prop({ default: false }) mBlock!:boolean
    @Prop({ default: false }) pcBlock!:boolean
    @Prop({ default: () => {} }) loadByKeyword!:Function
    private lineOptions:IState[] = []
    private lineKeyword = '' // 线路关键字
    private queryLineLoading:boolean = false
    private linePage:PageObj ={
      page: 0,
      limit: 10
    }
    // 区分设备
    get isPC() {
      return SettingsModule.isPC
    }

    // 没有数据的情况下，是否展示暂无数据，默认展示否则为空
    canNull(val:any, isNull:any, filterText:string, unit:string = '') {
      if (isNull) {
        if (val || val === 0) {
          return val + unit
        } else {
          return ''
        }
      } else if (filterText) {
        if (typeof filterText === 'string') {
          const arr = filterText.split(':')
          return val === 1 ? arr[0] : arr[1]
        }
        return ''
      } else {
        return DataIsNull(val) !== '暂无数据' ? DataIsNull(val + unit) : '暂无数据'
      }
    }
    // 提交表单
    submitForm(args:any) {
      ((this.$refs['ruleForm']) as any).validate((valid:boolean) => {
        if (valid) {
          this.handlePass(valid, args)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    // 重置表单
    resetForm() {
      ((this.$refs['ruleForm']) as any).resetFields()
    }
    clearValidate(props:Array<string>|string) {
      ((this.$refs['ruleForm']) as any).clearValidate(props)
    }
    @Emit('onPass')
    handlePass(isPass:boolean, args:any) {
    }
    // 顶部查询线路列表
    async loadQueryLineByKeyword(val?:string) {
      this.linePage.page++
      val = this.lineKeyword
      let params:IState = {
        page: this.linePage.page,
        limit: this.linePage.limit
      }
      val !== '' && (params.key = val)
      this.queryLineLoading = true
      try {
        let result:IState[] = await this.loadByKeyword(params)
        this.lineOptions.push(...result)
      } finally {
        this.queryLineLoading = false
      }
    }
    // 顶部线路关键字搜索
    queryLineByKeyword(val:string) {
      this.linePage.page = 0
      this.lineKeyword = val
      this.resetLineOptions()
      this.loadQueryLineByKeyword(val)
    }
    // 删除查询区选中的线路
    handleClearQueryLine() {
      this.lineKeyword = ''
      this.linePage.page = 0
      this.resetLineOptions()
      this.loadQueryLineByKeyword()
    }
    // 清空线路列表
    resetLineOptions() {
      let len:number = this.lineOptions.length
      if (len > 0) {
        this.lineOptions.splice(0, len)
      }
    }
}
</script>

<style lang="scss" scoped>
  .selfForm {
   .clearfix {
     display: block;
     content:'';
     overflow: hidden;
     clear: both;
   }
  }
</style>

<style scoped>
  .selfForm >>> .el-form-item__label {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #4A4A4A;
  }
  .selfForm >>> .el-form-item__content {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-input {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-select {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-date-editor {
    display: flex;
    flex: 1;
  }
  .selfForm >>> .el-cascader {
    display: flex;
    flex: 1;
  }

  .selfForm >>> .el-autocomplete {
    display: flex;
    flex: 1;
  }

  .selfForm >>> .el-radio {
    height:36px;
    line-height: 36px;
  }

  @media screen and (max-width: 700px){
    .mobile >>> .el-form-item {
      display: flex;
      flex-direction: column;
    }

    .mobile >>> .el-form-item__label {
      text-align: left;
    }

    .mobile >>> .el-form-item__content {
      margin-left: 0px!important;
    }
  }
  @media screen and (min-width: 700px){
    .pc >>> .el-form-item {
      display: flex;
      flex-direction: column;
    }

    .pc >>> .el-form-item__label {
      text-align: left;
    }

    .pc >>> .el-form-item__content {
      margin-left: 0px!important;
    }
  }
</style>

<style>
  @media screen and (max-width: 700px) {
    .el-picker-panel{
      left: 0 !important;
      width: 100%!important;
      overflow-x: auto;
    }
  }
</style>
