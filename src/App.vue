<template>
  <router-view />
</template>

<script>
// import { useAutoLogoutStore } from "stores/autoLogout";
// import { useRouter } from 'vue-router';
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  // created() {
  //   const router = useRouter()
  //   const autoLogoutStore = useAutoLogoutStore();
    
  //   autoLogoutStore.startAutoLogoutTimer();
    
  //   window.addEventListener('mousemove', () => {
  //     autoLogoutStore.resetAutoLogoutTimer();
  //   });
    
  //   window.addEventListener('click', () => {
  //     autoLogoutStore.resetAutoLogoutTimer();
  //   });

  //   autoLogoutStore.$subscribe((state) => {
  //     if (state.events.target.timer === null) {
  //       localStorage.clear();
  //       router.replace('/login')
  //     }
  //   });
  // },
})

</script>
