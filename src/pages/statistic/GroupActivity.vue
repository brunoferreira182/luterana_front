<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Completar estatística" 
            @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
          />
          <q-breadcrumbs-el 
            :label="organismName"
            style="cursor: pointer;" 
          > 
          </q-breadcrumbs-el> 
          <q-breadcrumbs-el label="Atividades de Grupos" />
        </q-breadcrumbs>
      </div>
      <q-list >
        <q-item v-for="(item) in departamentos" :key="item" >
          <div style="border-radius: 1rem; background-color: rgb(245, 245, 245); width: 94%; " >
          <q-item-section class="item-section q-pa-md" @click="toggleForm(item)">
            <q-item-label class="text-h5" style="white-space: nowrap;">
              {{ item.organismName }}
              <q-btn
                round
                flat
                :icon="
                  item.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                "
                @click="item.expanded = !item.expanded"
              />
            </q-item-label>

            <q-slide-transition >
              <div v-show="item.expanded">
                <q-item-section v-if="!arrayIgnore.includes(item.organismConfigName) ">
                  <q-input label="Frequência total" v-model="item.departamentoData.freqTotal"> </q-input>
                  <q-input label="Número de encontros" v-model="item.departamentoData.qtnEncontros" > </q-input>
                </q-item-section>

                <q-item-label
                  v-if="
                    item.organismConfigName === 'Juventude Mirim (JELB)' ||
                    item.organismConfigName === 'Departamento de Jovens (JELB)'
                  "
                  class="q-py-xs"
                > Há padrinhos:
                  <q-radio v-model="padrinhos" val="exist" label ="Sim"
                  />
                  <q-radio v-model="padrinhos" val="noExist" label ="Não"
                  />
                  <q-input v-model="item.departamentoData.padrinhos" v-if="padrinhos==='exist'" dense class="q-mx-sm" label="Quantidade Padrinhos"></q-input>
                </q-item-label> 
                <!--  Sobre escolas dominicais ---->
                <q-input
                  v-model="item.departamentoData.professores"
                  v-if="item.organismConfigName === 'Departamento de Escola Dominical'"
                  label="Quantidade de professores"
                >
                </q-input>
                <q-item-section
                  v-if="item.organismConfigName === 'Departamento de Escola Dominical'"
                >
                  <q-item-label class="q-pt-lg q-pl-xs">
                    Aulas durante o culto</q-item-label
                  >
                  <q-input v-model="item.departamentoData.aulasCulto.freqCulto" class="q-ml-md" label="Frequência total durante culto"></q-input>
                  <q-input
                    v-model="item.departamentoData.aulasCulto.qtnFaixaEtaria"
                    class="q-ml-md"
                    label="Divisão de faixa etária"
                  ></q-input>
                </q-item-section>
                <q-space></q-space>
                <q-item-section
                  v-if="item.organismConfigName === 'Departamento de Escola Dominical'"
                >
                  <q-item-label class="q-pt-lg q-pl-xs">
                    Aulas no momento</q-item-label
                  >
                  <q-input v-model="item.departamentoData.aulasMomento.freqMomento" class="q-ml-md" label="Frequência total no momento"></q-input>
                  <q-input
                    v-model="item.departamentoData.aulasMomento.qtnFaixaEtaria"
                    class="q-ml-md"
                    label="Divisão de faixa etária"
                  ></q-input>
                </q-item-section>
                <!-- acabou sobre escolas dominicais -->
                <!-- Musica -->
                <q-item-section  class="justify-around" v-if= "item.organismConfigName==='Departamento da Música'">
                  <q-item-label > Grupo Músical
                    <q-radio v-model="musicGroup" val="exist" label ="Sim"
                    />
                    <q-radio v-model="musicGroup" val="noExist" label ="Não"
                    />
                    <q-input dense class="q-mx-xs q-mr-md" label="Quantidade"></q-input>
                  </q-item-label>
                  <q-item-label > Banda 
                    <q-radio v-model="banda" val="exist" label ="Sim"
                    />
                    <q-radio v-model="banda" val="noExist" label ="Não"
                    />
                    <q-input dense class="q-mx-xs q-mr-md" label="Quantidade"></q-input>
                  </q-item-label>
                  <q-item-label > Grupo de Louvor
                    <q-radio v-model="grupoLouvor" val="exist" label ="Sim"
                    />
                    <q-radio v-model="grupoLouvor" val="noExist" label ="Não"
                    /> 
                    <q-input dense class="q-mx-xs q-mr-md" label="Quantidade"></q-input>
                  </q-item-label>
                  <q-item-label > Quarteto 
                    <q-radio v-model="quarteto" val="exist" label ="Sim"
                    />
                    <q-radio v-model="quarteto" val="noExist" label ="Não"
                    />
                    <q-input dense class="q-mx-xs q-mr-md" label="Quantidade"></q-input>
                  </q-item-label>
                  <q-item-label > Vocal
                    <q-radio v-model="vocal" val="exist" label ="Sim"
                    />
                    <q-radio v-model="vocal" val="noExist" label ="Não"
                    />
                    <q-input dense class="q-mx-xs q-mr-md" label="Quantidade"></q-input>
                  </q-item-label >
                <q-item-section>
                  <q-item-label class="q-mt-sm"> Coro </q-item-label>
                  <q-input class="q-mr-md q-ml-sm" v-model="item.departamentoData.coro"  label="Quantidade"></q-input>
                </q-item-section>
                <q-input class="q-mr-md" v-model="item.departamentoData.musicosTotal" label="Músicos envolvidos ao total" ></q-input>
                
                <q-item-section >
                  <q-input class="q-mr-md" v-model="item.departamentoData.formalGroup.freqTotal" label="Frequência Total"></q-input>
                  <q-input class="q-mr-md" v-model="item.departamentoData.formalGroup.freqTotal" label="Número de encontros"></q-input>
                </q-item-section>
              </q-item-section>
              <!-- visitação -->
              <q-item-section v-if="item.organismConfigName==='Departamento de Visitação'">
                      <q-input v-model="item.departamentoData" class="q-pl-sm q-mr-md" label="Total de visitantes do grupo"/>
                    <q-item-label class="q-mt-sm"/> Visitas Missionárias
                      <q-input v-model="item.departamentoData.visitasMissionarias.qtnVisitas" class="q-pl-sm q-mr-md" label="Número de visitas"/>
                      <q-input v-model="item.departamentoData.visitasMissionarias.pessoas" class="q-pl-sm q-mr-md" label="Total de pessoas"/>
                    <q-item-label class="q-mt-sm"/> Visitas à Membros
                      <q-input v-model="item.departamentoData.visitasMembros.qtnVisitas" class="q-pl-sm q-mr-md" label="Número de visitas"/>
                      <q-input v-model="item.departamentoData.visitasMembros.pessoas" class="q-pl-sm q-mr-md" label="Total de pessoas"/>
                    <q-item-label class="q-mt-sm"/> Enfermos
                      <q-input v-model="item.departamentoData.visitasEnfermos.qtnVisitas" class="q-pl-sm q-mr-md" label="Número de visitas"/>
                      <q-input v-model="item.departamentoData.visitasEnfermos.enfermos" class="q-pl-sm q-mr-md" label="Total de enfermos"/>
              </q-item-section>
              <!-- Sobre ação social   -->
              <q-item-section v-if="item.organismConfigName==='Departamento de Ação social'">
                    <q-input v-model="item.departamentoData.pessoasEnvol" class="q-pl-sm q-mr-md" label="Total de pessoas envolvidas"/>
                    <q-input v-model="item.departamentoData.pessoasBeneft" class="q-pl-sm q-mr-md" label="Total de pessoas Beneficiadas"/>
                    <q-input v-model="item.departamentoData.permProgs" class="q-pl-sm q-mr-md" label="Descrição dos programas permanentes"/>
                    <q-input v-model="item.departamentoData.acoesEventuais" class="q-pl-sm q-mr-md" label="Ações eventuais"/>
              </q-item-section>
              <!-- Sobre outros   -->
                <q-item-section v-if="item.organismConfigName==='Outros'">
                    <q-input v-model="item.departamentoData.finalidade" class="q-pl-sm q-mr-md" label="Finalidade do grupo"></q-input>
                    <q-input v-model="item.departamentoData.organização" class="q-pl-sm q-mr-md" label="Organização do grupo"></q-input>
                    <q-input v-model="item.departamentoData.freqTotal" class="q-pl-sm q-mr-md" label="Número de encontros"></q-input>
                    <q-input v-model="item.departamentoData.qtnEncontros" class="q-pl-sm q-mr-md" label="Frequência total "></q-input>
                </q-item-section>
              <!-- ainda sobre outros -->
                <q-btn
                  class="q-mt-md"
                  label="Salvar"
                  rounded
                  color="grey"
                  @click="submitForm(item)"
                >
                </q-btn>
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
      banda: '', grupoLouvor:'', quarteto:'', vocal:'',
      departamentos: [],
      statisticStatus: null,
      arrayIgnore:['Departamento de Escola Dominical', 'Departamento da Música', 'Departamento de Visitação', 'Departamento de Ação social', 'Outros'],
    };
  },
  beforeMount() {
    this.getCongregationGroups();
  },
  methods: {
  getCongregationGroups() {
    const opt = {
      route: "/desktop/statistics/getCongregacaoByOrganismId",
      body: {
        organismId: "6530487ab2980d56e0985464",
        // organismId: this.$route.query.organismId
      },
    };
    useFetch(opt).then((r) => {
      if (r.error) return;
      this.departamentos = r.data.childData;
      console.log("grupos", this.departamentos);
    });
  },
  toggleForm(item) {
    item.formVisible = !item.formVisible;
    if (!item.formData) {
      item.formData = {};
    }
  },
  submitForm(item) {
    const opt = {
      route:'/desktop/statistics/insertGroupsActivitiesStatisticsDraft',
      body: {
        organismId : this.$route.query.organismId,
        groupActivitiesData: this.departamentos.departamentoFormData,
      }
    }
    useFetch(opt).then((r)=>{
      if (r.error) return;
      console.log('departamentos', this.departamentos)
    })
    // Lógica para lidar com o envio do formulário
    console.log("Formulário enviado para", item.organismConfigName, "/");
    // Você pode adicionar lógica adicional aqui, por exemplo, enviar dados para o servidor
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
  top: 100%; /* Ajuste conforme necessário para a posição desejada */
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
