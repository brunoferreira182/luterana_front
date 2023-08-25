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
      <div class="">
        <q-carousel
          v-model="loginStep"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="white"
          navigation
          padding
          arrows
          class="q-pa-md q-mx-md"
        >
          <q-carousel-slide name="login" class="no-wrap flex-center">
            <div 
              class="q-gutter-md q-mt-none" 
              v-for="(field, i) in newUserData[0].fields" 
              :key="i"
              >
              <q-input v-if="field"
                v-model="newUserData[0].fields[i].value"
                class="q-mb-sm"
                outlined
                :label="field.label"
                :hint="field.hint"
              ></q-input>
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
          </q-carousel-slide>
        </q-carousel>
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: "userCreateLogin",
  data() {
    return {
      showPassword: false,
      newUserData: [
        {
        tabLabel: "Dados obrigatórios",
        fields: [
          {
            hint: 'Informe o nome completo',
            label: 'Nome',
            required: true,
            type: {
              _id: "64ad55727cb57d0bd22b10d5",
              type: 'string',
              label: 'Texto'
            },
            model: 'nome',
            value: ''
          },
          {
            hint: 'Preencha um e-mail válido',
            label: 'Email',
            required: true,
            type: {
              _id: "64ad55727cb57d0bd22b10d5",
              type: 'string',
              label: 'Texto'
            },
            model: 'email',
            value: ''
          },
        ]
      }
      ],
      tabValue: "dados_obrigatorios",
      loginStep: "login",
      emailVerify: false
    };
  },
  methods: {
    clkNext() {
        let regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
        let userEmail = this.newUserData[0].fields[1].value;
        let isMatch = regexEmail.test(userEmail);
        if(this.newUserData[0].fields[0].value === "" || this.newUserData[0].fields[1].value === "") {
          this.$q.notify("Preencha todos os campos para prosseguir")
          return
        }  else if(isMatch === false) {
          this.$q.notify("Insira um e-mail válido")
          return
        }
        const userData = this.newUserData
        const opt = {
          route: "/auth/createUser",
          body: {
            userDataTabs: userData
          }
        }
        useFetch(opt).then((r) => {
          if(r.data.error) {
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
  },
})
</script>
<style>

</style>
