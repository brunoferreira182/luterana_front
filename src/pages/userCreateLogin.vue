<template>
  <div class="app-font row justify-center">
    <div class="col-6 font-montserrat q-pa-md" style="overflow:auto" v-if="!isMobile">
      <div class="text-center">
        <q-img
          src="../assets/logo.png"
          fit="fill"
          class="q-ma-xl"
          align="center"
          width="40%"
        />
        <div class="text-h3 text-primary app-font-calibri-italic">
          Tabula
        </div>
      </div>
      <div class="" v-if="userDataTabs.length > 0">
        <div class="q-gutter-md">
          <div
            v-for="(field, i) in userDataTabs[0].fields"
            :key="field"
          >
            <q-input
              v-if="field.type.type !== 'options'"
              :hint="field.hint"
              :label="field.label"
              v-model="userDataTabs[0].fields[i].value"
              :mask="field.type.mask"
              outlined
            />
            <q-select
              v-if="field.type.type === 'options'"
              outlined
              :label="field.label"
              option-label="optionName"
              emit-value
              map-options
              :hint="field.hint"
              v-model="field.value"
              :options="field.options"
            >
            </q-select>
          </div>
          <div class="q-gutter-md q-pb-lg">
            <q-btn
              class="full-width"
              color="primary"
              label="Cadastrar"
              unelevated
              @click="checkEmailValidity"
              no-caps
            />
            <q-btn 
              class="full-width"
              color="primary" 
              label="Voltar" 
              outline
              @click="clkBack1" 
              unelevated 
              no-caps
            />
          </div>
        </div>
      </div>
    </div>
    <div class="font-montserrat col-12 q-pa-md" style="overflow:auto" v-else-if="isMobile">
      <div class="text-center">
        <q-img
          src="../assets/logo.png"
          fit="fill"
          class="q-ma-xl"
          align="center"
          width="40%"
        />
        <div class="text-h3 text-primary app-font-calibri-italic">
          Tabula
        </div>
      </div>
      <div class="" v-if="userDataTabs.length > 0">
        <div class="q-gutter-md">
          <div
            v-for="(field, i) in userDataTabs[0].fields"
            :key="field"
          >
            <q-input
              v-if="field.type.type !== 'options'"
              :hint="field.hint"
              :label="field.label"
              v-model="userDataTabs[0].fields[i].value"
              :mask="field.type.mask"
              outlined
            />
            <q-select
              v-if="field.type.type === 'options'"
              outlined
              :label="field.label"
              option-label="optionName"
              emit-value
              map-options
              :hint="field.hint"
              v-model="field.value"
              :options="field.options"
            >
            </q-select>
          </div>
          <div class="q-gutter-md">
            <q-btn
              class="full-width"
              color="primary"
              label="Cadastrar"
              unelevated
              @click="checkEmailValidity"
              no-caps
            />
            <q-btn 
              class="full-width"
              color="primary" 
              label="Voltar" 
              outline
              @click="clkBack1" 
              unelevated 
              no-caps
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useFetch from "../boot/useFetch";
import { defineComponent } from 'vue';
import { useScreenStore } from "stores/checkIsMobile";
export default defineComponent({
  name: "userCreateLogin",
  data() {
    return {
      isMobileState: useScreenStore().checkScreenSize(),
      userDataTabs: [],
      showPassword: false,
      isMobile: false,
      newUserData: [],
      cpfMask: '',
      tabValue: "dados_obrigatorios",
      loginStep: "login",
      emailVerify: false
    };
  },
  beforeMount() {
    this.isMobile = useScreenStore().isMobile
    this.getUsersConfig()
  },
  methods: {
    clkNext() {
      const opt = {
        route: "/auth/createUser",
        body: {
          userDataTabs: this.userDataTabs
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          this.$q.notify("Ocorreu um erro, tenta novamente")
          return
        }
        this.$router.push("/login")
        this.$q.notify("Cadastro realizado com sucesso, prossiga com o login para definição de senha")
      });
    },
    clkBack1() {
      this.$router.push("/login")
    },
    getUsersConfig() {
      const opt = {
        route:"/desktop/adm/getUsersConfig",
        body: {
          userType: 'user'
        }
      }
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.userDataTabs = r.data.userDataTabs
        }
      })
    },
    checkEmailValidity(){
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const emailVerify = this.userDataTabs[0].fields[1].value
      if (emailRegex.test(emailVerify) === false) {
      this.$q.notify("Preencha um email válido")
      return
      }
      this.clkNext()
    },
    // getMasks(field){
    //   switch(field){
    //     case 'cpf':
    //       this.cpfMask = '###.###.###-##'
    //     break;
    //   }
    // },
  },
})
</script>