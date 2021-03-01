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
        slot="busiType"
        :class="isPC ? 'btnPc left' : 'mobile'"
      >
        <el-radio-group
          v-model="listQuery.type"
          size="small"
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
        :page="page"
        @onPageSize="handlePageSize"
      >
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
        :city-list="cityList"
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
import {
  today,
  yesterday,
  sevenday,
  thirtyday
} from '../../../driver-freight/components/date'
import { getOfficeByType, getOfficeByTypeAndOfficeId, GetDictionary } from '@/api/common'
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
  private regionList:IState[] = []; // 区域列表
  private cityList:IState[] = []; // 城市列表
  private platformList:IState[] = []; // 平台列表
  private listLoading:boolean = false;
  private listQuery:IState = {
    type: 1,
    b: '',
    c: ''
  }
  // 新建Campaign
  private showDialog:boolean = false;
  // 导入线索
  private showDialog1:boolean = false;
  // 业务类型列表
  private busiTypeArrs:any[] = [
    {
      label: '梧桐专车',
      value: 1
    },
    {
      label: '梧桐共享',
      value: 2
    },
    {
      label: '雷鸟车池',
      value: 3
    },
    {
      label: '雷鸟租赁',
      value: 4
    }
  ]
  private formItem:any[] = [
    {
      type: 'busiType',
      key: 'busiType',
      label: '',
      w: '0px',
      col: 24,
      slot: true
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入客群细分ID',
        clearable: true,
        maxlength: 10
      },
      label: '客群细分ID',
      key: 'a'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '所属区域',
      key: 'b',
      options: this.regionList,
      listeners: {
        'change': this.cityDetail
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
      key: 'c',
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
      key: 'd',
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
      key: 'time'
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
      key: 'time1'
    },
    {
      type: 'btnGroup',
      col: 14,
      slot: true,
      w: '0px'
    }
  ]
  private tableData:any[] = [{}]
  private columns:IState[] = [
    {
      key: 'a',
      label: 'Campaign ID',
      'width': '140px'
    },
    {
      key: 'b',
      label: '客群细分ID/业务线/客群类型',
      'width': '220px',
      slot: true
    },
    {
      key: 'c',
      label: '所属区域',
      'width': '140px'
    },
    {
      key: 'd',
      label: '城市',
      'width': '140px'
    },
    {
      key: 'e',
      label: '投放平台',
      'width': '140px'
    },
    {
      key: 'f',
      label: '投放物料',
      'width': '140px'
    },
    {
      key: 'g',
      label: '投放起始时间',
      'width': '120px'
    },
    {
      key: 'h',
      label: '投放终止时间',
      'width': '120px'
    },
    {
      key: 'i',
      label: '落地页',
      'width': '180px'
    },
    {
      key: 'j',
      label: '诉求',
      'width': '140px'
    },
    {
      key: 'k',
      label: '预算 (元)',
      'width': '140px'
    },
    {
      key: 'remark',
      label: '备注',
      'width': '200px'
    },
    {
      key: 'created',
      label: '创建人',
      'width': '140px'
    },
    {
      key: 'createTime',
      label: '创建时间',
      'width': '140px'
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
    total: 100
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 查询
  handleFilterClick() {

  }
  // 重置
  handleResetClick() {

  }
  // 新建Campaign
  handleAddClick() {
    this.showDialog = true
  }
  // 导出
  _exportFile() {
    exportFileTip(this, this.handleExportClick)
  }
  @lock
  async handleExportClick(sucFun:Function) {
    try {
      let { data: res } = await { data: {
        success: true,
        message: ''
      }
      }
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
  // 获取列表
  @lock
  async getLists() {
    try {
      this.listLoading = true
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 详情
  handleDetailClick(row:IState) {
    this.$router.push({
      path: '/driverClond/campaignDetail',
      query: {
        id: row.id
      }
    })
  }
  // 导入线索
  handleImportClick(row:IState) {
    this.showDialog1 = true
  }
  // 新建 确定按钮
  confirm() {
    ((this.$refs.addCampaign) as any).handleValidateForm()
  }
  // 新建 关闭弹框后
  handleDialogClosed() {

  }
  // 验证通过
  handlePass() {
    //
    console.log('pass')
    this.showDialog = false
  }
  // 导入线索 确定按钮
  confirm1() {
    ((this.$refs.importClue) as any).handleValidateForm()
  }
  // 导入线索 关闭弹框后
  handleDialogClosed1() {

  }
  // 导入验证通过
  handlePass1() {
    //
    console.log('pass')
    this.showDialog1 = false
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
  private async cityDetail() {
    let len = this.cityList.length
    if (len > 0) {
      this.cityList.splice(0, len)
    }
    this.listQuery.c = ''
    let params:IState = {
      parentId: this.listQuery.b
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
    const { data } = await GetDictionary({ dictType: 'busi_type' })
    if (data.success) {
      // this.optionsBusi = data.data
    } else {
      this.$message.error(data)
    }
  }

  init() {
    this.areaAddress()
  }
  mounted() {
    this.init()
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
