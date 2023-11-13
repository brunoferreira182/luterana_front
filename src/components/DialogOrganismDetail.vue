<template>
  <q-dialog :model-value="props.open" @hide="closeDialog">
    <q-card style="width: 800px; max-width: 100vw; border-radius: 1rem">
      {{ userDataTabs }}
      <q-btn icon="close" size="large" class="q-ma-sm" flat round dense v-close-popup/>
      <div class="row justify-center q-py-lg" >
        <div class="text-h5 text-center">
          {{ props.orgData.organismName }}
          <div class="text-caption text-capitalize">
            {{ props.orgData.organismConfigName }}
          </div>
        </div>
        <div class="col-12 q-gutter-md q-mt-sm" align="start" >
          <div class="text-h6">
            Dados
          </div>
          <div v-for="(field, fieldIndex) in props.orgFields" :key="fieldIndex">
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
                :label="field.model === 'chave_ata' || field.model === 'filiada'? 'Estamos imporando estes dados...' : field.label"
                :hint="field.hint"
                :mask="field.type.mask"
                v-model="field.value"
                outlined
                readonly
              >
              </q-input>
            </div>
            <q-file
              v-if="field.type.type === 'image'"
              v-model="files"
              @rejected="onRejected"
              :filter="checkFileType"
              label="Clique aqui para adicionar imagem de perfil"
              outlined
              @input="saveProfilePhoto()"
              readonly
            >
              <template #append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div class="text-right" v-if="field.type.type === 'options'">
              <q-select
                outlined
                :label="field.model === 'chave_ata' || field.model === 'filiada'? 'Estamos imporando estes dados...' : field.label"
                option-label="optionName"
                emit-value
                map-options
                :hint="field.hint"
                v-model="field.value"
                :options="field.options"
                readonly
              >
              </q-select>
            </div>
            <div v-if="field.type.type === 'attach'">
              <q-item class="bg-grey-3" style="border-radius: 1rem">
                <q-item-section>
                  <q-item-label class="text-h5">
                    {{ field.label }}
                  </q-item-label>
                  <q-item-label class="text-subtitle1">
                    {{ field.hint }}
                  </q-item-label>
                  <q-item-label>
                    <q-file
                      class="bg-white"
                      v-model="field.value"
                      label="Escolha um ou mais arquivos"
                      outlined
                      use-chips
                      multiple
                      :readonly="field.onlyAdm"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" />
                      </template>
                    </q-file>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <q-checkbox
              v-if="field.type.type === 'boolean'"
              class="q-pt-lg"
              :label="field.label"
              :hint="field.hint"
              v-model="field.value"
              readonly
            />
            <div v-if="field.type.type === 'multiple_select'">
              <div class="text-h5 q-pa-sm bg-grey-3" style="border-radius: 1rem">
                <div class="q-pl-md q-py-sm">{{ field.label }}:</div>
                <div class="q-pa-sm">
                  <q-btn
                    v-if="field.multiple || (!field.value || field.value.length === 0)"
                    icon="add"
                    color="primary"
                    outline
                    rounded
                    @click="addDoubleSelection(fieldIndex)"
                    no-caps
                    disable
                  >
                    Adicionar nova seleção dupla
                  </q-btn>
                </div>
                <div>
                  <div v-if="field.value">
                    <div
                      v-for="(value, valueIndex) in field.value"
                      :key="valueIndex"
                      class="row wrap justify-left q-pa-sm items-left content-center"
                    >
                      <q-select 
                        v-for="(select, selectIndex) in field.selects"
                        :key="'internalSelect' + selectIndex"
                        :label="select.label"
                        option-label="options"
                        emit-value
                        map-options
                        v-model="organismData.fields[fieldIndex].value[valueIndex][selectIndex]"
                        :options="select.options"
                        class="col-5"
                      />
                      <q-btn
                        icon="delete"
                        class="q-ml-lg"
                        rounded
                        flat
                        color="red"
                        @click="organismData.fields[fieldIndex].value.splice(valueIndex, 1)" 
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="field.type.type === 'organism'">
              <div v-if="field.value && field.value.length > 0">
                <div class="text-body">{{ field.label }}</div> 
                <q-btn
                  :label="`Adicionar ${field.label}`"
                  no-caps
                  rounded
                  flat
                  color="primary"
                  icon="add"
                  v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                  @click="clkOpenAddOrganismDialog(fieldIndex)"
                  disable
                />
                <CardOrganism
                  :data="field"
                  :fieldIndex="fieldIndex"
                  @remove="removeThisOrganism"
                  :disableButtons="true"
                />
              </div>
            </div>
            <div v-if="field.type.type === 'address'">
              <q-btn
                label="Endereço"
                no-caps
                rounded
                unelevated
                flat
                color="primary"
                icon="add"
                @click="clkOpenAddressDialog(fieldIndex)"
                class="q-mt-xs"
                disable
              />
              <CardAddress
                :data="field.value"
                :fieldIndex="fieldIndex"
                :disableButtons="true"
                @edit="editThisAddress"
                @remove="removeThisAddress"
              />
            </div>
            <div v-if="field.type.type === 'person'">
              <div v-if="field.value && field.value.length > 0">
                <div class="text-body">{{ field.label }}</div>
                <CardPerson
                  :data="field"
                  :fieldIndex="fieldIndex"
                  :canEdit="$route.path.includes('/admin') ? true : false"
                  @remove="removeThisPerson"
                  :disableButtons="true"
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
                disable
              />
            </div>
            <div v-if="field.type.type === 'maritalStatus'">
              <div v-if="field.value && field.value.length > 0">
                <div class="text-body">{{ field.label }}</div>
                <CardMaritalStatus
                  :data="field"
                  :fieldIndex="fieldIndex"
                  :disableButtons="true"
                  @remove="removeThisPerson"
                />
              </div>
              <q-btn
                :label="`Modificar ${field.label}`"
                no-caps
                rounded
                flat
                color="primary"
                icon="add"
                v-if="field.multiple || !field.value || field.value ==='' || field.value.length === 0"
                @click="clkAddMaritalStatus(fieldIndex)"
                disable
              />
            </div>
            <div v-if="field.type.type === 'bank_data'">
              <q-btn
                label="Adicionar dados bancários"
                no-caps
                rounded
                flat
                color="primary"
                @click="clkAddBankData(fieldIndex)"
                icon="add"
                disable
              />
              <CardBankData
                :data="field"
                :fieldIndex="fieldIndex"
                @edit="editBankData"
                :disableButtons="true"
                @remove="removeBankData"
              />
            </div>
            <div v-if="
              field.type.type === 'email'
              || field.type.type === 'phone'
              || field.type.type === 'mobile'
              "
            >
              <q-btn
                :label="`${field.type.label}`"
                no-caps
                flat
                v-if="field.multiple || (!field.multiple && (!field.value || field.value.length === 0))"
                icon="add"
                color="primary"
                rounded
                @click="addPhoneMobileEmail(fieldIndex, tabsIndex, field)"
                class="q-mt-xs"
                disable
              />
              <CardPhoneMobileEmail
                :data="field.value"
                :fieldIndex="fieldIndex"
                :disableButtons="true"
                @edit="editPhoneMobileEmail"
                @remove="removePhoneMobileEmail"
                :showHeader="field.value && field.value.length > 0 ? field.label : false"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-h6 q-pa-md">
        Funções
      </div>
      <q-card
        style="border-radius: 1rem"
        class="bg-grey-3 q-ma-sm q-pa-sm q"
        flat
        v-for="func in props.orgFunc"
        :key="func"
      >
        <div class="text-subtitle1 text-subtitle2 q-px-md">
          {{ func.functionName }}
        </div>
        <div v-if="func.users && func.users.length">
          <q-item
            v-for="orgUser in func.users"
            :key="orgUser"
            style="border-radius: 0.5rem;"
            class="bg-white q-ma-xs"
          >
            <q-item-section avatar>
              <q-icon name="account_circle" size="38px" color="grey"/>
            </q-item-section>
            <q-item-section class="text-wrap" lines="2" v-if="orgUser.userName">
              {{ orgUser.userName }}
            </q-item-section>
          </q-item>
        </div>
        <div class="q-px-md " v-else>
          Nenhum usuário nesta função
        </div>
      </q-card>
      <q-card-actions align="center">
        <q-btn
          flat
          label="Voltar"
          no-caps
          color="primary"
          @click="closeDialog"
        />
        <q-btn
          v-if="isAdm"
          unelevated
          rounded
          label="Ir para o organismo"
          no-caps
          color="primary"
          @click="goToDetail"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import CardOrganism from './CardOrganism.vue'
import CardAddress from './CardOrganism.vue'
import CardPerson from './CardOrganism.vue'
import CardMaritalStatus from './CardMaritalStatus.vue'
import CardBankData from './CardBankData.vue'
import CardPhoneMobileEmail from './CardPhoneMobileEmail.vue'
const props = defineProps(['orgData', 'orgFields', 'orgFunc', 'open', 'isAdm'])
const emits = defineEmits(['closeDialog', 'goToDetail'])

function closeDialog() {
  emits('closeDialog')
};

function goToDetail() {
  emits('goToDetail')
};
</script>
