<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Introdução" 
            @click="$router.push('/statistic/selectOrganismToWriteStatisticData')"
            />
            <q-breadcrumbs-el 
            style="cursor: pointer;" 
            :label="congregationName"
            @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
          />
          <q-breadcrumbs-el label="Movimento de membros" />
        </q-breadcrumbs>
        <div
          class="text-center q-mt-lg"
          v-if="otherOrganisms && otherOrganisms.length > 0"
        >
          <div class="text-h6">
            Selecione outras congregações para responder estes dados:
          </div>
          <div>
            <q-chip
              clickable
              v-for="org in otherOrganisms"
              :key="org"
              @click="$router.push('/statistic/membersMovement?organismId=' + org._id)"
            >
              {{ org.name }}
            </q-chip>
          </div>
          <q-separator
            class="q-mt-md q-mx-md"
          ></q-separator>
        </div>
      </div>

      <div class="text-h5 q-my-md text-center">
        Estatística 2023
        <div class="text-h6">Movimento de membros</div>
      </div>

      <div class="q-ma-sm">
        
        <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md">
          <div class="text-h6">Instrução de confirmados</div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-select 
                label="Numero de turmas"
                v-model="membersMovement.instrucaoDeConfirmados.anosEstudo"
                @update:model-value="(ev) => calculaAnosEstudo(ev)"
                :options="[1, 2, 3, 4]"
              />
            </div>
          </div>
          <div v-if="(instructionYears - 1 !== 0) &&  index !== instructionYears - 1">Quantidade de alunos</div>
          <div
            class="q-ma-sm"
            v-for="(confirmado, index) in membersMovement.instrucaoDeConfirmados.confirmados"
            :key="index"
          >
            <div 
              class="col q-gutter-y-md"
              v-if="(instructionYears - 1 !== 0) &&  index !== instructionYears - 1"
            >
              <q-item-label class=" q-pa-sm"> 
                <div class="col-6 justify-between">
                  <q-input 
                  type="number"
                  :label="`${confirmado.turma}° ano de 2023`"
                  v-model="membersMovement.instrucaoDeConfirmados.confirmados[index].Quant"
                  />
                </div>
              </q-item-label>
            </div>
            <div
              v-if="(instructionYears - 1 === 0) || index === instructionYears - 1"
            >
              <q-item-label class=" q-pa-sm"> Quant. de confirmados em 2023
                <div class="col-6 justify-between">
                  <q-input 
                  type="number"
                  v-model="membersMovement.instrucaoDeConfirmados.confirmados[index].Quant"
                  />
                </div>
              </q-item-label>
            </div>
          </div>
        </div>
        <div style="border-radius: 1rem; background-color: rgb(245, 245, 245);" class="q-gutter-y-md q-pa-md q-mt-md">
          <div class="text-h6">Movimento de membros</div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Total de comungantes 2022"
                v-model="membersMovement.totalMambrosComungantes2022"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Total de membros não comungantes 2022"
                v-model="membersMovement.totalMembrosNaoComungantes2022"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. crianças batizadas de familias IELB"
                v-model="membersMovement.criancasBatizadasFamiliasIelb"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. tranferências recebidas de comunganates"
                v-model="membersMovement.transferenciasRecebidasComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>

          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. tranferências recebidas de não comunganates"
                v-model="membersMovement.transferenciasRecebidasNaoComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de profissão de fé com batismo adultos"
                v-model="membersMovement.profissaoFeBatismoAdultos"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de profissão de fé com reconhecimento de batismo"
                v-model="membersMovement.profissaoFe"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de crianças batizadas de famílias que entraram por profissão de fé"
                v-model="membersMovement.criancasBatizadasFamiliasEntraramPorProfissaoFe"
                @blur="calculateTotal()"
              />
            </div>
          </div>

          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de reconhecimento de batismos não comungantes de famílias que entraram por profissão de fé"
                v-model="membersMovement.reconhecimentoDeBatismos"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de óbitos de comungantes"
                v-model="membersMovement.obitoComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de óbitos de não comungantes"
                v-model="membersMovement.obitoNaoComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Transferências enviadas de comungantes"
                v-model="membersMovement.transferenciasComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>

          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Transferências enviadas de não comungantes"
                v-model="membersMovement.transferenciasNaoComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de abandono de comungantes"
                v-model="membersMovement.abandonoComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de abandono de não comungantes"
                v-model="membersMovement.abandonoNaoComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de exclusão de comungantes"
                v-model="membersMovement.exclusoesComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>

          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Quant. de exclusão de não comungantes"
                v-model="membersMovement.exclusoesNaoComungantes"
                @blur="calculateTotal()"
              />
            </div>
          </div>

          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Familias"
                v-model="membersMovement.familias"
                @blur="calculateTotal()"
              />
            </div>
          </div>
          <div class="row q-ma-sm">
            <div class="col q-gutter-y-md">
              <q-input 
                type="number"
                label="Casamentos"
                v-model="membersMovement.casamentos"
                @blur="calculateTotal()"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="q-ma-sm q-mt-lg q-ml-md text-left">
        <div class="text-h5">Totalização de membros: {{ total }}</div>
        <div class="text-h6">Comungantes: {{ totalComungantes }}</div>
        <div class="text-h6">Não comungantes: {{ totalNaoComungantes }}</div>
      </div>
      <div class="q-ma-lg q-pb-sm text-center">
        <q-chip
          v-if="validated"
          color="green"
          label="Validado"
          text-color="white"
          icon="done"
        />
  
        <q-chip
          v-if="!validated"
          color="red"
          label="Não Validado"
          text-color="white"
          icon="warning"
        />
  
        <q-btn
          label="Salvar rascunho"
          color="primary"
          unelevated
          class="q-my-sm full-width"
          rounded
          no-caps
          @click="saveDraft()"
        />
        <q-btn
          label="Salvar Oficial"
          color="orange"
          rounded
          unelevated
          class="full-width q-my-sm"
          no-caps
          @click="saveOficial()"
        />
        <div class="row q-gutter-sm q-pt-xs">
          <q-btn
            label="Etapa anterior"
            color="primary"
            rounded
            unelevated
            icon="navigate_before"
            class="col items-start"
            no-caps
            @click="$router.push('/statistic/groupActivity?organismId=' + $route.query.organismId)"
          />
          <q-btn
            label="Próxima etapa"
            color="primary"
            rounded
            unelevated
            icon-right="navigate_next"
            class="col items-end"
            no-caps
            @click="$router.push('/statistic/writeFinanceStatisticData?organismId=' + $route.query.organismId)"
          /> 
        </div>
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
      congregationName:'',
      membersMovement: {
        totalMambrosComungantes2022: '',
        totalMembrosNaoComungantes2022: '',
        criancasBatizadasFamiliasIelb: '',
        transferenciasRecebidasComungantes: '',
        transferenciasRecebidasNaoComungantes: '',
        profissaoFeBatismoAdultos: '',
        profissaoFe: '',
        criancasBatizadasFamiliasEntraramPorProfissaoFe: '',
        reconhecimentoDeBatismos: '',
        obitoComungantes: '',
        obitoNaoComungantes: '',
        transferenciasComungantes: '',
        transferenciasNaoComungantes: '',
        abandonoComungantes: '',
        abandonoNaoComungantes: '',
        exclusoesComungantes: '',
        exclusoesNaoComungantes: '',
        familias: '',
        casamentos: '',
        instrucaoDeConfirmados: {
          anosEstudo: '',
          confirmados: []
        }
      },
      validated: false,
      totalComungantes: 0,
      totalNaoComungantes: 0,
      total: 0,
      instructionYears: null,
      otherOrganisms: [],
    }
  },
  watch: {
    '$route.query.organismId': {
      handler(newOrganismId, oldOrganismId) {
        if (newOrganismId !== oldOrganismId) {
          this.membersMovement = {
            totalMambrosComungantes2022: '',
            totalMembrosNaoComungantes2022: '',
            criancasBatizadasFamiliasIelb: '',
            transferenciasRecebidasComungantes: '',
            transferenciasRecebidasNaoComungantes: '',
            profissaoFeBatismoAdultos: '',
            profissaoFe: '',
            criancasBatizadasFamiliasEntraramPorProfissaoFe: '',
            reconhecimentoDeBatismos: '',
            obitoComungantes: '',
            obitoNaoComungantes: '',
            transferenciasComungantes: '',
            transferenciasNaoComungantes: '',
            abandonoComungantes: '',
            abandonoNaoComungantes: '',
            exclusoesComungantes: '',
            exclusoesNaoComungantes: '',
            familias: '',
            casamentos: '',
            instrucaoDeConfirmados: {
              anosEstudo: '',
              confirmados: []
            }
          }
          this.getMovimentoMembrosPorCongregacao()
          this.getOrganismNameForBreadCrumbs()
          this.getOthersCongregations()
        }
      },
      immediate: true
    }
  },
  beforeUnmount(){
    this.saveDraftOnBeforeUnmount()
  },
  beforeMount() {
    this.getMovimentoMembrosPorCongregacao()
    this.getOrganismNameForBreadCrumbs()
    this.getOthersCongregations()
  },
  methods: {
    getOthersCongregations() {
      this.otherOrganisms = []
      const opt = {
        route: '/desktop/statistics/getMyOrganismsList'
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        r.data.forEach((org) => {
          if (org._id !== this.$route.query.organismId) {
            const exists = this.otherOrganisms.some(existOrg => existOrg._id === org._id);
            if (!exists) {
              this.otherOrganisms.push({
                name: org.name,
                _id: org._id
              });
            }
          }
        })       
      })
    },
    calculaAnosEstudo (ev) {
      this.instructionYears = ev
      this.membersMovement.instrucaoDeConfirmados.confirmados = []
      for (let i = 1; i <= ev; i++) {
        if (i === ev) {
          this.membersMovement.instrucaoDeConfirmados.confirmados.push(
            {
              turma: i  ,
              Quant: null,
              confirmationYear: true
            }
          )
        } else {
          this.membersMovement.instrucaoDeConfirmados.confirmados.push(
            {
              turma: i  ,
              Quant: null,
              confirmationYear: false
            }
          )
        }
      }
    },
    saveDraftOnBeforeUnmount(){
      for (let i = 0; i < this.membersMovement.instrucaoDeConfirmados.confirmados.length; i++) {
        if (this.membersMovement.instrucaoDeConfirmados.confirmados[i].Quant === '' || !this.membersMovement.instrucaoDeConfirmados.confirmados[i].Quant) {
            return this.$q.notify('CAMPOS OBRIGATÓRIOS NÃO PREENCHIDOS!')
        }
      }
      const opt = {
        route: '/desktop/statistics/saveDraftMembersMovement',
        body: {
          organismId: this.$route.query.organismId,
          membersMovement: this.membersMovement
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) return
        this.$q.notify({
          message: 'Rascunho salvo com sucesso',
        })
      })
    },
    saveDraft () {
      for (let i = 0; i < this.membersMovement.instrucaoDeConfirmados.confirmados.length; i++) {
        if (this.membersMovement.instrucaoDeConfirmados.confirmados[i].Quant === '') {
            return this.$q.notify('Preencha todos os campos obrigatórios!')
        }
      }
      const opt = {
        route: '/desktop/statistics/saveDraftMembersMovement',
        body: {
          organismId: this.$route.query.organismId,
          membersMovement: this.membersMovement
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) return
        this.$q.notify({
          message: 'Rascunho salvo com sucesso!',
        })
        this.$router.back()
        this.getMovimentoMembrosPorCongregacao()
      })
    },
    saveOficial(){
      for (let i = 0; i < this.membersMovement.instrucaoDeConfirmados.confirmados.length; i++) {
        if (this.membersMovement.instrucaoDeConfirmados.confirmados[i].Quant === '') {
            return this.$q.notify('Preencha todos os campos obrigatórios!')
        }
      }
      const opt = {
        route: '/desktop/statistics/saveDraftMembersMovement',
        body: {
          organismId: this.$route.query.organismId,
          membersMovement: this.membersMovement
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) return
        this.$q.notify({
          message: 'Movimento de Membros salvo com sucesso!',
        })
        this.$router.back()
        this.getMovimentoMembrosPorCongregacao()
      })
    },
    getMovimentoMembrosPorCongregacao () {
      const opt = {
        route: '/desktop/statistics/getMovimentoMembrosPorCongregacao',
        body: {
          organismId: this.$route.query.organismId
        }
      }
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error || !r.data) return
        const keys = Object.keys(r.data.membersMovement)
        keys.forEach((key) => {
          this.membersMovement[key] = r.data.membersMovement[key]
        })
        this.validated = r.data.validated
        this.calculateTotal()
      })
    },
    calculateTotal() {
      this.totalComungantes = +this.membersMovement.totalMambrosComungantes2022 + this.getAcrescimosComungantes() - this.getDecrescimoComungantes()
      this.totalNaoComungantes = +this.membersMovement.totalMembrosNaoComungantes2022 + this.getAcrescimosNaoComungantes() - this.getDecrescimoNaoComungantes()
      this.total = this.totalComungantes + this.totalNaoComungantes
    },
    getAcrescimosComungantes () {
      return +this.membersMovement.transferenciasRecebidasComungantes
        + +this.membersMovement.profissaoFeBatismoAdultos
        + +this.membersMovement.profissaoFe
    },
    getAcrescimosNaoComungantes () {
      return +this.membersMovement.criancasBatizadasFamiliasIelb
        + +this.membersMovement.transferenciasRecebidasNaoComungantes
        + +this.membersMovement.criancasBatizadasFamiliasEntraramPorProfissaoFe
        + +this.membersMovement.reconhecimentoDeBatismos
    },
    getDecrescimoComungantes () {
      return +this.membersMovement.obitoComungantes
        + +this.membersMovement.transferenciasComungantes
        + +this.membersMovement.abandonoComungantes
        + +this.membersMovement.exclusoesComungantes
    },
    getDecrescimoNaoComungantes () {
      return +this.membersMovement.obitoNaoComungantes
        + +this.membersMovement.transferenciasNaoComungantes
        + +this.membersMovement.abandonoNaoComungantes
        + +this.membersMovement.exclusoesNaoComungantes
    },
    getOrganismNameForBreadCrumbs() {
    const opt = {
      route: "/desktop/statistics/getCongregacaoByOrganismId",
      body: {
        // organismId: "6530487ab2980d56e0985464",
        organismId: this.$route.query.organismId
      },
    };
    useFetch(opt).then((r) => {
      if (r.error) return;
      this.congregationName = r.data.organismName 
    });
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