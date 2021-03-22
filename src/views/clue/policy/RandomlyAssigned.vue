<template>
  <div class="configuration-container p15">
    <self-from
      class="configuration-self-form p15"
      :form-item="ruleFrom"
      :city-list="cityList"
      :list-query="listQuery"
    >
      <template #clueType>
        <!-- <ul ref="clueRef">
          <li

            :key="item.id"

            :data-cluetype="item.id"
            :class="{active: item.id === activeLineType}"
            @click="switchLineType(item.id)"
          >
            {{ item.name }}
          </li>
        </ul> -->
        <el-radio-group
          ref="clueRef"
          v-model="activeLineType"
          size="medium"
          @change="switchLineType"
        >
          <el-radio-button
            v-for="item in clueType"
            :key="item.id"
            v-permission="[`${item.url}`]"
            :label="item.id"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </template>
      <template #btnc>
        <div class="btnPc">
          <el-button
            type="primary"
            @click="handleFilterClick"
          >
            查询
          </el-button>
          <el-button
            @click="handleResetClick"
          >
            重置
          </el-button>
        </div>
      </template>
    </self-from>
    <!-- 我是配置管理页面 -->
    <div class="table_box">
      <self-table
        ref="ConfigurationForm"
        :is-p30="false"
        :index="false"
        :operation-list="[]"
        :table-data="tableData"
        :columns="columns"
        row-key="id"
        :page="page"
        :default-sort="{prop: 'setDate', order: 'default'}"
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
        @sort-change="sortDate"
      >
        <template v-slot:op="scope">
          <el-button
            v-permission="['/v2/market-clue/config/updatePolicy/notReceiveIds']"
            type="text"
            size="small"
            @click="setPolicyAuto(scope.row)"
          >
            设置分配policy
          </el-button>
        </template>
        <template v-slot:Id="{row}">
          {{ row.userGroupId }}/{{ row.busiTypeName }}/{{ row.groupType }}
        </template>
        <template v-slot:groupUpdate="{row}">
          {{ row.groupUpdateName }}/{{ row.groupUpdatePhone }}
        </template>
      </self-table>
    </div>
    <SetUpDistributionPolicy
      :visible.sync="showPolicy"
      :policy-data="policyData"
      :clue-type="activeLineType"
      @success="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SetUpDistributionPolicy from '../components/SetUpDistributionPolicy.vue'
