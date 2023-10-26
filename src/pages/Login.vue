<template>
  <q-layout class="app-font">
    <div class="fixed-center font-montserrat" style="min-width: 500px">
      <div class="text-center">
        <q-img
          src="../assets/logo.png"
          fit="fill"
          class="q-ma-xl"
          align="center"
          width="30%"
        />
        <div class="text-h3 app-font-calibri-italic text-primary">
          Tabula
        </div>
        <div>Versão {{ VERSION }} - {{ BUILD }}</div>
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
          height=""
          class="q-pa-md q-mx-md"
          style=""
        >
          <q-carousel-slide name="login" class="no-wrap flex-center">
            <div class="q-gutter-md q-mt-none">
              <InputEmail
                class="full-width q-mb-sm"
                label="Login"
                field-hint="email@email.com"
                id-field="user"
                @onChange="inputChange"
                :value-field="formData.user"
                @onEnter="clkNext"
              ></InputEmail>
              <q-btn
                class="full-width"
                color="primary"
                label="Próximo"
                @click="clkNext"
                :loading="btnNextLoading"
                unelevated
                no-caps
              />
              <div class="flex flex-center full-width q-mt-md">
              <div class="divider" />
                <span class="q-mx-md">Ou</span>
                <div class="divider" />
              </div>
              <q-btn
                class="full-width"
                color="primary"
                label="Criar uma conta"
                @click="clkCreateLogin"
                :loading="btnNextLoading"
                no-caps
                outline
              />
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="password" class="no-wrap flex-center">
            <div class="q-gutter-lg q-mt-none">
              <q-input
                outlined
                v-model="formData.password"
                label="Token"
                placeholder="Sua token"
                hint="Com letras e números"
                type="text"
                @keyup.enter="clkEnter"
                autofocus
              />
              <q-btn color="primary" label="Voltar" flat @click="clkBack" unelevated no-caps/>
              <q-btn
                color="primary"
                label="Entrar"
                @click="clkEnter"
                :loading="btnEnterLoading"
                unelevated
                no-caps
              />
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
    <q-footer flat class="bg-transparent text-primary q-pa-md">
      
    </q-footer>
  </q-layout>
</template>

<script setup>
import { VERSION, BUILD } from '../boot/variables'
</script>

<script>
import InputEmail from "../components/InputEmail.vue";
import  CryptoJS from "crypto-js"
import useFetch from "../boot/useFetch";
import utils from '../boot/utils'
import { defineComponent } from 'vue'

