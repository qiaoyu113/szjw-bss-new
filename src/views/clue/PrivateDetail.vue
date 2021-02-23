<template>
  <div class="PrivateDetail">
    <div class="tabHeader">
      <el-card class="box-card">
        <template>
          <el-tabs
            v-model="clueStatus"
            @tab-click="handleClick"
          >
            <el-tab-pane
              v-for="(item,index) in clueArr"
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
            <span>打电话</span>
            <span @click="followUpDio = true">添加线下跟进</span>
            <span @click="messageDio = true">发送短信</span>
            <span>标记爽约</span>
          </div>
          <div style="borderTop:1px solid #dfe6ec">
            <self-table
              ref="FollowUpTable"
              class="FollowUpTable"
              :is-p30="false"
              :stripe="false"
              :border="false"
              :operation-list="[]"
              :table-data="clueArr"
              :columns="columnsFollowUp"
              row-key="id"
              :index="false"
              style="overflow: initial;"
            >
              <template v-slot:createDate="scope">
                {{ scope.row.createDate }}
              </template>
              <template v-slot:op="scope">
                <div class="FollowUpOpBox">
                  <el-button
                    type="text"
                    @click="handleInterviewClick(scope.row,1)"
                  >
                    取消面试
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleInterviewClick(scope.row,0)"
                  >
                    标记爽约
                  </el-button>
                </div>
              </template>
            </self-table>
            <span :class="isPC ? 'seeMore' : 'seeMore-m'">查看更多</span>
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
              @click="editDio = true"
            >编辑</span>
          </div>
          <div>
            <el-row>
              <el-col :span="6">
                <DetailItem
                  name="姓名"
                  value="formData.balance"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="手机号"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="是否有车"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="货运经验"
                  value="formData.canExtract"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <DetailItem
                  name="年龄"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="现住址"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="当前职业"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="期望工作区域"
                  value="formData.canExtract"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <DetailItem
                  name="状态"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="跟进人"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="线索编号"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="前跟进人"
                  value="formData.canExtract"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <DetailItem
                  name="线索类型"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="所属城市"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="线索归属"
                  value="formData.canExtract"
                />
              </el-col>
              <el-col :span="6">
                <DetailItem
                  name="渠道"
                  value="formData.canExtract"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <DetailItem
                  name="画像标签"
                  value="formData.canExtract"
                />
              </el-col>
            </el-row>
          </div>
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
              :table-data="clueArr"
              :columns="columnsBack"
              row-key="id"
              :index="false"
              style="overflow: initial;"
            >
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
              :page="page"
              @onPageSize="handlePageSize"
            />
          </div>
        </SectionContainer>
      </el-card>
    </div>
    <FollowUpDiolog
      :show-dialog.sync="followUpDio"
      :clue-status="clueStatus"
    />
    <send-message :show-dialog.sync="messageDio" />

    <InfoEditDio
      :show-dialog.sync="editDio"
      :clue-status="clueStatus"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import DetailItem from '@/components/DetailItem/index.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { FollowUpDiolog, SendMessage, InfoEditDio } from './components/index'
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
    InfoEditDio
  }
})
export default class extends Vue {
  private clueStatus: string = '0';
  private followUpDio:boolean = false
  private messageDio:boolean = false
  private editDio:boolean = false
  private clueArr: IState[] = [
    { name: '梧桐专车', code: '0' },
    { name: '梧桐共享', code: '1' },
    { name: '雷鸟车池', code: '2' },
    { name: '雷鸟租赁C', code: '3' },
    { name: '雷鸟租赁B', code: '4' }
  ];

  private columnsFollowUp: IState[] = [
    {
      key: 'phone',
      label: '跟进方式',
      width: '120px'
    },
    {
      key: 'haveCar',
      label: '邀约情况'
    },
    {
      key: 'cityName',
      label: '邀约失败原因'
    },
    {
      key: 'cityName',
      label: '跟进备注',
      width: '100px'
    },
    {
      key: 'createDate',
      label: '邀约面试时间',
      slot: true,
      width: '150px'
    },
    {
      key: 'cityName',
      label: '邀约人',
      width: '100px'
    },
    {
      key: 'cityName',
      label: '跟进时间',
      width: '100px'
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

  private columnsBack: IState[] = [
    {
      key: 'phone',
      label: '姓名'
    },
    {
      key: 'haveCar',
      label: '手机号'
    },
    {
      key: 'cityName',
      label: '是否有车'
    },
    {
      key: 'cityName',
      label: '城市'
    },
    {
      key: 'createDate',
      label: '渠道'
    },
    {
      key: 'cityName',
      label: '创建人'
    },
    {
      key: 'cityName',
      label: '创建人'
    }
  ];

  private columnsLog: IState[] = [
    {
      key: 'text',
      label: '描述'
    },
    {
      key: 'time',
      label: '时间'
    }
  ];

  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 10
  };

  private logData: IState[] = [
    {
      text: '描述',
      time: '2020-0204 14:45'
    },
    {
      text: '但行好事，莫问前程。',
      time: '2020-0204 14:45'
    },
    {
      text: '因过竹院逢僧话，偷得浮生半日闲。',
      time: '2020-0204 14:45'
    },
    {
      text:
        'pride relates more to our opinion of ourselves, vanity to what we would have others think of us. ',
      time: '2020-0204 14:45'
    }
  ];

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private handleClick(tab: any, event: any) {
    console.log(tab, event)
  }

  private handleInterviewClick(row: object, type:number) {
    console.log(row)
    // if (type) {

    // } else {

    // }
    //     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning'
    // }).then(() => {
    //   this.$message({
    //     type: 'success',
    //     message: '删除成功!'
    //   })
    // }).catch(() => {
    //   this.$message({
    //     type: 'info',
    //     message: '已取消删除'
    //   })
    // })
  }

  // 分页
  private handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    // this.getLists()
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
    .rightBox_min{
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
.detailContent ::v-deep .SectionContainer,
.detailContent ::v-deep .SectionContainer-m {
  box-shadow: none;
  margin-bottom: 0px;
}
.detailContent ::v-deep .el-table th {
  background-color: white;
  color: #979b9e;
  font-weight: normal;
}
</style>
