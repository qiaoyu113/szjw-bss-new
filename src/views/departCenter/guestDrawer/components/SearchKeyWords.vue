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
              v-model="listQuery.everyTripGuaranteedStart"
              v-only-number="{min: 0, max: 19999, precision: 0}"
              style="width:70px"
              placeholder="请输入"
            />
            <span style="margin:0 5px">-</span>
            <el-input
              v-model="listQuery.everyTripGuaranteedEnd"
              v-only-number="{min: 0, max: 19999, precision: 0}"
              :disabled="!listQuery.everyTripGuaranteedStart"
              style="width:70px"
              placeholder="请输入"
            />
          </template>
          <template slot="keyWords">
            <el-select
              v-model.trim="listQuery.driverInfo"
              v-loadmore="loadQueryDriverByKeyword"
              placeholder="选择/搜索司机姓名/编号"
              reserve-keyword
              :default-first-option="true"
              clearable
              filterable
              remote
              style="width:250px"
              :remote-method="querySearchByKeyword"
              @clear="handleClearQueryDriver"
            >
              <el-option
                v-for="item in driverOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
          {{ item.type }}：{{ typeof item.selected === 'string' ? item.selected : (item.selected.join(item.key === 'workingHours' ? '~' : ',')) }}<i
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
import { getDriverNoAndNameList, getDriverNameByNo } from '@/api/driver'
import SelfForm from '@/components/Base/SelfForm.vue'
import { mapDictData, getProviceCityCountryData } from '../../js/index'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
const lineKey = 'line_row'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm
  }
})
export default class SearchKeyWords extends Vue {
  private rowData:any = {}
  private driverInfo: string = ''
  private driverOptions:IState[] = []
  private shareScopeEnd:IState[] = []
  private citysArry: any[] = []
  private levelData: any = {}
  private carLists:IState[] = [
    {
      value: '',
      label: '全部'
    }
  ] // 车型列表
  private searchKeyword:string = ''
  private multiple: boolean = true // 当前选项是否是多选
  private key: string = '' // 当前选项是否是多选
  private curSelecteds: [] = []
  private selectTitle: string = ''
  private selectedData: any[] = [];
  private queryPage:any = {
    page: 0,
    limit: 10
  }
  private expectOptions: IState[] = [ // 期望货品类型
    { label: '全部', value: '' }
  ];
  private hardOptions: IState[] = [ // 装卸接受度
    { label: '全部', value: '' }
  ];
  private cycleOptions: IState[] = [
    { label: '全部', value: '' }
  ];
  private timeLists:IState[] = []
  private listQuery:IState = {
    busiType: null, // 所属业务线
    carType: null, // 司机车型
    handlingDifficulty: null, // 装卸接受度
    settlementCycle: null, // 期望结算周期
    expectStabilityTemporary: null, // 期望稳定/临时
    cargoType: null, // 期望货品类型
    distributionWay: null, // 期望配送难度
    start: null,
    end: null,
    everyTripGuaranteedEnd: '',
    everyTripGuaranteedStart: '',
    address: null,
    driverInfo: ''
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
      type: 'keyWords'
    }
  ]
  private selectList: IState[] = [
    {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '共享'
      }, {
        value: 0,
        label: '专车'
      }],
      key: 'busiType',
      multiple: true,
      title: '业务线'
    },
    {
      options: this.carLists,
      multiple: true,
      key: 'carTypeList',
      title: '配送车型'
    },
    {
      options: this.hardOptions,
      multiple: true,
      key: 'handlingDifficulty',
      title: '装卸难度'
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
      key: 'expectStabilityTemporary',
      title: '稳定/临时'
    },
    {
      options: this.cycleOptions,
      multiple: true,
      key: 'settlementCycle',
      title: '结算周期'
    },
    {
      options: this.expectOptions,
      key: 'cargoType',
      multiple: true,
      title: '货品类型'
    },
    {
      options: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '整车'
      }, {
        value: 2,
        label: '多点配'
      }],
      multiple: false,
      key: 'distributionWay',
      title: '配送复杂度'
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
    this.listQuery.busiType = null // 所属业务线
    this.listQuery.carType = null // 车类型
    this.listQuery.handlingDifficulty = null // 装卸接受度
    this.listQuery.settlementCycle = null // 结算周期
    this.listQuery.expectStabilityTemporary = null // 期望稳定/临时
    this.listQuery.cargoType = null // 期望货品类型
    this.listQuery.distributionWay = null // 期望配送难度
    this.listQuery.workingHours = null
    this.listQuery.everyTripGuaranteedEnd = ''
    this.listQuery.everyTripGuaranteedStart = ''
    this.listQuery.address = null
    this.listQuery.driverInfo = ''
    this.$emit('on-search', this.listQuery)
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
        return item.key === this.key || ((this.key === 'start' || this.key === 'end') && (item.key === 'workingHours'))
      })
      if (index > -1) {
        let selecteds = this.selectedData[index].selected
        if (selecteds.indexOf(command) === -1) {
          const isWorkRange: boolean = this.key === 'start' || this.key === 'end'
          this.selectedData[index].selected = (this.multiple || isWorkRange) ? this.selectedData[index].selected : []
          this.selectedData[index].optionIds = (this.multiple || isWorkRange) ? this.selectedData[index].optionIds : []
          if (command === '全部') {
            this.selectedData[index].optionIds = ['']
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
                if (typeof this.selectedData[index].optionIds === 'string') {
                  this.selectedData.splice(index, 1)
                  this.initSelectItem(id, command)
                } else {
                  this.selectedData[index].optionIds.splice(0, 1, id)
                  this.selectedData[index].selected.splice(0, 1, command)
                }
              } else {
                if (typeof this.selectedData[index].optionIds === 'string') {
                  this.selectedData.splice(index, 1)
                  this.initSelectItem(id, command)
                } else {
                  this.selectedData[index].optionIds.splice(1, 1, id)
                  this.selectedData[index].selected.splice(1, 1, command)
                }
              }
            }
          }
          this.listQuery[this.key] = this.selectedData[index].optionIds
          isWorkRange && (this.listQuery.workingHours = this.selectedData[index].optionIds.join('-'))
        }
      } else {
        this.initSelectItem(id, command)
      }
    } else {
      this.initSelectItem(id, command)
    }
  }
  initSelectItem(id: any, command: any, isInitWorkRange?: boolean) {
    console.log(id, command)
    if (isInitWorkRange) {
      let obj = {
        type: '工作时间段',
        key: 'workingHours',
        optionIds: id,
        selected: command
      }
      this.listQuery.workingHours = id
      this.selectedData.push(obj)
    } else {
      const isWorkRange: boolean = this.key === 'start' || this.key === 'end'
      let obj = {
        type: isWorkRange ? '工作时间段' : this.selectTitle,
        key: isWorkRange ? 'workingHours' : this.key,
        optionIds: isWorkRange ? (this.key === 'start' ? [id, ''] : ['', id]) : [id],
        selected: isWorkRange ? (this.key === 'start' ? [command, '请选择结束时间'] : ['请选择开始时间', command]) : [command]
      }
      this.listQuery[this.key] = this.multiple ? obj.optionIds : id
      this.selectedData.push(obj)
    }
  }
  clearSelect(i: number) {
    let key:any = this.selectedData[i].key
    this.listQuery[key] = null
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
        console.log(this.carLists)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  searchHandle() {
    // 单趟运费区间
    if ((this.listQuery.everyTripGuaranteedStart && !this.listQuery.everyTripGuaranteedEnd) || (!this.listQuery.everyTripGuaranteedStart && this.listQuery.everyTripGuaranteedEnd)) {
      return this.$message.warning('单趟运费输入不完整')
    } else {
      if (Number(this.listQuery.everyTripGuaranteedStart) > Number(this.listQuery.everyTripGuaranteedEnd)) {
        return this.$message.warning('单趟运费起始金额不能大于终止金额')
      }
    }
    this.$emit('on-search', this.listQuery)
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
    let provices:any = []
    this.listQuery[key].forEach((item:any) => {
      if (provices.indexOf(item[0]) === -1) {
        provices.push(item[0])
      }
      if (!this.levelData[item[1]]) {
        this.levelData[item[1]] = []
      }
      if (this.levelData[item[1]].indexOf(item[2]) === -1 && item[2] !== undefined) {
        this.levelData[item[1]].push(item[2])
      }
    })
    if (provices.length >= 2) {
      this.listQuery[key] = this.listQuery[key].filter((item:any) => {
        return item.indexOf(parseInt(changeItem[1])) === -1
      })
      return this.$message.error('只能选择同一省下的市，区')
    }
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
  // 获取司机列表接口
  async loadDriverByKeyword(params:IState) {
    try {
      if (this.listQuery.workCity && this.listQuery.workCity.length > 0) {
        params.workCity = this.listQuery.workCity[1]
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      this.listQuery.joinManagerId !== '' && (params.gmId = this.listQuery.joinManagerId)
      let { data: res } = await getDriverNoAndNameList(params, {
        url: '/v2/wt-driver-account/refund/queryDriverList'
      })
      let result:any[] = res.data.map((item:any) => ({
        label: `${item.name}/${item.phone}`,
        value: item.driverId
      }))
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 获取更多司机
  async loadQueryDriverByKeyword(val?:string) {
    val = this.searchKeyword
    this.queryPage.page++
    let params:IState = {
      page: this.queryPage.page,
      limit: this.queryPage.limit
    }
    val !== '' && (params.key = val)

    try {
      let result:IState[] = await this.loadDriverByKeyword(params)
      this.driverOptions.push(...result)
    } finally {
      console.log('finally')
    }
  }
  // 搜索司机
  querySearchByKeyword(val:string) {
    this.queryPage.page = 0
    this.resetDriver()
    this.searchKeyword = val
    this.loadQueryDriverByKeyword(val)
  }
  // 清除司机
  handleClearQueryDriver() {
    this.searchKeyword = ''
    this.resetDriver()
    this.loadQueryDriverByKeyword()
  }
  // 重置司机
  resetDriver() {
    this.listQuery.driverInfo = ''
    this.searchKeyword = ''
    let len:number = this.driverOptions.length
    if (len > 0) {
      this.queryPage.page = 0
      this.driverOptions.splice(0, len)
    }
  }
  // 回显业务线
  getBusiType(data:any) {
    let specialArr = ['超肥', '单肥', '次肥', '中瘦', '极瘦']
    let shareArr = ['次肥', '中瘦', '极瘦']
    let busiType:any = {
      key: 'busiType',
      optionIds: [],
      selected: [],
      type: '业务线'
    }
    if (shareArr.indexOf(data.labelTypeValue) > -1) {
      this.selectedData = []
      busiType.optionIds.push(0)
      busiType.selected.push('共享')
      this.selectedData.push(busiType)
    }
    if (specialArr.indexOf(data.labelTypeValue) > -1) {
      busiType.optionIds.push(1)
      busiType.selected.push('专车')
      this.selectedData = []
      this.selectedData.push(busiType)
    }
    this.listQuery['busiType'] = busiType.optionIds
  }
  // 回显货品类型
  getCargoType(data:any) {
    if (data.cargoType) {
      let cargoType:any = {
        key: 'cargoType',
        optionIds: [data.cargoType],
        selected: [data.cargoTypeValue],
        type: '货品类型'
      }
      this.selectedData.push(cargoType)
      this.listQuery['cargoType'] = cargoType.optionIds
    }
  }
  // 回显装卸难度
  getHandlingDifficulty(data:any) {
    if (data.handlingDifficulty) {
      let handlingDifficulty:any = {
        key: 'handlingDifficulty',
        optionIds: [data.handlingDifficulty],
        selected: [data.handlingDifficultyValue],
        type: '装卸难度'
      }
      this.selectedData.push(handlingDifficulty)
      this.listQuery['handlingDifficulty'] = handlingDifficulty.optionIds
    }
  }
  // 回显配送车型
  getCarType(data:any) {
    if (data.carType) {
      let carType:any = {
        key: 'carTypeList',
        optionIds: [data.carType],
        selected: [data.carTypeValue],
        type: '配送车型'
      }
      this.selectedData.push(carType)
      this.listQuery['carTypeList'] = carType.optionIds
    }
  }
  // 从缓存获取线路信息
  getLineInfoFromStorage() {
    let str = sessionStorage.getItem(lineKey) || ''
    if (str) {
      let obj:IState = JSON.parse(str) || {}
      this.rowData = obj
      console.log(this.rowData)
    }
  }
  // 初始化筛选项数据
  initData() {
    this.getLineInfoFromStorage()
    this.getBusiType(this.rowData)
    this.getCarType(this.rowData)
    this.getCargoType(this.rowData)
    this.getHandlingDifficulty(this.rowData)
    this.initSelectItem(`${this.rowData.workingTime}`, `${this.rowData.workingTime}`, true)
    this.$emit('on-search', this.listQuery)
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
    this.loadQueryDriverByKeyword()
  }
}
</script>
<style lang="scss" >
  .el-dropdown-menu{
      max-height: 200px !important;
      overflow: scroll;
      margin-bottom: 0 !important;
      margin-top: 0 !important;
  }
</style>
<style lang="scss" scoped>
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
      margin-bottom: 5px !important;
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
      flex-wrap: wrap;
      margin-bottom: 5px;
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
