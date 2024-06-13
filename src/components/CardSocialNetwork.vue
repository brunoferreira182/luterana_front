<template>
  <q-list
    class="bg-grey-3"
    style="border-radius: 1rem"
    separator
  >
    <q-item-label header v-if="showHeader">
      {{ showHeader }}
    </q-item-label>
    <!-- {{ props.data }} -->
    <q-item
      v-for="(value, iValue) in props.data"
      :key="'multField' + iValue"
    >
      <q-item-section>
        <q-item-label>
          {{ value.selectedSocialType }}
        </q-item-label>
        <q-item-label>
          {{ value.name }}
        </q-item-label>
        <q-item-label class="text-subtitle2" style="font-size: 12px;" v-if="value.selectedSocialType === 'Instagram'">
          https://www.instagram.com/{{ value.name }}
        </q-item-label>
        <q-item-label style="font-size: 12px;" class="text-subtitle2" v-if="value.selectedSocialType === 'Facebook'">
          https://www.facebook.com/{{ value.name }}
        </q-item-label>
        <q-item-label class="text-subtitle2" style="font-size: 12px;" v-if="value.selectedSocialType === 'Youtube'">
          https://www.youtube.com/{{ value.name }}
        </q-item-label>
        <q-item-label class="text-subtitle2" style="font-size: 12px;" v-if="value.selectedSocialType === 'Site pessoal'">
          {{ value.value }}
        </q-item-label>
        <q-item-label caption >
          <q-badge v-if="value.type && !props.organism">{{ value.type }}</q-badge>
          <q-badge class="q-ml-xs" color="green" v-if="value.allowPublication">Publicável</q-badge>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
        <q-btn
          icon="edit"
          flat
          round
          color="primary"
          @click="edit(fieldIndex, tabsIndex, props.data, value, iValue)"
          :disable="disableButtons"
        ><q-tooltip>Editar este {{ props.data[0].type.label }}</q-tooltip></q-btn>
        <q-btn
          icon="delete"
          flat
          round
          color="red"
          @click="remove(fieldIndex, tabsIndex, props.data, value, iValue)"
          :disable="disableButtons"
        ><q-tooltip>Excluir este {{ props.data[0].type.label }}</q-tooltip></q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
// import { ref, watch } from 'vue'

const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons', 'showHeader', 'organism'])
const emits = defineEmits(['edit', 'remove'])

// const data = ref({
//   name: '',
//   value: '',
//   type: '',
//   selectedSocialType: null,
// })

// watch(() => props.dataProp, (nV) => {
//   data.value = nV
// }, { deep: true })


function edit(fieldIndex, tabsIndex, field, value, iValue) {
  emits('edit', fieldIndex, tabsIndex, field, value, iValue)
}
function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}
</script>