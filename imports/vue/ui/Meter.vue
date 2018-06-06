<template>
    <div class="meter">
        <div class="container-fluid">
            <div class="card">
                <div class="card-content">
                    <div class="card-title">Lookup Customer</div>
                    <div class="col s12">
                        <nav>
                            <div class="nav-wrapper grey lighten-2blue darken-1">
                                <form>
                                    <div class="input-field">
                                        <input v-model="search" id="search" type="search"
                                               placeholder="Type to search customer...">
                                        <label class="label-icon" for="search"><i
                                                class="material-icons">search</i></label>
                                        <i class="material-icons">close</i>
                                    </div>
                                </form>
                            </div>
                        </nav>
                    </div>
                    <div v-if="busy">Loading...
                        <div class="preloader-wrapper active">
                            <div class="spinner-layer spinner-red-only">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="customerExist">
                            <ul class="collection">
                                <li class="collection-item" v-for="customer in customers">
                                    {{customer.name}}
                                </li>
                            </ul>
                        </div>
                        <div v-else>No Customer Available</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                search: '',
                busy: false,
                customers: []
            };
        },
        watch: {
            search(val) {
                this.busy = true;
                this.lookupCustomer();
            }
        },

        methods: {
            lookupCustomer: _.debounce(
                function () {
                    let vm = this;
                    Meteor.call('lookupCustomer', this.search, function (err, res) {
                        if (!err) {
                            vm.busy = false;
                            vm.customers = res;
                        } else {
                            vm.busy = false;
                        }
                    });
                }, 500
            )
        },
        computed: {
            customerExist() {
                return this.customers.length > 0;
            }
        }
    }
</script>