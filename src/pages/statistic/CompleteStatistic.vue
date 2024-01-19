<template>
    <q-page-container class="no-padding">
        <q-page>
            <q-button label="coisa">
                
            </q-button>
            
        </q-page>
    </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";

export default defineComponent({
    name:"IntroStatistics",
    data() {
    return {
        pastorStatus: {
        color: 'red-8',
        tooltip: 'Bloco ainda não iniciado',
        },
        organismStatus: {
        color:  'red-8',
        tooltip: 'Bloco ainda não iniciado',
        },
        financceData: {
        color: 'red-8',
        tooltip: 'Bloco ainda não iniciado',
        },
        statisticStatus: null
    }
    },
    beforeMount(){
    this.getMyOrganismsToChooseOne()
    this.getStatisticStatus()
    },
    methods: {
    goToFinanceView() {
        this.$router.push('/statistic/writeFinanceStatisticData?organismId=' + this.$route.query.organismId + '&t=f')
    },
    goToCongregationalView() {
        this.$router.push('/statistic/WriteCongregationalStatisticData?organismId=' + this.$route.query.organismId + '&t=c')
    },
    goToPastorTab() {
        this.$router.push('/statistic/PastorData?organismId=' + this.$route.query.organismId + '&t=p')
    },
    verifyStatusTypes() {
        console.log('me chamaram')
        this.statisticStatus.forEach((status) => {
        if (status.type === 'financceStatistics') {
            if (status.status.value === 'draft') {
            this.financceData.color = 'yellow-8'
            this.financceData.tooltip = 'Rascunho imcompleto'
            } else if (status.status.value === 'completeDraft') {
            this.financceData.color = 'green-8'
            this.financceData.tooltip = 'Rascunho completo'
            }
        }
        if (status.type === 'pastoralStatistics') {
            if (status.status.value === 'draft') {
            this.pastorStatus.color = 'yellow-8'
            this.pastorStatus.tooltip = 'Rascunho imcompleto'
            }
        } else if (status.status.type === 'pastoralStatistics') {
            if (status.status.value === 'completeDraft') {
            this.pastorStatus.color = 'green-8'
            this.pastorStatus.tooltip = 'Rascunho completo'
            }
        }
        })
    },
    getStatisticStatus() {
        const opt = {
        route: '/desktop/statistics/getStatisticStatusByOrganismId',
        body: {
            organismId: this.$route.query.organismId
        }
        }
        useFetch(opt).then((r) => {
        if (r.error) return
        this.statisticStatus = r.data
        this.verifyStatusTypes()
        })
    },
    goToStatistics() {
        const organismId = this.$route.query.organismId
        this.$router.push('/user/statistic?organismId=' + organismId)
    },
    getMyOrganismsToChooseOne(){
        const opt = {
        route: "/desktop/statistics/getMyOrganismsToChooseOne",
        };
        this.$q.loading.show()
        useFetch(opt).then((r) => {
        this.$q.loading.hide()
        console.log(r, 'CUZIZIZIZIZI')
        // this.organismsFinancesStatistics = r.data.list
        });
    },
    }
})
</script>