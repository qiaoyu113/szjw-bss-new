<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:37:27
 * @LastEditTime: 2021-04-14 15:54:04
 * @LastEditors: D.C.base
-->
<template>
  <div class="searchBox">
    <div class="topSelect">
      <div class="selectedform">
        <template
          v-for="(item,index) in selectList"
        >
          <el-dropdown
            :key="index"
            trigger="hover"
            placement="bottom-start"
            @visible-change="handleChange(item.title)"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              {{ item.title }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(obj,index2) in item.options"
                :key="index2"
                :command="obj.value"
              >
                {{ obj.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
      <div class="formbox">
        <el-input
          v-model="keyWords"
          placeholder="请输入司机姓名/编号"
          suffix-icon="el-icon-search"
        />
        <el-button
          type="primary"
          size="small"
        >
          查询
        </el-button>
      </div>
    </div>
    <div
      v-if="selectedData.length>0"
      class="selectedBox"
    >
      <a
        href="javascript:;"
        class="clearAll"
        @click="handleClearAll"
      >全部清空</a>
      <ul class="list">
        <li
          v-for="(item,index) in selectedData"
          :key="index"
        >
          {{ item.type }}：{{ item.selected.join(",") }}<i
            class="el-icon-circle-close"
            @click="clearSelect(index)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component({
  components: {

  }
})
export default class SearchKeyWords extends Vue {
  private keyWords: string = ''
  private curSelected: object = {}
  private selectTitle: string = ''
  private selectedData: any[] = [];
  private selectList:IState[] = [
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '共享',
        label: '共享'
      }, {
        value: '专车',
        label: '专车'
      }],
      multiple: true,
      type: 'select',
      title: '业务线'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }],
      type: 'select',
      title: '司机车型'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '不需要装卸',
        label: '不需要装卸'
      }, {
        value: '轻装卸',
        label: '轻装卸'
      }, {
        value: '重装卸',
        label: '重装卸'
      }],
      title: '期望装卸难度'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '稳定',
        label: '稳定'
      }, {
        value: '临时',
        label: '临时'
      }],
      title: '期望稳定/临时'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '现结',
        label: '现结'
      }, {
        value: '周结',
        label: '周结'
      }, {
        value: '半月结',
        label: '半月结'
      }, {
        value: '月结',
        label: '月结'
      }, {
        value: '季度结',
        label: '季度结'
      }],
      title: '期望结算周期'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }],
      title: '期望货品类型'
    },
    {
      options: [{
        value: '全部',
        label: '全部'
      }, {
        value: '整车',
        label: '整车'
      }, {
        value: '多点配',
        label: '多点配'
      }],
      title: '期望配送难度'
    }
  ]
  handleClearAll() {
    this.selectedData = []
    this.$emit('on-clear')
  }
  handleChange(title) {
    this.selectTitle = title
  }
  handleCommand(command) {
    if (this.selectedData.length > 0) {
      let index = this.selectedData.findIndex((item) => {
        return item.type === this.selectTitle
      })
      if (index > -1) {
        let selecteds = this.selectedData[index].selected
        if (selecteds.indexOf(command) === -1) {
          this.selectedData[index].selected.push(command)
        }
      } else {
        let obj = {
          type: this.selectTitle,
          selected: [command]
        }
        this.selectedData.push(obj)
      }
    } else {
      let obj = {
        type: this.selectTitle,
        selected: [command]
      }
      this.selectedData.push(obj)
    }
  }
  clearSelect(i) {
    this.selectedData.splice(i, 1)
  }
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.searchBox{
  background: #fff;
  ::v-deep .el-dropdown-link{
    font-size: 14px;
    color: #494949;
    i{
      color: #606060 !important;
    }
  }
  ::v-deep .el-dropdown{
    display: flex;
    &::after{
      display: inline-block;
      content: "";
      height: 30px;
      width: 2px;
      background: #f4f4f6;
      margin: 0 10px;
    }
    &:last-child::after{
      display: none;
    }
  }
  .topSelect{
    display: flex;
    justify-content: space-between;
    padding:15px 30px 15px 30px;
    border-bottom:2px solid #f3f3f5;
    .selectedform{
      display: flex;
      flex-wrap: wrap;
      line-height: 36px;
    }
    .formbox{
      display: flex;
      justify-content: center;
      align-items: center;
      .el-input{
        margin-right: 10px;
      }
      .el-button{
        height: 36px;
      }
    }
  }
  .selectedBox{
    display: flex;
    color: #909196;
    padding: 10px 20px 10px 30px;
    font-size: 14px;
    .clearAll{
      display: inline-block;
      width: 60px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      padding-left: 0;
      margin: 0;
      margin-left: 20px;
      li{
        display: flex;
        align-items: center;
        background: #eef2f3;
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        border-radius: 30px;
        list-style: none;
        padding: 0 5px 0 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        i{
          color: #8e929b;
          margin-left: 15px;
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