import SelfFrom from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { getOfficeByType, getOfficeByTypeAndOfficeId, GetDictionaryCity } from '@/api/common'
import { HandlePages, lock } from '@/utils/index'
import { configurationWTShareList, configurationWTSpecialList, configurationLCList, configurationLZList } from '@/api/clue'
import { checkPermission } from '@/utils/permission'
interface PageObj {
  page: number
  limit: number
  total?: number
}
interface IState {
  [key: string]: any
}
@Component({
  name: 'Configuration',
  components: {
    SelfTable,
    SelfFrom,
    SetUpDistributionPolicy,
    SelfDialog
  }
})
export default class extends Vue {
  private cityList:IState[] = []; // 城市列表
  listQuery: any = {}
  clueType: Array<any> = [
    {
      name: '梧桐专车',
      id: 0,
      url: '/v2/market-clue/config/WTSpecialList'
    },
    {
      name: '梧桐共享',
      id: 1,
      url: '/v2/market-clue/config/WTShareList'
    },
    {
      name: '雷鸟车池',
      id: 2,
      url: '/v2/market-clue/config/LCList'
    },
    {
      name: '雷鸟租赁',
      id: 3,
      url: '/v2/market-clue/config/LZList'
    }
  ]
  activeLineType: number = this.clueType[0].id
  private ruleFrom: Array<any> = [
    {
      type: 'clueType',
      slot: true,
      key: 'clueType',
      col: 24
    },
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true,
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'city'
        // props: {
        //   lazy: true,
        //   lazyLoad: this.cityList
        // }
      },
      options: this.cityList,
      col: 8,
      label: '城市',
      key: 'city'
    },
    {
      type: 'btnc',
      slot: true,
      key: 'btnc',
      col: 16
      // offset: 3
    }
  ]
  // 获取获取城市列表
  async cityDetail() {
    let { data: city } = await GetDictionaryCity()
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: +item.code,
          label: item.name
        }
      })
      this.cityList.push(...nodes)
    }
  }
  switchLineType(val: number) {
    // this.activeLineType = val
    this.getList()
  }

  private tableData: any[] = []
  private multipleSelection: any[] = []
  private listLoading:boolean = false;
  private columns: any[] = [
    {
      key: 'cityName',
      label: '城市',
      attrs: {
        sortable: true
      }
    },
    {
      key: 'Id',
      slot: true,
      label: '客群细分ID/业务线/客群类型',
      width: '120px'
    },
    {
      key: 'portraitLabel',
      label: '目标画像标签'
    },
    {
      key: 'allocationTypeName',
      label: '分配机制'
    },
    {
      key: 'clueNum',
      label: '线索量',
      width: '120px'
    },
    {
      key: 'groupUpdate',
      slot: true,
      label: '设置人'
    },
    {
      key: 'groupUpdateDate',
      label: '设置时间'
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      fixed: 'right'
    }
  ]
  private showDialog: boolean = false
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  }
  sortDate({ order }:any) {
    if (order) {
      order = order === 'ascending' ? '1' : '2'
    } else {
      order = ''
    }
    this.getList(order)
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
    this.getList()
  }
  // 重置
  handleResetClick() {
    this.listQuery.city = ''
    this.getList()
  }
  // 分页
  handlePageSize(page: PageObj) {
    this.page.page = page.page
    this.page.limit = page.limit
    this.getList()
  }
  handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
  // 设置policy
  private showPolicy:boolean = false // has 设置policy弹框
  private policyData:any = {}
  setPolicyAuto(row:any) {
    // console.log(row)
    const object = {
      busiType: this.activeLineType,
      cityCode: row.city,
      id: row.userGroupId,
      notReceiveId: row.notReceiveId
    }
    this.policyData = object
    this.showPolicy = true
  }
  // 获取列表
  private async getList(this:any, order?:string) {
    try {
      this.listLoading = true
      // const submitForm = this.clueArr.find((item: any) => {
      //   return item.id === this.listQuery.clueType
      // }) || {}
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit,
        clueType: this.activeLineType,
        order: order || ''
      }
      // if (this.listQuery.city && this.listQuery.city.length > 1) {
      //   params.city = this.listQuery.city
      // }
      this.listQuery.city && this.listQuery.city.length && (params.city = +this.listQuery.city[0])
      if (params.clueType === 0) {
        let { data: res } = await configurationWTSpecialList(params)
        if (res.success) {
          this.tableData = res.data || []
          this.$refs['ConfigurationForm'].toggleRowSelection()
          res.page = await HandlePages(res.page)
          this.page.total = res.page.total
        } else {
          this.$message.error(res.errorMsg)
        }
      } else if (params.clueType === 1) {
        let { data: res } = await configurationWTShareList(params)
        if (res.success) {
          this.tableData = res.data || []
          this.$refs['ConfigurationForm'].toggleRowSelection()
          res.page = await HandlePages(res.page)
          this.page.total = res.page.total
        } else {
          this.$message.error(res.errorMsg)
        }
      } else if (params.clueType === 2) {
        let { data: res } = await configurationLCList(params)
        if (res.success) {
          this.tableData = res.data || []
          this.$refs['ConfigurationForm'].toggleRowSelection()
          res.page = await HandlePages(res.page)
          this.page.total = res.page.total
        } else {
          this.$message.error(res.errorMsg)
        }
      } else if (params.clueType === 3) {
        let { data: res } = await configurationLZList(params)
        if (res.success) {
          this.tableData = res.data || []
          this.$refs['ConfigurationForm'].toggleRowSelection()
          res.page = await HandlePages(res.page)
          this.page.total = res.page.total
        } else {
          this.$message.error(res.errorMsg)
        }
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  mounted() {
    let inx = 0
    try {
      const ele:any = this.$refs['clueRef']
      inx = ele.$el && ele.$el.firstElementChild.firstElementChild._value
    } catch (error) {
      return error
    } finally {
      this.$nextTick(() => {
        this.activeLineType = Number(inx)
        this.getList()
        this.cityDetail()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.configuration-container {
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;

      float: left;
      width: 120px;
      line-height: 32px;
      text-align: center;
      border: 1px solid #eee;
      color: #333;
      user-select: none;
    }
    & li:nth-child(1) {
      border-radius: 10px 0 0 10px;
    }
    & li:last-child {
      border-radius: 0 10px 10px 0;
    }
    .active {
      border-color: #1890ff;
      color: #1890ff;
    }
  }
  .configuration-self-form {
    background: #fff;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
}
.table_box {
  padding: 10px 30px;
  margin-top: 15px;
  background: #ffffff;
  -webkit-box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
  overflow: hidden;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
  .btnPc{
       width: 100%;
       padding: 0 10px;
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
    }
</style>
