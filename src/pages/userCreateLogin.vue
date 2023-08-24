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
            <div class="q-gutter-md q-mt-none">
              <q-input
                class="full-width q-mb-sm"
                label="Nome"
                hint="Insira seu nome"
                outlined
                v-model="newUserData.name"
              ></q-input>
              <InputEmail
                class="full-width q-mb-sm"
                label="E-mail"
                field-hint="email@email.com"
                v-model="newUserData.email"
              ></InputEmail>
              <q-btn
                class="full-width"
                color="primary"
                label="Próximo"
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
          </q-carousel-slide>
          <q-carousel-slide name="login2" class="no-wrap flex-center">
            <div class="q-gutter-lg q-mt-none">
              <q-input
                class="full-width"
                outlined
                v-model="newUserData.user"
                label="Apelido"
                hint="Como você gostaria de ser chamado"
              />
              <q-input
                class="full-width"
                outlined
                mask="(##) ##### ####"
                v-model="newUserData.phone"
                label="Celular"
                hint="Seu número de celular"
                type="tel"
              />
              <q-btn
              class="full-width"
              color="primary"
              label="Próximo"
              @click="clkNext2"
              unelevated
              no-caps
              />
              <q-btn 
                class="full-width"
                color="primary" 
                label="Voltar" 
                outline
                @click="clkBack2" 
                unelevated 
                no-caps
              />
            </div>
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
import InputEmail from "../components/InputEmail.vue";
import useFetch from "../boot/useFetch";
import { defineComponent } from 'vue'

export default defineComponent({
  name: "userCreateLogin",
  data() {
    return {
      showPassword: false,
      newUserData: {
        name: "",
        email: "",
        user: "",
        phone: "",
      },
      loginStep: "login",
      emailVerify: false
    };
  },
  components: {
    InputEmail
  },
  methods: {
    clkNext() {
        let regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;
        let userEmail = this.newUserData.email;
        let isMatch = regexEmail.test(userEmail);
        if(this.newUserData.name === "" || this.newUserData.email === "") {
          this.$q.notify("Preencha todos os campos para prosseguir")
          return
        }  else if(isMatch === false) {
          this.$q.notify("Insira um e-mail válido")
          return
        }
        this.loginStep = "login2"
      },
      clkNext2() {
        if(this.newUserData.user === "" || this.newUserData.phone === "") {
          this.$q.notify("Preencha todos os campos para prosseguir")
          return
        } else if (!(this.newUserData.phone.length === 15)) {
          this.$q.notify("Insira um número válido")
          return
        }
        const name = this.newUserData.name
        const email = this.newUserData.email
        const user = this.newUserData.user
        const phone = this.newUserData.phone
        const opt = {
          route: "/desktop/user/createUser",
          body: {
            userData: {
              name: name,
              email: email,
              user: user,
              phone: phone
            }
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
      clkBack2() {
        this.loginStep = "login"
      },
  },
})
</script>
<style>

</style>
