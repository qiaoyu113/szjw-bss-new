<template>
  <div
    v-loading="listLoading"
    class="PrivateClue"
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
        >
          <el-radio-button
            v-for="item in clueArr"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <template slot="status">
        <el-badge
          v-for="item in btns"
          :key="item.text"
          :value="item.num"
          :max="9999"
          :hidden="item.num === 0"
        >
          <el-button
            type="primary"
            :plain="item.name !== listQuery.status"
            @click="() => {
              listQuery.status = item.name
              handleFilterClick()
            }"
          >
            {{ item.text }}
          </el-button>
        </el-badge>
      </template>
      <div
        slot="mulBtn"
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
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="multipleSelection.length > 0 ? false :true"
          @click="handleallAllotClick"
        >
          批量转线索
        </el-button>
        <el-button
          type="primary"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
        >
          导入线索
        </el-button>
        <el-button
          type="primary"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
        >
          导出
        </el-button>
      </div>
    </self-form>
    <div class="table_box">
      <div class="table_top">
        <el-badge
          :value="toDoValue"
          :max="99999"
        >
          <el-checkbox-group
            v-model="listQuery.toDo"
            size="small"
          >
            <el-checkbox-button :label="true">
              代办事项
            </el-checkbox-button>
          </el-checkbox-group>
        </el-badge>
        <el-select
          v-model="listQuery.sort"
          placeholder="排序方式"
          size="small"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <self-table
        ref="PrivateClueTable"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="tableColumns"
        :index="true"
        :page="page"
        row-key="marketClueId"
        style="overflow: initial;"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :default-sort="{prop: 'createDate', order: 'descending'}"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:intoPoolNum="scope">
          <template v-if="scope.header">
            <div style="line-height:1.2">
              入池次数<br>(该线索类型)
            </div>
          </template>
          <template v-else>
            {{ scope.row.intoPoolNum }}
          </template>
        </template>
        <template v-slot:namePhone="{row}">
          {{ row.name }}<br>{{ row.phone }}
        </template>
        <template v-slot:followerName="{row}">
          {{ row.followerName }}<br>{{ row.followerPhone }}
        </template>
        <template v-slot:followDate="{row}">
          {{ row.followDate }}<br>{{ row.allocateDate }}
        </template>
        <template v-slot:hasCar="{row}">
          {{ row.hasCar ? '有；' : '无' }}
        </template>
        <template v-slot:notFollowDay="{row}">
          <el-link
            v-if="row.notFollowDay >= 2"
            :underline="false"
            type="danger"
          >
            {{ row.notFollowDay }}
          </el-link>
          <template v-else>
            {{ row.notFollowDay }}
          </template>
        </template>
        <template v-slot:createDate="scope">
          {{ scope.row.createDate }}
        </template>
        <template v-slot:op="scope">
          <el-button
            type="text"
          >
            打电话
          </el-button>
          <el-button
            type="text"
          >
            详情
          </el-button>
          <el-button
            type="text"
          >
            转线索
          </el-button>
        </template>
      </self-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages, lock, showWork } from '@/utils/index'
