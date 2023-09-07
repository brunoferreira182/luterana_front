<template>
  <q-layout class="app-font">
    <div class="fixed-center font-montserrat" style="min-width: 500px">
      <div class="text-center">
        <q-img
          src="../assets/logo.png"
          fit="fill"
          class="q-ma-xl"
          align="center"
          width="40%"
        />
      </div>
      <div class="" v-if="userDataTabs.length > 0">
          <div class="no-wrap flex-center">
            <div                 
              v-for="(field, i) in userDataTabs[0].fields"
              :key="field"
            >
              <q-input
                :hint="field.hint"
                :label="field.label"
                :type="field.type.type"
                v-model="userDataTabs[0].fields[i].value"
                class="q-ma-sm"
                >
              </q-input>
            </div>
            <q-btn
                class="full-width q-mb-md q-mt-sm"
                color="primary"
                label="Cadastrar"
                unelevated
                @click="clkNext"
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
    <q-footer flat class="bg-transparent text-primary q-pa-md">
      <div>Versão 1.0</div>
      <div>Build 1.2</div>
    </q-footer>
  </q-layout>
</template>

<script>
import useFetch from "../boot/useFetch";
import { defineComponent } from 'vue';

export default defineComponent({
  name: "userCreateLogin",
  data() {
    return {
      userDataTabs: [],
      showPassword: false,
      newUserData: [],
      tabValue: "dados_obrigatorios",
      loginStep: "login",
      emailVerify: false
    };
  },
  beforeMount() {
    this.getUsersConfig()
  },
  methods: {
    clkNext() {
      const opt = {
        route: "/auth/createUser",
        body: {
          userDataTabs: [
            this.userDataTabs[0]
          ]
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Ocorreu um erro, tenta novamente")
          return
        }
        this.$router.push("/login")
        this.$q.notify("Cadastro realizado com sucesso")
        this.$q.notify("Prossiga com o login para definição de senha")
      });
    },
    clkBack1() {
      this.$router.push("/login")
    },
    getUsersConfig() {
      const opt = {
        route:"/desktop/adm/getUsersConfig"
      }
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.userDataTabs = r.data.userDataTabs
        }
      })
    },
  },
})
</script>
<style>

</style>
