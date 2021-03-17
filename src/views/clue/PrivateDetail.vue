<template>
  <div class="PrivateDetail">
    <div class="tabHeader">
      <el-card
        v-if="clueArray"
        class="box-card"
      >
        <template>
          <el-tabs
            v-model="clueStatus"
            @tab-click="handleClick"
          >
            <el-tab-pane
              v-for="(item,index) in clueArray"
              :key="index"
              :label="item.name"
              :name="item.code"
            />
          </el-tabs>
        </template>
      </el-card>
    </div>
    <div class="detailContent">
      <el-card class="box-card">
        <SectionContainer
          class="followUp"
          title="跟进情况"
          :md="true"
        >
          <div
            slot="rightBox"
            :class="isPC ? 'rightBox' : 'rightBox_min'"
          >
            <span />
            <el-button
              v-if="baseInfoEdio.status === 10 || baseInfoEdio.status === 20"
              v-permission="['/v2/market-clue/detail/makeCall']"
              type="text"
              @click="callPhoneDio = true"
            >
              打电话
            </el-button>
            <el-button
              v-if="baseInfoEdio.status === 10 || baseInfoEdio.status === 20"
              v-permission="['/v2/market-clue/followClue']"
              type="text"
              @click="followUpDio = true"
            >
              添加线下跟进
            </el-button>
            <el-button
              v-if="(baseInfoEdio.status === 10 || baseInfoEdio.status === 20 || baseInfoEdio.status === 30) && Number(clueStatus) < 2 "
              v-permission="['/v2/market-clue/sendMessage']"
              type="text"
              @click="messageDio = true"
            >
              发送短信
            </el-button>
          </div>
          <div style="borderTop:1px solid #dfe6ec">
            <self-table
              ref="FollowUpTable"
              class="FollowUpTable"
              :is-p30="false"
              :stripe="false"
              :border="false"
              :operation-list="[]"
              :table-data="followUpLog.listData"
              :columns="followUpLog.columns"
              row-key="id"
              :index="false"
              style="overflow: initial;"
              max-height="520px"
            >
              <template v-slot:inviteDate="scope">
                {{ scope.row.inviteDate }}
              </template>
              <template v-slot:op="scope">
                <div class="FollowUpOpBox">
                  <el-button
                    v-permission="['/v2/market-clue/cancelInterview']"
                    :disabled="!(scope.row.inviteStatus === 1 && scope.row.operationType)"
                    type="text"
                    @click="handleInterviewClick(scope.row,1)"
                  >
                    取消面试
                  </el-button>
                  <el-button
                    v-permission="['/v2/market-clue/clueBreakAnAppointment']"
                    :disabled="!(scope.row.inviteStatus === 1 && scope.row.operationType)"
                    type="text"
                    @click="handleInterviewClick(scope.row,0)"
                  >
                    标记爽约
                  </el-button>
                </div>
              </template>
            </self-table>
            <span
              v-if="followUpLog.isMore"
              :class="isPC ? 'seeMore' : 'seeMore-m'"
              @click="showMore()"
            >查看更多</span>
          </div>
        </SectionContainer>
        <SectionContainer
          title="基本信息"
          :md="true"
        >
          <div
            slot="rightBox"
            class="rightBox"
          >
            <span
              v-permission="['/v2/market-clue/editClue']"
              @click="editDio = true"
            >编辑</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col
                v-for="(item,index) in infoBase"
                :key="index"
                :span="item.key === 'remark' ? 24 : 6"
              >
                <DetailItem
                  :name="item.name"
                  :value="item.value || ''"
                />
              </el-col>
            </el-row>
          </div>
        </SectionContainer>
        <SectionContainer
          title="其他信息"
          :md="true"
        >
          <el-row :gutter="20">
            <el-col
              v-for="(item,index) in columnsOther"
              :key="index"
              :span="6"
            >
              <DetailItem
                :name="item.label"
                :value="item.value"
              />
            </el-col>
          </el-row>
        </SectionContainer>
        <SectionContainer
          title="重复进入线索"
          :md="true"
        >
          <div style="borderTop:1px solid #dfe6ec">
            <self-table
              ref="RebackTable"
              class="RebackTable"
              :is-p30="false"
              :stripe="false"
              :border="false"
              :operation-list="[]"
              :table-data="backData"
              :columns="columnsBack"
              row-key="id"
              :index="false"
              style="overflow: initial;"
              max-height="520px"
            >
              <template v-slot:hasCar="scope">
                {{ scope.row.hasCar ? '是': '否' }}
              </template>
              <template v-slot:createDate="scope">
                {{ scope.row.createDate }}
              </template>
            </self-table>
          </div>
        </SectionContainer>
        <SectionContainer
          title="操作日志"
          :md="true"
        >
          <div>
            <self-table
              ref="LogTable"
              :show-header="false"
              :is-p30="false"
              :stripe="false"
              :operation-list="[]"
              :table-data="logData"
              :columns="columnsLog"
              row-key="id"
              :index="false"
              style="overflow: initial;"
              :style="logData.length ===0 ? 'margin-bottom: 30px;':''"
              :page="logPage"
              max-height="400px"
              @onPageSize="handlePageSize"
            />
          </div>
        </SectionContainer>
        <SectionContainer
          title="外呼日志"
          :md="true"
        >
          <CallLog
            class="CallLog"
            :business-id="+clueStatus"
          />
        </SectionContainer>
      </el-card>
    </div>
    <FollowUpDiolog
      :id="clueId"
      :show-dialog.sync="followUpDio"
      :clue-status="clueStatus"
    />
    <send-message
      :id="clueId"
      :show-dialog.sync="messageDio"
      :base-info="baseInfoEdio"
      :phone="baseInfoEdio.phone"
      :clue-status="+clueStatus"
    />

    <InfoEditDio
      :show-dialog.sync="editDio"
      :clue-status="+clueStatus"
      :base-info="baseInfoEdio"
    />

    <CallPhone
      :show-dialog.sync="callPhoneDio"
      :clue-status="+clueStatus"
      :phone="baseInfoEdio.phone"
      :clue-id="clueId"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import DetailItem from '@/components/DetailItem/index.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import CallLog from '@/components/OutboundDialog/CallLog.vue'
