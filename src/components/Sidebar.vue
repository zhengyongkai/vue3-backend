<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu
            :index="item.index"
            :key="item.index"
          >
            <template #title>
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.index"
                :key="subItem.index"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
          >
            <i :class="item.icon"></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  setup () {
    const items = [
      {
        icon: "el-icon-lx-home",
        index: "/dashboard",
        title: "系统首页",
      },
      {
        icon: "el-icon-chat-line-round",
        index: "3",
        title: "新闻模块",
        subs: [
          {
            icon: "el-icon-lx-cascades",
            index: "/typeManage",
            title: "类别管理",
          },
          {
            icon: "el-icon-lx-cascades",
            index: "/newsManage",
            title: "新闻管理",
          },
        ],
      },

      {
        icon: "el-icon-lx-calendar",
        index: "4",
        title: "菜单模块",
        subs: [
          {
            icon: "el-icon-lx-cascades",
            index: "/MenuManage",
            title: "添加菜单",
          },
          // {
          //   icon: "el-icon-lx-cascades",
          //   index: "/RoleManage",
          //   title: "权限配置",
          // },
        ],
      },
       {
        icon: "el-icon-lx-group",
        index: "5",
        title: "用户模块",
        subs: [
          {
            icon: "el-icon-lx-group",
            index: "/UserManage",
            title: "用户管理",
          },
        ],
      },
      // {
      //   icon: "el-icon-lx-calendar",
      //   index: "5",
      //   title: "组件",
      //   subs: [
      //     {
      //       icon: "el-icon-lx-cascades",
      //       index: "/baseEcharts",
      //       title: "3d柱状",
      //     },

      //   ],
      // },
    ];

    const route = useRoute();

    const onRoutes = computed(() => {
      return route.path;
    });

    const store = useStore();
    const collapse = computed(() => store.state.base.collapse);

    return {
      items,
      onRoutes,
      collapse,
    };
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
