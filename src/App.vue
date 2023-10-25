<template>
  <router-view />
</template>

<script>
import { useAutoLogoutStore } from "stores/autoLogout";

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  created() {
    
    const autoLogoutStore = useAutoLogoutStore();
    autoLogoutStore.startAutoLogoutTimer();
    
    window.addEventListener('mousemove', () => {
      autoLogoutStore.resetAutoLogoutTimer();
    });
    
    window.addEventListener('click', () => {
      autoLogoutStore.resetAutoLogoutTimer();
    });
  },
})

</script>