import {
  FollowUpDiolog,
  SendMessage,
  InfoEditDio,
  CallPhone
} from './components/index'
import {
  getClueWSXDetail,
  getClueLCXDetail,
  getClueLZXDetail,
  getClueDetailLogs,
  clueBreakAnAppointment,
  cancelInterview,
  getClueTypeList
} from '@/api/clue'
interface PageObj {
  page: number;
  limit: number;
  total?: number;
}

interface IState {
  [key: string]: any;
}

@Component({
  name: 'PrivateDetail',
  components: {
    DetailItem,
    SectionContainer,
    SelfTable,
    FollowUpDiolog,
    SendMessage,
    InfoEditDio,
    CallPhone,
    CallLog
  }
})
export default class extends Vue {
  private phone: string = ''
  private clueId: string = ''
  private clueStatus: string = '0';
  private followUpDio: boolean = false;
  private messageDio: boolean = false;
  private callPhoneDio: boolean = false;
  private editDio: boolean = false;
  private clueArray: IState[] = [];
  private clueArr: IState[] = [
    { name: '梧桐专车', code: '0' },
    { name: '梧桐共享', code: '1' },
    { name: '雷鸟车池', code: '2' },
    { name: '雷鸟租赁C', code: '3' },
    { name: '雷鸟租赁B', code: '4' }
  ];

  // 跟进表格表头定义
  private columsFollow: IState[] = [
    {
      key: 'followTypeName',
      label: '跟进方式'
    },
    {
      key: 'inviteStatusName',
      label: '邀约情况'
    },
    {
      key: 'inviteFailReasonName',
      label: '邀约失败原因'
    },
    {
      key: 'remark',
      label: '跟进备注',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'inviteDate',
      label: '邀约面试时间',
      slot: true
    },
    {
      key: 'inviteName',
      label: '邀约人'
    },
    {
      key: 'followDate',
      label: '跟进时间'
    },
    {
      key: 'op',
      label: '操作',
      fixed: 'right',
      slot: true,
      'min-width': this.isPC ? '200px' : '50px',
      width: '200px'
    }
  ];

