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
            v-for="item in clueTypePermission"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      <template slot="status">
        <el-badge
          v-for="item in tableBtn"
          :key="item.text"
          :value="item.num"
          :max="9999"
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
          v-permission="['/v2/market-clue/updateFollowerByPrivateSeas']"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          :disabled="multipleSelection.length > 0 ? false :true"
          @click="handleMulDistributionClick"
        >
          批量转线索
        </el-button>
        <el-button
          v-if="listQuery.clueType !== 2"
          v-permission="importClue"
          type="primary"
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          @click="uploadDialog = true"
        >
          导入线索
        </el-button>
        <el-button
          v-permission="['/v2/market-clue/privatePool/export']"
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
            @change="handleFilterClick(true)"
          >
            <el-checkbox-button :label="true">
              待办清单
            </el-checkbox-button>
          </el-checkbox-group>
        </el-badge>
        <el-select
          v-if="hasShow"
          v-model="listQuery.sort"
          placeholder="排序方式"
          size="small"
          clearable
          @change="sortClick"
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
        :func="filterCheck"
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
          {{ row.followerDate }}<br>{{ row.allocatedDate }}
        </template>
        <template v-slot:hasCar="{row}">
          {{ row.hasCar ? '有' : '无' }}{{ row.carTypeName? '/'+row.carTypeName:'' }}
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
          <!-- :disabled="!(scope.row.status=== 10 || scope.row.status=== 20)" -->
          <el-button
            v-permission="['/v2/market-clue/list/makeCall']"
            type="text"
            :disabled="hasPhone(scope.row.status)"
            @click="callPhoneClick(scope.row)"
          >
            打电话
          </el-button>
          <el-button
            v-permission="['/v2/market-clue/getClueDetail']"
            type="text"
            @click="goDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-permission="['/v2/market-clue/updateFollowerByPrivateSeas']"
            type="text"
            :disabled=" (scope.row.status === 40 || scope.row.status === 50)"
            @click="handleDistributionClick(scope.row)"
          >
            转线索
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
          @click.prevent="downloadFile"
        >
          点击下载模板
        </el-link>
      </div>
    </SelfDialog>
    <CallPhone
      :show-dialog.sync="callPhoneDio"
      :clue-status="rowStatus.clueType"
      :phone="rowStatus.phone"
      :clue-id="rowStatus.clueId"
      @success="getLists"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages, lock, showCityGroupPerson, showWork } from '@/utils/index'
