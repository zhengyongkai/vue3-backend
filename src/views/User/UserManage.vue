<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box mb20">
        <el-input
          v-model="query.username"
          placeholder="类别名称"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column label="序号" width="55" align="center">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名称"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="signature" label="个人签名"></el-table-column>
        <el-table-column prop="work" label="职业"></el-table-column>
        <el-table-column prop="pic" label="用户照片" width="100" align="center">
          <template #default="scope">
            <img :src="scope.row.avatar" style="width: 40px; height: 40px" />
          </template>
        </el-table-column>
        <el-table-column prop="deleteFlag" label="用户状态">
          <template #default="scope">
            <div :class="userStatus[scope.row.deleteFlag]">
              {{ scope.row.deleteFlag ? '已启用' : '禁用中' }}
            </div>
          </template>
        </el-table-column>
        
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.page"
          :page-size="query.limit"
          :total="query.total"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUserList } from '@/api/user';
import { usePageHelper } from '@/hook/page';

const { query, tableData } = usePageHelper();
const handleSearch = function () {
  getUser();
};
const userStatus = ref({
  0: 'color-red',
  1: 'color-green',
});

function getUser() {
  getUserList(query).then((res) => {
    tableData.value = res.data.list;
    query.total = res.data.total;
    query.pages = res.data.pages;
    query.page = res.data.page;
  });
}

onMounted(() => {
  getUser()
});
</script>
<style lang="scss">
@import '@/assets/css/common.scss';
.color-red {
  color: $--text-color-danger;
}
.color-green {
  color: $--text-color-success;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
</style>
