<template>
  <q-page >
    <div v-if="isMobile" class="q-pa-sm">
      <q-card
        class="card"
        v-for="item in options"
        :key="item.route"
        @click="clkOptionMenu(item)"
      >
        <q-card-section avatar>
          <q-icon :name="item.icon" size="xl" color="primary" />
        </q-card-section>
        <q-card-section>
          <q-item-label class="text-h5">{{ item.label }}</q-item-label>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from 'vue'
import utils from "../boot/utils";
import { useScreenStore } from "stores/checkIsMobile";
export default defineComponent({
  name: 'MobileMainPage',
  data () {
    return {
      permissions: [],
      isMobileState: useScreenStore().checkScreenSize(),
      isMobile: false,
      options: [],
      active: "",
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount() {
    this.isMobile = useScreenStore().isMobile
    utils.getPermissions().then((r) => {
      this.permissions = r.data;
      this.permissions.forEach((element) => {
        if (element.role && element.role.toLowerCase() === "user") {
          this.options = utils.getDrawerOptions('user')
        }
      });
    })
  },
  methods: {
    clkOptionMenu(item) {
      this.$router.push(item.route);
      this.active = item.label;
    },
  },
})
</script>
<style scoped>

.card{
  border-radius: 1rem; 
  height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
  box-shadow: 0px 0px 6px -3px;
}
</style>

