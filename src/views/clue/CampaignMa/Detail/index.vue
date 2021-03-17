<template>
  <div class="CampaignDetailContainer">
    <div class="box">
      <SectionContainer
        title="基础信息"
        :md="true"
      >
        <ShowForm
          ref="showForm"
          :campaign-id="campaignId"
        />
      </SectionContainer>
    </div>
    <SectionContainer
      title="数据统计"
      :md="true"
    >
      <WuTong
        v-if="[0,1].includes(busiType)"
        ref="wutong"
        :campaign-id="campaignId"
        :is-edit="isEdit"
      />
      <ThunderbirdPool
        v-else-if="busiType === 2"
        ref="pool"
        :campaign-id="campaignId"
        :is-edit="isEdit"
      />
      <ThunderbirdRental
        v-else-if="busiType === 3"
        ref="rental"
        :campaign-id="campaignId"
        :is-edit="isEdit"
      />
      <template #rightBox>
        <div v-permission="[' /v2/clue/campaign/editCampaignData']">
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
import { EditCampaignData } from '@/api/clue'
import CallLog from '@/components/OutboundDialog/CallLog.vue'
import { divisionFunc } from './components/index'
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
    ThunderbirdRental,
    CallLog
  }
})
export default class extends Vue {
  private campaignId:string = '' // campaignId
  private isEdit:boolean = false;
  private busiType:number = 1 // 业务线类型

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
    this.editCampaignData()
  }
  // 编辑数据统计
  async editCampaignData() {
    try {
      let params:IState = {}
      let arrs:IState[] = []
      if ([1, 0].includes(this.busiType)) {
        arrs = (this.$refs.wutong as any).tableData
      } else if (this.busiType === 2) {
        arrs = (this.$refs.pool as any).tableData
      } else if (this.busiType === 3) {
        arrs = (this.$refs.rental as any).tableData
      }
      let obj = arrs.map((item:IState) => ({
        statisticsId: item.statisticsId,
        campaignId: this.campaignId,
        actualCost: +item.actualCost1,
        clickNum: +item.clickNum1,
        showNum: +item.showNum1,
        showClickRate: divisionFunc(item.showNum1, item.clickNum1),
        clickClueRate: divisionFunc(item.clueNum, item.clickNum1),
        clickCost: divisionFunc(item.actualCost, item.clickNum1)
      }))
      params.editFormList = obj
      let { data: res } = await EditCampaignData(params)
      if (res.success) {
        this.$message.success('操作成功')
        this.getTable()
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`edit campaign fail:${err}`)
    } finally {
      //
    }
  }
  // 获取数据统计的表格数据
  getTable() {
    if ([0, 1].includes(this.busiType)) {
      (this.$refs.wutong as any).getTableData()
    } else if (this.busiType === 2) {
      (this.$refs.pool as any).getTableData()
    } else if (this.busiType === 3) {
      (this.$refs.rental as any).getTableData()
    }
  }
  mounted() {
    this.campaignId = (this.$route.query.campaignId as string)
    this.busiType = +(this.$route.query.busiType as string)
    setTimeout(() => {
      (this.$refs.showForm as any).getDetail()
      this.getTable()
    }, 20)
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
