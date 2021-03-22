<template>
  <div
    v-loading="listLoading"
    class="PublicClue"
    :class="{
      p15: isPC
    }"
  >
    <self-form
      ref="suggestForm"
      :list-query="listQuery"
      :form-item="formItems"
      size="small"
      label-width="7em"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <div slot="tabGroup">
        <el-radio-group
          v-model="listQuery.clueType"
          style="margin-bottom: 30px;"
          @change="handleResetClick"
        >
          <el-radio-button
            v-for="item in cartTypePremission"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <div
        slot="mulBtn"
        :key="listQuery.clueType"
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
          @click="handleResetClicks"
        >
          重置
        </el-button>
        <el-button
          v-permission="disPremission"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="multipleSelection.length > 0 ? false :true"
          @click="handleMulDistributionClick"
        >
          批量分配
        </el-button>
      </div>
    </self-form>
    <div class="table_box">
      <self-table
        ref="PublicClueTable"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="tableColumns"
        :index="true"
        :page="page"
        row-key="clueId"
        style="overflow: initial;"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :default-sort="{prop: 'createDate', order: 'descending'}"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
        @sort-change="sortDate"
      >
        <template v-slot:num="scope">
          <template v-if="scope.header">
            <div style="line-height:1.2">
              入池次数<br>(该线索类型)
            </div>
          </template>
          <template v-else>
            {{ scope.row.intoPoolNum }}
          </template>
        </template>
        <template v-slot:hasCar="scope">
          {{ scope.row.hasCar ? '有' : '无' }}
        </template>
        <template v-slot:createDate="scope">
          {{ scope.row.createDate }}
        </template>
        <template v-slot:op="scope">
          <el-button
            :key="listQuery.clueType"
            v-permission="disPremission"
            type="text"
            @click="handleDistributionClick(scope.row)"
          >
            分配
          </el-button>
        </template>
      </self-table>
    </div>
    <!-- dialog -->
    <SelfDialog
      :key="listQuery.clueType"
      :visible.sync="showDialog"
      :title="title"
      :confirm="confirm"
      width="500px"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <self-form
        ref="dialogDriverClue"
        :rules="rules"
        :list-query="dialogListQuery"
        :form-item="dialogFormItem"
        size="small"
        label-width="100px"
        :pc-col="24"
        @onPass="handlePassClick"
      />
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages, lock, showCityGroupPerson, showWork, validatorNumberRange } from '@/utils/index'
import { GetToAllotWT, GetToAllotLNCarPool, GetToAllotLNLease, UpdateFollowerByHighSeas } from '@/api/clue'
import { today, yesterday, sevenday, thirtyday } from '@/views/driver-freight/components/date'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetDictionaryList } from '@/api/common'
import { delayTime } from '@/settings'
import { forIn } from 'lodash'
import { checkPermission } from '@/utils/permission'
// import { marketClue } from '@/api/driver-cloud'

