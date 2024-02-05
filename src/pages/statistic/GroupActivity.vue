<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el
            style="cursor: pointer"
            icon="home"
            label="Completar estatística"
            @click="
              $router.push('/statistic/selectOrganismToWriteStatisticData')
            "
          />
          <q-breadcrumbs-el
            :label="congregationName"
            style="cursor: pointer"
            @click="
              $router.push(
                '/statistic/completeStatistic?organismId=' +
                  $route.query.organismId
              )
            "
          >
          </q-breadcrumbs-el>
          <q-breadcrumbs-el label="Atividades de Grupos" />
        </q-breadcrumbs>
      </div>
      <q-list>
        <q-item v-for="(item, i) in departamentos" :key="item">
          <div
            style="
              border-radius: 1rem;
              background-color: rgb(245, 245, 245);
              width: 94%;
            "
          >
            <q-item-section class="item-section q-pa-md">
              <q-item-label
                @click="expand(item)"
                class="text-h6"
                style="white-space: nowrap"
              >
                {{ item.organismName }}
                <q-btn
                  round
                  flat
                  :icon="
                    item.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                />
              </q-item-label>
              <q-slide-transition>
                <div v-show="item.expanded">
                  <q-item-section
                    v-if="!arrayIgnore.includes(item.organismConfigName)"
                  >
                    <div class="row q-gutter-sm">
                      <q-input
                        label="Frequência total"
                        v-model="departamentos[i].departamentoData.freqTotal"
                      >
                      </q-input>
                      <q-input
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
                      label="Quantidade Padrinhos"
                    ></q-input>
                  </q-item-label>
                  <!--  Sobre escolas dominicais ---->
                  <q-input
                    v-model="departamentos[i].departamentoData.professores"
                    v-if="
                      item.organismConfigName ===
                      'Escola Dominical de leigos'
                    "
                    label="Quantidade de professores"
                  >
                  </q-input>
                  <q-item-section
                    v-if="
                      item.organismConfigName ===
                      'Escola Dominical de leigos'
                    "
                  >
                    <q-item-label class="q-pt-lg q-pl-xs">
                      Aulas durante o culto</q-item-label
                    >
                    <q-input
                      v-model="departamentos[i].departamentoData.aulasCulto.freqCulto"
                      class="q-ml-md"
                      label="Frequência total durante culto"
                    ></q-input>
                    <q-input
                      v-model="departamentos[i].departamentoData.aulasCulto.qtnFaixaEtaria"
                      class="q-ml-md"
                      label="Divisão de faixa etária"
                    ></q-input>
                  </q-item-section>
                  <q-space></q-space>
                  <q-item-section
                    v-if="
                      item.organismConfigName ===
                      'Escola Dominical de leigos'
                    "
                  >
                    <q-item-label class="q-pt-lg q-pl-xs">
                      Aulas no momento</q-item-label
                    >
                    <q-input
                      v-model="departamentos[i].departamentoData.aulasMomento.freqMomento"
                      class="q-ml-md"
                      label="Frequência total no momento"
                    ></q-input>
                    <q-input
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
                    v-if="item.organismConfigName === 'Música de leigos'"
                  >
                    <q-item-label>
                      <div class="col items-center">
                        Grupo Músical / Banda / Grupo de Louvor / Quarteto / Vocal
                        <q-radio
                          v-model="departamentos[i].departamentoData.musicGroup.exist"
                          val="exist"
                          label="Sim"
                        />
                        <q-radio
                          v-model="departamentos[i].departamentoData.musicGroup.exist"
                          val="noExist"
                          label="Não"
                        />
                        <q-input
                          v-if="departamentos[i].departamentoData.musicGroup.exist === 'exist'"
                          v-model="departamentos[i].departamentoData.musicGroup.qtn"
                          class="q-pl-sm col q-mr-md"
                          label="Quantidade de integrantes"
                        />
                      </div>
                    </q-item-label>
                    <q-item-section>
                      <q-input
                        class="q-mr-md"
                        v-model="departamentos[i].departamentoData.coro"
                        label="Total no Coro"
                      ></q-input>
                    </q-item-section>
                    <q-input
                      class="q-mr-md"
                      v-model="departamentos[i].departamentoData.musicosTotal"
                      label="Músicos envolvidos ao total"
                    ></q-input>

                    <q-item-section>
                      <div class="row">
                        <q-input
                        class="q-mr-md col"
                        v-model="departamentos[i].departamentoData.formalGroup.freqTotal"
                        label="Frequência Total"
                        />
                        <q-input
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
                      item.organismConfigName === 'Visitação de leigos'
                    "
                  >
                    <q-input
                      v-model="departamentos[i].departamentoData.visitadoresTotal"
                      class="q-pl-sm q-mr-md"
                      label="Total de visitantes do grupo"
                    />
                    <q-item-label class="q-mt-sm" /> Visitas Missionárias
                    <div class="row">
                      <q-input
                        v-model="
                          departamentos[i].departamentoData.visitasMissionarias.qtnVisitas
                        "
                        class="q-pl-sm q-mr-md col"
                        label="Número de visitas"
                      />
                      <q-input
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
                        v-model="departamentos[i].departamentoData.visitasMembros.qtnVisitas"
                        class="q-pl-sm q-mr-md col"
                        label="Número de visitas"
                      />
                      <q-input
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
                        label="Número de visitas"
                      />
                      <q-input
                        v-model="departamentos[i].departamentoData.visitasEnfermos.enfermos"
                        class="q-pl-sm q-mr-md col"
                        label="Total de enfermos"
                      />
                    </div>
                  </q-item-section>
                  <!-- Sobre ação social   -->
                  <q-item-section
                    v-if="
                      item.organismConfigName === 'Ação social de leigos'
                    "
                  >
                  <div class="row">
                  <q-input
                    v-model="departamentos[i].departamentoData.pessoasEnvol"
                    class="q-pl-sm col q-mr-md"
                    label="Total de pessoas"
                    />
                  <q-input
                    v-model="departamentos[i].departamentoData.pessoasBeneft"
                    class="q-pl-sm col q-mr-md"
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
                      label="Finalidade do grupo"
                    ></q-input>
                    <q-input
                      v-model="departamentos[i].departamentoData.organizacao"
                      class="q-pl-sm q-mr-md"
                      label="Organização do grupo"
                    ></q-input>
                    <div class="row">
                      <q-input
                      v-model="departamentos[i].departamentoData.freqTotal"
                      class="q-pl-sm col q-mr-md"
                      label="Número de encontros"
                      />
                      <q-input
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
      <div class="q-ma-sm q-mt-lg text-center" >
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
        /><br>

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
  name: "GroupActivity",
  data() {
    return {
      departamentos: [],
      congregationName: "",
      validated: false,
      statisticStatus: null,
      arrayIgnore: [
        "Escola Dominical de leigos",
        "Música de leigos",
        "Visitação de leigos",
        "Ação social de leigos",
        "Outros",
      ],
    };
  },
  beforeUnmount(){
    this.saveDraft()
  },
  beforeMount() {
    this.getGroupActivitiesByOrganismId();
  },
  methods: {
    getGroupActivitiesByOrganismId() {
      const opt = {
        route: "/desktop/statistics/getCongregacaoByOrganismId",
        body: {
          organismId: this.$route.query.organismId,
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        if (r.error) return;
        this.departamentos = r.data.childData;
        this.congregationName = r.data.organismName;
        this.validated = r.data.validated
      });
    },
    expand(item) {
      item.expanded = !item.expanded;
      // this.$q.notify("Salvo com sucesso!");
    },
    saveDraft(){
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
      useFetch(opt).then((r) => {
        this.$q.loading.show()
        if (r.error) return;
        this.$q.notify("Rascunho salvo com sucesso!");
        this.getGroupActivitiesByOrganismId()
      });
    },
    goToStatistics() {
      const organismId = this.$route.query.organismId;
      this.$router.push("/user/statistic?organismId=" + organismId);
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
.item-section {
  position: relative;
}
.form-section {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
