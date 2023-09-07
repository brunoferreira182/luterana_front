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
                v-model="userDataTabs[0].fields[i].value"
                :mask="field.type.mask"
                class="q-ma-sm"
              />
            </div>
            <q-btn
              class="full-width q-mb-md q-mt-sm"
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
      cpfMask: '',
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
    checkEmailValidity(){
      console.log(this.userDataTabs[0].fields[1].value)
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const emailVerify = this.userDataTabs[0].fields[1].value
      if (emailRegex.test(emailVerify) === false) {
      this.$q.notify("Preencha um email válido")
      return
      }
      this.clkNext()
    },
    // getMasks(field){
    //   console.log(field, 'AOPSIDA')
    //   switch(field){
    //     case 'cpf':
    //       this.cpfMask = '###.###.###-##'
    //     break;
    //   }
    // },
  },
})
</script>