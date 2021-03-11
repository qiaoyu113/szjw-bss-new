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
        <template slot="status">
          <el-badge
            v-for="item in btns"
            :key="item.text"
          >
            <el-button
              type="primary"
              margin-right="20px"
              :plain="item.name !== listQuery.status"
              @click="() => {
                listQuery.status = item.name
                handleFilterClick()
              }"
            >
              {{ item.text }}
            </el-button>
          </el-badge>
        </template>
      </self-form>
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
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
}
</script>

<style lang="scss" scoped>
.LineList {
  .rejectBox{
      display: flex;
      align-items: center;
    }
  .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
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
