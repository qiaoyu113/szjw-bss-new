<template>
  <div class="CampaignDetailContainer">
    <div class="box">
      <SectionContainer
        title="基础信息"
        :md="true"
      >
        <ShowForm :list-query="listQuery" />
      </SectionContainer>
    </div>
    <SectionContainer
      title="数据统计"
      :md="true"
    >
      <WuTong
        v-if="type === 1"
        :table-data="tableData"
        :is-edit="isEdit"
      />
      <ThunderbirdPool
        v-else-if="type === 2"
        :table-data="tableData"
        :is-edit="isEdit"
      />
      <ThunderbirdRental
        v-else-if="type === 3"
        :table-data="tableData"
        :is-edit="isEdit"
      />
      <template #rightBox>
        <div v-if="isEdit">
          <el-button
            type="text"
            @click="handleCancelClick"
          >
            取消
          </el-button>
          <el-button
            type="text"
            @click="handleFinishClick"
          >
            完成
          </el-button>
        </div>
        <div v-else>
          <el-button
            type="text"
            @click="handleEditClick"
          >
            编辑
          </el-button>
        </div>
      </template>
    </SectionContainer>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import ShowForm from './components/showForm.vue'
import WuTong from './components/wutong.vue'
import ThunderbirdPool from './components/thunderbirdPool.vue'
import ThunderbirdRental from './components/thunderbirdRental.vue'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'CampaignDetail',
  components: {
    SectionContainer,
    ShowForm,
    WuTong,
    ThunderbirdPool,
    ThunderbirdRental
  }
})
export default class extends Vue {
  private isEdit:boolean = false;
  private listQuery:IState = {};
  private tableData:IState[] = [{}, {}];
  private type:number = 3 // 数据统计类型

  // 编辑
  handleEditClick() {
    this.isEdit = true
  }
  // 取消
  handleCancelClick() {
    this.isEdit = false
  }
  // 完成
  handleFinishClick() {
    this.isEdit = false
  }
}
</script>
<style lang="scss" scoped>
  .CampaignDetailContainer {
    .box{
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
      overflow: hidden;
      transform: translateZ(0);
      padding: 20px;
    }
    .overflow {
      color:#1d1d1d;
      width: 100%;
      font-size:14px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }
    .btnInline {
      display: flex;
      overflow-x: auto;
    }
    .wordWrap {
      word-break: break-all;
    }
  }
</style>
