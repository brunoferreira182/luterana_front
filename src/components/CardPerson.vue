<template>
  <q-list
    style="border-radius: 1rem"
    class="bg-grey-3"
    separator
  >
    <q-item
      v-for="(item, i) in props.data.value"
      :key="item + i"
    >
      <q-item-section>
        <q-item-label class="text-capitalize">
          {{ item.userName }}
        </q-item-label>
        <q-item-label caption>
          {{ item.email }}
        </q-item-label>
      </q-item-section>
      <q-item-section side v-if="props.canEdit">
        <q-item-label>
          <q-btn
            icon="delete"
            flat
            color="red"
            @click.stop="remove(fieldIndex, tabsIndex, i)"
            :disable="disableButtons"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
const props = defineProps(['data', 'fieldIndex', 'tabsIndex', 'disableButtons', 'canEdit'])
const emits = defineEmits(['remove'])

function remove(fieldIndex, tabsIndex, i) {
  emits('remove', fieldIndex, tabsIndex, i)
}


</script>
