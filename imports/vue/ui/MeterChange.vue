<template>
    <div class="meter-change">
        <!--<div class="card-title">Meter Change</div>-->
        <div class="col-md-12">
            <div class="card">
                <div class="card-header card-header-icon" data-background-color="blue">
                    <i class="material-icons">people</i>
                </div>
                <div class="card-content">
                    <h4 class="card-title" style="font-family: 'Khmer OS Battambang'"><a @click="gotoAddCustomer"
                                                                                         class="cursor-pointer"><i
                            class="fa fa-plus"></i> អតិថិជន</a></h4>
                    <!--<el-row type="flex">-->
                    <!--<el-col :span="14">-->
                    <!--</el-col>-->
                    <!--<el-col :span="10">-->
                    <!--<el-input placeholder="Search Customer" suffix-icon="el-icon-search" v-model="searchCustomer">-->
                    <!--<el-select v-model="filter" slot="prepend" class="select-width">-->
                    <!--<el-option :label="filter.label" :value="filter.value"-->
                    <!--v-for="filter in filterOptions"-->
                    <!--:key="filter.label"></el-option>-->
                    <!--</el-select>-->
                    <!--<el-button slot="append" suffix-icon="el-icon-search"></el-button>-->
                    <!--</el-input>-->
                    <!--</el-col>-->
                    <!--</el-row>-->
                    <div type="flex">
                        <div class="high-float-right" style="width: 100%; max-width: 480px; padding-top: 15px">
                            <el-input placeholder="Search Customer" suffix-icon="el-icon-search" v-model="searchCustomer">
                                <el-select v-model="filter" slot="prepend" class="select-width">
                                    <el-option :label="filter.label" :value="filter.value"
                                               v-for="filter in filterOptions"
                                               :key="filter.label"></el-option>
                                </el-select>
                                <el-button slot="append" suffix-icon="el-icon-search"></el-button>
                            </el-input>
                        </div>
                    </div>
                    <el-row type="flex">
                        <loader v-show="isSearching"></loader>
                    </el-row>
                    <div style="width: 100%; display: flow-root; padding-top: 15px">
                        <el-row type="flex">
                            <transition name="el-zoom-in-top">
                                <el-table element-loading-text="កំពុងដំណើរការ..." v-loading="isSearching"
                                          :data="customers"
                                          border style="width: 100%" v-show="!isSearching">

                                    <!--<el-table-column prop="_id" sortable label="#" width="150">-->
                                    <!--<template slot-scope="scope">-->
                                    <!--<a @click="showCustomer(scope.row)"-->
                                    <!--class="cursor-pointer">{{scope.row.khName}}</a>-->
                                    <!--</template>-->
                                    <!--</el-table-column>-->
                                    <el-table-column sortable label="ID" width="100">
                                        <template slot-scope="scope">
                                            <a @click="showCustomer(scope.row)"
                                               class="cursor-pointer">{{scope.row._id}}</a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column sortable label="SUMID" width="100">
                                        <template slot-scope="scope">
                                            <a @click="">{{scope.row.sumId || ""}}</a>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="streetNo" sortable label="Str.No" min-width="100">
                                    </el-table-column>
                                    <el-table-column prop="khName" sortable label="KH Name" min-width="150">
                                    </el-table-column>
                                    <el-table-column prop="dpc" sortable label="DPC" min-width="120">
                                    </el-table-column>
                                    <el-table-column prop="quartierDoc.name" label="Quartier" min-width="120">
                                    </el-table-column>
                                    <el-table-column prop="blockDoc.name" label="Block" min-width="100">
                                    </el-table-column>
                                    <el-table-column prop="folio" label="Folio" min-width="100">
                                    </el-table-column>
                                    <el-table-column prop="name" label="EN Name" min-width="120">
                                    </el-table-column>
                                    <el-table-column prop="address" label="Address" min-width="180">
                                    </el-table-column>
                                    <el-table-column fixed="right" label="" width="100">
                                        <template slot-scope="scope">
                                            <el-dropdown trigger="click">
                            <span class="el-dropdown-link cursor-pointer">
                                Action
                                <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item class="cursor-pointer"
                                                                      @click.native="renderEditUrl(scope.row._id)">
                                                        <a>
                                                            <i class="fa fa-pencil"></i> Edit</a>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item @click.native="showCustomer(scope.row)">
                                                        <a>
                                                            <i class="fa fa-eye"></i> Show</a>
                                                    </el-dropdown-item>

                                                    <el-dropdown-item divided
                                                                      @click.native="handleMeterChange(scope.row)">
                                                        <a>
                                                            <i class="fa fa-clock-o"></i> Meter Change</a>
                                                    </el-dropdown-item>
                                                    <el-dropdown-item divided
                                                                      @click.native="handleChangeBlock(scope.row)">
                                                        <a>
                                                            <i class="fa fa-refresh"></i> Change Block</a>
                                                    </el-dropdown-item>
                                                    <!-- <el-dropdown-item divided @click.native="handleSaving(scope.row)">
                                                    <a>
                                                            <i class="fa fa-money"></i> Saving</a>
                                                    </el-dropdown-item> -->
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </transition>

                        </el-row>
                    </div>
                    <el-pagination width="100%"
                                   align="center"
                                   @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="currentPage" :page-sizes="[20, 50, 100,200]"
                                   :page-size="currentSize"
                                   layout="total, sizes, prev, pager, next, jumper" :total="count">
                    </el-pagination>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
    import MeterChangeComponent from '/imports/vue/components/meterChange/meterChange.vue';
    import Loader from '/imports/vue/ui/Loader.vue';
    //    import '../../ui/changeBlock/changeBlock';
    export default {
        components: {
            MeterChangeComponent,
            Loader
        },
        data() {
            return {
                currentPage: 1,
                currentSize: 20,
                count: 0,
                filter: '',
                filterOptions: [
                    {label: 'All', value: ''},
                    {label: 'ID', value: '_id'},
                    {label: 'DPC', value: 'dpc'},
                    {label: 'Name', value: 'khName'},
                    {label: 'Quartier', value: 'quartier'},
                    {label: 'Block', value: 'block'},
                    {label: 'Folio', value: 'folio'},
                    {label: 'SUMID', value: 'sumId'},
                    {label: 'Street No', value: 'streetNo'},
                ],
                searchCustomer: '',
                isSearching: false,
                show: false,
                customerObj: {},
                customers: [],
            };
        },
        watch: {
            currentSize(val) {
                this.isSearching = true;
                let skip = (this.currentPage - 1) * val;
                this.queryCustomer(this.searchCustomer, skip, val + skip);
            },
            currentPage(val) {
                this.isSearching = true;
                let skip = (val - 1) * this.currentSize;
                this.queryCustomer(this.searchCustomer, skip, this.currentSize + skip);
            },
            searchCustomer(val) {
                this.isSearching = true;
                this.currentPage = 1;
                this.queryCustomer(val, 0, this.currentSize);
                this.customerLength();
            },
            filter(val) {
                this.queryCustomer(this.searchCustomer, 0, this.currentSize);
                this.customerLength();
            }
        },
        methods: {
            gotoAddCustomer() {
                FlowRouter.go('wb.customerAdd');
            },
            handleChangeBlock(row) {
                let path = FlowRouter.path('wb.changeBlock');
                let query = path + `/${row._id}/byCustomerId`
                FlowRouter.go(query);
            },
            handleMeterChange(row) {
                let path = FlowRouter.path('wb.meterChangeComponent');
                let query = path + `?q=${row._id}`
                FlowRouter.go(query);
            },
            showCustomer(row) {
                FlowRouter.go(`/wb-setting/customer/${row._id}/detail`);
            },
            handleSaving(row) {
                FlowRouter.go(`/wb-setting/customer/${row._id}/saving`);
            },
            handleSizeChange(val) {
                this.currentSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            renderEditUrl(_id) {
                FlowRouter.go(`/wb-setting/customer/${_id}/edit`)
            },
            enableForm(customer) {
                this.show = true;
                this.customerObj = customer;
            },
            bindingCloseForm(val) {
                this.show = val
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            queryCustomer: _.debounce(function (val, skip, limit) {
                Meteor.call('queryCustomer', {
                    q: val,
                    filter: this.filter,
                    options: {skip: skip || 0, limit: limit || 20},
                    rolesArea: Session.get('area')
                }, (err, result) => {
                    if (!err) {
                        this.customers = result.content;
                    }
                    this.isSearching = false;
                });
            }, 300),
            customerLength() {
                Meteor.call("countCustomer", {
                    q: this.searchCustomer,
                    filter: this.filter,
                    rolesArea: Session.get('area')
                }, (err, result) => {
                    if (!err) {
                        this.count = result;
                    }
                });
            }
        },
        created() {
            this.isSearching = true;
            this.queryCustomer();
            this.customerLength();
        }
    };
</script>

<style lang="less">
    a {
        &:hover {
            text-decoration: underline;
        }
    }

    .f12 {
        font-size: 12px;
    }

    .time {
        font-size: 13px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
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

    .transition-box {
        max-width: 100%;
        height: auto;
    }

    .select-width {
        width: 120px;
    }
</style>