import { GetClueWSXPrivateSeaPoolList, GetClueLCXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolListB,
  GetClueLZXPrivateSeaPoolListC,
  UpdateFollowerByPrivateSeas, ExportFirmiana, ExportBirdTruck, ExportBirdRental,
  UploadExcelFirmianaZC, UploadExcelBirdGX, UploadExcelLNB, UploadExcelLNC
} from '@/api/clue'
import { today, yesterday, sevenday, thirtyday } from '@/views/driver-freight/components/date'
import CallPhone from './components/CallPhone/index.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetDictionaryList, GetSpecifiedRoleList,
  getGroupInfoByCityCodeAndProductLine
} from '@/api/common'
import { delayTime } from '@/settings'
import { exportFileTip } from '@/utils/exportTip'
import { checkPermission } from '@/utils/permission'

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
    SelfForm,
    SelfDialog,
    CallPhone
  }
})
export default class extends Vue {
  times:number = 10;
  private listLoading: boolean = false;
  private toDoValue: number = 0;
  private gmGroupList = [{ label: '全部', value: '' }] // 加盟小组
  private listQuery: IState = {
    cityCode: '', // 所属城市
    carCity: '', // 车辆所在城市
    name: '', // 姓名
    phone: '', // 手机号
    hasCar: '', // 是否有车
    haveCar: '',
    carType: [], // 车型
    gmGroupId: '', // 加盟小组
    followerId: '', // 跟进人
    sourceChannel: [], // 渠道
    clueAttribution: '', // 线索归属
    inviteStatus: '', // 邀约情况
    intentDegree: '', // 意向度
    inviteFailReason: [], // 邀约失败原因
    notFollowDay: '', // 未跟进天数
    onlyMe: false, // 只看自己
    status: '', // 状态
    toDo: false, // 代办事项
    sort: '', // 排序方式
    clueType: 0,
    createTime: ''
  };
  private tableData: any[] = [];
  // options
  private hasCarList: IState[] = [
    { label: '全部', value: '' },
    { label: '有', value: 1 },
    { label: '无', value: 0 }
  ];
  private sortOptions: IState[] = [
    { label: '按照未跟进天数倒序', value: 'notFollowStartDate:asc' },
    { label: '按照未跟进天数正序', value: 'notFollowStartDate:desc' },
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
      num: 0,
      uri: ['root']
    },
    {
      name: '10',
      text: '待跟进',
      num: 0,
      uri: ['root']
    },
    {
      name: '20',
      text: '跟进中', // 审核通过
      num: 0,
      uri: ['root']
    },
    {
      name: '22',
      text: '可入池', // 审核通过
      num: 0,
      uri: [2]
    },
    {
      name: '23',
      text: '待入池', // 审核通过
      num: 0,
      uri: [2]
    },
    {
      name: '24',
      text: '已入池', // 审核通过
      num: 0,
      uri: [2]
    },
    {
      name: '30',
      text: '邀约成功',
      num: 0,
      uri: [0, 1]
    },
    {
      name: '32',
      text: '有意向',
      num: 0,
      uri: [3, 4]
    },
    {
      name: '35',
      text: '已看中',
      num: 0,
      uri: [3, 4]
    },
    {
      name: '40',
      text: '已面试',
      num: 0,
      uri: [0, 1]
    },
    {
      name: '50',
      text: '已成交',
      num: 0,
      uri: [0, 1, 3, 4]
    }
  ]
  downloadFile() {
    const fileList = [
      {
        fileUrl: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/excel_template/9aad173773eb4ab0aee22bdb1b2e5b2f',
        recordId: '梧桐专车导入模板'
      },
      {
        fileUrl: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/excel_template/a6e4f7b4d35d4761851fc142f591fd58',
        recordId: '梧桐共享导入模板'
      },
      {},
      {
        fileUrl: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/excel_template/6a4eb42e42594e2992747d345275044f',
        recordId: '雷鸟租赁C导入模板'
      },
      {
        fileUrl: 'https://qizhiniao-dev.oss-cn-beijing.aliyuncs.com/excel_template/ce168afed219417b8567915a0ce89237',
        recordId: '雷鸟租赁B导入模板'
      }
    ]
    const index = this.listQuery.clueType
    this.download(fileList[index])
  }
  filterCheck({ status }:any) {
    return !(status === 40 || status === 50)
  }
  // 下载文件
  download(row:any) {
    if (!row.fileUrl) {
      return
    }
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = row.fileUrl
    link.setAttribute(`download`, `313133.xls`)
    // return
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  // 打电话
  private callPhoneDio = false
  private rowStatus = {
    clueType: '',
    phone: '',
    clueId: ''
  }
  callPhoneClick(row:any) {
    const { clueId, clueType, phone } = row
    this.rowStatus = {
      clueId,
      clueType,
      phone
    }
    this.$nextTick(() => {
      this.callPhoneDio = true
    })
  }
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
      key: 'cityCode',
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
        clearable: true,
        multiple: true,
        'collapse-tags': true
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
      label: '车型',
      key: 'carType',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true,
        multiple: true,
        collapseTags: true
      },
      rules: [0, 1],
      options: this.carTypeOptions
    },
    {
      type: 2,
      label: '小组',
      key: 'gmGroupId',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
      },
      listeners: {
        change: this.gmChanges
      },
      rules: [2, 3, 4],
      options: this.gmGroupList
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
      listeners: {
        change: this.gmChanges
      },
      rules: [0, 1],
      options: this.gmGroupList
    },
    {
      type: 2,
      label: '跟进人',
      key: 'followerId',
      tagAttrs: {
        placeholder: '请选择',
        filterable: true,
        clearable: true
        // multiple: true,
        // collapseTags: true
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
        clearable: true,
        multiple: true,
        collapseTags: true
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
      type: 1,
      label: '未跟进天数',
      key: 'notFollowDay',
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        type: 'number'
      },
      listeners: {
        input: () => {
          this.listQuery.notFollowDay = this.listQuery.notFollowDay.replace(/[^\d]/g, '')
        }
      },
      rules: ['root']
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
      key: 'intentCarTypeName',
      label: '意向车型',
      rules: [3, 4]
    },
    {
      key: 'payIntentionMoney',
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
      width: '200px',
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

  // 获取选择分配人
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
  // 表格按钮
  get tableBtn() {
    return this.btns.filter((item: any) => {
      return item.uri.includes('root') || item.uri.includes(this.listQuery.clueType)
    })
  }

  get hasShow() {
    const status = this.listQuery.status
    return (status === '10' || status === '20')
  }
  // 跳转详情页
  goDetail({ clueType, phone, clueId }:any) {
    const query = {
      clueType, phone, clueId
    }
    this.$router.push({
      path: '/clue/privateDetail',
      query: query
    })
  }
  // 查询
  private handleFilterClick(istrue = false) {
    (this.$refs.PrivateClueTable as any).toggleRowSelection()
    this.page.page = 1
    if (istrue === true) {
      (this.$refs['suggestForm'] as any).resetForm()
    }
    this.getLists(istrue === true)
  }
  private sortClick() {
    this.getLists(this.listQuery.toDo)
  }
  // 重置
  private async handleResetClick(row: IState) {
    (this.$refs['suggestForm'] as any).resetForm()
    // 重新请求小组数据
    this.$nextTick(() => {
      this.listQuery.cityCode = ''
      this.cityChange('')
      this.getLists()
    })
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

  // 获取参数
  getParams() {
    let params: IState = {
      clueType: this.listQuery.clueType,
      page: this.page.page,
      limit: this.page.limit
    }
    params.sort = this.listQuery.sort
    if (this.listQuery.toDo) {
      params.toDo = +this.listQuery.toDo
      delete params.followerId
      // delete params.clueType
      return params
    }
    this.formItem.map((item: any) => {
      if (item.rules.includes('root') || item.rules.includes(this.listQuery.clueType)) {
        if (item.key === 'cityCode' && this.listQuery.cityCode) {
          params.cityCode = this.listQuery.cityCode[1] || ''
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
    params.onlyMe = params.onlyMe ? 1 : 0
    params.carType = Array.isArray(this.listQuery.carType) && this.listQuery.carType.filter(item => item !== '').join(',')
    // params.followerId = Array.isArray(this.listQuery.followerId) && this.listQuery.followerId.filter(item => item === '').join(',')
    params.inviteFailReason = Array.isArray(this.listQuery.inviteFailReason) && this.listQuery.inviteFailReason.filter(item => item !== '').join(',')
    params.sourceChannel = Array.isArray(this.listQuery.sourceChannel) && this.listQuery.sourceChannel.filter(item => item !== '').join(',')

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        (params[key] === '' || params[key] === undefined) && delete params[key]
      }
    }

    return params
  }
  // 获取列表
  private async getLists(isTodo = false) {
    try {
      this.listLoading = true
      const submitForm = this.clueArr.find((item: any) => {
        return item.value === this.listQuery.clueType
      }) || {}
      if (!submitForm.searchUrl) return
      if (!isTodo) {
        this.listQuery.toDo = false
      }
      let params = this.getParams() // 获取参数
      // return
      let { data: res } = await submitForm.searchUrl(params)
      if (res.success) {
        // eslint-disable-next-line
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
        this.tableData = res.data || []
        this.titleChang(res.title)
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
  titleChang(title:any) {
    this.btns.forEach(item => {
      if (item.name === '') {
        item.num = title.all
      } else {
        item.num = title[item.name]
      }
    })
    this.toDoValue = title.toDoCount
  }
  // 获取跟进人列表
  async getGmOptions(cityCode:any, groupId:any) {
    try {
      let roleTypes = [1, 4]
      //  业务线大于1 的属于雷鸟
      if (this.listQuery.clueType > 1) {
        if (this.listQuery.clueType === 2) {
          roleTypes = [11]
        } else {
          roleTypes = [12]
        }
      }
      let params:any = {
        roleTypes,
        uri: '/v2/clueH5/list/queryFollowerList',
        groupId,
        cityCode
      }
      this.listQuery.busiType !== '' && (params.busiType = this.listQuery.busiType)
      if (this.listQuery.workCity && this.listQuery.workCity.length > 1) {
        params.cityCode = this.listQuery.workCity[1]
      }
      // delete params.cityCode
      // this.followerListOptions.splice(0)
      let { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        let arr = res.data.map(function(item: any) {
          return {
            label: item.name,
            value: item.id,
            status: item.status
          }
        })
        if (this.listQuery.clueType > 1) {
          arr = arr.filter((item:any) => item.status === 1)
        }
        this.followerListOptions.push(...arr)
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }
  //
  get clueTypePermission() {
    const arr = this.clueArr.filter(item => checkPermission([item.pUrl]))
    this.$nextTick(() => {
      if (arr[0]) {
        this.listQuery.clueType = arr[0].value
      }
    })
    return arr
  }
  /**
   *获取基础信息
   */
  async getBaseInfo() {
    try {
      let params = ['source_channel', 'clue_attribution', 'mkt_clue_type', 'invite_status', 'intent_degree', 'invite_fail_reason', 'follow_type', 'Intentional_compartment', 'demand_type']
      let { data: res } = await GetDictionaryList(params)
      if (res.success) {
        const searchArr = [GetClueWSXPrivateSeaPoolList, GetClueWSXPrivateSeaPoolList, GetClueLCXPrivateSeaPoolList, GetClueLZXPrivateSeaPoolListC, GetClueLZXPrivateSeaPoolListB]
        const clueTypePremission = [
          '/v2/market-clue/getCluePrivateSeaPoolList',
          '/v2/market-clue/getClueWSSpecialXPrivateSeaPoolList',
          '/v2/market-clue/getClueLCXPrivateSeaPoolList',
          '/v2/market-clue/getClueLZCXPrivateSeaPoolList',
          '/v2/market-clue/getClueLZBXPrivateSeaPoolList'
        ]
        let { clue_attribution: clueAttribution, source_channel: sourceChannel, mkt_clue_type: mktClueType, Intentional_compartment: IntentionalCompartment, demand_type: demandType, invite_status: inviteStatus, intent_degree: intentDegree, invite_fail_reason: inviteFailReason, follow_type: followType } = res.data
        let clue = clueAttribution.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let sources = sourceChannel.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let inviteStatusOptions = inviteStatus.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let intentDegreeOptions = intentDegree.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let inviteFailReasonOptions = inviteFailReason.map((item:any) => ({ label: item.dictLabel, value: item.dictValue }))
        let clueType = mktClueType.map((item:any, index:number) => ({ label: item.dictLabel, value: Number(item.dictValue), searchUrl: searchArr[index], pUrl: clueTypePremission[index] }))
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
          // {
          //   label: '全部',
          //   value: ''
          // },
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
          // {
          //   label: '全部',
          //   value: ''
          // },
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
          try {
            (this.$refs.PublicClueTable as any).toggleRowSelection()
          } catch (error) {
            return
          } finally {
            this.$message.success(res.data.msg)
            this.showDialog = false
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
  private hasUpdata = false // 防止重复点击
  uploadClose() {
    (this.$refs.upload as any).clearFiles()
    this.hasUpdata = false
  }
  customUpload(param: any) {
    // 自定义上传
    if (this.hasUpdata) return
    this.hasUpdata = true
    const formData = new FormData()
    formData.append('file', param.file)
    const clueType = this.listQuery.clueType
    let fileUpload = null
    const arr = [UploadExcelFirmianaZC, UploadExcelBirdGX, undefined, UploadExcelLNC, UploadExcelLNB]
    fileUpload = arr[clueType]
    fileUpload && fileUpload(formData).then(({ data } : any) => {
      if (data.success) {
        this.$notify({
          title: '',
          message: '正在导入，10分钟左右可在右上角「下载工具」 内查看导入失败线索，重新导入！',
          duration: 0,
          offset: 70
        })
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
    const { data } = await ExportFirmiana(params)
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
  // 获取城市下的加盟小组
  async getGroup(cityCode:string) {
    let code = this.listQuery.clueType
    if (this.listQuery.clueType > 1) {
      code = 5
    }
    try {
      const { data } = await getGroupInfoByCityCodeAndProductLine({
        busiLine: [code].toString(),
        cityCode: cityCode
      })
      // this.
      this.gmGroupList.splice(1)
      if (data.success) {
        let arr = data.data.map((item:any) => {
          const { id: value, name: label } = item
          return {
            value, label
          }
        })
        this.gmGroupList.push(...arr)
      }
    } catch (error) {
      return error
    }
  }
  @Watch('listQuery.cityCode')
  private cityChange(value:any) {
    this.listQuery.gmGroupId = ''
    this.listQuery.haveCar = ''
    this.gmGroupList.splice(1)
    this.listQuery.followerId = ''
    this.followerListOptions.splice(0)
    if (value[1]) {
      this.getGroup(value[1])
      this.getGmOptions(value[1], '')
    } else {
      this.getGmOptions('', '')
    }
  }

  // 加盟小组改变
  private gmChanges(value:any) {
    this.listQuery.followerId = ''
    this.followerListOptions.splice(0)
    this.getGmOptions(this.listQuery.cityCode[1], value)
  }
  async mounted() {
    this.getBaseInfo()
    this.getGmOptions('', '')
  }
   // 权限
   private distributionPremission:any = {
     0: ['/v2/market-clue/privatePool/firmiana/import/private'],
     1: ['/v2/market-clue/privatePool/firmiana/import/shared'],
     2: [''],
     3: ['/v2/market-clue/privatePool/thunderBirdRental/import/c'],
     4: ['/v2/market-clue/privatePool/thunderBirdRental/import/b']
   }
   get importClue() {
     return this.distributionPremission[this.listQuery.clueType]
   }
   // 限制
   hasPhone(status:any) {
     if (this.listQuery.clueType > 1) {
       return false
     } else {
       return !(status === 10 || status === 20)
     }
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
