<template>
  <q-layout class="app-font" view="lHh LpR LFf" id="idMainLayout">
    <div class="">
      <div class="col-11">
        <q-header>
          <q-toolbar class="bg-grey-3 text-primary" id="idMainToolbar">
            <q-btn
              v-if="!isMobile"
              flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="clkDrawer"
            />
            <q-btn 
              v-if="isMobile && !$route.path.includes('/mobileMainPage')"
              flat
              dense
              rounded
              icon="arrow_back_ios_new"
              @click="$router.back()"
            />
            <q-toolbar-title  v-if="!isMobile"/>
            <q-toolbar-title class="text-primary text-h5 app-font-calibri-italic" v-if="isMobile">
              Tabula
            </q-toolbar-title>
            <div class="q-mr-md">
              <q-btn auto-close icon="notifications" dense flat v-if="!isMobile">
                <q-badge
                  v-if="statusNotificationsList.length > 0"
                  floating
                  color="teal"
                >
                  {{
                    statusNotificationsList.length >= 10
                      ? "+" + statusNotificationsList.length
                      : statusNotificationsList.length
                  }}
                </q-badge>
                <q-menu anchor="bottom left" class="app-font" no-padding>
                  <q-list separator>
                    <q-item
                      v-for="notification in statusNotificationsList"
                      :key="notification._id"
                      clickable
                      v-close-popup
                      style="min-width: 320px; padding: 0px"
                      @click="clkOpenExpenseDetail(notification)"
                    >
                      <q-item-section class="q-pa-sm">
                        <q-item-label v-if="notification.apelidoDespesa !== ''">
                          {{ notification.apelidoDespesa }}
                        </q-item-label>
                        <q-item-label v-else> Despesa sem nome </q-item-label>
                        <q-item-label caption>
                          Novo status: {{ notification.status.label }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section
                        side
                        class="q-mr-md text-grey text-caption"
                        v-if="dateDay === notification.createdAtOnlyDate"
                      >
                        {{ notification.createdAtLocale.slice(11, 16) }}
                      </q-item-section>
                      <q-item-section
                        side
                        v-else
                        class="q-mr-sm q-mt-xs text-grey text-caption"
                      >
                        {{ dateDay.slice(0, 5) }}
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="statusNotificationsList.length === 0"
                      clickable
                      v-close-popup
                      style="min-width: 300px; padding: 0px"
                    >
                      <q-item-section class="q-pa-md">
                        <div class="row items-center justify-center">
                          <div class="col-2">
                            <q-icon
                              name="notifications_off"
                              size="30px"
                              color="orange-6"
                            ></q-icon>
                          </div>
                          <div class="col-8">Não há notificações</div>
                        </div>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      style="min-height: 60px"
                      @click="$router.push('/notifications')"
                    >
                      <q-item-section>
                        <q-item-label class="text-center text-primary">
                          Mostrar todas as notificações
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
            <div class="q-mr-md">
              <q-btn icon="home" dense flat @click="$router.push('/')" v-if="!isMobile">
                <q-tooltip anchor="bottom left" :offset="[10, 10]">
                  Ir para tela home
                </q-tooltip>
              </q-btn>
              <q-btn icon="home" dense flat @click="$router.push('/mobileMainPage')" v-if="isMobile">
                <q-tooltip anchor="bottom left" :offset="[10, 10]">
                  Ir para tela home
                </q-tooltip>
              </q-btn>
            </div>
            <div>
              <q-btn icon="logout" dense flat @click="$router.push('/login')">
                <q-tooltip anchor="bottom left" :offset="[10, 10]">
                  Desconectar-se
                </q-tooltip>
              </q-btn>
            </div>
          </q-toolbar>
        </q-header>
        <q-drawer
          v-if="!isMobile"
          v-model="leftDrawerOpen"
          show-if-above
          :width="300"
          class="bg-grey-3"
        >
          <div :class="`${permissions.length === 1 ? 'justify-center' : 'justify-start'} fit row`">
            <div class="col-3 gradient text-white text-center" v-if="permissions.length > 1">
              <q-list>
                <q-item
                  :active="activeRightDrawer === item.id"
                  active-class="bg-grey-3 text-primary "
                  class="q-py-md text-center q-px-none"
                  :style="
                    i === indexMenu1 + 1
                      ? 'border-radius: 0 15px 0 0'
                      : i === indexMenu1 - 1
                      ? 'border-radius: 0 0 15px 0'
                      : ''
                  "
                  @click="clkItem(item, i)"
                  v-for="(item, i) in permissions"
                  :key="item.id"
                  clickable
                  v-ripple
                >
                  <q-item-section class="">
                    <q-item-label>
                      <q-icon
                        size="2rem"
                        :name="item.icon"
                        :color="
                          activeRightDrawer === item.id
                            ? 'primary'
                            : 'bg-accent'
                        "
                      >
                        <q-tooltip>
                          {{ item.label }}
                        </q-tooltip>
                      </q-icon>
                    </q-item-label>

                    <q-item-label class="text-caption">{{
                      item.nick
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list>
                <q-item
                  class=" q-pa-none"
                  :style="
                    indexMenu1 === permissions.length - 1
                      ? 'border-radius: 0 15px 0 0'
                      : ''
                  "
                >
                </q-item>
              </q-list>
            </div>
            <div class="col-9">
              <DrawerLogo />
              <div class="text-h4 q-py-lg text-center text-primary app-font-calibri-italic">
                Tabula
              </div>
              <q-list class="q-mx-xs q-gutter-y-xs">
                <q-item
                  class="redondo"
                  v-for="item in options"
                  :key="item.route"
                  clickable
                  v-ripple
                  :active="active === item.label"
                  active-class="bg-blue-grey-2 text-primary"
                  @click="clkOptionMenu(item)"
                >
                  <q-item-section v-if="active === item.label" avatar>
                    <q-icon :name="item.icon" color="primary" />
                  </q-item-section>
                  <q-item-section v-else avatar>
                    <q-icon :name="item.icon" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-drawer>
        <q-page-container class="bg-grey-3">
          <q-scroll-area
            class="bg-accent"
            :style="'height: ' + heightRouterView + 'px; border-radius: 15px;'"
          >
            <router-view
              :permissions="permissions"
              :drawer="leftDrawerOpen"
              :style="
                'height: ' + heightRouterView + 'px; border-radius: 15px;'
              "
              class="bg-accent q-pa-sm"
            />
            
          </q-scroll-area>
        </q-page-container>
      </div>
    </div>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import DrawerLogo from "../components/DrawerLogo.vue";
import utils from "../boot/utils";
import { date, dom } from "quasar";
import { useScreenStore } from "stores/checkIsMobile";
const { height } = dom;
export default defineComponent({
  name: "MainLayout",
  components: {
    DrawerLogo,
  },
  data() {
    return {
      isMobileState: useScreenStore().checkScreenSize(),
      indexMenu1: 0,
      statusNotificationsList: [],
      drawer: false,
      drawerRight: true,
      drawerData: true,
      filterValue: "",
      userInfo: "",
      isMobile: false,
      activeMenu: "",
      permissions: [],
      leftDrawerOpen: true,
      active: "",
      activeRightDrawer: 1,
      options: [],
      dateNow: Date.now(),
      dateDay: date.formatDate(Date.now(), "DD/MM/YYYY"),
      dateTime: date.formatDate(Date.now(), "HH:mm"),
      heightRouterView: 0,
    };
  },
  mounted() {
    this.$q.loading.hide();
    this.heightRouterView =
      height(document.getElementById("idMainLayout")) -
      height(document.getElementById("idMainToolbar"));
  },
  beforeMount() {

    this.isMobile = useScreenStore().isMobile
    this.userInfo = utils.presentUserInfo();
    if (!this.userInfo || !this.userInfo.token) {
      this.$router.push("/login");
      return;
    }
    if(this.isMobile){
      this.$router.push('/mobileMainPage')
      return
    }
    utils.getPermissions().then((r) => {
      this.permissions = r.data;
      this.activeRightDrawer = this.permissions[0].id;
      if (
        this.permissions.length === 1
      ) {
        this.options = utils.getDrawerOptions(this.permissions[0].role.toLowerCase());
        this.activeRightDrawer = this.permissions[0].id;
        this.active = this.options[0].label;
        this.$router.push(this.options[0].route)
      } else {
        this.options = utils.getDrawerOptions(this.$route.path.split("/")[1]);
      }
      this.permissions.forEach((element) => {
        if (this.$route.path.split("/")[1] === element.role.toLowerCase()) {
          this.activeRightDrawer = element.id;
          this.indexMenu1 = this.permissions.indexOf(element);
        }
      });
      this.options.forEach((element) => {
        if (this.$route.fullPath === element.route) {
          this.active = element.label;
        }
      });
    });
    // this.getStatusNotifications()
    this.drawerData = this.drawer;
  },
  beforeUnmount() {
    localStorage.clear();
  },
  watch: {
    $route() {
      let existe = false;
      if (this.options) {
        this.options.forEach((element) => {
          if (this.$route.path === element.route) {
            existe = true;
          }
        });
        if (!existe) {
          this.active = false;
        }
      }
    },
  },
  methods: {
    async getCompanyColors() {
      await this.$logoAndColors.getFromServer(this.userInfo.cId);
      return;
    },
    clkOptionMenu(item) {
      this.$router.push(item.route);
      this.active = item.label;
    },
    clkDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    clkItem(item, i) {
      
      this.indexMenu1 = i;
      this.activeRightDrawer = item.id;
      this.$router.push("/" + item.role.toLowerCase());
      this.options = utils.getDrawerOptions(item.role.toLowerCase());
    },
    clkMenu(menuItem, i) {
      this.activeMenu = i;
      this.$router.push(menuItem.route);
    },
  },
});
</script>

<style scoped>
.gradient {
  transition: opacity 0.5s;
  background-image: linear-gradient(to bottom, #2c3393, #2675c3, #04acf3);

  background-size: 100%;
  background-repeat: repeat;
}
.borda-redonda {
  border-radius: 0 15px 15px 0;
}
.redondo {
  border-radius: 50px;
}
</style>
