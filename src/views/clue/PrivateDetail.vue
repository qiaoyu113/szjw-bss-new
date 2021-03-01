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
            <span
              v-if="Number(clueStatus) < 2"
              @click="messageDio = true"
            >发送短信</span>
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
            <span @click="editDio = true">编辑</span>
          </div>
          <div>
            <el-row :gutter="20">
              <el-col
                v-for="(item,index) in infoBase"
                :key="index"
                :span="6"
              >
                <DetailItem
                  :name="item.name"
                  :value="item.value"
                />
              </el-col>
            </el-row>
          </div>
        </SectionContainer>
        <SectionContainer
          title="其他信息"
          :md="true"
        >
          <div style="borderTop:1px solid #dfe6ec">
            <self-table
              ref="OtherTable"
              class="OtherTable"
              :is-p30="false"
              :stripe="false"
              :border="false"
              :operation-list="[]"
              :table-data="clueArr"
              :columns="columnsOther"
              row-key="id"
              :index="false"
              style="overflow: initial;"
            />
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
              :page="logPage"
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
  private followUpDio: boolean = false;
  private messageDio: boolean = false;
  private editDio: boolean = false;
  private clueArr: IState[] = [
    { name: '梧桐专车', code: '0' },
    { name: '梧桐共享', code: '1' },
    { name: '雷鸟车池', code: '2' },
    { name: '雷鸟租赁C', code: '3' },
    { name: '雷鸟租赁B', code: '4' }
  ];

  private followUpLogArr: IState[] = [
    {
      code: 0,
      listData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      page: 1,
      columns: [
        {
          key: 'phone',
          label: '跟进方式'
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
          label: '跟进备注'
        },
        {
          key: 'createDate',
          label: '邀约面试时间',
          slot: true
        },
        {
          key: 'cityName',
          label: '邀约人'
        },
        {
          key: 'cityName',
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
      ]
    },
    { code: 1, listData: [], page: 1, columns: [] },
    { code: 2, listData: [], page: 1, columns: [] },
    { code: 3, listData: [], page: 1, columns: [] },
    { code: 4, listData: [], page: 1, columns: [] }
  ];

  private infoBase: IState = [
    { name: '威山', value: '' },
    { name: '爽爽', value: '13' },
    { name: '智博', value: '13' },
    { name: '义杰', value: '13' },
    { name: '钱磊', value: '13' },
    { name: '佳琳', value: '13' }
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

  private otherInfoColumns: IState[] = [
    {
      key: 'phone',
      label: '邀请语'
    },
    {
      key: 'haveCar',
      label: '面试语'
    },
    {
      key: 'cityName',
      label: '投发物料'
    },
    {
      key: '落地页',
      label: '城市'
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

  private logPage: PageObj = {
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

  get followUpLog() {
    let stateItem = this.followUpLogArr[Number(this.clueStatus)]
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

  private handleClick(tab: any, event: any) {
    console.log(tab, event)
  }

  private handleInterviewClick(row: object, type: number) {
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
    this.logPage.page = page.page
    this.logPage.limit = page.limit
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
