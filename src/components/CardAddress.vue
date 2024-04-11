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
        <q-item-label caption v-if="item.complement && item.complement !== ''">
          Complemento:
          {{ item.complement }}
        </q-item-label>
        <q-item-label caption v-else>
          Complemento: Não informado
        </q-item-label>
        <q-item-label caption class="text-capitalize" v-if="item.type && item.type !== ''">
          <q-badge>{{ item.type }}</q-badge>
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="props.canEdit">
        <q-item-label>
          <q-btn
            icon="edit"
            flat
            round
            color="primary"
            @click="edit(fieldIndex, tabsIndex, i)"
            :disable="disableButtons"
          >
          </q-btn>
          <q-btn
            icon="delete"
            flat
            round
            color="red"
            @click="remove(fieldIndex, tabsIndex, i)"
            :disable="disableButtons"
          >
          </q-btn>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons', 'canEdit'])
const emits = defineEmits(['edit', 'remove'])


function edit(fieldIndex, tabsIndex, i) {
  emits('edit', fieldIndex, tabsIndex, i)
}

function remove(fieldIndex, tabsIndex, i) {
  emits('remove', fieldIndex, tabsIndex, i)
}


</script>