import { GetClueWSXPrivateSeaPoolList, GetClueLCXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolList } from '@/api/clue'
import { today, yesterday, sevenday, thirtyday } from '@/views/driver-freight/components/date'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import { GetDictionaryList, GetSpecifiedRoleList } from '@/api/common'

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
  name: 'PrivateClue',
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  times:number = 10;
  private listLoading: boolean = false;
  private toDoValue: number = 0;
  private listQuery: IState = {
    carType: '', // 车型
    cityCode: '', // 所属城市
    name: '', // 姓名
    phone: '', // 手机号
    hasCar: '', // 是否有车
    gmGroupId: '', // 加盟小组
    followerId: '', // 跟进人
    sourceChannel: '', // 渠道
    clueAttribution: '', // 线索归属
    inviteStatus: '', // 邀约情况
    intentDegree: '', // 意向度
    inviteFailReason: '', // 邀约失败原因
    notFollowDay: '', // 未跟进天数
    onlyMe: 0, // 只看自己
    status: '', // 状态
    toDo: false, // 代办事项
    sort: '', // 排序方式
    clueType: 0
  };
  private tableData: any[] = [];
  private multipleSelection: any[] = []; // 当前页选中的数据
  // options
  private hasCarList: IState[] = [
    { label: '全部', value: '' },
    { label: '有', value: 1 },
    { label: '无', value: 0 }
  ];
  private sortOptions: IState[] = []
  private followerListOptions: IState[] = [] // 跟进人
  private sourceOptions:any[] = [] // 来源渠道列表
  private clueOptions:any[] = [] // 线索归属
  private inviteStatusOptions: any[] = [] // 邀约情况
  private intentDegreeOptions: any[] = [] // 意向度
  private inviteFailReasonOptions: any[] = [] // 邀约失败原因
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
  private btns:any[] = [
    {
      name: '',
      text: '全部',
      num: 0
    },
    {
      name: '10',
      text: '待分配',
      num: 0
    },
    {
      name: '20',
      text: '待跟进', // 审核通过
      num: 0
    },
    {
      name: '30',
      text: '跟进中',
      num: 0
    },
    {
      name: '40',
      text: '待面试',
      num: 0
    },
    {
      name: '50',
      text: '已面试',
      num: 0
    },
    {
      name: '60',
      text: '已成交',
      num: 0
    }
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
        'node-key': 'id',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 8,
      key: 'workCity',
      label: '车辆所在城市',
      rules: [2],
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'workCity',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 8,
      key: 'workCity',
      label: '所在城市',
      rules: [3, 4],
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'workCity',
        props: {
          lazy: true,
          lazyLoad: showWork
        }
      }
    },
    {
      type: 2,
      label: '意向车型',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [3, 4],
      options: this.hasCarList
    },
    {
      type: 2,
      label: '需求类型',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [2],
      options: this.hasCarList
    },
    {
      type: 2,
      label: '车型',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [2],
      options: this.hasCarList
    },
    {
      type: 1,
      label: '姓名',
      key: 'name',
      rules: ['root'],
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
      label: '小组',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [2, 3, 4],
      options: this.hasCarList
    },
    {
      type: 2,
      label: '加盟小组',
      key: 'gmGroupId',
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
      label: '跟进人',
      key: 'followerId',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: ['root'],
      options: this.followerListOptions
    },
    {
      type: 2,
      label: '渠道',
      key: 'sourceChannel',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
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
      type: 2,
      label: '邀约情况',
      key: 'inviteStatus',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [0, 1],
      options: this.inviteStatusOptions
    },
    {
      type: 2,
      label: '意向度',
      key: 'intentDegree',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [0, 1],
      options: this.intentDegreeOptions
    },
    {
      type: 2,
      label: '邀约失败原因',
      key: 'inviteFailReason',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [0, 1],
      options: this.inviteFailReasonOptions
    },
    {
      type: 2,
      label: '跟进情况',
      key: 'haveCar',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: [2, 3, 4],
      options: this.hasCarList
    },
    {
      type: 2,
      label: '未跟进天数',
      key: 'notFollowDay',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      rules: ['root'],
      options: this.hasCarList
    },
    {
      type: 5,
      label: '只看自己',
      key: 'onlyMe',
      options: [
        {
          label: '',
          value: false
        }
      ],
      rules: ['root'],
      tagAttrs: {
        'true-label': 1,
        'false-label': 0
      }
    },
    {
      type: 3,
      rules: ['root'],
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: this.shortcuts
        }
      },
      label: '创建日期',
      key: 'time'
    },
    {
      col: 20,
      label: '状态',
      key: 'status',
      type: 'status',
      rules: ['root'],
      slot: true
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
      key: 'namePhone',
      slot: true,
      label: '姓名/手机号',
      rules: ['root']
    },
    {
      key: 'hasCar',
      label: '是否有车/车型',
      rules: [0, 1],
      slot: true
    },
    {
      key: 'experience',
      label: '货运经验（月）',
      rules: [0, 1]
    },
    {
      key: 'contactSituationName',
      label: '邀约情况',
      rules: [0, 1]
    },
    {
      key: 'name1',
      label: '需求类型',
      rules: [2]
    },
    {
      key: 'carTypeName',
      label: '车型',
      rules: [2]
    },
    {
      key: 'carTypeName',
      label: '意向车型',
      rules: [3, 4]
    },
    {
      key: 'carTypeName1',
      label: '是否交意向金',
      rules: [2]
    },
    {
      key: 'remark',
      label: '跟进备注',
      rules: ['root']
    },
    {
      key: 'notFollowDay',
      label: '未跟进天数',
      rules: ['root'],
      slot: true
    },
    {
      key: 'followNum',
      label: '跟进次数',
      rules: ['root']
    },
    {
      key: 'statusName',
      label: '状态',
      rules: ['root']
    },
    {
      key: 'followerName',
      label: '跟进人',
      rules: ['root'],
      slot: true
    },
    {
      key: 'followDate',
      label: '最近跟进时间/分配时间',
      rules: ['root'],
      slot: true
    },
    {
      key: 'sourceChannelName',
      label: '渠道',
      rules: ['root']
    },
    {
      key: 'clueTypeName',
      label: '线索类型',
      rules: ['root']
    },
    {
      key: 'cityName',
      label: '城市',
      rules: [0, 1]
    },
    {
      key: 'haveCar12',
      label: '车辆所在城市',
      rules: [2]
    },
    {
      key: 'haveCar12',
      label: '所在城市',
      rules: [3, 4]
    },
    {
      key: 'intoPoolNum',
      slot: true,
      header: true,
      rules: ['root']
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      width: this.isPC ? '180px' : '50px',
      rules: ['root']
    }
  ];

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
  // 查询
  private handleFilterClick() {
    // (this.$refs.PrivateClueTable as any).toggleRowSelection()
    this.page.page = 1
    this.getLists()
  }
  // 重置
  private async handleResetClick(row: IState) {
    // (this.$refs['suggestForm'] as any).resetForm()
    // this.getLists()
  }
  // 批量分配
  private handleallAllotClick() {
    // this.dialogTit = '批量分配'
    // this.showDialog = true
    // this.rowData.push(...this.multipleSelection)
  }

  private handleSelectionChange(val:any) {
    this.multipleSelection = val
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

  // 获取列表
  @lock
  private async getLists() {
    try {
      this.listLoading = true
      let params: IState = {
        clueType: this.listQuery.clueType,
        page: this.page.page,
        limit: this.page.limit
      }
      const submitForm = this.clueArr.find((item: any) => {
        return item.value === this.listQuery.clueType
      }) || {}
      if (!submitForm.searchUrl) return
      let { data: res } = await submitForm.searchUrl(params)
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
  // 获取跟进人列表
  async getGmOptions() {
    try {
      if (this.followerListOptions.length > 0) {
        return false
      }
      let params:any = {
        roleTypes: [1, 4],
        uri: '/v2/clueH5/list/queryFollowerList'
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
        params.cityCode = this.listQuery.workCity[1]
      }

      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        let arr = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.followerListOptions.push(...arr)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }
  /**
   *获取基础信息
   */
  async getBaseInfo() {
    try {
      let params = ['source_channel', 'clue_attribution', 'mkt_clue_type', 'invite_status', 'intent_degree', 'invite_fail_reason']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        const searchArr = [GetClueWSXPrivateSeaPoolList, GetClueWSXPrivateSeaPoolList, GetClueLCXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolList]
        let { clue_attribution: clueAttribution, source_channel: sourceChannel, mkt_clue_type: mktClueType, Intentional_compartment: IntentionalCompartment, demand_type: demandType, invite_status: inviteStatus, intent_degree: intentDegree, invite_fail_reason: inviteFailReason } = res.data

        let clue = clueAttribution.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let sources = sourceChannel.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let inviteStatusOptions = inviteStatus.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let intentDegreeOptions = intentDegree.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let inviteFailReasonOptions = inviteFailReason.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let clueType = mktClueType.map((item:any, index:number) => ({ label: item.dictLabel, value: Number(item.dictValue), searchUrl: searchArr[index] }))

        this.clueArr.push(...clueType)
        this.listQuery.clueType = clueType[0].value
        this.clueOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...clue
        ])
        this.sourceOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...sources
        ])
        this.inviteStatusOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...inviteStatusOptions
        ])
        this.intentDegreeOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...intentDegreeOptions
        ])
        this.inviteFailReasonOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...inviteFailReasonOptions
        ])

        this.getLists()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  mounted() {
    this.getBaseInfo()
    this.getGmOptions()
  }
}
</script>
<style lang="scss" scoped>
.PrivateClue {
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
  .table_top{
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
  }
}
</style>
<style scoped>
.PrivateClue >>> .el-badge {
  margin-right: 30px;
}
.PrivateClue >>> .el-badge .el-badge__content{
  right: 0;
  transform: translateY(-50%) translateX(50%);
  z-index: 10;
}
.PrivateClue .table_top >>> .el-checkbox-button__inner{
  border-radius: 4px!important;
}
</style>
