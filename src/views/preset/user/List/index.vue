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
interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfForm,
    UserList
  }
})
export default class extends Vue {
  private listQuery:IState = {
    status: '',
    mobile: '',
    nickName: ''
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
        placeholder: '请输入岗位职责',
        maxlength: 11,
        clearable: true
      },
      label: '电话',
      key: 'mobile'
    },
    {
      type: 8,
      tagAttrs: {
        placeholder: '请选择',
        'default-expanded-keys': true,
        'default-checked-keys': true,
        'node-key': 'a',
        clearable: true,
        props: {
          lazy: true,
          lazyLoad: this.showWork1
        }
      },
      label: '组织架构',
      key: 'a'
    },
    {
      type: 1,
      tagAttrs: {
        placeholder: '请输入角色名称',
        maxlength: 11,
        clearable: true
      },
      label: '角色名称',
      key: 'role'
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

  mounted() {
    this.getLists()
  }
  getLists() {
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
