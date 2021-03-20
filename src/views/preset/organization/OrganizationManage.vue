<template>
  <div :class="isPC ? 'OrganizationManagement' : 'OrganizationManagement-m'">
    <SectionContainer
      v-loading="loading"
      title="组织管理"
    >
      <RoleTree
        ref="tree"
        :key="treeKey"
        :data="data"
        :props="defaultProps"
        node-key="id"
        :default-expand-all="false"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        draggable
        @node-drop="handleDrop"
        @node-drag-start="handleDragStart"
      >
        <template slot-scope="{node, data}">
          <svg-icon
            class="tree-icon"
            :name="'type_' + data.type"
          />
          <span class="mr10">{{ node.label }}</span>
          <!-- <el-badge
            type="primary"
            :value="data.userCount"
            class="mr10"
          /> -->
          <div class="right-btn">
            <el-button
              v-if="data.type !== 5"
              v-permission="['/v2/base/office/create']"
              circle
              size="mini"
              name="organizationmanage_appendOffice_btn"
              icon="el-icon-circle-plus-outline"
              @click.stop="
                () => {
                  appendOffice(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v2/base/office/delete']"
              circle
              size="mini"
              name="organizationmanage_deleteOffice_btn"
              class="delete"
              icon="el-icon-remove-outline"
              @click.stop="
                () => {
                  deleteOffice(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v2/base/office/update']"
              circle
              size="mini"
              icon="el-icon-edit"
              name="organizationmanage_updateOffice_btn"
              @click.stop="
                () => {
                  updateOffice(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v1/base/office/sort']"
              circle
              size="mini"
              icon="el-icon-top"
              name="organizationmanage_upOffice_btn"
              @click.stop="
                () => {
                  upOffice(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v1/base/office/sort']"
              circle
              size="mini"
              icon="el-icon-bottom"
              name="organizationmanage_downOffice_btn"
              @click.stop="
                () => {
                  downOffice(node, data);
                }
              "
            />
          </div>
        </template>
      </RoleTree>
      <RoleTree
        ref="tree2"
        :props="defaultProps"
        :data="data2"
        node-key="id"
        :default-expand-all="false"
        :load="getOfficeListPost"
        lazy
        style="margin-top: -20px"
      >
        <template slot-scope="{node, data}">
          <svg-icon
            class="tree-icon"
            :name="'type_' + data.type"
          />
          <span class="mr10">{{ node.label }}</span>
          <!-- <el-badge
            type="primary"
            :value="data.userCount"
            class="mr10"
          /> -->
          <div class="right-btn">
            <el-button
              v-if="!node.isLeaf && data.id !== -2"
              v-permission="['/v2/base/office/create']"
              circle
              size="mini"
              name="organizationmanage_appendOffice_btn"
              icon="el-icon-circle-plus-outline"
              @click.stop="
                () => {
                  appendOffice(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v2/base/office/delete']"
              circle
              size="mini"
              name="organizationmanage_deleteOffice_btn"
              class="delete"
              icon="el-icon-remove-outline"
              @click.stop="
                () => {
                  deleteOffice(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v2/base/office/update']"
              circle
              size="mini"
              icon="el-icon-edit"
              name="organizationmanage_updateOffice_btn"
              @click.stop="
                () => {
                  updateOffice(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v1/base/office/sort']"
              circle
              size="mini"
              icon="el-icon-top"
              name="organizationmanage_upOffice_btn"
              @click.stop="
                () => {
                  upOffice2(node, data);
                }
              "
            />

            <el-button
              v-if="data.type !== 1"
              v-permission="['/v1/base/office/sort']"
              circle
              size="mini"
              icon="el-icon-bottom"
              name="organizationmanage_downOffice_btn"
              @click.stop="
                () => {
                  downOffice2(node, data);
                }
              "
            />
          </div>
        </template>
      </RoleTree>
    </SectionContainer>
    <SelfDialog
      :visible.sync="showDialog"
      :title="dialogTit"
      :confirm="confirm"
      @closed="resetDialog"
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="dialogForm"
        label-width="120px"
      >
        <template v-if="isAdd">
          <div>
            <el-form-item
              v-if="addData.type ===1"
              label="组织名称"
              prop="name"
            >
              <el-input
                v-model="dialogForm.name"
                placeholder="请输入组织名称"
                maxlength="10"
                show-word-limit
                clearable
                name="organizationmanage_chooseName2_input"
              />
            </el-form-item>
          </div>

          <el-form-item
            v-if="addData.type === 2"
            label="城市"
            prop="areaCode"
          >
            <el-cascader
              ref="cascader"
              v-model="dialogForm.areaCode"
              :options="optionsArea"
              :props="props"
              clearable
              @change="handleChange"
            />
            <el-input
              v-model="dialogForm.name"
              class="opacity"
              placeholder="请选择"
              name="organizationmanage_chooseAreaCode1_input"
            />
          </el-form-item>
          <el-form-item
            v-else-if="addData.type === 3"
            label="业务线"
            prop="dutyId"
          >
            <el-select
              v-model="dialogForm.dutyId"
              filterable
              placeholder="请选择业务线"
              @change="changeDuty"
            >
              <el-option
                v-for="item in busitypeOptions"
                :key="item.id"
                :label="item.dutyName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-else-if="addData.type === 4"
            label="小组"
            prop="name"
          >
            <el-input
              v-model="dialogForm.name"
              maxlength="10"
              show-word-limit
              clearable
              name="organizationmanage_chooseName2_input"
              placeholder="请输入小组"
            />
          </el-form-item>
          <el-form-item
            label="上级组织"
            prop="parent"
          >
            <el-input
              :value="addData.name"
              disabled
              placeholder="上级组织"
              clearable
              name="organizationmanage_upName_input"
            />
          </el-form-item>
          <el-form-item
            v-if="addData.type === 3"
            label="同步节点至其他城市"
            prop="cityList"
          >
            <el-cascader
              :key="isResouceShow"
              ref="cityList"
              :options="data3"
              :props="propsCity"
              :show-all-levels="false"
              collapse-tags
              clearable
              class="city-cascader"
              :disabled="dialogForm.dutyId === ''"
              @remove-tag="isResouceShow++"
            />
          </el-form-item>
        </template>
        <template v-else>
          <template v-if="addData.type === 2">
            <div>
              <el-form-item
                label="组织名称"
                prop="name"
              >
                <el-input
                  v-model="dialogForm.name"
                  placeholder="请输入组织名称"
                  maxlength="10"
                  clearable
                  name="organizationmanage_chooseName4_input"
                />
              </el-form-item>
            </div>
          </template>
          <!-- <el-form-item
            v-if="addData.type === 3"
            label="城市"
            prop="areaCode"
          >
            <test
              :form="dialogForm"
            />
          </el-form-item> -->
          <el-form-item
            v-if="addData.type === 3 "
            label="城市"
            prop="areaCode"
          >
            <el-cascader
              ref="cascader"
              v-model="areaList"
              :options="optionsArea"
              :props="props"
              :show-all-levels="false"
              clearable
              placeholder=""
              @change="handleChange"
            />
            <el-input
              v-model="dialogForm.name"
              class="opacity"
              placeholder="请选择"
              name="organizationmanage_chooseName3_input"
            />
          </el-form-item>
          <el-form-item
            v-else-if="addData.type === 4"
            label="业务线"
            prop="dutyId"
          >
            <el-select
              v-model="dialogForm.dutyId"
              filterable
              placeholder="请选择业务线"
              @change="changeDuty"
            >
              <el-option
                v-for="item in busitypeOptions"
                :key="item.id"
                :label="item.dutyName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-else-if="addData.type === 5"
            label="小组"
            prop="name"
          >
            <el-input
              v-model="dialogForm.name"
              maxlength="10"
              show-word-limit
              clearable
              name="organizationmanage_chooseName2_input"
              placeholder="请输入小组"
            />
          </el-form-item>
          <el-form-item
            label="上级组织"
            prop="parent"
          >
            <el-input
              :value="addData.parentName"
              disabled
              placeholder="上级组织"
              clearable
              name="organizationmanage_upName_input"
            />
          </el-form-item>
        </template>
      </el-form>
    </SelfDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import { SettingsModule } from '@/store/modules/settings'
import { RoleTree } from '../components'
import SelfDialog from '@/components/SelfDialog/index.vue'
import { GetArea } from '@/api/common'
import { lock } from '@/utils/index'
import {
  getOfficeListPost,
  createOffice,
  sortOffice,
  updateOffice,
  deleteOffice,
  createAll,
  officeDrag
} from '@/api/role-system'
import {
  getOfficeList,
  getDutyListByLevel
} from '@/api/system'
import '@/styles/common.scss'
interface IState {
  [key: string]: any;
}
@Component({
  name: 'CreateRole',
  components: {
    SectionContainer,
    RoleTree,
    SelfDialog
  }
})
export default class extends Vue {
  private isResouceShow = 0
  private treeKey = 0
  private copyData = {} // 深拷贝data
  private defaultExpandAll: boolean = false;
  private loading: boolean = false;
  private data: any = [];
  private data2: any = [];
  private data3: any = [];
  private defaultProps: any = {
    children: 'officeVOs',
    label: 'name',
    isLeaf: 'leaf'
  };
  private addNode: any = {};
  private addData: any = {};

  // 弹窗
  private cityList: any = []; // 同步至其他城市
  private showDialog: boolean = false;
  private activeName: string = 'first';
  private dialogTit: string = '新建组织';
  private dialogForm: any = {
    name: '',
    parentId: 0,
    parentIds: '',
    type: 0,
    dutyId: '',
    areaCode: []
  };

  private busitypeOptions: any = [];
  private optionsArea: any = [];
  private props: any = {
    label: 'name',
    value: 'code',
    lazy: true,
    async lazyLoad(node: any, resolve: any) {
      const { value } = node
      if (node.children.length > 0) {
        resolve(node.children)
        return
      }
      GetArea(['100000', value]).then(({ data }) => {
        if (data.success) {
          const nodes = data.data.map((item: any) => {
            item.leaf = 2
            return item
          })
          resolve(nodes)
        } else {
          this.$message.error(data)
        }
      })
    }
  };
  private propsCity: any = {
    multiple: true,
    label: 'name',
    value: 'id',
    children: 'officeVOs'
  }

  private areaList: any = [];
  private rules: any = {
    name: [
      { required: true, message: '请输入组织名称', trigger: 'blur' }
    ],
    dutyId: [{ required: true, message: '请选择业务线', trigger: 'change' }],
    areaCode: [{ required: true, message: '请选择城市', trigger: 'change' }]
  };
  private isAdd: boolean = false;
  private disabled: boolean = false;

  // 判断是否是PC
  get isPC() {
    return SettingsModule.isPC
  }

  private appendOffice(node: any, data: any) {
    this.addNode = node
    this.addData = data
    this.dialogTit = '新建组织'
    this.isAdd = true
    this.showDialog = true
    if (this.addData.type === 3) {
      this.getBusitype()
    }
  }
  private updateOffice(node: any, data: any) {
    this.addNode = node
    this.addData = data
    this.dialogTit = '编辑组织'
    this.isAdd = false
    this.dialogForm.name = data.name
    this.dialogForm.areaCode = data.areaCode
    this.dialogForm.dutyId = data.dutyId || ''
    this.showDialog = true
    if (this.addData.type === 4) {
      this.getBusitype()
    }
  }
  private async upOffice(node: any, item: any) {
    // 向上
    if (this.disabled) {
      return
    }
    const prev = node.previousSibling
    const parent = node.parent
    if (!prev) {
      this.$message.error(`处于顶端，不能继续上移`)
      return
    }
    const nodeExpaned = node.expanded
    const prevExpaned = prev.expanded
    this.disabled = true
    this.sortOffice(
      {
        fromId: node.data.id,
        toId: prev.data.id
      },
      () => {
        const children = parent.data.officeVOs || parent.data
        const index = children.findIndex((item: any) => {
          return prev.data.id === item.id
        })
        children.splice(
          index,
          2,
          JSON.parse(JSON.stringify(node.data)),
          JSON.parse(JSON.stringify(prev.data))
        )
        this.$nextTick(() => {
          let node1 = (this.$refs['tree'] as any).$refs['roleTree'].getNode(
            node.data.id
          )
          node1.expanded = nodeExpaned
          let prev1 = (this.$refs['tree'] as any).$refs['roleTree'].getNode(
            prev.data.id
          )
          prev1.expanded = prevExpaned
        })
      }
    )
  }
  private async downOffice(node: any, item: any) {
    // 下
    if (this.disabled) {
      return
    }
    const next = node.nextSibling
    const parent = node.parent
    if (!next) {
      this.$message.error(`处于末端，不能继续下移`)
      return
    }
    const nodeExpaned = node.expanded
    const nextExpaned = next.expanded

    this.disabled = true
    this.sortOffice(
      {
        fromId: node.data.id,
        toId: next.data.id
      },
      () => {
        const children = parent.data.officeVOs || parent.data
        const index = children.findIndex((item: any) => {
          return node.data.id === item.id
        })
        children.splice(
          index,
          2,
          JSON.parse(JSON.stringify(next.data)),
          JSON.parse(JSON.stringify(node.data))
        )
        this.$nextTick(() => {
          let node1 = (this.$refs['tree'] as any).$refs['roleTree'].getNode(
            node.data.id
          )
          node1.expanded = nodeExpaned
          let next1 = (this.$refs['tree'] as any).$refs['roleTree'].getNode(
            next.data.id
          )
          next1.expanded = nextExpaned
        })
      }
    )
  }
  private async upOffice2(node: any, item: any) {
    // 向上
    if (this.disabled) {
      return
    }
    const parent = node.parent
    const children = parent.childNodes
    const prev = node.previousSibling
    if (!prev) {
      this.$message.error(`处于顶端，不能继续上移`)
      return
    }
    this.disabled = true
    this.sortOffice(
      {
        fromId: node.data.id,
        toId: prev.data.id
      },
      () => {
        let index = children.findIndex((item: any) => item.data.id === node.data.id);
        ([children[index], children[index - 1]] = [children[index - 1], children[index]])
        parent.expanded = !parent.expanded
        this.$nextTick(() => {
          parent.expanded = !parent.expanded
        })
      }
    )
  }
  private async downOffice2(node: any, item: any) {
    // 下
    if (this.disabled) {
      return
    }
    const parent = node.parent
    const next = node.nextSibling
    const children = parent.childNodes
    if (!next) {
      this.$message.error(`处于末端，不能继续下移`)
      return
    }
    this.disabled = true

    this.sortOffice(
      {
        fromId: node.data.id,
        toId: next.data.id
      },
      () => {
        let index = children.findIndex((item: any) => item.data.id === node.data.id);
        ([children[index], children[index + 1]] = [children[index + 1], children[index]])
        parent.expanded = !parent.expanded
        this.$nextTick(() => {
          parent.expanded = !parent.expanded
        })
      }
    )
  }
  private async sortOffice(postData: any, callback: any) {
    const { data } = await sortOffice(postData)
    this.disabled = false
    if (data.success) {
      callback && callback()
    } else {
      this.$message.error(data)
    }
  }
  private async getBusitype() {
    let params = {
      dutyLevel: 1
    }
    try {
      let { data: res } = await getDutyListByLevel(params)
      this.busitypeOptions = res.data
    } catch (err) {
      console.log(err)
    } finally {
      console.log('err')
    }
  }
  private async confirm(done: any) {
    (this.$refs['dialogForm'] as any).validate((valid: boolean) => {
      if (valid) {
        this.saveData()
      }
    })
  }
  @lock
  async saveData() {
    try {
      this.dialogForm.parentId = this.addData.id
      this.dialogForm.parentIds = this.addData.parentIds + ',' + this.addData.id
      let submitForm = createOffice
      if (this.isAdd) {
        // 添加
        let params:IState = {
          name: '',
          parentId: 0,
          parentIds: '',
          type: 0,
          dutyId: '',
          areaCode: ''
        }
        params.name = this.dialogForm.name
        params.type = this.addData.type + 1
        params.parentIds = `${this.addData.parentIds},${this.addData.id}`
        if (this.addData.type === 2) {
          params.areaCode = this.dialogForm.areaCode
        }
        if (this.addData.type === 3) {
          submitForm = createAll
          params.dutyId = this.dialogForm.dutyId
          let list = []
          // 处理list数组
          const cityList = (this.$refs['cityList'] as any).getCheckedNodes(true)
          if (cityList.length === 0) {
            list = [{
              'parentId': this.addData.id,
              'parentIds': params.parentIds
            }]
          } else {
            list = cityList.map((item: any) => ({ parentId: item.data.id, parentIds: `${item.data.parentIds},${item.data.id}` }))
            if (!cityList.some((item : any) => item.data.id === this.addData.id)) {
              list.push({
                'parentId': this.addData.id,
                'parentIds': params.parentIds
              })
            }
          }
          params.parentMessages = list
        }
        if (this.addData.type === 4) {
          params.dutyId = this.addData.dutyId
        }
        params.parentId = this.addData.id
        const { data } = await submitForm(params)
        if (data.success) {
          this.$message.success(`创建成功`)
          if (this.addData.type === 3) {
            this.getOfficeList()
          } else {
            if (this.addNode.data.id === 16 && this.addNode.level === 1) {
              this.append2(data.data)
            } else {
              this.append(data.data)
            }
          }
          this.showDialog = false
          this.resetDialog()
        } else {
          this.$message.error(data)
        }
      } else {
        // 编辑
        let params = {
          id: this.addData.id,
          name: this.dialogForm.name,
          areaCode: this.dialogForm.areaCode,
          dutyId: ''
        }
        if (this.addData.type === 4) {
          params.dutyId = this.dialogForm.dutyId
        }
        const { data } = await updateOffice(params)
        if (data.success) {
          this.$message.success(`编辑成功`)
          this.update(this.dialogForm)
          this.showDialog = false
          this.resetDialog()
        } else {
          this.$message.error(data)
        }
      }
    } catch (err) {
      console.log(`submit fail:${err.message}`)
    } finally {
      console.log(`finally`)
    }
  }
  // 清楚dialog
  private resetDialog() {
    this.dialogForm.name = ''
    this.dialogForm.areaCode = ''
    this.dialogForm.dutyId = ''
    this.areaList = []
    this.activeName = 'first'
    this.$nextTick(() => {
      (this.$refs.dialogForm as any).clearValidate()
    })
  }
  private handleChange(value: any) {
    this.dialogForm.areaCode = value.slice().pop() || ''
    const node = (this.$refs.cascader as any).getCheckedNodes()
    if (node && node[0]) {
      this.dialogForm.name = node[0].label
    } else {
      this.dialogForm.name = ''
    }
    if (value !== '') {
      this.isResouceShow++
    }
  }
  // 获取组织管理列表
  private async getOfficeList(cb: any = () => {}) {
    this.loading = true
    const { data } = await getOfficeList()
    this.loading = false
    if (data.success) {
      this.treeKey = +new Date()
      this.data = JSON.parse(JSON.stringify(data.data))
      const list = data.data[0].officeVOs
      const fact = (list: any) => {
        for (let index = 0; index < list.length; index++) {
          const item = list[index]
          if (item.type > 3) {
            list.splice(index, 1)
            // 手动后退，避免漏掉元素
            index--
          } else if (item.type === 3) {
            item.children = item.officeVOs
            item.officeVOs = undefined
          } else {
            fact(item.officeVOs)
          }
        }
      }
      fact(list)
      this.data3 = [
        {
          name: '全部城市',
          officeVOs: [...list]
        }
      ]
      cb()
    } else {
      this.$message.error(data)
    }
  }
  // 获取组织管理列表（第二课tree）
  // getOfficeListPost
  private async getOfficeListPost(node: any, resolve: any) {
    let postData = {
      type: [2],
      parentId: undefined
    }
    if (node.level === 0) {
      // 请求第一级 初始化
      resolve([
        {
          id: 16,
          name: '大区公共组织',
          type: 1,
          parentId: 0,
          parentIds: '0',
          officeVOs: [],
          userCount: 0,
          leaf: false,
          datalevel: 1
        },
        {
          id: -2,
          name: '总部组织',
          type: 1,
          parentId: 0,
          parentIds: '0',
          officeVOs: [],
          userCount: 0,
          leaf: true
        }
      ])
      return
    } else if (node.level === 1) {
      postData.type = [2]
    } else {
      postData.parentId = node.data.id
      postData.type = []
    }
    const { data } = await getOfficeListPost(postData)
    if (data.success) {
      let arr = data.data
      if ((node.data.id === 16 && node.level === 1) || (node.parent.data.id === -2 && node.level === 2)) {
        arr = data.data.map((item: any) => {
          item.leaf = true
          return item
        })
      }
      resolve(arr || [])
    } else {
      this.$message.error(data)
    }
  }
  // 展开所有节点
  openAll() {
    const nodes = (this.$refs['tree'] as any).$refs['roleTree'].store._getAllNodes()
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].expanded = true
    }
  }
  // 删除
  private async deleteOffice(node: any, item: any) {
    this.$confirm(`您确定要删除“${item.name}”吗？`, '删除组织', {
      type: 'warning'
    })
      .then(async() => {
        const { data } = await deleteOffice({
          id: item.id
        })
        if (data.success) {
          this.$message.success(`删除成功`)
          if (node.parent.data.datalevel === 1) {
            this.remove2(node, item)
          } else {
            this.remove(node, item)
          }
        } else {
          this.$message.error(data)
        }
      })
      .catch(() => {})
  }
  private remove2(node: any, data: any) {
    (this.$refs['tree2'] as any).$refs['roleTree'].remove(node)
  }
  // 删除tree 节点
  private remove(node: any, data: any) {
    const parent = node.parent
    const children = parent.data.officeVOs || parent.data
    const index = children.findIndex((d: any) => {
      return d.id === data.id
    })
    children.splice(index, 1)
  }
  // append tree节点
  private append(data: any) {
    const newChild = { ...data }
    if (!this.addData.officeVOs) {
      this.$set(this.addData, 'officeVOs', [])
    }
    this.addData.officeVOs.push(newChild)
  }
  // append tree节点
  private append2(data: any) {
    const newChild = {
      ...data,
      leaf: true
    };
    (this.$refs['tree2'] as any).$refs['roleTree'].append(newChild, this.addNode)
    // if (!this.addData.officeVOs) {
    //   this.$set(this.addData, 'officeVOs', [])
    // }
    // this.addData.officeVOs.push(newChild)
  }
  // update tree节点
  private update(item: any) {
    this.$set(this.addNode.data, 'name', item.name)
    this.$set(this.addNode.data, 'areaCode', item.areaCode)
    this.$set(this.addNode.data, 'dutyId', item.dutyId)
  }
  private async getArea() {
    const { data } = await GetArea(['100000'])
    if (data.success) {
      this.optionsArea = data.data
    } else {
      this.$message.error(data)
    }
  }
  private fetchData() {
    this.getOfficeList()
    this.getArea()
  }
  private changeDuty(value: any) {
    this.busitypeOptions.forEach((ele: any) => {
      if (ele.id === value) {
        this.dialogForm.name = ele.dutyName
      }
    })
    if (this.isAdd) {
      this.changeProps()
    }
    if (value !== '') {
      this.isResouceShow++
    }
  }
  private allowDrop(draggingNode: any, dropNode: any, type: any) {
    if (draggingNode.level === dropNode.level + 1) {
      return type === 'inner'
    // } else if (draggingNode.level === dropNode.level) {
    //   return type === 'prev' || type === 'next'
    } else {
      return false
    }
  }
  private handleDragStart() {
    this.copyData = JSON.parse(JSON.stringify(this.data))
  }
  private handleDrop(draggingNode: any, dropNode: any, type: any, event: any) {
    let params = {
      fromId: draggingNode.data.id,
      toId: dropNode.data.id,
      toParentIds: dropNode.data.parentIds
    }
    const nodes = (this.$refs['tree'] as any).$refs['roleTree'].store._getAllNodes()
    const openList = nodes.filter((item: any) => item.expanded).map((item: any) => item.data.id)

    officeDrag(params)
      .then(({ data }) => {
        if (!data.success) {
          this.data = this.copyData
          this.$nextTick(() => {
            this.openItem(openList)
          })
          this.$message.error(data.message)
        // } else {
        //   this.getOfficeList(() => {
        //     this.$nextTick(() => {
        //       this.openItem(openList)
        //     })
        //   })
        }
      }).catch(({ message }) => {
        // 失败后处理
        this.data = this.copyData
        this.$nextTick(() => {
          this.openItem(openList)
        })
        this.$message.error(message)
      })
  }
  private allowDrag(node: any) {
    return node.level === 3 && node.data.type === 3
  }
  private openItem(list: any) {
    const nodes = (this.$refs['tree'] as any).$refs['roleTree'].store._getAllNodes()
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].expanded = list.includes(nodes[i].data.id)
    }
  }
  private changeProps() {
    const fact = (list: any) => {
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        if (item.children) {
          item.disabled = item.children.some((ele: any) => ele.dutyId === this.dialogForm.dutyId)
        } else {
          fact(item.officeVOs)
        }
      }
    }
    fact(this.data3)
    this.data3 = this.data3.slice(0)
  }
  mounted() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
.OrganizationManagement {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.OrganizationManagement .el-form-item__content .el-select{
  width: 100%;
}
.OrganizationManagement,
.OrganizationManagement-m {
  .el-cascader {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;
    color: rgba(0, 0, 0, 0);
    display: block;
  }
  .mr10 {
    margin-right: 10px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .tree-icon {
    font-size: 16px;
    color: $--color-text-regular;
    margin-right: 10px;
  }
  .right-btn {
    display: inline-block;
    .el-button {
      padding: 0;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: rgba(0, 0, 0, 0);
      font-size: 20px;
      border-color: rgba(0, 0, 0, 0);
      &.delete {
        &:hover {
          color: $--color-danger;
        }
      }
    }
  }
}
</style>
<style scoped>
.OrganizationManagement .el-badge >>> sup,
.OrganizationManagement-m .el-badge >>> sup {
  transform: translateY(6px);
}
.OrganizationManagement .el-cascader >>> input,
.OrganizationManagement-m .el-cascader >>> input {
  background-color: rgba(0, 0, 0, 0);
  color: rgba(0, 0, 0, 0);
}
.OrganizationManagement .el-cascader.city-cascader >>> input,
.OrganizationManagement-m .el-cascader.city-cascader >>> input{
  color: initial;
}
.OrganizationManagement .opacity >>> input,
.OrganizationManagement-m .opacity >>> input {
  border-color: rgba(0, 0, 0, 0);
}
</style>
