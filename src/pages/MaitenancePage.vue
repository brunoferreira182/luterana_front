<template>
      <q-page>
        <div class="text-h4">
          <div class="row justify-center text-capitalize" style="position:relative; top: 20ch;">
            Em manutenção. Previsão de retorno dia 06/04, às 14h.
          </div>
        </div>
      </q-page>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MaitenancePage',
  data () {
    return {
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
})
</script>
