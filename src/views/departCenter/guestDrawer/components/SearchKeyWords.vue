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
      </div>
      <div class="formList">
        <self-form
          :list-query="listQuery"
          :form-item="formItem"
          size="mini"
          class="SuggestForm"
          :pc-col="8"
        >
          <template slot="freight">
            <el-input
              v-model="listQuery.f1"
              v-only-number="{min: 0, max: 20000, precision: 0}"
              style="width:100px"
              placeholder="请输入"
            />
            <span style="margin:0 5px">-</span>
            <el-input
              v-model="listQuery.f2"
              v-only-number="{min: 0, max: 20000, precision: 0}"
              :disabled="!listQuery.f1"
              style="width:100px"
              placeholder="请输入"
            />
          </template>
          <template slot="keyWords">
            <el-select
              v-model="listQuery.keyWords"
              placeholder="选择/搜索线路名称/编号"
              filterable
              clearable
              :options="lineList"
              size="mini"
            >
              <el-option
                v-for="it in lineList"
                :key="it.value"
                :value="it.value"
                :label="it.label"
              />
            </el-select>
          </template>
        </self-form>
        <el-button
          type="primary"
          size="mini"
          @click="searchHandle"
        >
          查询
        </el-button>
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
          {{ item.type }}：{{ item.selected.join(item.key === 'workRange' ? '~' : ',') }}<i
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
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
  private citysArry: any[] = []
  private levelData: any = {}
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
  private selectedData: any[] = [
    {
      key: 'workRange',
      type: '工作时间段',
      optionIds: ['09:00', '18:00'],
      selected: ['09:00', '18:00']
    }
  ];
  private expectOptions: IState[] = [ // 期望货品类型
    { label: '全部', value: '' }
  ];
  private hardOptions: IState[] = [ // 装卸接受度
    { label: '全部', value: '' }
  ];
  private cycleOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private lineList: any = [
    { label: '线路1', value: 'line1' },
    { label: '线路2', value: 'line2' }
  ]
  private timeLists:IState[] = []
  private listQuery:IState = {
    busiType: '', // 所属业务线
    carType: '', // 车类型
    hard: '', // 装卸接受度
    cycle: '', // 结算周期
    hope: '', // 期望稳定/临时
    expectType: '', // 期望货品类型
    expectHard: '', // 期望配送难度
    workTime: '',
    f1: '',
    f2: '',
    address: '',
    keyWords: ''
  }
  @Watch('listQuery.jobStartDate')
  onlistQueryChanged(val: any, oldVal: any) {
    if (this.selectedData[0].type === '工作时间段') {
      this.selectedData.splice(0, 1)
    }
  }
  private formItem:any[] = [
    {
      slot: true,
      type: 'freight',
      label: '单趟运费区间',
      w: '90px'
    },
    {
      type: 8,
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
      style: {
        width: '200px'
      },
      w: '80px',
      label: '现居住地址',
      key: 'address'
    },
    {
      slot: true,
      label: '',
      type: 'keyWords',
      tagAttrs: {
        placeholder: '请输入司机姓名/编号',
        clearable: true,
        'suffix-icon': 'el-icon-search'
      },
      style: {
        width: '200px',
        marginLeft: '10px'
      }
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
      title: '装卸接受度'
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
      options: this.expectOptions,
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
      title: '期望配送复杂度'
    },
    {
      title: '开始工作时间',
      key: 'start',
      options: this.timeLists
    },
    {
      title: '结束工作时间',
      key: 'end',
      options: this.timeLists
    }
  ]
  handleClearAll() {
    this.selectedData = []
    this.$emit('on-clear')
  }
  handleChange(item:any) {
    console.log(item)
    this.selectTitle = item.label || item.title
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
        return item.key === this.key || ((this.key === 'start' || this.key === 'end') && (item.key === 'workRange'))
      })
      if (index > -1) {
        let selecteds = this.selectedData[index].selected
        if (selecteds.indexOf(command) === -1) {
          const isWorkRange: boolean = this.key === 'start' || this.key === 'end'
          this.selectedData[index].selected = (this.multiple || isWorkRange) ? this.selectedData[index].selected : []
          this.selectedData[index].optionIds = (this.multiple || isWorkRange) ? this.selectedData[index].optionIds : []
          if (command === '全部') {
            this.selectedData[index].optionIds = []
            this.selectedData[index].selected = ['全部']
          } else {
            if (this.selectedData[index].optionIds[0] === '') {
              this.selectedData[index].optionIds.shift()
            }
            if (this.selectedData[index].selected[0] === '全部') {
              this.selectedData[index].selected.shift()
            }
            if (!isWorkRange) {
              this.selectedData[index].optionIds.push(id)
              this.selectedData[index].selected.push(command)
            } else {
              if (this.key === 'start') {
                this.selectedData[index].optionIds.splice(0, 1, id)
                this.selectedData[index].selected.splice(0, 1, command)
              } else {
                this.selectedData[index].optionIds.splice(1, 1, id)
                this.selectedData[index].selected.splice(1, 1, command)
              }
            }
          }
          this.listQuery[this.key] = this.selectedData[index].optionIds
        }
      } else {
        this.initSelectItem(id, command)
      }
    } else {
      this.initSelectItem(id, command)
    }
    console.log(this.selectedData)
  }
  initSelectItem(id: any, command: any) {
    const isWorkRange: boolean = this.key === 'start' || this.key === 'end'
    let obj = {
      type: isWorkRange ? '工作时间段' : this.selectTitle,
      key: isWorkRange ? 'workRange' : this.key,
      optionIds: isWorkRange ? (this.key === 'start' ? [id, ''] : ['', id]) : [id],
      selected: isWorkRange ? (this.key === 'start' ? [command, '请选择结束时间'] : ['请选择开始时间', command]) : [command]
    }
    this.listQuery[this.key] = this.multiple ? obj.optionIds : id
    this.selectedData.push(obj)
  }
  clearSelect(i: number) {
    this.selectedData.splice(i, 1)
  }
  async getOptions() {
    try {
      let params = ['line_handling_difficulty', 'settlement_cycle', 'Intentional_compartment', 'type_of_goods']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.hardOptions.push(...mapDictData(res.data.line_handling_difficulty || []))
        this.cycleOptions.push(...mapDictData(res.data.settlement_cycle || []))
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        this.expectOptions.push(...mapDictData(res.data.type_of_goods || []))
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
    // 单趟运费区间
    if ((this.listQuery.f1 && !this.listQuery.f2) || (!this.listQuery.f1 && this.listQuery.f2)) {
      return this.$message.warning('单趟运费输入不完整')
    } else {
      if (Number(this.listQuery.start) > Number(this.listQuery.end)) {
        return this.$message.warning('单趟运费起始金额不能大于终止金额')
      }
    }
  }
  getArrDifference(arr1:any, arr2:any) {
    return arr1.concat(arr2).filter(function(v:any, i:number, arr:IState[]) {
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
  }
  // 级联框变化
  handleCascaderChange(val:IState[], key:string) {
    let changeItem = this.getArrDifference(this.shareScopeEnd, this.listQuery[key])[0]
    if (this.shareScopeEnd.length === 0) {
      this.listQuery[key] = val
    }
    this.levelData = {}
    this.listQuery[key].forEach((item:any) => {
      if (!this.levelData[item[1]]) {
        this.levelData[item[1]] = []
      }
      if (this.levelData[item[1]].indexOf(item[2]) === -1 && item[2] !== undefined) {
        this.levelData[item[1]].push(item[2])
      }
    })

    let cityNum = 0
    for (let itemKey in this.levelData) {
      cityNum++
      if (cityNum > 2) {
        this.listQuery[key] = this.listQuery[key].filter((item:any) => {
          return item.indexOf(parseInt(changeItem[1])) === -1
        })
        this.$message.error('最多选择两个市')
      }
      if (this.levelData[itemKey].length > 2) {
        let code = changeItem[2]
        this.listQuery[key] = this.listQuery[key].filter((item:any) => {
          return item.indexOf(code) === -1
        })
        this.$message.error('一个市下最多选择两个区')
      }
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
      max-height: 250px;
      overflow: auto;
  }
</style>
<style lang="scss" scoped>
.formList{
  width:100%;
}
.searchBox{
  background: #fff;
  ::v-deep .el-dropdown-link{
    font-size: 12px;
    color: #494949;
    i{
      color: #606060 !important;
    }
  }
   ::v-deep .el-col-8{
     width: auto;
  }
  ::v-deep .el-form{
    .el-col{
      padding: 0 !important;
    }
    .el-input__inner::placeholder{
      font-size: 12px;
    }
    .el-cascader,.el-input{
      flex:initial
    }
  }
  ::v-deep .el-button--mini{
    margin-top: 5px;
  }
  ::v-deep  .el-form-item__label{
   color: #4b4b4b !important;
   font-size: 12px;
  }
  ::v-deep .el-dropdown{
    display: flex;
    align-items: center;
    &::after{
      display: inline-block;
      content: "";
      height: 24px;
      width: 2px;
      background: #f4f4f6;
      margin: 0 10px;
    }
  }
  .el-dropdown:nth-last-of-type(1):after{
      display: none;
  }
  .topSelect{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    padding:15px 30px 0 30px;
    border-bottom:2px solid #f3f3f5;
    ::v-deep .el-form-item{
      // margin-bottom: 5px !important;
    }
    ::v-deep .selfForm{
      padding-left: 0;
      padding-top: 5px;
      padding-bottom: 5px;
      .el-select{
        margin-left: 10px;
      }
    }
    .selectedform{
      display: flex;
      flex-wrap: wrap;
      line-height: 26px;
      padding-bottom: 5px;
    }
    .formbox{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 250px;
      margin-left: 20px;

      .el-button{
        height: 28px !important;
      }
    }
    .formList{
      display: flex;
      align-items: flex-start;
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
    padding: 10px 20px 0 30px;
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
