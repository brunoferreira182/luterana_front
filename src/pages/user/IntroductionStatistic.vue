<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="text-h5 q-ma-sm">
        Introdução a Estatística 2023!
      </div>
      <div class="q-ma-md text-h6">
        <div>
          Boa notícia! A Estatística 2023 será feita através do Tabula! 
        </div>
        <div>
          Fique atento às instruções para não ter dúvidas na hora de preencher.
        </div>
      </div>
      <div class="q-ma-md q-mt-lg">
        <div class="text-h6 text-wrap q-mb-md">
          1. Em cada sessão do formulário, você poderá observar que existe o ícone <q-icon name="help"><q-tooltip>Dicas aqui</q-tooltip></q-icon>, ele trará informações sobre a etapa presente para tirar possíveis dúvidas.
        </div>
        <div class="text-h6 text-wrap q-mb-md">
          2. Não conseguiu terminar o formulário? Não tem problema! Você pode salvar como rascunho e terminar quando for possível.
        </div>
        <div class="text-h6 text-wrap q-mb-md">
          3. Existe alguma informação desatualizada? Basta clicar no lápis  <q-icon name="edit"/> para editar a informação.
        </div>
      </div>
      <div class="q-ma-md q-mt-lg">
        <div class="text-h5">
          Sobre as etapas:
        </div>
        <div class="text-h6">
          A estatística será dividida em 4 etapas, sendo elas:
        </div>
        <div class="q-mt-md text-h6 text-wrap">
          <div class="q-mt-md">
            <strong>1. Etapa Paroquial/Congregação:</strong> Este bloco é dedicado às congregações e paróquias.
          </div>
          <div class="q-mt-md">
            <strong>2. Etapa Pastoral:</strong> Este bloco será preenchido somente pelo pastor, dedicado aos dados pastorais.
          </div>
          <div class="q-mt-md">
            <strong>3. Atividade/Movimento:</strong> Este bloco contém dados sobre os grupos e o movimento de membros.
          </div>
          <div class="q-mt-md">
            <strong>4. Financeiro:</strong> Este bloco é dedicado para os dados financeiros.
          </div>
        </div>
      </div>
      <div class="q-mt-xl text-right q-mr-xl">
        <q-btn
          color="primary"
          unelevated
          rounded
          no-caps
          style="width: 20%; font-size: large;"
          label="Prosseguir"
          @click="goToStatistics"
        />
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name:"IntroStatistics",
  data() {
    return {}
  },
  methods: {
    goToStatistics() {
      this.$router.push('/user/statistic')
    }
  }
})
</script>