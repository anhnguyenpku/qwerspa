<template>
    <div class="chart-account">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" @click="dialogAddChartAccount = true,resetForm()">
                            <i class="fa fa-plus"></i> Chart Account
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
                                    placeholder="Search Here..."
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
                        <loader></loader>
                    </div>
                </div>
            </slot>
            <slot v-else>
                <el-table
                        :data="chartAccountData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="code"
                            label="Code"
                            width="120"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="Name"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="subAccountOfName"
                            label="Sub Account Of">
                    </el-table-column>
                    <el-table-column
                            prop="accountTypeName"
                            label="Account Type">
                    </el-table-column>
                    <el-table-column
                            prop="level"
                            sortable
                            width="120"
                            label="Level">
                    </el-table-column>
                    <!--<el-table-column
                            prop="description"
                            sortable
                            label="Description">
                    </el-table-column>-->

                    <!--
                                        <el-table-column
                                                label="Tax">
                                            <template slot-scope="scope">
                                                <div v-if="scope.row.isPaidTax"><span class="label label-success">Paid</span></div>
                                                <div v-else><span class="label label-warning">Not Paid</span></div>
                                            </template>
                                        </el-table-column>
                    -->


                    <el-table-column
                            prop="isPaidTax"
                            label="Tax"
                            width="150"
                            filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.isPaidTax === false ? 'primary' : 'success'"
                                    close-transition>{{scope.row.isPaidTax==true? "Paid" : "Not Paid"}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="isPayment"
                            label="Paid Method"
                            width="150"
                            filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.isPayment === false ? 'primary' : 'success'"
                                    close-transition>{{scope.row.isPayment==true? "True" : "False"}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="mapToAccount"
                            sortable
                            width="120"
                            label="Map To">
                    </el-table-column>
                    <el-table-column
                            label="Action"
                            width="160"
                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removeChartAccount(scope.$index,scope.row,chartAccountData)"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                           @click="findChartAccountById(scope),dialogUpdateChartAccount = true"></el-button>
                                <el-button type="success" icon="el-icon-info" size="small" class="cursor-pointer"
                                           @click="findChartAccountById(scope),dialogMapChartAccount = true"></el-button>
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
                title="Add Chart Account"
                :visible.sync="dialogAddChartAccount"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="chartAccountForm" :rules="rules" ref="chartAccountFormAdd" label-width="120px"
                     class="chartAccountForm">
                <el-form-item label="Name" prop="name">
                    <el-input v-model="chartAccountForm.name"></el-input>
                </el-form-item>
                <el-form-item label="Khmer Name" prop="khName">
                    <el-input v-model="chartAccountForm.khName"></el-input>
                </el-form-item>
                <el-form-item label="Account Type" prop="accountTypeId">
                    <el-select style="display: block !important;" filterable clearable
                               v-model="chartAccountForm.accountTypeId"
                               placeholder="Account Type">
                        <el-option
                                v-for="item in accountTypeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Sub Account Of" prop="subAccountOf">
                    <el-select style="display: block !important;" filterable clearable
                               v-model="chartAccountForm.subAccountOf"
                               placeholder="Sub Account Of">
                        <el-option
                                v-for="item in chartAccountDataOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Code" prop="code">
                    <el-input v-model="chartAccountForm.code"></el-input>
                </el-form-item>
                <el-form-item label="Memo" prop="description">
                    <el-input type="textarea" v-model="chartAccountForm.description"></el-input>
                </el-form-item>

                <div class="row">
                    <div class="col-md-6">
                        <el-form-item label="Paid Tax">
                            <el-switch on-text="" off-text="" v-model="chartAccountForm.isPaidTax"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="col-md-6">
                        <el-form-item label="Is Payment Type">
                            <el-switch on-text="" off-text="" v-model="chartAccountForm.isPayment"></el-switch>
                        </el-form-item>
                    </div>
                </div>


                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogAddChartAccount = false, cancel()">Cancel</el-button>
                    <el-button type="primary" @click="saveChartAccount">Save</el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
        <!--End Form modal-->

        <!--Form Modal-->
        <el-dialog
                title="Update Chart Account"
                :visible.sync="dialogUpdateChartAccount"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="chartAccountForm" :rules="rules" ref="chartAccountFormUpdate" label-width="120px"
                     class="chartAccountForm">

                <el-form-item label="Name" prop="name">
                    <el-input v-model="chartAccountForm.name"></el-input>
                </el-form-item>

                <el-form-item label="Khmer Name" prop="khName">
                    <el-input v-model="chartAccountForm.khName"></el-input>
                </el-form-item>

                <el-form-item label="Account Type" prop="accountTypeId">
                    <el-select style="display: block !important;" filterable clearable
                               v-model="chartAccountForm.accountTypeId"
                               placeholder="Account Type">
                        <el-option
                                v-for="item in accountTypeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Sub Account Of" prop="subAccountOf">
                    <el-select style="display: block !important;" filterable clearable
                               v-model="chartAccountForm.subAccountOf"
                               placeholder="Sub Account Of">
                        <el-option
                                v-for="item in chartAccountDataOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Code" prop="code">
                    <el-input v-model="chartAccountForm.code"></el-input>
                </el-form-item>
                <el-form-item label="Memo" prop="description">
                    <el-input type="textarea" v-model="chartAccountForm.description"></el-input>
                </el-form-item>

                <div class="row">
                    <div class="col-md-6">
                        <el-form-item label="Paid Tax">
                            <el-switch on-text="" off-text="" v-model="chartAccountForm.isPaidTax"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="col-md-6">
                        <el-form-item label="Is Payment Type">
                            <el-switch on-text="" off-text="" v-model="chartAccountForm.isPayment"></el-switch>
                        </el-form-item>
                    </div>
                </div>

                <input type="hidden" v-model="chartAccountForm._id"/>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogUpdateChartAccount = false ,cancel()">Cancel</el-button>
                    <el-button type="primary" @click="updateChartAccount">Save</el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>

        <!--Form Modal-->
        <el-dialog
                title="Map Chart Account"
                :visible.sync="dialogMapChartAccount"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="chartAccountForm" :rules="rules" ref="mapChartAccount" label-width="120px"
                     class="chartAccountForm">

                <el-form-item label="Map To Account" prop="mapToAccount">
                    <el-select style="display: block !important;" filterable clearable
                               v-model="mapToAccount" placeholder="Map Account">
                        <el-option
                                v-for="item in mapAccountData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Name" prop="name">
                    <el-input v-model="chartAccountForm.name" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="Khmer Name" prop="khName">
                    <el-input v-model="chartAccountForm.khName" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="Account Type" prop="accountTypeId">
                    <el-select style="display: block !important;" filterable clearable
                               v-model="chartAccountForm.accountTypeId"
                               placeholder="Account Type" :disabled="true">
                        <el-option
                                v-for="item in accountTypeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Sub Account Of" prop="subAccountOf">
                    <el-select style="display: block !important;" filterable clearable
                               v-model="chartAccountForm.subAccountOf"
                               placeholder="Sub Account Of" :disabled="true">
                        <el-option
                                v-for="item in chartAccountDataOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Code" prop="code">
                    <el-input v-model="chartAccountForm.code" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="Memo" prop="description">
                    <el-input type="textarea" v-model="chartAccountForm.description" :disabled="true"></el-input>
                </el-form-item>

                <div class="row">
                    <div class="col-md-6">
                        <el-form-item label="Paid Tax">
                            <el-switch on-text="" off-text="" v-model="chartAccountForm.isPaidTax"
                                       :disabled="true"></el-switch>
                        </el-form-item>
                    </div>
                    <div class="col-md-6">
                        <el-form-item label="Is Payment Type">
                            <el-switch on-text="" off-text="" v-model="chartAccountForm.isPayment"
                                       :disabled="true"></el-switch>
                        </el-form-item>
                    </div>
                </div>

                <input type="hidden" v-model="chartAccountForm._id"/>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogUpdateChartAccount = false ,cancel()">Cancel</el-button>
                    <el-button type="primary" @click="updateMapChartAccount">Save</el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
        <!--End Form modal-->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                chartAccountData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddChartAccount: false,
                dialogUpdateChartAccount: false,
                dialogMapChartAccount: false,

                mapToAccount: "",

                chartAccountForm: {
                    name: "",
                    khName: "",
                    code: "",
                    subAccountOf: "",
                    accountTypeId: "",
                    description: "",
                    isPaidTax: false,
                    isPayment: false,
                    _id: ""
                },
                rules: {
                    name: [{required: true, message: 'Please input name', trigger: 'blur'}],
                    code: [{required: true, message: 'Please input Code', trigger: 'blur'}],
                    accountTypeId: [{required: true, message: 'Please input Account Type', trigger: 'blur'}],

                },
                // Options
                accountTypeData: [],
                mapAccountData: [
                    {value: "001", label: "001 : Exchange Gain"},
                    {value: "002", label: "002 : Exchange Lose"},
                    {value: "003", label: "003 : Equivalence Foreign Exchange Position Account (36)"},
                    {value: "004", label: "004 : Foreign Exchange Position Account (29)"},
                ],
                chartAccountDataOption: [],
                accountTypeId: ""
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
            "chartAccountForm.accountTypeId"(val) {
                if (val != this.accountTypeId) {
                    this.chartAccountForm.subAccountOf = "";
                }
                this.accountTypeId = val;
                this.parentChartAccountOption();
            }
        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            queryData: _.debounce(function (val, skip, limit) {
                Meteor.call('queryChartAccount', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.chartAccountData = result.content;
                        this.count = result.countChartAccount;
                    }
                    this.isSearching = false;
                });
            }, 300),
            accountTypeOption() {
                Meteor.call('queryAccountTypeOption', (err, result) => {
                    this.accountTypeData = result;
                })
            },
            parentChartAccountOption() {
                let selector = {};
                if (this.accountTypeId != "" && this.accountTypeId != undefined) {
                    selector.accountTypeId = this.accountTypeId;
                }
                Meteor.call('queryParentChartAccountOption', selector, this.chartAccountForm._id, (err, result) => {
                    this.chartAccountDataOption = result;
                })
            },
            saveChartAccount() {
                let vm = this;
                this.$refs["chartAccountFormAdd"].validate((valid) => {
                    if (valid) {
                        let chartAccountDoc = {
                            code: vm.chartAccountForm.code,
                            name: vm.chartAccountForm.name,
                            khName: vm.chartAccountForm.khName,
                            subAccountOf: vm.chartAccountForm.subAccountOf,
                            accountTypeId: vm.chartAccountForm.accountTypeId,
                            description: vm.chartAccountForm.description,
                            isPaidTax: vm.chartAccountForm.isPaidTax,
                            isPayment: vm.chartAccountForm.isPayment
                        };

                        Meteor.call("insertChartAccount", chartAccountDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `Save Successfully!`,
                                    type: 'success'
                                });
                                vm.dialogAddChartAccount = false;
                                vm.queryData();
                                vm.accountTypeOption();
                                vm.parentChartAccountOption();
                                vm.$refs["chartAccountForm"].resetFields();
                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: err.message,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            updateChartAccount() {
                let vm = this;
                this.$refs["chartAccountFormUpdate"].validate((valid) => {
                    if (valid) {
                        let chartAccountDoc = {
                            _id: vm.chartAccountForm._id,
                            code: vm.chartAccountForm.code,
                            name: vm.chartAccountForm.name,
                            khName: vm.chartAccountForm.khName,
                            subAccountOf: vm.chartAccountForm.subAccountOf,
                            accountTypeId: vm.chartAccountForm.accountTypeId,
                            description: vm.chartAccountForm.description,
                            isPaidTax: vm.chartAccountForm.isPaidTax,
                            isPayment: vm.chartAccountForm.isPayment
                        };

                        Meteor.call("updateChartAccount", chartAccountDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Successfully
                        !`,
                                    type: 'success'
                                });
                                vm.dialogUpdateChartAccount = false;
                                vm.queryData();
                                vm.accountTypeOption();
                                vm.parentChartAccountOption();
                                vm.$refs["chartAccountForm"].resetFields();
                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Failed
                        !`,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            updateMapChartAccount() {
                let vm = this;
                this.$refs["mapChartAccount"].validate((valid) => {
                    if (valid) {
                        let chartAccountDoc = {
                            _id: vm.chartAccountForm._id,
                            code: vm.chartAccountForm.code,
                            name: vm.chartAccountForm.name,
                            khName: vm.chartAccountForm.khName,
                            subAccountOf: vm.chartAccountForm.subAccountOf,
                            accountTypeId: vm.chartAccountForm.accountTypeId,
                            description: vm.chartAccountForm.description,
                            isPaidTax: vm.chartAccountForm.isPaidTax,
                            isPayment: vm.chartAccountForm.isPayment,
                            mapToAccount: vm.mapToAccount
                        };

                        Meteor.call("updateChartAccount", chartAccountDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Successfully
                        !`,
                                    type: 'success'
                                });
                                vm.dialogMapChartAccount = false;
                                vm.queryData();
                                vm.accountTypeOption();
                                vm.parentChartAccountOption();
                                vm.$refs["chartAccountForm"].resetFields();
                            } else {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Failed
                        !`,
                                    type: 'error'
                                });
                            }
                        })
                    }
                })

            },
            removeChartAccount(index, row, rows) {
                let vm = this;
                this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call("removeChartAccount", row._id, (err, result) => {
                        if (!err) {
                            rows.splice(index, 1);

                            vm.$message({
                                message: `
                        លុប ${row.code} : ${row.name} បានជោគជ័យ`,
                                type: 'success'
                            });

                            vm.accountTypeOption();
                            vm.queryParentChartAccountOption();
                        } else {
                            vm.$message({
                                type: 'error',
                                message: 'Delete Fialed'
                            });
                        }

                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });


            },
            findChartAccountById(doc) {
                let vm = this;
                vm.chartAccountForm = {};
                vm.mapToAccount = "";

                Meteor.call("queryChartAccountById", doc.row._id, (err, result) => {
                    if (result) {
                        vm.accountTypeId = result.accountTypeId;
                        vm.chartAccountForm._id = result._id;
                        if (result.subAccountOf == undefined || result.subAccountOf == "") {
                            result.subAccountOf = "";
                        }
                        vm.chartAccountForm = result;
                        vm.mapToAccount = result.mapToAccount;
                    }
                })
            },
            cancel() {
                this.$message({
                    type: 'info',
                    message: 'Canceled'
                });
                this.resetForm();
            },
            resetForm() {
                this.chartAccountForm.isPayment = false;
                this.chartAccountForm.isPaidTax = false;
                this.mapToAccount = "";
                this.chartAccountForm = {
                    name: "",
                    khName: "",
                    code: "",
                    subAccountOf: "",
                    accountTypeId: "",
                    description: "",
                    isPaidTax: false,
                    isPayment: false,
                    _id: ""
                };
                if (this.$refs["chartAccountFormAdd"]) {
                    this.$refs["chartAccountFormAdd"].resetFields();
                }

                if (this.$refs["chartAccountFormUpdate"]) {
                    this.$refs["chartAccountFormUpdate"].resetFields();
                }

                if (this.$refs["mapChartAccount"]) {
                    this.$refs["mapChartAccount"].resetFields();
                }
            }
        },
        created() {
            this.isSearching = true;
            this.accountTypeOption();
            this.parentChartAccountOption();
            this.queryData();
        }
    }
</script>