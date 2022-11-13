import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '系统首页',
        },
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: '/typeManage',
        name: 'typeManage',
        meta: {
          title: '类别管理',
        },
        component: () => import('../views/typeManage.vue'),
      },
      {
        path: '/newsManage',
        name: 'newsManage',
        meta: {
          title: '新闻管理',
        },
        component: () => import('../views/newsManage.vue'),
      },
      {
        path: '/MenuManage',
        name: 'MenuManage',
        meta: {
          title: '菜单管理',
        },
        component: () => import('../views/Menu/MenuManage.vue'),
      },
      {
        path: '/userManage',
        name: 'UserManage',
        meta: {
          title: '用户管理',
        },
        component: () => import('../views/User/UserManage.vue'),
      },
      {
        path: '/baseEcharts',
        name: 'baseEcharts',
        meta: {
          title: '3d图表',
        },
        component: () => import('../views/Components/echarts.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | vue-manage-system`;
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin'
//             ? next()
//             : next('/403');
//     } else {
//         next();
//     }
// });

export default router;
