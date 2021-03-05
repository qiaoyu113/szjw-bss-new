<template>
  <div>
    <div class="table_box">
      <div class="table-title">
        回流policy设置
      </div>
      <self-table
        ref="ConfigurationForm"
        :is-p30="false"
        :index="false"
        :table-data="tableData"
        :columns="columns"
        row-key="id"
      >
        <template v-slot:op="scope">
          <el-button
            type="text"
            size="small"
            @click="setPolicyAuto(scope.row)"
          >
            设置回流policy
          </el-button>
        </template>
      </self-table>
    </div>
    <SetUpPolicy
      :visible.sync="showPolicy"
      :policy-data="policyData"
      @success="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SelfTable from '@/components/Base/SelfTable.vue'
import SetUpPolicy from '../components/SetUpPolicy.vue'

@Component({
  name: 'BackflowPolicy',
  components: {
    SelfTable,
    SetUpPolicy
  }
})
export default class extends Vue {
  tableData = [
    {
      cityName: '11',
      id: '11',
      portraitLabel: '11',
      distributionManageName: '11',
      createName: '11',
      createDate: '11'
    },
    {
      cityName: '112',
      id: '112',
      portraitLabel: '11',
      distributionManageName: '11',
      createName: '11',
      createDate: '11'
    },
    {
      cityName: '11',
      id: '12121',
      portraitLabel: '11',
      distributionManageName: '11',
      createName: '11',
      createDate: '11'
    }
  ]
  private page = {
    page: 1,
    limit: 30,
    total: 0
  }
  private columns: any[] = [
    {
      key: 'cityName',
      label: '城市'
    },
    {
      key: 'id',
      label: '设置人',
      width: '120px'
    },
    {
      key: 'createDate',
      label: '设置时间'
    },
    {
      key: 'op',
      label: '操作',
      slot: true
    }
  ]
  policyData = {}
  showPolicy = false
  setPolicyAuto(item: any) {
    const object = {
      id: item.id
    }
    this.policyData = object
    this.showPolicy = true
    // this.showPolicy = true
  }
  getList() {}
}
</script>

<style scoped>
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
.table-title {
  margin: 12px 0 20px 0;
  font-weight: 600;
}

</style>
