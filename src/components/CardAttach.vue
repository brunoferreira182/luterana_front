<template>
  <q-list
    style="border-radius: 1rem"
    class="bg-grey-3"
    separator
  >
  <q-item
  >
    <q-item-section>
      {{ props.data.value }} 
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
        ><q-tooltip>Editar {{ props.data.type.label }}</q-tooltip></q-btn>
        <q-btn
          icon="delete"
          flat
          round
          color="red"
          @click="remove(fieldIndex, tabsIndex, props.data, value, iValue)"
          :disable="disableButtons"
        ><q-tooltip>Excluir {{ props.data.type.label }}</q-tooltip></q-btn>
      </q-item-label>
    </q-item-section>
  </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons'])
const emits = defineEmits(['edit', 'remove'])


function edit(fieldIndex, tabsIndex, field, value, iValue) {
  emits('edit', fieldIndex, tabsIndex, field, value, iValue)
}

function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}


</script>