  private columsFollowBridCar: IState[] = [
    {
      key: 'followTypeName',
      label: '跟进方式'
    },
    {
      key: 'markStatusName',
      label: '标记状态'
    },
    {
      key: 'demandTypeName',
      label: '需求类型'
    },
    {
      key: 'contact',
      label: '是否联系上'
    },
    {
      key: 'remark',
      label: '跟进备注',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'followerName',
      label: '跟进人'
    },
    {
      key: 'followDate',
      label: '跟进时间'
    }
  ];

  private columsFollowBridLease: IState[] = [
    {
      key: 'followTypeName',
      label: '跟进方式'
    },
    {
      key: 'markStatusName',
      label: '标记状态'
    },
    {
      key: 'intentCarTypeName',
      label: '意向车型'
    },
    {
      key: 'fancyCarTypeName',
      label: '看中车型'
    },
    {
      key: 'contact',
      label: '是否联系的上'
    },
    {
      key: 'remark',
      label: '跟进备注',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'followerName',
      label: '跟进人'
    },
    {
      key: 'followDate',
      label: '跟进时间'
    }
  ];

  // 跟进表格
  private followUpLogArr: IState[] = [
    { code: 0, listData: [], page: 1, columns: this.columsFollow },
    { code: 1, listData: [], page: 1, columns: this.columsFollow },
    { code: 2, listData: [], page: 1, columns: this.columsFollowBridCar },
    { code: 3, listData: [], page: 1, columns: this.columsFollowBridLease },
    { code: 4, listData: [], page: 1, columns: this.columsFollowBridLease }
  ];

  // 基本信息
  private infoBaseWT: IState[] = [
    { name: '姓名', key: 'name' },
    { name: '手机号', key: 'phone' },
    { name: '是否有车', key: 'hasCar' },
    { name: '货运经验', key: 'experience' },
    { name: '年龄', key: 'age' },
    { name: '现住址', key: 'address' },
    { name: '期望工作区域', key: 'intentWorkAddress' },
    { name: '当前职业', key: 'nowProfession' },
    { name: '状态', key: 'statusName' },
    { name: '线索ID', key: 'clueId' },
    { name: '线索类型', key: 'clueTypeName' },
    { name: '跟进人', key: 'followerName' },
    { name: '前跟进人', key: 'beforeFollowerName' },
    { name: '所属城市', key: 'cityName' },
    { name: '线索归属', key: 'clueAttributionName' },
    { name: '渠道', key: 'sourceChannelName' }
  ];

  private infoBaseBridCar: IState[] = [
    { name: '姓名', key: 'name' },
    { name: '手机号', key: 'phone' },
    { name: '需求类型', key: 'demandTypeName' },
    { name: '车型', key: 'carTypeName' },
    { name: '车辆所在城市', key: 'carCityName' },
    { name: '状态', key: 'statusName' },
    { name: '线索ID', key: 'clueId' },
    { name: '线索类型', key: 'clueTypeName' },
    { name: '跟进人', key: 'followerName' },
    { name: '前跟进人', key: 'beforeFollowerName' },
    { name: '线索归属', key: 'clueAttributionName' },
    { name: '渠道', key: 'sourceChannelName' },
    { name: '备注', key: 'remark' }
  ];

  private infoBaseLease: IState[] = [
    { name: '姓名', key: 'name' },
    { name: '手机号', key: 'phone' },
    { name: '意向车型', key: 'intentModelName' },
    { name: '看中车型', key: 'fancyModelName' },
    { name: '所在城市', key: 'cityName' },
    { name: '状态', key: 'statusName' },
    { name: '线索ID', key: 'clueId' },
    { name: '线索类型', key: 'clueTypeName' },
    { name: '跟进人', key: 'followerName' },
    { name: '前跟进人', key: 'beforeFollowerName' },
    { name: '线索归属', key: 'clueAttributionName' },
    { name: '渠道', key: 'sourceChannelName' },
    { name: '备注', key: 'remark' }
  ];

