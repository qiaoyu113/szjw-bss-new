<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:37:27
 * @LastEditTime: 2021-04-26 09:04:00
 * @LastEditors: D.C.base
-->
<template>
  <div class="searchBox">
    <div class="topSelect">
      <div class="selectedform">
        <template
          v-for="(item,index) in selectList"
        >
          <el-dropdown
            :key="index"
            trigger="hover"
            placement="bottom-start"
            @visible-change="handleChange(item)"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              {{ item.title }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(obj,index2) in item.options"
                :key="index2"
                :command="obj.label"
              >
                {{ obj.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <div class="formbox">
          <el-input
            v-model="listQuery.keyWords"
            placeholder="请输入司机姓名/编号"
            suffix-icon="el-icon-search"
          />
          <el-button
            type="primary"
            size="small"
            @click="searchHandle"
          >
            查询
          </el-button>
        </div>
      </div>
      <div class="formList">
        <self-form
          :list-query="listQuery"
          :form-item="formItem"
          size="small"
          class="SuggestForm"
          :pc-col="8"
        >
          <template slot="workTime">
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
          <template slot="freight">
            <el-input
              v-model="listQuery.start"
              v-only-number="{min: 0, max: 20000, precision: 0}"
              style="min-width:100px"
              placeholder="请输入"
            />
            <span style="margin:0 5px">-</span>
            <el-input
              v-model="listQuery.end"
              v-only-number="{min: 0, max: 20000, precision: 0}"
              style="min-width:100px"
              placeholder="请输入"
            />
          </template>
        </self-form>
      </div>
    </div>
    <div
      v-if="selectedData.length>0"
      class="selectedBox"
    >
      <a
        href="javascript:;"
        class="clearAll"
        @click="handleClearAll"
      >全部清空</a>
      <ul class="list">
        <li
          v-for="(item,index) in selectedData"
          :key="index"
        >
          {{ item.type }}：{{ item.selected.join(",") }}<i
            class="el-icon-circle-close"
            @click="clearSelect(index)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { GetDictionaryList } from '@/api/common'
import SelfForm from '@/components/Base/SelfForm.vue'
import { mapDictData, getProviceCityCountryData } from '../../js/index'
import { Vue, Component, Prop } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm
  }
})
export default class SearchKeyWords extends Vue {
  private keyWords: string = ''
  private shareScopeEnd:IState[] = []
  private carLists:IState[] = [
    {
      value: '',
      label: '全部'
    }
  ] // 车型列表
  private multiple: boolean = true // 当前选项是否是多选
  private key: string = '' // 当前选项是否是多选
  private curSelecteds: [] = []
  private selectTitle: string = ''
  private selectedData: any[] = [];
  private hardOptions: IState[] = [ // 装卸接受度
    { label: '全部', value: '' }
  ];
  private cycleOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private timeLists:IState[] = []
  private listQuery:IState = {
    busiType: '', // 所属业务线
    carType: '', // 车类型
    hard: '', // 装卸接受度
    cycle: '', // 结算周期
    hope: '', // 期望稳定/临时
    expectType: '', // 期望货品类型
    expectHard: '', // 期望配送难度
    jobStartDate: '',
    jobEndDate: '',
    f1: '',
    f2: '',
    address: '',
    keyWords: ''
  }
  private formItem:any[] = [
    {
      slot: true,
      type: 'workTime',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        style: {
          width: '140px'
        }
      },
      label: '工作时间段',
      col: 8
    },
    {
      slot: true,
      type: 'freight',
      label: '单趟运费区间',
      key: 'start',
      w: '110px',
      col: 8
    },
    {
      type: 8,
      col: 7,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData,
          checkStrictly: true,
          multiple: true
        }
      },
      listeners: {
        'change': (e:any[]) => {
          this.handleCascaderChange(e, 'address')
        }
      },
      label: '现居住地址',
      key: 'address'
    }
  ]
  private selectList: IState[] = [
    {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 0,
        label: '共享'
      }, {
        value: 1,
        label: '专车'
      }],
      key: 'busiType',
      multiple: true,
      title: '业务线'
    },
    {
      options: this.carLists,
      multiple: true,
      key: 'carType',
      title: '司机车型'
    },
    {
      options: this.hardOptions,
      multiple: true,
      key: 'hard',
      title: '期望装卸难度'
    },
    {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '稳定'
      }, {
        value: 2,
        label: '临时'
      }],
      multiple: false,
      key: 'hope',
      title: '期望稳定/临时'
    },
    {
      options: this.cycleOptions,
      multiple: true,
      key: 'cycle',
      title: '期望结算周期'
    },
    {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '双皮奶'
      }, {
        value: '2',
        label: '蚵仔煎'
      }],
      key: 'expectType',
      multiple: true,
      title: '期望货品类型'
    },
    {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '整车'
      }, {
        value: '2',
        label: '多点配'
      }],
      multiple: false,
      key: 'expectHard',
      title: '期望配送难度'
    }
  ]
  handleClearAll() {
    this.selectedData = []
    this.$emit('on-clear')
  }
  handleChange(item:any) {
    this.selectTitle = item.title
    this.multiple = item.multiple
    this.curSelecteds = item.options
    this.key = item.key
  }
  handleCommand(command:string) {
    let obj:any = this.curSelecteds.find((item:any) => {
      return item.label === command
    })
    let id = obj.value
    if (this.selectedData.length > 0) {
      let index = this.selectedData.findIndex((item) => {
        return item.type === this.selectTitle
      })
      if (index > -1) {
        let selecteds = this.selectedData[index].selected
        if (selecteds.indexOf(command) === -1) {
          this.selectedData[index].selected = !this.multiple ? [] : this.selectedData[index].selected
          this.selectedData[index].optionIds = !this.multiple ? [] : this.selectedData[index].optionIds
          if (command === '全部') {
            this.selectedData[index].optionIds = []
            this.selectedData[index].selected = ['全部']
          } else {
            if (this.selectedData[index].optionIds[0] === '') {
              this.selectedData[index].optionIds.shift()
              this.selectedData[index].selected.shift()
            }
            if (this.selectedData[index].selected[0] === '全部') {
              this.selectedData[index].optionIds.shift()
              this.selectedData[index].selected.shift()
            }
            this.selectedData[index].optionIds.push(id)
            this.selectedData[index].selected.push(command)
          }
          this.listQuery[this.key] = this.selectedData[index].optionIds
        }
      } else {
        let obj = {
          type: this.selectTitle,
          optionIds: [id],
          selected: [command]
        }
        this.listQuery[this.key] = obj.optionIds
        this.selectedData.push(obj)
      }
    } else {
      let obj = {
        type: this.selectTitle,
        optionIds: [id],
        selected: [command]
      }
      this.listQuery[this.key] = obj.optionIds
      this.selectedData.push(obj)
    }
    console.log(this.selectedData)
  }
  clearSelect(i: number) {
    this.selectedData.splice(i, 1)
  }
  async getOptions() {
    try {
      let params = ['line_handling_difficulty', 'settlement_cycle', 'Intentional_compartment']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.hardOptions.push(...mapDictData(res.data.line_handling_difficulty || []))
        this.cycleOptions.push(...mapDictData(res.data.settlement_cycle || []))
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        console.log(this.cycleOptions)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  searchHandle() {
    console.log(this.listQuery)
  }
  // 级联框变化
  handleCascaderChange(val:IState[], key:string) {
    // 是否与上次的类型相同
    let changeFlag = false
    let changeItem:any = null
    if (this.shareScopeEnd.length === 0) {
      this.listQuery[key] = val
    } else {
      // 与原数组比对
      this.listQuery[key].forEach((item:any[]) => {
        if (item[0] !== this.shareScopeEnd[0][0]) { // 一级标签不同
          changeFlag = true
          changeItem = item
        } else if (item[1] !== this.shareScopeEnd[0][1]) { // 一级标签相同但是二级标签不同
          changeFlag = true
          changeItem = item
        } else if ((!item[2] && this.shareScopeEnd[0][2]) || (item[2] && !this.shareScopeEnd[0][2]) || (item[2] && item[2] === -99) || (this.shareScopeEnd[0][2] === -99)) {
          changeFlag = true
          changeItem = item
        }
      })
    }
    if (changeFlag) {
      this.listQuery[key] = []
      this.listQuery[key].push(changeItem)
    }
    this.shareScopeEnd = this.listQuery[key]
  }
  mounted() {
    this.getOptions()
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
<style>
  .el-dropdown-menu{
      max-height: 300px;
      overflow: auto;
  }
</style>
<style lang="scss" scoped>
.searchBox{
  background: #fff;
  ::v-deep .el-dropdown-link{
    font-size: 14px;
    color: #494949;
    i{
      color: #606060 !important;
    }
  }
  ::v-deep  .el-form-item__label{
   color: #4b4b4b !important;
  }
  ::v-deep .el-dropdown{
    display: flex;
    &::after{
      display: inline-block;
      content: "";
      height: 30px;
      width: 2px;
      background: #f4f4f6;
      margin: 0 10px;
    }
  }
  .el-dropdown:nth-last-of-type(2):after{
      display: none;
  }
  .topSelect{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    padding:15px 30px 0 30px;
    border-bottom:2px solid #f3f3f5;
    ::v-deep .el-form-item--small.el-form-item{
      margin-bottom: 0;
    }
    ::v-deep .selfForm{
      padding-left: 0;
    }
    .selectedform{
      display: flex;
      flex-wrap: wrap;
      line-height: 36px;
    }
    .formbox{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 250px;
      margin-left: 20px;
      .el-input{
        margin-right: 10px;
      }
      .el-button{
        height: 36px;
      }
    }
    .formList{
      display: flex;
      align-items: center;
      .formItem{
        display: inline-block;
        margin-right: 10px;
        margin-top: 10px;
        .line{
          text-align: center;
          height: 36px;
          line-height: 36px;
        }
      }
    }
  }
  .selectedBox{
    display: flex;
    color: #909196;
    padding: 10px 20px 10px 30px;
    font-size: 14px;
    .clearAll{
      display: inline-block;
      width: 60px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      padding-left: 0;
      margin: 0;
      margin-left: 20px;
      li{
        display: flex;
        align-items: center;
        background: #eef2f3;
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        border-radius: 30px;
        list-style: none;
        padding: 0 5px 0 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        i{
          color: #8e929b;
          margin-left: 15px;
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
