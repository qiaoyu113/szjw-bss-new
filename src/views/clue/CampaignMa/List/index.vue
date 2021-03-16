<template>
  <div
    v-loading="listLoading"
    class="CampaignListContainer"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="140px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <div
        slot="clueType"
        :class="isPC ? 'btnPc left' : 'mobile'"
      >
        <el-radio-group
          v-model="listQuery.clueType"
          size="small"
          @click="getLists"
        >
          <el-radio-button
            v-for="item in busiTypeArrs"
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
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          @click="handleAddClick"
        >
          新建Campaign
        </el-button>
        <!-- v-permission="[]" -->
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          :disabled="times === 10 ? false :true"
          @click="_exportFile"
        >
          导出<template v-if="times !== 10">
            {{ times }} s
          </template>
        </el-button>
      </div>
    </self-form>
    <!-- 表格 -->
    <div
      class="table_box"
    >
      <self-table
        :index="false"
        :is-p30="false"
        :operation-list="[]"
        :table-data="tableData"
        :style="tableData.length ===0 ? 'margin-bottom: 30px;':''"
        :columns="columns"
        :default-sort="{prop: 'createDate', order: 'descending'}"
        :page="page"
        @sort-change="handleSortChange"
        @onPageSize="handlePageSize"
      >
        <template v-slot:userGroupId="{row}">
          <template v-if="row.userGroupId || row.busiTypeName || row.groupType">
            {{ row.userGroupId }}/{{ row.busiTypeName }}/{{ row.groupType }}
          </template>
          <template v-else>
            暂无数据
          </template>
        </template>
        <template v-slot:op="scope">
          <el-button
            type="text"
            size="small"
            @click="handleDetailClick(scope.row)"
          >
            详情
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleImportClick(scope.row)"
          >
            导入线索
          </el-button>
        </template>
      </self-table>
    </div>
    <!-- 新建Campaign -->
    <SelfDialog
      :visible.sync="showDialog"
      title="新建Campaign"
      :confirm="confirm"
      width="500px"
      :destroy-on-close="false"
      @closed="handleDialogClosed"
    >
      <AddCampaign
        ref="addCampaign"
        :region-list="regionList"
        :add-userlist="addUserGroup"
        :city-list="cityList"
        :city-detail="cityDetail"
        :platform-list="platformList"
        @onPass="handlePass"
      />
    </SelfDialog>
    <!-- 导入线索 -->
    <SelfDialog
      :visible.sync="showDialog1"
      title="导入线索"
      :confirm="confirm1"
      width="500px"
      :destroy-on-close="false"
      @closed="handleDialogClosed1"
    >
      <ImportClue
        ref="importClue"
        :busi-type="busiType"
        @onPass="handlePass1"
      />
    </SelfDialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { exportFileTip } from '@/utils/exportTip'
import { HandlePages, lock } from '@/utils/index'
import AddCampaign from './components/addCampaign.vue'
import ImportClue from './components/impotClue.vue'
import { delayTime } from '@/settings'
import {
  today,
  yesterday,
  sevenday,
  thirtyday
} from '../../../driver-freight/components/date'
import { getOfficeByType, getOfficeByTypeAndOfficeId, GetDictionary } from '@/api/common'
import { GetClueCampaignList, FirmianaExport, ThunderBirdRentalExport, ThunderBirdTruckPoolExport, AddCampaign as AddCampaignApi, FirmianaImport, ThunderBirdRentalImport, ThunderBirdTruckPoolImport, GetUserGroupSelectList, GetLaunchPlatformList } from '@/api/clue'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}

