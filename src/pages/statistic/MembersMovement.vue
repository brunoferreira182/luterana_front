<template>
  <q-page-container class="no-padding">
    <q-page>

      <div class="text-h5 q-mb-sm text-center">
        Estatística 2023
        <div class="text-h6">Movimento de membros</div>
      </div>

      <div class="q-ma-sm">
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Total de membros comungantes 2022"
              v-model="membersMoviment.totalMambrosComungantes2022"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Total de membros não comungantes 2022"
              v-model="membersMoviment.totalMembrosNaoComungantes2022"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde crianças batizadas familias IELB"
              v-model="membersMoviment.criancasBatizadasFamiliasIelb"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde tranferências recebidas de comunganates"
              v-model="membersMoviment.transferenciasRecebidasComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>

        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde tranferências recebidas de não comunganates"
              v-model="membersMoviment.transferenciasRecebidasNaoComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de profissão de fé com batismo adultos comungantes"
              v-model="membersMoviment.profissaoFeBatismoAdultos"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de profissão de fé comungantes"
              v-model="membersMoviment.profissaoFe"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de crianças batizadas de famílias que entraram por profissão de fé"
              v-model="membersMoviment.criancasBatizadasFamiliasEntraramPorProfissaoFe"
              @blur="calculateTotal()"
            />
          </div>
        </div>

        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de reconhecimento de batismos não comungantes de famílias que entraram por profissão de fé"
              v-model="membersMoviment.reconhecimentoDeBatismos"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de óbitos de comungantes"
              v-model="membersMoviment.obitoComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de óbitos de não comungantes"
              v-model="membersMoviment.obitoNaoComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Transferências enviadas de comungantes"
              v-model="membersMoviment.transferenciasComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>

        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Transferências enviadas de não comungantes"
              v-model="membersMoviment.transferenciasNaoComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de abandono de comungantes"
              v-model="membersMoviment.abandonoComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de abandono de não comungantes"
              v-model="membersMoviment.abandonoNaoComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de exclusão de comungantes"
              v-model="membersMoviment.exclusoesComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>

        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Qtde de exclusão de não comungantes"
              v-model="membersMoviment.exclusoesNaoComungantes"
              @blur="calculateTotal()"
            />
          </div>
        </div>

        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Familias"
              v-model="membersMoviment.familias"
              @blur="calculateTotal()"
            />
          </div>
        </div>
        <div class="row q-ma-sm">
          <div class="col q-gutter-y-md">
            <q-input 
              type="number"
              label="Casamentos"
              v-model="membersMoviment.casamentos"
              @blur="calculateTotal()"
            />
          </div>
        </div>
      </div>

      <div class="q-ma-sm q-mt-lg">
        <div class="text-h6">Comungantes: {{ totalComungantes }}</div>
        <div class="text-h6">Não comungantes: {{ totalNaoComungantes }}</div>
        <div class="text-h5">Total: {{ total }}</div>

        <q-btn
          label="Salvar rascunho"
          color="primary"
          class="q-my-lg"
          no-caps
          @click="saveDraft()"
        />
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
  name: "MembersMovement",
  data() {
    return {
      membersMoviment: {
        totalMambrosComungantes2022: 0,
        totalMembrosNaoComungantes2022: 0,
        criancasBatizadasFamiliasIelb: 0,
        transferenciasRecebidasComungantes: 0,
        transferenciasRecebidasNaoComungantes: 0,
        profissaoFeBatismoAdultos: 0,
        profissaoFe: 0,
        criancasBatizadasFamiliasEntraramPorProfissaoFe: 0,
        reconhecimentoDeBatismos: 0,
        obitoComungantes: 0,
        obitoNaoComungantes: 0,
        transferenciasComungantes: 0,
        transferenciasNaoComungantes: 0,
        abandonoComungantes: 0,
        abandonoNaoComungantes: 0,
        exclusoesComungantes: 0,
        exclusoesNaoComungantes: 0,
        familias: 0,
        casamentos: 0
      },
      totalComungantes: 0,
      totalNaoComungantes: 0,
      total: 0
    }
  },
  beforeMount() {
    this.getMovimentoMembrosPorCongregacao()
  },
  methods: {
    getMovimentoMembrosPorCongregacao () {
      const opt = {
        route: '/desktop/statistics/getMovimentoMembrosPorCongregacao',
        body: {
          organismId: this.$route.query.organismId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error || !r.data) return
        this.membersMoviment.totalMambrosComungantes2022 = r.data.total_comungantes
        this.membersMoviment.totalMembrosNaoComungantes2022 = r.data.total_nao_comungantes
        this.calculateTotal()
      })
    },
    calculateTotal() {
      this.totalComungantes = +this.membersMoviment.totalMambrosComungantes2022 + this.getAcrescimosComungantes() - this.getDecrescimoComungantes()
      this.totalNaoComungantes = +this.membersMoviment.totalMembrosNaoComungantes2022 + this.getAcrescimosNaoComungantes() - this.getDecrescimoNaoComungantes()
      this.total = this.totalComungantes + this.totalNaoComungantes
    },
    getAcrescimosComungantes () {
      return +this.membersMoviment.transferenciasRecebidasComungantes
        + +this.membersMoviment.profissaoFeBatismoAdultos
        + +this.membersMoviment.profissaoFe
    },
    getAcrescimosNaoComungantes () {
      return +this.membersMoviment.criancasBatizadasFamiliasIelb
        + +this.membersMoviment.transferenciasRecebidasNaoComungantes
        + +this.membersMoviment.criancasBatizadasFamiliasEntraramPorProfissaoFe
        + +this.membersMoviment.reconhecimentoDeBatismos
    },
    getDecrescimoComungantes () {
      return +this.membersMoviment.obitoComungantes
        + +this.membersMoviment.transferenciasComungantes
        + +this.membersMoviment.abandonoComungantes
        + +this.membersMoviment.exclusoesComungantes
    },
    getDecrescimoNaoComungantes () {
      return +this.membersMoviment.obitoNaoComungantes
        + +this.membersMoviment.transferenciasNaoComungantes
        + +this.membersMoviment.abandonoNaoComungantes
        + +this.membersMoviment.exclusoesNaoComungantes
    },
  }
})
</script>
<style>
.card {
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