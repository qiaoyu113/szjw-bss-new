<template>
  <div class="configuration-container p15">
    <self-from
      class="configuration-self-form p15"
      :form-item="ruleFrom"
      :list-query="listQuery"
    >
      <template #lineType>
        <ul>
          <li
            v-for="item in lineType"
            :key="item.id"
            :class="{active: item.id === activeLineType}"
            @click="switchLineType(item.id)"
          >
            {{ item.name }}
          </li>
        </ul>
      </template>
      <template #btnc>
        <el-button
          type="primary"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button> 重置 </el-button>
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
        @onPageSize="handlePageSize"
        @selection-change="handleSelectionChange"
      >
        <template v-slot:op="scope">
          <el-button
            type="text"
            size="small"
            @click="handleInterveneClick(scope.row)"
          >
            调整干涉人
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleAllotClick(scope.row)"
          >
            调整分配人
          </el-button>
          <el-button
            type="text"
            size="small"
          >
            调整监督人
          </el-button>
          <el-button
            type="text"
            size="small"
          >
            设置policy
          </el-button>
        </template>
      </self-table>
    </div>
    <SelfDialog
      :class="'distributionDialog'"
      :visible.sync="showDialog"
      :confirm="confirm"
      :show-other-button="false"
      title="调整干涉人"
      width="500px"
      :destroy-on-close="true"
      @closed="() => {
        row = {}
      }"
    >
      <p>
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="角色">
            <el-select
              v-model="listQuery.role"
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </p>
    </SelfDialog>
    <SelfDialog
      :class="'distributionDialog'"
      :visible.sync="showDialog"
      :confirm="confirm"
      :show-other-button="false"
      title="调整分配人"
      width="500px"
      :destroy-on-close="true"
      @closed="() => {
        row = {}
      }"
    >
      <p>
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
        >
          <el-form-item label="角色">
            <el-select
              v-model="listQuery.role"
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </p>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import SelfFrom from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { getOfficeByType, getOfficeByTypeAndOfficeId } from '@/api/common'
import { HandlePages, lock } from '@/utils/index'
import { configurationManagementList } from '@/api/clue.ts'
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
    SelfDialog
  }
})
export default class extends Vue {
  listQuery: any = {}
  lineType: Array<any> = [
    {
      name: '梧桐专车',
      id: 1
    },
    {
      name: '梧桐共享',
      id: 2
    },
    {
      name: '雷鸟车池',
      id: 4
    },
    {
      name: '雷鸟租赁',
      id: 5
    }
  ]
  activeLineType: number = this.lineType[0].id
  private ruleFrom: Array<any> = [
    {
      type: 'lineType',
      slot: true,
      key: 'lineType',
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
        'node-key': 'driverCity',
        props: {
          lazy: true,
          lazyLoad: this.showWork
        }
      },
      col: 8,
      label: '司机城市',
      key: 'driverCity'
    },
    {
      type: 'btnc',
      slot: true,
      key: 'btnc',
      col: 8,
      offset: 5
    }
  ]
  private async showWork(node: any, resolve: any) {
    let query: any = {
      parentId: ''
    }
    if (node.level === 1) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes = await this.areaAddress({ type: 2 })
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes = await this.cityDetail(query)
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }
  private async cityDetail(params: any) {
    let { data: city } = await getOfficeByTypeAndOfficeId(params)
    if (city.success) {
      const nodes = city.data.map(function(item: any) {
        return {
          value: item.areaCode,
          label: item.name,
          leaf: true
        }
      })
      return nodes
    }
  }
  private async areaAddress(params: any) {
    try {
      let { data: res } = await getOfficeByType(params)
      if (res.success) {
        const nodes = res.data.map(function(item: any) {
          return {
            value: item.id,
            label: item.name,
            leaf: false
          }
        })
        return nodes
      }
    } catch (err) {
      console.log(`load city by code fail:${err}`)
    }
  }
  switchLineType(val: number) {
    this.activeLineType = val
  }

  private tableData: any[] = []
  private multipleSelection: any[] = []
  private listLoading:boolean = false;
  private columns: any[] = [
    {
      key: 'cityName',
      label: '城市'
    },
    {
      key: 'id',
      label: '客群细分编号/业务线/客群类型',
      width: '120px'
    },
    {
      key: 'portraitLabel',
      label: '目标画像标签'
    },
    {
      key: 'distributionTypeName',
      label: '分配机制'
    },
    {
      key: 'distributionManageName',
      label: '分配机制管理员',
      width: '120px'
    },
    {
      key: 'policyName',
      label: 'policy干涉人'
    },
    {
      key: 'distributionName',
      label: '分配人'
    },
    {
      key: 'supervisorName',
      label: '监督人'
    },
    {
      key: 'remark',
      label: '备注'
    },
    {
      key: 'createName',
      label: '创建人'
    },
    {
      key: 'createDate',
      label: '创建时间'
    },
    {
      key: 'recentNews',
      label: '最新动态'
    },
    {
      key: 'op',
      label: '操作',
      slot: true,
      width: '300px',
      fixed: 'right'
    }
  ]
  private showDialog: boolean = false
  private page: PageObj = {
    page: 1,
    limit: 30,
    total: 0
  }
  // 查询
  handleFilterClick() {
    this.page.page = 1
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
  // 调整干涉人
  private async handleInterveneClick(row:any) {
    this.showDialog = true
  }
  private async confirm(done: any) {
    try {
      let params = {

      }
      // if (success) {
      //   this.$message.success('调整成功')
      // }
    } catch (err) {
      console.log('11')
    } finally {
      console.log('22')
    }
  }
  // 调整分配人
  private async handleAllotClick(row:any) {
  }
  // 获取列表
  private async getList(this:any) {
    try {
      this.listLoading = true
      let params:IState = {
        page: this.page.page,
        limit: this.page.limit
      }
      if (this.listQuery.cityName && this.listQuery.cityName.length > 1) {
        params.cityName = this.listQuery.cityName[1]
      }
      let { data: res } = await configurationManagementList(params)
      if (res.success) {
        this.tableData = res.data || []
        this.$refs['ConfigurationForm'].toggleRowSelection()
        res.page = await HandlePages(res.page)
        this.page.total = res.page.total
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get list fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }

  data() {
    return {
      form: {
        role: ''
      },
      options: [{
        value: '选项1',
        label: '角色'
      }]
    }
  }
  mounted() {
    this.getList()
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
</style>
