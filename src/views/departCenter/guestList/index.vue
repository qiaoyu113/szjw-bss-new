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
        <el-button type="primary">
          本城客邀线
        </el-button>
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
      <template slot="everyTripGuaranteed">
        <input-range
          v-model="listQuery.everyTripGuaranteed"
          v-only-number="{min: 1, max: 19999, precision: 0}"
        />
      </template>
      <template slot="workingHours">
        <timeSelect
          v-model="listQuery.workingHours"
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
        :line-table-data="tableData"
        :is-show-percent="false"
        :obj="{}"
        @match="handleMatchTryRun"
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
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
import Atable from './components/Atable.vue'
import Pagination from '@/components/Pagination/index.vue'

import GuestDrawer from '../guestDrawer/index.vue'
import { GetDictionaryList } from '@/api/common'
import { mapDictData, getProviceCityCountryData } from '../js/index'
import { getLineSearch, getInvitedLines } from '@/api/departCenter'
import InputRange from '../chauffeurList/components/doubleInput.vue'
import TimeSelect from '../chauffeurList/components/timeSelect.vue'
import { showWork, HandlePages } from '@/utils'
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
      InputRange,
      TimeSelect
    }
  })
export default class extends Vue {
    private tableData:IState[] = []
    private listLoading:boolean = false
    private showDrawer:boolean = false
    private carLists:IState[] = [] // 车型列表
    private labelTypeArr:IState[] = [{ label: '全部', value: '' }] // 线路肥瘦
    private loadDiffArr:IState[] = [{ label: '全部', value: '' }] // 装卸难度
    private listQuery:IState = {
      cityCode: [],
      carType: '',
      handlingDifficulty: '',
      labelType: '',
      isBehavior: '',
      isRestriction: '',
      everyTripGuaranteed: [], // 单趟运费区间
      workingHours: [], // 工作时间段
      warehouse: [], // 仓库位置
      area: [], // 配送区域
      lineInfo: ''
    }
    private formItem:any[] = [
      {
        type: 8,
        key: 'cityCode',
        col: 8,
        label: '所属城市',
        tagAttrs: {
          placeholder: '请选择所属城市',
          clearable: true,
          props: {
            lazy: true,
            lazyLoad: showWork
          }
        }
      },
      {
        type: 2,
        tagAttrs: {
          placeholder: '请选择',
          clearable: true,
          filterable: true
        },
        label: '车型',
        key: 'carType',
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
        key: 'handlingDifficulty',
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
        type: 'everyTripGuaranteed',
        label: '单趟运费区间',
        key: 'everyTripGuaranteed',
        w: '110px',
        slot: true
      },
      {
        type: 'workingHours',
        key: 'workingHours',
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
        key: 'warehouse'
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
        key: 'area'
      },
      {
        type: 15,
        label: '线路名称/编号',
        key: 'lineInfo',
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
    async loadLineByKeyword(obj:IState) {
      try {
        let params:IState = {
          page: obj.page,
          limit: obj.limit
        }
        obj.key && (params.keyWord = obj.key)
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
      this.listQuery = {
        cityCode: [],
        carType: '',
        handlingDifficulty: '',
        labelType: '',
        isBehavior: '',
        isRestriction: '',
        everyTripGuaranteed: [], // 单趟运费区间
        workingHours: [], // 工作时间段
        warehouse: [], // 仓库位置
        area: [], // 配送区域
        lineInfo: ''
      }
    }
    // 获取列表数据
    async getLists() {
      try {
        this.listLoading = true
        let params:IState = {
          page: this.page.page,
          limit: this.page.limit,
          thisCityInvite: 1
        }
        this.listQuery.carType && (params.carType = this.listQuery.carType)
        this.listQuery.handlingDifficulty && (params.handlingDifficulty = this.listQuery.handlingDifficulty)
        this.listQuery.labelType && (params.labelType = this.listQuery.labelType)
        this.listQuery.isBehavior && (params.isBehavior = this.listQuery.isBehavior)
        this.listQuery.isRestriction && (params.isRestriction = this.listQuery.isRestriction)
        this.listQuery.lineInfo && (params.lineInfo = this.listQuery.lineInfo)
        if (this.listQuery.cityCode && this.listQuery.cityCode.length > 1) {
          params.cityCode = +this.listQuery.cityCode[1]
        }
        // 单趟运费区间
        if (this.listQuery.everyTripGuaranteed && this.listQuery.everyTripGuaranteed.length > 1) {
          params.everyTripGuaranteedStart = +this.listQuery.everyTripGuaranteed[0]
          params.everyTripGuaranteedEnd = +this.listQuery.everyTripGuaranteed[1]
        }
        // 工作时间段
        if (this.listQuery.workingHours && this.listQuery.workingHours.length > 1) {
          params.workingHourStart = this.listQuery.workingHours[0]
          params.workingHourEnd = this.listQuery.workingHours[1]
        }
        // 仓库位置
        if (this.listQuery.warehouse && this.listQuery.warehouse.length > 2) {
          params.warehouseProvince = +this.listQuery.warehouse[0]
          params.warehouseCity = +this.listQuery.warehouse[1]
          params.warehouseCounty = +this.listQuery.warehouse[2]
        } else if (this.listQuery.warehouse && this.listQuery.warehouse.length > 1) {
          params.warehouseProvince = +this.listQuery.warehouse[0]
          params.warehouseCity = +this.listQuery.warehouse[1]
        }
        // 配送区域
        if (this.listQuery.area && this.listQuery.area.length > 2) {
          params.provinceArea = +this.listQuery.area[0]
          params.cityArea = +this.listQuery.area[1]
          params.countyArea = +this.listQuery.area[2]
        } else if (this.listQuery.area && this.listQuery.area.length > 1) {
          params.provinceArea = +this.listQuery.area[0]
          params.cityArea = +this.listQuery.area[1]
        }
        let { data: res } = await getInvitedLines(params)
        if (res.success) {
          this.tableData = res.data
          let page = await HandlePages(res.page)
          this.page.total = page.total
        } else {
          this.$message.error(res.errorMsg)
        }
      } catch (err) {
        console.log(`get list fail fail:${err}`)
      } finally {
        this.listLoading = false
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

    init() {
      this.getDictList();
      (this.$refs.selectForm as any).loadQueryLineByKeyword()
    }
    activated() {
      this.getLists()
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
