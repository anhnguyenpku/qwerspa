<template>
    <div class="meterReadingJournal">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header card-header-icon" data-background-color="purple">
                    <i class="material-icons">assignment</i>
                </div>
                <div class="card-content">
                    <h4 class="card-title" style="font-family: 'Khmer OS Battambang'"><a
                            @click="dialogVisible = true"
                            class="cursor-pointer"><i
                            class="fa fa-plus"></i> សៀវភៅអានលេខ</a></h4>

                    <!--Meter Reading journal data list-->
                    <br>
                    <div style="display: flex;">
                        <div>
                            <el-date-picker
                                    v-model="dateRange"
                                    type="month"
                                    placeholder="Pick Date range">
                            </el-date-picker>
                        </div>
                        <div style="max-width: 300px; padding-left: 15px">
                            <el-input
                                    placeholder="Search Here..."
                                    suffix-icon="el-icon-search"
                                    v-model="searchMeterReading"
                            >
                            </el-input>
                        </div>
                    </div>


                    <el-col :span="24">
                        <br>
                        <el-table
                                v-loading="isLoading"
                                element-loading-text="កំពុងដំណើរការ..."
                                :data="meterReadingJournalData"
                                highlight-current-row
                                style="width: 100%">
                            <el-table-column
                                    type="index"
                                    min-width="140"
                                    max-width="140">
                            </el-table-column>
                            <el-table-column
                                    label="Name"
                                    min-width="150">
                                <template slot-scope="scope">
                                    <span v-show="!scope.row.edit"
                                          @click="handleEditName(scope.row)">{{scope.row.name}}</span>
                                    <span v-show="scope.row.edit">
                                        <el-input :ref="scope.row._id" v-model="scope.row.name"
                                                  @blur="handleEditNameChange(scope.row)"
                                                  @keyup.native.enter="handleEditNameChange(scope.row)"></el-input>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    :formatter="formatter"
                                    sortable
                                    property="date"
                                    label="Date"
                                    min-width="120">
                            </el-table-column>
                            <el-table-column label="Progress"
                                             min-width="110px"
                            >
                                <template slot-scope="scope">
                                    <el-progress :percentage="calcJournalProgress(scope.row)"
                                                 :status="isPostedFinish(scope.row)"></el-progress>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="សកម្មភាព"
                                    min-width="320px"
                            >
                                <template slot-scope="scope">
                                    <el-button type="info" size="small" @click.native="handlePrint(scope.row)"><i
                                            class="fa fa-print"></i></el-button>
                                    <el-button type="danger" size="small"
                                               @click.native="handleRemove(scope.$index, scope.row, meterReadingJournalData)">
                                        <i class="fa fa-trash-o"></i></el-button>
                                    <el-button @click.native="writeMeterJournal(scope.row)" type="success"
                                               size="mini"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    </el-button>
                                    <el-button @click.native="reReadingMeterJournal(scope.row)" type="warning"
                                               size="mini">
                                        <i class="fa fa-history" aria-hidden="true"></i>
                                    </el-button>
                                    <el-button @click.native="exportToExcel(scope.row)" type="primary"
                                               size="mini"><i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
                                    </el-button>
                                    <el-button @click.native="uploadWriteMeterJournal(scope.row)" type="success"
                                               size="mini"><i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
                                    </el-button>
                                    <el-button @click.native="lockJournalBook(scope.row)" type="warning"
                                               size="mini"><i
                                            :class="[scope.row.isLocked ? 'fa fa-lock': 'fa fa-unlock']"
                                            aria-hidden="true"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--End Reading journal data list-->
                        <!--Pagination-->
                                <!--Don't use el-table column here-->
                                <el-pagination
                                        width="100%"
                                        align="center"
                                        @size-change="handleSizeChange"
                                        @current-change="handleCurrentChange"
                                        :current-page.sync="currentPage1"
                                        :page-sizes="[10, 20, 30, 50,100]"
                                        :page-size="currentPageSize"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="countMeterReadingJournal">
                                </el-pagination>
                        <!--End Pagination-->
                    </el-col>
                    <br>
                </div>
            </div>
        </div>

        <!--Form Modal-->
        <el-dialog
                title="Add Journal Book"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-form :model="rulesForm" :rules="rules" ref="rulesForm" label-width="120px"
                     class="ruleForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Batch name" prop="name">
                            <el-input v-model="rulesForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="Meter Reading" prop="meterReadingId">
                            <el-select style="display: block !important;" filterable
                                       v-model="rulesForm.meterReadingId"
                                       placeholder="Meter Reading Query">
                                <el-option
                                        v-for="item in meterReadingData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="Date" prop="date" required>
                            <el-col>
                                <el-form-item>
                                    <el-date-picker type="date" placeholder="Pick a date"
                                                    v-model="rulesForm.date"
                                                    style="width: 100%;"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div style="width: 100%; float: right">
                <el-form-item class="pull-right" style="margin-left: -120px">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="genMeterReadingJournal">Confirm</el-button>
                </el-form-item>
                </div>
            </el-form>

        </el-dialog>
        <!--End Form modal-->

        <!--Upload Data Modal-->

        <!--End data modal-->
    </div>



