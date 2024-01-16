<template>
  <q-page-container class="no-padding">
    <q-page>
      
    </q-page>
  </q-page-container>
</template>

<script>
// import useFetch from "src/boot/useFetch";
// import utils from "../../boot/utils";
import { defineComponent } from "vue";
export default defineComponent({
  name:"OrganismsData",
  data() {
    return {
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      organismListTree: null
    }
  },

  beforeMount() {
    this.getMyOrganismsWithAllData()
  },
  methods: {
    getMyOrganismsWithAllData() {
      const opt = {
        route: "/desktop/statistics/getMyOrganismsWithAllData",
        body: {
          searchString: this.filter,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          isActive: 1
        },
      };
      this.$q.loading.show()
      useFetch(opt).then((r) => {
        this.$q.loading.hide()
        r.data.count[0] ? this.pagination.rowsNumber = r.data.count[0].count : this.pagination.rowsNumber = 0
        this.mountTree(r.data.list)
      });
    },
    mountTree (list) {
      let tree = []
      list.forEach(org => {
        tree = {
          type: org.organismParentLocal,
          label: org.organismParentLocal + ' ' + org.organismParentName,
          fundationDate: org.parentData.organismParentFundationDate,
          isFiliated: org.parentData.isFiliated,
          isHeadOffice: org.parentData.isHeadOffice,
          header: 'generic',
          organismId: org.organismParentId,
          children: []
        }
        org.childrenData.forEach(child => {
          tree.children.push({
            type: child.organismChildConfig,
            label: child.organismChildConfig + ' ' + child.organismChildName,
            body: 'normal',
            organismId: child.organismChildId
          })
        })
        this.organismListTree.push(tree)
      })
    },
  }
})
</script>