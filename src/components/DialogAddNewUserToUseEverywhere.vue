<template>
  <q-dialog :model-value="props.open" @hide="clearDialogNewUser()">
    <q-card style="width: 400px; border-radius: 1rem">
      <q-card-section class="text-h6 text-center">
        Informe os dados do novo usuário:
      </q-card-section>
      <q-card-section>
        <q-input
          label="Nome completo"
          class="q-px-sm q-mt-sm"
          v-model="dialogAddUser.name"
        />
        <q-input
          label="Email do novo usuário"
          class="q-px-sm q-mt-sm"
          v-model="dialogAddUser.email"
        />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          flat
          rounded
          color="primary"
          label="Sair"
          no-caps
          unelevated
          @click="clearDialogNewUser"
        />
        <q-btn
          rounded
          color="primary"
          unelevated
          label="Confirmar"
          no-caps
          @click="confirmCreateNewUser"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
  const props = defineProps(['open', 'param'])
</script>
<script>
export default {
  data() {
    return {
      dialogAddUser: {
        name: '',
        email: '',
      },
    };
  },
  watch: {
    param(newVal) {
      if (newVal === 'secretary') {
        this.dialogAddUser.name = '';
        this.dialogAddUser.email = '';
      }
    },
  },
  methods: {
    clearDialogNewUser() {
      this.$emit('clear');
    },
    confirmCreateNewUser() {
      this.$emit('confirm', this.dialogAddUser);
    },
  },
};
</script>
