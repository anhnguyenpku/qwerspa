<template>
    <div class="pos_receivePayment">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer"
                           @click="popupPosReceivePaymentAdd(),dialogAddPosReceivePayment= true,resetForm()"
                        >
                            <i class="fa fa-plus"></i> {{langConfig['receivePayment']}}
                        </a>
                    </h4>
                </el-col>
                <el-col :span="16" style="text-align: right; margin-right: 10px">
                    <br>
                    <el-row type="flex" justify="center">
                        <el-col :span="8"></el-col>
                        <el-col :span="8"></el-col>
                        <el-col :span="8">
                            <el-input
                                    :placeholder="langConfig['searchHere']"
                                    suffix-icon="el-icon-search"
                                    v-model="searchData"
                            >
                            </el-input>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <hr>
            <br>
            <slot v-if="loading">
                <div class="row">
                    <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                    </div>
                </div>
            </slot>
            <slot v-else>
                <el-table
                        :data="posReceivePaymentDataDisplay"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="receivePaymentDateName"
                            :label="langConfig['receiveDate']"
                            sortable
                            width="180">
                    </el-table-column>

                    <el-table-column
                            prop="customerDoc.name"
                            :label="langConfig['customer']">
                    </el-table-column>

                    <el-table-column
                            prop="totalAmount"
                            :label="langConfig['amount']">
                    </el-table-column>

                    <el-table-column
                            prop="totalDiscount"
                            :label="langConfig['discount']">
                    </el-table-column>
                    <el-table-column
                            prop="totalPaid"
                            :label="langConfig['totalPaid']">
                    </el-table-column>
                    <el-table-column
                            prop="note"
                            :label="langConfig['note']">
                    </el-table-column>
                    <el-table-column
                            prop="invoiceId"
                            :label="langConfig['status']"
                            width="150"
                            filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.invoiceId != undefined ? 'success' : scope.row.saleOrderId != undefined ? 'warning' : 'primary'"
                                    close-transition>{{scope.row.invoiceId!=undefined ? "Invoice" :
                                scope.row.saleOrderId!=undefined ? "Sale Order" : "Receive Payment"}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['action']"
                            width="120"
                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removePosReceivePayment(scope.$index,scope.row,posReceivePaymentDataDisplay)"
                                           :disabled="disabledRemove"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                           @click=""
                                           disabled></el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>

                </el-table>
                <!--Pagination-->
                <br>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24" style="text-align: center;">
                        <div class="block">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="currentPage" :page-sizes="[10,20, 50, 100,200]"
                                           :page-size="currentSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="count">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <br>
            </slot>
            <!--End Pagination-->
        </div>


        <!--Form Modal-->
        <el-dialog
                :title="langConfig['add']"
                :visible.sync="dialogAddPosReceivePayment"
                :fullscreen="fullScreen"

        >
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="posReceivePaymentForm" :rules="rules" ref="posReceivePaymentFormAdd" label-width="120px"
                     :label-position="labelPosition"
                     class="posReceivePaymentForm">
                <el-row :gutter="20">
                    <el-col :span="18" class="posReceivePaymentForm">
                        <table class="table table-responsive​​​ table-striped table-hover responstable">
                            <thead>
                            <tr>
                                <th colspan="5">
                                    <el-input :placeholder="langConfig['searchByInvoice']" v-model="searchByInvoice"
                                              @keyup.native.enter="searchInvoice()">
                                        <template slot="prepend">{{langConfig['invoice']}}:</template>
                                        <el-button slot="append" icon="el-icon-search"
                                                   @click.native="searchInvoice()"></el-button>
                                    </el-input>
                                </th>
                                <th colspan="2">
                                    <el-date-picker
                                            v-model="searchByDate"
                                            type="daterange"
                                            align="right"
                                            placeholder="Pick a range"
                                            :picker-options="pickerDateOptions"
                                    >
                                    </el-date-picker>
                                </th>
                                <th style="text-align: right; vertical-align: middle;" colspan="2">
                                    <el-checkbox v-model="isOverDue"
                                                 :label="langConfig['overdueStatusOnly']"></el-checkbox>
                                </th>
                            </tr>
                            </thead>
                            <thead>
                            <tr>
                                <th>{{langConfig['no']}}</th>

                                <th>{{langConfig['invoiceNo']}}</th>
                                <th>{{langConfig['dueDate']}}</th>
                                <th style="vertical-align: middle; min-width: 120px !important;">
                                    <el-checkbox v-model="posReceivePaymentForm.isAllTerm"></el-checkbox>
                                    {{langConfig['applyTerm']}}
                                </th>
                                <th>{{langConfig['amount']}}</th>
                                <th>{{langConfig['discount']}}</th>
                                <th>{{langConfig['netAmount']}}</th>
                                <th style="color: #e91e63 !important;">{{langConfig['paid']}}</th>
                                <th style="vertical-align: middle;">
                                    <el-checkbox v-model="posReceivePaymentForm.isPaidAll"></el-checkbox>
                                </th>
                            </tr>
                            </thead>
                            <draggable v-model="posReceivePaymentData" :element="'tbody'">
                                <tr v-for="(posReceivePaymentDoc,index ) in this.posReceivePaymentData" :key="index">
                                    <template v-if="posReceivePaymentDoc.isShow">
                                        <td style="vertical-align: middle">
                                            {{index +1}}
                                        </td>
                                        <td style="vertical-align: middle">
                                            #{{posReceivePaymentDoc.invoiceNo |
                                            subStringVoucher}}({{posReceivePaymentDoc.invoiceDate |
                                            momentFormat}})
                                        </td>
                                        <td style="vertical-align: middle">
                                            <el-badge :value=posReceivePaymentDoc.dayOverDue :max="99" class="item">
                                                {{posReceivePaymentDoc.dueDate |
                                                momentFormat}}
                                            </el-badge>
                                        </td>
                                        <td style="vertical-align: middle">
                                            <el-switch
                                                    v-model="posReceivePaymentDoc.isApplyTerm"
                                                    active-color="#13ce66"
                                                    inactive-color="#ff4949"
                                                    @change="updatePosReceivePaymentDetail(posReceivePaymentDoc, index)"
                                            >
                                            </el-switch>
                                        </td>
                                        <td>
                                            <el-input placeholder="Amount" disabled=""
                                                      v-model.number=posReceivePaymentDoc.amount
                                            ></el-input>
                                            <input type="hidden" v-model="posReceivePaymentDoc.rawAmount"/>

                                        </td>

                                        <td>
                                            <el-input placeholder="Discount" disabled
                                                      v-model.number="posReceivePaymentDoc.discount"></el-input>
                                        </td>
                                        <td>
                                            <el-input placeholder="Net Amount"
                                                      v-model.number=posReceivePaymentDoc.netAmount
                                                      disabled>
                                                <template slot="append">{{currencySymbol}}</template>
                                            </el-input>
                                        </td>
                                        <td>
                                            <el-input placeholder="Paid" v-model.number="posReceivePaymentDoc.paid"
                                                      type='number'
                                                      @keyup.native="updatePosReceivePaymentDetailPaid(posReceivePaymentDoc, index)"
                                                      @change="updatePosReceivePaymentDetailPaid(posReceivePaymentDoc, index)"
                                            >
                                                <template slot="append">{{currencySymbol}}</template>
                                            </el-input>
                                        </td>
                                        <td style="vertical-align: middle">
                                            <el-checkbox v-model="posReceivePaymentDoc.isPaid"
                                                         @change="updatePosReceivePaymentDetail(posReceivePaymentDoc, index)"></el-checkbox>
                                        </td>
                                    </template>
                                </tr>
                            </draggable>
                            <thead>
                            <tr>
                                <th colspan="6" style="text-align: right;vertical-align: middle">
                                    {{langConfig['totalNetAmount']}}:
                                </th>
                                <th colspan="3">
                                    <el-input :placeholder="langConfig['totalNetAmount']"
                                              v-model.number="posReceivePaymentForm.totalNetAmount"
                                              disabled>
                                        <template slot="append">{{currencySymbol}}</template>
                                    </el-input>
                                </th>
                            </tr>
                            <tr>
                                <th colspan="6" style="text-align: right;vertical-align: middle">
                                    {{langConfig['totalDiscount']}}:
                                </th>
                                <th colspan="3">
                                    <el-input :placeholder="langConfig['totalDiscount']"
                                              v-model.number="posReceivePaymentForm.totalDiscount"
                                              disabled>
                                        <template slot="append">{{currencySymbol}}</template>
                                    </el-input>
                                </th>
                            </tr>
                            <tr>
                                <th colspan="6" style="text-align: right;vertical-align: middle">
                                    {{langConfig['balanceUnpaid']}}:
                                </th>
                                <th colspan="3">
                                    <el-input :placeholder="langConfig['balanceUnpaid']"
                                              v-model.number="posReceivePaymentForm.balanceUnPaid"
                                              disabled>
                                        <template slot="append">{{currencySymbol}}</template>
                                    </el-input>
                                </th>
                            </tr>
                            </thead>
                        </table>
                    </el-col>
                    <el-col :span="6">
                        <div class="w3-code">
                            <div class="ui segments plan">
                                <div class="ui top attached segment teal inverted plan-title">
                                    <span class="plan-ribbon red">{{posReceivePaymentForm.totalDiscount}}{{currencySymbol}}</span>
                                    <span class="ui header">{{langConfig['amountReceive']}}</span>

                                </div>
                                <div class="ui  attached segment feature">
                                    <div class="amount">
                                        {{posReceivePaymentForm.totalPaid}}{{currencySymbol}}
                                    </div>
                                </div>
                            </div>

                            <el-form-item :label="langConfig['location']" prop="locationId">

                                <el-select style="display: block !important"
                                           filterable clearable
                                           v-model="posReceivePaymentForm.locationId"
                                           :placeholder="langConfig['chooseLocation']">
                                    <el-option
                                            v-for="item in locationOption"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="langConfig['customer']" prop="customerId">
                                <el-select style="display: block !important;"
                                           filterable clearable
                                           v-model="posReceivePaymentForm.customerId" remote
                                           :disabled="disabledCustomer"
                                           :remote-method="customerOpt"
                                           :loading="loading"
                                           :placeholder="langConfig['customer']">
                                    <el-option
                                            v-for="item in customerOption"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item :label="langConfig['address']" prop="address">
                                <el-input type="textarea" v-model="posReceivePaymentForm.address"></el-input>
                            </el-form-item>
                            <el-form-item :label="langConfig['receiveDate']" prop="receivePaymentDate">
                                <el-date-picker
                                        v-model="posReceivePaymentForm.receivePaymentDate"
                                        type="date"
                                        style="width: 100%;"
                                        placeholder="Pick a day"
                                        :picker-options="options"
                                        :disabled="disabledDate"
                                >
                                </el-date-picker>
                            </el-form-item>


                            <el-form-item :label="langConfig['note']" prop="note">
                                <el-input type="textarea" v-model="posReceivePaymentForm.note" :rows="4"></el-input>
                            </el-form-item>
                        </div>
                        <!--</el-card>-->
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer fix-dialog-footer"
            >
                <hr style="margin-top: 0px !important;">
                <el-row>
                    <el-col :span="12" style="text-align: left !important;">
                        <el-button type="danger"
                                   @click.native="dialogAddPosReceivePayment= false, cancel(),resetForm()"> <i
                                class="el-icon-circle-cross"> </i>&nbsp;{{langConfig['cancel']}}</el-button>
                    </el-col>
                    <el-col :span="11" class="pull-right">
                        <el-button type="success" @click="savePosReceivePayment(false,$event)"><i
                                class="el-icon-circle-check"> </i>&nbsp; {{langConfig['saveAndNew']}}</el-button>

                        <el-button type="primary" @click.native="savePosReceivePayment(true,$event)"><i
                                class="el-icon-check"> </i>&nbsp; {{langConfig['save']}}</el-button>

                    </el-col>
                </el-row>
            </span>
        </el-dialog>
    </div>
