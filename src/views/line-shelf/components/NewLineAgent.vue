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
    <section-container title="基础信息" />
    <section-container title="仓策展信息" />
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
@Component({
  name: 'NewLineAgent',
  components: {
    SectionContainer
  }
})
export default class extends Vue {}
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
  margin:20px 0;
  width: 100% !important;
  border: none;
}
</style>

<style lang="scss" scoped>
.new-line-container {
  ::v-deep.SectionContainer {
    margin-top: 8px;
    box-shadow: none;
    .title {
      border: none;
    }
  }
  .el-button--info.is-plain:hover,
  .el-button--info.is-plain:focus {
    background: #ccc;
    color: #333;
  }
}
</style>
