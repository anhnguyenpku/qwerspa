<template>
    <div class="search">
        <transition name="slide-fade">
            <el-row :gutter="20" v-show="!loading">
                <el-col :span="16">
                    <div class="grid-content">
                        <el-input placeholder="" v-model="search">
                            <el-select v-model="selectFilter" slot="prepend" placeholder="Select">
                                <el-option label="Restaurant" value="1"></el-option>
                                <el-option label="Order No." value="2"></el-option>
                                <el-option label="Tel" value="3"></el-option>
                            </el-select>
                            <el-button slot="append" suffix-icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="16">
                    <search-result :result="obj" v-for="obj in searchResults" key="obj._id"></search-result>
                </el-col>
            </el-row>
        </transition>
    </div>
</template>

<script>
    import _ from 'lodash';
    import searchResult from '/imports/vue/components/searchResult/searchResult.vue';
    export default {
        data() {
            return {
                loading: true,
                selectFilter: 'Select',
                search: '',
                searchResults: []
            };
        },
        components: {
          searchResult
        },
        mounted() {
            setTimeout(() => {
                this.loading = false;
            }, 300)
        },
        methods: {
            giveMeSearchResult(q) {
                if (!!q && isNaN(q)) {
                    Meteor.call('queryCustomer', {q, rolesArea: Session.get('area')}, (err, result) => {
                        this.searchResults = result.content;
                    });
                }
            }
        },
        created() {
            let query = FlowRouter.query.get('q');
            if (!!query) {
                this.search = query;
            }
        },
        watch: {
            search(q) {
                this.giveMeSearchResult(q);
            }
        }
    }
</script>

<style scoped>
    /* Enter and leave animations can use different */
    /* durations and timing functions.              */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active below version 2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }
</style>