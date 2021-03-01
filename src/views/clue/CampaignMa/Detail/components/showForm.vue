<template>
  <div>
    <self-form
      label-position="top"
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="100px"
      class="p15"
      :pc-col="6"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'ShowForm',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  @Prop({ default: () => [] }) listQuery!:IState
  private formItem:any[] = [
    {
      type: 7,
      label: 'Campaign ID',
      key: 'a'
    },
    {
      type: 7,
      label: '客群细分ID/业务线/客群类型',
      key: 'b'
    },
    {
      type: 7,
      label: '所属大区',
      key: 'c'
    },
    {
      type: 7,
      label: '城市',
      key: 'd'
    },
    {
      type: 7,
      label: '投放平台',
      key: 'e'
    },
    {
      type: 7,
      label: '投放起始时间',
      key: 'f'
    },
    {
      type: 7,
      label: '投放终止时间',
      key: 'g'
    },
    {
      type: 7,
      label: '投放物料',
      key: 'h'
    },
    {
      type: 7,
      label: '落地页',
      key: 'i'
    },
    {
      type: 7,
      label: '诉求',
      key: 'j'
    },
    {
      type: 7,
      label: '预算(元)',
      key: 'k'
    },
    {
      type: 7,
      label: '备注',
      key: 'remark'
    },
    {
      type: 7,
      label: '创建人',
      key: 'l'
    },
    {
      type: 7,
      label: '创建时间',
      key: 'm'
    }
  ];
}
</script>
<style lang="scss" scoped>
</style>
