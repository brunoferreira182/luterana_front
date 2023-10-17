<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-card style="border-radius: 1rem; height: 150x; width: 400px">
      <q-card-section>
        <div class="text-h6 text-center">Informe os dados</div>
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <div
          v-for="(field, fieldIndex) in data.fields"
          :key="fieldIndex"
          class="q-my-md"
        >
          <div class="row q-gutter-sm justify-left items-left">
            <div class="col q-mx-lg">
              <div v-if="
                field.type.type === 'string'
                || field.type.type === 'int'
                || field.type.type === 'date'
                || field.type.type === 'cpf'
                || field.type.type === 'cnpj'
                || field.type.type === 'money'
                || field.type.type === 'textarea'
                "
              >
                <q-input
                  :label="field.label"
                  :hint="field.hint"
                  :mask="field.type.mask"
                  v-model="field.value"
                  outlined
                >
                </q-input>
              </div>
              <div class="text-right" v-if="field.type.type === 'options'">
                <q-select
                  outlined
                  :label="field.label"
                  option-label="optionName"
                  emit-value
                  map-options
                  :hint="field.hint"
                  v-model="field.value"
                  :options="field.options"
                >
                </q-select>
              </div>
              <div v-if="field.type.type === 'person'">
                <div v-if="field.value && field.value.length > 0">
                  <div class="text-body">{{ field.label }}</div>
                  <CardPerson
                    :data="field"
                    :fieldIndex="fieldIndex"
                    :tabsIndex="0"
                    @remove="removeThisPerson"
                  />
                </div>
                <q-btn
                  :label="`Adicionar ${field.label}`"
                  no-caps
                  rounded
                  flat
                  color="primary"
                  icon="add"
                  v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                  @click="clkOpenAddPersonDialog(fieldIndex)"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Voltar"
          no-caps
          color="primary"
          rounded
          @click="closeDialog"
        />
        <q-btn
          unelevated
          rounded
          label="Confirmar"
          no-caps
          color="primary"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <DialogAddPerson
    :open="addPerson.open"
    @closeDialog="closeAddPersonDialog"
    @addPerson="confirmAddPerson"
  />
</template>
<script setup>
import { ref, watch } from 'vue'
// import { Loading, Notify } from 'quasar'
import DialogAddPerson from './DialogAddPerson.vue'
import CardPerson from './CardPerson.vue'
const props = defineProps(['open', 'dataProps'])
const emits = defineEmits(['closeDialog', 'confirm'])
const data = ref(null)
const addPerson = ref({
  open: false,
  data: null,
  fieldIndex: null,
})
watch(() => props.dataProps, (nV) => {
  data.value = {...nV}
}, { deep: true })
function closeAddPersonDialog() {
  addPerson.value.open = false
}
function clkOpenAddPersonDialog(fieldIndex) {
  addPerson.value.fieldIndex = fieldIndex
  addPerson.value.open = true
}
function confirmAddPerson (userSelected) {
  data.value.fields[addPerson.value.fieldIndex].value = [userSelected]
  closeAddPersonDialog()
}
function removeThisPerson (fieldIndex) {
  data.value.fields[fieldIndex].value = []
}
function confirm () {
  emits('confirm', data.value)
}
function closeDialog() {
  emits('closeDialog')
}
</script>
