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
          @change="handleResetClick"
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
          @click="handleMulDistributionClick"
        >
          批量转线索
        </el-button>
        <el-button
          v-if="listQuery.clueType !== 2"
          type="primary"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="uploadDialog = true"
        >
          导入线索
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="times === 10 ? false :true"
          :class="isPC ? '' : 'btnMobile'"
          @click="_exportFile"
        >
          导出<template v-if="times !== 10">
            {{ times }} s
          </template>
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
            @change="handleFilterClick"
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
          clearable
          @change="handleFilterClick"
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
            @click="handleDistributionClick(scope.row)"
          >
            转线索
          </el-button>
        </template>
      </self-table>
    </div>
    <!-- dialog -->
    <SelfDialog
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
    <SelfDialog
      :visible.sync="uploadDialog"
      :title="'导入线索'"
      :confirm="uploadConfirm"
      width="500px"
      :destroy-on-close="false"
      @closed="uploadClose"
    >
      <div class="uploadForm">
        <div class="upload_tit">
          本地线索导入
        </div>
        <el-upload
          ref="upload"
          class="upload"
          action="/"
          :http-request="customUpload"
          :on-change="handleChange"
          :file-list="fileList"
          :auto-upload="false"
          :multiple="false"
          :accept="'.xlsx,.xls'"
        >
          <el-button
            slot="trigger"
            size="small"
            type="primary"
          >
            选择导入文件
          </el-button>
          <div
            slot="tip"
            class="el-upload__tip"
          >
            仅支持XLS/XLSX文件格式
          </div>
        </el-upload>
        <div
          class="dialog_tit"
        >
          上传成功后，该线索会自动分配给导入人
        </div>
        <el-link
          class="mt20"
          type="primary"
          href="https://element.eleme.io"
          target="_blank"
        >
          点击下载模板
        </el-link>
      </div>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages, lock, showCityGroupPerson, showWork } from '@/utils/index'
import { GetClueWSXPrivateSeaPoolList, GetClueLCXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolList, UpdateFollowerByPrivateSeas, UploadExcelFirmiana, UploadExcelBird, ExportFirmiana, ExportBirdTruck, ExportBirdRental } from '@/api/clue'
import { today, yesterday, sevenday, thirtyday, month, lastmonth, threemonth } from '@/views/driver-freight/components/date'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetDictionaryList, GetSpecifiedRoleList } from '@/api/common'
import { delayTime } from '@/settings'
import { exportFileTip } from '@/utils/exportTip'
import { marketClue, allocationClue } from '@/api/driver-cloud'

