<template>
  <q-page-container class="no-padding">
    <q-page >
      <div class="q-pa-md q-ml-sm text-h5">
        Dados do título
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <div v-for="(field, i) in fields" :key="i" class="q-my-md">
        <div class="row q-gutter-sm items-center">
          <div class="col">
            <q-input
              readonly
              :label="field.label"
              :hint="field.hint"
              outlined
            >
              <template
                #append
                v-if="
                  field.multiple &&
                  $route.path === '/config/organismConfigDetail'
                "
              >
                <q-btn disabled icon="add" color="primary" flat round>
                  <q-tooltip
                    >Adicionar multiplo {{ field.type.label }}</q-tooltip
                  >
                </q-btn>
              </template>
            </q-input>
          </div>
          <div class="col-2 q-mb-md">
            <q-badge class="q-pa-xs">{{ fields[i].type.label }}</q-badge
            ><br />
            <q-badge color="orange" class="q-pa-xs">
              {{ field.required ? "obrigatório" : "opcional" }}
            </q-badge>
          </div>
          <div class="col-1">
            <q-btn
              icon="delete"
              size="large"
              class="q-mb-md"
              rounded
              @click="fields.splice(i, 1)"
              flat
              color="primary"
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
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
  beforeMount() {
    this.getTitleConfig()
  },
  methods: {
    getTitleConfig() {
      const titleId = this.$route.query.titleId
      const opt = {
        route: "/desktop/adm/getTitleNamesList",
        body: {
          titleConfigId: titleId
        }
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        this.fields = r.data;
      });
    },
  }
})
</script>

