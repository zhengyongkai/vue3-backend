<template>
  <router-view />
</template>

<script setup>
import { onMounted, getCurrentInstance, watch } from 'vue';
import { useStore } from 'vuex';
onMounted(() => {
  const { proxy } = getCurrentInstance();
  const store = useStore();
  watch(
    () => store.state.user.userInfo,
    (val) => {
      if (proxy.$socket.readyState != 'connect' && val && val.id) {
        proxy.$socket.doOpen();
      } else {
        if (
          proxy.$socket.readyState &&
          proxy.$socket.readyState != 'closing' &&
          proxy.$socket.readyState != 'closed'
        ) {
          proxy.$socket.doClose();
        }
      }
    },
    { deep: true, immediate: true }
  );
});
</script>

<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
