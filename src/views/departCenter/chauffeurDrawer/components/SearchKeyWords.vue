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
      <div class="form-container">
        <div>单趟运费区间&nbsp;</div>
        <el-input
          v-model="listQuery.f1"
          v-only-number="{min: 0, max: 20000, precision: 0}"
          placeholder="最低价格"
          class="width-80"
          size="mini"
        />
        <span>-</span>
        <el-input
          v-model="listQuery.f2"
          v-only-number="{min: 0, max: 20000, precision: 0}"
          placeholder="最高价格"
          class="width-80"
          size="mini"
        />
        <div>&nbsp;&nbsp;仓库位置&nbsp;</div>
        <el-cascader
          v-model="listQuery.repoLoc"
          placeholder="请选择"
          clearable
          :props="{multiple: true, checkStrictly: true, lazy: true, lazyLoad: getProviceCityCountryData}"
          size="mini"
          @change="onSelectionChange($event, 'repoLoc')"
        />
        <div>&nbsp;&nbsp;配送区域&nbsp;</div>
        <el-cascader
          v-model="listQuery.distLoc"
          placeholder="请选择"
          clearable
          :props="{multiple: true, checkStrictly: true, lazy: true, lazyLoad: getProviceCityCountryData}"
          size="mini"
          @change="onSelectionChange($event, 'distLoc')"
        />
        <div>&nbsp;&nbsp;&nbsp;</div>
        <el-select
          v-model="listQuery.keyWords"
          placeholder="搜索/选择线路名称/编号"
          filterable
          remote
          clearable
          :remote-method="getLineListForSearch"
          size="mini"
          :loading="isLoading"
          @clear="onClearInput"
        >
          <el-option
            v-for="it in lineList"
            :key="it.lineId"
            :value="it.lineId"
            :label="it.lineName"
          />
        </el-select>
        <div>&nbsp;</div>
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
          {{ item.type }}：{{ typeof item.selected === 'string' ? item.selected : ((item.selected || []).join(item.key === 'workRange' ? '-' : ',')) }}<i
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
import { getLineListForSearch } from '@/api/departCenter'
import SelfForm from '@/components/Base/SelfForm.vue'
import { mapDictData, getProviceCityCountryData } from '../../js/index'
import { Vue, Component, Prop } from 'vue-property-decorator'

const formData: any = {
  driverId: '', // 司机ID
  lineQuality: '', // 线路肥瘦
  model: '', // 车型
  loadDifficulty: '', // 装卸难易度
  stability: '', // 稳定/临时
  clearCycle: '', // 结算周期
  cargoType: '', // 货品类型
  deliverComplexity: '', // 配送类型/复杂度
  start: '',
  end: '',
  f1: '',
  f2: '',
  repoLoc: '',
  distLoc: '',
  keyWords: ''
}

interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SelfForm
  }
})
export default class SearchKeyWords extends Vue {
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
  private listQuery:IState = { ...formData }
  private lineQualities: any[] = [
    { label: '全部', value: '' }
  ];
  private goodsTypes: any[] = [
    { label: '全部', value: '' }
  ];
  private isLoading: boolean = false;
  private lineList: any = []
  private getProviceCityCountryData = getProviceCityCountryData;
  private formItemWidth: number = 160;
  private shareScopeEnd:IState[] = [];
  private levelData: any = {};
  private selectList: IState[] = [
    {
      title: '线路肥瘦',
      key: 'lineQuality',
      multiple: true,
      options: this.lineQualities
    },
    {
      title: '配送车型',
      key: 'model',
      multiple: true,
      options: this.carLists
    },
    {
      title: '装卸难度',
      key: 'loadDifficulty',
      multiple: true,
      options: this.hardOptions
    },
    {
      title: '稳定/临时',
      key: 'stability',
      multiple: true,
      options: [
        { label: '全部', value: '' },
        { label: '稳定', value: 1 },
        { label: '临时', value: 2 }
      ]
    },
    {
      title: '结算周期',
      key: 'clearCycle',
      multiple: true,
      options: this.cycleOptions
    },
    {
      title: '货品类型',
      key: 'cargoType',
      multiple: true,
      options: this.goodsTypes
    },
    {
      title: '配送类型',
      key: 'deliverComplexity',
      multiple: true,
      options: [
        { label: '全部', value: '' },
        { label: '整车', value: 1 },
        { label: '多点配', value: 2 }
      ]
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
  reset() {
    this.curSelecteds = []
    this.selectTitle = ''
    this.selectedData = []
    this.listQuery = { ...formData }
    this.shareScopeEnd = []
    this.levelData = {}
  }
  getArrDifference(arr1:any, arr2:any) {
    return arr1.concat(arr2).filter(function(v:any, i:number, arr:IState[]) {
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
  }
  onSelectionChange(val:IState[], key:string) {
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
  handleClearAll() {
    this.selectedData = []
    this.listQuery = Object.assign({ ...formData }, { driverId: this.listQuery.driverId })
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
          isWorkRange && (this.listQuery.workRange = this.selectedData[index].optionIds.join('-'))
        }
      } else {
        this.initSelectItem(id, command)
      }
    } else {
      this.initSelectItem(id, command)
    }
  }
  initSelectItem(id: any, command: any, isInitWorkRange?: boolean) {
    if (isInitWorkRange) {
      let obj = {
        type: '工作时间段',
        key: 'workRange',
        optionIds: id,
        selected: command
      }
      this.listQuery.workRange = id
      this.selectedData.push(obj)
    } else {
      const isWorkRange: boolean = this.key === 'start' || this.key === 'end'
      const title = (this.selectList.find((v: any) => v.key === this.key) || {}).title
      let obj = {
        type: isWorkRange ? '工作时间段' : (this.selectTitle || title),
        key: isWorkRange ? 'workRange' : this.key,
        optionIds: isWorkRange ? (this.key === 'start' ? [id, ''] : ['', id]) : (Array.isArray(id) ? id : [id]),
        selected: isWorkRange ? (this.key === 'start' ? [command, '请选择结束时间'] : ['请选择开始时间', command]) : [command]
      }
      console.log(id, command, this.multiple, obj)
      this.listQuery[this.key] = this.multiple ? obj.optionIds : id
      this.selectedData.push(obj)
    }
  }
  clearSelect(i: number) {
    const item: any = this.selectedData.splice(i, 1)
    const key: string = (item[0] || {}).key
    if (key === 'workRange') {
      this.listQuery.workRange = ''
      this.listQuery.start = ''
      this.listQuery.end = ''
    } else {
      this.listQuery[item[0].key] = formData[key] || ''
    }
  }
  onClearInput() {
    this.lineList = []
  }
  async getOptions() {
    try {
      let params = ['line_handling_difficulty', 'settlement_cycle', 'Intentional_compartment', 'line_label', 'type_of_goods']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.hardOptions.push(...mapDictData(res.data.line_handling_difficulty || []))
        this.cycleOptions.push(...mapDictData(res.data.settlement_cycle || []))
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        this.lineQualities.push(...mapDictData(res.data.line_label || []))
        this.goodsTypes.push(...mapDictData(res.data.type_of_goods || []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  searchHandle() {
    if (this.listQuery.f1 && this.listQuery.f2 && this.listQuery.f1 > this.listQuery.f2) {
      [this.listQuery.f1, this.listQuery.f2] = [this.listQuery.f2, this.listQuery.f1]
    }
    this.$emit('query', this.listQuery)
  }
  initQuery() {
    this.reset()
    const driver = JSON.parse(sessionStorage.getItem('driver_row') || '{}')
    this.listQuery.driverId = driver.driverId || driver.id
    if ((driver.workHours || []).length) {
      this.initSelectItem(driver.workHoursStr, driver.workHoursStr, true)
    }
    if (driver.heavyLifting && driver.heavyLiftingName) {
      this.key = 'loadDifficulty'
      this.initSelectItem(driver.heavyLifting, driver.heavyLiftingName)
    }
    if (driver.carType && driver.carTypeName) {
      this.key = 'model'
      this.initSelectItem(driver.carType, driver.carTypeName)
    }
    if (driver.intentCargoType && driver.intentCargoTypeName) {
      this.key = 'cargoType'
      this.initSelectItem(driver.intentCargoType, driver.intentCargoTypeName)
    }
    if (driver.liveAddressCity && driver.liveAddressProvince) {
      const county = driver.liveAddressCounty
      this.listQuery.repoLoc = [driver.liveAddressProvince, driver.liveAddressCity].concat(county ? [county] : [])
      this.listQuery.distLoc = [driver.liveAddressProvince, driver.liveAddressCity].concat(county ? [county] : [])
    }
    this.$emit('query', this.listQuery)
  }
  getLineListForSearch(input: string) {
    if (input) {
      this.isLoading = true
      getLineListForSearch({ key: input, limit: 20, page: 1 }).then(res => {
        const data = res.data || {}
        if (data.success) {
          this.lineList = data.data || []
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.isLoading = false
      })
    } else {
      this.lineList = []
    }
  }
  mounted() {
    this.getOptions()
    for (let i = 0; i < 24; i++) {
      let count = i < 9 ? `0${i}:00` : `${i}:00`
      this.timeLists.push({
        label: count,
        value: i + ''
      })
    }
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
  .form-container {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #333;
    flex-wrap: wrap;
  }
  .form-container > * {
    margin-bottom: 10px;
  }
  .width-80 {
    width: 80px;
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
  ::v-deep  .el-form-item__label{
   color: #4b4b4b !important;
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
    padding:15px 30px 0 30px;
    border-bottom:2px solid #f3f3f5;
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
