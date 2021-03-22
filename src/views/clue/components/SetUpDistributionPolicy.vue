<template>
  <SelfDialog
    class="dasdadad"
    title="设置分配policy"
    v-bind="$attrs"
    :width="'40%'"
    destroy-on-close
    :confirm="onConfirm"
    v-on="$listeners"
    @close="resetForm"
    @open="getOpen"
  >
    <el-form
      :model="queryInfo"
      label-width="80px"
      label-position="left"
    >
      <div class="title-tag">
        不可接受线索人员
      </div>
      <el-form-item label="小组">
        <el-select
          v-model="queryInfo.group"
          placeholder="请选择"
          @change="usreGroupChange"
        >
          <el-option
            v-for="item in userGroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="人员">
        <el-checkbox-group
          v-model="queryInfo.notReceiveIds"
        >
          <el-checkbox
            v-for="item in teamMemberList"
            :key="item.id"
            :label="item.id"
            name="type"
            @change="checkChange($event,item)"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="title-tag">
        已选择不可接收人员
      </div>
      <el-row :gutter="4">
        <el-tag
          v-for="(item,index) in chosenList"
          :key="item.id"
          style="margin-top:5px;margin-left:5px"
          effect="plain"
          closable
          @close="clearTags(index,item.id)"
        >
          {{ item.name }}
        </el-tag>
      </el-row>
      <p class="setup-title">
        设置成功后，随机分配线索时，选中的人员将不能接收到线索
      </p>
    </el-form>
  </SelfDialog>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { setrandomPolicy, searchInformation } from '@/api/clue'
import { getGroupInfoByCityCodeAndProductLine, GetSpecifiedRoleList } from '@/api/common'
@Component({
  name: 'SetUpDistributionPolicy',
  components: {
    SelfDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) policyData: any
  @Prop({ default: 0 }) clueType!: number
  private queryInfo: any = {
    group: [],
    notReceiveIds: [],
    cityCode: '',
    busiLine: '',
    clueType: ''
  }
  private userGroupList: any = [] // 小组列表
  private chosenList:any = [] // 已经选择人员
  private teamMemberList: any = [] // 人员数组
  // 获取小组
  async getUserGroupList() {
    let code = this.clueType
    if (this.clueType === 2) {
      code = 175
    } else if (this.clueType === 3) {
      code = 176
    }
    const { cityCode } = this.policyData
    try {
      let { data: res } = await getGroupInfoByCityCodeAndProductLine({ busiLine: String(code),
        cityCode: cityCode })
      if (res.success) {
        this.userGroupList = res.data.map((item:any) => ({
          id: item.id,
          name: item.name
        }))
      } else {
        // context.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get group fail:${err}`)
    } finally {
    //
    }
  }
  // 小组改变
  usreGroupChange(item: any) {
    // console.log(this.policyData.cityCode, item)
    this.getTeamMember(this.policyData.cityCode, item)
  }
  private getOpen() {
    this.getUserGroupList()
    if (this.chosenList && this.chosenList.length === 0) {
      this.getSearchInformation()
    }
  }
  // 提交后不可接受线索人员回显
  async getSearchInformation() {
    try {
      let notReceiveId = this.policyData.notReceiveId
      const { data: res } = await searchInformation({ userIds: notReceiveId })
      if (res.success) {
        this.chosenList = res.data.map(function(item: any) {
          return {
            name: item.name,
            id: item.id
          }
        })
        this.queryInfo.notReceiveIds = res.data.map(function(item: any) {
          return item.id
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (error) {
      return error
    }
  }
  // 获取组内人员
  async getTeamMember(cityCode:number, groupId: any) {
    try {
      let clueType = this.clueType
      let roleTypes = [1, 4]
      //  业务线大于1 的属于雷鸟
      if (clueType > 1) {
        if (clueType === 2) {
          roleTypes = [11]
        } else {
          roleTypes = [12]
        }
      }
      let params:any = {
        roleTypes,
        groupId,
        cityCode,
        uri: '/v2/clueH5/list/queryFollowerList'
      }
      const { data: res } = await GetSpecifiedRoleList(params)
      if (res.success) {
        this.teamMemberList = res.data.map(function(item: any) {
          return {
            name: item.name,
            id: item.id
          }
        })
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (error) {
      return error
    }
  }
  // 重置表单
  resetForm() {
    this.$nextTick(() => {
      this.queryInfo = {
        group: '',
        notReceiveIds: [],
        groupId: ''
      }
      this.chosenList = []
      this.teamMemberList = []
    })
  }
  // 提交表单
  async setPolicyConfirm(callback: Function) {
    try {
      const { notReceiveIds } = this.queryInfo
      let params = {
        notReceiveIds: notReceiveIds.join(','),
        groupId: this.policyData.id
      }
      const { data } = await setrandomPolicy(params)
      if (data.success) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        callback()
        this.$emit('success')
      } else {
        this.$message({
          message: data.errorMsg,
          type: 'error'
        })
      }
    } catch (err) {
      return err
    }
  }
  onConfirm(callback: Function) {
    this.setPolicyConfirm(callback)
  }
  // 人员改变
  checkChange(e:any, item:any) {
    if (e) {
      this.chosenList.push(item)
    } else {
      const inx = this.chosenList.findIndex((items:any) => items.id === item.id)
      // console.log(inx, item.id)
      if (inx !== -1) {
        this.chosenList.splice(inx, 1)
      }
    }
  }
  // 删除某个Tag
  clearTags(inx:any, id:any) {
    this.chosenList.splice(inx, 1)
    const index = this.queryInfo.notReceiveIds.indexOf(id)
    if (index !== -1) {
      this.queryInfo.notReceiveIds.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" >
.dasdadad {
  color: #333;
  .el-dialog__body {
    padding: 0px 45px 40px;
  }
  .title-tag {
    font-size: 16px;
    margin: 20px 0 30px 0;
    color: #333;
  }
  .setup-title {
    color: #999;
    font-size: 15px;
    margin: 60px 0 22px 0;
  }
}
</style>
