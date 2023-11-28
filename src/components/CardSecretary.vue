<template>
  <q-card
    style="border-radius: 1rem"
    class="bg-white q-ma-sm q-pa-sm"
    flat
  >
    <q-item 
      v-for="secretary in props.data"
      :key="secretary"
      class="bg-grey-2"
    >
      <q-item-section>
        Nome: {{ secretary.user.userName }}
        <q-item-label class="text-subtitle2">
          Horário de trabalho: {{ secretary.officeHours }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex'])
// const emits = defineEmits(['remove', 'deleteUserFromFunction', 'swapPastorToFunctionPastor'])
</script>