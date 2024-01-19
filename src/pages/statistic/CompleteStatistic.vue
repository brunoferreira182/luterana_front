<template>
    <q-page-container class="no-padding">
        <q-page>

            <div class="fit column q-mt-lg content-center">
                <q-btn class="q-ma-sm" label="Dados pastorais"  rounded unelevated>
                </q-btn>
                <q-btn class="q-ma-sm" label="Dados congregacionais" 
                    rounded unelevated>
                </q-btn>
                <q-btn class="q-ma-sm" label="Dados financeiros" rounded
                    unelevated>
                </q-btn>
            </div>
        </q-page>
    </q-page-container>
</template>

<script>
import { defineComponent } from "vue";
import useFetch from "src/boot/useFetch";
export default defineComponent({
    name: "IntroStatistics",
    data() {
        return {
            statisticStatus: null
        }
    },
    beforeMount() {
        this.getMyOrganismsToChooseOne()
        this.getStatisticStatus()
    },
    methods: {
        goToFinanceView() {
            this.$router.push('')
        },
        goToCongregationalView() {
            this.$router.push('')
        },
        goToPastorTab() {
            this.$router.push('')
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
        getMyOrganismsToChooseOne() {
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