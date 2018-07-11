<template>
    <div class="sch_register">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" @click="dialogAddSchRegister = true,popupSchRegisterAdd()">
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
                        :data="schRegisterData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="studentDoc.personal.name"
                            :label="langConfig['student']"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="levelDoc.name"
                            :label="langConfig['level']"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="programDoc.name"
                            :label="langConfig['program']">
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['action']"
                            width="120"
                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removeSchRegister(scope.$index,scope.row,schRegisterData)"
                                           :disabled="disabledRemove"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                           @click="popupSchRegisterUpdate(),findSchRegisterById(scope),dialogUpdateSchRegister= true"
                                           :disabled="disabledUpdate"></el-button>
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
                :visible.sync="dialogAddSchRegister"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schRegisterForm" :rules="rules" ref="schRegisterFormAdd" label-width="120px"
                     class="schRegisterForm">
                <el-form-item :label="langConfig['student']" prop="studentId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.studentId" remote :remote-method="studentOpt"
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
                <el-form-item :label="langConfig['level']" prop="levelId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.levelId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in levelList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['program']" prop="programId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.programId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in programList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['promotion']" prop="promotionId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.promotionId"
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
                <el-form-item :label="langConfig['term']" prop="term">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.term"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in termList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogAddSchRegister = false, cancel()">{{langConfig['cancel']}}</el-button>
                    <el-button type="primary" @click="saveSchRegister">{{langConfig['save']}}</el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
        <!--End Form modal-->

        <!--Form Modal-->
        <el-dialog
                :title="langConfig['update']"
                :visible.sync="dialogUpdateSchRegister"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schRegisterForm" :rules="rules" ref="schRegisterFormUpdate" label-width="120px"
                     class="schRegisterForm">

                <el-form-item :label="langConfig['student']" prop="studentId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.studentId"
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
                <el-form-item :label="langConfig['level']" prop="levelId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.levelId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in levelList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['program']" prop="programId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.programId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in programList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['promotion']" prop="promotionId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.promotionId"
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
                <el-form-item :label="langConfig['term']" prop="term">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schRegisterForm.term"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in termList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <input type="hidden" v-model="schRegisterForm._id"/>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogUpdateSchRegister = false ,cancel()">{{langConfig['cancel']}}</el-button>
                    <el-button type="primary" @click="updateSchRegister">{{langConfig['save']}}</el-button>
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
                schRegisterData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddSchRegister: false,
                dialogUpdateSchRegister: false,
                studentList: [],
                levelList: [],
                programList: [],
                promotionList: [],
                schRegisterForm: {
                    studentId: "",
                    levelId: "",
                    programId: "",
                    promotionId: "",
                    term: "",

                    _id: "",

                },
                termList: [
                    {label: "1 month", value: 1},
                    {label: "2 months", value: 2},
                    {label: "3 months", value: 3},
                    {label: "4 months", value: 4},
                    {label: "5 months", value: 5},
                    {label: "6 months", value: 6},
                    {label: "7 months", value: 7},
                    {label: "8 months", value: 8},
                    {label: "9 months", value: 9},
                    {label: "10 months", value: 10},
                    {label: "11 months", value: 11},
                    {label: "12 months", value: 12},
                ],
                rules: {

                    studentId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Student',
                            trigger: 'change'
                        }],
                    levelId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Level',
                            trigger: 'change'
                        }],
                    promotionId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Promotion',
                            trigger: 'change'
                        }],
                    term:
                        [{
                            required: true,
                            type: "number",
                            message: 'Please choose term',
                            trigger: 'change'
                        }],
                    programId:
                        [{
                            required: true,
                            type: "string",
                            message: 'Please choose Program',
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
                Meteor.call('querySchRegister', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.schRegisterData = result.content;
                        this.count = result.countSchRegister;
                    }
                    this.isSearching = false;
                });
            }, 300),

            fetchUser() {
                Meteor.call("queryUserOption", (err, result) => {
                    this.applyUserOption = result;
                })
            },
            programOpt() {
                let selector = {};
                Meteor.call("queryProgramOption", selector, (err, result) => {
                    this.programList = result;
                })
            },
            promotionOpt() {
                let selector = {};
                Meteor.call("queryPromotionOption", selector, (err, result) => {
                    this.promotionList = result;
                })
            },
            levelOpt() {
                let selector = {};
                Meteor.call("queryLevelOption", selector, (err, result) => {
                    this.levelList = result;
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
            saveSchRegister() {
                let vm = this;
                this.$refs["schRegisterFormAdd"].validate((valid) => {
                    if (valid) {
                        let schRegisterDoc = {
                            studentId: vm.schRegisterForm.studentId,
                            levelId: vm.schRegisterForm.levelId,
                            programId: vm.schRegisterForm.programId,
                            promotionId: vm.schRegisterForm.promotionId,
                            term: vm.schRegisterForm.term,
                            rolesArea: Session.get('area')
                        };

                        Meteor.call("insertSchRegister", schRegisterDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `Save Successfully!`,
                                    type: 'success'
                                });
                                vm.dialogAddSchRegister = false;
                                vm.queryData();

                                vm.$refs["schRegisterFormAdd"].resetFields();
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
            updateSchRegister() {
                let vm = this;
                this.$refs["schRegisterFormUpdate"].validate((valid) => {
                    if (valid) {
                        let schRegisterDoc = {
                            _id: vm.schRegisterForm._id,
                            studentId: vm.schRegisterForm.studentId,
                            levelId: vm.schRegisterForm.levelId,
                            programId: vm.schRegisterForm.programId,
                            promotionId: vm.schRegisterForm.promotionId,
                            term: vm.schRegisterForm.term,
                            rolesArea: Session.get('area')
                        };

                        Meteor.call("updateSchRegister", schRegisterDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Successfully
                        !`,
                                    type: 'success'
                                });
                                vm.dialogUpdateSchRegister = false;
                                vm.queryData();

                                vm.$refs["schRegisterFormUpdate"].resetFields();
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
            removeSchRegister(index, row, rows) {
                let vm = this;
                this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call("removeSchRegister", row._id, (err, result) => {
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
            findSchRegisterById(doc) {
                let vm = this;
                vm.schRegisterForm = {};
                Meteor.call("querySchRegisterById", doc.row._id, (err, result) => {
                    if (result) {
                        vm.schRegisterForm._id = result._id;
                        vm.schRegisterForm = result;
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
                this.schRegisterForm._id = "";
                if (this.$refs["schRegisterFormAdd"]) {
                    this.$refs["schRegisterFormAdd"].resetFields();
                }

                if (this.$refs["schRegisterFormUpdate"]) {
                    this.$refs["schRegisterFormUpdate"].resetFields();
                }

            },
            popupSchRegisterAdd() {
                this.resetForm();
                this.studentOpt();
                this.levelOpt();
                this.programOpt();
                this.promotionOpt();

            },
            popupSchRegisterUpdate() {
                this.resetForm();
                this.studentOpt();
                this.levelOpt();
                this.programOpt();
                this.promotionOpt();

            },
        },
        created() {
            this.isSearching = true;
            this.fetchUser();
            this.queryData();
        },
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['register'];
                return data;
            }
        }
    }
</script>