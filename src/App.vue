<template>
  <router-view />
</template>

<script setup>
import { inject ,onBeforeMount , onMounted } from 'vue';
const socket = inject('socket');
onBeforeMount(() => {
    socket.subscribe('connect',()=>{
        console.log('you are connect')
    })
    socket.subscribe('res',(data)=>{
        console.log('我收到你的消息啦！！',data)
    })
});
onMounted(()=>{
    socket.emit("chat","good")
})
</script>

<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
