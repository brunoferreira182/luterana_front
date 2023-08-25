<template>
  <q-page-container class="no-padding">
    <q-page >
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          Dados do título {{ titleName }}
        </div>
        <div class="col q-gutter-sm text-right">
          <q-btn
            rounded
            no-caps
            unelevated
            icon="bookmark"
            color="primary"
            label="Salvar"
            @click="updateUserTitle"
          />
        </div>
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <div class="row justify-center items-start">
        <div class="col-8 q-pa-md q-gutter-md">
          <div class="text-h5">Preencha os dados do título</div>
          <div
            v-for="(field, fieldIndex) in fields"
            :key="fieldIndex"
          >
            <div v-if="field.type.type !== 'boolean' && field.type.type !== 'address' ">
              <q-input
                :label="field.label"
                :hint="field.hint"
                :type="field.type.type"
                v-model="field.value"
                outlined
              >
                <template
                  v-if="field.multiple"
                  #append
                >
                  <q-btn
                    disabled
                    icon="add"
                    color="primary"
                    flat
                    round
                    @click="addMultipleField"
                  >
                    <q-tooltip
                      >Adicionar multiplo
                      {{ field.type.label }}</q-tooltip
                    >
                  </q-btn>
                </template>
              </q-input>
            </div>
            <div class="text-right" v-if="field.type.type === 'address'">
              <q-btn
                label="Adicionar um endereço"
                no-caps
                rounded
                unelevated
                outline
                color="primary"
                @click="clkOpenAddressDialog(fieldIndex, tabsIndex)"
              />
            </div>
          
            <div
              v-if="field.type.type === 'address' && !field.address"
              class="text-subtilte1 text-start"
            >
              <div class="text-h6">Endereços</div>
              Nenhum endereço vinculado
            </div>
            
            <q-list
              class="no-margin"
              v-if="field.address"
            >
              <q-item
                v-for="(item, i) in field.address"
                :key="item + i"
                style="border-radius: 1rem"
                class="bg-grey-3 q-ma-sm q-pa-md"
              >
              <q-item-section>
                <q-item-label lines="3" class="text-capitalize">
                  {{ item.street }}, {{ item.number }}
                </q-item-label>
                <q-item-label caption>
                  {{ item.district }} - {{ item.city }}
                </q-item-label>
                <q-item-label caption>
                  CEP
                  {{ item.cep }}
                </q-item-label>
                <q-item-label></q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption class="text-capitalize">{{
                  item.type
                }}</q-item-label>
              </q-item-section>
              </q-item>
            </q-list>
            <q-checkbox
              v-if="field.type.type === 'boolean'"
              class="q-pt-lg"
              readonly
              :label="field.label"
              :hint="field.hint"
              v-model="field.value"
            />
          </div>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>
<script>
import { defineComponent } from 'vue'
import useFetch from '../../boot/useFetch'
export default defineComponent({
  name: 'UserTitleDetail',
  data() {
    return {
      fields: [],
      titleName: '',
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount() {
    this.getTitleConfigsDetailById()
  },
  methods: {
    updateUserTitle(){
      const titleId = this.$route.query.titleId
      const opt = {
        route: "/desktop/config/updateUserTitle",
        body: {
          userTitleId: titleId,
          titleFields: this.fields
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify('Ocorreu um erro, tente novamente')
          return
        } else{this.$q.notify('Título atualizado com sucesso!')}
      });
    },
    getTitleConfigsDetailById() {
      const titleId = this.$route.query.titleId
      const opt = {
        route: "/desktop/config/getTitleConfigsDetailById",
        body: {
          titleConfigsId: titleId
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        this.titleName = r.data.titleName
        this.fields = r.data.titleFields;
      });
    },
  }
})
</script>

