<template>
  <q-layout class="app-font">
    <div class="fixed-center font-montserrat" style="min-width: 500px">
      <div class="text-center">
        <q-img
          src="../assets/logo.png"
          fit="fill"
          class="q-ma-xl"
          align="center"
          width="50%"
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
              <InputEmail
                class="full-width q-mb-sm"
                label="E-mail"
                field-hint="email@email.com"
                id-field="user"
                @onChange="inputChange"
                :value-field="newUserData.email"
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
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="password" class="no-wrap flex-center">
            <div class="q-gutter-lg q-mt-none">
              <q-input
                outlined
                v-model="formData.password"
                label="Senha"
                placeholder="Sua senha"
                hint="Com letras e números"
                type="password"
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
          <q-carousel-slide name="newPassword" class="no-wrap flex-center">
            <div class="padding q-gutter-lg q-mt-none">
              <q-input
                outlined
                v-model="newPassword.pass1"
                label="Senha"
                placeholder="Digite sua nova senha"
                hint="Com letras e números"
                type="password"
                autofocus
              />
              <q-input
                outlined
                v-model="newPassword.pass2"
                label="Confirme a senha"
                placeholder="Deve ser igual à senha digitada anteriormente"
                type="password"
                @keyup.enter="clkEnter"
                @keyup="checkEqualPassword"
                :rules="[
                  val => this.checkEqualPassword(val) || 'Senhas diferentes'
                ]"
              />
              <q-btn color="primary" label="Voltar" flat @click="clkBack" />
              <q-btn
                color="primary"
                label="Cadastrar"
                @click="registerNewPassword"
                :loading="btnEnterLoading"
                unelevated
                no-caps
              />
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="forgotPassword" class="no-wrap flex-center">
            <div class="q-gutter-lg q-mt-none">
              <div class="text-subtitle1 text-secondary">
                Para recuperar sua senha digite seu email abaixo
              </div>
              <InputEmail
                label="Digite seu email"
                field-hint="email@email.com"
                id-field="forgotPasswordUser"
                @onChange="inputChange"
                :value-field="newUserData.email"
                @keyup.enter="btnCheckEmail"
                autofocus
              ></InputEmail>
              <q-btn
                color="primary"
                label="Voltar"
                flat
                @click="loginStep = 'login'"
                :disable="btncheckEmailLoading"
                unelevated
                no-caps
              />
              <q-btn
                color="primary"
                label="Próximo"
                @click="btnCheckEmail"
                :loading="btncheckEmailLoading"
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
import  CryptoJS from "crypto-js"
import useFetch from "../boot/useFetch";
import { defineComponent } from 'vue'

export default defineComponent({
  name: "Login",
  data() {
    return {
      showPassword: false,
      newUserData: {
        email: "",
        password: "",
      },
      loginStep: "login",
    };
  },
  components: {
    InputEmail
  },
  methods: {
    registerPassword() { //Registrar a senha
      if (this.newPassword.pass1 !== this.newPassword.pass2) {
        this.$q.notify("As senhas não conferem. Verifique e tente novamente.");
        return;
      }
      const opt = {
        route: '/np',
        body: {
          user: this.formData.user,
          token: CryptoJS.AES.encrypt(
            this.newPassword.pass1,
            this.key
          ).toString(),
          token2: CryptoJS.AES.encrypt(
            this.newPassword.pass2,
            this.key
          ).toString()
        }
      }
      useFetch(opt).then(r => {
        if (r.error) {
          this.$q.notify(this.errorMessages(r.errorType));
          return;
        }
        this.$q.notify(
          "Senha cadastrada com sucesso. Faça o login para continuar."
        );
        this.loginStep = "login";
      });
    },
    btnCheckEmail() {
      if (this.formData.forgotPasswordUser === "") {
        this.$q.notify("Favor preencher o email");
        return;
      } else if (!this.forgotPasswordValidated) {
        this.$q.notify("Favor preencher um email válido");
        return;
      }
      this.btncheckEmailLoading = true;
      const opt = {
        route: '/checkEmailExists',
        body: {
          email: this.newUserData.email
        }
      }
      useFetch(opt).then(r => {
        this.btnNextLoading = false;
        if (r.error) {
          this.$q.notify(this.errorMessages(r.errorType));
          return;
        }
        this.loginStep = "password";
        this.key = r.data.key;
      });
      this.btncheckEmailLoading = false;
    },
  }
})
</script>
<style>

</style>
