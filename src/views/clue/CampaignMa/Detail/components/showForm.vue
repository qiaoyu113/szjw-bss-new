<template>
  <div class="clueDetail">
    <self-form
      label-position="top"
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      label-width="100px"
      class="p15"
      :pc-col="6"
    >
      <template #landingPage="{row}">
        <div class="breakWord">
          {{ row.landingPage | DataIsNull }}
        </div>
      </template>
      <template v-slot:userGroupId="{row}">
        <template v-if="row.userGroupId || row.busiTypeName || row.groupTypeName">
          {{ row.userGroupId }}/{{ row.busiTypeName }}/{{ row.groupTypeName }}
        </template>
        <template v-else>
          暂无数据
        </template>
      </template>
      <template v-slot:createUserName="{row}">
        {{ row.createUserName }}{{ row.createUserPhone }}
      </template>
      <template v-slot:areCityName="{row}">
        <template v-if="row.areCityName">
          {{ row.areCityName }}
        </template>
        <template v-else>
          暂无数据
        </template>
      </template>
      <template v-slot:cityName="{row}">
        <template v-if="row.cityName">
          {{ row.cityName }}
        </template>
        <template v-else>
          暂无数据
        </template>
      </template>
    </self-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { GetcampaignDetail } from '@/api/clue'
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
  @Prop({ default: '' }) campaignId!:string
  private listQuery:IState = {}
  private formItem:any[] = [
    {
      type: 7,
      label: 'Campaign ID',
      key: 'campaignId'
    },
    {
      type: 'userGroupId',
      label: '客群细分ID/业务线/客群类型',
      key: 'userGroupId',
      slot: true
    },
    {
      type: 'areCityName',
      label: '所属大区',
      key: 'areCityName',
      slot: true
    },
    {
      type: 'cityName',
      label: '城市',
      key: 'cityName',
      slot: true
    },
    {
      type: 7,
      label: '投放平台',
      key: 'launchPlatform',
      class: 'breakWord'
    },
    {
      type: 7,
      label: '投放起始时间',
      key: 'dropStarTime'
    },
    {
      type: 7,
      label: '投放终止时间',
      key: 'dropEndTime'
    },
    {
      type: 7,
      label: '投放物料',
      key: 'dropMaterials',
      class: 'breakWord'
    },
    {
      type: 'landingPage',
      label: '落地页',
      key: 'landingPage',
      slot: true
    },
    {
      type: 7,
      label: '诉求',
      key: 'appeal',
      class: 'breakWord'
    },
    {
      type: 7,
      label: '预算(元)',
      key: 'budget'
    },
    {
      type: 7,
      label: '备注',
      key: 'remarks',
      class: 'breakWord'
    },
    {
      type: 'createUserName',
      label: '创建人',
      key: 'createUserName',
      slot: true
    },
    {
      type: 7,
      label: '创建时间',
      key: 'createDate'
    }
  ];
  // 获取campaign 详情
  async getDetail() {
    try {
      let params = {
        campaignId: this.campaignId
      }
      let { data: res } = await GetcampaignDetail(params)
      if (res.success) {
        this.listQuery = { ...this.listQuery, ...res.data }
      } else {
        this.$message.error(res.message)
      }
    } catch (err) {
      console.log(`get campaign detail fail:${err}`)
    } finally {
      //
    }
  }
}
</script>
<style lang="scss" scoped>
  .breakWord {
    word-break: break-word;
  }
</style>

<style scoped>
  .clueDetail >>> .el-form-item__content {
    word-break: break-all;
  }
</style>
