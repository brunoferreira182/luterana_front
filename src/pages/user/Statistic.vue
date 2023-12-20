<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col text-capitalize"> 
          <div class="text-center text-h5 q-mb-sm">
            Estatística 2023
          </div>
          <q-tabs class="bg-primary text-white shadow-2" v-model="tab">
            <q-tab name="Dados iniciais" icon="diversity_2" label="Dados iniciais"/>
            <q-tab name="Dados pastorais" icon="description" label="Dados pastorais" :disable="isUser"/>
            <q-tab name="Atividades" icon="description" label="Atividades"/>
          </q-tabs>
        </div>
      </div>
      <div>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Dados iniciais" class="q-ma-xm">
            <div class="text-h5">
              Este bloco é dedicado às congregações e paróquias.
            </div>
            <div>
              - Para correções, clique na canetinha ao lado da informação;
            </div>
            <div>
              - Caso não deseje concluir a seção no momento, salve as alterações no botão 'Salvar' Rascunho;
            </div>
            <div>
              - Ao terminar a conferência, clique em 'Seguir' para prosseguir.
            </div>
            
          </q-tab-panel>

          <q-tab-panel name="Dados pastorais">
            <div class="text-h5">Revise seus dados e altere-os se necessário</div>
            <div
              v-for="data in pastorData"
              :key="data"
            >
              <q-input 
                v-if="data.label 
                  && data.label !== 'Redes sociais'
                  && data.label !== 'Relação conjugal' 
                  && data.label !== 'Relação familiar'
                  && data.label !== 'Filhos'"
                outlined
                class="q-pa-sm q-mx-md"
                :label="data.label"
                v-model="data.value"
              >
              </q-input>
              <div 
                v-if="data.label === 'Redes sociais'"
                class="q-mx-lg"
              >
                <div class="q-mx-sm">
                  <div class="text-h6">
                    {{data.label}}
                  </div>
                  <q-item 
                    class="bg-grey-2"
                    style="border-radius: 1rem;"
                    v-for="social in data.value"
                    :key="social"
                  >
                    <q-item-section>
                      {{ social.selectedSocialType }}
                      <q-item-label>
                        Nome: {{ social.name }}
                      </q-item-label>
                      <q-item-label>
                        Tipo: {{ social.type }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
              <div v-if="data.label === 'Relação conjugal'" class="q-mx-lg">
                <div class="q-mx-sm">
                  <div class="text-h6">
                    {{ data.label }}
                  </div>
                  <q-item
                    class="bg-grey-2"
                    style="border-radius: 1rem;"
                  >
                    <q-item-section>
                      <q-item-label>
                        Nome: {{ data.partner.name }}
                      </q-item-label>
                      <q-item-label>
                        Data inicial: {{ data.partner.dates.initialDate }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
              <div v-if="data.label === 'Filhos'" class="q-mx-lg q-mt-md">
                <div class="q-mx-sm">
                  <div class="text-h6">
                    {{ data.label }}
                  </div>
                  <q-item
                    class="bg-grey-2 q-my-sm"
                    style="border-radius: 1rem;"
                    v-for="(child, iChild) in data.child"
                    :key="child"
                  >
                    <q-item-section >
                      {{ child.userName }}
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        icon="edit"
                        color="primary"
                        rounded
                        unelevated
                        flat
                        @click="openDialogEditChild(child, iChild)"
                      >
                        <q-tooltip>Editar nome</q-tooltip>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="Atividades">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus eu lectus sit amet viverra. 
            Sed faucibus lectus sed est accumsan, id interdum metus sagittis. Nullam viverra est at arcu 
            fringilla, eu sollicitudin nisi condimentum. Vivamus at semper urna. Phasellus ante justo, 
            tristique nec lacus non, volutpat euismod quam. Curabitur et diam eget magna fringilla 
            sollicitudin. Praesent vulputate turpis sed enim mollis, ut euismod urna ultricies. 
            Sed aliquet consequat tellus, nec congue purus consectetur ut. Nullam non fringilla odio. 
            Proin ac massa lacinia, interdum felis vitae, luctus arcu. Morbi non malesuada magna. Morbi 
            porta erat nec fermentum auctor. Praesent ac leo mollis, placerat turpis ut, consectetur mauris. 
            Nullam venenatis augue eget ante pellentesque, eu viverra erat aliquam.
            Mauris aliquam sed ipsum eget ornare. Nullam ornare, mauris eu finibus efficitur, tellus felis
            malesuada est, 
            at egestas leo libero eget neque. Nam sit amet gravida purus. Donec tempus augue nunc, quis vehicula 
            diam tempus eu. Quisque sit amet arcu elit. Phasellus cursus elit quis porttitor mollis. Curabitur non
            metus est. Morbi non risus molestie, tristique purus et, ultricies eros. Sed non bibendum ipsum, non 
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <q-dialog
        v-model="dialogEditChild.open"
      >
        <q-card style="width: 400px;">
          <q-card-section>
            <q-select
              v-model="dialogEditChild.newChild"
              filled
              use-input
              label="Nome do usuário"
              option-label="userName"
              :options="usersOptions"
              @filter="getUsers"
              :option-value="(item) => item"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn label="Sair" color="primary" unelevated flat @click="cancelChangeChild"/>
            <q-btn label="Confirmar" color="primary" unelevated @click="confirmChangeChild"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>

<script>
import useFetch from "src/boot/useFetch";
import utils from "../../boot/utils";
import { defineComponent } from "vue";
export default defineComponent({
  name:"Statistics",
  data() {
    return {
      tab: 'Dados pastorais',
      pastorData: null,
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      isUser: true,
      dialogEditChild: {
        open: false,
        child: null,
        iChild: null,
        newChild: null
      },
      usersOptions: null
    }
  },
  beforeMount() {
    this.getUserData()
    this.getPastorDataTabs()
    this.verifyIfIsPastor()
  },
  methods: {
    confirmChangeChild() {
      this.pastorData.parentalRelation.child[this.dialogEditChild.iChild] =  {
        _id: this.dialogEditChild.newChild._id,
        userName: this.dialogEditChild.newChild.userName
      }
      this.dialogEditChild.open = false
      this.dialogEditChild.newChild = null,
      this.dialogEditChild.child = null
    },
    openDialogEditChild(child, iChild) {
      this.dialogEditChild.open = true,
      this.dialogEditChild.child = child,
      this.dialogEditChild.iChild = iChild
    },
    getUsers(val, update, abort) {
      if(val.length < 3) {
        this.$q.notify('Digite no mínimo 3 caracteres')
        abort()
        return
      }
      const opt = {
        route: "/desktop/commonUsers/getUsers",
        body: {
          searchString: val,
          isActive: 1,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify(r.errorMessage)
          return
        }
        update(() => {
          this.usersOptions = r.data.list;
        })
      });
    },
    getUserData() {
      const opt = {
        route: "/desktop/commonUsers/getMyOrganisms",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          isActive: 1
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        this.userData = r.data.list
      })
    },
    verifyIfIsPastor() {
      const userInfo = utils.presentUserInfo()
      if (userInfo.userType === 'pastor') {
        this.isUser = false
        this.getPastorDataTabs()
      } else {
        this.isUser = true
      }
    },
    getPastorDataTabs() {
      const opt = {
        route: '/desktop/users/getPastorStatisticsData'
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          this.$q.notify('Ocorreu um erro, tente novamente')
        } else {
          this.pastorData = r.data
        }
      })
    }
  }
})
</script>

<style scoped>
.custom-border {
  border: 1px solid #027be3;
}
</style>