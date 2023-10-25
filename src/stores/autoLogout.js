import { defineStore } from 'pinia';
import { Notify } from "quasar";
export const useAutoLogoutStore = defineStore({
  id: 'autoLogout',
  state: () => ({
    timer: null,
  }),
  actions: {
    init(router) {
      this.router = router;
      this.startAutoLogoutTimer();
    },
    startAutoLogoutTimer() {
      this.timer = setTimeout(() => {
        Notify.create({
          message: 'Você foi desconectado devido à inatividade.',
          timeout: 2000,
          type: 'negative',
        });
        this.timer = null;
        if (this.router) {
          localStorage.clear();
          this.router.push('/login');
        }
      }, 3600000);
    },
    resetAutoLogoutTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.startAutoLogoutTimer();
    },
  },
});