  // 重复进入线索记录表头
  private columnsBackWT: IState[] = [
    {
      key: 'name',
      label: '姓名'
    },
    {
      key: 'phone',
      label: '手机号'
    },
    {
      key: 'hasCar',
      label: '是否有车',
      slot: true
    },
    {
      key: 'cityName',
      label: '城市'
    },
    {
      key: 'sourceChannelName',
      label: '渠道'
    },
    {
      key: 'createName',
      label: '创建人'
    },
    {
      key: 'createDate',
      label: '创建时间'
    }
  ];

  private columnsBackBridCar: IState[] = [
    {
      key: 'name',
      label: '姓名'
    },
    {
      key: 'phone',
      label: '手机号'
    },
    {
      key: 'demandTypeName',
      label: '需求类型'
    },
    {
      key: 'carTypeName',
      label: '车型'
    },
    {
      key: 'remark',
      label: '备注',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'carCityName',
      label: '车辆所在城市'
    },
    {
      key: 'sourceChannelName',
      label: '渠道'
    },
    {
      key: 'createName',
      label: '创建人'
    },
    {
      key: 'createDate',
      label: '创建时间'
    }
  ];

  private columnsBackLease: IState[] = [
    {
      key: 'name',
      label: '姓名'
    },
    {
      key: 'phone',
      label: '手机号'
    },
    {
      key: 'intentModelName',
      label: '意向车型'
    },
    {
      key: 'cityName',
      label: '所在城市'
    },
    {
      key: 'remark',
      label: '备注',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'sourceChannelName',
      label: '渠道'
    },
    {
      key: 'createName',
      label: '创建人'
    },
    {
      key: 'createDate',
      label: '创建时间'
    }
  ];

  // 重复进入线索 数据
  private backData: IState[] = [];

  // 其他信息
  private otherInfoColumns: IState[] = [
    {
      key: 'inviteWord',
      label: '邀请语'
    },
    {
      key: 'interviewWord',
      label: '面试语'
    },
    {
      key: 'dropMaterials',
      label: '投发物料'
    },
    {
      key: 'landingPage',
      label: '落地页'
    }
  ];

  private columnsLog: IState[] = [
    {
      key: 'detail',
      label: '描述',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'createDate',
      label: '时间'
    }
  ];

  private logPage: PageObj = {
    page: 1,
    limit: 30,
    total: 10
  };

  private logData: IState[] = [];

  private baseInfoEdio: IState = {};

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  get followUpLog() {
    let stateItem = this.followUpLogArr[+this.clueStatus]
    let pageArr = this.group(stateItem.listData)
    let listData: any[] = []
    let index = 0
    if (pageArr.length !== 0) {
      while (index < stateItem.page) {
        listData = listData.concat(pageArr[index])
        index++
      }
      return {
        columns: stateItem.columns,
        listData: listData,
        isMore: listData < stateItem.listData
      }
    } else {
      return { columns: stateItem.columns, listData: [], isMore: false }
    }
  }

  get infoBase() {
    let arr: object[] = []
    if (Number(this.clueStatus) < 2) {
      arr = this.infoBaseWT
    } else if (Number(this.clueStatus) === 2) {
      arr = this.infoBaseBridCar
    } else {
      arr = this.infoBaseLease
    }

    let baseInfoArr = Object.entries(this.baseInfoEdio)
    baseInfoArr.forEach((ele: any) => {
      arr.forEach((item: any) => {
        if (item.key === 'intentWorkAddress') {
          item.value = (this.baseInfoEdio.expectAddressCityName && this.baseInfoEdio.expectAddressCountyName) ? (this.baseInfoEdio.expectAddressCityName || '' +
            this.baseInfoEdio.expectAddressCountyName || '') : ''
        }
        if (item.key !== undefined && ele[0] === item.key) {
          if (item.key === 'hasCar') {
            item.value =
              (ele[1] ? '有' + ';' + this.baseInfoEdio.carTypeName : '否')
          } else {
            item.value = ele[1]
          }
        }
      })
    })
    return arr
  }

