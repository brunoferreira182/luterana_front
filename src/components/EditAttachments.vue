<template>
  <q-page-container class="no-padding">
    <q-page>
      <div class="q-pa-md q-ml-sm row justify-between">
        <div class="col-6 text-h5 text-capitalize">
          {{
            $route.path === "/attach/attachmentDetail"
              ? "Editar anexo"
              : "Novo Anexo"
          }}
        </div>
        <div class="col text-right">
          <q-btn
            @click="clkSaveAttachment"
            color="primary"
            no-caps
            class="q-pa-sm"
            rounded
            icon="bookmark"
            unelevated
            :label="
              $route.path === '/attach/CreateAttachment' ? 'Enviar' : 'Salvar'
            "
          />
        </div>
      </div>
      <q-separator class="q-mx-md"></q-separator>
      <div class="row justify-center">
        <div class="col-10 q-pa-md q-gutter-sm">
          <q-chip
            v-if="$route.path === '/attach/attachmentDetail'"
            @click="openFile"
            clickable
            class="q-pa-md"
            size="md"
          >
            <q-avatar color="primary" text-color="white">
              <q-icon name="download" size="sm"></q-icon>
            </q-avatar>
            Abrir - {{ filename }}
          </q-chip>
          <div
            v-if="$route.path !== '/attach/attachmentDetail'"
            class="text-h5 q-mb-md"
          >
            Insira os arquivos que deseja enviar abaixo
          </div>
          <q-input
            outlined
            label="Título do envio"
            v-model="attachmentInfo.title"
          />
          <q-input
            outlined
            autogrow
            label="Descrição"
            v-model="attachmentInfo.description"
          />
          <q-select
            :options="[1, 2, 3]"
            v-model="attachmentInfo.priority"
            label="Prioridade"
            hint="Anexos com maior prioridade aparecerão nas primeiras posições para se destacar. (3  será o primeiro da lista)"
            outlined
          ></q-select>
          <q-file
            v-if="$route.path === '/attach/createAttachment'"
            v-model="files"
            label="Clique aqui para adicionar arquivos"
            outlined
          >
            <template #append>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <div class="text-h5 q-my-md">
            Destinatário
            <q-btn
              icon="add"
              rounded
              flat
              color="primary"
              @click="addReceiverDialog = true"
              >Adicionar</q-btn
            >
          </div>
          <div class="filters-box">
            <q-chip
              v-for="(item, i) in selectedFilters"
              :key="i"
              removable
              @remove="selectedFilters.splice(i, 1)"
              >{{ item.typeName }} - {{ item.name }}</q-chip
            >
          </div>
        </div>
      </div>
      <q-dialog v-model="addReceiverDialog">
        <q-card style="border-radius: 1rem">
          <q-card-section>
            <div class="text-h5 text-center q-mb-md">Novo destinatário</div>
            <div class="text-subtitle1">Quero enviar para:</div>
            <div class="q-gutter-sm">
              <q-radio
                @update:model-value="radioChanged"
                v-model="receiverType"
                val="organism"
                label="Organismo"
              />
              <br />
              <q-radio
                @update:model-value="radioChanged"
                v-model="receiverType"
                val="organismType"
                label="Tipo de organismo"
              />
              <br />
              <q-radio
                @update:model-value="radioChanged"
                v-model="receiverType"
                val="structure"
                label="Estrutura"
              />
              <br />
              <q-radio
                @update:model-value="radioChanged"
                v-model="receiverType"
                val="function"
                label="Função"
              />
              <br />
              <q-radio
                @update:model-value="radioChanged"
                v-model="receiverType"
                val="title"
                label="Título"
              />
              <br />

              <q-radio
                @update:model-value="radioChanged"
                v-model="receiverType"
                val="user"
                label="Usuário"
              />
              <br />
            </div>
            <q-select
              outlined
              class="q-mt-md q-mr-xl"
              v-model="newReceiver"
              use-input
              hide-selected
              option-label="name"
              fill-input
              input-debounce="300"
              label="Buscar"
              :options="filteredOptions"
              @filter="filterFn"
              style="width: 350px"
              hint="Pesquise ou selecione a opção desejada"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="around" class="q-mb-md">
            <q-btn
              flat
              label="Cancelar"
              no-caps
              rounded
              color="primary"
              @click="addReceiverDialog = false"
            />
            <q-btn
              unelevated
              rounded
              label="Confirmar"
              no-caps
              color="primary"
              @click="addReceiverFilter"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </q-page-container>
