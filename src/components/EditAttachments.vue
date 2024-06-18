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
        <div class="col text-right self-center">
          <q-btn
            @click="createAttachment"
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
        <div class="col-12 q-pa-md q-gutter-sm">
          <q-chip
            v-if="$route.path === '/attach/attachmentDetail'"
            @click="downloadAttach"
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
          <q-input
            outlined
            label="Link para download (Opcional)"
            v-model="linkForDownload"
            hint="Copie e cole aqui o link para download"
          />
          <PhotoHandler
            :start="startPhotoHandler"
            :camera="true"
            :gallery="true"
            :documents="true"
            :noCrop="true"
            @captured="captured"
            @cancel="cancelPhotoHandler"
          />
          <q-btn
            class="q-mr-xs"
            v-if="$route.path === '/attach/createAttachment'"
            flat
            no-caps
            color="primary"
            :label="addFileButtonText"
            @click="clkAddAttachment"
          />
          <div class="text-h5 q-my-md" >
            Destinatário
            <q-btn
              icon="add"
              rounded
              :disable="selectedFilters.length === 1 ? true : false"
              flat
              color="primary"
              @click="addReceiverDialog = true"
              >Adicionar</q-btn
            >
          </div>
          <div class="filters-box">
            <q-chip v-if="receiverType === 'pastors'">
              Todos os pastores
            </q-chip>
            <q-chip v-if="subType === 'pastors'">
              Todos os pastores
            </q-chip>
            <q-chip v-if="subType === 'general'">
              Todos
            </q-chip>
            <q-chip v-if="subType === 'pastors'">
              Distrito 
            </q-chip>
            <q-chip v-if="receiverType === 'general'">
              Todos
            </q-chip>
            <q-chip
              v-for="(item, i) in selectedFilters"
              :key="i"
              removable
              @remove="removeSelectedFilter(i)"
              >{{ item.organismName }}
              
              </q-chip
            >
          </div>
        </div>
      </div>
      <q-dialog v-model="addReceiverDialog">
        <q-card style="border-radius: 1rem; width: 450px;">
          <q-card-section>
            <div class="text-h5 text-center q-mb-md">Novo destinatário</div>
            <div class="text-subtitle1">Quero enviar para:</div>
            <div class="q-gutter-y-sm">
              <q-radio
                v-model="receiverType"
                val="general"
                label="Geral"
              />
              <q-radio
                v-model="receiverType"
                val="pastors"
                label="Pastores"
              />
              <q-radio
                v-model="receiverType"
                val="specificDistrict"
                label="Distrito específico"
              />
            </div>
            <q-select
              v-if="receiverType === 'specificDistrict'"
              outlined
              class="full-width"
              v-model="newReceiver"
              use-input
              hide-selected
              option-label="organismName"
              fill-input
              label="Buscar"
              :options="districtOptions"
              :option-value="(item) => item"
              @filter="getSpecificDistrictsToSendAttach"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Nenhum resultado
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="center" class="q-mb-md">
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
import { defineComponent } from "vue";
import PhotoHandler from '../components/PhotoHandler.vue'
import useFetch from "../boot/useFetch";
import utils from "../boot/utils";
export default defineComponent({
  components:{
    PhotoHandler
  },
  name: "CreateAttachment",
  data() {
    return {
      fileSelected: null,
      linkForDownload: null,
      newReceiver: null,
      attachmentInfo: {
        title: "",
        description: "",
        priority: 1,
      },
      addFileButtonText: 'Clique para inserir um arquivo',
      selectedFilters: [],
      subType: '',
      addReceiverDialog: false,
      receiverType: "",
      receiverOptions: [],
      districtOptions: [],
      organismsList: [],
      currentTypeName: "",
      filename: "",
      file: {},
      startPhotoHandler: false,
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
    this.getSpecificDistrictsToSendAttach();
  },
  methods: {
    async downloadAttach() {
      await utils.download({
        filename: this.file.filename,
        originalname: this.file.originalname,
        type: this.file.mimetype
      })
    },
    clkAddAttachment () {
      this.step = 'addAttachment'
      this.startPhotoHandler = true
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    captured(img, imgBlob, fileName) {
      this.step = 'initial'
      this.startPhotoHandler = false
      this.fileSelected = {
        file: imgBlob,
        name: fileName
      }
      this.addFileButtonText = fileName
    },
    removeSelectedFilter(i){
      this.selectedFilters.splice(i, 1)
      this.newReceiver = null
    },
    getSpecificDistrictsToSendAttach(val, update){
      const opt = {
        route: "/desktop/attach/getSpecificDistrictsToSendAttach",
        body: {
          searchString: val,
        },
      };
      this.$q.loading.show();
      useFetch(opt).then((r) => {
        this.$q.loading.hide();
        update(() => {
          this.districtOptions = r.data;
        })
      });
    },
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
      if(this.receiverType === 'specificDistrict'){
        if (!this.newReceiver) {
          this.$q.notify("Selecione uma opção!");
          return;
        } else {
          this.addReceiverDialog = false;
          
          this.selectedFilters.push({
            type: this.receiverType,
            ...this.newReceiver,
          });
        }
      }else{ this.addReceiverDialog = false;}
    },
    // clkSaveAttachment() {
    //   this.createAttachment();
    //   // this.$route.path === "/attach/attachmentDetail"
    //   //   ? this.updateAttachment()
    //   //   : this.createAttachment();
    // },
    async createAttachment() {
      if(this.attachmentInfo.title === '' || this.fileSelected === null){
        this.$q.notify('Preencha título e insira um arquivo')
        return
      }
      const opt = {
        route: "/desktop/attach/createAttachment",
        body: {
          attachmentInfo: {
            title: this.attachmentInfo.title,
            description: this.attachmentInfo.description,
            priority: this.attachmentInfo.priority,
          },
        },
        file: [ this.fileSelected ]
      };
      if(this.linkForDownload !== null){
        opt.body.linkForDownload = this.linkForDownload
      }
      switch(this.receiverType) {
        case 'specificDistrict':
          opt.body.subType = 'Distrito'
          opt.body.receivers = this.newReceiver._id
        break;
        case 'pastors':
          opt.body.subType = 'pastors'
        break;
        case 'general':
          opt.body.subType = 'general'
        break;
        case '':
          this.$q.notify('Selecione o destinatário')
          return
      }
      this.$q.loading.show();
      const r = await useFetch(opt)
        this.$q.loading.hide();
        if(r.error){
          this.$q.notify('Falha ao enviar documento!')
          return
        }
        this.fileSelected = null
        this.addFileButtonText = 'Clique para inserir um arquivo'
        this.$q.notify("Enviado!");
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
        this.subType = r.data.subType;
        this.file = r.data.file
        this.filename = r.data.file.originalname;
        this.fileUrl = utils.attachmentsAddress() + r.data.file.filename;
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
