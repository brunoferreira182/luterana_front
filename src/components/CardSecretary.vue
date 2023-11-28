<template>
  <q-card
    style="border-radius: 1rem"
    class="bg-grey-2"
    flat
  >
    <q-item-label header  class="no-padding">
      <div class="q-pl-md q-pt-sm">
        Dados sobre a secretária:
      </div>
    </q-item-label>
    <q-item 
      v-for="(secretary, isecretary) in props.data"
      :key="secretary"
      class="bg-grey-2"
    >
    
      <q-item-section>
        <q-item-label>
          <strong>Nome:</strong> {{ secretary.user.userName }}
        </q-item-label>
        <q-item-label>
          <strong>Horário de trabalho:</strong> {{ secretary.officeHours }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn 
          icon="delete"
          color="red"
          flat
          size="md"
          rounded
          @click="remove(fieldIndex, isecretary)"
        />
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
  const props = defineProps(['data', 'fieldIndex'])
  const emits = defineEmits(['remove'])

  function remove(fieldIndex, isecretary) {
    emits('remove', fieldIndex, isecretary)
}
</script>