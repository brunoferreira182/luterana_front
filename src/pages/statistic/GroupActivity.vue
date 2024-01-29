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
                @click="expandItem(item)"
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
                      v-if="padrinhos === 'exist'"
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
                      'Departamento de Escola Dominical'
                    "
                    label="Quantidade de professores"
                  >
                  </q-input>
                  <q-item-section
                    v-if="
                      item.organismConfigName ===
                      'Departamento de Escola Dominical'
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
                      'Departamento de Escola Dominical'
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
                    v-if="item.organismConfigName === 'Departamento da Música'"
                  >
                    <q-item-label>
                      Grupo Músical
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
                        dense
                        v-if="
                          item.departamentoData.musicGroup.exist === 'banda'
                        "
                        v-model="departamentos[i].departamentoData.musicGroup.qtn"
                        class="q-mx-xs q-mr-md"
                        label="Quantidade"
                      ></q-input>
                    </q-item-label>
                    <q-item-label>
                      Banda
                      <q-radio
                        v-model="departamentos[i].departamentoData.banda.exist"
                        val="exist"
                        label="Sim"
                      />
                      <q-radio
                        v-model="departamentos[i].departamentoData.banda.exist"
                        val="noExist"
                        label="Não"
                      />
                      <q-input
                        dense
                        v-if="item.departamentoData.banda.exist === 'exist'"
                        v-model="departamentos[i].departamentoData.banda.qtn"
                        class="q-mx-xs q-mr-md"
                        label="Quantidade"
                      ></q-input>
                    </q-item-label>
                    <q-item-label>
                      Grupo de Louvor
                      <q-radio
                        v-model="departamentos[i].departamentoData.grupoLouvor.exist"
                        val="exist"
                        label="Sim"
                      />
                      <q-radio
                        v-model="departamentos[i].departamentoData.grupoLouvor.exist"
                        val="noExist"
                        label="Não"
                      />
                      <q-input
                        dense
                        v-if="
                          item.departamentoData.grupoLouvor.exist === 'exist'
                        "
                        v-model="departamentos[i].departamentoData.grupoLouvor.qtn"
                        class="q-mx-xs q-mr-md"
                        label="Quantidade"
                      ></q-input>
                    </q-item-label>
                    <q-item-label>
                      Quarteto
                      <q-radio
                        v-model="departamentos[i].departamentoData.quarteto.exist"
                        val="exist"
                        label="Sim"
                      />
                      <q-radio
                        v-model="departamentos[i].departamentoData.quarteto.exist"
                        val="noExist"
                        label="Não"
                      />
                      <q-input
                        dense
                        v-if="item.departamentoData.quarteto.exist === 'exist'"
                        v-model="departamentos[i].departamentoData.quarteto.qtn"
                        class="q-mx-xs q-mr-md"
                        label="Quantidade"
                      ></q-input>
                    </q-item-label>
                    <q-item-label>
                      Vocal
                      <q-radio
                        v-model="departamentos[i].departamentoData.vocal.exist"
                        val="exist"
                        label="Sim"
                      />
                      <q-radio
                        v-model="departamentos[i].departamentoData.vocal.exist"
                        val="noExist"
                        label="Não"
                      />
                      <q-input
                        dense
                        v-if="item.departamentoData.vocal.exist === 'exist'"
                        v-model="departamentos[i].departamentoData.vocal.qtn"
                        class="q-mx-xs q-mr-md"
                        label="Quantidade"
                      ></q-input>
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
                      <q-input
                        class="q-mr-md"
                        v-model="departamentos[i].departamentoData.formalGroup.freqTotal"
                        label="Frequência Total"
                      ></q-input>
                      <q-input
                        class="q-mr-md"
                        v-model="departamentos[i].departamentoData.formalGroup.qtnEncontros"
                        label="Número de encontros"
                      ></q-input>
                    </q-item-section>
                  </q-item-section>
                  <!-- visitação -->
                  <q-item-section
                    v-if="
                      item.organismConfigName === 'Departamento de Visitação'
                    "
                  >
                    <q-input
                      v-model="departamentos[i].departamentoData.visitadoresTotal"
                      class="q-pl-sm q-mr-md"
                      label="Total de visitantes do grupo"
                    />
                    <q-item-label class="q-mt-sm" /> Visitas Missionárias
                    <q-input
                      v-model="
                        departamentos[i].departamentoData.visitasMissionarias.qtnVisitas
                      "
                      class="q-pl-sm q-mr-md"
                      label="Número de visitas"
                    />
                    <q-input
                      v-model="
                        departamentos[i].departamentoData.visitasMissionarias.pessoas
                      "
                      class="q-pl-sm q-mr-md"
                      label="Total de pessoas"
                    />
                    <q-item-label class="q-mt-sm" /> Visitas à Membros
                    <q-input
                      v-model="departamentos[i].departamentoData.visitasMembros.qtnVisitas"
                      class="q-pl-sm q-mr-md"
                      label="Número de visitas"
                    />
                    <q-input
                      v-model="departamentos[i].departamentoData.visitasMembros.pessoas"
                      class="q-pl-sm q-mr-md"
                      label="Total de pessoas"
                    />
                    <q-item-label class="q-mt-sm" /> Enfermos
                    <q-input
                      v-model="departamentos[i].departamentoData.visitasEnfermos.qtnVisitas"
                      class="q-pl-sm q-mr-md"
                      label="Número de visitas"
                    />
                    <q-input
                      v-model="departamentos[i].departamentoData.visitasEnfermos.enfermos"
                      class="q-pl-sm q-mr-md"
                      label="Total de enfermos"
                    />
                  </q-item-section>
                  <!-- Sobre ação social   -->
                  <q-item-section
                    v-if="
                      item.organismConfigName === 'Departamento de Ação social'
                    "
                  >
                    <q-input
                      v-model="departamentos[i].departamentoData.pessoasEnvol"
                      class="q-pl-sm q-mr-md"
                      label="Total de pessoas envolvidas"
                    />
                    <q-input
                      v-model="departamentos[i].departamentoData.pessoasBeneft"
                      class="q-pl-sm q-mr-md"
                      label="Total de pessoas Beneficiadas"
                    />
                    <q-input
                      v-model="departamentos[i].departamentoData.permProgs"
                      class="q-pl-sm q-mr-md"
                      label="Descrição dos programas permanentes"
                    />
                    <q-input
                      v-model="departamentos[i].departamentoData.acoesEventuais"
                      class="q-pl-sm q-mr-md"
                      label="Ações eventuais"
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
                    <q-input
                      v-model="departamentos[i].departamentoData.freqTotal"
                      class="q-pl-sm q-mr-md"
                      label="Número de encontros"
                    ></q-input>
                    <q-input
                      v-model="departamentos[i].departamentoData.qtnEncontros"
                      class="q-pl-sm q-mr-md"
                      label="Frequência total "
                    ></q-input>
                  </q-item-section>
                  <!-- ainda sobre outros -->
                </div>
              </q-slide-transition>
            </q-item-section>
          </div>
        </q-item>
      </q-list>
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
      rascunhos: [],
      formDepart: [],
      congregationName: "",
      statisticStatus: null,
      arrayIgnore: [
        "Departamento de Escola Dominical",
        "Departamento da Música",
        "Departamento de Visitação",
        "Departamento de Ação social",
        "Outros",
      ],
    };
  },
  beforeUnmount() {
    this.submitAllItens();
<<<<<<< HEAD
    // const timer = setTimeout(() => {
    //   console.log("Timer executado ao desmontar a página!");
    //   clearTimeout(timer);
    // }, 5000);
=======
    const timer = setTimeout(() => {
      clearTimeout(timer);
    }, 5000);
>>>>>>> 08fbab37bf29ce04c8c8be1a525db27773eaac5c
  },
  beforeMount() {
    this.getCongregationGroups();
  },
  // watch:{
  //   handler(newDepartamentos, oldDepartamentos) {
  //     newDepartamentos.forEach((departamento,index) => {
  //       if (departamento.expanded === false && oldDepartamentos[index].expanded===true){
  //         this.submitForm(departamento)
  //       }
  //     })
  //   }
  // },
  methods: {
    getCongregationGroups() {
      const opt = {
        route: "/desktop/statistics/getCongregacaoByOrganismId",
        body: {
          organismId: this.$route.query.organismId,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) return;
        this.departamentos = r.data.childData;
        console.log(this.departamentos,"cuzinho doce");
        this.congregationName = r.data.organismName;
      });
      this.getSketchGroup();
    },
    getSketchGroup() {
      const opt = {
        route: "/desktop/statistics/getSketchByGroupActivity",
        body: {
          organismId: this.$route.query.organismId
        }
      };
      useFetch(opt).then((r) => {
        console.log("Rascunho pego do estatisca:", r.data);
        if (r.error) return;
        this.rascunhos = r.data[0]
        console.log(this.rascunhos, 'dlkmaskd')
        
        this.departamentos.forEach((item) =>{
          const rask = this.rascunhos.departamentoData.find((rascunho) => 
            rascunho.organismConfigName === item.organismConfigName
          )
          if (rask){
            item.departamentoData = rask
            console.log('atualizado', item);
          }
        })
      });
    },
    expandItem(item) {
      item.expanded = !item.expanded;
        if(!item.expanded) this.submitForm(item);
    },
    submitForm(item) {
      // item.expanded =!item.expanded
      this.formDepart.push(
        item.departamentoData
      )
      // this.$q.notify("Salvo com sucesso!");
    },
    submitAllItens(){
      this.departamentos.forEach((departamento) => {
        departamento.expanded === false 
      })
      const opt = {
        route: "/desktop/statistics/insertGroupsActivitiesStatisticsDraft",
        body: {
          organismId: this.$route.query.organismId,
          departamentoData: this.formDepart,
        },
      };
      useFetch(opt).then((r) => {
        if (r.error) return;
        this.$q.notify("Salvo com sucesso!");
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
