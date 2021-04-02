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
            @click="goLineDteails(scope.row.lineId)"
          >{{ scope.row.lineName }}</span>
        </template>

        <template v-slot:agentStatus="scope">
          <span v-if="scope.row.agentStatus===1"> 已下架</span>
          <span v-if="scope.row.agentStatus===2"> 忽略</span>
          <span v-else />
        </template>

        <template v-slot:shelvesReasons="scope">
          <span v-if="scope.row.agentStatus!==1" />
          <el-tooltip
            v-else
            placement="top"
          >
            <div slot="content">
              {{ scope.row.shelvesReasons }}
            </div>
            <div class="ellipsis">
              {{ scope.row.shelvesReasons }}
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
import { getFinishedMoreLine } from '@/api/line-shelf'
import { getLanguage } from '@/utils/cookies'
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
  private tableData: any[] = [];
  private active: number = 0;
   private status: any[] = [
     { label: '全部', value: 3, num: '' },
     { label: '已下架', value: 1, num: '' },
     { label: '忽略', value: 2, num: '' }
   ];
  private listQuery: IState = {
    agentId: '', // 待办ID
    lineName: '', // 线路名称
    agencyTime: [],
    checkStatus: ''
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
        processingStatus: 2
      }
      if (this.listQuery.agencyTime && this.listQuery.agencyTime.length > 1) {
        params.startUpdateDate = new Date(this.listQuery.agencyTime[0]).setHours(0, 0, 0)
        params.endUpdateDate = new Date(this.listQuery.agencyTime[1]).setHours(23, 59, 59)
      }
      this.listQuery.agentId !== '' && (params.agentId = this.listQuery.agentId)
      this.listQuery.lineName !== '' && (params.key = this.listQuery.lineName)
      this.listQuery.checkStatus !== '' && (params.agentStatus = this.listQuery.checkStatus)
      let { data: res } = await getFinishedMoreLine(params)
      if (res.success) {
        this.page.total = res.page.total
        this.listLoading = false
        this.tableData = res.data
        this.status[0].num = res.page.total >= 999 ? '999+' : res.page.total
        this.status[1].num = res.page.total >= 999 ? '999+' : res.page.total
        this.status[2].num = res.page.total >= 999 ? '999+' : res.page.total
      } else {
        this.$message.error('数据无法访问')
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
  .ellipsis {
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
