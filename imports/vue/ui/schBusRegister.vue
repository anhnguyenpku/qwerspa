<template>
    <div class="sch_busRegister">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" @click="dialogAddSchBusRegister = true,popupSchBusRegisterAdd()">
                            <i class="fa fa-plus"></i> {{langConfig['title']}}
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
                        <!--<loader></loader>-->
                    </div>
                </div>
            </slot>
            <slot v-else>
                <el-table
                        :data="schBusRegisterData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="busRegisterDateName"
                            :label="langConfig['busRegisterDate']"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="studentDoc.personal.name"
                            :label="langConfig['student']"
                            sortable>
                    </el-table-column>

                    <el-table-column
                            prop="busDoc.name"
                            :label="langConfig['bus']"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="busStopDoc.name"
                            :label="langConfig['busStop']">
                    </el-table-column>
                    <el-table-column
                            prop="busStopType"
                            :label="langConfig['busStopType']">
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            :label="langConfig['price']">
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['action']"
                            width="120"
                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removeSchBusRegister(scope.$index,scope.row,schBusRegisterData)"
                                           :disabled="disabledRemove"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                           @click="popupSchBusRegisterUpdate(scope.row),findSchBusRegisterById(scope),dialogUpdateSchBusRegister= true"
                                           :disabled="disabledUpdate"></el-button>
                                </el-button>
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
                :visible.sync="dialogAddSchBusRegister"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schBusRegisterForm" :rules="rules" :ref="ref" label-width="120px"
                     class="schBusRegisterForm">
                <el-form-item :label="langConfig['busRegisterDate']" prop="busRegisterDate">
                    <el-date-picker
                            v-model="schBusRegisterForm.busRegisterDate"
                            type="date"
                            style="width: 100%;"
                            placeholder="Pick a day"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="langConfig['student']" prop="studentId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.studentId" remote :remote-method="studentOpt"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in studentList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['bus']" prop="busId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.busId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in busList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['busStop']" prop="busStopId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.busStopId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in busStopList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="langConfig['busStopType']" prop="busStopType">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.busStopType"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in busStopTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['price']" prop="price">
                    <el-input v-model="schBusRegisterForm.price"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['promotion']" prop="promotionId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.promotionId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in promotionList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogAddSchBusRegister = false, cancel()">{{langConfig['cancel']}}</el-button>
                    <el-button type="primary" @click="saveSchBusRegister">{{langConfig['save']}}</el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
        <!--End Form modal-->

        <!--Form Modal-->
        <el-dialog
                :title="langConfig['update']"
                :visible.sync="dialogUpdateSchBusRegister"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schBusRegisterForm" :rules="rules" :ref="ref" label-width="120px"
                     class="schBusRegisterForm">
                <el-form-item :label="langConfig['busRegisterDate']" prop="busRegisterDate">
                    <el-date-picker
                            v-model="schBusRegisterForm.busRegisterDate"
                            type="date"
                            style="width: 100%;"
                            placeholder="Pick a day"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="langConfig['student']" prop="studentId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.studentId" remote :remote-method="studentOpt"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in studentList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['bus']" prop="busId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.busId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in busList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['busStop']" prop="busStopId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.busStopId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in busStopList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="langConfig['busStopType']" prop="busStopType">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.busStopType"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in busStopTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['price']" prop="price">
                    <el-input v-model="schBusRegisterForm.price"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['promotion']" prop="promotionId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schBusRegisterForm.promotionId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in promotionList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <input type="hidden" v-model="schBusRegisterForm._id"/>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogUpdateSchBusRegister = false ,cancel()">{{langConfig['cancel']}}
                    </el-button>
                    <el-button type="primary" @click="updateSchBusRegister">{{langConfig['save']}}</el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import compoLang from '../../../both/i18n/lang/elem-label-sch'

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
        data() {
            return {
                ref: "",
                fullscreen: true,
                disableUpdateField: false,
                schBusRegisterData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddSchBusRegister: false,
                dialogUpdateSchBusRegister: false,
                studentList: [],
                promotionList: [],
                busList: [],
                busStopList: [],
                schBusRegisterForm: {
                    studentId: "",
                    busId: "",
                    busStopId: "",
                    busStopType: "",
                    promotionId: "",
                    busRegisterDate: "",
                    price: 0,
                    _id: "",

                },
                busStopTypeList: [
                    {label: "One Way", value: "One Way"},
                    {label: "Round", value: "Round"},
                    {label: "Three Turn", value: "Three Turn"},
                    {label: "Four Turn", value: "Four Turn"}
                ],
                rules: {
                    busRegisterDate: [{
                        type: 'date',
                        required: true,
                        message: 'Please input BusRegister Date',
                        trigger: 'blur'
                    }],
                    studentId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Student',
                            trigger: 'change'
                        }],
                    busId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Bus',
                            trigger: 'change'
                        }],
                    busStopId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Bus Stop',
                            trigger: 'change'
                        }],
                    promotionId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Promotion',
                            trigger: 'change'
                        }],
                },
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

        },
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            queryData: _.debounce(function (val, skip, limit) {
                Meteor.call('querySchBusRegister', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.schBusRegisterData = result.content;
                        this.count = result.countSchBusRegister;
                    }
                    this.isSearching = false;
                });
            }, 300),
            indexMethod(index) {
                return index + 1;
            },
            fetchUser() {
                Meteor.call("queryUserOption", (err, result) => {
                    this.applyUserOption = result;
                })
            },
            studentOpt(query) {
                let vm = this;
                if (!!query) {
                    //vm.loading = true;
                    setTimeout(() => {
                        //vm.loading = false;
                        Meteor.call('querySchStudentOption', query, (err, result) => {
                            if (!err) {
                                vm.studentList = result;
                            } else {
                                console.log(err.message);
                            }
                        })
                    }, 200);
                } else {
                    Meteor.call('querySchStudentOption', "", (err, result) => {
                        if (!err) {
                            vm.studentList = result;
                        } else {
                            console.log(err.message);
                        }
                    })
                }
            },
            busOpt() {
                let selector = {};

                Meteor.call("queryBusOption", selector, (err, result) => {
                    if (result) {
                        this.busList = result;
                    }
                })
            },
            busStopOpt() {
                let selector = {};
                Meteor.call("queryBusStopOption", selector, (err, result) => {
                    if (result) {
                        this.busStopList = result;
                    }
                })
            },
            promotionOpt() {
                let selector = {};
                Meteor.call("queryPromotionOption", selector, (err, result) => {
                    this.promotionList = result;
                })
            },
            saveSchBusRegister() {
                let vm = this;
                this.$refs["schBusRegisterFormAdd"].validate((valid) => {
                    if (valid) {
                        let schBusRegisterDoc = {
                            studentId: vm.schBusRegisterForm.studentId,
                            busId: vm.schBusRegisterForm.busId,
                            busStopId: vm.schBusRegisterForm.busStopId,
                            busStopType: vm.schBusRegisterForm.busStopType,
                            price: vm.schBusRegisterForm.price,
                            promotionId: vm.schBusRegisterForm.promotionId,
                            busRegisterDate: vm.schBusRegisterForm.busRegisterDate,
                            busRegisterDateName: moment(vm.schBusRegisterForm.busRegisterDate).format("DD/MM/YYYY"),
                            rolesArea: Session.get('area')
                        };
                        Meteor.call("insertSchBusRegister", schBusRegisterDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `Save Successfully!`,
                                    type: 'success'
                                });
                                vm.dialogAddSchBusRegister = false;
                                vm.queryData();

                                vm.$refs["schBusRegisterFormAdd"].resetFields();
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
            updateSchBusRegister() {
                let vm = this;
                this.$refs["schBusRegisterFormUpdate"].validate((valid) => {
                    if (valid) {
                        let schBusRegisterDoc = {
                            _id: vm.schBusRegisterForm._id,
                            studentId: vm.schBusRegisterForm.studentId,
                            busId: vm.schBusRegisterForm.busId,
                            busStopId: vm.schBusRegisterForm.busStopId,
                            busStopType: vm.schBusRegisterForm.busStopType,
                            price: vm.schBusRegisterForm.price,
                            promotionId: vm.schBusRegisterForm.promotionId,
                            busRegisterDate: vm.schBusRegisterForm.busRegisterDate,
                            busRegisterDateName: moment(vm.schBusRegisterForm.busRegisterDate).format("DD/MM/YYYY"),
                            rolesArea: Session.get('area')
                        };
                        Meteor.call("updateSchBusRegister", schBusRegisterDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Successfully
                        !`,
                                    type: 'success'
                                });
                                vm.dialogUpdateSchBusRegister = false;
                                vm.dialogUpdateSchBusRegisterToClass = false;
                                vm.queryData();

                                vm.$refs["schBusRegisterFormUpdate"].resetFields();
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
            removeSchBusRegister(index, row, rows) {
                let vm = this;
                this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call("removeSchBusRegister", row._id, (err, result) => {
                        if (!err) {
                            rows.splice(index, 1);

                            vm.$message({
                                message: `
                        លុប បានជោគជ័យ`,
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
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });


            },
            findSchBusRegisterById(doc) {
                let vm = this;
                vm.schBusRegisterForm = {};
                Meteor.call("querySchBusRegisterById", doc.row._id, (err, result) => {
                    if (result) {
                        vm.schBusRegisterForm._id = result._id;
                        vm.schBusRegisterForm = result;
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
                this.schBusRegisterForm._id = "";
                if (this.$refs["schBusRegisterFormAdd"]) {
                    this.$refs["schBusRegisterFormAdd"].resetFields();
                }

                if (this.$refs["schBusRegisterFormUpdate"]) {
                    this.$refs["schBusRegisterFormUpdate"].resetFields();
                }


            },
            popupSchBusRegisterAdd() {
                this.ref = "schBusRegisterFormAdd";

                this.resetForm();
                this.studentOpt();
                this.promotionOpt();

            },
            popupSchBusRegisterUpdate(row) {
                this.ref = "schBusRegisterFormUpdate";
                this.resetForm();
                this.studentOpt(row.studentDoc._id);
                this.promotionOpt();

            },
        },
        created() {
            this.isSearching = true;
            this.fetchUser();
            this.queryData();
            this.busOpt();
            this.busStopOpt();
        },
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['busRegister'];
                return data;
            }
        }
    }
</script>