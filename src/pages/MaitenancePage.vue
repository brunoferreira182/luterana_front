<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="text-h4">
          <div class="row justify-center" style="position:relative; top: 20ch;">
            Sistema em manutenção...
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MobileMainPage',
  data () {
    return {
    }
  },
  mounted() {
    this.$q.loading.hide()
  },
})
</script>
