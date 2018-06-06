<template>
    <div class="meterWritingJournal">
        <div class="container-fluid">
            <back-to-top text="Back to top" visibleOffset="350"></back-to-top>
            <el-dialog :title="title" width="100%" :visible.sync="dialogVisible">
                <el-table
                        :data="refModify"
                        style="width: 100% !important;">
                    <el-table-column type="expand">
                        <template slot-scope="prop">
                            <table class="table table-striped" style="margin-top: 0px;">
                                <thead>
                                <tr>
                                    <th>
                                        <small class="fz10">លេខអានចាស់</small>
                                    </th>
                                    <th>
                                        <small class="fz10">ថ្ងៃអានចាស់</small>
                                    </th>
                                    <th>
                                        <small class="fz10">លេខអានថ្មី</small>
                                    </th>
                                    <th>
                                        <small class="fz10">ថ្ងៃអានថ្មី</small>
                                    </th>
                                    <th>
                                        <small class="fz10">ចំនួនទឹកប្រើប្រាស់</small>
                                    </th>
                                    <th>
                                        <small class="fz10">សរុបទឹកប្រាក់</small>
                                    </th>
                                    <th>
                                        <small class="fz10">ថ្លៃថែទាំ</small>
                                    </th>
                                    <th>
                                        <small class="fz10">ថ្លៃលូទឹកស្អុយ</small>
                                    </th>
                                    <th>
                                        <small class="fz10">សរុបទាំងអស់</small>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{{prop.row.document.prevReading}}</td>
                                    <td>{{prop.row.document.prevReadingDate | momentFormat}}</td>
                                    <td>{{prop.row.document.newReading}}</td>
                                    <td>{{prop.row.document.newReadingDate | momentFormat}}</td>
                                    <td>{{prop.row.document.waterConsumption}}</td>
                                    <td>{{prop.row.document.total | numFormat}}</td>
                                    <td>{{prop.row.document.maintenanceFee | numFormat}}</td>
                                    <td>{{prop.row.document.contributionFee | numFormat}}</td>
                                    <td>{{prop.row.document.grandTotal | numFormat}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="ថ្ងៃកែប្រែ"
                            :formatter="dateFormatter"
                            prop="date">
                    </el-table-column>
                    <el-table-column prop="document.customerDoc.khName" label="អតិថិជន"></el-table-column>
                    <el-table-column
                            label="កែប្រែដោយ"
                            prop="userDoc.username">
                    </el-table-column>
                    <el-table-column
                            label="សកម្មភាពក្នុងការកែប្រែ"
                            prop="action">
                    </el-table-column>
                    <el-table-column
                            label="ពិពណ៌នា"
                            prop="document.desc">
                    </el-table-column>
                </el-table>
            </el-dialog>
            <div class="card">
                <div class="card-header card-header-icon" data-background-color="purple">
                    <i class="material-icons">assignment</i>
                </div>
                <div class="card-content">
                    <h4 class="card-title" style="font-family: 'Khmer OS Battambang'"><b>សៀវភៅបញ្ចូលលេខ</b></h4>
                    <br>
                    <div>
                        <div>
                            <el-radio-group v-model="filterRadio">
                                <el-radio-button label="All"></el-radio-button>
                                <el-radio-button label="Completed"></el-radio-button>
                                <el-radio-button label="Incompleted"></el-radio-button>
                            </el-radio-group>
                        </div>
                        <div style="display: flex; padding-top: 5px;padding-bottom: 15px">
                            <span>
                        <el-date-picker :disabled="disabledDate" v-model="date" type="date" :picker-options="options"
                                        placeholder="Pick a day">
                        </el-date-picker>
                                </span>
                            <span style="padding-left: 10px; min-width: 140px; max-width: 120px ;float: left">
                                <el-select v-model="filterVal" placeholder="Filter">
                                    <el-option
                                            v-for="item in filterOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>

                            </span>
                            <div class="payment-hide-low-1023" style="float: right; text-align: right; padding-left: 10px; width: 100%">
                                <!--class="select-width"-->
                                <el-input v-model="search" placeholder="Search Name..." style="max-width: 450px">
                                    <el-select v-model="filterSearchVal"  slot="prepend"
                                               placeholder="Select">
                                        <el-option
                                                v-for="item in filterSearchOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-input>
                            </div>
                        </div>

                        <div class="payment-hide-high-1024" style="padding-bottom: 15px; margin-top: -5px;">
                            <!--class="select-width"-->
                            <el-input v-model="search" placeholder="Search Name..." style="max-width: 450px">
                                <el-select v-model="filterSearchVal"  slot="prepend"
                                           placeholder="Select">
                                    <el-option
                                            v-for="item in filterSearchOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-input>
                        </div>
                        <div>
                            <small style="font-size: 11px;"><b>Modified: <a
                                    @click="showModifiedReference" class="cursor-pointer">{{refModifyCount}}</a></b>
                            </small>
                            <small style="font-size: 11px;"><b>SUMBARCODE: <a
                                    @click="" class="cursor-pointer">{{sumBarcodeCount}}</a></b>
                            </small>
                        </div>
                    </div>

                    <el-table v-loading="loading" element-loading-text="Loading..." ref="multipleTable"
                              :data="customerDataPerPage" border style="width: 100% !important;" :row-class-name="tableRowClassName">

                        <el-table-column width="40"
                                         max-width="60"
                                         label="#">
                            <template slot-scope="scope">
                                <small style="font-size: 12px;">{{calcIndex(scope.$index)}}</small>
                            </template>
                        </el-table-column>
                        <el-table-column prop="khName" sortable
                                         label="Customer"
                                         width="150"
                                         max-width="200"
                        >
                        </el-table-column>
                        <el-table-column width="120" max-width="150" property="dpc" sortable label="DPC">
                        </el-table-column>

                        <el-table-column width="120"
                                         max-width="150"
                                         label="P-Date">
                            <template slot-scope="scope">
                                <small style="font-size: 14px;">{{renderDateField(scope.row)}}</small>
                            </template>
                        </el-table-column>
                        <el-table-column label="N-Date" width="130" max-width="150">
                            <template slot-scope="scope">
                                <small style="font-size: 13px;">
                                    {{renderNewDateField(scope.row)}}
                                    <span style="color: green" v-show="scope.row.written">
                        <i class="fa fa-check-square fa-1x" aria-hidden="true"></i>
                        </span>
                                </small>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="Street"
                                width="70"
                                max-width="80"
                                property="streetNo"
                        >
                        </el-table-column>
                        <el-table-column label="P-Read"
                                         min-width="70">
                            <template slot-scope="scope">
                                <small style="font-size: 14px;">
                                    <a @dblclick="handlePathToMeterChange(scope.row)"
                                       class="cursor-pointer">{{scope.row.prevReading}}</a>
                                </small>
                            </template>
                        </el-table-column>
                        <el-table-column label="N-Read" min-width="110" max-width="200">
                            <template slot-scope="scope">
                                <el-input class="cursor-pointer"
                                          :ref="setTab(scope.$index)"
                                          size="small"
                                          @dblclick.native="modifyMeterReadingJournalDetail(scope.$index,scope.row)"
                                          @keyup.native.40="moveDown(scope.$index)"
                                          @keyup.native.38="moveUp(scope.$index)"
                                          @keyup.native.enter="saveWritten(scope.row, scope.$index)" type="mini"
                                          :readonly="scope.row.printed"
                                          v-model.number="scope.row.newReading">
                                    <template slot="append">
                                        <el-button type="text"
                                                   @click.native="generateNewReadingAuto(scope.$index,scope.row)">&emsp;<i
                                                class="fa fa-magic" style="font-size: 8px"></i>&emsp;
                                        </el-button>
                                    </template>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column sortable property="waterConsumption" label="QTY"
                                         min-width="65">
                        </el-table-column>
                        <el-table-column property="total" label="Total" min-width="150" max-width="200">
                        </el-table-column>
                        <el-table-column label="Desc" min-width="125">
                            <template slot-scope="scope">
                                <!--<el-input type="textarea" @keyup.native.enter="saveWithDesc(scope.row)" :rows="1"-->
                                <!--placeholder="ផ្សេងៗ" v-model="scope.row.desc">-->
                                <!--</el-input>-->
                                <small style="font-size: 12px;"> {{scope.row.desc}} {{scope.row.meterChangeDesc}}
                                </small>
                            </template>
                        </el-table-column>
                        <el-table-column label="Ops" min-width="110">
                            <template slot-scope="scope">
                                <span style="width: 100%">
                                <el-button type="text" size="large"
                                           @click.native="handleRemove(scope.$index,scope.row)">
                                           <span style="color: red;">
                                            <i class="fa fa-trash-o" style="width: 35px"></i>
                                           </span>
                                </el-button>

                                <el-button v-if="scope.row.written" type="text" size="large"
                                           @click.native="printPostedMRJ(scope.row)"><span style="color: purple"><i
                                        class="fa fa-print" style="width: 35px"></i></span>
                                </el-button>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            width="100%"
                            align="center"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[20, 30, 50,100]"
                            :page-size="currentSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="count">
                    </el-pagination>
                    <p>
                        <span v-show="!reading">
                            <button type="text" class="btn waves waves-effect teal"
                                    @click="insertPreviewMeterReadingJournal">
                                <i class="material-icons left">send</i>Save</button>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Session} from 'meteor/session';
    import _ from 'lodash';
    import moment from 'moment';
    import BackToTop from '/imports/vue/components/backToTop/backToTop.vue';

    export default {
        components: {
            BackToTop
        },
        data() {
            return {
                sumBarcodeCount: 0,
                disabledDate: false,
                journalBookWhichIsGreaterThanCurrentJournalBook: null,
                filterSearchVal: 'khName',
                filterSearchOptions: [
                    {
                        label: 'Name', value: 'khName'
                    },
                    {
                        label: 'DPC', value: 'dpc',
                    },
                    {
                        label: 'Street No', value: 'streetNo'
                    }
                ],
                filterVal: 'streetNo',
                filterOptions: [
                    {
                        label: 'DPC',
                        value: 'dpc'
                    },
                    {
                        label: 'Street',
                        value: 'streetNo'
                    },
                    {
                        label: 'QTY',
                        value: 'waterConsumption'
                    }
                ],

                title: 'Modified Reference',
                dialogVisible: false,
                search: '',
                refModifyCount: 0,
                refModify: [],
                filterRadio: 'All',
                count: 0,
                currentPage: 1,
                currentSize: 20,
                customerDataPerPage: [],
                customerMeterReadingJournal: [],
                meterReadingJournalDoc: {},
                rolesArea: '',
                loading: true,
                waiting: false,
                reading: false,
                options: {
                    disabledDate(time) {
                        return false;
                    }
                },
                date: null
            }
        },
        watch: {
            date(newVal, oldVal) {
                if (!!oldVal) {
                    let newSelectedDate = moment(newVal).format('YYYYMMDD');
                    let oldSelectedDate = moment(oldVal).format('YYYYMMDD');
                    if (!this.journalBookWhichIsGreaterThanCurrentJournalBook && (newSelectedDate !== oldSelectedDate)) {
                        this.applyDateToMeterReadingJournalDetail();
                    }
                }
            },
            filterVal(val) {
                this.loading = true;
                this.fetchMeterReadingJournalDetailByMeterJournalId();
            },
            search(q) {
                this.loading = true;
                this.searchFn(q);
            },
            filterSearchVal(val) {
                this.loading = true;
                this.searchFn(this.search);
            },
            filterRadio(val) {
                this.loading = true;
                this.filterRadioFn({val});
            },
            currentSize(val) {
                this.loading = true;
                this.currentPage = 1;
                let from = this.currentPage - 1;
                let to = val;
                this.filterRadioFn({val: this.filterRadio, from, to, q: this.search});
                // this.paginateCustomer(this.customerMeterReadingJournal, from, to);
            },
            currentPage(val) {
                this.loading = true;
                let from = ((val * this.currentSize) - this.currentSize)
                let to = from + (this.currentSize);
                if (from > this.customerMeterReadingJournal.length) {
                    from = this.customerMeterReadingJournal.length;
                }
                if (from < 0) {
                    from = 0;
                    to += 1;
                }
                this.filterRadioFn({val: this.filterRadio, from, to, q: this.search});
                // this.paginateCustomer(this.customerMeterReadingJournal, from, to);
            },
            meterReadingJournalDoc(val) {
                let date = moment(val.date).format("YYYY/MM/DD");
                this.options = {
                    disabledDate(time) {
                        let min = new Date(date).getTime();
                        return time.getTime() < min;
                    }
                }
            }
        },
        meteor: {
            data: {
                rolesArea() {
                    return Session.get('area');
                }
            }
        },
        created() {
            let date = FlowRouter.query.get('date');
            this.date = moment(date).toDate();
            this.fetchMeterReadingJournalDetailByMeterJournalId();
            this.lookupRefModify();
            this.updateNewReadingDateIsAvailabled();
        },
        methods: {
            tableRowClassName(row, rowIndex) {
                return row.sumBarcode ? 'info-row' : '';
            },
            //update current selected date to meter reading journal detail
            applyDateToMeterReadingJournalDetail() {
                this.$confirm('កែប្រែកាលបរិច្ឆេទអានលេខថ្មី?', 'បញ្ជាក់', {
                    confirmButtonText: 'បាទ/ចាស',
                    cancelButtonText: 'ច្រានចោល',
                    type: 'warning'
                }).then(() => {
                    let meterReadingJournalDetailIds = [];
                    let customerIds = [];
                    this.customerMeterReadingJournal.forEach(function (doc) {
                        if (doc.written) {
                            meterReadingJournalDetailIds.push(doc._id);
                            customerIds.push(doc.customerId);
                        }
                    });
                    if (meterReadingJournalDetailIds.length > 0) {
                        this.loading = true;
                        Meteor.call('applySelectedDateToMeterReadingJournalDetail', meterReadingJournalDetailIds, customerIds, this.date, (err, result) => {
                            if (!err) {
                                this.fetchMeterReadingJournalDetailByMeterJournalId();
                                this.$message({
                                    type: 'success',
                                    message: 'កែប្រែបានជោគជ័យ'
                                });

                            }
                        });
                    } else {
                        this.$message({
                            type: 'info',
                            message: 'អត់មានទិន្នន័យសម្រាប់កែប្រែ'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'ច្រានចោលការកែប្រែកាលបរិច្ឆេទ'
                    });
                });
            },
            //handle to meter change
            handlePathToMeterChange(row) {
                Meteor.call("checkIfMeterReadingJournalDetailCanModify", {
                    _id: row._id,
                    prevReadingDate: row.prevReadingDate,
                    customerId: row.customerId,
                    rolesArea: this.rolesArea
                }, (err, result) => {
                    if (!err) {
                        this.$confirm('លុបអតិថិជនហើយបន្តទៅប្តូរនាឡិកា?', 'សូមបញ្ជាក់', {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'info'
                        }).then(() => {
                            Meteor.call("removeMeterReadingJournalDetail", row._id, (err, result) => {
                                if (!err) {
                                    let path = FlowRouter.path('wb.meterChangeComponent');
                                    let query = path + `?q=${row.customerId}`
                                    FlowRouter.go(query);
                                }
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: 'canceled'
                            });
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: err.message,
                            showClose: true,
                            duration: 5000
                        });
                    }
                });

            },
            //generate auto water consumption
            generateNewReadingAuto(index, row) {
                if (!row.printed && !row.written) {
                    this.$confirm('គណនាេលខអានថ្មីដោយស្វ័យប្រវត្តិ?', 'សូមបញ្ជាក់', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'info'
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: 'Delete completed'
                        });
                        Meteor.call('getCustomerById', {_id: row.customerId}, (err, result) => {
                            if (!err) {
                                this.$message({
                                    type: 'success',
                                    message: 'គណនាបានជោគជ័យ'
                                });
                                row.newReading = result.prevReading + result.avgWaterConsumption;
                                row.isEstimated = true;
                                let currentIndex = `tab${index}`;
                                let ref = this.$refs[currentIndex];
                                setTimeout(function () {
                                    ref && ref.$refs.input.focus()
                                }, 100)
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: 'canceled'
                        });
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: row.written ? 'វិក័យប័ត្របានវាយបញ្ចូលរួចរាល់' : 'វិក័យប័ត្របានព្រីនរួចរាល់',
                        duration: 3000,
                    });
                }
            },
            formatDate(date) {
                return moment(date).format('DD/MM/YYYY');
            },
            dateFormatter(row) {
                return moment(row.modifiedDate).format('DD/MM/YYYY');
            },
            showModifiedReference() {
                this.dialogVisible = true;
            },
            fetchMeterReadingJournalDetailByMeterJournalId() {
                let id = FlowRouter.getParam('mrId');
                let meterReadingJournalDetailId = FlowRouter.query.get('mrjdid'); //get meter reading journal detail id
                let vm = this;
//                this.date = moment().toDate();
                let assignedUser = [Meteor.userId()];
                Meteor.call('getMeterReadingJournalDetailById', id, meterReadingJournalDetailId, assignedUser, this.filterVal, function (error, result) {
                    if (!error) {
                        vm.customerMeterReadingJournal = result.data;
                        vm.paginateCustomer(vm.customerMeterReadingJournal, vm.currentPage - 1, vm.currentSize);
                        vm.count = vm.customerMeterReadingJournal.length;
                        vm.reading = result.reading;
                        vm.sumBarcodeCount = result.data.filter(o => o.sumBarcode).length;
                        vm.loading = false;
                    } else {
                        vm.loading = false;
                    }
                });
                Meteor.call('fetchMeterReadingJournal', {_id: id}, (err, result) => {
                    if (!err) {
                        this.meterReadingJournalDoc = result;
                    }
                });
            },
            //check if update date is available
            updateNewReadingDateIsAvailabled() {
                let id = FlowRouter.getParam('mrId');
                let date = FlowRouter.query.get('date');
                Meteor.call('updateNewReadingDateIsAvailabled', id, moment(date).toDate(), (err, result) => {
                    if (!err) {
                        if (result) {
                            this.journalBookWhichIsGreaterThanCurrentJournalBook = result;
                            this.disabledDate = true;
                        }
                    }
                });
            },
            modifyMeterReadingJournalDetail(index, row) {
                let refs = this.$refs;
                if (row.printed) {
                    this.$confirm(`កែតម្រូវទិន្នន័យអតិថិជន ${row.customerDoc.khName}`, 'Warning', {
                        confirmButtonText: 'បាទ/ចាស',
                        cancelButtonText: 'ច្រានចោល',
                        type: 'warning'
                    }).then(() => {
                        this.checkIfMeterReadingJournalDetailCanModify({
                            _id: row._id,
                            prevReadingDate: row.prevReadingDate,
                            customerId: row.customerId,
                            rolesArea: row.rolesArea,
                            row,
                            index,
                            refs
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: 'ច្រានចោល'
                        });
                    });
                }
            },
            checkIfMeterReadingJournalDetailCanRemove({_id, prevReadingDate, customerId, rolesArea, row, index, refs}) {
                Meteor.call("checkIfMeterReadingJournalDetailCanModify", {
                    _id,
                    prevReadingDate,
                    customerId,
                    rolesArea
                }, (err, result) => {
                    if (!err) {
                        Meteor.call("removeMeterReadingJournalDetail", _id, (err, result) => {
                            if (!err) {
                                this.customerDataPerPage.splice(index, 1);
                                this.$message({
                                    type: 'success',
                                    message: `លុបទិន្នន័យអតិថិជន ${row.customerDoc.khName} ជោគជ័យ`,
                                    showClose: true,
                                    duration: 3000
                                });
                                setTimeout(() => {
                                    this.lookupRefModify();
                                }, 1000)
                            }
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: err.message,
                            showClose: true,
                            duration: 5000
                        });
                    }
                });
            },
            checkIfMeterReadingJournalDetailCanModify({_id, prevReadingDate, customerId, rolesArea, row, index, refs, skipSetRow}) {
                Meteor.call("checkIfMeterReadingJournalDetailCanModify", {
                    _id,
                    prevReadingDate,
                    customerId,
                    rolesArea
                }, (err, result) => {
                    if (!err) {
                        if (!skipSetRow) {
                            row.printed = false;
                            row.modifyTime += 1;
                            let currentIndex = `tab${index}`;
                            let ref = refs[currentIndex]
                            setTimeout(function () {
                                ref && ref.$refs.input.select()
                            }, 100)
                        } else {
                            this.saveAfterValidateWritten(row, index);
                        }
                        this.scrollDownWithIndex(index);
                    } else {
                        this.$message({
                            type: 'error',
                            message: err.message,
                            showClose: true,
                            duration: 5000
                        });
                    }
                });
            },

            moveUp(index) {
                if (index || index == 0) {
                    let nextIndex = index > 0 ? `tab${index - 1}` : `tab0`;
                    let ref = this.$refs[nextIndex]
                    setTimeout(function () {
                        ref && ref.$refs.input.select()
                    }, 100)
                }
            },
            moveDown(index) {
                if (index || index == 0) {
                    let nextIndex = `tab${index + 1}`
                    let ref = this.$refs[nextIndex]
                    setTimeout(function () {
                        ref && ref.$refs.input.select()
                    }, 100)
                }
            },
            renderDateField(row) {
                return moment(row.prevReadingDate).format('DD/MM/YYYY');
            },
            renderNewDateField(row) {
                if (row.newReadingDate) {
                    return moment(row.newReadingDate).format('DD/MM/YYYY');
                }
            },
            searchFn: _.debounce(function (q) {
                this.filterRadioFn({val: this.filterRadio, q: q});
            }, 300),
            filterRadioFn({val, from: fromPage, to: toPage, q}) {
                setTimeout(() => {
                    let filter = {
                        all: val == 'All',
                        incompleted: val == 'Incompleted',
                        completed: val == 'Completed'
                    }
                    let arr = [];
                    if (filter.all) { // if filter == all set everything to default
                        let from = fromPage || 0;
                        let to = toPage || 20;
                        this.paginateCustomer(this.customerMeterReadingJournal, from, to);
                    } else if (filter.completed) {
                        this.customerMeterReadingJournal.map((o) => {
                            if (o.written) {
                                arr.push(o)
                            }
                        })
                        let from = fromPage || 0;
                        let to = toPage || 20;
                        this.paginateCustomer(arr, from, to);
                    } else {
                        this.customerMeterReadingJournal.map((o) => {
                            if (!o.written) {
                                arr.push(o)
                            }
                        })
                        let from = fromPage || 0;
                        let to = toPage || 20;
                        this.paginateCustomer(arr, from, to);
                    }
                    this.loading = false;
                }, 50);


            },
            calcIndex(index) {
                let sumIndex = index + (this.currentPage * this.currentSize - this.currentSize) + 1;
                return sumIndex < 0 ? 1 : sumIndex;
            },
            paginateCustomer(dataAsArray, from, to) {
                if (this.search != '' || this.search != null) {
                    dataAsArray = dataAsArray.filter(item => {
                        return item[this.filterSearchVal] && item[this.filterSearchVal].toLowerCase()
                            .indexOf(this.search.toLowerCase()) > -1;
                    })
                }
                this.count = dataAsArray.length;
                this.customerDataPerPage = _.slice(dataAsArray, from, to)
            },
            handleRemove(index, row) {
                this.$confirm(`លុបទិន្នន័យអតិថិជន ${row.customerDoc.khName}`, 'Warning', {
                    confirmButtonText: 'បាទ/ចាស',
                    cancelButtonText: 'ច្រានចោល',
                    type: 'warning'
                }).then(() => {
                    this.checkIfMeterReadingJournalDetailCanRemove({
                        _id: row._id,
                        prevReadingDate: row.prevReadingDate,
                        customerId: row.customerId,
                        rolesArea: row.rolesArea,
                        row,
                        index,
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'ច្រានចោល'
                    });
                });
            },
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            setTab(index) {
                return `tab${index}`
            },
            removeWritten(row) {
                row.total = 0;
                row.written = false;
            },
            printPostedMRJ(row) {
                if (row.waterConsumption != 0) {
                    let printPostedMRJPath = FlowRouter.path('wb.postedPrintMeterReadingJournal') + `?mrjd=${row._id}`; // mrjd = meter reading journal detail
                    FlowRouter.go(printPostedMRJPath);
                } else {
                    alertify.warning("តម្លៃការប្រើប្រាស់ទឹកស្មើ ០ មិនអាចបោះពុម្ភវិក្កយបត្របានទេ។");
                    /*this.$message({
                        duration: 3000,
                        message: "តម្លៃការប្រើប្រាស់ទឹកស្មើ ០ មិនអាចបោះពុម្ភវិក្កយបត្របានទេ។",
                        //message: `មិនទាន់មានការកំណត់តម្លៃសម្រាប់ប្រភេទអតិថិជន}`,
                        type: 'waring'
                    });*/

                }
            },
            checkTariffAndInsertJournalDetail({selector, waterConsumption, row, index}) {
                let userId = Meteor.userId();
                Meteor.call('getTariff', {selector, waterConsumption, row, userId}, (err, tariffReturn) => {
                    if (err) {
                        this.$message({
                            duration: 3000,
                            message: err.message,
                            //message: `មិនទាន់មានការកំណត់តម្លៃសម្រាប់ប្រភេទអតិថិជន}`,
                            type: 'error'
                        });

                    } else {
                        if (tariffReturn) {
                            // let price = result[0].rangePrice[0].price;
                            row.total = tariffReturn.total;
                            row.waterConsumption = tariffReturn.waterConsumption;
                            row.written = true;
                        } else {
                            row.total = tariffReturn.total;
                            row.waterConsumption = tariffReturn.waterConsumption;
                            row.written = true;
                        }
                        this.$message({
                            duration: 1000,
                            message: `រក្សាទុកជោគជ័យ`,
                            type: 'success'
                        });
                        if (this.filterRadio == 'Incompleted' || this.filterRadio == 'Completed') { //enable filter when selected radio not equal to 'all'
                            this.filterRadioFn({val: this.filterRadio});
                        }
                        if (index || index == 0) {
                            if (this.filterRadio == 'Incompleted') {
                                index = -1; //set index = -1 if filter selected is incompleted
                            }
                            this.moveDown(index);
                        }
                    }
                });
            },
            saveWithDesc(row) { // not yet complete just add description
                if (!!row.desc) {
                    Meteor.call('setDescriptionToMeterReadingJournalDetail', row, (err, result) => {
                        this.$message({
                            duration: 3000,
                            message: `ប្រតិបត្តិការជោគជ័យ!`,
                            type: 'success'
                        });
                    });
                } else {
                    this.$message({
                        duration: 3000,
                        message: `សូមពិពណ៌នាជាមុនសិន!`,
                        type: 'error'
                    });
                }
            },
            saveWritten(row, index) {
                this.checkIfMeterReadingJournalDetailCanModify({
                    _id: row._id,
                    prevReadingDate: row.prevReadingDate,
                    customerId: row.customerId,
                    rolesArea: row.rolesArea,
                    row,
                    index,
                    skipSetRow: true
                });
            },
            saveAfterValidateWritten(row, index) {
                if (row.newReading >= row.prevReading) {
                    let selector = {_id: row.tariff};
                    let waterConsumption = row.newReading - row.prevReading;
                    row.newReadingDate = this.date;
                    row.expiredDate = moment(this.date).add(14, 'days').toDate();
                    // row.desc = ''; //set desc to '' when newReading is read
                    Meteor.call('getCustomerById', {_id: row.customerId}, (err, result) => {
                        if (!err) {
                            let customer = result;
                            let waterUsageBetweenAvgWaterConsumption = waterConsumption - customer.avgWaterConsumption; //គម្លាតនៃការប្រើប្រាស់ទឹក
                            let percentageOfWaterUsage = waterUsageBetweenAvgWaterConsumption / customer.avgWaterConsumption; //គណនាគម្លាតនៃការប្រើប្រាស់ទឹកគិតជាភាគរយ
                            if (customer.avgWaterConsumption == 0) {
                                this.checkTariffAndInsertJournalDetail({selector, waterConsumption, row, index});
                            }
                            //else if (customer.avgWaterConsumption <= 15 && (waterUsageBetweenAvgWaterConsumption > 5 || waterUsageBetweenAvgWaterConsumption > -5)) {
                            else if (waterUsageBetweenAvgWaterConsumption > 30 || waterUsageBetweenAvgWaterConsumption < -30) {
                                this.$confirm(`គម្លាតនៃការប្រើប្រាស់ទឹកខុសពីធម្មតា Avg: ${customer.avgWaterConsumption} \n ចំនួនការប្រើប្រាស់: ${waterConsumption},  . បន្ត?`, 'Warning', {
                                    confirmButtonText: 'OK',
                                    cancelButtonText: 'Cancel',
                                    closeOnPressEscape: false,
                                    type: 'warning'
                                }).then(() => {
                                    this.checkTariffAndInsertJournalDetail({
                                        selector,
                                        waterConsumption,
                                        row,
                                        index
                                    });

                                }).catch(() => {
                                    if (!err) {
                                        row.newReading = result && result.newReading || 0;
                                    }
                                    this.$message({
                                        type: 'info',
                                        message: 'Confirm canceled'
                                    });
                                });
                            }
                            /*else if (customer.avgWaterConsumption > 15 && (percentageOfWaterUsage > 0.25 || percentageOfWaterUsage < -0.25)) {
                                this.$confirm(`គម្លាតនៃការប្រើប្រាស់ទឹកខុសពីធម្មតា Avg: ${customer.avgWaterConsumption} \n ចំនួនការប្រើប្រាស់: ${waterConsumption},  . បន្ត?`, 'Warning', {
                                    confirmButtonText: 'OK',
                                    cancelButtonText: 'Cancel',
                                    closeOnPressEscape: false,
                                    type: 'warning'
                                }).then(() => {
                                    this.checkTariffAndInsertJournalDetail({
                                        selector,
                                        waterConsumption,
                                        row,
                                        index
                                    });
                                }).catch(() => {
                                    Meteor.call("fineOneMeterReadingJournalDetail", {_id: row._id}, function (err, result) {
                                        if (!err) {
                                            row.newReading = result && result.newReading || 0;
                                        }
                                    });
                                    this.$message({
                                        type: 'info',
                                        message: 'Confirm canceled'
                                    });
                                });
                            } */
                            else {
                                this.checkTariffAndInsertJournalDetail({selector, waterConsumption, row, index});
                            }
                        }
                    });
                } else {
                    this.$message({
                        duration: 3000,
                        message: `លេខអានថ្មីត្រូវធំជាងឬស្មើលេខអានចាស់`,
                        type: 'error'
                    });
                }
                //look up if there is modify change
                if (row.modifyTime > 0) {
                    setTimeout(() => {
                        this.lookupRefModify();
                    }, 1000);
                }
            },
            insertPreviewMeterReadingJournal() {

            },
            handleSelectionChange(val) {

            },
            getWaterConsumption(val) {
            },
            isWritten(row) {
                if (row.written) {
                    return false;
                } else if (row.saveWritten) {
                    return true
                }
                return true
            },
            lookupRefModify() {
                let id = FlowRouter.getParam('mrId');
                let meterJournalId = FlowRouter.query.get('mrjdid'); //get meter reading journal detail id
                Meteor.call('giveMeRefModifyArrayObject', {'document.meterReadingJournalId': id}, (err, result) => {
                    if (!err) {
                        this.refModify = result;
                        this.refModifyCount = result.length;
                    }
                });
            },
            scrollDownWithIndex(index) {
                let maxHeigh = $(document).height();
                let scrollDown = index * 40;
                let currentView = maxHeigh / this.currentSize;
                if (scrollDown > currentView) {
                    $("html, body").animate({scrollTop: scrollDown}, 1000);
                }
            }
        }
        ,
        computed: {
            noData() {
                return this.customerMeterReadingJournal.length <= 0;
            },
            displayCustomerName(customer) {
                return customer.name ? customer.name : customer.customerDoc && customer.customerDoc.khName
            }
        }
        ,
        // life cycle
        destroyed() {
            console.log('Destroyed here');
        }
    }
</script>

<style scope>
    .el-table .info-row {
        background: #f0f9eb;
    }

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

    .fz10 {
        font-size: 11px !important;
    }

    .select-width {
        width: 120px;
    }
</style>