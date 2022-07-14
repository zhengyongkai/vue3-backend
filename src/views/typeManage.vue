<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 类别管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="query.name"
          placeholder="类别名称"
          class="handle-input mr10"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleEdit('add', -1, {})"
        >新增</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          label="序号"
          width="55"
          align="center"
        >
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="类别名称"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit('edit', scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
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

    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑"
      v-model="editVisible"
      width="30%"
    >
      <el-form label-width="70px">
        <el-form-item label="类别名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="saveEdit"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getType, saveType, deleteType } from "../api/type";
import { usePageHelper } from '@/hook/page'

export default {
  name: "basetable",
  setup () {
    const { query, tableData } = usePageHelper();
    // 获取表格数据
    var getData = () => {
      getType(query).then((res) => {
        tableData.value = res.data.list;
        query.total = res.data.total;
        query.pages = res.data.pages;
        query.page = res.data.page;
      });
    };
    const handleSearch = () => {
      query.page = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.page = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index, row) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteType({ id: row.id }).then((res) => {
            if (res.success) {
              ElMessage.success("删除成功");
              getData();
            }
          });
        })
        .catch(() => { });
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const dialogType = ref("add");
    let form = reactive({
      name: "",
    });
    let idx = -1;
    const handleEdit = (type, index, row) => {
      dialogType.value = type;
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.id = row.id;
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      saveType(form).then((res) => {
        if (res.success) {
          ElMessage.success(`操作成功`);
          getData();
        }
      });
    };

    getData();

    return {
      query,
      tableData,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
