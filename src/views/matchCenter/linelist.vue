<template>
  <div
    v-loading="listLoading"
    class="LineList"
    :class="{
      p15: isPC
    }"
  >
    <div class="box">
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
        size="small"
        label-width="110px"
        class="p15 SuggestForm"
        :pc-col="6"
      >
        <template slot="customerStatus">
          <el-badge
            v-for="item in btns"
            :key="item.text"
          >
            <el-button
              type="primary"
              margin-right="20px"
              :plain="item.name !== listQuery.customerStatus"
              @click="() => {
                listQuery.customerStatus = item.name
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
          <div>
            <el-button>
              批量发起客邀
            </el-button>
            <el-button>
              批量取消客邀
            </el-button>
          </div>
          <el-button
            type="primary"
            :class="isPC ? '' : 'btnMobile'"
            @click="handleFilterClick"
          >
            查询
          </el-button>
          <el-button
            :class="isPC ? '' : 'btnMobile'"
            @click="handleResetClick"
          >
            重置
          </el-button>
        </div>
      </self-form>
      <div class="table_box">
        <div class="middle" />
        <self-table
          ref="RefundForm"
          :index="listQuery.status === '3'"
          :is-p30="false"
          :operation-list="[]"
          :table-data="tableData"
          :columns="columns"
          row-key="id"
          :page="page"
          @onPageSize="handlePageSize"
          @selection-change="handleSelectionChange"
        >
          <template v-slot:op="scope">
            <el-button
              type="text"
              size="small"
              @click="handleClick(scope.row)"
            >
              发起客邀
            </el-button>
            <el-button
              type="text"
              size="small"
            >
              取消客邀
            </el-button>
            <el-button
              type="text"
              size="small"
            >
              查看详情
            </el-button>
          </template>
        </self-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
interface PageObj {
  page:number,
  limit:number,
  total?:number
}
interface IState {
  [key: string]: any;
}
@Component({
  name: 'LineList',
  components: {
    SelfTable,
    SelfForm
  }
})
export default class extends Vue {
  private listLoading:boolean = false;
  private multipleSelection: any[] = []
  private tableData:any[] = [];
  private listQuery:IState = {
    workCity: [],
    carType: '',
    lineFineness: '',
    handlingDifficulty: '',
    freightSection: '',
    workTime: '',
    warehouseLocation: '',
    distributionArea: '',
    stabilityTemporary: '',
    lineName: '',
    Status: ''
  }
  private formItem:any[] = [
    {
      type: 8,
      key: 'workCity',
      label: '城市',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'carType',
      label: '车型',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'lineFineness',
      label: '线路肥瘦',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'handlingDifficulty',
      label: '装卸难度',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'freightSection',
      label: '单趟运费区间',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'workTime',
      label: '工作时间段',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'warehouseLocation',
      label: '仓库位置',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'distributionArea',
      label: '配送区域',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'stabilityTemporary',
      label: '稳定/临时',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      type: 8,
      key: 'lineName',
      label: '线路名称/编号',
      tagAttrs: {
        placeholder: '请选择',
        clearable: true
      }
    },
    {
      col: 14,
      label: '客邀状态',
      type: 'customerStatus',
      slot: true
    },
    {
      type: 'mulBtn',
      col: 10,
      slot: true,
      w: '0px'
    }
  ]
  private btns:any[] = [
    {
      name: '',
      text: '全部'
    },
    {
      name: '1',
      text: '未发起客邀'
    },
    {
      name: '3',
      text: '已发起客邀'
    },
    {
      name: '4',
      text: '客邀成功'
    },
    {
      name: '2',
      text: '司推成功'
    },
    {
      name: '5',
      text: '无法发起客邀'
    }
  ]
  private columns:any[] = [

  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  private page :PageObj= {
    page: 1,
    limit: 30,
    total: 0
  }
  // 分页
  handlePageSize(page:PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
  }
  handleSelectionChange(val:any) {
    // console.log(val)
    this.multipleSelection = val
  }
  // 查询
  handleFilterClick() {
  }
  // 重置
  handleResetClick() {
    this.listQuery = {
      workCity: [],
      carType: '',
      lineFineness: '',
      handlingDifficulty: '',
      freightSection: '',
      workTime: [],
      warehouseLocation: '',
      distributionArea: '',
      stabilityTemporary: '',
      lineName: '',
      Status: ''
    }
  }
  // 发起客邀
  private handleClick(row:IState) {
  }
}
</script>

<style lang="scss" scoped>
.LineList {
  .rejectBox{
      display: flex;
      align-items: center;
    }
    min-width: 860px;
  .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .el-button{
      margin-right: 8px;
    }
    .btnPc{
       width: 100%;
       padding: 0 10px;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
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
    .table_box {
      padding: 0px 20px 20px 20px;
      background: #ffffff;
      -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
}
</style>
