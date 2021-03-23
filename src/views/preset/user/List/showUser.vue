<template>
  <div class="showUser">
    <el-card>
      <users
        ref="userlist"
        :list-query="listQuery"
      />
    </el-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import users from '../components/UserLists.vue'
@Component({
  name: 'ShowUser',
  components: {
    users
  }
})
export default class extends Vue {
  private listQuery:any = {
    roleId: ''
  }
  mounted() {
    this.listQuery.roleId = +this.$route.query.id;
    (this.$refs['userlist'] as any).deteleOp();
    (this.$refs['userlist'] as any).getLists()
  }
}
</script>
<style lang="scss" scoped>
.showUser{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
