<template>
    <div class="transaction">
        <el-table height="400" element-loading-text="Loading..." v-loading="loading" ref="transactionTable"
                  :data="dataPerPage" border style="width: 100%" @selection-change="handleSelectionChange">
            <!--<el-table-column type="selection" width="55">-->
            <!--</el-table-column>-->
            <el-table-column type="index" min-width="50">
            </el-table-column>
            <el-table-column label="Ref" sortable min-width="190">
                <template slot-scope="scope">
                    <a class="cursor-pointer" @click="handleClickRefId(scope.row)">{{scope.row.refId}}</a>
                </template>
            </el-table-column>
            <el-table-column property="date" sortable label="Date" :formatter="dateFormatter" min-width="150">
            </el-table-column>
            <el-table-column label="Type" min-width="150">
                <template slot-scope="scope">
                    <span class="badge btn-success" v-if="scope.row.type === 'post'"><i class="fa fa-list-alt"></i> Invoice</span>
                    <span class="badge btn-primary" v-else><i class="fa fa-money"></i> Payment</span>
                </template>
            </el-table-column>
            <el-table-column property="amount" :formatter="numFormatter" label="Amount" fit min-width="150">
            </el-table-column>
            <el-table-column label="Status" fit>
                <template slot-scope="scope">
                    <span class="badge btn-success" v-if="scope.row.status === 'closed'">Closed</span>
                    <span class="badge btn-primary" v-else>Active</span>
                </template>
            </el-table-column>
            <el-table-column label="Action" width="80">
                <template slot-scope="scope">
                    <span  @click="handlePrint(scope.row)" class="badge btn-warning cursor-pointer" v-if="scope.row.type === 'post'"><i class="fa fa-print"></i></span>
                </template>
            </el-table-column>
            <!--<el-table-column property="description" label="Description" show-overflow-tooltip>-->
            <!--</el-table-column>-->
        </el-table>
        <div class="block">
            <pagination @currentSize="currentSize" @paginate="paginate" :totalRecords="countRecords"></pagination>
        </div>
    </div>
</template>

<script>
    const transTmp = new Mongo.Collection(null);
    import _ from 'lodash';
    import Pagination from '/imports/vue/components/pagination/pagination.vue';
    import numeral from 'numeral';

    export default {
        components: {
            Pagination
        },
        props: {
            flag: {type: Boolean, required: true, default: false}, //flag whether the function inside saving is getting called
            customerId: {type: String, required: true},
            date: {type: Array, required: true}
        },
        watch: {
            flag(val) {
                if (val) {
                    this.giveMeTransactionDetailAsArrayObject();
                    this.giveMeTransactionObj();
                    this.$emit('refetchCustomerInfo', true);
                }
            },
            date(val) {
                this.giveMeTransactionDetailAsArrayObject()
            },

        },
        meteor: {
            transDetails() {
                return transTmp.find({}, {sort: {date: 1}}).fetch()
            }
        },
        data() {
            return {
                transDetails: [],
                dataPerPage: [],
                dataAsArr: [],
                loading: false,
                countRecords: 0,
                from: 0,
                to: 10
            }
        },
        methods: {
            handlePrint(row){
                let printPostedMRJPath = FlowRouter.path('wb.postedPrintMeterReadingJournal') + `?mrjd=${row.refId}`; // mrjd = meter reading journal detail
                FlowRouter.go(printPostedMRJPath);
            },
            currentSize(val) {
                console.log(val);
            },
            paginate(val) {
                this.from = val.from;
                this.to = val.to;
                this.dataPerPageFn(this.dataAsArr, this.from, this.to);
            },
            dateFormatter(row) {
                return moment(row.date).format('DD/MM/YYYY');
            },
            numFormatter(row) {
                return numeral(row.amount).format('0,0.00');
            },
            handleSelectionChange() {

            },
            dataPerPageFn(dataAsArray, from, to) {
                this.dataPerPage = dataAsArray.slice(from, to);
            },
            giveMeTransactionDetailAsArrayObject() {
                let start = moment(this.date[0]).startOf('days').toDate();
                let end = moment(this.date[1]).endOf('days').toDate();
                transTmp.remove({});
                Meteor.call('giveMeTransactionDetailAsArrayObject', {
                    customerId: this.customerId,
                    date: {$gte: start, $lte: end}
                }, (err, result) => {
                    if (!err) {
                        result.forEach(function (doc) {
                            transTmp.insert(doc);
                        });
                        this.countRecords = transTmp.find({}).count();
                        this.dataAsArr = transTmp.find({}, {sort: {date: -1}}).fetch();
                        this.dataPerPageFn(this.dataAsArr, this.from, this.to);

                    }
                });
            },
            handleClickRefId(row) {
//                console.log('handle click refId');
                this.loading = true
                if (row.type === 'post') {
                    Meteor.call('fineOneMeterReadingJournalDetail', {_id: row.refId}, (err, result) => {
                        if (!err) {
                            if (result) {
                                let meterJournalDate = moment(result.meterReadingJournalDoc.date).format('YYYY-MM-DD');
                                let uri = `/wb-data/meterWritingJournal/${result.meterReadingJournalId}?date=${meterJournalDate}&mrjdid=${row.refId}`;
                                FlowRouter.go(uri);
                            } else {
                                this.$message({
                                    duration: 3000,
                                    message: `អ្នកពំុមានសិទ្ធចូលទេ`,
                                    type: 'warning'
                                })
                            }
                        } else {
                            this.$message({
                                duration: 3000,
                                message: err.message,
                                type: 'error'
                            })
                        }
                        this.loading = false;
                    });
                } else {
                    this.loading = false;
                }
            },
            giveMeTransactionObj() {
                Meteor.call("giveMeTransactionObj", {
                    customerId: this.customerId
                }, (err, result) => {
                    if (!err) {
                        this.$emit('customerTransactionObj', result || {balance: 0});
                    }
                })
            }
        },
        created() {

        }
    }
</script>
