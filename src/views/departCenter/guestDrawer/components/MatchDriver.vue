<!--
 * @Description:
 * @Author: 听雨
 * @Date: 2021-04-13 14:38:14
 * @LastEditTime: 2021-04-14 16:10:14
 * @LastEditors: D.C.base
-->
<template>
  <section class="matchDriver">
    <!-- 搜索项 -->
    <SearchKeyWords />
    <h3>司机匹配线路</h3>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="商品 ID"
        prop="id"
      />
      <el-table-column
        label="商品名称"
        prop="name"
      />
      <el-table-column
        label="描述"
        prop="desc"
      />
    </el-table>
  </section>
</template>

<script lang="ts">
import SearchKeyWords from './SearchKeyWords.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
interface IState {
  [key: string]: any;
}
@Component({
  components: {
    SearchKeyWords
  }
})
export default class DepartLine extends Vue {
  private listLoading:boolean = false
  private tableData:IState[] = [] // 撮合线路
  // 获取列表
  async getDepartLine() {
    try {
      this.listLoading = true
      this.tableData = [{
        id: '12987122',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }]
    } catch (err) {
      console.log(`getlists fail:${err}`)
    } finally {
      this.listLoading = false
      //
    }
  }
  mounted() {
    this.getDepartLine()
  }
}
</script>
<style lang="scss" scoped>
.matchDriver{
  background: #fff;
  h3{
    padding: 0 30px;
  }
}
</style>
