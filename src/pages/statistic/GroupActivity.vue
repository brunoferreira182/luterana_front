<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el
            style="cursor: pointer"
            icon="home"
            label="Introdução"
            @click="goToIntro"
          />
          <q-breadcrumbs-el
            :label="congregationName"
            style="cursor: pointer"
            @click="backToChoose "
          >
          </q-breadcrumbs-el>
          <q-breadcrumbs-el label="Atividades de Grupos" />
        </q-breadcrumbs>
      </div>
      <q-list v-if="departamentos && departamentos.length > 0">
        <q-item v-for="(item, i) in departamentos" :key="item">
          <div
            style="
              border-radius: 1rem;
              background-color: rgb(245, 245, 245);
              width: 94%;
            "
          >
            <q-item-section class="q-pa-md">
              <q-item-label
                @click="expand(item)"
                class="text-h6 label-container"
              >
                {{ item.organismConfigName }}
                <q-btn
                  round
                  flat
                  :icon="
                    item.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                />
              </q-item-label>
              <q-item-label class="label-container" v-if="item.organismConfigName !== item.organismName">
                <div class="q-py-xs">
                  <q-chip>{{ item.organismName }}</q-chip>
                </div>
              </q-item-label>
              <q-slide-transition>
                <div v-show="item.expanded">
                  <q-item-section
                  v-if="!item.action"
                  >
                    <div class="row q-gutter-sm">
                      <q-input
                        type="number"
                        label="Frequência total"
                        v-model="departamentos[i].departamentoData.freqTotal"
                      >
                      </q-input>
                      <q-input
                        type="number"
                        label="Número de encontros"
                        v-model="departamentos[i].departamentoData.qtnEncontros"
                      >
                      </q-input>
                    </div>
                  </q-item-section>

                  <q-item-label
                    v-if="
                      item.organismConfigName === 'Juventude Mirim (JELB)' ||
                      item.organismConfigName ===
                        'Departamento de Jovens (JELB)'
                    "
                    class="q-py-xs"
                  >
                    Há padrinhos:
                    <q-radio v-model="departamentos[i].departamentoData.padrinhos.exist" val="exist" label="Sim" />
                    <q-radio v-model="departamentos[i].departamentoData.padrinhos.exist" val="noExist" label="Não" />
                    <q-input
                      v-model="departamentos[i].departamentoData.padrinhos.qtn"
                      v-if="departamentos[i].departamentoData.padrinhos.exist === 'exist'"
                      dense
                      class="q-mx-sm"
                      type="number"
                      label="Quantidade Padrinhos"
                    ></q-input>
                  </q-item-label>
                  <!--  Sobre escolas dominicais ---->
                  <q-input
                    v-model="departamentos[i].departamentoData.professores"
                    type="number"
                    v-if="
                      item.organismConfigName ===
                      'Departamento de Escola dominical de leigos'
                    "
                    label="Quantidade de professores"
                  >
                  </q-input>
                  <q-item-section
                    v-if="
                      item.organismConfigName ===
                      'Departamento de Escola dominical de leigos'
                    "
                  >
                    <q-item-label class="q-pt-lg q-pl-xs">
                      Aulas durante o culto</q-item-label
                    >
                    <q-input
                      v-model="departamentos[i].departamentoData.cultoData.freqCulto"
                      class="q-ml-md"
                      type="number"
                      label="Frequência total durante culto"
                    ></q-input>
                    <q-input
                      v-model="departamentos[i].departamentoData.cultoData.qtnFaixaEtaria"
                      class="q-ml-md"
                      type="number"
                      label="Divisão de faixa etária"
                    ></q-input>
                  </q-item-section>
                  <q-space></q-space>
                  <q-item-section
                    v-if="
                      item.organismConfigName ===
                      'Departamento de Escola dominical de leigos'
                    "
                  >
                    <q-item-label class="q-pt-lg q-pl-xs">
                      Aulas no momento</q-item-label
                    >
                    <q-input
                      type="number"
                      v-model="departamentos[i].departamentoData.aulasMomento.freqMomento"
                      class="q-ml-md"
                      label="Frequência total no momento"
                    ></q-input>
                    <q-input
                      type="number"
                      v-model="
                        departamentos[i].departamentoData.aulasMomento.qtnFaixaEtaria
                      "
                      class="q-ml-md"
                      label="Divisão de faixa etária"
                    ></q-input>
                  </q-item-section>
                  <!-- acabou sobre escolas dominicais -->
                  <!-- Musica -->
                  <q-item-section
                    class="justify-around"
                    v-if="item.organismConfigName === 'Música'"
                  >
                    <q-item-label>
                      <div class="col items-center" v-if="item.departamentoData && item.departamentoData.musicGroup && item.departamentoData.musicGroup.exist">
                        Grupo Músical / Banda / Grupo de Louvor / Quarteto / Vocal:
                        <q-radio
                          v-model="item.departamentoData.musicGroup.exist"
                          val="exist"
                          label="Sim"
                        />
                        <q-radio
                          v-model="item.departamentoData.musicGroup.exist"
                          val="noExist"
                          label="Não"
                        />
                        <q-input
                          type="number" 
                          v-if="departamentos[i].departamentoData.musicGroup.exist === 'exist'"
                          v-model="departamentos[i].departamentoData.musicGroup.qtn"
                          class="q-pl-sm col q-mr-md"
                          label="Quantidade de integrantes"
                        />
                      </div>
                    </q-item-label>
                    <q-item-section>
                      <q-item-label v-if="departamentos[i].departamentoData && departamentos[i].departamentoData.coro && departamentos[i].departamentoData.coro.exist">
                        <div class="col items-center"> Coro:
                        <q-radio
                            v-model="departamentos[i].departamentoData.coro.exist"
                            val="exist"
                            label="Sim"
                          />
                          <q-radio
                            v-model="departamentos[i].departamentoData.coro.exist"
                            val="noExist"
                            label="Não"
                          />
                          <q-input
                            type="number"
                            class="q-pl-sm col q-mr-md"
                            v-if="departamentos[i].departamentoData.coro.exist === 'exist'"
                            v-model="departamentos[i].departamentoData.coro.qtn"
                            label="Total no Coro"
                          ></q-input>
                          </div>
                      </q-item-label>
                    </q-item-section>
                    <q-input
                      type="number"
                      class="q-mr-md"
                      v-model="departamentos[i].departamentoData.musicosTotal"
                      label="Músicos envolvidos na congregação "
                    ></q-input>

                    <q-item-section v-if="item.departamentoData && item.departamentoData.formalGroup && item.departamentoData.formalGroup.freqTotal">
                      <div class="row">
                        <q-input
                        type="number"
                        class="q-mr-md col"
                        v-model="departamentos[i].departamentoData.formalGroup.freqTotal"
                        label="Frequência Total"
                        />
                        <q-input
                        type="number"
                        class="q-mr-md col"
                        v-model="departamentos[i].departamentoData.formalGroup.qtnEncontros"
                        label="Número de encontros"
                        />
                      </div>
                    </q-item-section>
                  </q-item-section>
                  <!-- visitação -->
                  <q-item-section
                    v-if="
                      item.organismConfigName === 'Visitação'
                    "
                  >
                    <q-input
                      type="number"
                      v-model="departamentos[i].departamentoData.visitadoresTotal"
                      class="q-pl-sm q-mr-md"
                      label="Total de visitantes do grupo"
                    />
                    <q-item-label class="q-mt-sm" /> Visitas Missionárias
                    <div class="row">
                      <q-input
                        type="number"
                        v-model="
                          departamentos[i].departamentoData.visitasMissionarias.qtnVisitas
                        "
                        class="q-pl-sm q-mr-md col"
                        label="Número de visitas"
                      />
                      <q-input
                        type="number"
                        v-model="
                          departamentos[i].departamentoData.visitasMissionarias.pessoas
                        "
                        class="q-pl-sm q-mr-md col"
                        label="Total de pessoas"
                      />
                    </div>
                    <q-item-label class="q-mt-sm" /> Visitas à Membros
                    <div class="row">
                      <q-input
                        type="number"
                        v-model="departamentos[i].departamentoData.visitasMembros.qtnVisitas"
                        class="q-pl-sm q-mr-md col"
                        label="Número de visitas"
                      />
                      <q-input
                        type="number"
                        v-model="departamentos[i].departamentoData.visitasMembros.pessoas"
                        class="q-pl-sm q-mr-md col"
                        label="Total de pessoas"
                      />
                    </div>
                    <q-item-label class="q-mt-sm" /> Enfermos
                    <div class="row">
                      <q-input
                        v-model="departamentos[i].departamentoData.visitasEnfermos.qtnVisitas"
                        class="q-pl-sm q-mr-md col"
                        type="number"
                        label="Número de visitas"
                      />
                      <q-input
                        v-model="departamentos[i].departamentoData.visitasEnfermos.enfermos"
                        class="q-pl-sm q-mr-md col"
                        type="number"
                        label="Total de enfermos"
                      />
                    </div>
                  </q-item-section>
                  <!-- Sobre ação social   -->
                  <q-item-section
                    v-if="
                      item.organismConfigName === 'Ação social'
                    "
                  >
                  <div class="row">
                  <q-input
                    v-model="departamentos[i].departamentoData.pessoasEnvol"
                    class="q-pl-sm col q-mr-md"
                    type="number"
                    label="Total de pessoas"
                    />
                  <q-input
                    v-model="departamentos[i].departamentoData.pessoasBeneft"
                    class="q-pl-sm col q-mr-md"
                    type="number"
                    label="Total Beneficiados"
                    />
                  </div>
                  <q-input
                    v-model="departamentos[i].departamentoData.acoesEventuais"
                    class="q-pl-sm col q-mr-md"
                    label="Ações eventuais"
                  />
                  <!-- </div>
                  <div class="row"> -->
                  <q-input
                    v-model="departamentos[i].departamentoData.permProgs"
                    class="q-pl-sm col q-mr-md"
                    label="Programas permanentes"
                    />
                  </q-item-section>
                  <!-- Sobre outros   -->
                  <q-item-section v-if="item.organismConfigName === 'Outros'">
                    <q-input
                      v-model="departamentos[i].departamentoData.finalidade"
                      class="q-pl-sm q-mr-md"
                      label="Finalidade do grupo *"
                    ></q-input>
                    <q-input
                      v-model="departamentos[i].departamentoData.organizacao"
                      class="q-pl-sm q-mr-md"
                      label="Organização do grupo *"
                    ></q-input>
                    <div class="row">
                      <q-input
                      type="number"
                      v-model="departamentos[i].departamentoData.freqTotal"
                      class="q-pl-sm col q-mr-md"
                      label="Número de encontros"
                      />
                      <q-input
                      type="number"
                      v-model="departamentos[i].departamentoData.qtnEncontros"
                      class="q-pl-sm col q-mr-md"
                      label="Frequência total "
                      />
                    </div>
                  </q-item-section>
                  <!-- ainda sobre outros -->
                </div>
              </q-slide-transition>
            </q-item-section>
          </div>
        </q-item>
      </q-list>
      <div class="q-ma-lg q-pb-sm text-center" >
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
        <div v-if="(status && status.value !== 'sent') || !status">
          <q-btn
            label="Salvar rascunho"
            color="primary"
            class="full-width q-my-sm"
            rounded
            unelevated
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
        </div>
        <div v-else class="text-h6 q-ma-sm">
          Etapa finalizada
        </div>
        <div class="row q-gutter-sm q-pt-xs">
          <q-btn
            label="Etapa anterior"
            color="primary"
            rounded
            unelevated
            icon="navigate_before"
            class="col items-start"
            no-caps
            @click="$router.push('/statistic/culturalActivities?organismId=' + $route.query.organismId)"
          />
          <q-btn
            label="Próxima etapa"
            color="primary"
            rounded
            unelevated
            icon-right="navigate_next"
            class="col items-end"
            no-caps
            @click="$router.push('/statistic/membersMovement?organismId=' + $route.query.organismId)"
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
  name: "GroupActivity",
  data() {
    return {
      departamentos: [],
      timerToSave: null,
      congregationName: "",
      validated: false,
      statisticStatus: null,
      arrayIgnore: [
      'Música', 
      'Visitação', 
      'Ação social', 
      'Outros'
      ],
      status: null
    };
  },
  async beforeUnmount() {
    this.stopTimerToSaveDraft();
    const r = await this.getGroupActivitiesByOrganismId();
    if ((r.data && r.data.status && r.data.status.value === 'notSent') || (r.data && !r.data.status)) this.saveDraft()
  },
  async beforeMount() {
    this.startTimerToSaveDraft()
    const r = await this.getGroupActivitiesByOrganismId();
    this.putGroupActivitiesOnData(r)
  },
  methods: {
    backToChoose() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/completeStatistic?organismId=' + this.$route.query.organismId + '&parishId=' + this.$route.query.parishId)
      } else this.$router.push('/statistic/completeStatistic?organismId=' + this.$route.query.organismId)
    },
    goToIntro() {
      if (this.$route.query.parishId) {
        this.$router.push('/statistic/IntroWriteStatisticData?parishId=' + this.$route.query.parishId)
      } else {
        this.$router.push('/statistic/IntroWriteStatisticData')
      }
    },
    startTimerToSaveDraft() {
      this.timerToSave = true;
      this.methodToSaveTimerDraft();
    },
    stopTimerToSaveDraft() {
      this.timerToSave = false;
      clearTimeout(this.timerId);
    },
    methodToSaveTimerDraft(){
      if (this.timerToSave){
        this.timerId = setTimeout(() => {
        this.saveDraft()
        this.methodToSaveTimerDraft()
      }, 300000);
    }
  },
    async getGroupActivitiesByOrganismId() {
      const opt = {
        route: "/desktop/statistics/getCongregacaoByOrganismId",
        body: {
          organismId: this.$route.query.organismId,
        },
      };
      this.$q.loading.show()
      const r = await useFetch(opt)
      this.$q.loading.hide()
      return r
    },
    putGroupActivitiesOnData (r) {
      if (r.error) return;
      this.validated = r.data.validated
      this.congregationName = r.data.organismName;
      this.departamentos = r.data.childData;
      this.departamentos = this.departamentos.filter( item => (item.organismConfigName !== 'Ponto de Missão'))
      if (r.data.status) {
        this.status = r.data.status
      }
    },
    expand(item) {
      item.expanded = !item.expanded;
      // this.$q.notify("Salvo com sucesso!");
    },
    async saveDraft() { 
      for (let i = 0; i < this.departamentos.length; i++) {
        if(this.departamentos[i].departamentoData.finalidade === '' || this.departamentos[i].departamentoData.organizacao === ''){
          return this.$q.notify('Preencha todos os campos Obrigatórios!')
        }
      }
      this.departamentos.forEach((departamento) => {
        departamento.expanded = false 
      })
      const opt = {
        route: "/desktop/statistics/insertGroupsActivitiesStatisticsDraft",
        body: {
          organismId: this.$route.query.organismId,
          groupActivity: this.departamentos,
          organismFatherName: this.congregationName
        },
      };
      this.$q.loading.show()
      const r = useFetch(opt)
      this.$q.loading.hide()
      if (r.error) return;
      this.$q.notify("Rascunho salvo com sucesso!");
      this.$router.push('/statistic/membersMovement?organismId=' + this.$route.query.organismId)
      return
    },
    async saveOficial(){
      for(let i = 0; i < this.departamentos.length; i++){
        if(this.departamentos[i].departamentoData.finalidade === '' || this.departamentos[i].departamentoData.organizacao === '') {
          return this.$q.notify('Preencha todos os campos Obrigatórios!')
        }
      }
      this.departamentos.forEach((departamento) => {
        departamento.expanded = false 
      })

      let opt = {
        route: "/desktop/statistics/insertGroupsActivitiesStatisticsDraft",
        body: {
          organismId: this.$route.query.organismId,
          groupActivity: this.departamentos,
          organismFatherName: this.congregationName
        },
      }
      let r = await useFetch(opt)

      if (r.error) return

      opt = {
        route: "/desktop/statistics/insertGroupsActivitiesStatisticsDone",
        body: {
          organismId: this.$route.query.organismId,
          groupActivity: this.departamentos,
          organismFatherName: this.congregationName
        },
      };
      this.$q.loading.show()
      r = await useFetch(opt)
      this.$q.loading.hide()
      if (r.error) {
        this.$q.notify('Estatística incompleta')
        return
      }
      this.$q.notify("Etapa finalizada com sucesso!");
      this.$router.push('/statistic/membersMovement?organismId=' + this.$route.query.organismId)
    },
  },
});
</script>
<style>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form-section {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1;
}
.label-container {
  display: flex;
  justify-content: space-between;
  white-space: pre-line
}
</style>
