import { defineStore } from 'pinia';
import { Notify } from "quasar";
export const useAutoLogoutStore = defineStore({
  id: 'autoLogout',
  state: () => ({
    timer: null,
  }),
  actions: {
    startAutoLogoutTimer() {
      this.timer = setTimeout(() => {
        localStorage.clear();
        Notify.create({
          message: 'Você foi desconectado devido à inatividade.',
          timeout: 2000,
          type: 'negative',
        });
        this.timer = null
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
