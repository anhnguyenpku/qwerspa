<template>
    <div class="pos_SaleCoffee">
        <body class="custom-login-background-coffee">

        <div class="card card-stats" style="background-color: black !important; color:white !important;">
            <!--<div class="card-header card-header-icon" data-background-color="white">
                <img style="width: 100px;height: 100px;vertical-align: baseline !important;"
                     src="/mih.png"
                     alt="">
            </div>-->
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <p>Login As : {{username}}</p>
                    <p>Today : {{todaySt}}</p>
                    <p>Time : {{timeSt}}</p>

                    <!--<h5>
                        <a class="cursor-pointer"
                        >
                             <span style="font-family: 'Khmer OS Muol light','Khmer OS Muol';font-size: 15px;vertical-align: middle !important;"><br>
                                 <p style="font-size: 18px;">{{waterBillingSetup.khName}}</p><p>{{waterBillingSetup.enName}}</p></span>
                        </a>
                    </h5>-->
                </el-col>
                <el-col :span="16" style="text-align: right; margin-right: 10px">
                    <br>
                    <el-row type="flex" justify="center">
                        <el-col :span="2"></el-col>
                        <el-col :span="10" style="font-family: 'Khmer OS Freehand';text-align: left !important;"><h2>
                            {{langConfig['selectCategory']}}</h2>
                        </el-col>
                        <el-col :span="3">

                        </el-col>
                        <el-col :span="8">
                            <el-input
                                    :placeholder="langConfig['searchHere']"
                                    suffix-icon="el-icon-search"
                                    v-model="searchData"
                            >
                            </el-input>
                        </el-col>
                        <el-col :span="1">
                            <el-button type="danger" round
                                       @click="goToInvoice">
                                <i class="fa fa-close"></i>
                            </el-button>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <hr>
            <el-row>
                <el-col :span="8" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 2 : 0">
                    <el-card style="width: 120px !important;" :body-style="{ padding: '0px' }">
                        <img src="/hamburger.png" class="image">
                        <div style="padding: 14px;">
                            <span>Yummy</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <hr>
            <br>
            <slot v-if="loading">
                <div class="row">
                    <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                        <!--<loader></loader>-->
                    </div>
                </div>
            </slot>
            <slot v-else>
                <el-form :model="posSaleCoffeeForm" :rules="rules" :ref="refForm" label-width="120px"
                         :label-position="labelPosition"
                         class="posSaleCoffeeForm"
                         style="background-color: black !important;min-height:100% !important;">
                    <el-row :gutter="20">
                        <el-col :span="18" class="posSaleCoffeeForm" style="background-color: black !important;">
                            <!--<table class="table table-responsive​​​ table-striped table-hover responstable"
                                  >
                                <thead>
                                <tr>
                                    <th colspan="3" style="width: 30% !important;">
                                        <el-form-item label="" prop="locationId">

                                            <el-select style="display: block !important"
                                                       filterable clearable
                                                       v-model="posSaleCoffeeForm.locationId"
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
                                    </th>
                                    <th style="width: 20% !important;">
                                        <el-form-item label="">
                                            <el-input :placeholder="langConfig['barcode']" :disabled="disabledItem"
                                                      v-model="posSaleCoffeeForm.code" autofocus
                                                      @keyup.native.13="addToPosSaleCoffeeData(null)"
                                            >
                                            </el-input>
                                        </el-form-item>
                                    </th>
                                    <th style="width: 20% !important;">
                                        <el-form-item label="">
                                            <el-select style="display: block !important;"
                                                       filterable clearable
                                                       v-model="posSaleCoffeeForm.itemId" :disabled="disabledItem"
                                                       :placeholder="langConfig['chooseItem']">
                                                <el-option
                                                        v-for="item in itemOption"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                    </th>

                                    <th colspan="2">
                                        <el-form-item label="">
                                            <el-input :placeholder="langConfig['total']"
                                                      v-model.number="posSaleCoffeeForm.total"
                                                      disabled>
                                                <template slot="prepend">{{langConfig['total']}} :</template>
                                                <template slot="append">{{currencySymbol}}</template>
                                            </el-input>
                                        </el-form-item>
                                    </th>
                                </tr>
                                </thead>
                                <thead>
                                <tr>
                                    <th>{{langConfig['no']}}</th>
                                    <th style="min-width: 220px">{{langConfig['name']}}</th>
                                    <th>{{langConfig['retail']}}</th>
                                    &lt;!&ndash;<th>{{langConfig['longitude']}}</th>
                                    <th>{{langConfig['width']}}</th>&ndash;&gt;
                                    <th>{{langConfig['qty']}}</th>
                                    <th>{{langConfig['price']}}</th>
                                    <th colspan="2">{{langConfig['amount']}}</th>
                                </tr>
                                </thead>
                                &lt;!&ndash;<draggable v-model="posSaleCoffeeData" :element="'tbody'">&ndash;&gt;
                                <tr v-for="(posSaleCoffeeDoc,index ) in this.posSaleCoffeeData" :key="index">
                                    <td style="vertical-align: middle">{{index + 1}}</td>
                                    <td style="vertical-align: middle">{{posSaleCoffeeDoc.itemName}}</td>
                                    <td style="vertical-align: middle">
                                        <el-switch
                                                v-model="posSaleCoffeeDoc.isRetail"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                @change="updatePosSaleCoffeeDetailByRetail(posSaleCoffeeDoc, index)"
                                        >
                                        </el-switch>
                                    </td>


                                    &lt;!&ndash;<td>
                                        <el-input placeholder="Please input Unit1" v-model.number=posSaleCoffeeDoc.unit1
                                                  @keyup.native="updatePosSaleCoffeeDetail(posSaleCoffeeDoc, index)"></el-input>
                                    </td>
                                    <td>
                                        <el-input placeholder="Please input Unit2" v-model.number=posSaleCoffeeDoc.unit2
                                                  @keyup.native="updatePosSaleCoffeeDetail(posSaleCoffeeDoc, index)"></el-input>
                                    </td>&ndash;&gt;

                                    <td>
                                        <el-input placeholder="Please input Qty"
                                                  v-model.number=posSaleCoffeeDoc.qty type='number'
                                                  @keyup.native="updatePosSaleCoffeeDetail(posSaleCoffeeDoc, index)"
                                                  @change="updatePosSaleCoffeeDetail(posSaleCoffeeDoc, index)">
                                            <template slot="append">{{posSaleCoffeeDoc.unitName || ""}}</template>
                                        </el-input>
                                    </td>
                                    <td>
                                        <el-input placeholder="Please input Price" v-model.number=posSaleCoffeeDoc.price
                                                  type='number'
                                                  @keyup.native="updatePosSaleCoffeeDetail(posSaleCoffeeDoc, index)"
                                                  @change="updatePosSaleCoffeeDetail(posSaleCoffeeDoc, index)"
                                        ></el-input>
                                    </td>
                                    <td>
                                        <el-input placeholder="Amount" v-model.number=posSaleCoffeeDoc.amount
                                                  disabled>
                                            &lt;!&ndash;<template slot="append">{{currencySymbol}}</template>&ndash;&gt;
                                            <template slot="append">
                                                <el-dropdown trigger="click" :hide-on-click="false">
                                                    <span class="el-dropdown-link">
                                                        {{langConfig['desc']}} <span v-if="posSaleCoffeeDoc.desc==''">
                                                                <i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>
                                                            </span>
                                                            <span v-else>
                                                                <i class="el-icon-circle-check el-icon&#45;&#45;right"
                                                                   style="color: blue"></i>

                                                            </span>
                                                    </span>
                                                    <el-dropdown-menu slot="dropdown">
                                                        <el-dropdown-item class="clearfix">
                                                            <el-input :placeholder="langConfig['desc']" type="textarea"
                                                                      v-model.number=posSaleCoffeeDoc.desc
                                                                      @keyup.native="updatePosSaleCoffeeDetail(posSaleCoffeeDoc, index)"></el-input>
                                                        </el-dropdown-item>
                                                    </el-dropdown-menu>
                                                </el-dropdown>
                                            </template>
                                        </el-input>
                                    </td>
                                    <td style="text-align: center;vertical-align: middle">
                                        <el-button type="danger" icon="el-icon-delete" size="small"
                                                   @click="removePosSaleCoffeeDetailByIndex(index,posSaleCoffeeDoc)"></el-button>
                                    </td>
                                </tr>
                                &lt;!&ndash;</draggable>&ndash;&gt;
                                <thead>
                                <tr>
                                    <th colspan="5" style="text-align: right;vertical-align: middle">
                                        {{langConfig['discount']}} :
                                        <el-radio-group v-model="posSaleCoffeeForm.discountType">
                                            <el-radio-button v-for="mt in discountTypeOption" :label="mt.value"
                                                             :key="mt.value"
                                            >
                                                {{langConfig[mt.label]}}
                                            </el-radio-button>
                                        </el-radio-group>
                                    </th>
                                    <th colspan="2">
                                        <el-input placeholder="Amount Discount" prop="discount"
                                                  v-model.number="posSaleCoffeeForm.discount" type='number'>
                                            <template slot="append">{{typeDiscount}}</template>
                                        </el-input>
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="5" style="text-align: right;vertical-align: middle">
                                        {{langConfig['netTotal']}} :
                                    </th>
                                    <th colspan="2">
                                        <el-input :placeholder="langConfig['netTotal']"
                                                  v-model.number="posSaleCoffeeForm.netTotal"
                                                  disabled>
                                            <template slot="append">{{currencySymbol}}</template>
                                        </el-input>
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="5" style="text-align: right;vertical-align: middle">
                                        {{langConfig['paidDollar']}}:
                                    </th>
                                    <th colspan="2">
                                        <el-input placeholder="USD" v-model.number="posSaleCoffeeForm.paidUSD"
                                                  type='number'
                                                  @change.native="getTotal()" @focus.native="clearZero($event)"
                                                  @keyup.native="getTotal()"

                                        >
                                            <template slot="append">{{posSaleCoffeeForm.remainUSD}} $</template>
                                        </el-input>
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="5" style="text-align: right;vertical-align: middle">
                                        {{langConfig['paidRiel']}} :
                                    </th>
                                    <th colspan="2">
                                        <el-input placeholder="KHR" @change="getTotal()"
                                                  @keyup.native="getTotal()"

                                                  v-model.number="posSaleCoffeeForm.paidKHR" type='number'
                                        >
                                            <template slot="append">{{posSaleCoffeeForm.remainKHR}} ៛</template>
                                        </el-input>
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="5" style="text-align: right;vertical-align: middle">
                                        {{langConfig['paidBaht']}}:
                                    </th>
                                    <th colspan="2">
                                        <el-input placeholder="THB" v-model.number="posSaleCoffeeForm.paidTHB"
                                                  type='number'
                                                  @change="getTotal()"
                                                  @keyup.native="getTotal()"
                                        >
                                            <template slot="append">{{posSaleCoffeeForm.remainTHB}} B</template>
                                        </el-input>
                                    </th>
                                </tr>

                                </thead>
                            </table>-->
                            &nbsp;
                        </el-col>
                        <el-col :span="6" style="background-color: black !important;">
                            <div class="w3-code-coffee">
                                <div class="ui segments plan">
                                    <div class="ui top attached segment teal inverted plan-title">
                                        <span class="plan-ribbon red">{{posSaleCoffeeForm.discountValue}}{{currencySymbol}}</span>
                                        <span class="ui header">{{langConfig['balanceDue']}}</span>

                                    </div>
                                    <div class="ui  attached segment feature">
                                        <div class="amount">
                                            {{posSaleCoffeeForm.balanceUnpaid}}{{currencySymbol}}
                                        </div>
                                    </div>
                                </div>


                                <el-form-item :label="langConfig['customer']" prop="customerId">
                                    <el-select style="display: block !important;"
                                               filterable clearable
                                               v-model="posSaleCoffeeForm.customerId" remote
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

                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['address']" prop="address">
                                            <el-input type="textarea" v-model="posSaleCoffeeForm.address"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="">&nbsp;</div>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item :label="langConfig['saleCoffeeNo']" prop="saleCoffeeNo">
                                            <el-input v-model="posSaleCoffeeForm.saleCoffeeNo"
                                                      prefix-icon="el-icon-edit" size="small"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>


                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['saleCoffeeDate']" prop="saleCoffeeDate">
                                            <el-date-picker
                                                    v-model="posSaleCoffeeForm.saleCoffeeDate"
                                                    type="date"
                                                    style="width: 100%;"
                                                    placeholder="Pick a day"
                                                    :picker-options="options"
                                                    :disabled="disabledDate"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                    <el-col :span="1">
                                        <div class="">&nbsp;</div>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item :label="langConfig['dueDate']" prop="dueDate">
                                            <el-date-picker
                                                    v-model="posSaleCoffeeForm.dueDate"
                                                    type="date"
                                                    style="width: 100%;"
                                                    placeholder="Pick a day"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row>

                                    <el-col :span="12">
                                        <el-form-item :label="langConfig['term']" prop="termId">
                                            <el-select style="display: block !important;"
                                                       filterable clearable
                                                       v-model="posSaleCoffeeForm.termId"
                                                       placeholder="Term">
                                                <el-option
                                                        v-for="item in termOption"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value"
                                                        :disabled="item.disabled">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="">&nbsp;</div>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item :label="langConfig['note']" prop="note">
                                            <el-input type="textarea" v-model="posSaleCoffeeForm.note"
                                                      :rows="3"></el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-row>

                            </div>
                            <!--</el-card>-->
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer fix-dialog-footer" style="background-color: black !important;"
                >
                <hr style="margin-top: 0px !important;">
                <el-row>
                    <el-col :span="12" style="text-align: left !important;">
                        <el-button type="danger" @click.native="dialogAddPosSaleCoffee= false, cancel(),resetForm()"> <i
                                class="el-icon-circle-cross"> </i>&nbsp;{{langConfig['reset']}} <i>(ESC)</i></el-button>
                    </el-col>
                    <el-col :span="11" class="pull-right" style="text-align: right !important;">
                        <el-button type="primary" @click.native="savePosSaleCoffee(true,$event,false)"><i
                                class="el-icon-check"> </i>&nbsp; {{langConfig['save']}} <i>(Ctrl + Alt + Enter)</i></el-button>

                         <el-button type="success" @click="savePosSaleCoffee(true,$event,true)"><i
                                 class="fa fa-print"></i>&nbsp; {{langConfig['saveAndPrint']}} <i>(Ctrl + Enter)</i></el-button>
                    </el-col>
                </el-row>
            </span>

                <br>
            </slot>
            <!--End Pagination-->
        </div>
        </body>
    </div>
