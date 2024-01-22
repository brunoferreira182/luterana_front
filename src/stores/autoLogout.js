import { defineStore } from 'pinia';
import { Notify } from 'quasar';

export const useAutoLogoutStore = defineStore({
  id: 'autoLogout',
  state: () => ({
    timer: null,
  }),
  actions: {
    init(router) {
      this.router = router;
      window.addEventListener('mousemove', this.resetAutoLogoutTimer);
      window.addEventListener('touchmove', this.resetAutoLogoutTimer);
      window.addEventListener('touchend', this.resetAutoLogoutTimer);
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
