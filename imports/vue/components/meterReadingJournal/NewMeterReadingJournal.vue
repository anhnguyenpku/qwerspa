<template>
    <div class="new-meterReadingJournal">
        <div class="container-fluid">
            <div class="card">
                <slot v-if="loading">
                    <div class="row">
                        <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                            <loader></loader>
                        </div>
                    </div>
                </slot>
                <slot v-else>
                    <div class="card-header card-header-icon" data-background-color="orange">
                        <i class="material-icons">assignment</i>
                    </div>
                    <div class="card-content">
                        <h4 class="card-title" style="font-family: 'Khmer OS Battambang'">សៀវភៅបញ្ចូលលេខអតិថិជនថ្មី</h4>
                        <div class="col-md-12" style="padding: 10px">
                            <el-table height="400" :data="customerDataPerPage" style="width: 100%">
                                <el-table-column label="#" width="100">
                                    <template slot-scope="scope">
                                        <small style="font-size: 12px;">{{calcIndex(scope.$index)}}</small>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="khName" label="Name" width="300">
                                </el-table-column>
                                <el-table-column prop="districtDoc.name" label="District" width="120">
                                </el-table-column>
                                <el-table-column prop="quartierDoc.name" label="Quartier" fit>
                                </el-table-column>
                                <el-table-column prop="blockDoc.name" label="Block" width="100">
                                </el-table-column>
                                <el-table-column prop="folio" label="Folio" width="100">
                                </el-table-column>
                                <el-table-column prop="successor" label="Successor" width="120">
                                </el-table-column>
                                <el-table-column label="Pre-Reading" width="150">
                                    <template slot-scope="scope">
                                        <small style="font-size: 12px;">{{displayPreReading(scope.row)}}</small>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="prevReadingDate" label="Pre-Reading Date"
                                                 :formatter="dateFormatter"
                                                 width="200">
                                </el-table-column>
                            </el-table>
                            <div class="block">
                                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                               :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100,200]"
                                               :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper"
                                               :total="countMeterReadingJournal">
                                </el-pagination>
                                <br>
                                <transition name="el-fade-in-linear">
                                    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                                                 v-show="waiting"></el-progress>
                                </transition>
                            </div>
                            <p>
                                <br/>
                                <span v-show="!reading">
                            <el-button type="primary" @click.native="insertPreviewMeterReadingJournal">Save</el-button>
                             </span>
                                <a href="/wb-data/meterReadingJournal" class="btn btn-default">
                                    <i class="fa fa-arrow-left" aria-hidden="true"></i> Back</a>
                            </p>
                        </div>

                    </div>
                </slot>
            </div>
        </div>
        <br>
        <!--<div v-show="waiting"> -->

        <!-- </div> -->

    </div>
</template>

<script>
    import {Session} from 'meteor/session';
    import _ from 'lodash';
    import Loader from '/imports/vue/ui/Loader.vue';
    import numeral from 'numeral';
    export default {

        data() {
            return {
                query: '',
                percentage: 0,
                startWait: 0,
                customerDataPerPage: [],
                customerMeterReadingJournal: [],
                rolesArea: '',
                loading: true,
                waiting: false,
                reading: false,
                currentPage: 1,
                currentSize: 10
            }
        },
        meteor: {
            data: {
                rolesArea() {
                    return Session.get('area');
                }
            }
        },
        watch: {
            percentage(val) {
                if (val > 0 && val < 95) {
                    setTimeout(() => {
                        this.percentage = Math.round(val + this.startWait);
                    }, 500)
                }
            },
            currentSize(val) {
                this.currentPage = 1;
                let from = this.currentPage - 1;
                let to = val;
                this.paginateCustomer(this.customerMeterReadingJournal, from, to);
            },
            currentPage(val) {
                let from = (val * this.currentSize - this.currentSize) - 1;
                let to = from + (this.currentSize);
                if (from > this.customerMeterReadingJournal.length) {
                    from = this.customerMeterReadingJournal.length;
                }
                if (from < 0) {
                    from = 0;
                    to += 1;
                }
                this.paginateCustomer(this.customerMeterReadingJournal, from, to);
            }
        },
        methods: {
            displayPreReading(row) {
                return row.prevReading || row.contract && row.contract.prevReading || 0;
            },
            calcIndex(index) {
                let sumIndex = index + (this.currentPage * this.currentSize - this.currentSize) + 1;
                return sumIndex < 0 ? 1 : sumIndex;
            },
            paginateCustomer(dataAsArray, from, to) {
                this.customerDataPerPage = _.slice(dataAsArray, from, to)
            },
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            dateFormatter(row) {
                return moment(row.prevReadingDate || row.contract && row.contract.prevReadingDate).format('DD/MM/YYYY');
            },
            insertPreviewMeterReadingJournal() {
                this.waiting = true;
                let meterReadingId = FlowRouter.query.get('mrId');
                let meterReadingJournalId = FlowRouter.query.get('mrjId');
                let vm = this;
                this.startWait = this.customerMeterReadingJournal.length / 100;
                this.percentage = this.startWait
                Meteor.call('insertPreviewMeterReadingJournal', {
                    meterReadingJournalId,
                    meterReadingId,
                    rolesArea: this.rolesArea,
                    query: this.query,
                    previewMeterReadingJournal: this.customerMeterReadingJournal
                }, function (err, res) {
                    if (!err) {
//                    Materialize.toast('Successful', 3000, 'teal rounded');
                        vm.$message.success('Successfully');
                        vm.customerMeterReadingJournal = [];
                        vm.customerDataPerPage = [];
                        vm.waiting = false;
                    } else {
//                    Materialize.toast(err.message, 3000, 'read rounded');
                        vm.$message.error(err.message);
                        vm.waiting = false;
                    }
                    vm.percentage = 100;
                });
            }
        },
        computed: {
            countMeterReadingJournal() {
                return this.customerMeterReadingJournal.length;
            },
            noData() {
                return this.customerMeterReadingJournal.length <= 0;
            },
            displayCustomerName(customer) {
                return customer.name ? customer.name : customer.customerDoc && customer.customerDoc.khName
            }

        },
        components: {
            Loader,
            customer: {
                displayCustomerName() {
                    return this.name ? this.name : this.customerDoc && this.customerDoc.khName;
                }
            }
        },
        // life cycle
        created() {
            let query = FlowRouter.current().queryParams;
            query.date = moment(query.date).toDate();
            this.query = query;
            let vm = this;
            Meteor.call('getCustomerByMeterReading', query, function (err, result) { //query customer for journal reading preview
                if (!err) {
                    vm.customerMeterReadingJournal = result.data;
                    vm.paginateCustomer(vm.customerMeterReadingJournal, vm.currentPage - 1, vm.currentSize);
                    vm.reading = result.reading;
                    vm.loading = false;
                } else {
                    vm.$message.error(err.message);
                    vm.loading = false;
                }
            });
        },
    }
</script>

<style scope>
    .breadcrumbs {
        padding: 0;
        margin: 15px 0;
        list-style: none;
    }

    ol {
        display: block;
        list-style-type: decimal;
        -webkit-margin-before: 1em;
        -webkit-margin-after: 1em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        -webkit-padding-start: 40px;
    }
</style>