  get columnsBack() {
    if (Number(this.clueStatus) < 2) {
      return this.columnsBackWT
    } else if (Number(this.clueStatus) === 2) {
      return this.columnsBackBridCar
    } else {
      return this.columnsBackLease
    }
  }

  get columnsOther() {
    if (Number(this.clueStatus) === 2) {
      let newArr = this.otherInfoColumns.slice(2)
      return newArr
    } else {
      return this.otherInfoColumns
    }
  }

  private showMore() {
    this.followUpLogArr[Number(this.clueStatus)].page++
  }

  private group(array: any[]) {
    let index = 0
    let newArray = []
    while (index < array.length) {
      newArray.push(array.slice(index, (index += 5)))
    }
    return newArray
  }

  private setOther(value: object) {
    let otherInfoArr = Object.entries(value)
    otherInfoArr.forEach((ele: any) => {
      this.otherInfoColumns.forEach((item: any) => {
        if (ele[0] === item.key) {
          item.value = ele[1]
        }
      })
    })
  }

  // tab切换
  private handleClick(tab: any, event: any) {
    this.clueId = this.clueArray[+this.clueStatus].clueId || ''
    this.getDetailApi()
    this.getDoLog()
  }

  private async getClueId(phone: string) {
    let params = { phone: phone }
    let { data: res } = await getClueTypeList(params)
    if (res.success) {
      this.clueArr.forEach(ele => {
        res.data.forEach((item:IState) => {
          if (+ele.code === item.clueType) {
            ele.clueId = item.clueId
          }
        })
      })
      this.clueArray = this.clueArr.filter((ele:any) => {
        return ele.clueId
      })
      this.clueArray.map((ele:any) => {
        if (ele.clueId === this.clueId) {
          this.clueStatus = String(ele.code)
        }
      })
    } else {
      this.$message.warning(res.errorMsg)
    }
  }

