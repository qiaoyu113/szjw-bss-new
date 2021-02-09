<template>
  <div class="remark1">
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="100px"
      class="p15 SuggestForm"
      :pc-col="24"
    >
      <template #other>
        <el-form-item
          label="跟进情况"
        >
          <el-button
            v-for="item in followList"
            :key="item.value"
            size="mini"
            round
            :type="item.value === listQuery.followInfo ? 'primary':''"
            @click="handleStatusClick(item)"
          >
            {{ item.label }}
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="listQuery.followInfo===1"
          label="意向车型"
        >
          <el-checkbox-group v-model="listQuery.carTypes">
            <el-checkbox
              v-for="item in carLists"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model.trim="listQuery.remark"
            placeholder="请填写本次通话意向如何..."
            maxlength="200"
            show-word-limit
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { SettingsModule } from '@/store/modules/settings'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'Remark1',
  components: {
    SelfForm
  }
})
export default class extends Vue {
  private listQuery:IState = {
    followInfo: '',
    carTypes: [],
    remark: ''
  };
  private formItem:any[] = []
  private followList:IState[] = [
    {
      label: '有意向',
      value: 1
    },
    {
      label: '无意向',
      value: 2
    },
    {
      label: '无人接听',
      value: 3
    },
    {
      label: '号码错误',
      value: 4
    }
  ]
  private carLists: IState[] = [
    {
      label: '金杯',
      value: 1
    },
    {
      label: '依维柯',
      value: 2
    }
  ]
  // 区分设备
  get isPC() {
    return SettingsModule.isPC
  }
  // 状态
  handleStatusClick(item:IState) {
    this.listQuery.followInfo = item.value
    if (this.listQuery.followInfo !== 1) {
      this.listQuery.carTypes = []
    }
  }
}
</script>
<style lang="scss" scoped>
  .remark1 {

  }
</style>