export default defineComponent({
  name: "Login",
  data() {
    return {
      btnNextLoading: false,
      btnEnterLoading: false,
      btncheckEmailLoading: false,
      formData: {
        user: "",
        password: "",
        forgotPasswordUser: ""
      },
      key: "",
      loginStep: "login",
      emailValidated: false,
      forgotPasswordValidated: false,
      newPassword: {
        pass1: "",
        pass2: "",
        checkEqual: true
      },
      imageUrl: null
    };
  },
  components: {
    InputEmail
  },
  beforeMount() {
    // this.$q.localStorage.clear()
  },
  mounted () {
    if (this.$route.query.k) {
      this.step = 'loading'
      this.makeLoginWithQuery()
    }
  },

  methods: {
    makeLoginWithQuery () {
      // if (this.formData.user === "" || this.formData.password === "") {
      //   this.$q.notify("Favor preencher a token");
      //   return;
      // }
      const opt = {
        route: '/makeLoginWQ',
        body: {
          k: this.$route.query.k
        }
      }
      useFetch(opt).then(async r => {
        if (r.error) {
          this.btnEnterLoading = false;
          if (r.errorType === "passwordNonExistent") this.loginStep = "login";
          if (r.errorType === "wrongUserPassword") this.$q.notify('Usuário ou token incorretos')
          return;
        }
        await utils.registerUserDataAndKey({
          data: r.data,
          key: r.data.token
        })
        this.btnEnterLoading = false;
        this.$router.push("/");
      });
    },
    clkNext() {
      if (this.formData.user === "") {
        this.$q.notify("Favor preencher o login");
        return;
      } else if (!this.emailValidated) {
        this.$q.notify("Favor preencher um login válido");
        return;
      }
      this.btnNextLoading = true;
      const opt = {
        route: '/getKey',
        body: {
          login: this.formData.user
        }
      }
      useFetch(opt).then(r => {
        this.btnNextLoading = false;
        if (r.error) {
          this.$q.notify(r.errorMessage);
          if (r.errorType === "keyNonExistent") this.loginStep = "login";
          return;
        }
        this.$q.notify(
          "Sua token foi enviada por e-mail. Utilize ela para acessar o sistema."
        );
        this.loginStep = "password";
        this.key = r.data.key;
      });
    },
    async clkEnter () {
      if (this.formData.user === "" || this.formData.password === "") {
        this.$q.notify("Favor preencher a token");
        return;
      }
      this.btnEnterLoading = true;
      const opt = {
        route: '/makeLogin',
        body: {
          user: this.formData.user,
          token: CryptoJS.AES.encrypt(
            this.formData.password,
            this.key
            ).toString()
        }
      }
      useFetch(opt).then(async r => {
        if (r.error) {
          this.btnEnterLoading = false;
          if (r.errorType === "passwordNonExistent") this.loginStep = "login";
          if (r.errorType === "wrongUserPassword") this.$q.notify('Usuário ou token incorretos')
          return;
        }
        await utils.registerUserDataAndKey({
          data: r.data,
          key: this.key
        })
        this.btnEnterLoading = false;
        this.$router.push("/");
      });
    },

    inputChange(d) {
      this.formData[d.id] = d.value;
      if (d.id === "user") {
        this.emailValidated = d.validated;
      } else if (d.id === "forgotPasswordUser") {
        this.forgotPasswordValidated = d.validated;
      }
    },
    
    clkBack() {
      this.loginStep = "login";
    },
    clkCreateLogin() {
      this.$router.push("/usercreatelogin");
    },
    
  }
})
</script>
<style>
.divider{
  flex-grow: 1;
  height: 1px;
  background-color: #ccc;
}
</style>
// Alterações 25-10-2023
// verifyQuery() {
//   if (this.$route.query.k) {
//     this.loginStep = "loading"
//     const querySplit = this.$route.query.k.split(':')
//     this.key = querySplit[0] + ':' + querySplit[1]
//     this.$q.localStorage.set('$k', querySplit[0])
//     this.formData.password = querySplit[2]
//     this.clkEnter()
//   }
// },
// clkNext() {
//   if (this.formData.user === "") {
//     this.$q.notify("Favor preencher o login");
//     return;
//   } else if (!this.emailValidated) {
//     this.$q.notify("Favor preencher um login válido");
//     return;
//   }
//   this.btnNextLoading = true;
//   const opt = {
//     route: '/getKey',
//     body: {
//       login: this.formData.user
//     }
//   }
//   useFetch(opt).then(r => {
//     this.btnNextLoading = false;
//     if (r.error) {
//       this.$q.notify(r.errorMessage);
//       if (r.errorType === "keyNonExistent") this.loginStep = "login";
//       return;
//     }
//     this.$q.notify("Sua token foi enviada por e-mail. Utilize ela para acessar o sistema.")
//     this.loginStep = "password";
//     this.$q.localStorage.set('$k', r.data.key)
//     this.key = r.data.key;
//   });
// },
// async clkEnter () {
//   if (
//     // this.formData.user === "" ||
//     this.formData.password === ""
//   ) {
//     this.$q.notify("Favor preencher a token");
//     return;
//   }
//   this.btnEnterLoading = true;
//   const opt = {
//     route: '/makeLogin',
//     body: {
//       token: CryptoJS.AES.encrypt(
//         this.formData.password,
//         this.key
//         ).toString()
//     }
//   }
//   useFetch(opt).then(async r => {
//     if (r.error) {
//       this.btnEnterLoading = false;
//       if (r.errorType === "passwordNonExistent") this.loginStep = "login";
//       if (r.errorType === "wrongUserPassword") this.$q.notify('Usuário ou token incorretos')
//       return;
//     }
//     await utils.registerUserDataAndKey({
//       data: r.data,
//       key: this.key
//     })
//     // await this.$logoAndColors.getFromServer(this.$route.query.cId)
//     this.btnEnterLoading = false;
//     this.$router.push("/");
//   });
// },