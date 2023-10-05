<template>
  <q-list
    class="bg-grey-3"
    style="border-radius: 1rem"
    separator
  >
    <q-item
      v-for="(item, i) in props.data"
      :key="item + i"
    >
      <q-item-section>
        <q-item-label class="text-capitalize">
          {{ item.street }}, {{ item.number }}
        </q-item-label>
        <q-item-label caption>
          {{ item.district }} - {{ item.city }}
        </q-item-label>
        <q-item-label caption>
          CEP
          {{ item.cep }}
        </q-item-label>
        <q-item-label caption>
          Complemento:
          {{ item.complement }}
        </q-item-label>
        <q-item-label caption class="text-capitalize">
          <q-badge>{{ item.type }}</q-badge>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
        <q-btn
          icon="edit"
          flat
          round
          color="primary"
          @click="edit(fieldIndex, tabsIndex, i)"
        >
        </q-btn>
        <q-btn
          icon="delete"
          flat
          round
          color="red"
          @click="remove(fieldIndex, tabsIndex, i)"
        >
        </q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex'])
const emits = defineEmits(['edit', 'remove'])


function edit(fieldIndex, tabsIndex, i) {
  emits('edit', fieldIndex, tabsIndex, i)
}

function remove(fieldIndex, tabsIndex, i) {
  emits('remove', fieldIndex, tabsIndex, i)
}


</script>
