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
        <span>~</span>
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
          @change="onSelectionChange"
        />
        <div>&nbsp;&nbsp;配送区域&nbsp;</div>
        <el-cascader
          v-model="listQuery.distLoc"
          placeholder="请选择"
          clearable
          :props="{multiple: true, checkStrictly: true, lazy: true, lazyLoad: getProviceCityCountryData}"
          class="width-180"
          size="mini"
        />
        <div>&nbsp;&nbsp;&nbsp;</div>
        <el-input
          v-model="listQuery.keyWords"
          placeholder="线路名称/编号"
          suffix-icon="el-icon-search"
          class="width-180"
          size="mini"
        />
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
  };
  private lineQualities: any[] = [
    { label: '全部', value: '' }
  ];
  private goodsTypes: any[] = [
    { label: '全部', value: '' }
  ];
  private getProviceCityCountryData = getProviceCityCountryData;
  private formItemWidth: number = 160;
  private cachedRepoLoctions: any[] = [];
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
  onSelectionChange(values: any) {
    // const vals: [] = []
    // values.map((sel: any) => {
    //   const [province, city, county] = sel
    //   if (!vals[city]) {
    //     vals[city] = []
    //   }
    // })
    console.log(values)
  }
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
            }
            if (this.selectedData[index].selected[0] === '全部') {
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
    console.log(this.listQuery)
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
  .form-container {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #333;
    flex-wrap: wrap;
  }
  .form-container > * {
    margin-bottom: 10px;
  }
  .width-180 {
    width: 180px;
  }
  .width-140 {
    width: 140px;
  }
  .width-120 {
    width: 120px;
  }
  .width-100 {
    width: 100px;
  }
  .width-90 {
    width: 90px;
  }
  .width-80 {
    width: 80px;
  }

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
  .el-dropdown:nth-last-of-type(1):after{
      display: none;
  }
  .topSelect{
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // align-items: center;
    padding:15px 30px 10px 30px;
    border-bottom:2px solid #f3f3f5;
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
