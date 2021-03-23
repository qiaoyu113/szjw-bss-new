<template>
  <div class="cpmplate-container">
    <self-form
      ref="fromRef"
      :list-query="formData"
      :form-item="formItem"
      label-width="120px"
      label-position="right"
      :pc-col="24"
    >
      <template #btn>
        <div style="float: right">
          <el-button
            type="primary"
            style="margin-left: 120px"
          >
            批量下架
          </el-button>
          <el-button type="primary">
            批量忽略
          </el-button>
          <el-button
            style="margin-right: 10px"
            @click="resetFrom"
          >
            重置
          </el-button>
        </div>
      </template>
    </self-form>
    <div class="table-container">
      <SelfTable
        style="padding:30px 10px"
        :is-p30="false"
        :columns="columns"
        :table-data="tableData"
        :page="page"
        :operation-list="[]"
        row-key="a"
        @selection-change="handleSelectionChange"
      >
        <template #btn>
          <el-button type="text">
            下架线路
          </el-button>
          <el-button
            type="text"
            disabled
          >
            忽略
          </el-button>
        </template>
      </SelfTable>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LineLayout, NewLineAgent } from '../components'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'
import SelfDialog from '@/components/SelfDialog'

@Component({
  name: 'Agent',
  components: {
    LineLayout,
    NewLineAgent,
    SelfForm,
    SelfTable
  }
})
export default class extends Vue {
  private active: string = '0'
  formItem = [
    {
      type: 1,
      key: 'driverId',
      label: '代办编号：',
      tagAttrs: {
        placeholder: '请输入'
      },
      col: 6
    },
    {
      type: 1,
      key: 'driverIds',
      label: '线路名称：',
      tagAttrs: {
        placeholder: '请输入名称/编号'
      },
      col: 6
    },
    {
      type: 3,
      key: 'driverIdss',
      label: '代办生成时间：',
      tagAttrs: {
        placeholder: '请选择'
      },
      col: 12
    }
  ]
  formData = {
    driverId: '',
    driverIds: '',
    driverIdss: []
  }
  columns = [
    {
      key: 'a',
      label: '代办编号'
    },
    {
      key: 'b',
      label: '线路名称',
      width: '140px'
    },
    {
      key: 'c',
      label: '线路编号',
      width: '140px'
    },
    {
      key: 'd',
      label: '线路状态',
      width: '140px'
    },
    {
      key: 'e',
      label: '原因',
      width: '240px'
    },
    {
      key: 'f',
      label: '线路创建时间',
      width: '140px'
    },
    {
      key: 'g',
      label: '代办生成时间',
      width: '140px'
    },
    {
      key: 'btn',
      label: '操作',
      width: '150px',
      slot: true
    }]
  private tableData = [
    {
      a: '1',
      b: '1'
    }, {
      a: '2',
      b: '2'
    }
  ]
  page={
    limit: 30,
    page: 1,
    total: 50
  }
  mounted() {}
  multipleSelection= []
  resetFrom(this:any) {
    this.$refs['fromRef'].resetForm()
  }
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
}
</script>

<style lang="scss" scoped>
.cpmplate-container {
  margin: 12px;
  padding: 12px;
  background: #fff;
}
</style>