  // 取消面试
  async getCancel(followId:string) {
    try {
      let param = {
        followId,
        clueId: this.clueId
      }
      let { data: res } = await cancelInterview(param)
      if (res.success) {
        this.$message({
          type: 'success',
          message: '取消面试成功!'
        })
        this.getDetailApi()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 标记爽约
  async getAppointment(followId:string) {
    try {
      let param = {
        followId,
        clueId: this.clueId
      }
      let { data: res } = await clueBreakAnAppointment(param)
      if (res.success) {
        this.$message({
          type: 'success',
          message: '标记爽约成功!'
        })
        this.getDetailApi()
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  private handleInterviewClick(row: any, type: number) {
    console.log(row)
    if (type) {
      this.$confirm('是否取消面试?', `已邀约面试时间：${row.inviteDate}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'InterviewConfirm',
        type: 'warning'
      })
        .then(() => {
          this.getCancel(row.followId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    } else {
      this.$confirm('司机是否爽约?', `已邀约面试时间：${row.inviteDate}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'InterviewConfirm',
        type: 'warning'
      })
        .then(() => {
          this.getAppointment(row.followId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    }
  }

  // 分页
  private handlePageSize(page: PageObj) {
    this.logPage.page = page.page
    this.logPage.limit = page.limit
    this.getDoLog()
  }

  async getDetailApi() {
    try {
      if (Number(this.clueStatus) < 2) {
        let { data: res } = await getClueWSXDetail({ clueId: this.clueId })
        if (res.success) {
          let {
            marketClueWSXDetailBaseInfoVO,
            marketClueWSXDetailFollowInfoVOList,
            marketClueWSXDetailOtherInfoVO,
            marketClueWSXDetailRepeatedInfoVOList
          } = res.data
          this.followUpLogArr[
            (+this.clueStatus as number)
          ].listData = marketClueWSXDetailFollowInfoVOList
          this.baseInfoEdio = marketClueWSXDetailBaseInfoVO
          this.setOther(marketClueWSXDetailOtherInfoVO || [])
          this.backData = marketClueWSXDetailRepeatedInfoVOList
        } else {
          this.$message.warning(res.errorMsg)
        }
      } else if (Number(this.clueStatus) === 2) {
        let { data: res } = await getClueLCXDetail({ clueId: this.clueId })
        if (res.success) {
          let {
            marketClueLCXDetailBaseInfoVO,
            marketClueLCXDetailFollowInfoVOList,
            marketClueLCXDetailOtherInfoVO,
            marketClueLCXDetailRepeatedInfoVOList
          } = res.data
          this.followUpLogArr[
            (+this.clueStatus as number)
          ].listData = marketClueLCXDetailFollowInfoVOList
          this.baseInfoEdio = marketClueLCXDetailBaseInfoVO
          this.setOther(marketClueLCXDetailOtherInfoVO || [])
          this.backData = marketClueLCXDetailRepeatedInfoVOList
        } else {
          this.$message.warning(res.errorMsg)
        }
      } else {
        let { data: res } = await getClueLZXDetail({ clueId: this.clueId })
        if (res.success) {
          let {
            marketClueLZXDetailBaseInfoVO,
            marketClueLZXDetailFollowInfoVOList,
            marketClueLZXDetailOtherInfoVO,
            marketClueLZXDetailRepeatedInfoVOList
          } = res.data
          this.followUpLogArr[
            (+this.clueStatus as number)
          ].listData = marketClueLZXDetailFollowInfoVOList
          this.baseInfoEdio = marketClueLZXDetailBaseInfoVO
          this.setOther(marketClueLZXDetailOtherInfoVO || [])
          this.backData = marketClueLZXDetailRepeatedInfoVOList
        } else {
          this.$message.warning(res.errorMsg)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  async getDoLog() {
    try {
      let params: IState = { ...this.logPage }
      params.clueId = this.clueId
      let { data: res } = await getClueDetailLogs(params)
      if (res.success) {
        this.logData = res.data
        this.logPage = { ...res.page }
      } else {
        this.$message.warning(res.errorMsg)
      }
    } catch (err) {
      console.log(err)
    }
  }

  mounted() {
    this.phone = (this.$route as any).query.phone
    this.clueId = (this.$route as any).query.clueId
    this.getClueId(this.phone)
    this.getDetailApi()
    this.getDoLog()
  }
}
</script>
<style lang="scss" scoped>
.PrivateDetail {
  padding: 30px;
  box-sizing: border-box;
  .tabHeader {
    margin-bottom: 20px;
  }

  .detailContent {
    .rightBox_min {
      width: 170px;
      overflow-x: scroll;
      white-space: nowrap;
      span {
        color: #649cee;
        font-size: 12px;
        margin-right: 5px;
        cursor: pointer;
      }
    }
    .rightBox {
      span {
        color: #649cee;
        font-size: 14px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .followUp {
      .seeMore {
        display: block;
        color: rgb(138, 133, 133);
        font-size: 12px;
        cursor: pointer;
        text-align: right;
        margin-top: 15px;
      }
      .seeMore-m {
        display: block;
        color: rgb(138, 133, 133);
        font-size: 12px;
        cursor: pointer;
        text-align: right;
        margin: 10px 0;
      }
    }
    .CallLog {
      padding: 0;
    }
  }
  .detailContent .rightBox span:last-child {
    margin: 0;
  }
}
.tabHeader ::v-deep .el-card__body {
  padding-top: 15px;
  padding-bottom: 0px !important;
}
.tabHeader ::v-deep .el-tabs__header {
  margin: 0px !important;
}
.tabHeader ::v-deep .el-tabs__active-bar {
  height: 3.5px !important;
}

.InterviewConfirm ::v-deep .el-message-box__header {
  background-color: antiquewhite !important;
}
.detailContent ::v-deep .SectionContainer,
.detailContent ::v-deep .SectionContainer-m,
.detailContent ::v-deep .callLog1 {
  box-shadow: none;
  margin-bottom: 0px;
}
.detailContent ::v-deep .el-table th {
  background-color: white;
  color: #979b9e;
  font-weight: normal;
}
</style>
