<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 聊天模塊11
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="menu-container">
      <div class="left-container">
        <div class="title cell">我的好友 ({{ chatLists.length }})</div>
        <div class="list">
          <div v-for="list in chatLists" class="lists">
            <div
              class="cell"
              @click="click(list)"
              :class="[currentUser.id === list.id ? 'gray' : '']"
            >
              <div class="cell-img">
                <img :src="list.avatar" />
              </div>
              <div class="cell-name">
                {{ list.name }}
              </div>
              <div
                class="cell-spot"
                :class="[list.online ? 'green' : 'red']"
              ></div>
              <div class="cell-notice" v-if="list.unchat > 0">
                <el-badge type="danger" :value="list.unchat" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div class="title cell">你正在与 ({{ currentUser.name }}) 聊天</div>
        <div class="chat-body" :class="[currentUser.name ? 'white' : '']">
          <div v-for="i in messageList">
            <div class="chat" v-if="i.formid === userId">
              <div style="color: black">{{ i.formid }}</div>
              <div class="tri"></div>
              <div class="span">
                <div v-html="i.msg"></div>
              </div>
            </div>
            <div class="chat-right" v-else>
              <div style="color: black">{{ i.formid }}</div>
              <div class="tri-right"></div>
              <div class="span-right"><div v-html="i.msg"></div></div>
            </div>
          </div>
        </div>
        <div class="chat-handle" v-if="currentUser.id">
          <input v-model="value" @keyup.enter="send()" />
          <button @click="send()">发送消息</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  watch,
  getCurrentInstance,
  computed,
} from "vue";
import { getMenu, saveMenu, deleteMenu } from "@/api/menu";
import { responseNotify, transData } from "@/utils/utils";
import { ElMessage } from "element-plus";
import { Menu } from "@element-plus/icons-vue";
import { validateWholeNumber } from "@/utils/pattern";
import img from "@/assets/img/img.jpg";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();
const currentUser = ref({});
const value = ref("");
const messageList = ref([]);
const userId = String(store.state.user.userInfo.id);
const chatLists = ref([
  {
    id: "-1",
    name: "凯文斯小冰",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "1",
    name: "郑永楷",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "2",
    name: "蔡子敏2",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "3",
    name: "cai",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "4",
    name: "蔡子敏4",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "5",
    name: "蔡子敏5",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "6",
    name: "蔡子敏6",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "123",
    name: "蔡子敏7",
    avatar: img,
    unchat: 0,
    type: "onPerson",
  },
  {
    id: "999",
    name: "群聊",
    avatar: img,
    unchat: 0,
    type: "onGroup",
  },
]);

onMounted(() => {
  proxy.$socket.on("onmessage", (res) => {
    let { type, msg } = JSON.parse(res);
    setStorage(msg);
    let obj = {};
    if (type === "OnUndeUser") {
      ElMessage.warning("用户未上线");
    }
    if (type === "OnMessage") {
      if (msg.formid === currentUser.value.id) {
       
        messageList.value.push(msg);
      } else {
        let data = chatLists.value.filter((data) => {
          return data.id === msg.formid;
        });
        // data.unchat++;
        data[0] && (data[0].unchat += 1);
      }
    }

    if (type === "OnGroup") {
      if (msg.receviewId === currentUser.value.id) {
        messageList.value.push(msg);
      } else {
        let data = chatLists.value.filter((data) => {
          return data.id === msg.formid;
        });
        // data.unchat++;
        data[0] && (data[0].unchat += 1);
      }
    }
  });
});

const setStorage = (data) => {
  let i = JSON.parse(localStorage.getItem("msgList") || "[]");
  i.push(JSON.stringify(data));
  localStorage.setItem("msgList", JSON.stringify(i));
};

