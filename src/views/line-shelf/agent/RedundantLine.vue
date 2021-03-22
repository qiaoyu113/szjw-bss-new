<template>
  <div class="cpmplate-container">
    <self-form
      :list-query="formData"
      :form-item="formItem"
      label-width="120px"
      label-position="right"
      :pc-col="24"
    >
      <template #btn>
        <div style="float:right">
          <el-button
            type="primary"
            style="margin-left:120px"
          >
            批量下架
          </el-button>
          <el-button type="primary">
            批量忽略
          </el-button>
          <el-button style="margin-right:10px">
            重置
          </el-button>
        </div>
      </template>
    </self-form>
    <div class="table-container">
      <SelfTable />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LineLayout, NewLineAgent } from '../components'
import SelfForm from '@/components/Base/SelfForm.vue'
import SelfTable from '@/components/Base/SelfTable.vue'

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
  formItem =[
    {
      type: 1,
      key: 'driverId',
      label: '代办编号：',
      tagAttrs: {
        placeholder: '请输'
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
  formData={
    driverId: '',
    driverIds: '',
    driverIdss: []
  }
  mounted() {}
}
</script>

<style lang="scss" scoped>
.cpmplate-container {
  margin: 12px;
  padding: 12px;
  background: #fff;
}
</style>