interface IState {
  [key: string]: any;
}
// import {
//   today,
//   yesterday,
//
// } from '../driver-freight/components/date'
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
  slot?: boolean;
  w?: string;
}
@Component({
  name: 'PrivateClue',
  components: {
    SelfTable,
    SelfForm,
    SelfDialog
  }
})
export default class extends Vue {
  times: number = 10;
  private listLoading: boolean = false;
  private toDoValue: number = 0;
  private clueArr: IState[] = [
    { name: '梧桐专车', code: 0 },
    { name: '梧桐共享', code: 1 },
    { name: '雷鸟供给C', code: 2 },
    { name: '雷鸟租赁C', code: 3 },
    { name: '雷鸟租赁B', code: 4 }
  ];
  private listQuery: IState = {
    carType: '', // 车型
    cityCode: '', // 所属城市
    carCity: '', // 车辆所在城市
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
    onlyMe: false, // 只看自己
    status: '', // 状态
    toDo: false, // 代办事项
    sort: '', // 排序方式
    clueType: 0
  };
  private tableData: any[] = [];
  // options
  private hasCarList: IState[] = [
    { label: '全部', value: '' },
    { label: '有', value: 1 },
    { label: '无', value: 0 }
  ];
  private sortOptions: IState[] = [
    { label: '按照未跟进天数倒序', value: 'notFollowDay:desc' },
    { label: '按照未跟进天数正序', value: 'notFollowDay:asc' },
    { label: '按照跟进次数倒序', value: 'followNum:desc' },
    { label: '按照跟进次数正序', value: 'followNum:asc' }
  ]
  private followerListOptions: IState[] = [] // 跟进人
  private demandOptions: any[] = [] // 需求类型
  private sourceOptions:any[] = [] // 来源渠道列表
  private clueOptions:any[] = [] // 线索归属
  private inviteStatusOptions: any[] = [] // 邀约情况
  private intentDegreeOptions: any[] = [] // 意向度
  private carTypeOptions: any[] = [] // 车型
  private followTypeOptins: any[] = [] // 跟进情况
  private inviteFailReasonOptions: any[] = [] // 邀约失败原因
  // private clueArr:IState[] = []
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
  private btns: any[] = [
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
  ];
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
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
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
      options: this.followTypeOptins
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
      key: 'createTime'
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
  // dialog
  private showDialog:boolean = false; // 弹框
  private title:string = '';
  private rows:IState[] = []; // 弹框选中的数据
  private multipleSelection:IState[] = [];// 多选选中
  private dialogListQuery:IState = {
    followerId: []
  };
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
          lazyLoad: showCityGroupPerson
        }
      },
      label: '选择跟进人',
      key: 'followerId'
    }
  ]

  // 导入文件
  private uploadDialog: boolean = false;
  private fileList: any[] = [];

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
    (this.$refs.PrivateClueTable as any).toggleRowSelection()
    this.page.page = 1
    this.getLists()
  }
  // 重置
  private async handleResetClick(row: IState) {
    (this.$refs['suggestForm'] as any).resetForm()
    this.getLists()
  }
  // 批量分配
  private handleallAllotClick() {
    // this.dialogTit = '批量分配'
    // this.showDialog = true
    // this.rowData.push(...this.multipleSelection)
  }

  // private handleSelectionChange(val: any) {
  //   this.multipleSelection = val
  // }

  private oninputOnlyNum(value: string) {
    this.listQuery.phone = value.replace(/[^\d]/g, '')
  }

  // 分页
  private handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }

  // 获取参数
  getParams() {
    let params: IState = {
      clueType: this.listQuery.clueType,
      page: this.page.page,
      limit: this.page.limit
    }
    this.formItem.map((item: any) => {
      if (item.rules.includes('root') || item.rules.includes(this.listQuery.clueType)) {
        if (item.key === 'cityCode' && this.listQuery.cityCode && this.listQuery.cityCode.length > 0) {
          params.cityCode = this.listQuery.cityCode[1]
        } else if (item.key === 'carCity' && this.listQuery.carCity && this.listQuery.carCity.length > 0) {
          params.carCity = this.listQuery.carCity[1]
        } else if (item.key === 'createTime' && this.listQuery.createTime && this.listQuery.createTime.length > 0) {
          let createDateStart = new Date(this.listQuery.createTime[0])
          let createDateEnd = new Date(this.listQuery.createTime[1])
          params.startDate = createDateStart.setHours(0, 0, 0) || undefined
          params.endDate = createDateEnd.setHours(23, 59, 59, 999) || undefined
        } else {
          (this.listQuery[item.key] !== '' && this.listQuery[item.key] !== undefined) && (params[item.key] = this.listQuery[item.key])
        }
      }
      return item
    })
    this.listQuery.toDo && (params.toDo = this.listQuery.toDo)
    this.listQuery.sort && (params.sort = this.listQuery.sort)
    return params
  }
  // 获取列表
  @lock
  private async getLists() {
    try {
      this.listLoading = true

      const submitForm = this.clueArr.find((item: any) => {
        return item.value === this.listQuery.clueType
      }) || {}
      if (!submitForm.searchUrl) return
      let params = this.getParams() // 获取参数
      let { data: res } = await submitForm.searchUrl(params)
      if (res.success) {
        // eslint-disable-next-line
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data || []
        this.btns.forEach((item) => {
          let key = item.name
          key = +key
          item.num = res.title[key]
        })
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
      let params = ['source_channel', 'clue_attribution', 'mkt_clue_type', 'invite_status', 'intent_degree', 'invite_fail_reason', 'follow_type', 'Intentional_compartment', 'demand_type']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        const searchArr = [GetClueWSXPrivateSeaPoolList, GetClueWSXPrivateSeaPoolList, GetClueLCXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolList]
        let { clue_attribution: clueAttribution, source_channel: sourceChannel, mkt_clue_type: mktClueType, Intentional_compartment: IntentionalCompartment, demand_type: demandType, invite_status: inviteStatus, intent_degree: intentDegree, invite_fail_reason: inviteFailReason, follow_type: followType } = res.data

        let clue = clueAttribution.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let sources = sourceChannel.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let inviteStatusOptions = inviteStatus.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let intentDegreeOptions = intentDegree.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let inviteFailReasonOptions = inviteFailReason.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let clueType = mktClueType.map((item:any, index:number) => ({ label: item.dictLabel, value: Number(item.dictValue), searchUrl: searchArr[index] }))
        let carTypeOptions = IntentionalCompartment.map((item:any, index:number) => ({ label: item.dictLabel, value: item.dictValue }))
        let followTypeOptins = followType.map((item:any, index:number) => ({ label: item.dictLabel, value: item.dictValue }))
        let demand = demandType.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))

        this.carTypeOptions.push(...carTypeOptions)
        this.followTypeOptins.push(...followTypeOptins)
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
        this.demandOptions.push(...[
          {
            label: '全部',
            value: ''
          },
          ...demand
        ])

        this.getLists()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get base info fail:${err}`)
    }
  }
  /* 弹窗 */
  // 弹框确认
  confirm() {
    (this.$refs.dialogDriverClue as any).submitForm()
  }
  // 表单验证通过
  handlePassClick(val:boolean) {
    this.updateFollower()
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
      let { data: res } = await UpdateFollowerByPrivateSeas(params)
      if (res.success) {
        if (res.data.flag) {
          (this.$refs.PublicClueTable as any).toggleRowSelection()
          this.$message.success(res.data.msg)
        } else {
          this.$message.warning(res.data.msg)
        }
        this.showDialog = false
        setTimeout(() => {
          this.getLists()
        }, delayTime)
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
    this.title = '转线索'
    this.showDialog = true
  }
  // 多选选中
  handleSelectionChange(val:any) {
    this.multipleSelection = val
  }
  // 批量分配
  handleMulDistributionClick() {
    this.title = '批量转线索'
    this.rows.push(...this.multipleSelection)
    this.showDialog = true
  }
  // 上传文件
  handleChange(file: any) {
    this.fileList = [file]
  }
  uploadConfirm() {
    (this.$refs.upload as any).submit()
  }
  uploadClose() {
    (this.$refs.upload as any).clearFiles()
  }
  customUpload(param: any) {
    // 自定义上传
    const formData = new FormData()
    formData.append('file', param.file)
    const clueType = this.listQuery.clueType
    let fileUpload = null
    if (clueType === 0 || clueType === 1) {
      fileUpload = UploadExcelFirmiana
    } else if (clueType === 3 || clueType === 4) {
      fileUpload = UploadExcelBird
    } else {
      return
    }
    fileUpload(formData).then(({ data } : any) => {
      if (data.success) {
        this.$message.success('上传成功')
        this.uploadDialog = false
        this.handleResetClick({})
      } else {
        this.$message({
          showClose: true,
          duration: 0,
          message: data.errorMsg,
          type: 'error'
        })
      }
    })
  }
  // 导出文件
  _exportFile() {
    exportFileTip(this, this.handleExportClick)
  }
  /**
   * 导出
   */
  @lock
  private async handleExportClick(sucFun:Function) {
    let params: any = this.getParams()
    delete params.page
    delete params.limit
    const clueType = this.listQuery.clueType
    let exportFile = null
    switch (clueType) {
      case 0:
      case 1:
        exportFile = ExportFirmiana
        break
      case 2:
        exportFile = ExportBirdTruck
        break
      case 3:
        exportFile = ExportBirdRental
        break
      default:
        break
    }
    if (!exportFile) return
    const { data } = await exportFile(params)
    if (data.success) {
      sucFun()
      this.$message({
        type: 'success',
        message: '导出成功!'
      })
    } else {
      this.$message.error(data.errorMsg)
    }
  }
  mounted() {
    this.getBaseInfo()
    this.getGmOptions()
  }
}
</script>
<style lang="scss" scope>
.PublicClue {
  .el-radio-group {
    margin-bottom: 0 !important;
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
  .uploadForm{
    padding-left: 20px;
    .upload_tit{
      margin-bottom: 20px;
      font-size: 16px;
    }
    .el-upload__tip{
      font-size: 12px;
      margin-top: 7px;
    }
    .dialog_tit{
      margin-top: 30px;
      color: #606266;
    }
    .mt20{
      margin-top: 20px;
    }
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
