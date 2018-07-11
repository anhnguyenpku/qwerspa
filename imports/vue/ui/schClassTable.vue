<template>
    <div class="sch_classTable">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" @click="dialogAddSchClassTable = true,resetForm()">
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
                        :data="schClassTableData"
                        stripe
                        border
                        style="width: 100%">
                    <el-table-column
                            prop="code"
                            :label="langConfig['code']"
                            width="120"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            :label="langConfig['name']"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="khName"
                            :label="langConfig['khName']">
                    </el-table-column>

                    <el-table-column
                            prop="price"
                            :label="langConfig['price']">
                    </el-table-column>
                    <el-table-column
                            prop="term"
                            :label="langConfig['term']">
                    </el-table-column>
                    <el-table-column
                            prop="note"
                            :label="langConfig['desc']">
                    </el-table-column>
                    <el-table-column
                            :label="langConfig['action']"
                            width="120"
                    >
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button type="danger" class="cursor-pointer" icon="el-icon-delete" size="small"
                                           @click="removeSchClassTable(scope.$index,scope.row,schClassTableData)"
                                           :disabled="disabledRemove"></el-button>
                                <el-button type="primary" icon="el-icon-edit" size="small" class="cursor-pointer"
                                           @click="findSchClassTableById(scope),dialogUpdateSchClassTable= true"
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
                :visible.sync="dialogAddSchClassTable"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schClassTableForm" :rules="rules" ref="schClassTableFormAdd" label-width="120px"
                     class="schClassTableForm">
                <el-form-item :label="langConfig['name']" prop="name">
                    <el-input v-model="schClassTableForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['khName']" prop="khName">
                    <el-input v-model="schClassTableForm.khName"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['code']" prop="code">
                    <el-input v-model="schClassTableForm.code"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['price']" prop="price">
                    <el-input v-model="schClassTableForm.price"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['term']" prop="term">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schClassTableForm.term"
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
                <el-form-item :label="langConfig['faculty']" prop="faculty">
                    <el-input v-model="schClassTableForm.faculty"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['degree']" prop="degree">
                    <el-input v-model="schClassTableForm.degree"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['desc']" prop="desc">
                    <el-input type="textarea" v-model="schClassTableForm.desc"></el-input>
                </el-form-item>

                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogAddSchClassTable = false, cancel()">{{langConfig['cancel']}}</el-button>
                    <el-button type="primary" @click="saveSchClassTable">{{langConfig['save']}}</el-button>
                </el-row>
                <br>
            </el-form>
        </el-dialog>
        <!--End Form modal-->

        <!--Form Modal-->
        <el-dialog
                :title="langConfig['update']"
                :visible.sync="dialogUpdateSchClassTable"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schClassTableForm" :rules="rules" ref="schClassTableFormUpdate" label-width="120px"
                     class="schClassTableForm">

                <el-form-item :label="langConfig['name']" prop="name">
                    <el-input v-model="schClassTableForm.name"></el-input>
                </el-form-item>

                <el-form-item :label="langConfig['khName']" prop="khName">
                    <el-input v-model="schClassTableForm.khName"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['code']" prop="code">
                    <el-input v-model="schClassTableForm.code"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['price']" prop="price">
                    <el-input v-model="schClassTableForm.price"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['term']" prop="term">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schClassTableForm.term"
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
                <el-form-item :label="langConfig['faculty']" prop="faculty">
                    <el-input v-model="schClassTableForm.faculty"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['degree']" prop="degree">
                    <el-input v-model="schClassTableForm.degree"></el-input>
                </el-form-item>
                <el-form-item :label="langConfig['desc']" prop="desc">
                    <el-input type="textarea" v-model="schClassTableForm.desc"></el-input>
                </el-form-item>

                <input type="hidden" v-model="schClassTableForm._id"/>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogUpdateSchClassTable = false ,cancel()">{{langConfig['cancel']}}</el-button>
                    <el-button type="primary" @click="updateSchClassTable">{{langConfig['save']}}</el-button>
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
                schClassTableData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 10,
                count: 0,
                dialogAddSchClassTable: false,
                dialogUpdateSchClassTable: false,
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
                schClassTableForm: {
                    name: "",
                    khName: "",
                    code: "",
                    desc: "",
                    _id: "",
                    price: "",
                    term: "",
                    faculty: "",
                    degree: ""

                },
                rules: {
                    name: [{required: true, message: 'Please input name', trigger: 'blur'}],
                    code: [{required: true, message: 'Please input code', trigger: 'blur'}],
                    price: [{required: true, message: 'Please input Price', trigger: 'blur'}],
                    term:
                        [{
                            required: true,
                            type: "number",
                            message: 'Please choose Term',
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
                Meteor.call('querySchClassTable', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 10}
                }, (err, result) => {
                    if (!err) {
                        this.schClassTableData = result.content;
                        this.count = result.countSchClassTable;
                    }
                    this.isSearching = false;
                });
            }, 300),

            fetchUser() {
                Meteor.call("queryUserOption", (err, result) => {
                    this.applyUserOption = result;
                })
            },
            saveSchClassTable() {
                let vm = this;
                this.$refs["schClassTableFormAdd"].validate((valid) => {
                    if (valid) {
                        let schClassTableDoc = {
                            code: vm.schClassTableForm.code,
                            name: vm.schClassTableForm.name,
                            khName: vm.schClassTableForm.khName,
                            desc: vm.schClassTableForm.desc,
                            price: vm.schClassTableForm.price,
                            term: vm.schClassTableForm.term,
                            faculty: vm.schClassTableForm.faculty,
                            degree: vm.schClassTableForm.degree,
                            rolesArea: Session.get('area')
                        };

                        Meteor.call("insertSchClassTable", schClassTableDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `Save Successfully!`,
                                    type: 'success'
                                });
                                vm.dialogAddSchClassTable = false;
                                vm.queryData();

                                vm.$refs["schClassTableFormAdd"].resetFields();
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
            updateSchClassTable() {
                let vm = this;
                this.$refs["schClassTableFormUpdate"].validate((valid) => {
                    if (valid) {
                        let schClassTableDoc = {
                            _id: vm.schClassTableForm._id,
                            code: vm.schClassTableForm.code,
                            name: vm.schClassTableForm.name,
                            khName: vm.schClassTableForm.khName,
                            desc: vm.schClassTableForm.desc,
                            price: vm.schClassTableForm.price,
                            term: vm.schClassTableForm.term,
                            faculty: vm.schClassTableForm.faculty,
                            degree: vm.schClassTableForm.degree,
                            rolesArea: Session.get('area')
                        };

                        Meteor.call("updateSchClassTable", schClassTableDoc, (err, result) => {
                            if (!err) {
                                vm.$message({
                                    duration: 1000,
                                    message: `
                        Update
                        Successfully
                        !`,
                                    type: 'success'
                                });
                                vm.dialogUpdateSchClassTable = false;
                                vm.queryData();

                                vm.$refs["schClassTableFormUpdate"].resetFields();
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
            removeSchClassTable(index, row, rows) {
                let vm = this;
                this.$confirm('This will permanently delete the file. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call("removeSchClassTable", row._id, (err, result) => {
                        if (!err) {
                            rows.splice(index, 1);

                            vm.$message({
                                message: `
                        លុប ${row.code} : ${row.name} បានជោគជ័យ`,
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
            findSchClassTableById(doc) {
                let vm = this;
                vm.schClassTableForm = {};
                Meteor.call("querySchClassTableById", doc.row._id, (err, result) => {
                    if (result) {
                        vm.schClassTableForm._id = result._id;
                        vm.schClassTableForm = result;
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
                this.schClassTableForm._id = "";
                if (this.$refs["schClassTableFormAdd"]) {
                    this.$refs["schClassTableFormAdd"].resetFields();
                }

                if (this.$refs["schClassTableFormUpdate"]) {
                    this.$refs["schClassTableFormUpdate"].resetFields();
                }

            }
        },
        created() {
            this.isSearching = true;
            this.fetchUser();
            this.queryData();
        },
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['classTable'];
                return data;
            }
        }
    }
</script>