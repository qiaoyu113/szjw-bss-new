<template>
  <div
    v-loading="listLoading"
    class="opUser"
    :style="{
      padding: isPC ? '15px' :'0px'
    }"
  >
    <el-card>
      <div
        slot="header"
        class="title"
      >
        <h4>
          {{ userId ? '编辑用户':'创建账户' }}
        </h4>
      </div>
      <self-form
        ref="addUserForm"
        :class="isPC ? 'userForm' : ''"
        :pc-col="14"
        :m-block="true"
        :list-query="listQuery"
        :form-item="formItem"
        label-width="140px"
        :rules="userId ? rules2: rules1"
        @onPass="handlePassClick"
      >
        <template slot="userName">
          <el-input
            v-model="listQuery.userName"
            maxlength="10"
            placeholder="请输入"
          />
        </template>
        <template slot="officeId">
          <template v-if="!!userId">
            <el-input
              v-model="listQuery.officeName"
              :disabled="true"
            />
          </template>
          <template v-else>
            <el-cascader
              v-model="listQuery.officeId"
              :disabled="!!userId"
              placeholder="请选择"
              :props="{
                lazy: true,
                checkStrictly: true,
                lazyLoad: moreTreeData
              }"
              @change="handleOfficeIdChange"
            />
          </template>
        </template>
        <template slot="roleId">
          <el-row
            v-for="(item,idx) in (!!userId ? listQuery.roleNames :listQuery.roleId)"
            :key="idx"
            style="width:100%;margin-bottom: 10px;"
          >
            <el-col :span="22">
              <el-input
                v-if="!!userId"
                v-model="item.roleName"
                :disabled="true"
              />
              <el-cascader
                v-else
                v-model="item.roleId"
                :disabled="item.roleId.length > 0"
                placeholder="请选择"
                :props=" {
                  value: 'id',
                  label: 'dutyName',
                  children: 'childDuty'
                }"
                :options="roleArr"
                @change="handleCascaderChange"
              />
            </el-col>
            <el-col
              v-if="!userId"
              :span="2"
            >
              <i
                v-if="idx===0"
                class="el-icon-plus"
                @click.stop="handleAddRole"
              />
              <i
                v-if="idx > 0"
                class="el-icon-minus"
                @click.stop="handleDelRole(idx)"
              />
            </el-col>
          </el-row>
        </template>
        <template slot="passwd">
          <el-input
            v-model.trim="listQuery.passwd"
            onkeyup="this.value=this.value.replace(' ','')"
            :disabled="!!userId"
            :readonly="!userId"
            placeholder="请输入"
            :type="!userId ? 'text' :'password'"
            :show-password="!!userId"
          />
        </template>
        <template
          v-if="userId"
          slot="confirmPassword"
        >
          <el-input
            v-model.trim="listQuery.confirmPassword"
            onkeyup="this.value=this.value.replace(' ','')"
            :disabled="!!userId"
            placeholder="请输入"
            type="password"
            show-password
          />
        </template>
        <template
          slot="mobile"
        >
          <el-input
            v-model.trim="listQuery.mobile"
            :disabled="!!userId"
            maxlength="11"
            placeholder="请输入"
          />
        </template>
        <template
          v-slot:syncStatus="scope"
        >
          <span>{{ scope.row.syncStatus ? '已同步':'未同步' }}</span>
        </template>
        <template
          v-slot:crmUserStatus="scope"
        >
          <span>{{ scope.row.crmUserStatus }}</span>
        </template>
        <div
          slot="btn"
          :class="isPC ? 'btnPc' : 'mobile'"
        >
          <router-link
            :to="{path: '/roleSystem/user'}"
            style="margin-right:20px;"
          >
            <el-button>取消</el-button>
          </router-link>

          <el-button
            type="primary"
            @click="handleValidateForm"
          >
            确定
          </el-button>
        </div>
      </self-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SelfForm from '@/components/Base/SelfForm.vue'
import { isValidPassWord, lock } from '@/utils/index'
import { GetUserDetail, UpdateUser, CreateUser } from '@/api/preset'
import { delayTime } from '@/settings'
import { SettingsModule } from '@/store/modules/settings'
import { GetDutyAndRoleList, GetOfficeByCurrentUser1 } from '../index'
interface IState {
  [key: string]: any;
}

