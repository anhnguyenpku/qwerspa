<template>
    <div class="change-block">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons">streetview</i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer"
                           @click="findCustomerById(changeBlockForm.customerId),dialogAddChangeBlock = true,resetForm()">
                            <i class="fa fa-plus"></i> {{customerDisplay}}
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
                        :data="changeBlockData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="changeDate"
                            label="Change Date"
                            sortable>
                        <template slot-scope="scope">
                            {{formateDate(scope.row.changeDate)}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="newDPC"
                            label="New DPC">
                    </el-table-column>
                    <el-table-column
                            prop="districtDisplay"
                            label="District"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="quartierDisplay"
                            label="Quartier">
                    </el-table-column>
                    <el-table-column
                            prop="blockDisplay"
                            label="Block">
                    </el-table-column>
                    <el-table-column
                            label="Action"
                            width="140"
                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removeChangeBlock(scope.$index,scope.row,changeBlockData)"></el-button>
                                <el-button :disabled="true" type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                ></el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>

                </el-table>
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
                title="Add Change Block"
                :visible.sync="dialogAddChangeBlock"
                size="large">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :label-position="labelPosition" :model="changeBlockForm" :rules="rules" ref="changeBlockFormAdd"
                     label-width="120px"
                     class="changeBlockForm">
                <div class="row">
                    <div class="col-md-5">
                        <el-col :span="24">

                            <el-form-item label="Customer" prop="customerDisplay">
                                <el-input :disabled="true" v-model="customerDisplay"></el-input>
                            </el-form-item>

                            <!--<el-form-item label="Customer" prop="customerId">
                                    <el-input :disabled="true" v-model="changeBlockForm.customerId"></el-input>
                            </el-form-item>-->

                            <el-form-item label="District" prop="customerDistrict">
                                <el-select style="display: block !important;" filterable clearable disabled
                                           v-model="changeBlockForm.customerDistrict"
                                           placeholder="District">

                                    <el-option
                                            v-for="item in customerDistrictOptionData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="Quartier" prop="customerQuartier">
                                <el-select style="display: block !important;" filterable clearable disabled
                                           v-model="changeBlockForm.customerQuartier"
                                           placeholder="Quartier">
                                    <el-option
                                            v-for="item in customerQuartierOptionData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="Block" prop="customerBlock">
                                <el-select style="display: block !important;" filterable clearable disabled
                                           v-model="changeBlockForm.customerBlock"
                                           placeholder="Block">
                                    <el-option
                                            v-for="item in customerBlockOptionData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item label="Folio" prop="customerFolio">
                                <el-input :disabled="true" v-model="changeBlockForm.customerFolio"></el-input>
                            </el-form-item>

                            <el-form-item label="Successor" prop="customerSuccessor">
                                <el-input :disabled="true" v-model="changeBlockForm.customerSuccessor"></el-input>
                            </el-form-item>

                            <el-form-item label="Street" prop="customerStreet">
                                <el-input :disabled="true" v-model="changeBlockForm.customerStreet"></el-input>
                            </el-form-item>

                            <el-form-item label="DPC" prop="customerDPC">
                                <el-input :disabled="true" v-model="changeBlockForm.customerDPC"></el-input>
                            </el-form-item>


                        </el-col>
                    </div>
                    <div class="col-md-2" style="text-align: center;">
                        <div class="card-header card-header-icon" data-background-color="purple">
                            <i class="material-icons">send</i>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <el-col :span="24">

                            <el-form-item label="Change Date" prop="changeDate">
                                <el-date-picker :disabled="disabledDate" :picker-options="options"
                                                v-model="changeBlockForm.changeDate"
                                                type="date"
                                                style="width: 100%;"
                                                placeholder="Pick a day">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="District" prop="newDistrict">
                                <el-select style="display: block !important;" filterable
                                           v-model="changeBlockForm.newDistrict"
                                           placeholder="New District">
                                    <el-option
                                            v-for="item in newDistrictOptionData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="New Quartier" prop="newQuartier">
                                <el-select style="display: block !important;" filterable
                                           v-model="changeBlockForm.newQuartier"
                                           placeholder="New Quartier">
                                    <el-option
                                            v-for="item in newQuartierOptionData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="New Block" prop="newBlock">
                                <el-select style="display: block !important;" filterable
                                           v-model="changeBlockForm.newBlock"
                                           placeholder="New Block">
                                    <el-option
                                            v-for="item in newBlockOptionData"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item label="New Folio" prop="newFolio">
                                <el-input v-model="changeBlockForm.newFolio"></el-input>
                            </el-form-item>

                            <el-form-item label="New Successor" prop="newSuccessor">
                                <el-input v-model="changeBlockForm.newSuccessor"></el-input>
                            </el-form-item>

                            <el-form-item label="New Street" prop="newStreet">
                                <el-input v-model="changeBlockForm.newStreet"></el-input>
                            </el-form-item>

                            <el-form-item label="New DPC" prop="newDPC">
                                <el-input :disabled="true" v-model="changeBlockForm.newDPC"></el-input>
                            </el-form-item>


                        </el-col>
                    </div>

                </div>

                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogAddChangeBlock = false, cancel()">Cancel</el-button>
                    <el-button type="primary" @click.native="saveChangeBlock($event)">Save</el-button>
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
                disabledDate: false,
                labelPosition: "left",
                changeBlockData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddChangeBlock: false,
                dialogUpdateChangeBlock: false,


                customerDisplay: "",
                // customerDistrict:"",
                provinceId: "",
                changeBlockForm: {
                    customerId: FlowRouter.getParam('customerId'),
                    customerDistrict: "",
                    customerQuartier: "",
                    customerBlock: "",
                    customerFolio: "",
                    customerSuccessor: "",
                    customerStreet: "",
                    customerDPC: "",

                    newDistrict: "",
                    newQuartier: "",
                    newBlock: "",
                    newFolio: "",
                    newSuccessor: "",
                    newStreet: "",
                    newDPC: "",
                    changeDate: "",
                    _id: ""
                },
                rules: {
                    newFolio: [{required: true, message: 'Please Input New Folio', trigger: 'blur'}],
                    newSuccessor: [{required: true, message: 'Please Input New Street', trigger: 'blur'}],
                    newStreet: [{required: true, message: 'Please Input New Street', trigger: 'blur'}],
                    changeDate: [{
                        type: 'date',
                        required: true,
                        message: 'Please input Journal Date',
                        trigger: 'blur'
                    }],
                    newDistrict: [{required: true, message: 'Please input Account Type', trigger: 'blur'}],
                    newQuartier: [{required: true, message: 'Please input Account Type', trigger: 'blur'}],
                    newBlock: [{required: true, message: 'Please input Account Type', trigger: 'blur'}],
                },
                // Options
                customerOptionData: [],

                customerDistrictOptionData: [],
                customerQuartierOptionData: [],
                customerBlockOptionData: [],

                newDistrictOptionData: [],
                newQuartierOptionData: [],
                newBlockOptionData: [],
                options: {
                    disabledDate(time) {
                        return false;
                    }
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
            'changeBlockForm.newDistrict'(val) {
                this.newQuartierOption(val);
                let vm = this;
                if (vm.changeBlockForm.newDistrict && vm.changeBlockForm.newQuartier && vm.changeBlockForm.newBlock && vm.changeBlockForm.newFolio && vm.changeBlockForm.newSuccessor) {
                    this.generateNewDPC(vm.changeBlockForm.newDistrict, vm.changeBlockForm.newQuartier, vm.changeBlockForm.newBlock, vm.changeBlockForm.newFolio, vm.changeBlockForm.newSuccessor)
                }
            },
            'changeBlockForm.newQuartier'(val) {
                this.newBlockOption(val);
                let vm = this;
                if (vm.changeBlockForm.newDistrict && vm.changeBlockForm.newQuartier && vm.changeBlockForm.newBlock && vm.changeBlockForm.newFolio && vm.changeBlockForm.newSuccessor) {
                    this.generateNewDPC(vm.changeBlockForm.newDistrict, vm.changeBlockForm.newQuartier, vm.changeBlockForm.newBlock, vm.changeBlockForm.newFolio, vm.changeBlockForm.newSuccessor)
                }
            },
            'changeBlockForm.newBlock'(val) {
                let vm = this;
                if (vm.changeBlockForm.newDistrict && vm.changeBlockForm.newQuartier && vm.changeBlockForm.newBlock && vm.changeBlockForm.newFolio && vm.changeBlockForm.newSuccessor) {
                    this.generateNewDPC(vm.changeBlockForm.newDistrict, vm.changeBlockForm.newQuartier, vm.changeBlockForm.newBlock, vm.changeBlockForm.newFolio, vm.changeBlockForm.newSuccessor)
                }
            },
            'changeBlockForm.newFolio'(val) {
                let vm = this;
                if (vm.changeBlockForm.newDistrict && vm.changeBlockForm.newQuartier && vm.changeBlockForm.newBlock && vm.changeBlockForm.newFolio && vm.changeBlockForm.newSuccessor) {
                    this.generateNewDPC(vm.changeBlockForm.newDistrict, vm.changeBlockForm.newQuartier, vm.changeBlockForm.newBlock, vm.changeBlockForm.newFolio, vm.changeBlockForm.newSuccessor)
                }
            },
            'changeBlockForm.newSuccessor'(val) {
                let vm = this;
                debugger;

                if (vm.changeBlockForm.newDistrict && vm.changeBlockForm.newQuartier && vm.changeBlockForm.newBlock && vm.changeBlockForm.newFolio && vm.changeBlockForm.newSuccessor) {
                    this.generateNewDPC(vm.changeBlockForm.newDistrict, vm.changeBlockForm.newQuartier, vm.changeBlockForm.newBlock, vm.changeBlockForm.newFolio, vm.changeBlockForm.newSuccessor)
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

            formateDate(date) {
                return moment(date).format('MMM DD, YYYY');
            },
            queryData: _.debounce(function (val, skip, limit) {
                Meteor.call('queryChangeBlock', {
                    q: val,
                    filter: this.filter,
                    customerId: this.changeBlockForm.customerId,
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.changeBlockData = result.content;
                        this.count = result.countChangeBlock;
                    }
                    this.isSearching = false;
                });
            }, 300),
            districtOption() {
                let vm = this;
                Meteor.call('fetchGeneralDistrictDataOne', {rolesArea: Session.get('area')}, (err, result) => {
                    if (result) {
                        vm.customerDistrictOptionData = result;
                        vm.newDistrictOptionData = result;
                    } else {
                        console.log(err.message);
                    }
                });
            },

            quartierOption() {
                let vm = this;
                Meteor.call('fetchQuartierByDistrictCodeIdOne', vm.changeBlockForm.customerDistrict, (err, result) => {
                    if (result) {
                        vm.customerQuartierOptionData = result;
                    } else {
                        console.log(err.message);
                    }
                });
            },
            newQuartierOption(newQuartier) {
                let vm = this;
                Meteor.call('fetchQuartierByDistrictCodeIdOne', newQuartier, (err, result) => {
                    if (result) {
                        vm.newQuartierOptionData = result;
                    } else {
                        console.log(err.message);
                    }
                });
            },
            blockOption() {
                let vm = this;
                Meteor.call('fetchBlockByQuartierCodeOne', vm.changeBlockForm.customerQuartier, (err, result) => {
                    if (result) {
                        vm.customerBlockOptionData = result;
                    } else {
                        console.log(err.message);
                    }
                });
            },
            newBlockOption(quartier) {
                let vm = this;
                Meteor.call('fetchBlockByQuartierCodeOne', quartier, (err, result) => {
                    if (result) {
                        vm.newBlockOptionData = result;
                    } else {
                        console.log(err.message);
                    }
                });
            },
            generateNewDPC(district, quartier, block, folio, successor) {
                let vm = this;
                let doc = {};
                doc.district = district;
                doc.quartier = quartier;
                doc.block = block;
                doc.folio = folio;
                doc.successor = successor;

                Meteor.call("generateDPC", doc, (err, result) => {
                    vm.changeBlockForm.newDPC = result;
                })
            },
            saveChangeBlock(event) {
                event.preventDefault();
                let vm = this;
                this.$refs["changeBlockFormAdd"].validate((valid) => {
                    if (valid) {
                        let changeBlockDoc = vm.changeBlockForm;
                        changeBlockDoc.rolesArea = Session.get('area');

                        Meteor.call("insertChangeBlock", changeBlockDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `Save Successfully!`,
                                    type: 'success'
                                });
                                vm.dialogAddChangeBlock = false;
                                vm.queryData();
                                vm.$refs["changeBlockForm"].resetFields();
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
            removeChangeBlock(index, row, rows) {
                let vm = this;

                Meteor.call("queryChangeBlockOneSortByDate", Session.get('area'), vm.changeBlockForm.customerId, function (err, result) {
                    if (row.changeDate.getTime() == result.changeDate.getTime()) {
                        vm.$confirm('This will permanently delete the file. Continue?', 'Warning', {
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            type: 'warning'
                        }).then(() => {
                            Meteor.call("removeChangeBlock", row._id, (err, result) => {
                                if (!err) {
                                    rows.splice(index, 1);
                                    vm.$message({
                                        message: `
                        លុប ${row.changeDate} : ${row.newDPC} បានជោគជ័យ`,
                                        type: 'success'
                                    });
                                } else {
                                    vm.$message({
                                        type: 'error',
                                        message: 'Delete Fialed'
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
                            message: "Can't Delete, Not Last Date"
                        });
                    }

                })

            },
            findCustomerById(id) {
                let vm = this;
                vm.changeBlockForm = {
                    customerDistrict: "",
                    customerQuartier: "",
                    customerBlock: "",
                    customerFolio: "",
                    customerSuccessor: "",
                    customerStreet: "",
                    customerDPC: "",
                    newDistrict: "",
                    newQuartier: "",
                    newBlock: "",
                    newFolio: "",
                    newSuccessor: "",
                    newStreet: "",
                    newDPC: "",
                    changeDate: "",

                };
                Meteor.call("getCustomerById", {_id: id}, (err, result) => {
                    if (result) {
                        if (result.contract.prevReading == 0 && result.prevReading == 0 && result.meterChangeHistoryId == null) {

                            FlowRouter.go("wb.meterChange");
                            vm.$message({
                                type: 'error',
                                message: "Can't Change Block, Not Old Customer!"
                            });
                            return false;
                        }

                        vm.changeBlockForm.customerId = result._id;
                        vm.changeBlockForm.customerDistrict = result.district;
                        vm.changeBlockForm.customerQuartier = result.quartier;
                        vm.changeBlockForm.customerBlock = result.block;
                        vm.changeBlockForm.customerFolio = result.folio;
                        vm.changeBlockForm.customerSuccessor = result.successor;
                        vm.changeBlockForm.customerStreet = result.streetNo;
                        vm.changeBlockForm.customerDPC = result.dpc;

                        vm.changeBlockForm.changeDate = new Date();
                        vm.changeBlockForm.newDistrict = result.district;
                        vm.changeBlockForm.newQuartier = result.quartier;
                        vm.changeBlockForm.newBlock = result.block;
                        vm.changeBlockForm.newFolio = result.folio;
                        vm.changeBlockForm.newSuccessor = result.successor;
                        vm.changeBlockForm.newStreet = result.streetNo;
                        vm.changeBlockForm.newDPC = result.dpc;

                        vm.customerDisplay = result._id + " : " + result.khName;

                        // vm.customerDistrict=result.district;
                        this.quartierOption();
                        this.blockOption();
                    }
                })

                Meteor.call("queryChangeBlockOneSortByDate", Session.get('area'), FlowRouter.getParam('customerId'), function (err, result) {
                    if (result) {
                        if (result.changeDate.getTime() > vm.changeBlockForm.changeDate.getTime()) {
                            vm.changeBlockForm.changeDate = moment(result.changeDate).add(1, "days").toDate();
                        }
                        vm.options = {
                            disabledDate(time) {
                                let min = moment(result.changeDate).add(1, "days").toDate().getTime();
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
                })


            },
            cancel() {
                this.$message({
                    type: 'info',
                    message: 'Canceled'
                });
            },
            resetForm() {
                if (this.$refs["changeBlockFormAdd"]) {
                    this.$refs["changeBlockFormAdd"].resetFields();
                }
                if (this.$refs["changeBlockFormUpdate"]) {
                    this.$refs["changeBlockFormUpdate"].resetFields();
                }
            }
        },
        created() {
            this.isSearching = true;
            this.queryData();
            this.districtOption();
            this.findCustomerById(this.changeBlockForm.customerId);


        }
    }
</script>
