<template>
    <div class="sch_classBoard">
        <div class="card card-stats">
            <div class="card-header card-header-icon" data-background-color="purple">
                <i class="material-icons"><i class="material-icons">streetview</i></i>
            </div>
            <el-row type="flex" justify="right">
                <el-col :span="8">
                    <h4>
                        <a class="cursor-pointer" @click="dialogAddSchClass = true,resetForm()">
                            {{langConfig['title']}}
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
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24" style="text-align: center;">
                        <div class="block">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="currentPage" :page-sizes="[12,24, 48, 96,192]"
                                           :page-size="currentSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="count">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
                <br>
                <div style="margin-top: 20px; height: 100px;">
                    <el-row>
                        <el-col style="padding-bottom: 40px !important;" :span="5" v-for="(d, index) in schClassData"
                                :key="d._id"
                                :offset="index > 0 ? index%4===0 ? 0 : 1 : 0">
                            <el-card :body-style="{ padding: '0px' }" @dblclick.native="popUpSchAddStudentToClass(d)">
                                <transition v-show=true name="el-zoom-in-center">
                                    <div class="transition-box">
                                        {{d.name}}<br> <span
                                            style="float: left !important;"> <i
                                            class="material-icons">group</i> &nbsp;<span
                                            style="padding-top: 12px !important;">{{d.classTableDoc && d.classTableDoc.studentList &&d.classTableDoc.studentList.length || 0}}</span>
                                        </span><span
                                            style="float: right !important;bottom: 0px !important;padding-top: 12px !important;">{{langConfig['code']}} : {{d.code || ""}}</span>
                                    </div>
                                </transition>
                                <div style="padding: 14px;">
                                    <span>{{langConfig['teacher']}} : {{d.teacherDoc && d.teacherDoc.personal.name || ""}} ({{d.teacherDoc && d.teacherDoc.personal.phoneNumber || ""}})</span>
                                    <div class="bottom clearfix">
                                        <time class="time">{{ d.classDate | momentFormat}}</time>
                                        <el-button type="text" class="button">
                                            <el-button type="success" icon="el-icon-circle-close-outline"
                                                       @click="closeSchClass(index,d,schClassData)"
                                                       circle></el-button>
                                        </el-button>
                                    </div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <div>
                    <span></span>
                </div>
                <!--Pagination-->
                <br>

            </slot>
            <!--End Pagination-->
        </div>

        <el-dialog
                @close="handleCloseModal"
                :title="langConfig['studentClass']"
                :visible.sync="dialogAddSchStudentToClass"
                :fullscreen="fullScreen"
                class="dialogSchStudentToClass"

        >
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schAddStudentToClass" :rules="rules" ref="schAddStudentToClass" label-width="120px"
                     :label-schition="labelPosition"
                     class="schAddStudentToClass">
                <el-tabs :tab-position="tabPosition" style="min-height: 200px;">
                    <el-tab-pane :label="langConfig['student']">
                        <template>

                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span><b>{{langConfig['class']}} : {{className}}</b>({{classDate}})</span><br><br>
                                    <span><b>{{langConfig['teacher']}} : {{teacher}}</b>({{teacherPhoneNumber}})</span><br><br>
                                    <span><b>{{langConfig['code']}} : {{code}}</b></span>
                                </div>
                                <el-table
                                        ref="multipleTable"
                                        :data="studentList"
                                        style="width: 100%">
                                    <el-table-column
                                            type="index"
                                            width="50">
                                    </el-table-column>
                                    <el-table-column
                                            property="studentDoc.personal.name"
                                            :label="langConfig['name']"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            property="studentDoc.personal.gender"
                                            :label="langConfig['gender']"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            property="studentDoc.personal.dobName"
                                            :label="langConfig['dob']"
                                    >
                                    </el-table-column>

                                    <el-table-column
                                            property="studentDoc.personal.phoneNumber"
                                            :label="langConfig['phoneNumber']"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>

                            </el-card>

                        </template>
                    </el-tab-pane>
                    <el-tab-pane :label="langConfig['promote']">
                        <template>

                            <el-card class="box-card">
                                <div slot="header" class="clearfix">

                                    <div style="margin-top: 20px">
                                        <el-button type="success" round style="float: right !important;"
                                                   @click="popUpPromoteToClass()">
                                            {{langConfig['promote']}}
                                        </el-button>
                                        <span><b>{{langConfig['class']}} : {{className}}</b>({{classDate}})</span><br><br>
                                        <span><b>{{langConfig['teacher']}} : {{teacher}}</b>({{teacherPhoneNumber}})</span><br><br>
                                        <span><b>{{langConfig['code']}} : {{code}}</b></span>
                                    </div>
                                </div>
                                <el-table
                                        ref="multipleTableNotPromote"
                                        :data="studentListNotPromote"
                                        style="width: 100%"
                                        @selection-change="handleSelectionChangeNotPromote">
                                    <el-table-column
                                            type="index"
                                            width="50">
                                    </el-table-column>

                                    <el-table-column
                                            property="studentDoc.personal.name"
                                            :label="langConfig['name']"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            property="studentDoc.personal.gender"
                                            :label="langConfig['gender']"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            property="studentDoc.personal.dobName"
                                            :label="langConfig['dob']"
                                    >
                                    </el-table-column>

                                    <el-table-column
                                            property="studentDoc.personal.phoneNumber"
                                            :label="langConfig['phoneNumber']"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            type="selection"
                                            width="55">
                                    </el-table-column>
                                </el-table>
                            </el-card>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane :label="langConfig['alreadyPromote']">
                        <template>
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">

                                    <div style="margin-top: 20px">
                                        <span><b>{{langConfig['class']}} : {{className}}</b>({{classDate}})</span><br><br>
                                        <span><b>{{langConfig['teacher']}} : {{teacher}}</b>({{teacherPhoneNumber}})</span><br><br>
                                        <span><b>{{langConfig['code']}} : {{code}}</b></span>
                                    </div>
                                </div>
                                <el-table
                                        ref="multipleTableAlreadyPromote"
                                        :data="studentListPromote"
                                        style="width: 100%"
                                        @selection-change="handleSelectionChangeAlreadyPromote">
                                    <el-table-column
                                            type="index"
                                            width="50">
                                    </el-table-column>

                                    <el-table-column
                                            property="studentDoc.personal.name"
                                            :label="langConfig['name']"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            property="studentDoc.personal.gender"
                                            :label="langConfig['gender']"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            property="studentDoc.personal.dobName"
                                            :label="langConfig['dob']"
                                    >
                                    </el-table-column>

                                    <el-table-column
                                            property="studentDoc.personal.phoneNumber"
                                            :label="langConfig['phoneNumber']"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                            property="newClassDoc.name"
                                            :label="langConfig['class']"
                                            show-overflow-tooltip>
                                    </el-table-column>
                                </el-table>

                            </el-card>

                        </template>
                    </el-tab-pane>
                </el-tabs>
                <!--<el-row :gutter="20">
                    <el-transfer
                            filterable
                            :filter-method="filterMethod"
                            :titles="['Source', 'Target']"
                            filter-placeholder="State Abbreviations"
                            v-model="schAddStudentToClass.value"
                            :data="studentList">
                    </el-transfer>
                    &lt;!&ndash;</el-card>&ndash;&gt;
                </el-row>-->
            </el-form>
            <!--<span slot="footer" class="dialog-footer fix-dialog-footer"
            >
                <hr style="margin-top: 0px !important;">
                <el-row>
                    <el-col :span="12" style="text-align: left !important;">
                        <el-button type="danger"
                                   @click.native="dialogAddSchStudentToClass= false, cancel(),resetForm()"> <i
                                class="el-icon-circle-cross"> </i>&nbsp;{{langConfig['cancel']}}</el-button>
                    </el-col>
                    <el-col :span="11" class="pull-right">
                        <el-button type="primary" @click.native="saveSchStudentToClass(true,$event,false)"><i
                                class="el-icon-check"> </i>&nbsp; {{langConfig['save']}}</el-button>

                    </el-col>
                </el-row>
            </span>-->
        </el-dialog>
        <el-dialog
                :title="langConfig['promoteToClass']"
                :visible.sync="dialogPromoteToClass"
                width="30%">
            <!--<hr style="margin-top: 0px !important;border-top: 2px solid teal">-->
            <el-form :model="schPromoteToClassForm" :rules="rules" :ref="ref" label-width="120px"
                     class="schPromoteToClassForm">

                <el-form-item :label="langConfig['program']" prop="programId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schPromoteToClassForm.programId"
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
                <el-form-item :label="langConfig['major']" prop="majorId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schPromoteToClassForm.majorId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in majorList"
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
                               v-model="schPromoteToClassForm.levelId"
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
                <el-form-item :label="langConfig['class']" prop="classId">
                    <el-select style="display: block !important;"
                               filterable
                               v-model="schPromoteToClassForm.classId"
                               :placeholder="langConfig['chooseItem']">
                        <el-option
                                v-for="item in classList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="langConfig['startClassDate']" prop="startClassDate">
                    <el-date-picker
                            v-model="schPromoteToClassForm.startClassDate"
                            type="date"
                            style="width: 100%;"
                            placeholder="Pick a day"
                    >
                    </el-date-picker>
                </el-form-item>
                <hr style="margin-top: 0px !important;">
                <el-row class="pull-right">
                    <el-button @click="dialogPromoteToClass= false ,cancel()">{{langConfig['cancel']}}</el-button>
                    <el-button type="primary" @click="savePromoteToClass">{{langConfig['save']}}</el-button>
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

            /*const generateStudentList = _ => {
                const data = [];
                const states = ['California', 'Illinois', 'Maryland', 'Texas', 'Florida', 'Colorado', 'Connecticut '];
                const initials = ['CA', 'IL', 'MD', 'TX', 'FL', 'CO', 'CT'];
                states.forEach((city, index) => {
                    data.push({
                        label: city,
                        key: index,
                        initial: initials[index]
                    });
                });
                return data;
            };*/
            return {
                ref: "promoteToClass",
                tabPosition: 'left',
                fullScreen: true,
                labelPosition: top,
                schClassData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 12,
                count: 0,
                dialogAddSchStudentToClass: false,
                dialogPromoteToClass: false,
                schClassForm: {
                    name: "",
                    khName: "",
                    code: "",
                    desc: "",
                    _id: "",
                    teacherId: "",
                    programId: "",
                    status: false
                },
                schPromoteToClassForm: {
                    levelId: "",
                    majorId: "",
                    programId: "",
                    classId: "",
                    startClassDate: ""
                },
                schAddStudentToClass: {
                    value: []
                },
                teacherList: [],
                levelList: [],
                programList: [],
                classList: [],
                majorList: [],
                rules: {},
                studentList: [],
                studentListNotPromote: [],
                studentListPromote: [],
                multipleSelectionAlreadyPromote: [],
                multipleSelectionNotPromote: [],

                className: "",
                code: "",
                teacher: "",
                teacherPhoneNumber: "",
                classDate: "",
                programId: "",
                programName: "",
                majorId: "",
                majorName: "",
                levelName: "",
                oldClassId: ""
            }

        }
        ,
        watch: {
            currentSize(val) {
                this.isSearching = true;
                let skip = (this.currentPage - 1) * val;
                this.queryData(this.searchData, skip, val + skip);
            }
            ,
            currentPage(val) {
                this.isSearching = true;
                let skip = (val - 1) * this.currentSize;
                this.queryData(this.searchData, skip, this.currentSize + skip);
            }
            ,
            searchData(val) {
                this.isSearching = true;
                let skip = (this.currentPage - 1) * this.currentSize;
                this.queryData(val, skip, this.currentSize + skip);
            },
            "schPromoteToClassForm.programId"(val) {
                this.majorOpt(val);
                if (this.ref !== "promoteToClass") {
                    this.schRegisterForm.majorId = "";
                }
            },
            "schPromoteToClassForm.majorId"(val) {
                this.levelOpt(val);
                if (this.ref !== "promoteToClass") {
                    this.schPromoteToClassForm.levelId = "";
                }
            },
            "schPromoteToClassForm.levelId"(val) {
                let vm = this;
                vm.classOpt(val);
                if (vm.ref === "promoteToClass") {
                    vm.schPromoteToClassForm.classId = "";
                }
            },
            "schPromoteToClassForm.classId"(val) {
                let vm = this;
                Meteor.call("querySchClassById", val, (err, result) => {
                    if (result) {
                        if (vm.schPromoteToClassForm.startClassDate === "" || vm.schPromoteToClassForm.startClassDate === undefined) {
                            vm.schPromoteToClassForm.startClassDate = result.classDate;
                        }
                    }
                })
            }
        }
        ,
        methods: {
            handleSizeChange(val) {
                this.currentSize = val;
            }
            ,
            handleCurrentChange(val) {
                this.currentPage = val;
            }
            ,
            handleCloseModal() {

                this.resetForm();
                this.refForm = "";
            }
            ,
            queryData: _.debounce(function (val, skip, limit) {
                Meteor.call('querySchClassBoard', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 12}
                }, (err, result) => {
                    if (!err) {
                        this.schClassData = result.content;
                        this.count = result.countSchClass;
                    }
                    this.isSearching = false;
                });
            }, 300),


            findSchClassById(doc) {
                let vm = this;
                vm.schClassForm = {};
                Meteor.call("querySchClassById", doc.row._id, (err, result) => {
                    if (result) {
                        vm.schClassForm._id = result._id;
                        vm.schClassForm = result;
                    }
                })
            }
            ,
            cancel() {
                this.$message({
                    type: 'info',
                    message: 'Canceled'
                });
            }
            ,
            programOpt() {
                let selector = {};
                Meteor.call("queryProgramOption", selector, (err, result) => {
                    this.programList = result;
                })
            },
            majorOpt(val) {
                let selector = {};
                if (val) {
                    selector.programId = val;
                }
                Meteor.call("queryMajorOption", selector, (err, result) => {
                    this.majorList = result;
                })
            },
            classOpt(val) {
                let selector = {};
                if (val) {
                    selector.levelId = val;
                }
                Meteor.call("queryClassOption", selector, (err, result) => {
                    this.classList = result;
                })
            },
            levelOpt(val) {
                let selector = {};
                selector.majorId = val;
                Meteor.call("queryLevelOption", selector, (err, result) => {
                    this.levelList = result;
                })
            },
            closeSchClass(index, row, rows) {
                let vm = this;
                this.$confirm('This will end your class. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    Meteor.call("updateSchClassById", row._id, (err, result) => {
                        if (!err) {
                            rows.splice(index, 1);

                            vm.$message({
                                message: `
                        បិទថ្នាក់ បានជោគជ័យ`,
                                type: 'success'
                            });


                        } else {
                            vm.$message({
                                type: 'error',
                                message: 'Close Failed'
                            });
                        }

                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });


            }
            ,
            popUpSchAddStudentToClass(doc) {
                this.dialogAddSchStudentToClass = true;
                this.className = doc.name || "";
                this.oldClassId = doc._id || "";
                this.code = doc.code || "";
                this.programName = doc.programDoc && doc.programDoc.name || "";
                this.programId = doc.programDoc && doc.programDoc._id || "";

                this.majorName = doc.majorDoc && doc.majorDoc.name || "";
                this.majorId = doc.majorDoc && doc.majorDoc._id || "";

                this.levelName = doc.levelDoc && doc.levelDoc.name || "";

                this.teacher = doc.teacherDoc && doc.teacherDoc.personal.name || "";
                this.teacherPhoneNumber = doc.teacherDoc && doc.teacherDoc.personal.phoneNumber;
                this.classDate = moment(doc.classDate).format("DD/MM/YYYY");

                this.schPromoteToClassForm.programId = doc.programDoc && doc.programDoc._id || "";
                this.schPromoteToClassForm.majorId = doc.majorDoc && doc.majorDoc._id || "";

                this.generateStudentList(doc);
            }
            ,
            generateStudentList(data) {
                Meteor.call("queryStudentByClassId", data._id, (err, result) => {
                    this.studentList = [];
                    if (!err) {
                        this.studentList = result.data;
                        this.studentListNotPromote = result.dataNotPromote;
                        this.studentListPromote = result.dataPromote;
                    }
                })
            }
            ,
            filterMethod(query, item) {
                return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
            ,
            resetForm() {
                this.schAddStudentToClass = {
                    value: []
                }
            }
            ,
            saveSchStudentToClass(isCloseDialog, event, isPrint) {
                event.preventDefault();
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChangeAlreadyPromote(val) {
                this.multipleSelectionAlreadyPromote = val;
            },
            handleSelectionChangeNotPromote(val) {
                this.multipleSelectionNotPromote = val;
            },
            savePromoteToClass() {
                let vm = this;
                let data = {};
                data.studentList = this.multipleSelectionNotPromote;
                let promoteToClassDoc = {
                    levelId: vm.schPromoteToClassForm.levelId,
                    majorId: vm.schPromoteToClassForm.majorId,
                    programId: vm.schPromoteToClassForm.programId,
                    classId: vm.schPromoteToClassForm.classId,
                    startClassDate: vm.schPromoteToClassForm.startClassDate,
                    rolesArea: Session.get('area')
                };
                data.classFormDoc = promoteToClassDoc;
                let oldClassDoc = {};
                oldClassDoc._id = this.oldClassId;
                Meteor.call("addPromoteToClass", data, (err, result) => {
                    if (result) {
                        vm.$message({
                            message: `សិស្សឡើងថ្នាក់បានជោគជ័យ`,
                            type: 'success'
                        });
                        vm.generateStudentList(oldClassDoc);
                        vm.dialogPromoteToClass = false;
                        vm.queryData();
                    } else {
                        vm.$message({
                            type: 'error',
                            message: err.message
                        });
                        vm.generateStudentList(oldClassDoc);

                    }
                })

            },
            popUpPromoteToClass() {
                this.ref = "promoteToClass";
                this.dialogPromoteToClass = true;
                this.programOpt();
                this.classOpt();
            }

        }
        ,

        created() {
            this.isSearching = true;
            this.queryData();
        }
        ,
        computed: {
            langConfig() {
                let data = compoLang.filter(config => config.lang === this.langSession)[0]['classBoard'];
                return data;
            }
        }
    }
</script>
<style>
    .transition-box {
        margin-bottom: 10px;
        width: 400px;
        height: 100px;
        border-radius: 4px;
        background-color: #409EFF;
        text-align: center;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
    }
</style>