@Component({
  components: {
    SelfForm
  }
})
export default class extends Vue {
  [x: string]: any
  userId:string| number = ''
  private listLoading:boolean = false
  private officeArr = [] // 组织架构列表
  private roleArr = [] // 角色列表
  private listQuery:IState = {
    id: '',
    userName: '',
    mobile: '',
    officeId: [],
    officeName: '',
    roleId: [{ roleId: '' }],
    roleNames: [],
    passwd: 'Aa123456',
    confirmPassword: '',
    nickName: '',
    roleName: '',
    crmUserStatus: '',
    syncStatus: false,
    status: 0
  }
  sourcePhone:string = ''
  private formItem:any[] = [
    {
      type: 'userName',
      key: 'userName',
      label: '用户姓名:',
      slot: true
    },
    {
      type: 'mobile',
      key: 'mobile',
      label: '电话:',
      slot: true
    },
    {
      key: 'officeId',
      type: 'officeId',
      label: '组织结构:',
      slot: true
    },
    {
      key: 'roleId',
      type: 'roleId',
      label: '角色:',
      slot: true,
      class: 'role'
    },
    {
      key: 'passwd',
      type: 'passwd',
      label: '密码:',
      slot: true
    }
  ]
  private rules1:any ={
    userName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { validator: this.validatePhone, trigger: 'blur' }
    ],
    officeId: [
      { required: true, message: '请选择组织机构', trigger: 'blur' }
    ],
    roleId: [
      { required: true, message: '请选择角色', trigger: 'blur' }
    ],
    passwd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
      { validator: this.validatePasswd, trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
      { validator: this.validateConfirmPassword, trigger: 'blur' }
    ]
  }
  private rules2:any ={
    userName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ]
  }

  // 验证手机号
  private validatePhone(rule:any, value:string, callback:(string?: Error) => void) {
    if (!/\d{8,11}/.test(value)) {
      return callback(new Error('请输入正确的手机号'))
    }
    return callback()
  }
  private validatePasswd(rule:any, value:string, callback:(string?: Error) => void) {
    if (!isValidPassWord.test(value)) {
      return callback(new Error('密码必须包含8-16，数字，大写字母，小写字母'))
    }
    return callback()
  }
  private validateConfirmPassword(rule:any, value:string, callback:(string?: Error) => void) {
    if (!isValidPassWord.test(value)) {
      return callback(new Error('密码必须包含8-16，数字，大写字母，小写字母'))
    } else if (value !== this.listQuery.passwd) {
      return callback(new Error('确认密码和密码不一致，请检查'))
    }
    return callback()
  }
  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }
  // 提交
  handlePassClick(valid:boolean) {
    if (this.listQuery.id) {
      this.modifyUser()
    } else {
      this.addUser()
    }
  }
  // 表单校验
  handleValidateForm() {
    ((this.$refs.addUserForm) as any).submitForm()
  }

  // 获取用户信息
  async getUserDetail() {
    try {
      if (!this.userId) {
        return false
      }
      let params:IState = {
        userId: +this.userId
      }
      let { data: res } = await GetUserDetail(params)
      if (res.success) {
        let result = res.data
        let roleNameArr = result.roleNames.split(',')
        let roleNames:IState[] = []
        roleNameArr.forEach((item:string) => {
          roleNames.push({
            roleName: item
          })
        })

        this.sourcePhone = result.mobile
        this.listQuery = {
          id: result.id,
          userName: result.nickName,
          mobile: result.mobile,
          officeName: result.officeNames,
          roleNames,
          passwd: '123456789qQ',
          confirmPassword: '123456789qQ',
          nickName: result.nickName,
          crmUserStatus: result.crmUserStatus,
          syncStatus: result.syncStatus,
          status: result.status
        }
        if (result.syncStatus) {
          this.formItem.push({
            type: 'syncStatus',
            label: 'CRM账号同步状态:',
            slot: true
          })
          this.formItem.push({
            type: 'crmUserStatus',
            label: 'CRM账号状态:',
            slot: true
          })
        }
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`get user info fail:${err}`)
    }
  }

  // 组织架构发生变化
  async handleOfficeIdChange(val:any[]) {
    this.listQuery.roleId = [{ roleId: '' }]
    let params:IState = {
      dutyId: '',
      officeLevel: ''
    }
    let lastNode = val[val.length - 1]
    let lastArr:any[] = []
    if (typeof lastNode === 'number') {
      lastArr = [lastNode]
    } else {
      lastArr = lastNode.split(',')
    }

    let officeLevel = 1
    if (lastArr[1] > 3) {
      officeLevel = 3
    } else {
      officeLevel = lastArr[1]
    }
    params.dutyId = lastArr[2]
    params.officeLevel = officeLevel
    try {
      this.roleArr = []
      let result = await GetDutyAndRoleList(params)
      this.roleArr.push(...result)
    } catch (err) {
      this.roleArr = []
    } finally {
      //
    }
  }
  // 新增用户
  @lock
  async addUser() {
    try {
      this.listLoading = true
      let roleId:number[] = []
      this.listQuery.roleId.forEach((item:IState) => {
        roleId.push(Number(item.roleId[item.roleId.length - 1]))
      })

      let params:any = {
        ...this.listQuery,
        nickName: this.listQuery.userName,
        officeId: this.listQuery.officeId[this.listQuery.officeId.length - 1].split(',')[0],
        roleIds: roleId.filter((item:any) => item)
      }
      params.confirmPassword = params.passwd
      delete params.id
      delete params.roleName
      delete params.crmUserStatus
      delete params.syncStatus
      delete params.status
      delete params.roleNames
      delete params.roleId
      let { data: res } = await CreateUser(params)
      if (res.success) {
        this.$message.success('创建成功')
        this.jumplist()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`addUser fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 修改用户
  async modifyUser() {
    try {
      this.listLoading = true
      let params:any = {
        id: this.listQuery.id,
        nickName: this.listQuery.userName,
        userName: this.listQuery.userName
      }
      if (this.sourcePhone !== this.listQuery.mobile) {
        params.mobile = this.listQuery.mobile
      }
      let { data: res } = await UpdateUser(params)
      if (res.success) {
        if (this.sourcePhone !== this.listQuery.mobile && this.listQuery.syncStatus) {
          this.$message.success('无法更改CRM中手机号，建议在本系统重新创建以新手机号为账号，并同至CRM，并前往CRM中删除相关账号')
        } else {
          this.$message.success('修改成功')
        }
        this.jumplist()
      } else {
        this.$message.error(res.errorMsg)
      }
    } catch (err) {
      console.log(`modify user fail:${err}`)
    } finally {
      this.listLoading = false
    }
  }
  // 跳转到用户列表
  jumplist() {
    setTimeout(() => {
      this.$router.push({
        path: '/roleSystem/user'
      })
    }, delayTime)
  }
  // 组织架构获取回显数据
  getTreeSelectOffice(data:any, value:string|number) {
    let arr:any[] = []
    let setChecked = (obj:any) => {
      for (let key in obj) {
        if (!obj[key]) {
          return false
        }
        const offList = obj[key].parentIds.split(',').map((item:string|number) => +item)
        offList.push(obj[key].id)
        if (offList.includes(value)) {
          arr = offList
          return false
        }

        if (obj[key].officeVOs && obj[key].officeVOs.length > 0) {
          setChecked(obj[key].officeVOs)
        }
      }
    }
    setChecked(data)
    arr.shift()
    return arr
  }

  // 重置表单
  resetForm() {
    ((this.$refs.addUserForm) as any).resetForm()
    this.listQuery = {
      id: '',
      userName: '',
      mobile: '',
      officeId: [],
      roleId: [],
      passwd: '',
      confirmPassword: '',
      nickName: ''
    }
  }
  beforeRouteLeave(to:any, from:any, next:Function) {
    this.resetForm()
    next()
  }
  // 添加角色
  handleAddRole() {
    this.listQuery.roleId.unshift({
      roleId: ''
    })
  }
  // 删掉角色
  handleDelRole(idx:number) {
    if (idx > 0) {
      this.listQuery.roleId.splice(idx, 1)
    }
  }
  // 角色发生变化
  handleCascaderChange() {
    let arr = this.listQuery.roleId.map((item:IState) => item.roleId.join('-'))
    if (arr.length > 1) {
      let last = arr[arr.length - 1]
      let brr = JSON.parse(JSON.stringify(arr))
      brr.pop()
      let index = brr.findIndex((item:string) => item === last)
      if (index > -1) {
        this.$message.warning('选择角色重复')
        this.listQuery.roleId.pop()
      }
    }
  }
  async mounted() {
    this.userId = +this.$route.query.userId || ''
    if (this.userId) {
      let add = {
        key: 'confirmPassword',
        type: 'confirmPassword',
        label: '确认密码:',
        slot: true
      }
      this.formItem.push(add)
    }

    try {
      this.getUserDetail()
    } catch (err) {
      //
    } finally {
      //
    }
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
  .opUser {
     .title {
      h4 {
        margin: 0px;
      }
     }
     .userForm {
       padding-left: 100px;
     }
     .btnPc {
       display: flex;
       flex-flow: row nowrap;
       justify-content: center;
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
  .opUser >>> .el-card {
    border:none;
  }
  .opUser >>> .el-card__header {
    border-bottom: none;
  }
  .opUser >>> .role .el-form-item__content {
    display: flex;
    flex-direction: column;
  }
  .opUser >>> .el-icon-plus, .opUser >>> .el-icon-minus {
    margin-left: 10px;
    font-size: 26px;
    vertical-align: middle;
    font-weight: bold;
    color: #80B436;
    cursor: pointer;
  }
</style>