</template>

<!--<script src="cleave-phone.{country}.js"></script>-->
<script>
    import draggable from 'vuedraggable';
    import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
    import {GeneralFunction} from "../../../imports/api/methods/generalFunction";
    import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";
    import {WB_waterBillingSetup} from "../../collection/waterBillingSetup";
    // require('cleave.js/dist/addons/cleave-phone.ac');
    // require('cleave.js/dist/addons/cleave-phone.{country}');

    import compoLang from '../../../both/i18n/lang/elem-label'

    export default {
        meteor: {
            langSession() {
                return Session.get('lang') || "en";
            },
            disabledRemove() {
                return Session.get("canRemove");
            },
            disabledUpdate() {
                return Session.get("canUpdate");
            }
        },
        components: {
            draggable
        },
        data() {
            return {
                posReceivePaymentData: [],
                posReceivePaymentDataDisplay: [],
                multipleSelection: [],
                posReceivePaymentId: "",
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddPosReceivePayment: false,
                dialogUpdatePosReceivePayment: false,
                dialogShowPosReceivePayment: false,
                typeDiscount: "",
                fullScreen: true,

                searchByDate: "",
                searchByInvoice: "",
                isOverDue: false,
                posReceivePaymentForm: {
                    totalPaid: 0,
                    amount: 0,
                    receivePaymentDate: moment().toDate(),
                    dueDate: moment().add(1, "month").toDate(),

                    note: "",

                    totalDiscount: 0,
                    totalNetAmount: 0,
                    balanceUnPaid: 0,
                    address: "",

                    isApplyTerm: true,
                    isPaidAll: false,
                    isAllTerm: false,
                    customerId: "",
                    locationId: ""

                },
                rules: {
                    receivePaymentDate: [{
                        type: 'date',
                        required: true,
                        message: 'Please input PosReceivePaymentDate',
                        trigger: 'blur'
                    }],
                    customerId: [{
                        required: true,
                        type: 'string',
                        message: 'Please choose customer',
                        trigger: 'change'
                    }]
                    ,
                    locationId: [{
                        required: true,
                        type: 'string',
                        message: 'Please choose Location',
                        trigger: 'change'
                    }],
                    // note: [{required: true, type: 'string', message: 'Please input Memo', trigger: 'blur'}],
                },

                // Options
                itemOption: [],
                customerOption: [],
                termOption: [],

                dialog: true,
                notifications: false,
                sound: true,
                widgets: false,
                labelPosition: "top",
                options: {
                    disabledDate(time) {
                        return false;
                    }
                },
                disabledDate: false,
                closeDate: "",
                type: "",
                posReceivePaymentDetail: {},

                locationOption: [],
                disabledCustomer: true,
                pickerDateOptions: {
                    shortcuts: [{
                        text: 'Last week',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last month',
                        onClick(picker) {
                            const end = moment().add(-1, "month").endOf("month").toDate();
                            const start = moment().add(-1, "month").startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last 3 months',
                        onClick(picker) {
                            const end = moment().add(-1, "month").endOf("month").toDate();
                            const start = moment().add(-4, "month").startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'This month',
                        onClick(picker) {
                            const end = moment().endOf("month").toDate();
                            const start = moment().startOf("month").toDate();
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Today',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        mounted() {
            let vm = this;
            vm.options = {
                disabledDate(time) {
                    let min = moment(vm.closeDate).add(1, "days").toDate().getTime();
                    return time.getTime() < min;
                }
            }
        },
        watch: {
            currentSize(val) {
                this.isSearching = true;
                let skip = (this.currentPage - 1) * val;
                this.queryData(this.searchData, skip, val + skip);
            },
            currentPage(val) {
                this.isSearching = true;
                let skip = (val - 1) * this.currentSize;
                this.queryData(this.searchData, skip, this.currentSize + skip);
            },
            searchData(val) {
                this.isSearching = true;
                let skip = (this.currentPage - 1) * this.currentSize;
                this.queryData(val, skip, this.currentSize + skip);
            },
            "posReceivePaymentForm.receivePaymentDate"(val) {
                /*let vm = this;
                if (vm.dialogUpdatePosReceivePayment == false) {
                    vm.posReceivePaymentForm.posReceivePaymentDate = val;
                }
                if (vm.closeDate && vm.closeDate != "" && vm.closeDate != undefined) {
                    vm.options = {
                        disabledDate(time) {
                            let min = moment(vm.closeDate).add(1, "days").toDate().getTime();
                            return time.getTime() < min;
                        }
                    }
                } else {
                    vm.options = {
                        disabledDate(time) {
                            return false;
                        }
                    }
                }*/

                let vm = this;
                if (this.dialogAddPosReceivePayment == true) {

                    let ind = 0;
                    vm.posReceivePaymentForm.receivePaymentDate = val;
                    vm.posReceivePaymentData.map((obj) => {
                        obj.dayOverDue = moment(val).startOf("days").diff(moment(obj.dueDate).startOf("days").toDate(), "days") < 0 ? 0 : moment(val).startOf("days").diff(moment(obj.dueDate).startOf("days").toDate(), "days");
                        vm.updatePosReceivePaymentDetail(obj, ind);
                        ind++;
                    })
                    vm.searchInvoice();
                }
            },
            /*dialogAddPosReceivePayment(val) {
                if (val) {
                    this._inputMaskPosReceivePayment();
                }
            },*/
            dialogUpdatePosReceivePayment(val) {
                if (val) {
                    this._inputMaskPosReceivePayment();
                }
            },
            "posReceivePaymentForm.customerId"(val) {
                let vm = this;
                if (val) {
                    Meteor.call("queryPosCustomerById", val, (err, result) => {
                        if (result) {
                            vm.posReceivePaymentForm.address = result.address;
                            vm.posReceivePaymentForm.termId = result.termId;
                        }
                    })

                    Meteor.call("queryPosInvoiceByCustomerId", val, vm.posReceivePaymentForm.receivePaymentDate, vm.posReceivePaymentForm.locationId, (err, result) => {
                        if (result) {
                            vm.posReceivePaymentData = result;
                        }
                        vm.getTotal();
                    })
                } else {
                    Meteor.call("queryPosInvoiceByCustomerId", "", vm.posReceivePaymentForm.receivePaymentDate, vm.posReceivePaymentForm.locationId, (err, result) => {
                        if (result) {
                            vm.posReceivePaymentData = result;

                            vm.posReceivePaymentForm.address = "";
                            vm.posReceivePaymentForm.termId = "";
                        }
                        vm.getTotal();
                    })
                }
            },
            "posReceivePaymentForm.isAllTerm"(val) {
                let vm = this;

                let ind = 0;
                vm.posReceivePaymentData.map((obj) => {
                    if (obj.isShow) {
                        obj.isApplyTerm = val;
                        if (obj.isPaid == false) {
                            obj.isApplyTerm = false;
                        }
                        vm.updatePosReceivePaymentDetail(obj, ind);
                    }
                    ind++;
                })
            },
            "posReceivePaymentForm.isPaidAll"(val) {
                let vm = this;
                let ind = 0;
                if (val == false) {
                    vm.posReceivePaymentForm.isAllTerm = false;
                }
                this.posReceivePaymentData.map((obj) => {
                    if (obj.isShow) {
                        obj.isPaid = val;
                        if (obj.isPaid == false) {
                            obj.isApplyTerm = false;
                        }
                        vm.updatePosReceivePaymentDetail(obj, ind);
                    }
                    ind++;
                })
            },
            searchByDate(val) {
                this.searchDate(val);
            },
            isOverDue(val) {
                let vm = this;
                vm.overDueStatus(val);
            },
            "posReceivePaymentForm.locationId"(val) {
                if (val) {
                    this.disabledCustomer = false;
                    this.posReceivePaymentForm.customerId = "";
                } else {
                    this.disabledCustomer = true;

                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            _inputMaskPosReceivePayment() {
                /*setTimeout(() => {
                    if ($(".el-inputAmount").length) {
                        new this.$_Cleave('.el-inputAmount', {
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand'
                        });
                    }

                    if ($(".el-inputDR").length) {
                        new this.$_Cleave('.el-inputDR', {
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand'
                        });
                    }

                    if ($(".el-inputCR").length) {
                        new this.$_Cleave('.el-inputCR', {
                            numeral: true,
                            numeralThousandsGroupStyle: 'thousand'
                        });
                    }


                }, 200)*/
            },
            queryData: _.debounce(function (val, skip, limit) {
                Meteor.call('queryPosReceivePayment', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.posReceivePaymentDataDisplay = result.content;
                        this.count = result.countPosReceivePayment;
                    }
                    this.isSearching = false;
                });
            }, 300),
            itemOpt() {
                let selector = {};
                selector.productType = "Inventory";
                Meteor.call('queryItemOption', selector, (err, result) => {
                    this.itemOption = result;
                })
            },
            locationOpt() {
                Meteor.call('queryLocationOption', (err, result) => {
                    this.locationOption = result;
                })
            },
            customerOpt(query) {
                if (!!query) {
                    this.loading = true;
                    setTimeout(() => {
                        let lists = [];
                        this.loading = false;
                        Meteor.call('queryPosCustomerOptionUnPaid', query, (err, result) => {
                            if (!err) {
                                this.customerOption = result;
                            } else {
                                console.log(err.message);
                            }
                        })
                    }, 200);
                } else {
                    Meteor.call('queryPosCustomerOptionUnPaid', "", (err, result) => {
                        if (!err) {
                            this.customerOption = result;
                        } else {
                            console.log(err.message);
                        }
                    })
                }
            },
            termOpt() {
                let selector = {};
                Meteor.call('queryPosTermOption', selector, (err, result) => {
                    this.termOption = result;
                })
            },

            savePosReceivePayment(isCloseDialog, event) {
                event.preventDefault();
                let vm = this;
                this.$refs["posReceivePaymentFormAdd"].validate((valid) => {
                    if (valid) {
                        let posReceivePaymentDoc = {
                            totalPaid: vm.$_numeral(vm.posReceivePaymentForm.totalPaid).value(),
                            totalNetAmount: vm.$_numeral(vm.posReceivePaymentForm.totalNetAmount).value(),
                            totalDiscount: vm.$_numeral(vm.posReceivePaymentForm.totalDiscount).value(),

                            balanceUnPaid: vm.$_numeral(vm.posReceivePaymentForm.totalNetAmount).value() - vm.$_numeral(vm.posReceivePaymentForm.totalPaid).value(),
                            totalAmount: vm.$_numeral(vm.posReceivePaymentForm.totalNetAmount).value() + vm.$_numeral(vm.posReceivePaymentForm.totalDiscount).value(),

                            receivePaymentDate: moment(vm.posReceivePaymentForm.receivePaymentDate).toDate(),
                            receivePaymentDateName: moment(vm.posReceivePaymentForm.receivePaymentDate).format("DD/MM/YYYY"),
                            note: vm.posReceivePaymentForm.note,
                            address: vm.posReceivePaymentForm.address,

                            rolesArea: Session.get('area'),
                            customerId: vm.posReceivePaymentForm.customerId,
                            locationId: vm.posReceivePaymentForm.locationId,
                        };
                        posReceivePaymentDoc.invoice = vm.posReceivePaymentData;
                        Meteor.call("insertPosReceivePayment", posReceivePaymentDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `Save Successfully!`,
                                    type: 'success'
                                });

                                if (isCloseDialog) {
                                    this.dialogAddPosReceivePayment = false;
                                }

                                vm.posReceivePaymentData.forEach((obj) => {
                                    if (obj.isPaid == true) {
                                        Meteor.call("updateInvoiceByReceivePayment", obj, posReceivePaymentDoc.receivePaymentDate, (err, re) => {
                                            if (err) {
                                                console.log(err.message);
                                            }
                                        })
                                    }
                                })

                                vm.queryData();
                                vm.resetForm();
                            }
                        })
                    }
                })


            },

            removePosReceivePayment(index, row, rows) {
                let vm = this;
                if (row.canRemove == true) {
                    vm.$confirm(this.langConfig['messageWarning'], this.langConfig['warning'], {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        Meteor.call("removePosReceivePayment", row._id, (err, result) => {
                            if (!err) {
                                rows.splice(index, 1);
                                vm.$message({
                                    message: ` ${row.receivePaymentDateName} ` + this.langConfig['removeSuccess'],
                                    type: 'success'
                                });

                            } else {
                                vm.$message({
                                    type: 'error',
                                    message: this.langConfig['removeFail']
                                });
                            }

                        })
                    }).catch(() => {
                        vm.$message({
                            type: 'info',
                            message: 'Delete canceled'
                        });
                    });
                } else {
                    vm.$message({
                        type: 'error',
                        message: this.langConfig['message']
                    });
                }
            },
            popupPosReceivePaymentAdd() {
                this.resetForm();
                this.itemOpt();
                let vm = this;
                $(".el-dialog__title").text(this.langConfig['add']);

                this.customerOpt();
                this.termOpt();
            },
            updatePosReceivePaymentDetail(row, index) {
                let vm = this;
                if (row.isPaid == false) {
                    row.paid = 0;
                    row.isApplyTerm = false;
                }
                if (row.isApplyTerm) {
                    Meteor.call("queryPosTermById", row.termId, (err, data) => {
                        if (data && data.isDiscount && row.paid == row.netAmount) {
                            if (row.isPaid) {
                                row.discount = 0;
                                if (moment(vm.posReceivePaymentForm.receivePaymentDate).diff(row.invoiceDate, "days") <= data.daysForDiscount) {
                                    row.discount = vm.$_numeral(row.amount).value() * data.value / 100;
                                }
                                row.paid = vm.$_numeral(row.amount).value() - vm.$_numeral(row.discount).value();
                                row.netAmount = formatCurrency(vm.$_numeral(row.amount).value() - vm.$_numeral(row.discount).value());
                            } else {
                                row.discount = 0;
                                if (moment(vm.posReceivePaymentForm.receivePaymentDate).diff(row.invoiceDate, "days") <= data.daysForDiscount) {
                                    row.discount = formatCurrency(vm.$_numeral(row.amount).value() * data.value / 100);
                                    row.netAmount = formatCurrency(vm.$_numeral(row.amount).value() - row.discount);

                                }
                                row.paid = 0;
                            }
                        } else {
                            if (row.isPaid) {
                                row.discount = 0;
                                row.paid = vm.$_numeral(row.amount).value();
                                row.netAmount = formatCurrency(row.amount);
                            } else {
                                row.discount = 0;
                                row.paid = 0;
                                row.netAmount = formatCurrency(row.amount);
                            }
                        }
                        this.posReceivePaymentData[index] = row;
                        vm.getTotal();
                    })

                } else {
                    if (row.isPaid) {
                        row.discount = 0;
                        row.paid = vm.$_numeral(row.amount).value();
                        row.netAmount = formatCurrency(row.amount);
                    } else {
                        row.discount = 0;
                        row.netAmount = formatCurrency(row.amount);
                        row.paid = 0;
                    }
                    this.posReceivePaymentData[index] = row;
                    vm.getTotal();
                }
            },
            updatePosReceivePaymentDetailPaid(row, index) {
                if (row.netAmount != row.paid) {
                    if (row.paid > 0) {
                        row.isPaid = true;
                    } else {
                        row.isPaid = false;
                    }
                    row.discount = 0;
                    row.netAmount = row.amount;
                    this.posReceivePaymentData[index] = row;
                } else {
                    if (row.paid > 0) {
                        row.isPaid = true;
                    } else {
                        row.isPaid = false;
                    }
                    this.posReceivePaymentData[index] = row;
                    this.updatePosReceivePaymentDetail(row, index);
                }
                this.getTotal();
            },
            cancel() {
                this.resetForm();
                this.$message({
                    type: 'info',
                    message: 'Canceled'
                });
            },
            resetForm() {
                this.posReceivePaymentData = [];
                this.posReceivePaymentForm.isPaidAll = false;
                this.posReceivePaymentForm.isApplyTerm = false;
                if (this.$refs["posReceivePaymentFormAdd"]) {
                    this.$refs["posReceivePaymentFormAdd"].resetFields();
                    this.getTotal();

                    this.refForm = "";

                }
            },
            getTotal() {
                let vm = this;
                let totalNetAmount = 0;
                let totalDiscount = 0;
                let totalPaid = 0;
                vm.posReceivePaymentData.forEach(function (obj) {
                    if (obj.isShow) {
                        totalNetAmount += parseFloat(vm.$_numeral(obj.netAmount).value() || 0);
                        totalDiscount += parseFloat(vm.$_numeral(obj.discount).value() || 0);
                        totalPaid += parseFloat(vm.$_numeral(obj.paid).value() || 0);
                    }
                });
                let companyDoc = WB_waterBillingSetup.findOne({rolesArea: Session.get("area")});
                this.currencySymbol = getCurrencySymbolById(companyDoc.baseCurrency);
                vm.posReceivePaymentForm.totalNetAmount = formatCurrency(totalNetAmount, companyDoc.baseCurrency);
                vm.posReceivePaymentForm.totalDiscount = formatCurrency(totalDiscount, companyDoc.baseCurrency);
                vm.posReceivePaymentForm.totalPaid = formatCurrency(totalPaid, companyDoc.baseCurrency);
                vm.posReceivePaymentForm.balanceUnPaid = formatCurrency(totalNetAmount - totalPaid, companyDoc.baseCurrency);
            },
            searchInvoice() {
                let vm = this;
                let canFind = 0;
                let ind = 0;
                vm.posReceivePaymentData.forEach((obj) => {
                    if ((obj.invoiceNo == vm.searchByInvoice || vm.searchByInvoice == "") && ((moment(obj.invoiceDate).toDate().getTime() > moment(vm.searchByDate[0]).toDate().getTime() && moment(obj.invoiceDate).toDate().getTime() < moment(vm.searchByDate[1]).toDate().getTime()) || vm.searchByDate[0] == null)) {
                        obj.isShow = true;
                        canFind++;
                    } else {
                        obj.isShow = false;
                        obj.isPaid = false;
                        obj.isApplyTerm = false;
                    }
                    vm.updatePosReceivePaymentDetail(obj, ind);
                    ind++;
                });
                if (canFind == 0) {
                    this.$message({
                        type: 'error',
                        message: 'Not Found'
                    });
                } else {

                    this.$message({
                        type: 'success',
                        message: 'Have ' + canFind + " Invoices"
                    });
                }
                vm.getTotal();
                if (vm.isOverDue) {
                    vm.overDueStatus(vm.isOverDue);
                }

            },
            searchDate(val) {
                let vm = this;
                let canFind = 0;
                let ind = 0;
                vm.posReceivePaymentData.forEach((obj) => {
                    if ((obj.invoiceNo == vm.searchByInvoice || vm.searchByInvoice == "") && (moment(obj.invoiceDate).toDate().getTime() > moment(val[0]).toDate().getTime() && moment(obj.invoiceDate).toDate().getTime() < moment(val[1]).toDate().getTime()) || val[0] == null) {
                        obj.isShow = true;
                        canFind++;
                    } else {
                        obj.isShow = false;
                        obj.isPaid = false;
                        obj.isApplyTerm = false;
                    }
                    vm.updatePosReceivePaymentDetail(obj, ind);
                    ind++;
                });
                if (canFind == 0) {
                    this.$message({
                        type: 'error',
                        message: 'Not Found'
                    });
                } else {

                    this.$message({
                        type: 'success',
                        message: 'Have ' + canFind + " Invoices"
                    });
                }
                vm.getTotal();
                if (vm.isOverDue) {
                    vm.overDueStatus(vm.isOverDue);
                }
            },
            overDueStatus(val) {
                let vm = this;
                if (val) {
                    vm.posReceivePaymentData.map((obj) => {
                        if (obj.isShow == true && obj.dayOverDue <= 0) {
                            obj.isShow = false;
                        }
                        return obj;
                    })
                } else {
                    vm.searchInvoice();
                }
            }
        },
        created() {
            this.isSearching = true;
            this.queryData();
            this.getTotal();
            this.locationOpt();
        },
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['receivePayment'];
                return data;
            }
        }
    }


</script>

<style>
    .item {
        /*margin-top: 10px;*/
        margin-right: 10px;
    }

    .el-badge__content.is-fixed {
        margin-right: -5px;
    }
</style>


