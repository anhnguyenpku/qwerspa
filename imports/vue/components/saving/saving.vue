<template>
    <div class="saving">
            <div style="margin-top: 20px">
                <el-button type="warning" @click="handleRemove" :disabled="!isSelected" icon="el-icon-delete">Remove</el-button>
                <el-button type="primary" @click="handleAddNewSaving" icon="plus">Add New</el-button>
            </div>
            <br>
            <el-table height="400" element-loading-text="Loading..." v-loading="loading" ref="savingTable"
                      :data="dataPerPage" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" width="100">
                </el-table-column>
                <el-table-column property="date" :formatter="dateFormatter" label="Date" width="170">
                </el-table-column>
                <el-table-column property="amount" label="Amount" :formatter="numFormatter" width="120">
                </el-table-column>
                <el-table-column property="type" label="Type" width="120">
                </el-table-column>
                <el-table-column property="description" label="Description" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div class="block">
                <pagination @currentSize="currentSize" @paginate="paginate" :totalRecords="countRecords"></pagination>
            </div>
    </div>
</template>

<script>
    import numeral from 'numeral';
    import _ from 'lodash';
    import Pagination from '/imports/vue/components/pagination/pagination.vue';
    const savingDataDetailTmp = new Mongo.Collection(null);
    export default {
        components: {
            Pagination
        },
        props: {
            flag: {type: Boolean, required: true, default: false}, //flag whether the function inside saving is getting called
            customerId: {type: String, required: true},
            date: {type: Array, required: true}
        },
        meteor: {
            savingDetailData() {
                return savingDataDetailTmp.find({}, {sort: {date: -1}}).fetch()
            }
        },
        watch: {
            flag(val) {
                if (val) {
                    this.loading = true;
                    this.giveMeSavingObject(this.customerId);
                    this.giveMeSavingDetailArrayObject(this.date, this.customerId);
                }
            },
            date(val) {
                this.giveMeSavingDetailArrayObject(val, this.customerId);
            },
            customerId(val) {
                this.giveMeSavingDetailArrayObject(this.date, val);
                this.giveMeSavingObject({customerId: val});
            }
        },
        data() {
            return {
                countRecords: 0,
                multipleSelection: [],
                savingDetailData: [],
                dataPerPage: [],
                loading: false,
                from: 0,
                to: 10
            };
        },
        methods: {
            dataPerPageFn(dataAsArray, from, to){
                this.dataPerPage = _.slice(dataAsArray, from, to);
            },
            currentSize(){

            },
            paginate(val){
                this.from = val.from;
                this.to = val.to;
                this.dataPerPageFn(this.savingDetailData, this.from, this.to);
            },
            dateFormatter(row) {
                return moment(row.date).format('DD/MM/YYYY');
            },
            numFormatter(row) {
                return numeral(row.amount).format('0,0.00');
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleEdit() { //this function not implement yet
                Meteor.call("giveMeSaveDetailEditAvailibility", {savingDetailId: {$in: this.multipleSelection}}, this.multipleSelection, (err, result) => {
                    if (!err) {
                        if (result.rejected.length > 0) {

                        } else {
                            if (result.accepted.length > 0) {
                                FlowRouter.go(`/wb-setting/customer/${this.customerId}/saving?e=${result.accepted.join('-')}`)
                            }
                        }
                    }
                });
            },
            handleAddNewSaving() {
                FlowRouter.go(`/wb-setting/customer/${this.customerId}/saving`);
            },
            handleRemove() {
                this.loading = true;
                let savingDetailData = this.multipleSelection;
                let isNotTypeDeposit = savingDetailData.find(o => o.type !== 'deposit');
                if (isNotTypeDeposit) {
                    this.$message({
                        type: 'error',
                        message: "Withdrawing is not removeable",
                        duration: 3000
                    });
                    this.loading = false;
                } else {
                    Meteor.call('removeSavingDetailObj', {
                        savingDetailData,
                        customerId: this.customerId
                    }, (err, result) => {
                        if (!err) {
                            this.$message({
                                type: 'success',
                                message: 'លុបបានជោគជ័យ',
                                duration: 1500
                            });
                            this.$emit('refetchingCustomerSavingBalance', true);
                            savingDataDetailTmp.remove({_id: {$in: savingDetailData.map(o => o._id)}});
                            setTimeout(() => {
                                this.giveMeSavingObject(this.customerId);
                                this.giveMeSavingDetailArrayObject(this.date, this.customerId);
                                this.loading = false;
                            }, 1000);
                        } else {
                            this.loading = false;
                            this.$message({
                                type: 'error',
                                message: err.message,
                                duration: 3000
                            })
                        }
                    });
                }
            },
            giveMeSavingDetailArrayObject(val, customerId) { //val of date range is an array
                if (!customerId) {
                    return;
                }
                let startDate = moment(val[0]).startOf('days').toDate();
                let endDate = moment(val[1]).endOf('days').toDate();
                let selector = {customerId: customerId, date: {$gte: startDate, $lte: endDate}};
                savingDataDetailTmp.remove({}); //remove the tmp saving detail data in order to insert new tmp data
                Meteor.call('giveMeSavingDetailAsArrayObject', selector, (err, result) => {
                    if (!err) {
                        result.forEach(function (doc) {
                            savingDataDetailTmp.insert(doc);
                        });
                        this.dataPerPageFn(savingDataDetailTmp.find({}, {sort: {date: -1}}).fetch(), this.from, this.to);
                        this.countRecords = savingDataDetailTmp.find({}).count();
                    }
                    this.loading = false;
                });
            },
            giveMeSavingObject(customerId) {
                Meteor.call('giveMeSavingObject', {customerId}, (err, result) => {
                    if (!err) {
                        this.$emit('customerSavingObj', result || {balance: 0});
                    }
                });
            }
        },
        computed: {
            isSelected() {
                return this.multipleSelection.length > 0;
            }

        },
        created() {
        }
    }
</script>