</template>
<script>
import { openURL } from "quasar";
import { defineComponent } from "vue";
import useFetch from "../boot/useFetch";
import utils from "../boot/utils";
export default defineComponent({
  name: "CreateAttachment",
  data() {
    return {
      files: [],
      attachmentInfo: {
        title: "",
        description: "",
        priority: 1,
      },
      selectedFilters: [],
      addReceiverDialog: false,
      receiverType: "organism",
      receiverOptions: [],
      filteredOptions: [],
      organismsList: [],
      newReceiver: null,
      currentTypeName: "",
      filename: "",
      fileUrl: "",
    };
  },
  mounted() {
    this.$q.loading.hide();
  },
  beforeMount() {
    if (this.$route.path === "/attach/attachmentDetail") {
      this.getAttachmentById();
    }
    this.getOptionsListByType();
  },
  methods: {
    filterFn(val, update) {
      update(() => {
        if (val === "") {
          this.getOptionsListByType();
        } else {
          this.getOptionsListByType(val);
        }
      });
    },
    getOptionsListByType(searchString) {
      const opt = {
        route: "/desktop/attach/getOptionsListByType",
        body: {
          type: this.receiverType,
          searchString: searchString,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        this.receiverOptions = r.data.arr;
        this.currentTypeName = r.data.typeName;
        this.filteredOptions = this.receiverOptions;
        if (this.receiverType === "organism") this.organismsList = r.data.arr;
      });
    },
    addReceiverFilter() {
      if (!this.newReceiver) {
        this.$q.notify("Selecione uma opção!");
        return;
      } else {
        this.addReceiverDialog = false;
        this.selectedFilters.push({
          typeName: this.currentTypeName,
          type: this.receiverType,
          ...this.newReceiver,
        });
      }
    },
    radioChanged() {
      this.newReceiver = null;
      setTimeout(() => {
        this.getOptionsListByType();
      }, 1);
    },
    clkSaveAttachment() {
      this.$route.path === "/attach/attachmentDetail"
        ? this.updateAttachment()
        : this.sendAttachment();
    },
    sendAttachment() {
      const opt = {
        route: "/desktop/attach/createAttachment",
        body: {
          receivers: this.selectedFilters,
          attachmentInfo: {
            title: this.attachmentInfo.title,
            description: this.attachmentInfo.description,
            priority: this.attachmentInfo.priority,
          },
        },
      };

      opt.file = [{ name: this.files.name, file: this.files }];
      this.$q.loading.show();
      useFetch(opt).then(() => {
        this.$q.notify("Enviado!");
      });
    },
    updateAttachment() {
      const opt = {
        route: "/desktop/attach/updateAttachment",
        body: {
          receivers: this.selectedFilters,
          attachmentInfo: {
            title: this.attachmentInfo.title,
            description: this.attachmentInfo.description,
          },
        },
      };
      this.$q.loading.show();
      useFetch(opt).then(() => {
        this.$q.loading.hide();
        this.$q.notify("Atualizado!");
      });
    },
    openFile() {
      openURL(this.fileUrl);
    },
    getAttachmentById() {
      const opt = {
        route: "/desktop/attach/getAttachmentById",
        body: {
          attachmentId: this.$route.query.attachmentId,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.attachmentInfo = r.data.attachmentInfo;
        this.selectedFilters = r.data.receivers;
        this.filename = r.data.files[0].originalname;
        this.fileUrl = utils.attachmentsAddress() + r.data.files[0].filename;
      });
    },
  },
});
</script>
<style scoped>
.filters-box {
  outline: 1px solid #c2c2c2;
  min-height: 100px;
  padding: 5px;
}
</style>
