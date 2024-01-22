<template>
  <q-page-container class="no-padding">
    <q-page>
      <q-list class="q-pa-sm">
        <q-item v-for="item in groupData.childData" :key="item">
          <q-item-section class="item-section" @click="toggleForm(item)">
            <q-item-label>
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
                  <q-input label="Frequência total" > </q-input>
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
                <q-item-section
                  v-if="item.organismConfigName === 'Departamento da Música'"
                  >
                  <q-item-label class="q-pt-xs q-pl-xs"/> Banda /Grupo de Louvor/ Quarteto/ Vocal
                  <q-input class="q-ml-md" label="Quantidade" hint="Se não houverem, preencher zero numeral (0)"> </q-input>
                </q-item-section>
                <q-space></q-space>
                <q-item-section
                  v-if="item.organismConfigName === 'Departamento da Música'"
                >
                  <q-item-label class="q-pt-lg q-pl-xs">
                    Coro</q-item-label
                  >
                  <q-input class="q-ml-md" label="Quantidade" hint="Se não houverem, preencher zero numeral (0)"></q-input>
                </q-item-section>
                <q-space></q-space>
                  <q-input  v-if="item.organismConfigName === 'Departamento da Música'" class="q-my-sm" label="Cantores envolvidos ao total" ></q-input>
                  <q-item-section  v-if="item.organismConfigName === 'Departamento da Música'">
                    <q-item-label class="space-between">Grupo formal:
                      <q-checkbox v-model="formalGroupYes"
                        label ="Sim"
                      />
                      <q-checkbox v-model="formalGroupNo"
                        label ="Não"
                      />
                    </q-item-label>
                  </q-item-section>
                  
                <!-- ainda sobre musicas -->
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
      formalGroupYes: false,
      formalGroupNo: false,
      groupData: {},
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
        this.groupData = r.data;
        console.log("grupos", this.groupData);
      });
    },
    toggleForm(item) {
      item.formVisible = !item.formVisible;
      if (!item.formData) {
        item.formData = {};
      }
    },
    submitForm(item) {
      // body:this.groupData.childData.organismConfigName
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
