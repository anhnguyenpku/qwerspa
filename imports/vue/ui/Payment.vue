<template>
    <div class="receive-payment">
        <div class="card barcode-detected">
            <div class="card-header card-header-icon" data-background-color="rose">
                <i class="material-icons">attach_money</i>
            </div>
            <div class="card-content">
                <h4 class="card-title" style="font-family: 'Khmer OS Battambang'"><b>ទទួលប្រាក់</b></h4>
                <div style="background: white" labelPosition="top" :inline="true"
                     class="demo-form-inline">
                    <br>
                    <div class="payment-hide-low-1365" style="width: 100%">
                        <el-row style="color:darkblue;">
                            <el-col style="width: 30%" align="right">
                                <img style="width: 150px;height: 150px" src="/images/wb.jpg" alt="MIH Logo">
                            </el-col>
                            <el-col :span="1"></el-col>
                            <el-col style="width: 70%;max-width: 550px" align="left">
                                <h1 style="font-family: 'Khmer OS Muol';text-align: center">
                                    អង្គភាពរដ្ឋាករទឹកបាត់ដំបង</h1>
                                <h1 style="font-family: 'Khmer OS Muol';text-align: center">Battambang Water Supply</h1>
                            </el-col>
                        </el-row>
                    </div>

                    <div class="payment-hide-low-767 payment-hide-high-1366" style="width: 100%">
                        <el-row style="color:darkblue;">
                            <el-col style="width: 30%" align="right">
                                <img style="width: 120px;height: 120px" src="/images/wb.jpg" alt="MIH Logo">
                            </el-col>
                            <el-col :span="1"></el-col>
                            <el-col style="width: 70%;max-width: 550px" align="left">
                                <h2 style="font-family: 'Khmer OS Muol';text-align: center">
                                    អង្គភាពរដ្ឋាករទឹកបាត់ដំបង</h2>
                                <h2 style="font-family: 'Khmer OS Muol';text-align: center">Battambang Water Supply</h2>
                            </el-col>
                        </el-row>
                    </div>
                    <br>
                    <div style="width: 100%">
                        <!--show payment 1025 up-->
                        <div class="payment-hide-low-1365">
                            <div style="width: 40%; float: right;display: flex;margin-top: 10px;margin-bottom: 10px; font-size: 15px">
                                <div style="width: 50%; float: left; display: block; text-align: center">
                                    <span style="color: #93939E; font-size: 18px; padding-bottom: 15px">ទឹកប្រាក់ដកក្នុងគណនី</span><br>
                                    <span style="font-weight: 600; font-size: 23px"><b>៛ {{withdrawAmount}}</b></span>
                                </div>
                                <div style="width: 50%; float: right; display: block; text-align: center">
                                    <span style="color: #93939E; font-size: 18px; padding-bottom: 15px">ទឹកប្រាក់បានទទួល</span><br>
                                    <span style="font-weight: 600; font-size: 23px"><b>៛ {{paidAmount}}</b></span>
                                </div>
                            </div>
                        </div>
                        <!--show payment 767 to 1024-->
                        <div class="payment-hide-low-767 payment-hide-high-1366">
                            <div style="width: 40%; float: right;display: flex;margin-top: 10px;margin-bottom: 10px; font-size: 15px">
                                <div style="width: 50%; float: left; display: block; text-align: center">
                                    <span style="color: #93939E; font-size: 12px; padding-bottom: 15px">ទឹកប្រាក់ដកក្នុងគណនី</span><br>
                                    <span style="font-weight: 600; font-size: 18px"><b>៛ {{withdrawAmount}}</b></span>
                                </div>
                                <div style="width: 50%; float: right; display: block; text-align: center">
                                    <span style="color: #93939E; font-size: 12px; padding-bottom: 15px">ទឹកប្រាក់បានទទួល</span><br>
                                    <span style="font-weight: 600; font-size: 18px"><b>៛ {{paidAmount}}</b></span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex">
                            <i class="fa fa-user-circle" style="width: 50px;
                                    height: 36px;
                                    font-size: 32px;
                                    color: darkslategrey;"></i>
                            <el-autocomplete style="max-width: 400px; width: 100%" class="inline-input"
                                             v-model="customerId"
                                             :fetch-suggestions="queryCustomerSearch"
                                             placeholder="Search Customer" :trigger-on-focus="false"
                                             @select="handleSelectCustomer"
                            ></el-autocomplete>
                        </div>
                        <div style="width: 100%">
                            <div style="display: flex; padding-top: 15px; padding-bottom: 5px">
                                <div style="display: flex">
                                    <i class="fa fa-barcode" style="width: 50px;
                                    height: 36px;
                                    font-size: 32px;
                                    color: darkslategrey;"></i>
                                    <el-autocomplete class="inline-input" v-model="barcode"
                                                     v-loading="autoCompleteLoading"
                                                     :fetch-suggestions="querySearch" placeholder="Barcode"
                                                     :trigger-on-focus="false" @select="handleSelect"
                                                     @keyup.native.13="getMeterJournalByBarcode(null)"
                                                     autofocus></el-autocomplete>
                                </div>
                                <div class="payment-hide-low-1023" style="padding-left: 10px">
                                    <el-date-picker disabled v-model="date" type="date" placeholder="Pick a day">
                                    </el-date-picker>
                                </div>
                            </div>
                            <div class="payment-hide-high-768" style="margin-top: 10px;margin-bottom: 5px">
                                <div>
                                    <span style="min-width: 200px"><h5>ទឹកប្រាក់ដកក្នុងគណនី <b>៛ {{withdrawAmount}}</b></h5></span>
                                </div>
                                <div>
                                    <span style="min-width: 200px"><h5>ទឹកប្រាក់បានទទួល <b>៛ {{paidAmount}}</b></h5></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="payment-hide-high-1024" style="padding-top: 5px">
                        <div style="display: flex; margin-bottom: 15px;">
                            <el-button size="large"
                                       style="max-width: 100px; width: 25%; font-size: 14px; padding: 5px 10px;"
                                       type="info" @click="toggleSelection(meterJournal)">
                                <i class="fa fa-check-square"></i>
                                All
                            </el-button>
                            <el-button size="large"
                                       style="max-width: 100px; width: 25%; font-size: 14px; padding: 5px 10px;"
                                       type="warning" @click="toggleSelection()">
                                <i class="fa fa-eraser"></i>
                            </el-button>
                            <el-button size="large"
                                       style="max-width: 100px; width: 25%; font-size: 14px; padding: 5px 10px;"
                                       type="danger" :disabled="hasSelection"
                                       @click.native="deleteSelected()">
                                <i class="fa fa-trash-o"></i>
                            </el-button>
                            <el-button size="large"
                                       style="max-width: 100px; width: 25%; font-size: 14px; padding: 5px 10px;"
                                       type="success" :disabled="hasSelection"
                                       @click.native="savePayment($event)">
                                <i class="fa fa-hdd-o"></i>({{countInvoices}})
                            </el-button>
                        </div>
                    </div>
                    <div class="payment-hide-low-1023" style="padding-top: 10px">
                        <div style="display: flex; margin-bottom: 15px;">
                            <el-button size="large"
                                       style="max-width: 180px; width: 25%; font-size: 14px; padding: 10px 15px;"
                                       type="info" @click="toggleSelection(meterJournal)">
                                <i class="fa fa-check-square"></i>
                                <b>ជ្រើសទាំងអស់</b>
                            </el-button>
                            <el-button size="large"
                                       style="max-width: 180px; width: 25%; font-size: 14px; padding: 10px 15px;"
                                       type="warning" @click="toggleSelection()">
                                <i class="fa fa-eraser"></i>
                                <b>លុបការជ្រើស</b>
                            </el-button>
                            <el-button size="large"
                                       style="max-width: 180px; width: 25%; font-size: 14px; padding: 10px 15px;"
                                       type="danger" :disabled="hasSelection"
                                       @click.native="deleteSelected()">
                                <i class="fa fa-trash-o"></i>
                                <b>លុបវិក្កយបត្រ</b>
                            </el-button>
                            <el-button size="large"
                                       style="max-width: 180px; width: 25%; font-size: 14px; padding: 10px 15px;"
                                       type="success" :disabled="hasSelection"
                                       @click.native="savePayment($event)">
                                <i class="fa fa-hdd-o"></i>({{countInvoices}})
                                <b>ទទួលប្រាក់</b>
                            </el-button>
                        </div>
                    </div>
                    <el-row>
                        <el-table ref="multipleTable" :data="meterJournal" border style="width: 100% !important;"
                                  @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column
                                    label="លេខ"
                                    type="index"
                                    width="80">
                            </el-table-column>
                            <el-table-column label="ថ្ងៃ ខែ ឆ្នាំ" min-width="150" max-width="250">
                                <template slot-scope="scope">
                                    {{invoiceDate(scope.row.newReadingDate)}}
                                    <el-tooltip class="item" effect="dark" content="Expired" placement="top">
                                        <span class="cursor-pointer expired-badge">{{expiredInDays(scope.row)}}</span>
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                            <el-table-column property="streetNo" label="លេខប្លុក" min-width="100" max-width="200">
                            </el-table-column>
                            <el-table-column property="address" label="អាស័យដ្ឋាន" min-width="120" max-width="200">
                            </el-table-column>
                            <el-table-column property="customer" label="ឈ្មោះអតិថិជន"
                                             min-width="120" max-width="220">
                            </el-table-column>
                            <el-table-column label="កំណត់បង្ហាញ"
                                             min-width="120" max-width="200">
                                <template slot-scope="scope">
                                    <small style="font-size: 12px;">{{statusCuttingWater(scope.row)}}
                                    </small>
                                </template>
                            </el-table-column>
                            <el-table-column label="គណនី"
                                             min-width="100" max-width="200" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <h5 class="fz15">
                                        <a class="cursor-pointer"
                                           @click="handleLinkToSavingBalance(scope.row)">{{numFormatter(scope.row.savingBalance)}}</a>
                                    </h5>
                                </template>
                            </el-table-column>
                            <el-table-column label="ដកគណនី"
                                             min-width="150" max-width="250" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <div style="width: 100%; padding-right: 23px">
                                        <el-input @blur="handleSavingChange(scope.row)"
                                                  @keyup.native.enter="handleSavingChange(scope.row)"
                                                  v-model.number="scope.row.withdrawSaving"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="ទឹកប្រាក់"
                                             min-width="100" max-width="200" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <h5 class="fz15">{{numFormatter(scope.row.dueAmount)}}</h5>
                                </template>
                            </el-table-column>
                            <el-table-column label="ទទួលបង់"
                                             fixed="right"
                                             min-width="150" max-width="250">
                                <template slot-scope="scope">
                                    <div style="width: 100%; padding-right: 18px">
                                        <el-input @blur="tmpSave(scope.row)"
                                                  @keyup.native.enter="tmpSave(scope.row)"
                                                  v-model.number="scope.row.paidAmount"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <!--<el-table-column label="Fee" show-overflow-tooltip fit>
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.feeAmount"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="Penalty" show-overflow-tooltip fit>
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.penaltyAmount"></el-input>
                                </template>
                            </el-table-column>-->
                        </el-table>
                    </el-row>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {InputMask} from '../../api/mixins/input-mask';
    import {Mongo} from 'meteor/mongo';
    import numeral from 'numeral';
    // import

    NullCollection = new Mongo.Collection(null);
    import {unfinishedPayment} from '../../collection/unfinshed-work';
    import {CheckRoles} from "../../api/methods/checkRoles";
    //    import ElColorAlphaSlider from "../../../node_modules/element-ui/packages/color-picker/src/components/alpha-slider.vue";
    //    import ElCol from "element-ui/packages/col/src/col";

    export default {
//        components: {
//            ElCol,
//            ElColorAlphaSlider},
        mixins: [InputMask],
        meteor: {
            meterJournal() {
                return NullCollection.find({}).fetch();
            },
            userId() {
                return Meteor.userId();
            }
        },
        data() {
            return {
                keyCode: [],
                roleOptions: [
                    {
                        label: 'Payment', value: 'payment'
                    },
                    {
                        label: 'Creditor', value: 'creditor'
                    }
                ],
                agentId: '',
                isFetching: false,
                customerAutoCompleteLoading: false,
                barcodeAutoComplete: [],
                customerAutoComplete: [],
                unfinishedPayments: [],
                autoCompleteLoading: false,
                customerId: null,
                rolesArea: Session.get('area'),
                barcode: '',
                date: moment().toDate(),
                meterJournal: [],
                multipleSelection: [],
                options4: [],
                value9: [],
                list: [],
                loading: false,
                description: '',
                agentOptions: [],
                timeStamp: [],
                takeBarcode: ''

            }
        },

        created() {
            NullCollection.remove({});
            Meteor.call('fetchUnfinishedPayment', {
                createdBy: Meteor.userId(),
                rolesArea: this.rolesArea
            }, (err, result) => {
                if (!err) {
                    this.unfinishedPayments = result;
                }
            });
            Meteor.call('fetchGeneralAgentData', {rolesArea: this.rolesArea}, (err, result) => {
                if (result) {
                    this.agentOptions = result;
                }
            });
        },

        mounted() {
            /*    this.list = this.states.map(item => {
             return {value: item, label: item};
             });*/
            setTimeout(() => {
                if (this.unfinishedPayments.length > 0) {
                    this.restoreCurrentWork();
                }
            }, 300);
            let vm = this;
            let elem = this.$jQuery('div.receive-payment');

            let checkEvent = $._data($('body').get(0), 'events');

            if (checkEvent.keyup.length <= 1) {
                this.$nextTick(() => {
                    this.$jQuery('body').on('keyup', elem, this.barcodeScan);
                })
            }

        },
        computed: {
            hasSelection() {
                return !this.multipleSelection.length > 0;
            },
            total() {
                let total = 0;
                this.multipleSelection.forEach(function (doc) {
                    total += parseFloat(doc.dueAmount);
                });
                return numeral(total).format('0,0.00');
            },
            paidAmount() {
                let paidAmount = 0;
                this.multipleSelection.forEach(function (doc) {
                    paidAmount += parseFloat(doc.paidAmount);

                });
                return numeral(paidAmount).format('0,0.00');
            },
            withdrawAmount() {
                let withdrawAmount = 0;
                this.multipleSelection.forEach(function (doc) {
                    withdrawAmount += parseFloat(doc.withdrawSaving);
                });
                return numeral(withdrawAmount).format('0,0.00');
            },
            countInvoices() {
                return this.multipleSelection.length;
            }
        },
        methods: {
            statusCuttingWater(row) {
                if (row.requestCuttingWaterDoc) {
                    return !!row.requestCuttingWaterDoc.closedAt ? 'ទឹកត្រូវបានបិទ' : '';
                }
            },
            invoiceDate(date) {
                return moment(date).format('MMM DD, YYYY');
            },
            expiredInDays(row) {
                return row.expiredInDays || 0;
            },
            barcodeScan(e) {
                if (FlowRouter.current().path === "/wb-debt/payment/new") {
                    let scannerSensitivity = 100;
                    if (e.keyCode !== 13 && !isNaN(e.key)) {
                        this.takeBarcode += e.key;
                    }
                    this.timeStamp.push(Date.now());
                    if (e.which === 32 && e.ctrlKey) {
                        if (this.multipleSelection.length > 0) {
                            this.toggleSelection();
                        } else {
                            this.toggleSelection(this.meterJournal);
                        }
                    }
                    if (this.timeStamp.length > 1) {
                        if (this.timeStamp[1] - this.timeStamp[0] >= scannerSensitivity) {
                            this.takeBarcode = '';
                            this.timeStamp = [];
                        } else {
                            if (e.keyCode === 13) {
                                this.getMeterJournalByBarcode(this.takeBarcode);
                                this.timeStamp = [];
                                this.takeBarcode = ''
                            }
                        }
                    }
                }
            },
            onBarcodeScanned(barcode) {
                this.getMeterJournalByBarcode(barcode);
            },
            handleSelectCustomer(val) {
                this.getMeterJournalByBarcode(val.customerId);
            },
            invoiceFormatNum(val) {
                let invoiceNumber = val && val.split('-');
                return invoiceNumber[1];
            },
            numFormatter(val) {
                return numeral(val).format('0,0.00');
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.options4 = this.list.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options4 = [];
                }
            },
            deleteSelected() {
                this.$confirm('ប្រាកដថាលុប?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach(function (doc) {
                        NullCollection.remove({_id: doc._id});
                        //also remove tmp save
                        unfinishedPayment.remove({_id: doc._id});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'ច្រានចោលការលុប'
                    });
                });

            },
            deleteSelectedWithoutConfirm() {
                this.multipleSelection.forEach(function (doc) {
                    NullCollection.remove({_id: doc._id});
                    //also remove tmp save
                    unfinishedPayment.remove({_id: doc._id});
                });
            },
            lookupJournalDetailWithQueryString(queryString) {
                Meteor.call('barcodeQueryString', queryString, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.barcodeAutoComplete = result;
                    } else {
                        console.log(err.message);
                    }
                    this.autoCompleteLoading = false;
                });
            },
            lookupCustomerWithQueryString(queryString) {
                Meteor.call('queryCustomerAutoComplete', {
                    q: queryString,
                    options: {limit: 30, skip: 0},
                    rolesArea: Session.get('area')
                }, (err, result) => {
                    if (!err) {
                        this.customerAutoComplete = result && result.content;
                    }
                    this.customerAutoCompleteLoading = false;

                })
            },
            //autocomplete query
            querySearch(queryString, cb) {
                this.autoCompleteLoading = true;
                setTimeout(() => {

                    this.lookupJournalDetailWithQueryString(queryString);
                    cb(this.barcodeAutoComplete);
                }, 500);
            },
            queryCustomerSearch(queryString, cb) {
                this.customerAutoCompleteLoading = true;
                setTimeout(() => {
                    this.lookupCustomerWithQueryString(queryString);
                    cb(this.customerAutoComplete);
                }, 500)

            },

            //handle autocomplete select
            handleSelect(val) {
                this.getMeterJournalByBarcode();
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }
                else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleLinkToSavingBalance(row) {
                FlowRouter.go('/wb-setting/customer/' + row.customerId + '/detail?activeName=savingAccount');
            },
            savePayment(event) {
                event.preventDefault();
                if (this.multipleSelection.length > 0) {
                    let vm = this;
                    let rolesArea = Session.get('area');
                    let userId = Meteor.userId();
                    let payments = {
                        agentId: vm.agentId,
                        rolesArea: rolesArea,
                        userId: userId,
                        description: vm.description,
                        date: vm.date,
                        meterJournal: this.multipleSelection,
                        createdBy: userId
                    };
                    Meteor.call('savePayment', payments, function (er, re) {
                        if (re) {
                            vm.$message({
                                duration: 1000,
                                message: `Paid Successfully!`,
                                type: 'success'
                            });
                            //remove paid posted
                            vm.deleteSelectedWithoutConfirm();
                        }
                        if (er) {
//                            vm.$message({
//                                duration: 1000,
//                                message: er.message,
//                                type: 'error'
//                            });
                            console.log(er.message);
                        }

                    });
                }
            },
            getMeterJournalByBarcode(val) {

                let vm = this;
                this.isFetching = true;
                let barcode = val || vm.barcode; //if not customer Id will check barcode instead
                if (!!barcode) {
                    let existMeterJournal = NullCollection.findOne({barcode: barcode});
                    if (existMeterJournal) {
                        vm.$message({
                            duration: 3000,
                            message: `Invoice is already added.`,
                            type: 'warning'
                        });
                        vm.barcode = "";
                        let s = new buzz.sound('/iphone_sms_original.mp3');
                        s.play();
                        return;
                    }
                    Meteor.call('getMeterJournalByBarcode', barcode, function (error, meterJournals) {
                        if (error) {
                            vm.$message({
                                duration: 5000,
                                message: error.message,
                                type: 'error',
                                showClose: true
                            });
                            let s = new buzz.sound('/the-calling.mp3');
                            s.play();
                        }
                        if (meterJournals.length > 0) {
                            let expiredState;
                            meterJournals.forEach((meterJournal) => {
                                if (meterJournal.written && meterJournal.balance && meterJournal.balance != 0) {
                                    if (meterJournal.waterConsumption != 0) {
                                        let dueAmount = meterJournal.balance ? meterJournal.balance : meterJournal.grandTotal;
                                        //added 25 dayse
                                        let add25days = moment(meterJournal.newReadingDate).startOf('days').add(25, 'days').format('YYYY-MM-DD');
                                        let today = moment().startOf('days');
                                        meterJournal = {
                                            newReadingDate: meterJournal.newReadingDate,
                                            customerId: meterJournal.customerId,
                                            meterJournalId: meterJournal._id,
                                            requestCuttingWaterDoc: meterJournal.requestCuttingWaterDoc, //added request cutting water doc
                                            customer: meterJournal.customerDoc.khName,
                                            address: meterJournal.customerDoc.address,
                                            withdrawSaving: 0,
                                            dueAmount: dueAmount,
                                            // feeAmount:meterJournal.tariffDoc && meterJournal.tariffDoc.feeAmount || 0,
                                            // penaltyAmount:meterJournal.tariffDoc && meterJournal.tariffDoc.penaltyAmount || 0,
                                            savingBalance: meterJournal.savingDoc && meterJournal.savingDoc.balance || 0,
                                            paidAmount: dueAmount,
                                            createdBy: Meteor.userId(),
                                            barcode: meterJournal.barcode,
                                            streetNo: meterJournal.streetNo
                                        };
                                        let exist = NullCollection.findOne({barcode: meterJournal.barcode});
                                        //check whether invoice is expired
                                        let expired = moment(today).isAfter(add25days);
                                        //check if user is a creditor
                                        let isCreditor = CheckRoles({roles: ['creditor']});
                                        if (expired && isCreditor || isCreditor) {
                                            meterJournal.type = expired ? 'expired' : 'normal';
                                            meterJournal.expiredInDays = expired ? moment(today).diff(add25days, 'days') : 0;
                                            if (!exist) {
                                                NullCollection.insert(meterJournal, function (err, id) {
                                                    meterJournal._id = id;
                                                    meterJournal.rolesArea = vm.rolesArea;
                                                    unfinishedPayment.insert(meterJournal);
                                                });
                                            }
                                        } else {
                                            //inform payment receiver which is invoice is expired.
                                            if (expired && !isCreditor) {
                                                expiredState = true;
                                                vm.$message({
                                                    duration: 3000,
                                                    message: `វិក័យប័ត្រលេខ  ${meterJournal.barcode} ផុតកំណត់`,
                                                    type: 'warning'
                                                });
                                                let s = new buzz.sound('/soft-bells.mp3');
                                                s.play();
                                            }
                                            if (!expired && !exist && !isCreditor && !expiredState) {
                                                meterJournal.type = 'normal';
                                                NullCollection.insert(meterJournal, function (err, id) {
                                                    meterJournal._id = id;
                                                    meterJournal.rolesArea = vm.rolesArea;
                                                    unfinishedPayment.insert(meterJournal);
                                                });
                                            }
                                        }

                                    } else if (meterJournal.barcode == barcode || meterJournal.sumBarcode === barcode) {
                                        vm.$message({
                                            duration: 3000,
                                            message: `តម្លៃការប្រើប្រាស់ទឹក​ស្មើ ០ មិនចាំបាច់ត្រូវការបង់ប្រាក់.`,
                                            type: 'warning'
                                        });
                                        let s = new buzz.sound('/thin.mp3');
                                        s.play();
                                    }
                                } else {
                                    vm.isFetching = false;
                                    if (!meterJournal.written) {
                                        vm.$message({
                                            duration: 3000,
                                            message: `Invoice not yet posted :(`,
                                            type: 'warning'
                                        });
                                        let s = new buzz.sound('/arpeggio.mp3');
                                        s.play();

                                    } else if (meterJournal.barcode === barcode || meterJournal.sumBarcode === barcode) {
                                        vm.$message({
                                            duration: 3000,
                                            message: `Invoice is already paid.`,
                                            type: 'warning'
                                        });
                                        let s = new buzz.sound('/arpeggio.mp3');
                                        s.play();
                                    }

                                }
                            });

                        } else {
                            vm.$message({
                                duration: 3000,
                                message: `Can't find Invoice or Customer ID: "${barcode}".`,
                                type: 'warning'
                            });
                            let s = new buzz.sound('/good-news.mp3');
                            s.play();
                        }
                        vm.isFetching = false;
                    });
                    vm.barcode = "";

                }
                $("html, body").animate({scrollTop: $(document).height()}, 1000);
            },
            tmpSave(row) {
                let paidAmount = 0;
                if (!!row.paidAmount && row.paidAmount > row.dueAmount) {
                    paidAmount = row.dueAmount - row.withdrawSaving;
                } else if (!!row.paidAmount && (row.withdrawSaving + row.paidAmount) > row.dueAmount) {
                    paidAmount = row.dueAmount - row.withdrawSaving;
                }
                else {
                    paidAmount = row.paidAmount == 0 ? 0 : row.paidAmount;
                }
                row.paidAmount = paidAmount;
                NullCollection.update({_id: row._id}, {$set: {paidAmount: paidAmount}});
                //store tmp in unfinishedPayment
                unfinishedPayment.update({_id: row._id}, {$set: {paidAmount: paidAmount}});
            },
            handleSavingChange(row) {
                if (row.withdrawSaving > row.savingBalance) {
                    this.$message({
                        duration: 4000,
                        message: `Saving balance is not enough. Current Balance = ${numeral(row.savingBalance).format('0,0.00')}`,
                        type: 'warning'
                    });
                    row.withdrawSaving = 0;
                } else {
                    row.withdrawSaving = row.withdrawSaving > row.dueAmount ? row.dueAmount : row.withdrawSaving
                    NullCollection.update({_id: row._id}, {
                        $set: {
                            withdrawSaving: row.withdrawSaving > row.dueAmount ? row.dueAmount : row.withdrawSaving,
                            paidAmount: row.withdrawSaving > row.dueAmount ? row.dueAmount : row.dueAmount - row.withdrawSaving
                        }

                    });
                    //store tmp in unfinishedPayment
                    unfinishedPayment.update({_id: row._id}, {
                        $set: {
                            withdrawSaving: row.withdrawSaving,
                            paidAmount: row.dueAmount - row.withdrawSaving
                        }
                    });
                }
            },
            //restore current work
            restoreCurrentWork() {
                this.$confirm('Restore your current work. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    closeOnClickModal: false,
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.unfinishedPayments.forEach(function (doc) {
                        NullCollection.insert(doc)
                    });
                    this.$message({
                        type: 'success',
                        message: 'Restore completed'
                    });
                }).catch(() => {
                    let selector = {rolesArea: this.rolesArea, createdBy: Meteor.userId()};
                    Meteor.call('removeCurrentWorkPayment', {selector}, (err, result) => {
                        if (!err) {
                            this.$message({
                                type: 'info',
                                message: 'Current works has been canceled'
                            });
                        }
                    });
                });
            }
        }

    }
</script>

<style scope>
    .expired-badge {
        padding: 3px;
        background: red;
        color: white;
    }

    .fz15 {
        font-size: 15px;
    }
</style>
