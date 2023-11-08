<template>
  <q-list
    style="border-radius: 1rem"
    class="bg-grey-3"
    separator
  >
  {{ props.data }}
    <q-item
      v-for="(item, i) in props.data"
      :key="item + i"
    >
      <q-item-section>
        <q-item-label class="text-capitalize">
          {{ item.partner1}}
        </q-item-label>
        <q-item-label caption>
          {{ item.partner2 }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            icon="delete"
            flat
            color="red"
            @click="remove(fieldIndex, tabsIndex, i)"
            :disable="disableButtons"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons'])
const emits = defineEmits(['remove'])

function remove(fieldIndex, tabsIndex, i) {
  emits('remove', fieldIndex, tabsIndex, i)
}


</script>
