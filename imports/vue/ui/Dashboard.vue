<template>
    <div class="dashboard">
        <slot v-if="!loading">
            <component :is="currentRole"></component>
        </slot>
        <!--<slot v-else>-->
            <!--<lottie :options="defaultOptions" :height="600" :width="600" v-on:animCreated="handleAnimation"/>-->
        <!--</slot>-->

    </div>
</template>

<script>
    import director from '/imports/vue/components/dashboardRoles/director.vue';
    import inConstruction from '/imports/vue/components/dashboardRoles/inConstruction.vue';
    import {CheckRoles} from '../../api/methods/checkRoles';
    import Lottie from '/imports/vue/components/lottie/lottie.vue';

    export default {
        components: {
            director,
            inConstruction,
            Lottie
        },
        created() {
            this.getAnimationDataJson();
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
                defaultOptions: {animationData: {}},
                animationSpeed: 1,
                currentRole: 'director'

            }
        },
        methods: {
            handleAnimation: function (anim) {
                this.anim = anim;
            },
            getAnimationDataJson() {
                Meteor.call('lottie_animationData', 'assets/skeleton_loading.json', (err, result) => {
                    if (!err) {
                        this.defaultOptions.animationData = result;
                    }
                })
            }
        },
        mounted() {
            setTimeout(() => {
                this.loading = false;
            }, 100)
        }

    }
</script>