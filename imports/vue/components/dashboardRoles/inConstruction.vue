<template>
    <div>
        <div class="col-md-12">
            <div class="card">
                <slot v-if="loading">
                    <div class="row">
                        <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                            <loader></loader>
                        </div>
                    </div>
                </slot>
                <slot v-else>
                    <div class="card-header card-header-icon" data-background-color="red">
                        <i class="material-icons">language</i>
                    </div>
                    <div class="card-content">
                        <h4 class="card-title" style="font-family: 'Khmer OS Muol'">Comming soon...</h4>
                    </div>

                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import Loader from '/imports/vue/ui/Loader.vue';

    export default {
        components: {
            Loader
        },
        mounted() {
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },
        data() {
            return {
                loading: true
            }
        }
    }
</script>