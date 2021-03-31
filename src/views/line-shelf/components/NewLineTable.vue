<template>
  <div class="Complete">
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      label-width="120px"
      size="small"
    >
      <div
        slot="btn1"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          type="primary"
          :class="isPC ? '' : 'btnMobile'"
          name="driverlist_query_btn"
          size="small"
          @click="handleQueryClick"
        >
          查询
        </el-button>
      </div>
      <div
        slot="checkStatus"
        class="tableTitle"
      >
        <div class="statusBox">
          <div class="btnBox">
            <el-badge
              v-for="(item, index) in status"
              :key="index"
              :value="index === active ? item.num : ''"
              class="item"
            >
              <el-button
                size="small"
                :type="index === active ? 'primary' : 'default'"
                @click="changeStatus(item, index)"
              >
                {{ item.label }}
              </el-button>
            </el-badge>
          </div>
        </div>
      </div>
    </self-form>
    <div class="table_box">
      <self-table
        v-loading="listLoading"
        :operation-list="[]"
        :index="false"
        :columns="columns"
        :table-data="tableData"
        :page="page"
        @onPageSize="handlePageSize"
      >
        <template v-slot:lineName="scope">
          <span
            style="color:#649CEE"
            @click="goLineDteails(scope.row.projectId)"
          >{{ scope.row.lineName }}</span>
        </template>
        <template v-slot:lineSnapshotFlag="scope">
          <span
            style="color:#649CEE"
            @click="goLineSnapshot(scope.row.lineSnapshotId)"
          >{{ scope.row.lineName }}</span>
        </template>

        <template v-slot:inspectionStatus="scope">
          <span v-if="scope.row.inspectionStatus!==3"> 检查通过</span>
          <span v-else> 检查不通过</span>
        </template>

        <template v-slot:rejectionReasonsTypeName="scope">
          <span v-if="scope.row.inspectionStatus!==3" />
          <span v-else> {{ scope.row.rejectionReasonsTypeName }}</span>
        </template>
        <template v-slot:rejectionReasons="scope">
          <span v-if="scope.row.inspectionStatus!==3" />
          <el-tooltip
            v-else
            placement="top"
          >
            <div slot="content">
              {{ scope.row.rejectionReasons }}
            </div>
            <div class="remarks">
              {{ scope.row.rejectionReasons }}
            </div>
          </el-tooltip>
        </template>
      </self-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import { SettingsModule } from '@/store/modules/settings'
import { HandlePages, phoneReg, lock } from '@/utils/index'
import { getFinishedLine } from '@/api/line-shelf'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Complete',
  components: {
    SelfForm,
    SelfTable
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) private formItem!: any[];
  @Prop({ default: () => [] }) private columns!: any[];
  @Prop({ default: () => {} }) private page!: IState;
  private listLoading: boolean = false;
  private active: number = 0;
  private tableData: any[] = [];
  // 检查状态按钮
  private status: any[] = [
    { label: '全部', value: '4', num: '' },
    { label: '检查通过', value: 2, num: '' },
    { label: '检查不通过', value: 3, num: '' }
  ];

    private listQuery: IState = {
      agentId: '', // 待办ID
      lineName: '', // 线路名称
      agencyTime: [],
      result: '',
      checkStatus: '',
      checkStatus1: '' //  冗余线路检查按钮状态

    }
    //  原因下拉框数据
    // 分页页数
    //  按钮状态改变时
    private changeStatus(item: any, index: number) {
      this.active = index
      this.listQuery.checkStatus = item.value
      this.getList()
    }

    get isPC() {
      return SettingsModule.isPC
    }

    /**
   * 查询
   */

    private handleQueryClick() {
      this.getList()
    }
    // 获取新线维护列表
    async getList() {
      this.listLoading = true
      try {
        let params: any = {
          limit: this.page.limit,
          page: this.page.page,
          inspectionStatus: 4
        }
        if (this.listQuery.agencyTime && this.listQuery.agencyTime.length > 1) {
          params.startDate = new Date(this.listQuery.agencyTime[0]).setHours(0, 0, 0)
          params.endDate = new Date(this.listQuery.agencyTime[1]).setHours(23, 59, 59)
        }
        this.listQuery.agentId !== '' && (params.agentId = this.listQuery.agentId)
        this.listQuery.lineId !== '' && (params.key = this.listQuery.lineId)
        this.listQuery.checkStatus !== '' && (params.inspectionStatus = this.listQuery.checkStatus)
        this.listQuery.result !== '' && (params.rejectionReasons = this.listQuery.result)
        let { data: res } = await getFinishedLine(params)

        if (res.success) {
          this.listLoading = false
          this.tableData = res.data
          this.status[0].num = res.title.all >= 999 ? '999+' : res.title.all
          this.status[1].num = res.title.passedNum >= 999 ? '999+' : res.title.all
          this.status[2].num = res.title.failedNum >= 999 ? '999+' : res.title.all
        } else {
          this.$message.error('出错逻辑  tab详情页接口问题')
        }
      } catch (err) {
        console.log(`get lists fail:`, err)
      }
    }
    // 页数更改
    handlePageSize(page: any) {
      this.page.page = page.page
      this.page.limit = page.limit
      this.getList()
    }

    private goLineDteails(id: string) {
      this.$router.push({
        path: '/lineshelf/linedetail',
        query: { id: id }
      })
    }

    private goLineSnapshot(id: string) {
      this.$router.push({
        path: '/lineshelf/lineSnapshot',
        query: { id: id }
      })
    }

    mounted() {
      this.getList()
    }
}
</script>

<style lang="scss" scoped>
.tableTitle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .el-badge {
    margin-right: 10px;
  }

  .statusBox {
    display: flex;
    align-items: center;
    .btnBox {
      display: flex;
      align-items: center;
    }
  }
}
</style>

<style lang="scss" scoped>
.Complete {
  .table_box {
    padding: 10px 30px;
    background: #ffffff;
    -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    overflow: hidden;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  min-width: 800px;
  .tableTitle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    .el-badge {
      margin-right: 10px;
    }
    .statusBox {
      display: flex;
      align-items: center;
      .btnBox {
        display: flex;
        align-items: center;
      }
    }
  }
  .mobile {
    width: 100%;
    text-align: center;
  }
  .btnMobile {
    margin-left: 0;
    margin-top: 10px;
    width: 80%;
  }
  .btnPc {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .remarks {
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
</style>

<style scoped>
.Complete >>> .selfForm {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  box-shadow: 4px 4px 10px 0 hsl(0deg 0% 86% / 50%);
}
.Complete >>> .el-form-item__label {
  color: #999;
}
.Complete {
  color: #649cee;
  margin: 0 5px;
  cursor: pointer;
}

@media screen and (min-width: 700px) {
  .Complete >>> .el-collapse-item__wrap {
    position: absolute;
    z-index: 1000;
    background: #fff;
    box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.85);
    right: 15px;
    left: 15px;
  }
  .Complete >>> .el-collapse-item__content {
    padding-bottom: 0px;
  }
  .Complete >>> .selfTable {
    padding: 0px !important;
  }
  .Complete >>> .el-badge__content {
    z-index: 1000;
  }
}
</style>

<style>
@media screen and (max-width: 700px) {
  .el-message-box__wrapper {
    top: 0 !important;
    left: 5% !important;
    right: 5% !important;
  }
  .el-message-box {
    width: 100%;
  }
}
</style>
