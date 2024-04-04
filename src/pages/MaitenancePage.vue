<template>
      <q-page>
        <div class="text-h4">
          <div class="row justify-center" style="position:relative; top: 20ch;">
            Em manutenção...
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
