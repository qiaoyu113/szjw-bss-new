<template>
  <!-- 司机云线索列表、司机梧桐账户 -->
  <div class="baseInfo1">
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="100px"
      class="p15 SuggestForm"
      :pc-col="8"
    >
      <template v-slot:followPerson="scope">
        <template v-if="scope.row.followName || scope.row.followPhone">
          {{ scope.row.followName }} {{ scope.row.followPhone }}
        </template>
        <template v-else>
          暂无数据
        </template>
      </template>
      <template v-slot:prevFollowPerson="scope">
        <template v-if="scope.row.beforeFollowerName || scope.row.beforeFollowerPhone">
          {{ scope.row.beforeFollowerName }} {{ scope.row.beforeFollowerPhone }}
        </template>
        <template v-else>
          暂无数据
        </template>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'BaseInfo1',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  private listQuery:IState = {};
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入',
        clearable: true,
        maxlength: 10
      },
      label: '公司名称/姓名',
      w: '110px',
      key: 'name'
    },
    {
      type: 7,
      label: '手机号',
      key: 'phone'
    },
    {
      type: 7,
      label: '意向车型',
      key: 'carType'
    },
    {
      type: 7,
      label: '状态',
      key: 'statusName'
    },
    {
      type: 'followPerson',
      label: '跟进人',
      key: 'followPerson',
      slot: true
    },
    {
      type: 7,
      label: '线索编号',
      key: 'marketClueId'
    },
    {
      type: 'prevFollowPerson',
      label: '前跟进人',
      key: 'prevFollowPerson',
      slot: true
    },
    {
      type: 7,
      label: '所在城市',
      key: 'cityName'
    },
    {
      type: 7,
      label: '线索类型',
      key: 'marketClueType'
    },
    {
      type: 7,
      label: '线索归属',
      key: 'marketClueAttr'
    },

    {
      type: 7,
      label: '渠道',
      key: 'sourceChannelName'
    },
    {
      type: 7,
      label: '备注',
      key: 'remark'
    }
  ]
}
</script>
<style lang="scss" scoped>
</style>