interface IState {
  [key: string]: any;
}
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}
interface formItem {
  [key: string]: any;
  type?: number | string;
  label?: string;
  key?: string;
  col?: number;
  tagAttrs?: object;
  listeners?: object;
  options?: IState[];
  slot?:boolean,
  w?:string
}
@Component({
  name: 'PublicClue',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  times:number = 10;
  private listLoading: boolean = false;
  private listQuery: IState = {
    clueType: 0, // 线索类型
    cityCode: '', // 所属城市
    clueAttribution: '', // 线索归属
    hasCar: '', // 是否有车
    name: '', // 姓名
    phone: '', // 手机号
    sourceChannel: [], // 来源渠道
    carCity: '', // 车辆所在城市
    demandType: '', // 需求类型
    carType: [], // 车型
    intentModel: [], // 意向车型
    createTime: '' // 开始时间
  };
  private tableData: any[] = [];
  private hasCarList: IState[] = [
    { label: '全部', value: '' },
    { label: '有', value: 1 },
    { label: '无', value: 0 }
  ];
  private sourceOptions:any[] = [] // 来源渠道列表
  private clueOptions:any[] = [] // 线索归属
  private carTypeOptions: any[] = [] // 车型
  private demandOptions: any[] = [] // 需求类型
  private clueArr:IState[] = []
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  };
  private shortcuts = [
    today,
    yesterday,
    sevenday,
    thirtyday
  ]
  /**
   * rules: []
   * root 为全局显示
   * */
  private formItem: formItem[] = [
    {
      type: 'tabGroup',
      col: 24,
      slot: true,
      w: '0px',
      rules: ['root']
    },
    {
      type: 8,
      key: 'cityCode',
      label: '所属城市',
      rules: [0, 1],
      tagAttrs: {
        placeholder: '请选择所属城市',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'cityCode',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 8,
      key: 'carCity',
      label: '车辆所在城市',
      rules: [2],
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'id',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 8,
      key: 'cityCode',
      label: '所在城市',
      rules: [3, 4],
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'id',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 2,
      label: '意向车型',
      key: 'intentModel',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      rules: [3, 4],
      options: this.carTypeOptions
    },
    {
      type: 2,
      label: '需求类型',
      key: 'demandType',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [2],
      options: this.demandOptions
    },
    {
      type: 2,
      label: '车型',
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      rules: [2],
      options: this.carTypeOptions
    },
    {
      type: 1,
      label: '姓名',
      key: 'name',
      rules: [2, 3, 4],
      tagAttrs: {
        placeholder: '请输入',
        'show-word-limit': true,
        clearable: true
      }
    },
    {
      type: 1,
      label: '手机号',
      key: 'phone',
      rules: ['root'],
      tagAttrs: {
        type: 'tel',
        placeholder: '请输入',
        maxlength: 11,
        'show-word-limit': true,
        clearable: true
      },
      listeners: {
        input: this.oninputOnlyNum
      }
    },
    {
      type: 2,
      label: '是否有车',
      key: 'hasCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [0, 1],
      options: this.hasCarList
    },
    {
      type: 2,
      label: '渠道',
      key: 'sourceChannel',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      rules: ['root'],
      options: this.sourceOptions
    },
    {
      type: 2,
      label: '线索归属',
      key: 'clueAttribution',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: ['root'],
      options: this.clueOptions
    },
    {
      type: 3,
      rules: ['root'],
      col: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        align: 'right',
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: this.shortcuts
        }
      },
      label: '创建日期',
      key: 'createTime'
    },
    {
      type: 'mulBtn',
      col: 24,
      slot: true,
      w: '0px',
      rules: ['root']
    }
  ];
  private columns: any[] = [
    {
      key: 'clueId',
      label: '线索ID',
      rules: ['root']
    },
    {
      key: 'clueTypeName',
      label: '线索类型',
      rules: ['root']
    },
    {
      key: 'name',
      label: '姓名',
      rules: [2, 3, 4]
    },
    {
      key: 'phone',
      label: '手机号',
      rules: ['root']
    },
    {
      key: 'hasCar',
      label: '是否有车',
      slot: true,
      rules: [0, 1]
    },
    {
      key: 'cityName',
      label: '城市',
      rules: [0, 1]
    },
    {
      key: 'carCityName',
      label: '车辆所在城市',
      rules: [2]
    },
    {
      key: 'cityName',
      label: '所在城市',
      rules: [3, 4]
    },
    {
      key: 'intentModelName',
      label: '意向车型',
      rules: [3, 4]
    },
    {
      key: 'demandTypeName',
      label: '需求类型',
      rules: [2]
    },
    {
      key: 'carTypeName',
      label: '车型',
      rules: [2]
    },
    {
      key: 'remark',
      label: '备注',
      rules: [2, 3, 4]
    },
    {
      key: 'sourceChannelName',
      label: '渠道',
      rules: ['root']
    },
    {
      key: 'createName',
      label: '创建人',
      rules: ['root']
    },
    {
      key: 'createDate',
      label: '创建时间',
      slot: true,
      attrs: {
        sortable: true
      },
      width: '150px',
      rules: ['root']
    },
    {
      key: 'num',
      slot: true,
      header: true,
      rules: ['root']
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      width: this.isPC ? '100px' : '50px',
      rules: ['root']
    }
  ];
  // dialog
  private showDialog:boolean = false; // 弹框
  private title:string = '';
  private rows:IState[] = []; // 弹框选中的数据
  private multipleSelection:IState[] = [];// 多选选中
  private dialogListQuery:IState = {
    followerId: []
  };
  sortDate({ order }:any) {
    let isSort = false
    if (order) {
      order = order === 'ascending' ? 'asc' : 'desc'
      this.listQuery.sort = order
      isSort = true
    } else {
      this.listQuery.sort = undefined
    }
    // this.getList(order)
    console.log(order)
    this.getLists(isSort)
  }
  private validateFollow(rule:any, value:any, callback:Function) {
    if (value === '') {
      callback(new Error('请选择跟进人!'))
    } else if (value.length === 2) {
      callback(new Error('该组织下无跟进人!'))
    } else {
      callback()
    }
  }
  private rules:IState = {
    followerId: [
      { required: true, message: '请选择跟进人', trigger: 'blur' },
      { validator: this.validateFollow, trigger: 'change' }
    ]
  };
  private dialogFormItem:any[] = [
    {
      type: 8,
      col: 18,
      tagAttrs: {
        placeholder: '请选择',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'city',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: (node:any, resolve:any) => showCityGroupPerson(node, resolve, this.listQuery.clueType)
        }
      },
      label: '选择跟进人',
      key: 'followerId'
    }
  ]

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // formitem 筛选
  get formItems() {
    return this.formItem.filter((item: any) => {
      return item.rules.includes('root') || item.rules.includes(this.listQuery.clueType)
    })
  }
  // formitem 筛选
  get tableColumns() {
    return this.columns.filter((item: any) => {
      return item.rules.includes('root') || item.rules.includes(this.listQuery.clueType)
    })
  }
  /**
   *获取基础信息
   */
  private distributionPremission:any = {
    0: ['/v2/market-clue/batchUpdateFollower-wt-special/updateFollowerByHighSeas',
      '/v2/market-clue/updateFollower-wt-special/updateFollowerByHighSeas'],
    1: ['/v2/market-clue/batchUpdateFollower-wt-share/updateFollowerByHighSeas',
      '/v2/market-clue/updateFollower-wt-share/updateFollowerByHighSeas'],
    2: ['/v2/market-clue/batchUpdateFollower-ln-carPool/updateFollowerByHighSeas',
      '/v2/market-clue/updateFollower-ln-carPool/updateFollowerByHighSeas'],
    3: ['/v2/market-clue/updateFollower-ln-hire-c/updateFollowerByHighSeas',
      '/v2/market-clue/batchUpdateFollower-ln-hire-c/updateFollowerByHighSeas'],
    4: ['/v2/market-clue/batchUpdateFollower-ln-hire-b/updateFollowerByHighSeas',
      '/v2/market-clue/updateFollower-ln-hire-b/updateFollowerByHighSeas']
  }
  get disPremission() {
    const index = this.listQuery.clueType
    return this.distributionPremission[index]
    // return this.distributionPremission[1] || ['/o']
  }
  async getBaseInfo() {
    try {
      let params = ['clue_attribution', 'source_channel', 'mkt_clue_type', 'Intentional_compartment', 'demand_type']
      let { data: res } = await GetDictionaryList(params)

      if (res.success) {
        const listPermission = [
          '/v2/market-clue/list-wt-special/getToAllotWTClueList',
          '/v2/market-clue/list-wt-share/getToAllotWTClueList',
          '/v2/market-clue/list-ln-carPool/getToAllotLNCarPoolClueList',
          '/v2/market-clue/list-ln-hire-c/getToAllotLNLeaseClueList',
          '/v2/market-clue/list-ln-hire-b/getToAllotLNLeaseClueList'
        ]
        const searchArr = [GetToAllotWT, GetToAllotWT, GetToAllotLNCarPool, GetToAllotLNLease, GetToAllotLNLease]
        // const clueTypeUri = [['']]
        let { clue_attribution: clueAttribution, source_channel: sourceChannel, mkt_clue_type: mktClueType, Intentional_compartment: IntentionalCompartment, demand_type: demandType } = res.data
        let clue = clueAttribution.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let sources = sourceChannel.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let clueType = mktClueType.map((item:any, index:number) => ({ label: item.dictLabel, value: Number(item.dictValue), searchUrl: searchArr[index], pUrl: listPermission[index] }))
        let carTypeOptions = IntentionalCompartment.map((item:any, index:number) => ({ label: item.dictLabel, value: item.dictValue }))
        let demand = demandType.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))

        this.carTypeOptions.push(...carTypeOptions)
        // console.log(clueType)
        this.clueArr.push(...clueType)
        // this.listQuery.clueType = clueType[0].value
        this.clueOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...clue
        ])
        this.sourceOptions.push(...[
          // {
          //   label: '全部',
          //   value: ''
          // },
          ...sources
        ])
        this.demandOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...demand
        ])
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  // 查询
  private handleFilterClick() {
    (this.$refs.PublicClueTable as any).toggleRowSelection()
    this.page.page = 1
    this.getLists()
  }
  // 重置
  private async handleResetClick(row: IState) {
    (this.$refs['suggestForm'] as any).resetForm()
    this.page.page = 1
    this.getLists()
  }
  private async handleResetClicks(row: IState) {
    (this.$refs['suggestForm'] as any).resetForm()
  }
  private oninputOnlyNum(value: string) {
    this.listQuery.phone = value.replace(/[^\d]/g, '')
  }

  // 分页
  private handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }

  // 导出文件
  _exportFile() {
    // exportFileTip(this, this.)
  }
  getQueryparams() {
    let params: IState = {
      clueType: this.listQuery.clueType,
      page: this.page.page,
      limit: this.page.limit
    }
    this.formItem.map((item: any) => {
      if (item.rules.includes('root') || item.rules.includes(this.listQuery.clueType)) {
        if (item.key === 'cityCode' && this.listQuery.cityCode) {
          params.cityCode = this.listQuery.cityCode[1] || ''
        } else if (item.key === 'carCity' && this.listQuery.carCity) {
          params.carCity = this.listQuery.carCity[1] || ''
        } else if (item.key === 'createTime' && this.listQuery.createTime && this.listQuery.createTime.length > 0) {
          let createDateStart = new Date(this.listQuery.createTime[0])
          let createDateEnd = new Date(this.listQuery.createTime[1])
          params.startDate = createDateStart.setHours(0, 0, 0) || undefined
          params.endDate = createDateEnd.setHours(23, 59, 59, 999) || undefined
        } else {
          this.listQuery[item.key] !== '' && (params[item.key] = this.listQuery[item.key])
        }
      }
      return item
    })
    const { sourceChannel, carType, intentModel } = this.listQuery
    params.sourceChannel = Array.isArray(sourceChannel) && sourceChannel.filter(item => item !== '').join(',')
    params.carType = Array.isArray(carType) && carType.filter(item => item !== '').join(',')
    params.intentModel = Array.isArray(intentModel) && intentModel.filter(item => item !== '').join(',')
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        (params[key] === '' || params[key] === undefined) && delete params[key]
      }
    }
    if (this.listQuery.sort) {
      params.sort = this.listQuery.sort
    }
    return params
  }
  // 获取列表
  @lock
  private async getLists(isSort = false) {
    try {
      this.listLoading = true
      const params = this.getQueryparams()

      const submitForm = this.clueArr.find((item: any) => {
        return item.value === this.listQuery.clueType
      }) || {}
      if (!submitForm.searchUrl) return
      let { data: res } = await submitForm.searchUrl(params)
      console.log(res)
      if (res.success) {
        // eslint-disable-next-line
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data || []
      } else {
        this.tableData = res.data || []
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 弹框确认
  confirm() {
    (this.$refs.dialogDriverClue as any).submitForm()
  }
  // 表单验证通过
  handlePassClick(val:boolean) {
    this.updateFollower()
  }
  // 业务线权限分配
  get cartTypePremission() {
    const arr = this.clueArr.filter(item => checkPermission([item.pUrl]))
    this.$nextTick(() => {
      if (arr[0]) {
        this.listQuery.clueType = arr[0].value
        this.getLists()
      }
    })
    // this.listQuery.clueType = arr[0].value
    return arr
  }
  // 分配、批量分配
  @lock
  async updateFollower() {
    try {
      if (this.dialogListQuery.followerId.length !== 3) {
        this.$message.warning('请选择跟进人')
        return false
      }
      let params:IState = {
        clueId: this.rows.map((item:any) => item.clueId + ''),
        followerId: +this.dialogListQuery.followerId[2]
      }
      let { data: res } = await UpdateFollowerByHighSeas(params)
      if (res.success) {
        if (res.data.flag) {
          try {
            (this.$refs.PublicClueTable as any).toggleRowSelection()
            this.$message.success('分配成功')
          } catch (error) {
            return error
          } finally {
            setTimeout(() => {
              this.getLists()
            }, delayTime)
          }
        } else {
          this.$message.warning(res.data.msg)
        }
        this.showDialog = false
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`fenpei fail:${err}`)
    } finally {
      //
    }
  }
  // 弹框关闭后
  handleDialogClosed() {
    (this.$refs.dialogDriverClue as any).resetForm()
    this.dialogListQuery = {
      clueId: []
    }
    let len = this.rows.length
    this.rows.splice(0, len)
  }
  // 分配
  handleDistributionClick(row:IState) {
    this.rows.push(row)
    this.title = '分配'
    this.showDialog = true
  }
  // 多选选中
  handleSelectionChange(val:any) {
    this.multipleSelection = val
  }
  // 批量分配
  handleMulDistributionClick() {
    this.title = '批量分配'
    this.rows.push(...this.multipleSelection)
    this.showDialog = true
  }
  mounted() {
    this.getBaseInfo()
  }
}
</script>
<style lang="scss" scoped>
.PublicClue {
  .el-radio-group{
    margin-bottom: 0!important;
  }
  .btnPc {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
  }
  .mobile {
    width: 100%;
    text-align: center;
    .btnMobile {
      margin-left: 0;
      margin-top: 10px;
      width: 80%;
    }
  }
  .SuggestForm {
    width: 100%;
    background: #fff;
    margin-bottom: 10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    padding-bottom: 0;
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