const tagsList = computed(() => store.state.user.online);
const onLine = watch(
  tagsList,
  () => {
    chatLists.value.forEach((res) => {
      if (store.state.user.online.includes(res.id)) {
        if (!res.online) {
          res.online = true;
        }
      } else {
        res.online = false;
      }
    });
    chatLists.value.sort((a, b) => {
      return b.online - a.online;
    });
  },
  {
    immediate: true,
    deep: true,
  }
);
function click(list) {
  messageList.value = [];
  currentUser.value = list;
  list.unchat = 0;
  let arr = [];
  let i = JSON.parse(localStorage.getItem("msgList") || "[]");
  i.forEach((res) => {
    let data = JSON.parse(res) || {};
    if (
      data.formid === currentUser.value.id ||
      data.receviewId === currentUser.value.id
    ) {
      arr.push(data);
    }
  });
  messageList.value = arr;
}

function send(id) {
  if (value.value === "" || !value) {
    ElMessage.warning("请输入内容在发送");
  }
  var msg = {};
  
  msg = {
    type: currentUser.value.type,
    receviewId: currentUser.value.id,
    formid: userId,
    msg: value.value,
  };
  value.value = "";
  proxy.$socket.send(msg);
  messageList.value.push(msg);
  setStorage(msg);
}
</script>

<style scoped lang="scss">
.menu-container {
  display: flex;
  width: 80%;
  .left-container {
    width: 300px;
    height: 600px;

    position: relative;
    background: #eee;
    .title {
      font-size: 18px;
      background: #d0d0d0;
    }
    .list {
      position: absolute;
      top: 40px;
      overflow: auto;
      right: 0;
      left: 0;
      bottom: 0;
      .cell {
        display: flex;
        align-items: center;
        height: 80px;
        line-height: 80px;
        background: #fff;
        .cell-img {
          img {
            margin-top: 40px;
            width: 46px;
            height: 46px;
          }
        }
        .cell-name {
          font-size: 18px;
          margin-left: 10px;
        }
        .cell-spot {
          content: "";
          width: 10px;
          height: 10px;
          background: red;
          margin-left: 10px;
          border-radius: 50%;
        }
        .cell-notice {
          margin-left: auto;
        }
      }
    }
    .lists::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      border-bottom: 1px solid #e3e3e3;
    }
  }
  .right-container {
    position: relative;
    flex: 1;
    background: #999;
    .title {
      font-size: 18px;
      background: #d0d0d0;
      text-align: center;
    }
    .list {
      position: absolute;
      top: 40px;
      overflow: auto;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }
  .cell {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
  }
  .chat-body {
    padding-top: 10px;
    position: absolute;
    top: 40px;
    bottom: 40px;
    left: 0;
    overflow-y: auto;
    right: 0;
    .tri {
      width: 0;
      height: 0;
      border: 10px solid;
      border-color: transparent #67c23a transparent transparent;

      /* //设置四边颜色 */
    }
    .span {
      min-height: 50px;
      white-space: nowrap;
      font-size: 14px;
      content: "";
      left: 0;
      position: relative;
      box-sizing: border-box;
      border-radius: 5px;
      top: -5px;
      padding: 5px 10px;
      max-width: 500px;
      background-color: #67c23a;
      min-width: 200px;
    }
    .chat {
      position: relative;
      margin-bottom: 10px;

      color: #fff;

      display: flex;
    }
    .chat-right {
      position: relative;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row-reverse;
      color: #fff;
    }
    .tri-right {
      width: 0;
      height: 0;
      border: 10px solid;
      border-color: transparent transparent transparent #909399;

      /* //设置四边颜色 */
    }
    .span-right {
      min-height: 50px;
      font-size: 14px;
      content: "";
      position: relative;
      box-sizing: border-box;
      border-radius: 5px;
      top: -5px;
      padding: 5px 10px;
      max-width: 200px;
      background-color: #909399;
    }
  }
  .chat-handle {
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    background: #fff;
    border: 1px solid #999;
    bottom: 0;
    input {
      height: 30px;
      border: 0;
      margin-top: 5px;
      padding: 0 5px;
      line-height: 30px;
      font-size: 20px;
      width: 85%;
      outline: none;
    }
    button {
      height: 30px;
      border: 1px solid #333;
      padding: 0 8px;
      border-radius: 6px;
    }
  }
}

.green {
  background: green !important;
}
.white {
  background: #fff;
}
.left {
  text-align: left;
}

.right {
  text-align: right;
}
.gray {
  background: #e3e3e3 !important;
}
</style>
