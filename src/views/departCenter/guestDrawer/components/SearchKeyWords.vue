<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:37:27
 * @LastEditTime: 2021-04-15 09:11:16
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
            @visible-change="handleChange(item.title,item.multiple)"
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
            v-model="keyWords"
            placeholder="请输入司机姓名/编号"
            suffix-icon="el-icon-search"
          />
          <el-button
            type="primary"
            size="small"
          >
            查询
          </el-button>
        </div>
      </div>
      <div class="formList">
        <!-- <div class="formItem">
          <el-col :span="11">
            <el-input
              placeholder="请输入起始金额"
            />
          </el-col>
          <el-col
            class="line"
            :span="2"
          >
            -
          </el-col>
          <el-col :span="11">
            <el-input
              placeholder="请输入终止金额"
            />
          </el-col>
        </div>
        <div class="formItem">
          <el-time-picker
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          />
        </div>
        <div class="formItem">
          <el-cascader
            ref="cascader"
            v-bind="item.tagAttrs || {}"
            :options="item.options"
          />
        </div> -->
        <self-form
          :list-query="listQuery"
          :form-item="formItem"
          size="small"
          class="SuggestForm"
          :pc-col="8"
        >
          <template slot="start">
            <el-input
              v-model="listQuery.start"
              v-only-number="{min: 0, max: 20000, precision: 0}"
            />
          </template>
          <template slot="end">
            <el-input
              v-model="listQuery.end"
              v-only-number="{min: 0, max: 20000, precision: 0}"
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
  private carLists:IState[] = [] // 车型列表
  private multiple: boolean = true // 当前选项是否是多选
  private curSelected: object = {}
  private selectTitle: string = ''
  private selectedData: any[] = [];
  private timeLists:IState[] = []
  private listQuery:IState = {
    labelType: '',
    isBehavior: '',
    isRestriction: '',
    status: '',
    start: '',
    end: '',
    f1: '',
    f2: ''
  }
  private formItem:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        style: {
          width: '100px'
        }
      },
      label: '工作时间段',
      col: 5,
      key: 'f1',
      options: this.timeLists
    },
    {
      type: 2,
      col: 4,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        style: {
          width: '100px'
        }
      },
      label: ' ',
      w: '20px',
      key: 'f2',
      class: 'end',
      options: this.timeLists
    },
    {
      type: 'start',
      label: '单趟运费区间',
      key: 'start',
      w: '110px',
      col: 5,
      slot: true
    },
    {
      type: 'end',
      label: ' ',
      w: '20px',
      key: 'end',
      col: 3,
      class: 'end',
      slot: true
    },
    {
      type: 8,
      col: 7,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData
        }
      },
      label: '现居住地址',
      key: 'i'
    }
  ]
  private selectList: IState[] = [
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '共享',
        label: '共享'
      }, {
        value: '专车',
        label: '专车'
      }],
      multiple: true,
      title: '业务线'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }],
      multiple: true,
      title: '司机车型'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '不需要装卸',
        label: '不需要装卸'
      }, {
        value: '轻装卸',
        label: '轻装卸'
      }, {
        value: '重装卸',
        label: '重装卸'
      }],
      multiple: true,
      title: '期望装卸难度'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '稳定',
        label: '稳定'
      }, {
        value: '临时',
        label: '临时'
      }],
      multiple: false,
      title: '期望稳定/临时'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '现结',
        label: '现结'
      }, {
        value: '周结',
        label: '周结'
      }, {
        value: '半月结',
        label: '半月结'
      }, {
        value: '月结',
        label: '月结'
      }, {
        value: '季度结',
        label: '季度结'
      }],
      multiple: true,
      title: '期望结算周期'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }],
      multiple: true,
      title: '期望货品类型'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '整车',
        label: '整车'
      }, {
        value: '多点配',
        label: '多点配'
      }],
      multiple: false,
      title: '期望配送难度'
    }
  ]
  // 获取字典列表
  async getDictList() {
    try {
      let params:string[] = ['Intentional_compartment']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        this.selectList[1].options = [...this.selectList[1].options, ...this.carLists]
        console.log(this.carLists)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get dict list fail:${err}`)
    } finally {
      //
    }
  }
  handleClearAll() {
    this.selectedData = []
    this.$emit('on-clear')
  }
  handleChange(title:string, multiple:boolean) {
    this.selectTitle = title
    this.multiple = multiple
  }
  handleCommand(command:string) {
    if (this.selectedData.length > 0) {
      let index = this.selectedData.findIndex((item) => {
        return item.type === this.selectTitle
      })
      if (index > -1) {
        let selecteds = this.selectedData[index].selected
        if (selecteds.indexOf(command) === -1) {
          this.selectedData[index].selected = !this.multiple ? [] : this.selectedData[index].selected
          this.selectedData[index].selected.push(command)
        }
      } else {
        let obj = {
          type: this.selectTitle,
          selected: [command]
        }
        this.selectedData.push(obj)
      }
    } else {
      let obj = {
        type: this.selectTitle,
        selected: [command]
      }
      this.selectedData.push(obj)
    }
  }
  clearSelect(i: number) {
    this.selectedData.splice(i, 1)
  }
  mounted() {
    this.getDictList()
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
