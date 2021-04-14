<template>
  <div
    v-loading="listLoading"
    class="GuestListContainer"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
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
      <template slot="key">
        <el-autocomplete
          v-model="listQuery.key"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入"
        />
      </template>
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
    <!-- 表格 -->
    <div
      class="table_box"
    >
      <Atable
        :list-query="listQuery"
        @tryRun="handleCreateTryRun"
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
    <create-tryRun
      ref="createTryRun"
      :obj="obj"
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
import CreateTryRun from './components/CreateTryRun.vue'
import CancelTryRun from './components/CancelTryRun.vue'
import { GetDictionaryList } from '@/api/common'
import { mapDictData, getProviceCityCountryData } from '../js/index'
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
    CreateTryRun,
    CancelTryRun
  }
})
export default class extends Vue {
  private obj:IState = {
    driverName: 'tom',
    driverId: 'SJ20210121212',
    lineName: '天猫配送',
    lineId: 'XL20210121212',
    workingTimeStart: '06:10'
  }
  private listLoading:boolean = false
  private cityLists:IState[] = [] // 城市列表
  private carLists:IState[] = [] // 车型列表
  private labelTypeArr:IState[] = [] // 线路肥瘦
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
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      col: 5,
      label: '工作时间段',
      key: 'f1',
      options: this.timeLists
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: ' ',
      w: '20px',
      key: 'f2',
      col: 3,
      class: 'end',
      options: this.timeLists
    },
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: getProviceCityCountryData
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
          lazyLoad: getProviceCityCountryData
        }
      },
      label: '配送区域',
      key: 'i'
    },
    {
      type: 'key',
      label: '线路名称/编号',
      key: 'key',
      slot: true,
      w: '110px'
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
  // 查询
  handleFilterClick() {
    if (this.listQuery.start && this.listQuery.end && Number(this.listQuery.start) > Number(this.listQuery.end)) {
      return this.$message.warning('单趟运费起始金额不能大于终止金额')
    }
    if (this.listQuery.f1 && this.listQuery.f2 && (this.listQuery.f1 === this.listQuery.f2)) {
      return this.$message.warning('起始时间与结束时间差>=1小时')
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
    } catch (err) {
      console.log(`getlists fail:${err}`)
    } finally {
      this.listLoading = false
      //
    }
  }
  // 客邀状态变化
  handleStatusChange(val:string|number) {
    console.log('xxx:', val)
  }
  // 线路名称/编号 模糊搜索
  querySearch(queryString:string, cb:Function) {
    // eslint-disable-next-line standard/no-callback-literal
    cb([])
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
  // 创建试跑意向
  handleCreateTryRun() {
    (this.$refs.createTryRun as any).showDialog = true
  }
  // 取消创建试跑意向
  handleCancelTryRun() {
    (this.$refs.cancelTryRun as any).showDialog = true
  }
  // 获取字典列表
  async getDictList() {
    try {
      let params:string[] = ['Intentional_compartment', 'line_label']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        this.carLists.push(...mapDictData(res.data.Intentional_compartment || []))
        this.labelTypeArr.push(...mapDictData(res.data.line_label || []))
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get dict list fail:${err}`)
    } finally {
      //
    }
  }
  init() {
    this.getDictList()
    for (let i = 0; i < 24; i++) {
      let count = i < 9 ? `0${i}:00` : `${i}:00`
      this.timeLists.push({
        label: count,
        value: count
      })
    }
  }
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
  .GuestListContainer {
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
</style>