</template>

<script>
    import {Wb_meterReadingJournal} from '/imports/collection/meterReadingJournal.js';
    import {Session} from 'meteor/session';
    import {FlowRouter} from 'meteor/kadira:flow-router';
    import XLSX from 'xlsx';
    import FileSaver from 'file-saver';

    export default {
        components: {},
        meteor: {
            data: {
                rolesArea() {
                    return Session.get('area')
                },
            },
        },
        data() {
            return {
                dateRange: moment().toDate(),
                currentPage2: 5,
                currentPage3: 5,
                currentPage4: 4,
                skip: 0,
                dialogVisible: false,
                msg: '',
                currentPage1: 1,
                selector: {rolesArea: Session.get('area')},
                searchMeterReading: '',
                currentPageSize: 10,
                isLoading: true,
                countMeterReadingJournal: 0,
                rulesForm: {
                    name: '',
                    date: null,
                    meterReadingId: ''
                },
                rules: {
                    name: [
                        {required: true, message: 'Please input batch name', trigger: 'blur'},
                    ],
                    date: [
                        {type: 'date', required: true, message: 'Please select date', trigger: 'change'},
                    ],
                    meterReadingId: [
                        {required: true, message: 'Please select Meter Query', trigger: 'change'},
                    ]
                },
                meterReadingJournal: {
                    meterReadingId: '',
                    name: '',
                    date: null
                },
                rolesArea: '',
                meterReadingData: [],
                meterReadingJournalData: [],

            }
        },
        watch: {
            dateRange(val) {
                this.fetchWBMeterReadingJournal();
                this.countMeterReadingJournalFn()
            },
            searchMeterReading(val) {
                let regex = new RegExp(val, 'i');
                if (!!val) {
                    this.selector.$or = [
                        {
                            meterReadingId: {$regex: val, $options: 'mi'}
                        },
                        {
                            name: {$regex: val, $options: 'mi'}
                        }
                    ]
                } else {
                    this.selector = {rolesArea: Session.get('area')}
                }
                this.isLoading = true;
                this.search();
            }
        },
        methods: {
            lockJournalBook(row) {
                Meteor.call('journalBook_toggleLock', row._id, {$set: {isLocked: !row.isLocked}}, (err, result) => {
                    if (!err) {
                        this.$message.success(row.name + ' is ' + (!row.isLocked ? 'locked' : 'unlocked'));
                        row.isLocked = !row.isLocked;
                    }
                });
            },
            exportToExcel(meterJournal) {
                debugger;
                Meteor.call('downloadMeterReadingJournal', meterJournal._id, meterJournal.date, (err, workbook) => {
                    if (!err) {
                        /* the saveAs call downloads a file on the local machine */
                        FileSaver.saveAs(new Blob([workbook], {type: "application/octet-stream"}), meterJournal.name + ".xlsx");
                    }
                })
            },
            handleEditNameChange(row) {
                row.edit = false;
                Meteor.call('updateMeterReadingJournalName', row._id, {$set: {name: row.name}});
            },
            handleEditName(row) {
                row.edit = true;
                let ref = this.$refs[row._id];
            },
            handleClose() {
                this.dialogVisible = false;
            },
            search: _.debounce(function () {
                this.fetchWBMeterReadingJournal();
                this.countMeterReadingJournalFn();
            }, 200),
            calcJournalProgress(row) {
                if (row.journalDetailCount) {
                    let journalDetailCount = 100 / row.journalDetailCount;
                    let journalPostedProgress = row.journalPostedCount * journalDetailCount;
                    if (journalPostedProgress > 100) {
                        return 100;
                    }
                    return Math.round(journalPostedProgress, 2);
                }
                return 0;
            },
            isPostedFinish(row) {
                if (row.journalPostedCount >= row.journalDetailCount) {
                    return 'success';
                }
                return '';
            },
            fetchWBMeterReadingJournal() {
                if (this.dateRange) {
                    let startOfMonth = moment(this.dateRange).startOf("months").toDate();
                    let endOfMonth = moment(this.dateRange).endOf("months").toDate();
                    this.selector.date = {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    };
                }
                Meteor.call('fetchWBMeterReadingJournal', this.selector, {
                    limit: this.currentPageSize,
                    skip: this.skip,
                }, (err, result) => {
                    if (!err) {
                        this.isLoading = false;
                        this.meterReadingJournalData = result.map((o) => {
                            o.edit = false;
                            o.isLocked = !!o.isLocked ? o.isLocked : false;
                            return o;
                        });
                    } else {
                        console.log(err.message);
                    }
                });
            },
            handleSizeChange(val) {
                this.currentPageSize = val
                this.isLoading = true;
                this.fetchWBMeterReadingJournal(this.skip, this.currentPageSize);
            },
            handleCurrentChange(val) {
                this.skip = (this.currentPageSize * val) - this.currentPageSize;
                this.isLoading = true
                this.fetchWBMeterReadingJournal(this.skip, this.currentPageSize);
            },
            handlePrint(row) { // handle print meter reading
                let q = `?mrjId=${row._id}`;
                let path = FlowRouter.path('wb.printMeterReadingJournal') + q;
                FlowRouter.go(path);
            },
            handleRemove(index, row, rows) { //handle remove meter reading
                this.$confirm(`តើអ្នកចង់លុប សៀវភៅអានលេខ  ${row.name}`, 'Confirmation', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                })
                    .then(() => {
                        this.removeMeterJournal(index, row, rows);
                    })
                    .catch(() => [
                        console.log('cancel')
                    ])
            },
            removeMeterJournal(index, row, rows) { //handle when modal close
                Meteor.call('removeMeterReadingJournal', {_id: row._id}, (err, result) => {
                    if (!err) {
                        rows.splice(index, 1);
                        this.$message({
                            duration: 2000,
                            message: `លុប ${row.name} បានជោគជ័យ`,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            duration: 3000,
                            message: `${err.message}`,
                            type: 'error'
                        });
                    }
                })
            },
            countMeterReadingJournalFn() {
                if (this.dateRange) {
                    let startOfMonth = moment(this.dateRange).startOf('months').toDate();
                    let endOfMonth = moment(this.dateRange).endOf('months').toDate();
                    this.selector.date = {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    };
                }
                Meteor.call("countMeterReadingJournal", this.selector, (err, result) => {
                    if (!err) {
                        this.countMeterReadingJournal = result;
                    } else {
                        this.countMeterReadingJournal = 0;
                    }
                });
            },
            closeModal() {
                $("#modal1").modal('close');
            },
            editMeterReadingJournal(value) {
                FlowRouter.go('wb.meterReadingJournalEdit', {id: value._id});
            },
            addNew() {
                $("#modal1").modal('open');
            },
            goToPrint() {
                FlowRouter.go('wb.printMeterReadingJournal');
            },
            genMeterReadingJournal() {
                this.$refs['rulesForm'].validate((valid) => {
                    if (valid) {
                        let currentSelectDate = this.rulesForm.date;
                        this.rulesForm.validateDate = this.rulesForm.date;
                        this.rulesForm.rolesArea = this.rolesArea;
                        Meteor.call('addNewMeterReadingJournal', {meterReadingJournal: this.rulesForm}, (err, res) => {
                            if (!err) {
                                this.$message({
                                    duration: 1000,
                                    message: `បង្កើតបានជោគជ័យ`,
                                    type: 'success'
                                });
                                this.dialogVisible = false;
                                let date = moment(this.rulesForm.date).format('YYYY-MM-DD');
                                let query = `?mrjId=${res}&mrId=${this.rulesForm.meterReadingId}&date=${date}`;
                                let path = FlowRouter.path('wb.meterReadingJournalNew') + query;
                                FlowRouter.go(path);
                            } else {
                                this.$message({
                                    duration: 2000,
                                    message: err.message,
                                    type: 'error'
                                })
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            generateQuery(mr, reReading = false) {
                let date = moment(mr.date).format('YYYY-MM-DD');
                let query = mr.readingStatus && !reReading ? `?id=${mr._id}` : `?mrjId=${mr._id}&mrId=${mr.meterReadingId}&date=${date}&${reReading ? 'rr=true' : 'rr=false'}`;
//                let query =  `?mrjId=${mr._id}&mrId=${mr.meterReadingId}&date=${date}`;
                let path = FlowRouter.path('wb.meterReadingJournalNew') + query;
                FlowRouter.go(path);
            },
            writeMeterJournal(mr) {
                // if (mr.isLocked) {
                //     this.$message.warning('This journal book is locked');
                //     return;
                // }
                Meteor.call('checkIfMeterReadingJournalNotExist', {meterReadingJournalId: mr._id}, (err, result) => {
                    if (!err) {
                        if (result.notExist) {
                            let journal = result.meterReadingJournal;
                            this.$confirm(`Journal ID: ${journal.name} is no reading data. go to create it?`, 'Confirmation', {
                                confirmButtonText: 'OK',
                                cancelButtonText: 'Cancel',
                                type: 'warning'
                            })
                                .then(() => {
                                    this.generateQuery(journal);
                                })
                                .catch(() => [
                                    console.log('cancel')
                                ])
                        } else {
                            FlowRouter.go('/wb-data/meterWritingJournal/' + mr._id + `?date=${moment(mr.date).format('YYYY-MM-DD')}`);
                        }
                    } else {
                        console.log(err.message);
                    }
                });

            },
            downloadWriteMeterJournal(mr) {
                alertify.success("Download completed!")
            },
            uploadWriteMeterJournal(mr) {
                FlowRouter.go('/wb-data/uploadMeterWritingJournal/' + mr._id + `?date=${moment(mr.date).format('YYYY-MM-DD')}`);
            },
            reReadingMeterJournal(mr) {
                console.log('re read')
                this.$confirm(`Re-Reading Journal ID: ${mr.name} ? `, 'Confirmation', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                })
                    .then(() => {
                        this.generateQuery(mr, true); // params 2 for re reading journal flag default false
                    })
                    .catch(() => [
                        console.log('cancel')
                    ])
            },
            formatter(row, column) {
                return moment(row.date).format('DD/MM/YYYY');
            }
        }
        ,
        computed: {
            titleRemove(row) { // set remove title
                return `លុប ${row.name}`
            }
            ,
            readingStatus(mr) {
            }
        }
        ,
        created() {
            let vm = this;
            this.fetchWBMeterReadingJournal();
            Meteor.call('fetchMeterReading', Session.get('area'), function (err, result) {
                if (!err) {
                    vm.meterReadingData = result;
                } else {
                    console.log(err.message);
                }
            });
        }
        ,
        mounted() {
            let vm = this;
            this.meterReadingJournalData = [];
            this.countMeterReadingJournalFn();
            $('.modal').modal({
                complete: function () {
                    vm.meterReadingJournal = {
                        meterReadingId: '',
                        name: '',
                        date: null
                    };
                }
            });
        }
        ,
    }
    ;

</script>
<style scope>

</style>