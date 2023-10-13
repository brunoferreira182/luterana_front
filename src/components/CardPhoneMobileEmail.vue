<template>
  <q-list
    class="bg-grey-3"
    style="border-radius: 1rem"
    separator
  >
    <q-item
      v-for="(value, iValue) in props.data.value"
      :key="'multField' + iValue"
    >
      <q-item-section>
        <q-item-label>
          {{ value.value }}
        </q-item-label>
        <q-item-label caption >
          <q-badge>{{ value.type }}</q-badge>
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
        ><q-tooltip>Editar este {{ props.data.type.label }}</q-tooltip></q-btn>
        <q-btn
          icon="delete"
          flat
          round
          color="red"
          @click="remove(fieldIndex, tabsIndex, props.data, value, iValue)"
          :disable="disableButtons"
        ><q-tooltip>Excluir este {{ props.data.type.label }}</q-tooltip></q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons'])
const emits = defineEmits(['edit', 'remove'])


function edit(fieldIndex, tabsIndex, field, value, iValue) {
  console.log(field, 'POASAKSPOPOSAKDAPOSDKPOASKPOASKD')
  emits('edit', fieldIndex, tabsIndex, field, value, iValue)
}

function remove(fieldIndex, tabsIndex, field, value, iValue) {
  emits('remove', fieldIndex, tabsIndex, field, value, iValue)
}


</script>
