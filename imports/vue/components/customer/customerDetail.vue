<template>
    <div class="customer-detail">
        <div>
            <div class="col-lg-4 col-md-8 col-sm-8">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="orange">
                        <i class="material-icons">credit_card</i>
                    </div>
                    <div class="card-content">
                        <p class="category" style="font-family: 'Khmer OS Battambang'">ប្រាក់តម្កល់</p>
                        <h3 class="card-title">{{customerSavingObj.balance | numFormat}} រៀល</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <i class="material-icons">date_range</i> គិតត្រឹម {{today}}
                        </div>
                    </div>
                </div>
            </div>
                <div class="col-lg-4 col-md-8 col-sm-8">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="red">
                        <i class="material-icons">assignment_late</i>
                    </div>
                    <div class="card-content">
                        <p class="category">បំណុល</p>
                        <h3 class="card-title">{{customerTransactionObj.balance | numFormat}} រៀល</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <i class="material-icons">date_range</i> គិតត្រឹម {{today}}
                        </div>
                    </div>
                </div>
                </div>
                <div class="col-lg-4 col-md-8 col-sm-8">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="purple">
                        <i class="material-icons">location_on</i>
                    </div>
                    <div class="card-content">
                        <p class="category">លេខសំគាល់ទីតាំង</p>
                        <h3 class="card-title">{{customer.dpc}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <i class="material-icons">assignment</i>
                            ចុះកិច្ចសន្យាតទឹកថ្ងៃទី {{customer.contract && customer.contract.contractDate | momentFormat}}
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header card-header-icon" data-background-color="purple">
                            <i class="material-icons">perm_identity</i></div>
                        <div class="card-content">
                            <slot v-if="loading">
                                <div class="row">
                                    <div class="col-md-12" style="padding: 30px; margin-top: 70px">
                                        <loader></loader>
                                    </div>
                                </div>
                            </slot>
                            <slot v-else>
                                <h4 class="card-title" style="font-family: 'Khmer OS Battambang'">
                                    {{customer.khName}} | {{customer.name}}</h4>
                                <el-row>
                                    <el-col :span="24">
                                        <el-tabs v-model="activeName">
                                            <transition name="el-zoom-in-top">
                                                <div v-show="!loading" class="transition-box">
                                                    <el-tab-pane label="ពត៌មានទូទៅ" name="generalInfo">
                                                        <div class="panel-body">
                                                            <div class="table-responsive">
                                                        <table class="table table-hover table-bordered">
                                                            <thead>
                                                            <tr>
                                                                <th>ផ្លូវ</th>
                                                                <th>លេខផ្ទះ</th>
                                                                <th>អាស័យដ្ឋាន</th>
                                                                <th>លេខសំគាល់ទីតាំង</th>
                                                                <th>លេខអានចុងក្រោយ</th>
                                                                <th>ថ្ងៃអានចុងក្រោយ</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>{{customer.streetNo}}</td>
                                                                <td>{{customer.folio}}</td>

                                                                <td>{{customer.address}}</td>
                                                                <td>{{customer.dpc}}</td>
                                                                <td>{{displayPrevReading(customer)}}</td>
                                                                <td>{{customer.prevReadingDate | momentFormat}}</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                            </div>
                                                        </div>
                                                    </el-tab-pane>
                                                </div>
                                            </transition>
                                            <!-- <el-tab-pane label="Map" name="map">
                                                <img src="/sample-images/harvard-map.jpg" alt="">
                                            </el-tab-pane> -->
                                            <!-- <el-tab-pane label="History" name="meterChangeHistory">Meter Change History</el-tab-pane> -->
                                            <el-tab-pane label="តារាងប្រាក់តម្កល់" name="savingAccount">
                                                <transition name="el-zoom-in-top">
                                                    <div v-show="currentActiveName('savingAccount')"
                                                         class="transition-box">
                                                        <el-row type="flex">
                                                            <el-col :span="18"></el-col>
                                                            <el-col :span="6">
                                                                <date-range :defaultPickerOptions="pickerOption"
                                                                            :defaultDateRange="defaultDateRange"
                                                                            @dateRangeVal="dateRangeValue"></date-range>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row type="flex">
                                                            <el-col :span="24">
                                                                <saving
                                                                        :flag="currentActiveName('savingAccount')"
                                                                        @refetchCustomerInfo="refetchCustomerInfo"
                                                                        @customerSavingObj="getCustomerSavingObj"
                                                                        :customerId="customerId"
                                                                        :date="dateRange"></saving>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </transition>
                                            </el-tab-pane>
                                            <el-tab-pane label="តារាងប្រតិបតិ្តការ" name="transactionBalance">
                                                <transition name="el-zoom-in-top">
                                                    <div v-show="currentActiveName('transactionBalance')"
                                                         class="transition-box">
                                                        <el-row type="flex">
                                                            <el-col :span="6">
                                                                <date-range
                                                                        :disabled="true"
                                                                        :defaultDateRange="defaultDateRange"
                                                                        @dateRangeVal="dateRangeValue"></date-range>
                                                            </el-col>
                                                        </el-row>
                                                        <el-row type="flex">
                                                            <el-col :span="18">

                                                            </el-col>

                                                        </el-row>
                                                        <br>
                                                        <el-row type="flex">
                                                            <el-col :span="24">
                                                                <transaction
                                                                        :flag="currentActiveName('transactionBalance')"
                                                                        :customerId="customerId"
                                                                        @customerTransactionObj="getCustomerTransactionObj"
                                                                        :date="dateRange"></transaction>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </transition>
                                            </el-tab-pane>
                                            <el-tab-pane label="ផែនទី" name="map">
                                                <map-component :adminId="adminId"></map-component>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </el-col>
                                </el-row>
                            </slot>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import numeral from 'numeral';
    import Saving from '/imports/vue/components/saving/saving.vue';
    import Transaction from '/imports/vue/components/transaction/transaction.vue';
    import DateRange from '/imports/vue/components/date/daterange.vue';
    import Loader from '/imports/vue/ui/Loader.vue';
    import MapComponent from '/imports/vue/components/map/map.vue';

    export default {
        components: {
            MapComponent,
            Transaction,
            Saving,
            DateRange,
            Loader
        },
        data() {
            return {
                adminId: '',
                customer: {},
                today: moment().subtract(2, 'years').startOf('year').format('YYYY') + '-' +moment().endOf('year').format('YYYY'),
                fetchCustomerInfo: true,
                customerId: '',
                defaultDateRange: [moment().subtract(2, 'years').startOf('year').toDate(), moment().endOf('year').toDate()],
                dateRange: [moment().subtract(2, 'years').startOf('year').toDate(), moment().endOf('year').toDate()],
                activeParams: '',
                activeName: 'map',
                balance: 0,
                customerSavingObj: {
                    balance: 0
                },
                customerTransactionObj: {
                    balance: 0
                },
                loading: false,
                customerSavingData: [],
                pickerOption: {
                    shortcuts: [{
                        text: 'Last month',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: 'Last 3 months',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

            };
        },
        methods: {
            displayPrevReading(customer) {
                return customer.prevReading === 0 ? customer.contract && customer.contract.prevReading : customer.prevReading;
            },
            numFormatter(val) {
                return numeral(val).format('0,0.00');
            },
            getCustomerSavingObj(val) { // val which is return as and saving obj
                this.customerSavingObj = val;
                this.fetchCustomerInfo = false;
            },
            getCustomerTransactionObj(val) { // val which is return as and transition obj
                this.customerTransactionObj = val;
                this.fetchCustomerInfo = false;
            },
            dateRangeValue(val) {
                this.dateRange = val;
            },
            currentActiveName(name) {
                return name === this.activeName;
            },
            map() {

            },
            refetchCustomerInfo(val) {
                this.fetchCustomerInfo = val;
            },
            meterChangeHistory() {

            },
            savingAccount() {

            },

            transactionBalance() {
                Meteor.call('giveMeTransactionBalanceObj', {customerId: this.customer._id}, (err, result) => {
                    if (!err) {
                        this.balance = result && result.balance || 0;
                    }
                });
            },
            token() {

            },
            fetchCustomer() {
                let customerId = FlowRouter.getParam('customerId');
                this.customerId = customerId
                Meteor.call('getCustomerById', {_id: customerId}, (err, result) => {
                    if (!err) {
                        this.customer = result;
                        let get6NumberFromDpc = result.dpc && result.dpc.substr(0, 6);
                        let rolesArea = Session.get('area');
                        let get2NumberFromRoleArea = rolesArea.substr(0, 2);
                        this.adminId = get2NumberFromRoleArea + get6NumberFromDpc
                    }
                });
            }
        },
        watch: {
            activeParams(val) {
                this.activeName = val;
            }
        },
        mounted() {
            setTimeout(() => {
                this.loading = false;
            }, 1000)
        },
        created() {
            let currentActiveName = FlowRouter.query.get('activeName');
            if (currentActiveName) {
                this.activeParams = currentActiveName;
            }
            this.loading = true;
            this.fetchCustomer();
        }
    }
</script>
<style scoped lang="less">
    .custom-transbalance {
        border-left: none;
        border-bottom: 5px solid rgba(0, 0, 0, 0);
        transition: all .3s ease-in-out;
        -webkit-transition: all .3s ease-in-out;
        -o-transition: all .3s ease-in-out;
        -moz-transition: all .3s ease-in-out;
        &:hover {
            border-bottom: 5px solid #930A0A;

        }
    }

    .sky-summer-blue {
        color: #0a17ea
    }

    .box-card {
        box-shadow: none !important;
        /*border: none !important;*/
    }

</style>