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
                            <el-card :body-style="{ padding: '0px' }">
                                <transition v-show=true name="el-zoom-in-center">
                                    <div class="transition-box">{{d.name}}</div>
                                </transition>
                                <div style="padding: 14px;">
                                    <span>{{langConfig['numberStudent']}}</span>
                                    <div class="bottom clearfix">
                                        <time class="time">{{ d.createdAt | momentFormat }}</time>
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
                schClassData: [],
                loading: false,
                searchData: '',
                isSearching: false,
                currentPage: 1,
                currentSize: 12,
                count: 0,
                dialogAddSchClass: false,
                dialogUpdateSchClass: false,

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
                teacherList: [],
                programList: [],
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
            },
            cancel() {
                this.$message({
                    type: 'info',
                    message: 'Canceled'
                });
            },closeSchClass(index, row, rows) {
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


            },

        },

        created() {
            this.isSearching = true;
            this.queryData();
        },
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

</style>