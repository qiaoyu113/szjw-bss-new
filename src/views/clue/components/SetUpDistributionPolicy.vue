<template>
  <SelfDialog
    class="dasdadad"
    title="设置policy"
    v-bind="$attrs"
    :width="'40%'"
    destroy-on-close
    :confirm="onConfirm"
    v-on="$listeners"
    @close="resetForm"
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
          v-model="queryInfo.notReceiveId"
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
import { getUserGroup, getGroupUser, setPolicy } from '@/api/clue'
@Component({
  name: 'SetUpDistributionPolicy',
  components: {
    SelfDialog
  }
})
export default class extends Vue {
  @Prop({ default: () => {} }) policyData: any
  private queryInfo: any = {
    group: '',
    notReceiveId: []
  }
  private userGroupList: any = [] // 小组列表
  private chosenList:any = [] // 已经选择人员
  private teamMemberList: any = [] // 人员数组
  // 获取小组
  async getUserGroupList() {
    try {
      const { data } = await getUserGroup({})
      this.userGroupList = [{
        id: 'aa',
        name: '加盟一组'
      },
      {
        id: 'bb',
        name: '加盟二组'
      }]
    } catch (error) {
      return error
    }
  }
  // 小组改变
  usreGroupChange(item: any) {
    this.getTeamMember(item)
  }
  created() {
    this.getUserGroupList()
  }

  // 获取组内人员
  async getTeamMember(groudID: string) {
    try {
      const { data } = await getUserGroup({
        groudID
      })
      // this.teamMemberList = data.data
      let ares:any = []
      if (groudID === 'aa') {
        ares = [
          {
            id: '1',
            name: '小明'
          },
          {
            id: '2',
            name: '小刚'
          },
          {
            id: '3',
            name: '小红'
          }
        ]
      } else {
        ares = [
          {
            id: '4',
            name: 'xiaoming'
          },
          {
            id: '5',
            name: 'xiaoHong'
          },
          {
            id: '6',
            name: 'xiaoLAn'
          }
        ]
      }
      this.teamMemberList = ares
    } catch (error) {
      return error
    }
  }
  // 重置表单
  resetForm() {
    this.$nextTick(() => {
      this.queryInfo = {
        group: '',
        notReceiveId: []
      }
      this.chosenList = []
    })
  }
  // 提交表单
  async setPolicyConfirm(callback: Function) {
    try {
      const { notReceiveId, id, followingDayNum, followDayNum } = this.queryInfo
      let params = {
        notReceiveId: notReceiveId.join(','),
        id: this.policyData.id,
        followingDayNum: followingDayNum || '',
        followDayNum: followingDayNum || ''
      }
      const { data } = await setPolicy(params)
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
      console.log(inx, item.id)
      if (inx !== -1) {
        this.chosenList.splice(inx, 1)
      }
    }
  }
  // 删除某个Tag
  clearTags(inx:any, id:any) {
    this.chosenList.splice(inx, 1)
    const index = this.queryInfo.notReceiveId.indexOf(id)
    if (index !== -1) {
      this.queryInfo.notReceiveId.splice(index, 1)
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
