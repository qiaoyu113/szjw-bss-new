<template>
  <div
    v-loading.body="listLoading"
    class="GuestListContainer"
    :style="{'overflow': showDrawer ?'hidden':'auto'}"
    :class="{
      p15: isPC,
      isDrawer: showDrawer
    }"
  >
    <!-- 查询表单 -->
    <self-form
      ref="selectForm"
      :list-query="listQuery"
      :form-item="formItem"
      :load-by-keyword="loadLineByKeyword"
      size="small"
      label-width="100px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <div
        slot="status"
        :class="isPC ? 'btnPc left' : 'mobile'"
      >
        <el-radio-group
          v-model="listQuery.status"
          size="small"
          @change="handleStatusChange"
        >
          <el-radio-button
            v-for="item in statusLists"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div
        slot="btnGroup"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>
      <template slot="start">
        <input-range
          v-model="listQuery.start"
          :range="[0,20000]"
        />
        <!-- <el-input
          v-model="listQuery.start"
          v-only-number="{min: 0, max: 20000, precision: 0}"
        />
      </template>
      <template slot="end">
        <el-input
          v-model="listQuery.end"
          v-only-number="{min: 0, max: 20000, precision: 0}"
        /> -->
      </template>
      <template slot="time">
        <timeSelect
          v-model="listQuery.time"
        />
      </template>
    </self-form>
    <!-- 表格 -->
    <div
      class="table_box"
    >
      <Atable
        ref="lineTable"
        :list-query="listQuery"
        :is-more="false"
        :is-show-percent="false"
        :obj="{}"
        @match="handleMatchTryRun"
        @cancelTryRun="handleCancelTryRun"
      />
      <pagination
        :operation-list="[]"
        :total="page.total"
        :page.sync="page.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :limit.sync="page.limit"
        @pagination="handlePageSizeChange"
      />
    </div>
    <GuestDrawer
      v-model="showDrawer"
    />

    <cancel-tryRun ref="cancelTryRun" />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import Atable from './components/Atable.vue'
import Pagination from '@/components/Pagination/index.vue'