</template>

<!--<script src="cleave-phone.{country}.js"></script>-->
<script>
    import draggable from 'vuedraggable';
    import {formatCurrency} from "../../../imports/api/methods/roundCurrency";
    import {formatCurrencyLast} from "../../../imports/api/methods/roundCurrency";
    import {GeneralFunction} from "../../../imports/api/methods/generalFunction";
    import {getCurrencySymbolById} from "../../../imports/api/methods/roundCurrency";
    import {WB_waterBillingSetup} from "../../collection/waterBillingSetup";
    // require('cleave.js/dist/addons/cleave-phone.ac');
    // require('cleave.js/dist/addons/cleave-phone.{country}');
    import compoLang from '../../../both/i18n/lang/elem-label'
    import {Pos_InvoiceReact} from "../../collection/posInvoice";

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
                keyCode: [],
                refForm: '',
                multipleSelection: [],
                posSaleCoffeeId: "",
                loading: false,
                searchData: '',
                isSearching: false,
                typeDiscount: "",

                posSaleCoffeeForm: {
                    itemId: "",
                    itemName: "",
                    price: 0,
                    qty: 0,
                    amount: 0,
                    total: 0,
                    netTotal: 0,
                    balanceUnpaid: 0,
                    paid: 0,
                    saleCoffeeDate: moment().toDate(),
                    dueDate: moment().add(1, "month").toDate(),
                    saleCoffeeNo: "",

                    note: "",

                    discountType: "Amount",
                    discount: 0,
                    discountValue: 0,
                    termId: "",
                    address: "",
                    customerId: "",

                    isRetail: true,
                    paidUSD: 0,
                    paidKHR: 0,
                    paidTHB: 0,

                    remainUSD: 0,
                    remainKHR: 0,
                    remainTHB: 0,
                    unit1: 1,
                    unit2: 1,
                    totalUnit: 1,
                    desc: "",
                    locationId: "",
                    rawQty: 0,
                    isReceiveAll: false,
                    balanceNotCut: 0,
                    balanceNotCutFull: 0,
                    code: ""

                },
                rules: {
                    saleCoffeeDate: [{
                        type: 'date',
                        required: true,
                        message: 'Please input PosSaleCoffeeDate',
                        trigger: 'blur'
                    }],
                    saleCoffeeNo: [{
                        required: true,
                        type: 'string',
                        message: 'Please input SaleCoffee No',
                        trigger: 'blur'
                    }],
                    discount: [{
                        required: true,
                        type: 'string',
                        message: 'Please input Discount',
                        trigger: 'blur'
                    }],
                    customerId: [{
                        required: true,
                        type: 'string',
                        message: 'Please choose customer',
                        trigger: 'change'
                    }],
                    termId: [{
                        required: true,
                        type: 'string',
                        message: 'Please choose Term',
                        trigger: 'change'
                    }],
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
                posSaleCoffeeDetail: {},
                discountTypeOption: [
                    {label: "amount", value: "Amount"},
                    {label: "percent", value: "Percent"}
                ],
                locationOption: [],
                disabledItem: true,
                timeStamp: [],
                takeBarcode: '',
                skip: 0,
                waterBillingSetup: {},
                username: Meteor.user().username,
                todaySt: "",
                timeSt: ""
            }
        },
        mounted() {
            this.$jQuery('body').off();
            let vm = this;
            vm.options = {
                disabledDate(time) {
                    let min = moment(vm.closeDate).add(1, "days").toDate().getTime();
                    return time.getTime() < min;
                }
            };

            let elem = this.$jQuery('el-dialog.dialogSaleCoffee');
            let checkEvent = $._data($('body').get(0), 'events');
            if (checkEvent.keyup.length <= 1) {
                this.$nextTick(() => {
                    this.$jQuery('body').on('keyup', elem, this.barcodeScanSaleCoffee);
                })
            }
            this.time();
        },
        watch: {
            "posSaleCoffeeForm.saleCoffeeDate"(val) {
                let vm = this;
                if (vm.dialogUpdatePosSaleCoffee === false) {
                    vm.posSaleCoffeeForm.posSaleCoffeeDate = val;
                }
                if (vm.closeDate && vm.closeDate !== "" && vm.closeDate !== undefined) {
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
                }
                if (this.$refs["posSaleCoffeeFormAdd"]) {
                    this.getVoucherByRoleAndDate(val);
                }
            },
            /*dialogAddPosSaleCoffee(val) {
                if (val) {
                    this._inputMaskPosSaleCoffee();
                }
            },*/
            dialogUpdatePosSaleCoffee(val) {
                if (val) {
                    this._inputMaskPosSaleCoffee();
                }
            },
            "posSaleCoffeeForm.itemId"(val) {
                if (val) {
                    this.addToPosSaleCoffeeData(val);
                }
            },
            "posSaleCoffeeForm.discount"(val) {
                if (val || val === 0) {
                    this.posSaleCoffeeForm.discount = val;
                    // this.posSaleCoffeeForm.discount = this.$_numeral(val).format("0,00");
                    this.getTotal();

                }
            },
            "posSaleCoffeeForm.discountType"(val) {
                if (val) {
                    this.posSaleCoffeeForm.discountType = val;
                    this.getTotal();
                }
            }
        },
        methods: {
            goToInvoice() {
                FlowRouter.go("/pos-sale/posInvoice");
            },
            time() {
                let self = this;
                this.todaySt = moment().format("DD/MM/YYYY");
                this.timeSt = moment().format("hh:mm:ss");
                setTimeout(self.time, 1000);
            },
            _inputMaskPosSaleCoffee() {
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
            barcodeScanSaleCoffee(e) {
                if (this.dialogAddPosSaleCoffee === true || this.dialogUpdatePosSaleCoffee === true) {
                    let scannerSensitivity = 100;
                    if (e.keyCode !== 13 && !isNaN(e.key)) {
                        this.takeBarcode += e.key;
                    }
                    this.timeStamp.push(Date.now());
                    if (this.timeStamp.length > 1) {
                        if (this.timeStamp[1] - this.timeStamp[0] >= scannerSensitivity) {
                            this.takeBarcode = '';
                            this.timeStamp = [];
                        } else {
                            if (e.keyCode === 13) {
                                this.posSaleCoffeeForm.code = this.takeBarcode;
                                this.addToPosSaleCoffeeData(null);
                                this.timeStamp = [];
                                this.takeBarcode = ''
                            }
                        }
                    }
                }
            },
            itemOpt() {
                let selector = {};
                // selector.productType = "Inventory";
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
                    setTimeout(() => {
                        let lists = [];
                        Meteor.call('queryPosCustomerOption', query, (err, result) => {
                            if (!err) {
                                this.customerOption = result;
                            } else {
                                console.log(err.message);
                            }
                        })
                    }, 200);
                } else {
                    Meteor.call('queryPosCustomerOption', "", (err, result) => {
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
            /*checkValidatedNumber() {
                let charCode = (val.which) ? val.which : val.keyCode;
                if ($(val.currentTarget).val().indexOf('.') != -1) {
                    if (charCode == 46) {
                        return false;
                    }
                }
                return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));

            },*/
            savePosSaleCoffee(isCloseDialog, event, isPrint) {
                event.preventDefault();
                let vm = this;
                this.$refs["posSaleCoffeeFormAdd"].validate((valid) => {
                    if (valid) {
                        let posSaleCoffeeDoc = {
                            total: vm.$_numeral(vm.posSaleCoffeeForm.total).value(),
                            netTotal: vm.$_numeral(vm.posSaleCoffeeForm.netTotal).value(),
                            balanceUnpaid: vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(),
                            paid: vm.$_numeral(vm.posSaleCoffeeForm.netTotal).value() - vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(),

                            paidUSD: vm.$_numeral(vm.posSaleCoffeeForm.paidUSD).value(),
                            paidKHR: vm.$_numeral(vm.posSaleCoffeeForm.paidKHR).value(),
                            paidTHB: vm.$_numeral(vm.posSaleCoffeeForm.paidTHB).value(),

                            remainUSD: vm.$_numeral(vm.posSaleCoffeeForm.remainUSD).value(),
                            remainKHR: vm.$_numeral(vm.posSaleCoffeeForm.remainKHR).value(),
                            remainTHB: vm.$_numeral(vm.posSaleCoffeeForm.remainTHB).value(),

                            saleCoffeeDate: moment(vm.posSaleCoffeeForm.saleCoffeeDate).toDate(),
                            saleCoffeeDateName: moment(vm.posSaleCoffeeForm.saleCoffeeDate).format("DD/MM/YYYY"),
                            dueDate: moment(vm.posSaleCoffeeForm.dueDate).toDate(),
                            saleCoffeeNo: vm.posSaleCoffeeForm.saleCoffeeNo,

                            note: vm.posSaleCoffeeForm.note,

                            discountType: vm.posSaleCoffeeForm.discountType,


                            discount: vm.$_numeral(vm.posSaleCoffeeForm.discount).value(),
                            discountValue: vm.$_numeral(vm.posSaleCoffeeForm.discountValue).value(),
                            termId: vm.posSaleCoffeeForm.termId,
                            address: vm.posSaleCoffeeForm.address,

                            rolesArea: Session.get('area'),
                            paymentNumber: 1,
                            customerId: vm.posSaleCoffeeForm.customerId,
                            locationId: vm.posSaleCoffeeForm.locationId,
                            status: vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value() === 0 ? "Complete" : vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value() < vm.$_numeral(vm.posSaleCoffeeForm.netTotal).value() ? "Partial" : "Active"
                        };
                        posSaleCoffeeDoc.item = vm.posSaleCoffeeData;
                        Meteor.call("insertPosSaleCoffee", posSaleCoffeeDoc, (err, result) => {
                            if (!err) {
                                if (isPrint) {
                                    FlowRouter.go('/pos-data/posSaleCoffee/print?inv=' + result);
                                } else {
                                    vm.$message({
                                        duration: 1000,
                                        message: this.langConfig['saveSuccess'],
                                        type: 'success'
                                    });
                                }
                                if (isCloseDialog) {
                                    this.dialogAddPosSaleCoffee = false;
                                } else {
                                    vm.getVoucherByRoleAndDate(moment().toDate());
                                }

                                Session.set("transactionActionNumber", (Session.get("transactionActionNumber") || 0) + 1);

                                vm.resetForm();
                            } else {
                                vm.$notify.error({
                                    duration: 5000,
                                    title: 'Error',
                                    message: err.error
                                });
                                /*vm.$message({
                                    type: 'error',
                                    message: err.error
                                });*/
                            }
                        })

                    }
                })


            },

            getVoucherByRoleAndDate(date) {
                let vm = this;
                Meteor.call("pos_getSaleCoffeeNoByRoleAndDate", Session.get("area"), date, (err, result) => {
                    if (!err) {
                        vm.posSaleCoffeeForm.saleCoffeeNo = result;
                    }
                })
            },


            addToPosSaleCoffeeData(val) {
                let vm = this;

                if (val === null) {
                    val = vm.posSaleCoffeeForm.code;
                }
                if (val === "" || val === undefined) {
                    this.$message({
                        duration: 1000,
                        message: "Item Can't Empty!!",
                        type: 'error'
                    });
                    let s = new buzz.sound('/the-calling.mp3');
                    s.play();
                    return false;
                }

                let isFound = vm.posSaleCoffeeData.find(function (element) {
                    return element.itemId === val || element.code === val;
                });
                if (isFound !== undefined) {
                    this.$message({
                        type: 'error',
                        message: 'Item already add!'
                    });
                    let s = new buzz.sound('/the-calling.mp3');
                    s.play();
                    return false;
                }
                vm.posSaleCoffeeForm.isRetail = true;
                Meteor.call("queryPosProductById", val, (err, data) => {
                    if (data) {
                        Meteor.call("queryPosAverageCostById", data._id, Session.get("area"), vm.posSaleCoffeeForm.locationId, (err, dataStock) => {
                            if (dataStock) {
                                vm.posSaleCoffeeData.push({
                                    itemId: data._id,
                                    itemName: data.code + " : " + data.name,
                                    code: data.code,
                                    unit1: 1,
                                    unit2: 1,
                                    totalUnit: 1,
                                    unitId: data.unitId,
                                    unitName: data.unitName,

                                    price: vm.posSaleCoffeeForm.isRetail === true ? vm.$_numeral(data.rePrice).value() : vm.$_numeral(data.whPrice).value(),
                                    qty: vm.$_numeral(1).value(),
                                    amount: vm.posSaleCoffeeForm.isRetail === true ? formatCurrency(data.rePrice) : formatCurrency(data.whPrice),
                                    isRetail: true,
                                    desc: "",
                                    rawQty: vm.$_numeral(dataStock.qtyEnding).value()
                                });

                                vm.posSaleCoffeeForm.itemId = "";
                                vm.posSaleCoffeeForm.code = "";
                                vm.$message({
                                    duration: 1000,
                                    message: `បន្ថែម ` + data.code + " : " + data.name + " បានជោគជ័យ !",
                                    type: 'success'
                                });

                                this.getTotal();

                            } else {
                                vm.$message({
                                    duration: 3000,
                                    message: "ទំនិញនេះ អស់ពីស្តុកហើយ!!",
                                    type: 'error'
                                });
                                let s = new buzz.sound('/the-calling.mp3');
                                s.play();
                            }
                        })
                    } else {
                        vm.$message({
                            duration: 1000,
                            message: "មិនមានឈ្មេាះនេះឡើយ!!",
                            type: 'error'
                        });
                        let s = new buzz.sound('/the-calling.mp3');
                        s.play();
                    }
                })
            },
            removePosSaleCoffeeDetailByIndex(index, row) {
                this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {

                    this.posSaleCoffeeData.splice(index, 1);
                    this.$message({
                        message: `លុប ${row.itemName} បានជោគជ័យ`,
                        type: 'success'
                    });
                    this.getTotal();

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });
            }
            ,
            updatePosSaleCoffeeDetail(row, index) {
                if (row.qty > row.rawQty) {
                    this.$message({
                        type: 'error',
                        message: 'ស្តុកមានមិនគ្រប់គ្រាន់ ។ ស្តុកនៅសល់តែ ' + row.rawQty + ' ប៉ុន្នោះ !!'
                    });
                }
                row.totalUnit = this.$_math.round(row.unit1 * row.unit2 * row.qty, 2);
                row.amount = formatCurrency(row.price * row.totalUnit);

                this.posSaleCoffeeData[index] = row;
                /*this.$message({
                    duration: 1000,
                    message: `Update Row Number ` + newIndex + " Successfully !",
                    type: 'success'
                });*/
                this.getTotal();
            }

            ,
            updatePosSaleCoffeeDetailByRetail(row, index) {
                let vm = this;
                Meteor.call("queryPosProductById", row.itemId, (err, data) => {
                    if (data) {
                        if (row.isRetail === true) {
                            row.price = data.rePrice;
                            row.amount = vm.$_numeral(formatCurrency(data.rePrice * row.totalUnit)).value();
                        } else {
                            row.price = data.whPrice;
                            row.amount = vm.$_numeral(formatCurrency(data.whPrice * row.totalUnit)).value();

                        }
                        this.posSaleCoffeeData[index] = row;
                        let newIndex = index + 1;
                        this.$message({
                            duration: 1000,
                            message: `Update Row Number ` + newIndex + " Successfully !",
                            type: 'success'
                        });
                        this.getTotal();
                    }
                })
            }
            ,
            clearZero(event) {
                /*debugger;
                $(event.currentTarget).select();
                console.log(event);*/
            }
            ,
            cancel() {
                this.resetForm();
                this.$message({
                    type: 'info',
                    message: this.langConfig['cancel']
                });
            }
            ,
            resetForm() {
                this.posSaleCoffeeData = [];
                this.posSaleCoffeeForm.discountValue = 0;
                this.posSaleCoffeeForm.code = "";
                this.posSaleCoffeeForm.paidUSD = 0;
                this.posSaleCoffeeForm.paidKHR = 0;
                this.posSaleCoffeeForm.paidTHB = 0;
                this.posSaleCoffeeForm.discount = 0;
                this.posSaleCoffeeForm.saleCoffeeNo = "";
                this.posSaleCoffeeForm.customerId = "";
                this.posSaleCoffeeForm.locationId = "";
                this.posSaleCoffeeForm.balanceNotCut = 0;


                if (this.$refs["posSaleCoffeeFormAdd"]) {
                    this.$refs["posSaleCoffeeFormAdd"].resetFields();
                }
                if (this.$refs["posSaleCoffeeFormUpdate"]) {
                    this.$refs["posSaleCoffeeFormUpdate"].resetFields();
                }
                this.getTotal();

            }
            ,
            getTotal() {
                let vm = this;
                let total = 0;
                vm.posSaleCoffeeData.forEach(function (obj) {
                    total += parseFloat(vm.$_numeral(obj.amount).value());

                });
                if (total >= vm.$_numeral(vm.posSaleCoffeeForm.balanceNotCutFull).value()) {
                    vm.posSaleCoffeeForm.balanceNotCut = vm.posSaleCoffeeForm.balanceNotCutFull;
                } else {
                    vm.posSaleCoffeeForm.balanceNotCut = formatCurrency(total);
                }
                let companyDoc = WB_waterBillingSetup.findOne({rolesArea: Session.get("area")});
                this.currencySymbol = getCurrencySymbolById(companyDoc.baseCurrency);
                vm.posSaleCoffeeForm.total = formatCurrencyLast(total, companyDoc.baseCurrency);

                if (vm.posSaleCoffeeForm.discountType === "Amount") {
                    vm.posSaleCoffeeForm.netTotal = formatCurrencyLast(total - vm.posSaleCoffeeForm.discount, companyDoc.baseCurrency);
                    vm.posSaleCoffeeForm.balanceUnpaid = formatCurrencyLast(total - vm.posSaleCoffeeForm.discount - vm.$_numeral(vm.posSaleCoffeeForm.balanceNotCut).value() - GeneralFunction.exchange("USD", companyDoc.baseCurrency, vm.posSaleCoffeeForm.paidUSD, Session.get("area")) - GeneralFunction.exchange("KHR", companyDoc.baseCurrency, vm.posSaleCoffeeForm.paidKHR, Session.get("area")) - GeneralFunction.exchange("THB", companyDoc.baseCurrency, vm.posSaleCoffeeForm.paidTHB, Session.get("area")), companyDoc.baseCurrency);

                    vm.posSaleCoffeeForm.remainUSD = formatCurrencyLast(GeneralFunction.exchange(companyDoc.baseCurrency, "USD", vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(), Session.get("area")), "USD");
                    vm.posSaleCoffeeForm.remainKHR = formatCurrencyLast(GeneralFunction.exchange(companyDoc.baseCurrency, "KHR", vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(), Session.get("area")), "KHR");
                    vm.posSaleCoffeeForm.remainTHB = formatCurrencyLast(GeneralFunction.exchange(companyDoc.baseCurrency, "THB", vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(), Session.get("area")), "THB");
                    vm.posSaleCoffeeForm.discountValue = formatCurrencyLast(vm.posSaleCoffeeForm.discount, companyDoc.baseCurrency);

                    vm.posSaleCoffeeForm.balanceUnpaid = vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value() <= 0 ? 0 : vm.posSaleCoffeeForm.balanceUnpaid;
                    this.typeDiscount = getCurrencySymbolById(companyDoc.baseCurrency);
                } else {
                    vm.posSaleCoffeeForm.netTotal = formatCurrencyLast(total - (total * vm.posSaleCoffeeForm.discount / 100), companyDoc.baseCurrency);
                    vm.posSaleCoffeeForm.balanceUnpaid = formatCurrencyLast(total - (total * vm.posSaleCoffeeForm.discount / 100) - GeneralFunction.exchange("USD", companyDoc.baseCurrency, vm.posSaleCoffeeForm.paidUSD, Session.get("area")) - GeneralFunction.exchange("KHR", companyDoc.baseCurrency, vm.posSaleCoffeeForm.paidKHR, Session.get("area")) - GeneralFunction.exchange("THB", companyDoc.baseCurrency, vm.posSaleCoffeeForm.paidTHB, Session.get("area")), companyDoc.baseCurrency);

                    vm.posSaleCoffeeForm.remainUSD = formatCurrencyLast(GeneralFunction.exchange(companyDoc.baseCurrency, "USD", vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(), Session.get("area")), "USD");
                    vm.posSaleCoffeeForm.remainKHR = formatCurrencyLast(GeneralFunction.exchange(companyDoc.baseCurrency, "KHR", vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(), Session.get("area")), "KHR");
                    vm.posSaleCoffeeForm.remainTHB = formatCurrencyLast(GeneralFunction.exchange(companyDoc.baseCurrency, "THB", vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value(), Session.get("area")), "THB");
                    vm.posSaleCoffeeForm.discountValue = formatCurrencyLast((total * vm.posSaleCoffeeForm.discount / 100), companyDoc.baseCurrency);

                    vm.posSaleCoffeeForm.balanceUnpaid = vm.$_numeral(vm.posSaleCoffeeForm.balanceUnpaid).value() <= 0 ? 0 : vm.posSaleCoffeeForm.balanceUnpaid;
                    this.typeDiscount = "%";
                }
            },
            printSaleCoffee(data) {
                if (data.transactionType === "SaleCoffee Sale Order") {
                    FlowRouter.go('/pos-data/posSaleCoffeeReceiveItem/print?inv=' + data._id);
                } else {
                    FlowRouter.go('/pos-data/posSaleCoffee/print?inv=' + data._id);
                }

            }
        },
        created() {
            this.isSearching = true;
            this.getTotal();
            this.locationOpt();
            Meteor.subscribe('Pos_InvoiceReact');

            Meteor.call('getWaterBillingSetup', Session.get('area'), (err, result) => {
                if (result) {
                    this.waterBillingSetup = result;
                }
            })

        },
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['saleCoffee'];
                return data;
            }
        }
    }


</script>

<style>
    .card {
        display: inline-block;
        position: relative;
        width: 100%;
        margin: 0px 0 !important;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .14);
        border-radius: 6px;
        color: rgba(0, 0, 0, .87);
        background: #fff;
    }

    .w3-code-coffee {
        width: auto;
        background-color: black !important;
        padding: 8px 12px;
        border-left: 4px solid #4CAF50;
        word-wrap: break-word;
    }

    .image {
        width: 120px !important;
        height: 100px !important;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>