interface IState {
  [key: string]: any;
}
@Component({
  name: 'CampaignList',
  components: {
    SelfForm,
    SelfTable,
    SelfDialog,
    AddCampaign,
    ImportClue
  }
})
export default class extends Vue {
  times:number = 10;
  private busiType:number|string = ''
  private regionList:IState[] = []; // 区域列表
  private cityList:IState[] = []; // 城市列表
  private platformList:IState[] = []; // 平台列表
  private listLoading:boolean = false;
  private listQuery:IState = {
    clueType: 0,
    userGroupId: '',
    areCity: '',
    cityCode: '',
    launchPlatform: '',
    dropTime: [],
    time: [],
    sort: 'desc' // 1: 降序(desc),0:升序(asc)
  }
  private userGroupOptions:IState[] = []; // 客群细分id
  private addUserGroup:IState[] = []; // 新增客群细分id
  // 新建Campaign
  private showDialog:boolean = false;
  // 导入线索
  private showDialog1:boolean = false;
  // 业务类型列表
  private busiTypeArrs:any[] = [
    {
      label: '梧桐专车',
      value: 0
    },
    {
      label: '梧桐共享',
      value: 1
    },
    {
      label: '雷鸟车池',
      value: 2
    },
    {
      label: '雷鸟租赁',
      value: 3
    }
  ]
  private formItem:any[] = [
    {
      type: 'clueType',
      key: 'clueType',
      label: '',
      w: '0px',
      col: 24,
      slot: true
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请输入客群细分ID',
        clearable: true
      },
      label: '客群细分ID',
      key: 'userGroupId',
      options: this.userGroupOptions
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属区域',
      key: 'areCity',
      options: this.regionList,
      listeners: {
        'change': () => {
          this.cityDetail(this.listQuery.areCity)
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
      label: '城市',
      key: 'cityCode',
      options: this.cityList
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '投放平台',
      key: 'launchPlatform',
      options: this.platformList
    },
    {
      type: 3,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [today, yesterday, sevenday, thirtyday]
        }
      },
      label: '投放时间',
      key: 'dropTime'
    },
    {
      type: 3,
      col: 10,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        'default-time': ['00:00:00', '23:59:59'],
        pickerOptions: {
          shortcuts: [today, yesterday, sevenday, thirtyday]
        }
      },
      label: '创建时间',
      key: 'time'
    },
    {
      type: 'btnGroup',
      col: 14,
      slot: true,
      w: '0px'
    }
  ]
  private tableData:any[] = []
  private columns:IState[] = [
    {
      key: 'campaignId',
      label: 'Campaign ID',
      'width': '110px'
    },
    {
      key: 'userGroupId',
      label: '客群细分ID/业务线/客群类型',
      'width': '220px',
      slot: true
    },
    {
      key: 'regionName',
      label: '所属区域',
      'width': '80px'
    },
    {
      key: 'cityName',
      label: '城市',
      'width': '100px'
    },
    {
      key: 'deliveryPlatform',
      label: '投放平台',
      'width': '100px'
    },
    {
      key: 'putMaterials',
      label: '投放物料',
      'width': '140px'
    },
    {
      key: 'putStartDate',
      label: '投放起始时间',
      'width': '160px'
    },
    {
      key: 'putEndDate',
      label: '投放终止时间',
      'width': '160px'
    },
    {
      key: 'landingPage',
      label: '落地页',
      'width': '180px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'appeal',
      label: '诉求',
      'width': '140px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'budget',
      label: '预算 (元)',
      'width': '80px'
    },
    {
      key: 'remarks',
      label: '备注',
      'width': '200px',
      attrs: {
        'show-overflow-tooltip': true
      }
    },
    {
      key: 'createUserName',
      label: '创建人',
      'width': '100px'
    },
    {
      key: 'createDate',
      label: '创建时间',
      'width': '160px',
      attrs: {
        sortable: 'custom'
      }
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      width: '150px',
      fixed: 'right'
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
    this.getLists()
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      clueType: 1,
      userGroupId: '',
      areCity: '',
      cityCode: '',
      launchPlatformCoe: '',
      dropTime: [],
      time: [],
      sort: 1
    }
  }
  // 新建Campaign
  handleAddClick() {
    if (this.addUserGroup.length === 0) {
      this.getUserGroupSelectList('')
    }
    this.showDialog = true
  }
  // 导出
  _exportFile() {
    exportFileTip(this, this.handleExportClick)
  }
  @lock
  async handleExportClick(sucFun:Function) {
    try {
      // 梧桐专车(1)、梧桐共享(2)、雷鸟车池(3)、雷鸟租赁(4)
      let obj:IState = {
        0: FirmianaExport,
        1: FirmianaExport,
        2: ThunderBirdTruckPoolExport,
        3: ThunderBirdRentalExport
      }
      let params:IState = this.generateParams()
      let { data: res } = await obj[this.listQuery.clueType](params)
      if (res.success) {
        sucFun()
        this.$message.success('操作成功')
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`export fail:${err}`)
    } finally {
      //
    }
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getLists()
  }
  // 组装获取列表和导出的条件
  generateParams() {
    let obj:IState = {
      sort: this.listQuery.sort
    }
    this.listQuery.clueType !== '' && (obj.clueType = +this.listQuery.clueType)
    this.listQuery.userGroupId && (obj.userGroupId = +this.listQuery.userGroupId)
    this.listQuery.areCity && (obj.areCity = +this.listQuery.areCity)
    this.listQuery.cityCode && (obj.cityCode = +this.listQuery.cityCode)
    this.listQuery.launchPlatform !== '' && (obj.launchPlatform = this.listQuery.launchPlatform)
    if (this.listQuery.dropTime && this.listQuery.dropTime.length > 0) {
      obj.dropStarTime = new Date(this.listQuery.dropTime[0]).setHours(0, 0, 0)
      obj.dropEndTime = new Date(this.listQuery.dropTime[1]).setHours(23, 59, 59)
    }
    if (this.listQuery.time && this.listQuery.time.length > 0) {
      obj.startDate = new Date(this.listQuery.time[0]).setHours(0, 0, 0)
      obj.endDate = new Date(this.listQuery.time[1]).setHours(23, 59, 59)
    }
    return obj
  }
  // 获取列表
  @lock
  async getLists() {
    try {
      let obj:IState = this.generateParams()
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit,
        ...obj
      }
      this.listLoading = true
      let { data: res } = await GetClueCampaignList(params)
      if (res.success) {
        this.tableData = res.data
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 详情
  handleDetailClick(row:IState) {
    this.$router.push({
      path: '/clue/campaignDetail',
      query: {
        campaignId: row.campaignId,
        busiType: row.busiType
      }
    })
  }
  // 导入线索
  handleImportClick(row:IState) {
    this.busiType = row.busiType
    this.showDialog1 = true
  }
  // 新建 确定按钮
  confirm() {
    ((this.$refs.addCampaign) as any).handleValidateForm()
  }
  // 新建 关闭弹框后
  handleDialogClosed() {
    ((this.$refs.addCampaign) as any).resetForm()
  }
  // 新建Campaign
  @lock
  async handlePass(params:IState) {
    try {
      let { data: res } = await AddCampaignApi(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.showDialog = true
        setTimeout(() => {
          this.getLists()
        }, delayTime)
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`add form fail:${err}`)
    } finally {
      //
    }
    console.log('pass')
    this.showDialog = false
  }
  // 导入线索 确定按钮
  confirm1() {
    ((this.$refs.importClue) as any).handlePass()
  }
  // 导入线索 关闭弹框后
  handleDialogClosed1() {
    ((this.$refs.importClue) as any).handleResetFile()
  }
  // 上传excel
  async handlePass1(formData:FormData) {
    try {
      // 梧桐专车(1)、梧桐共享(2)、雷鸟车池(3)、雷鸟租赁(4)
      let obj:IState = {
        1: FirmianaImport,
        2: FirmianaImport,
        3: ThunderBirdTruckPoolImport,
        4: ThunderBirdRentalImport
      }
      let { data: res } = await obj[this.listQuery.clueType](formData)
      if (res.success) {
        this.$message.success('操作成功')
        this.showDialog1 = false
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`upload file fail:${err}`)
    } finally {
      //
    }
  }
  // 获取大区列表
  private async areaAddress() {
    try {
      let params:IState = { type: 2 }
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name
          }
        })
        this.regionList.push(...nodes)
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  // 根据大区获取城市列表
  async cityDetail(parentId:number) {
    let len = this.cityList.length
    if (len > 0) {
      this.cityList.splice(0, len)
    }
    this.listQuery.cityCode = ''
    let params:IState = {
      parentId
    }
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name
        }
      })
      this.cityList.push(...nodes)
    }
  }
  // 查询投放平台
  private async getDictionaryContract() {
    const { data } = await GetLaunchPlatformList()
    if (data.success) {
      let result:IState[] = data.data.map((item:IState) => ({
        label: item.launchPlatform,
        value: item.launchPlatform
      }))
      this.platformList.push(...result)
    } else {
      this.$message.error(data.message)
    }
  }
  // 根据创建时间排序
  handleSortChange(row:IState) {
    if (row.order === null) {
      this.listQuery.sort === 0 ? row.order = 'ascending' : row.order = 'descending'
    }
    if (row.order === 'ascending') { // 降序
      this.listQuery.sort = 'desc'
    } else {
      this.listQuery.sort = 'asc'
    }
    this.getLists()
  }
  // 获取客群id
  async getUserGroupSelectList(clueType:number|string) {
    try {
      let params:IState = {}
      if (clueType !== '') {
        params.clueType = clueType
      }
      let { data: res } = await GetUserGroupSelectList(params)
      if (res.success) {
        let result:IState[] = res.data.map((item:IState) => ({
          label: item.label,
          value: item.groupId
        }))
        if (clueType !== '') {
          this.userGroupOptions.push(...result)
        } else {
          this.addUserGroup.push(...result)
        }
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`get user groupId fail:${err}`)
    }
  }
  // 初始化公共列表
  init() {
    this.areaAddress()
    this.getDictionaryContract()
    this.getUserGroupSelectList(this.listQuery.clueType)
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
  .CampaignListContainer {
    .btnPc {
       width: 100%;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
       &.left {
         margin-left: 60px;
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
    .text {
      margin:0px;
    }
    .wordWrap {
      word-break: break-all;
    }
    .ellipsis {
      width:140px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
