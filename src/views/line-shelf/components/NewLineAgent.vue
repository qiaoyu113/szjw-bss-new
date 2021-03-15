<template>
  <div class="new-line-container">
    <el-row
      :gutter="40"
      class="row-status"
    >
      <el-col
        :span="3"
        class="col-status"
      >
        代维护 100条
      </el-col>
      <el-col
        :span="3"
        class="col-status"
      >
        已维护 100条
      </el-col>
      <el-col
        :span="3"
        class="col-status"
      >
        今日完成 100条
      </el-col>
    </el-row>
    <!-- 基础信息  -->
    <section-container title="基础信息">
      <self-form
        :form-item="baseItem"
        :list-query="baseInfo"
      />
    </section-container>
    <section-container title="仓策展信息">
      <self-form
        :form-item="curationItem"
        :list-query="baseInfo"
      />
      <el-row
        :gutter="10"
        class="curation-row"
      >
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>仓库图片</span>
            <div>
              <img
                src="https://www.baidu.com/img/PCpad_012830ebaa7e4379ce9a9ed1b71f7507.png"
                alt=""
              >
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>货物图片</span>
            <div>
              <img
                src="https://www.baidu.com/img/PCpad_012830ebaa7e4379ce9a9ed1b71f7507.png"
                alt=""
              >
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>装货图片</span>
            <div>
              <img
                src="https://www.baidu.com/img/PCpad_012830ebaa7e4379ce9a9ed1b71f7507.png"
                alt=""
              >
            </div>
          </div>
        </el-col>
        <el-col
          :span="6"
          class="curation-col"
        >
          <div class="curation-title">
            <span>讲解视频</span>
            <div>
              <img
                src="https://www.baidu.com/img/PCpad_012830ebaa7e4379ce9a9ed1b71f7507.png"
                alt=""
              >
            </div>
          </div>
        </el-col>
      </el-row>
    </section-container>
    <section-container title="标签信息">
      <self-form
        :list-query="listQuery"
        :form-item="formItem"
      />
    </section-container>

    <section-container title="配送信息" />
    <section-container title="配送要求" />
    <section-container title="货物信息" />
    <section-container title="结算信息" />

    <!-- 按钮 -->
    <el-row :gutter="20">
      <el-col
        :span="5"
        :offset="4"
      >
        <el-button
          class="agent-button"
          type="info"
          plain
        >
          跳过暂不检查
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          class="agent-button"
          type="primary"
        >
          检查不通过
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-button
          class="agent-button"
          type="primary"
        >
          检查通过
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SectionContainer from '@/components/SectionContainer/index.vue'
import SelfForm from '@/components/Base/SelfForm.vue'
@Component({
  name: 'NewLineAgent',
  components: {
    SectionContainer,
    SelfForm
  }
})
export default class extends Vue {
  private baseItem = [
    {
      type: 7,
      label: '线路名称:',
      key: 'lineName',
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '线路编号:',
      key: 'lineNo',
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '窗口期:',
      key: 'windowDate',
      tagAttrs: {
        class: 'error'
      }
    },
    {
      type: 7,
      label: '线路分类:',
      key: 'lineType'
    },
    {
      type: 7,
      label: '外线销售:',
      key: 'lineType'
    },
    {
      type: 7,
      label: '客推经理:',
      key: 'lineType'
    }
  ]
  private curationItem = [
    {
      type: 7,
      label: '仓名称:',
      key: 'lineName',
      tagAttrs: {
        class: 'active'
      }
    },
    {
      type: 7,
      label: '仓位置:',
      key: 'lineNo',
      tagAttrs: {
        class: 'active'
      }
    }
  ]
  private baseInfo = {
    checkbox: 'fadfas'
  }
  private listQuery ={

  }
  private hasOption = [{
    leble: '是',
    name: '0'
  },
  {
    leble: '否',
    name: '1'
  }
  ]
  private formItem =[
    {
      type: 2,
      tagAttrs: {
        placeholder: '请选择',
        clearable: true,
        filterable: true
      },
      label: '业务线',
      key: 'busiType',
      col: 8,
      options: this.hasOption
    }
  ]
}
</script>

<style lang="scss" scoped>
.row-status {
  background: #f2f2f2;
  margin: 0 !important;
}
.col-status {
  border-radius: 3px;
  margin: 14px 12px;
  padding: 18px;
  background: #fff;
}
.agent-button {
  margin: 20px 0;
  width: 100% !important;
  border: none;
}
.curation-row{
  padding: 15px;
}
.curation-col{

.curation-title{
  display: flex;
  flex-wrap: wrap;
  span{
        width: 100%;
    display: inline-block;
  }
  div{
    width: 80%;
    height: 200px;
    border: 1px solid #eee;
    margin-top:12px;
  }
  img{
    width: 100%;
    height: 100%;
  }
}
}
</style>

<style lang="scss" scoped>
.new-line-container {
  ::v-deep .SectionContainer {
    margin-top: 8px;
    box-shadow: none;
    .title {
      border: none;
    }
    .context{
      padding: 12px 30px;
    }
  }
  .el-button--info.is-plain:hover,
  .el-button--info.is-plain:focus {
    background: #ccc;
    color: #333;
  }
  ::v-deep .active {
    color: #4899d0;
  }
  ::v-deep .error {
    color: red;
  }
}
</style>
