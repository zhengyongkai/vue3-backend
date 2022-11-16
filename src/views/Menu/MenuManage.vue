<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 菜单管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="menu-container">
      <el-row>
        <el-col
          :span="5"
          class="basic-menu-container"
        >
          <el-input
            type='mini'
            v-model="filterText"
            placeholder="查找节点"
          />
          <div
            class="custom-tree-container"
            v-loading="loading"
          >
            <el-tree
              :data="dataSource"
              node-key="id"
              ref="treedom"
              :filter-node-method="filterNode"
              default-expand-all
              :expand-on-click-node="false"
              :highlight-current="true"
            >
              <template #default="{ node, data }">
                <span
                  class="custom-tree-node"
                  @mouseenter="enters(data.id)"
                  @click="chooseData(data)"
                >
                  <div style="display: flex; align-items: center">
                    <div style="width: 16px; height: 16px; margin-right: 10px">
                      <Menu v-if="data.menuType === '1'" />
                      <Link v-else />
                    </div>
                    <span
                      class="title"
                      :title="data.title"
                    >{{ data.title }}</span>
                    <span
                      class="icons"
                      :style="{
                        display: data.id === hoverid ? 'block' : 'none',
                      }"
                    >
                      <Plus
                        @click="(e) => addNode(e, node, data)"
                        v-if="data.menuType === '1'"
                      />
                      <Minus @click="(e) => deleteNode(e, node, data)" />
                    </span>
                  </div>
                </span>
              </template>
            </el-tree>
          </div>
        </el-col>
        <el-col
          :span="18"
          class="basic-menu-container"
          :offset="1"
        >
          <el-form
            :model="form"
            label-width="120px"
            ref="ruleFormRef"
            :rules="rules"
          >
            <el-form-item label="父亲节点">
              <el-input
                v-model="form.parentTitle"
                readonly
              />
            </el-form-item>
            <el-form-item
              label="节点名称"
              prop="title"
            >
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="路径">
              <el-input v-model="form.url" />
            </el-form-item>
            <el-form-item label="图标">
              <el-input v-model="form.icon" />
            </el-form-item>
            <el-form-item
              label="排序"
              prop="orders"
            >
              <el-input
                v-model="form.orders"
                type="number"
                min="0"
                step="1"
              />
            </el-form-item>
            <el-form-item
              label="菜单类型"
              prop="menuType"
            >
              <el-select v-model="form.menuType">
                <el-option
                  v-for="item in [
                    { label: '菜单', value: '1' },
                    { label: '按钮', value: '2' },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="按钮权限"
              prop="buttonRole"
            >
              <el-input v-model="form.buttonRole" />
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch
                v-model="form.status"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
              >提交</el-button>
              <el-button @click="onClear">清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { getMenu, saveMenu, deleteMenu } from "@/api/menu";
import { responseNotify, transData } from "@/utils/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { Menu } from "@element-plus/icons-vue";
import { validateWholeNumber } from "@/utils/pattern";

const dataSource = ref();
const hoverid = ref(0);
const treedom = ref(null);
const filterText = ref('')
const form = ref({
  title: "",
  status: 1,
});
const loading = ref(false);
const ruleFormRef = ref();
let menuData = [];
// 获取数据
onMounted(() => {
  getMenuData();
});

watch(filterText, (val) => {
  treedom.value = treedom.value.filter(val)
})

const filterNode = (value, data) => {
  console.log(data.title, value)
  if (!value) return true
  return data.title.includes(value)
}

function getMenuData () {
  loading.value = true;
  getMenu({ limit: 9999 }).then(({ data }) => {
    loading.value = false;
    dataSource.value = transData(data.list, "id", "pid", "children");
  });
}

const rules = reactive({
  title: [{ required: true, message: "请填写节点名称", trigger: "blur" }],
  menuType: [{ required: true, message: "请选择菜单类型", trigger: "blur" }],
  orders: [
    {
      validator: validateWholeNumber,
      trigger: "blur",
    },
  ],
});
function enters (index) {
  hoverid.value = index;
}
function addNode (e, node, data) {
  e.stopPropagation();
  treedom.value.setCurrentKey(data.id, false)
  const newMenu = {
    title: "新建菜单",
    pid: data.id,
    parentTitle: data.title,
    id: new Date().getTime(),
    handletype: "add",
    status: 1,
  };
  form.value = newMenu;
  // treedom.value.append(newMenu,node);
}
function chooseData (data) {
  const newMenu = {
    title: data.title,
    pid: data.parentsNode ? data.parentsNode.id : null,
    parentTitle: data.parentsNode ? data.parentsNode.title : null,
    id: data.id,
    handletype: "edit",
    icon: data.icon,
    url: data.url,
    status: data.status,
    buttonRole: data.buttonRole,
    orders: data.orders,
    menuType: data.menuType,
  };
  form.value = newMenu;
}
function onSubmit () {
  ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      let message = ''
      if (form.value.handletype === "add" || !form.value.id) {
        message = '新增'
        delete form.value.id;
      } else {
        message = '修改'
      }
      saveMenu(form.value).then((res) => {
        if (responseNotify(res)) {
          ElMessage.success(message + "成功");
          getMenuData();
          onClear();
        }
      });
    }
  });
}
// 获取该节点下所有子节点 id
function getAllDeleteNodeId (arr, data) {
  arr.push(data.id);
  if (data.children) {
    for (let i of data.children) {
      getAllDeleteNodeId(arr, i);
    }
  }
  return arr;
}
function deleteNode (e, node, data) {
  e.stopPropagation();
  treedom.value.setCurrentKey(data.id, false)
  ElMessageBox.confirm("确定要该节点吗，其下面的子节点也会随之删除？", "提示", {
    type: "warning",
  })
    .then(() => {
      let arr = getAllDeleteNodeId([], data);
      deleteMenu({ id: arr }).then((res) => {
        if (res.success) {
          ElMessage.success("删除成功");
          getMenuData();
          onClear();
        }
      });
    })
}

function onClear () {
  form.value.title = "";
  form.value.parentTitle = "";
  form.value.pid = 0;
  form.value.status = 1;
  form.value.url = "";
  form.value.icon = "";
  form.value.handletype = "add";
  form.value.orders = "";
  form.value.menuType = "";
  form.value.buttonRole = "";
}


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
.menu-container {
  width: 100%;
}
.basic-menu-container {
  padding: 30px 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: calc(100vh - 200px);
}

.basic-menu-container .icons {
  align-items: center;
  margin-left: 8px;
  height: 16px;
  width: 16px;
  display: none;
}

.basic-menu-container .title {
  overflow: hidden;
  display: block;
  max-width: 160px;
  text-overflow: ellipsis;
}

.custom-tree-container {
  height: 70vh;
  margin-top: 10px;
  overflow-y: auto;
}
</style>
