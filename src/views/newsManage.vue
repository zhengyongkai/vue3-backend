<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 信息管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          style="margin-right: 6px"
          v-model="query.title"
          placeholder="新闻标题"
          class="handle-input mr6"
        ></el-input>
        <el-input
          style="margin-right: 6px"
          v-model="query.content"
          placeholder="新闻内容"
          class="handle-input mr6"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        ></el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleEdit('add', -1, {})"
        ></el-button>
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
        <el-table-column prop="title" label="新闻标题"></el-table-column>
        <el-table-column prop="type_name" label="新闻类型"></el-table-column>
        <el-table-column prop="text_type" label="图文类型">
          <template #default="scope">
            {{ scope.row.text_type === "1" ? "纯文本" : "图文" }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="新闻内容">
          <template #default="scope">
            <div class="overflow" :title="scope.row.content">
              {{ scope.row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="pic" label="首页图片" width="100" align="center">
          <template #default="scope">
            <img
              v-if="scope.row.frontImgList[0]"
              :src="
                 scope.row.frontImgList[0].img_url
              "
              style="width: 40px; height: 40px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="user" label="创作者">
          <template #default="scope">
            {{ scope.row.user.nickname }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            {{ scope.row.status === 0 ? "未审核" : "已审核" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled='scope.row.status != 0'
              @click="handleEdit('edit', scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              :disabled='scope.row.status != 0'
              @click="handlePublish(scope.row)"
              >发布
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              :disabled='scope.row.status != 0'
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
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
    <el-dialog title="编辑" v-model="editVisible" width="60%">
      <el-form label-width="100px" :rules="rules" ref="formRef" :model="form">
        <el-row :gutter="23">
          <el-col :span="12">
            <el-form-item label="新闻标题" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新闻类型" prop="type_id">
              <el-select v-model="form.type_id" style="width: 100%">
                <el-option
                  :value="v.id"
                  :label="v.name"
                  v-for="v in typeDict"
                  :key="v.id"
                  >{{ v.name }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="23">
          <el-col :span="12">
            <el-form-item label="图文类型" prop="text_type">
              <el-select v-model="form.text_type" style="width: 100%">
                <el-option value="1" label="纯文本">纯文本</el-option>
                <el-option value="2" label="图文">图文</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创作者">
              <el-input v-model="form.nickname" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="23">
          <el-col :span="12">
            <el-form-item label="新闻内容" prop="content">
              <el-input type="textarea" v-model="form.content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="23" v-if="form.text_type === '2'">
          <el-col :span="23">
            <el-form-item label="首页图片" prop="fileList">
              <el-upload
              action="#"
                :on-change="beforeUpload"
                list-type="picture-card"
                :on-remove="removeImg"
                :limit="1"
                :file-list="form.fileList"
                :auto-upload="false"
                accept="image/*"
              >
                <el-icon><Plus /></el-icon>
                <template #tip>
                  <div class="el-upload__tip">请上传 jpg,png 等图片类型</div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getNews, saveNews, deleteNews, publishNews } from "../api/news";
import { getType } from "../api/type";
import { uploadImg } from "@/utils/utils";
import { useStore } from "vuex";

export default {
  name: "basetable",
  setup() {
    const store = useStore();
    const userInfo = store.state.userInfo ? store.state.userInfo : {};
    const formRef = ref(null);
    const rules = reactive({
      title: [{ required: true, message: "请填写新闻标题", trigger: "blur" }],
      type_id: [
        { required: true, message: "请选择新闻类型", trigger: "change" },
      ],
      text_type: [
        { required: true, message: "请选择图文类型", trigger: "change" },
      ],
      content: [{ required: true, message: "请选择新闻内容", trigger: "blur" }],
      fileList: [
        { required: true, message: "请选择一张图片", trigger: "change" },
      ],
    });
    const query = reactive({
      limit: 5,
      page: 1,
      pages: 1,
    });
    const tableData = ref([]);
    const fileList = ref([]);
    const typeDict = ref([]);
    // 获取表格数据
    const getData = () => {
      getNews(query).then((res) => {
        tableData.value = res.data.list;
        query.total = res.data.total;
        query.pages = res.data.pages;
        query.page = res.data.page;
      });
    };
    const getTypeApi = () => {
      getType({ limit: 99999 }).then((res) => {
        console.log(res.data.list);
        typeDict.value = res.data.list;
      });
    };
    getData();
    getTypeApi();
    // 查询操作
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
          deleteNews({ id: row.id }).then((res) => {
            if (res.success) {
              ElMessage.success("删除成功");
              getData();
            }
          });
        })
        .catch(() => {});
    };
    const handlePublish = (row) => {
      publishNews({ id: row.id }).then((res) => {
        ElMessage.success("发布成功");
        getData();
      });
    };
    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    const dialogType = ref("add");
    let form = reactive({
      title: "",
      id: "",
      user_id: "",
      nickname: "",
      text_type: "",
      type_id: "",
      content: "",
      nickname: "",
      fileList: [],
    });
    let idx = -1;
    const handleEdit = (type, index, row) => {
     
      dialogType.value = type;

      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.fileList = [];
      form.id = row.id;
      if (type === "add") {
        form.nickname = userInfo.nickname;
        form.user_id = userInfo.id;

        form.id = null;
      } else {
        row.frontImgList.forEach((res) => {
          if (res) {
            form.fileList.push({
              id: res.id,
              name: res.filename,
              url:  res.img_url,
            });
          }
        });
        form.nickname = row.user.nickname;
        form.type_id = parseInt(row.type_id);
      }
      editVisible.value = true;
      setTimeout(() => {
          formRef.value.clearValidate()
      }, 100);
    };
    const saveImg = (callback) => {
      let imgData = [];
      if (form.fileList.length === 0) {
        return callback && callback();
      }
      form.fileList.forEach((res, index) => {
        let formData = new FormData();
        formData.append("file", res.raw);

        if (res.status === "ready") {
          uploadImg(formData).then((result) => {
            imgData.push(result.id);
            if (index + 1 === form.fileList.length)
              callback && callback(imgData.join(","));
          });
        } else {
          imgData.push(res.id);
          console.log("33333", imgData);
          if (index + 1 === form.fileList.length)
            callback && callback(imgData.join(","));
        }
      });
    };
    const saveEdit = () => {
      formRef.value.validate((res) => {
        if (res) {
          editVisible.value = false;
          saveImg((data) => {
            saveNews({
              title: form.title,
              content: form.content,
              user_id: userInfo.id,
              type_id: form.type_id,
              text_type: form.text_type,
              frontImg: data,
              id: form.id,
            }).then((res) => {
              if (res.success) {
                ElMessage.success(`操作成功`);
                getData();
              }
            });
          });
        }
      });
    };
    const removeImg = (item) => {
      form.fileList = form.fileList.filter((res) => {
        return res.id != item.id;
      });
    };
    const beforeUpload = (file) => {
      form.fileList.push({
        ...file,
        id: new Date().getTime(),
      });
    };

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
      typeDict,
      beforeUpload,
      fileList,
      removeImg,
      rules,
      formRef,
      handlePublish,
      
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
  width: 150px;
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
.overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
