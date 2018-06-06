<template>
    <div class="benchmarkSum">
        <component :is="currentRole"></component>
    </div>
</template>

<script>
    import director from '/imports/vue/components/benchmarkSum/benchmarkSum.vue';
    import inConstruction from '/imports/vue/components/dashboardRoles/inConstruction.vue';
    import {CheckRoles} from '../../api/methods/checkRoles';

    export default {
        components: {
            director,
            inConstruction
        },
        created() {
            let director = CheckRoles({roles: ['super', 'director']});
            let payment = CheckRoles({roles: ['payment']});
            let creditor = CheckRoles({roles: ['creditor']});
            let admin = CheckRoles({roles: ['admin']});
            if (director) {
                this.currentRole = 'director';
            } else if (payment) {
                this.currentRole = 'inConstruction';
            } else {
                this.currentRole = 'inConstruction';
            }
        },
        data() {
            return {
                loading: true,
                currentRole: 'director'

            }
        },

    }
</script>