import GuestDrawer from '../guestDrawer/index.vue'
import CancelTryRun from './components/CancelTryRun.vue'
import { GetDictionaryList } from '@/api/common'
import { mapDictData, getProviceCityCountryData } from '../js/index'
import { getLineSearch } from '@/api/departCenter'
import InputRange from '../chauffeurList/components/doubleInput.vue'
import TimeSelect from '../chauffeurList/components/timeSelect.vue'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'GuestList',
  components: {
    SelfForm,
    Atable,
    Pagination,
    GuestDrawer,
    CancelTryRun,
    InputRange,
    TimeSelect
  }
})
export default class extends Vue {
  private shareScopeEnd:IState[] = []
  private value:IState[] = []
  private listLoading:boolean = false
  private showDrawer:boolean = false
  private cityLists:IState[] = [] // 城市列表
  private carLists:IState[] = [] // 车型列表
  private labelTypeArr:IState[] = [{ label: '全部', value: '' }] // 线路肥瘦
  private loadDiffArr:IState[] = [{ label: '全部', value: '' }] // 装卸难度
  private listQuery:IState = {
    labelType: '',
    isBehavior: '',
    loadDiff: '',
    isRestriction: '',
    status: '',
    start: [],
    f1: '',
    f2: '',
    key: '',
    g: [],
    time: []
  }
  private formItem:any[] = [
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '城市',
      key: 'a',
      options: this.cityLists
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '车型',
      key: 'b',
      options: this.carLists
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '装卸难度',
      key: 'loadDiff',
      options: this.loadDiffArr
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '线路肥瘦',
      key: 'labelType',
      options: this.labelTypeArr
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '是否闯禁行',
      key: 'isBehavior',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        }
      ]
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '是否闯限行',
      key: 'isRestriction',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        }
      ]
    },
    {
      type: 'start',
      label: '单趟运费区间',
      key: 'start',
      w: '110px',
      slot: true
    },
    {
      type: 'time',
      key: 'time',
      label: '工作时间段',
      slot: true
    },
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData,
          checkStrictly: true
        }
      },
      label: '仓库位置',
      key: 'g'
    },

    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData,
          checkStrictly: true
        }
      },
      label: '配送区域',
      key: 'i'
    },
    {
      type: 15,
      label: '线路名称/编号',
      key: 'key',
      slot: true,
      w: '110px',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      },
      label: '稳定/临时',
      key: 'j',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '稳定',
          value: 1
        },
        {
          label: '临时',
          value: 2
        }
      ]
    },
    {
      type: 'status',
      key: 'status',
      label: '客邀状态',
      col: 16,
      slot: true
    },
    {
      type: 'btnGroup',
      col: 8,
      slot: true,
      w: '0px'
    }
  ]

  private statusLists:IState[] = [
    {
      label: '全部',
      value: ''
    },
    {
      label: '已发起客邀',
      value: 1
    },
    {
      label: '客邀成功',
      value: 2
    },
    {
      label: '司推成功',
      value: 3
    }
  ]
  // 表格分页
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 根据关键字查线路id
  async loadLineByKeyword(params:IState) {
    try {
      let { data: res } = await getLineSearch(params)
      let result:any[] = res.data.map((item:any) => ({
        label: item.lineName,
        value: item.lineId
      }))
      return result
    } catch (err) {
      console.log(`get driver list fail:${err}`)
      return []
    }
  }
  // 查询
  handleFilterClick() {
    // 单趟运费区间
    const moneyRange = (this.listQuery.start || []).filter((item:string | number) => item !== '')
    if (moneyRange.length === 1) {
      return this.$message.warning('单趟运费输入不完整')
    } else if (moneyRange.length === 2) {
      if (Number(moneyRange[0]) > Number(moneyRange[1])) {
        return this.$message.warning('单趟运费起始金额不能大于终止金额')
      }
    }
    // 工作时间段
    const timeRange = (this.listQuery.time || []).filter((item:string | number) => item !== '')
    if (timeRange.length === 1) {
      return this.$message.warning('工作时间段输入不完整')
    }

    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {}
  }
  // 获取列表
  async getLists() {
    try {
      this.listLoading = true
      setTimeout(() => {
        (this.$refs.lineTable as any).getLists()
      }, 1000)
    } catch (err) {
      console.log(`getlists fail:${err}`)
    } finally {
      // this.listLoading = false
      //
    }
  }
  // 客邀状态变化
  handleStatusChange(val:string|number) {
    console.log('xxx:', val)
  }
  // 分页
  handlePageSizeChange(page:number, limit:number) {
    if (page) {
      this.page.page = page
    }
    if (limit) {
      this.page.limit = limit
    }
    this.getLists()
  }
  // 匹配撮合
  handleMatchTryRun() {
    this.showDrawer = true
  }
  // 取消创建试跑意向
  handleCancelTryRun() {
    (this.$refs.cancelTryRun as any).showDialog = true
  }
  // 获取字典列表
  async getDictList() {
    try {
      let params:string[] = ['Intentional_compartment', 'line_label', 'line_handling_difficulty']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        this.labelTypeArr.push(...mapDictData(res.data.line_label || []))
        this.loadDiffArr.push(...mapDictData(res.data.line_handling_difficulty || []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get dict list fail:${err}`)
    } finally {
      //
    }
  }
  // 级联框变化
  // handleCascaderChange(val:IState[], key:string) {
  //   // 是否与上次的类型相同
  //   let changeFlag = false
  //   let changeItem:any = null
  //   if (this.shareScopeEnd.length === 0) {
  //     this.listQuery[key] = val
  //   } else {
  //     // 与原数组比对
  //     this.listQuery[key].forEach((item:any[]) => {
  //       if (item[0] !== this.shareScopeEnd[0][0]) { // 一级标签不同
  //         changeFlag = true
  //         changeItem = item
  //       } else if (item[1] !== this.shareScopeEnd[0][1]) { // 一级标签相同但是二级标签不同
  //         // changeFlag = true
  //         // changeItem = item
  //       } else if ((!item[2] && this.shareScopeEnd[0][2]) || (item[2] && !this.shareScopeEnd[0][2]) || (item[2] && item[2] === -99) || (this.shareScopeEnd[0][2] === -99)) {
  //         changeFlag = true
  //         changeItem = item
  //       }
  //     })
  //   }
  //   if (changeFlag) {
  //     this.listQuery[key] = []
  //     this.listQuery[key].push(changeItem)
  //   }
  //   this.shareScopeEnd = this.listQuery[key]
  // }

  init() {
    this.getDictList();
    (this.$refs.selectForm as any).loadQueryLineByKeyword()
  }
  mounted() {
    this.init()
    this.getLists()
  }
}
</script>
<style lang="scss" scoped>
  .GuestListContainer {
    height:100%;
    .btnPc {
       width: 100%;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
       &.left {
         justify-content: flex-start;
       }
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .table_box {
      padding: 30px 30px 0px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
</style>

<style scoped>
  .GuestListContainer >>> .end .el-form-item__label::before {
    content:'~';
    color: #9e9e9e;
  }
  .isDrawer >>> .el-drawer__wrapper {
    top:84px;
  }
  .isDrawer >>> .v-modal {
    top:84px;
  }
  .isDrawer >>> .el-drawer__body {
    padding-bottom: 84px;
  }
</style>
