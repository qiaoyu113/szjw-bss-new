<template>
  <div
    class="userManager"
    :class="{
      p15: isPC
    }"
  >
    <!-- 查询表单 -->
    <self-form
      :list-query="listQuery"
      :form-item="formItem"
      size="small"
      :pc-col="8"
      label-width="90px"
      class="p15 SuggestForm"
    >
      <template slot="officeId">
        <el-cascader
          v-model="listQuery.officeId"
          placeholder="请选择"
          clearable
          :props="{
            lazy: true,
            checkStrictly: true,
            lazyLoad: moreTreeData
          }"
        />
      </template>
      <div
        slot="btn"
        :class="isPC ? 'btnPc' : 'mobile'"
      >
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          type="primary"
          name="driverclue_filter_btn"
          @click="handleFilterClick"
        >
          查询
        </el-button>
        <el-button
          size="small"
          :class="isPC ? '' : 'btnMobile'"
          name="driverclue_reset_btn"
          @click="handleResetClick"
        >
          重置
        </el-button>
      </div>
    </self-form>
    <table-header
      :tab="[
        {
          name: '用户管理',
          label: '用户管理'
        }
      ]"
      active-name="用户管理"
    >
      <div class="subTitle">
        <router-link
          v-permission="['/v3/base/user/create']"
          :to="{path: '/roleSystem/addUser'}"
        >
          <el-button
            class="createUser"
            icon="el-icon-plus"
            type="primary"
            size="small"
          >
            新建用户
          </el-button>
        </router-link>
      </div>
    </table-header>

    <user-list
      ref="userlist"
      :list-query="listQuery"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import SelfForm from '@/components/Base/SelfForm.vue'
import UserList from '../components/UserLists.vue'
import TableHeader from '@/components/TableHeader/index.vue'
import { GetOfficeByCurrentUser1 } from '../index'
interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfForm,
    UserList,
    TableHeader
  }
})
export default class extends Vue {
  private listQuery:IState = {
    status: '',
    mobile: '',
    nickName: '',
    officeId: [],
    officeId1: [],
    roleName: ''
  }
  private formItem:any[] = [
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入用户姓名',
        maxlength: 10,
        clearable: true
      },
      label: '用户姓名',
      key: 'nickName'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入电话',
        maxlength: 11,
        clearable: true
      },
      label: '电话',
      key: 'mobile'
    },
    {
      type: 'officeId',
      label: '组织架构',
      key: 'officeId',
      slot: true
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入角色名称',
        maxlength: 20,
        clearable: true
      },
      label: '角色名称',
      key: 'roleName'
    },
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择账号状态',
        clearable: true,
        filterable: true
      },
      label: '账号状态',
      key: 'status',
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 2
        }
      ]
    }
  ]
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  async mounted() {
    this.getLists()
  }
  getLists() {
    if (this.listQuery.officeId && this.listQuery.officeId.length > 0) {
      this.listQuery.officeId1 = this.listQuery.officeId.map((item:string | number) => {
        if (typeof item === 'number') {
          return item
        } else {
          return item.split(',')[0]
        }
      }
      )
    } else {
      this.listQuery.officeId1 = []
    }

    (this.$refs.userlist as any).getLists()
  }

  showWork1(node: any, resolve: any) {
    let query: any = {
      parentId: ''
    }
    if (node.level > 0) {
      query.parentId = node.value
    }
    try {
      if (node.level === 0) {
        let nodes:[] = []
        resolve(nodes)
      } else if (node.level === 1) {
        let nodes:[] = []
        resolve(nodes)
      }
    } catch (err) {
      resolve([])
    }
  }

  // 重置表单
  handleResetClick() {
    this.listQuery = {
      status: '',
      mobile: '',
      nickName: ''
    }
  }
  // 查询
  handleFilterClick() {
    this.getLists()
  }
  async moreTreeData(node:any, resolve:Function) {
    let data = await GetOfficeByCurrentUser1(node)
    let arr:any = data
    if (arr.length === 0) {
      arr = undefined
    }
    return resolve(arr)
  }
}
</script>
<style lang="scss" scoped>
  .userManager {
    .SuggestForm {
      width: 100%;
      background: #fff;
      margin-bottom: 10px;
      margin-left:0px!important;
      margin-right:0px!important;
      box-shadow: 4px 4px 10px 0 rgba(218, 218, 218, 0.5);
    }
    .subTitle {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
      h4 {
        margin: 0px;
      }
      .createUser {
        margin-bottom:10px;
      }
    }
    .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: flex-end;
     }
    .mobile {
      width:100%;
      text-align: center;
      .btnMobile {
        margin-left: 0;
        margin-top: 10px;
        width:80%;
      }
    }
  }
</style>

<style scoped>
  .userManager >>> .el-card {
    border:none;
  }
  .userManager >>> .el-card__header {
    border-bottom: none;
  }
</style>
