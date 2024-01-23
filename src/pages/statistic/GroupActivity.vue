<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-gutter-sm">
        <q-breadcrumbs align="center">
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            icon="home" 
            label="Introdução" 
            @click="$router.push('/statistic/introWriteStatisticData')"
          />
          <q-breadcrumbs-el 
            style="cursor: pointer;" 
            label="Completar estatística" 
            @click="$router.push('/statistic/completeStatistic?organismId=' + $route.query.organismId)"
          />
          <q-breadcrumbs-el label="Atividades de Grupos" />
        </q-breadcrumbs>
      </div>
      <q-list >
        <q-item v-for="(item, i) in departamentos" :key="item" >
          <div style="border-radius: 1rem; background-color: rgb(245, 245, 245); " >
          <q-item-section class="item-section q-pa-sm" @click="toggleForm(item)">
            <q-item-label class="text-h6">
              {{ item.organismName }}
              <q-btn
                round
                flat
                dense
                :icon="
                  item.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                "
                @click="item.expanded = !item.expanded"
              />
            </q-item-label>

            <q-slide-transition>
              <div v-show="item.expanded">
                <q-item-section v-if="!arrayIgnore.includes(item.organismConfigName) ">
                  <q-input label="Frequência total" v-model="i.departamentosFormData" > </q-input>
                  <q-input label="Número de encontros"> </q-input>
                </q-item-section>
                <q-input
                  v-if="
                    item.organismConfigName === 'Juventude Mirim (JELB)' ||
                    item.organismConfigName === 'Departamento de Jovens (JELB)'
                  "
                  label="Existem padrinhos" hint="Se não houverem, completar com zero numeral (0)"
                >
                </q-input>
                <!--  Sobre escolas dominicais ---->
                <q-input
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
                  <q-input class="q-ml-md" label="Frequência total durante culto"></q-input>
                  <q-input
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
                  <q-input class="q-ml-md" label="Frequência total no momento"></q-input>
                  <q-input
                    class="q-ml-md"
                    label="Divisão de faixa etária"
                  ></q-input>
                </q-item-section>
                <!-- ainda sobre escolas dominicais -->
                <!-- Sobre Musicas -->
                <q-item-section >
                  <q-item-label class="q-mt-md"> Departamento de Música
                    <q-radio v-model="musicGroup" val="exist" label ="Sim"
                    />
                    <q-radio v-model="musicGroup" val="noExist" label ="Não"
                    />
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="musicGroup==='exist'">
                  <q-item-label class="q-pt-xs q-pl-xs"> Banda 
                    <q-radio v-model="banda" val="exist" label ="Sim"
                    />
                    <q-radio v-model="banda" val="noExist" label ="Não"
                    />
                  </q-item-label>
                  <q-item-label class="q-pt-xs q-pl-xs"> Grupo de Louvor
                    <q-radio v-model="grupoLouvor" val="exist" label ="Sim"
                    />
                    <q-radio v-model="grupoLouvor" val="noExist" label ="Não"
                    /> </q-item-label>
                  <q-item-label class="q-pt-xs q-pl-xs"> Quarteto 
                    <q-radio v-model="quarteto" val="exist" label ="Sim"
                    />
                    <q-radio v-model="quarteto" val="noExist" label ="Não"
                    />
                  </q-item-label>
                  <q-item-label class="q-pt-xs q-pl-xs"> Vocal
                    <q-radio v-model="vocal" val="exist" label ="Sim"
                    />
                    <q-radio v-model="vocal" val="noExist" label ="Não"
                    />
                  </q-item-label>
                  <q-input class="q-ml-md" label="Quantidade total" v-if ="musicGroup==='exist'"> </q-input>
                </q-item-section>
                <q-item-section
                  v-if="musicGroup==='exist'"
                >
                  <q-item-label class="q-pt-lg q-pl-xs">
                    Coro</q-item-label
                  >
                  <q-input class="q-ml-md" label="Quantidade" hint="Se não houverem, preencher zero numeral (0)"></q-input>
                </q-item-section>
                <q-input  v-if="musicGroup==='exist'" class="q-my-sm" label="Cantores envolvidos ao total" ></q-input>
                
                <q-item-section v-if="musicGroup==='exist'">
                  <q-input label="Frequência Total"></q-input>
                  <q-input label="Número de encontros"></q-input>
                </q-item-section>
                <!-- ainda sobre musicas -->
                <!-- Sobre visitação -->
                <q-item-section class="no-margin" >
                  <q-item-label > Departamento de Visitação
                      <q-radio val='exist' v-model="visitationGroup" label ="Sim"
                      />
                      <q-radio val='noExist' v-model="visitationGroup" label ="Não"
                      />
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="visitationGroup==='exist'">
                    <q-input class="q-pl-sm" label="Total de visitantes do grupo"></q-input>
                  <q-item-label class="q-mt-md"/> Visitas Missionárias
                    <q-input class="q-pl-sm" label="Número de visitas"></q-input>
                    <q-input class="q-pl-sm" label="Total de pessoas"></q-input>
                  <q-item-label class="q-mt-md"/> Visitas à Membros
                    <q-input class="q-pl-sm" label="Número de visitas"></q-input>
                    <q-input class="q-pl-sm" label="Total de pessoas"></q-input>
                  <q-item-label class="q-mt-md"/> Enfermos
                    <q-input class="q-pl-sm" label="Número de visitas"></q-input>
                    <q-input class="q-pl-sm" label="Total de enfermos"></q-input>
                </q-item-section>
                <!-- ainda sobre visitação -->
                <!-- Sobre ação social  -->
                <q-item-section class="no-margin">
                  <q-item-label> Departamento de Ação Social
                      <q-radio val='exist' v-model="socialAction" label ="Sim"
                      />
                      <q-radio val='noExist' v-model="socialAction" label ="Não"
                      />
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="socialAction==='exist'">
                    <q-input class="q-pl-sm" label="Total de visitantes do grupo"></q-input>
                  <q-item-label class="q-mt-md"/> Visitas Missionárias
                    <q-input class="q-pl-sm" label="Número de visitas"></q-input>
                    <q-input class="q-pl-sm" label="Total de pessoas"></q-input>
                  <q-item-label class="q-mt-md"/> Visitas à Membros
                    <q-input class="q-pl-sm" label="Número de visitas"></q-input>
                    <q-input class="q-pl-sm" label="Total de pessoas"></q-input>
                  <q-item-label class="q-mt-md"/> Enfermos
                    <q-input class="q-pl-sm" label="Número de visitas"></q-input>
                    <q-input class="q-pl-sm" label="Total de enfermos"></q-input>
                </q-item-section>
                <!-- ainda sobre ação social -->
                <!-- Sobre outros  -->
                <q-item-section class="no-margin">
                  <q-item-label> Outro tipo de grupo
                      <q-radio val='exist' v-model="outroGrupo" label ="Sim"
                      />
                      <q-radio val='noExist' v-model="outroGrupo" label ="Não"
                      />
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="outroGrupo==='exist'">
                    <q-input class="q-pl-sm" label="Finalidade do grupo"></q-input>
                    <q-input class="q-pl-sm" label="Organização do grupo"></q-input>
                    <q-input class="q-pl-sm" label="Número de encontros"></q-input>
                    <q-input class="q-pl-sm" label="Frequência total "></q-input>
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
      socialAction: '', visitationGroup: '', outroGrupo: '', musicGroup: '',
      banda: '', grupoLouvor:'', quarteto:'', vocal:'',
      departamentos: [],
      statisticStatus: null,
      arrayIgnore:['Departamento de Escola Dominical', 'Departamento da Música', 'Departamento de Visitação', 'Departamento de Ação social'],
    };
  },
  beforeMount() {
    this.getCongregation();
  },
  methods: {
    getCongregation() {
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
        this.departamentos.forEach((depart)=>{
          depart.departamentoFormData = {

            }
        })
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
        alert('Salvo com sucesso!')
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
