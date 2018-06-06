<template>
    <div>
        <div class="row">
            <el-date-picker
                    v-model="month"
                    type="month"
                    placeholder="Pick a month">
            </el-date-picker>
        </div>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">supervisor_account</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អតិថិជនសរុប</p>
                        <h3 class="card-title fz20">
                            {{formatter(board.totalFullCustomerSum)}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL CUSTOMTER</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">description</i>
                    </div>
                    <div class="card-content">
                        <p class="category" style="font-family: 'Khmer OS Battambang'">វិក្កយបត្រប្រកាសលក់</p>
                        <h3 class="card-title fz20">
                            {{formatter(board.totalCustomerSum)}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL INVOICE</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">local_drink</i>
                    </div>
                    <div class="card-content">
                        <p class="category">បរិមាណទឹកប្រកាសលក់</p>
                        <h3 class="card-title fz20">
                            {{board.totalConsumptionSum | numFormat}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL WATER QUALITY</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">monetization_on</i>
                    </div>
                    <div class="card-content">
                        <p class="category">ទឹកប្រាក់ប្រកាសលក់</p>
                        <h3 class="card-title fz20">
                            {{board.totalPostedSum | numFormat}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">perm_identity</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អតិថិជនកើនក្នុងខែ</p>
                        <h3 class="card-title fz20">{{formatter(board.totalCustomerInPeriodSum)}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>CUSTOMER INCREASEMENT</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="green">
                        <i class="material-icons">description</i>
                    </div>
                    <div class="card-content">
                        <p class="category">វិក្កយបត្របានទទួល</p>
                        <h3 class="card-title fz20">{{formatter(board.totalInvoiceClosedSum)}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>RECEIVED BILLING</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="green">
                        <i class="material-icons">invert_colors</i>
                    </div>
                    <div class="card-content">
                        <p class="category">បរិមាណទឹកបានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalQualityClosedSum | numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>RECEIVED WATER AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="green">
                        <i class="material-icons">attach_money</i>
                    </div>
                    <div class="card-content">
                        <p class="category">ទឹកប្រាក់បានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalPaymentSum | numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>RECEIVED AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">trending_up</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អត្រាធ្វើវិក្កយបត្រប្រកាសលក់</p>
                        <h3 class="card-title fz20">
                            {{(board.totalCustomer/(board.totalFullCustomerSum-board.totalInActiveCustomerSum)) |
                            numFormatPercent}}
                            %</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>SOLD BILLING RATE</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="red">
                        <i class="material-icons">no_sim</i>
                    </div>
                    <div class="card-content">
                        <p class="category">វិក្កយបត្រមិនទាន់បានទទួល</p>
                        <h3 class="card-title fz20">{{formatter(board.totalCustomerSum-board.totalInvoiceClosedSum
                            )}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>UNRECEIVED BILLING</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="red">
                        <i class="material-icons">invert_colors_off</i>
                    </div>
                    <div class="card-content">
                        <p class="category">បរិមាណទឹកមិនទាន់បានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalConsumptionSum-board.totalQualityClosedSum|
                            numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>UNRECEIVED WATER AMOUNT</i>

                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="red">
                        <i class="material-icons">money_off</i>
                    </div>
                    <div class="card-content">
                        <p class="category" style="font-family: 'Khmer OS Battambang'">ទឹកប្រាក់មិនទាន់បានទទួល</p>
                        <h3 class="card-title fz20">{{board.totalUnpaidSum | numFormat}}</h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>UNRECEIVED AMOUNT</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
        <el-row>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="teal">
                        <i class="material-icons">
                            person_add
                        </i>
                    </div>
                    <div class="card-content">
                        <p class="category">អតិថិជនប្រើប្រាស់</p>
                        <h3 class="card-title fz20">
                            {{formatter(board.totalFullCustomerSum -board.totalInActiveCustomerSum)}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL ACTIVE CUSTOMER</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">
                            person_add_disabled
                        </i>
                    </div>
                    <div class="card-content">
                        <p class="category" style="font-family: 'Khmer OS Battambang'">អតិថិជនមិនប្រើប្រាស់</p>
                        <h3 class="card-title fz20">
                            {{formatter(board.totalInActiveCustomerSum)}}
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL INACTIVE CUSTOMER</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">trending_up</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អត្រាប្រមូលបាន</p>
                        <h3 class="card-title fz20">
                            {{(board.totalInvoiceClosed/(board.totalFullCustomerSum -board.totalInActiveCustomerSum)) |
                            numFormatPercent}} %
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL COLLECTION RATIO</i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12 margin-bottom-50">
                <div class="card card-stats">
                    <div class="card-header" data-background-color="blue">
                        <i class="material-icons">trending_up</i>
                    </div>
                    <div class="card-content">
                        <p class="category">អត្រាអតិថិជនប្រើប្រាស់</p>
                        <h3 class="card-title fz20">
                            {{(board.totalFullCustomerSum -board.totalInActiveCustomerSum)/board.totalFullCustomerSum |
                            numFormatPercent}} %
                        </h3>
                    </div>
                    <div class="card-footer">
                        <div class="stats">
                            <!--<i class="material-icons">date_range</i> {{monthFormatter(month)}}-->
                            <i>TOTAL ACTIVE CUSTOMER RATIO</i>
                        </div>
                    </div>
                </div>
            </div>
        </el-row>
    </div>
</template>


<script>
    import BarChart from '/imports/vue/components/chart/Bar.vue';
    import Loader from '/imports/vue/ui/Loader.vue'
    import numeral from 'numeral';

    export default {
        components: {
            BarChart,
            Loader
        },
        created() {
            this.countCustomerSum();
            this.countFullCustomerSum();
            this.countInActiveCustomerSum();
            this.customerTransactionSum();
            this.countCustomerInPeriodSum();

        },
        mounted() {
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        },
        watch: {
            month(val) {

                this.countCustomerSum();
                this.countFullCustomerSum();
                this.countInActiveCustomerSum();
                this.customerTransactionSum();
                this.countCustomerInPeriodSum();
            }
        },
        methods: {
            monthFormatter(val) {
                return moment(val).format('MM/YYYY');
            },
            formatter(val) {
                return numeral(val).format('0,0');
            },

            countCustomerSum() {
                Meteor.call('dashboard_countCustomerSum', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalCustomerSum = result;
                    }
                });
            },
            countFullCustomerSum() {
                Meteor.call('dashboard_countFullCustomerSum', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalFullCustomerSum = result;
                    }
                });


            },
            countInActiveCustomerSum() {
                Meteor.call('dashboard_countInActiveCustomerSum', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalInActiveCustomerSum = result;
                    }
                });


            },
            countCustomerInPeriodSum() {
                Meteor.call('dashboard_countCustomerInPeriodSum', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalCustomerInPeriodSum = result;
                    }
                });

            },
            customerTransactionSum() {
                Meteor.call('dashboard_customerTransactionSum', this.month, Session.get('area'), (err, result) => {
                    if (!err) {
                        this.board.totalPostedSum = result.map((o) => o.posted);
                        this.board.totalPaymentSum = result.map((o) => o.paid); //convert payment to absolute value
                        this.board.totalUnpaidSum = result.map((o) => o.balance);
                        this.board.totalConsumptionSum = result.map((o) => o.totalConsumption);
                        this.board.totalInvoiceClosedSum = result.map((o) => o.totalInvoiceClosed);
                        this.board.totalQualityClosedSum = result.map((o) => o.totalQualityClosed);
                    }
                });
            },
        },
        data() {
            return {
                month: moment().toDate(),
                currentYear: moment().format('YYYY'),
                board: {

                    totalCustomerSum: 0,
                    totalPostedSum: 0,
                    totalPaymentSum: 0,
                    totalUnpaidSum: 0,
                    totalConsumptionSum: 0,
                    totalInvoiceClosedSum: 0,
                    totalQualityClosedSum: 0,
                    totalFullCustomerSum: 0,
                    totalInActiveCustomerSum: 0,
                    totalCustomerInPeriodSum: 0
                },
                loading: true,

            }
        }
    }
</script>
<style scoped>
    .fz20 {
        font-size: 20px;
    }
</style>